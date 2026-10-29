// Semua konten proyek berasal dari projects.yml dan automation.yml,
// jadi menambah proyek cukup dengan mengedit file YAML tersebut.

const loadYaml = (path) => fetch(path).then((r) => r.text()).then((t) => jsyaml.load(t));

function el(tag, attrs = {}, children = []) {
  const node = document.createElement(tag);
  for (const [k, v] of Object.entries(attrs)) {
    if (k === 'class') node.className = v;
    else if (k === 'text') node.textContent = v;
    else node.setAttribute(k, v);
  }
  node.append(...children);
  return node;
}

const tags = (list = []) => el('ul', { class: 'tags' }, list.map((t) => el('li', { text: t })));

const LINK_LABEL = { demo: 'Demo langsung', repo: 'Kode', report: 'Laporan' };

function projectCard(p) {
  const links = Object.entries(p.links || {}).map(([k, href]) =>
    el('a', { href, target: '_blank', rel: 'noopener', text: `${LINK_LABEL[k] || k} →` })
  );
  return el('article', { class: `card${p.featured ? ' featured' : ''}`, id: `p-${p.id}`, 'data-cat': p.category }, [
    el('img', { src: p.image, alt: p.title, loading: 'lazy' }),
    el('div', { class: 'body' }, [
      el('span', { class: 'cat', text: p.category }),
      el('h3', { text: p.title }),
      el('p', { class: 'question', text: p.question }),
      el('p', { class: 'summary', text: p.summary }),
      tags(p.tools),
      el('div', { class: 'links' }, links)
    ])
  ]);
}

function renderProjects(projects) {
  const list = document.getElementById('project-list');
  list.replaceChildren(...projects.map(projectCard));

  const cats = ['Semua', ...new Set(projects.map((p) => p.category))];
  const filters = document.getElementById('filters');
  filters.replaceChildren(...cats.map((c, i) => {
    const chip = el('button', { class: `chip${i === 0 ? ' active' : ''}`, type: 'button', text: c });
    chip.onclick = () => {
      filters.querySelectorAll('.chip').forEach((x) => x.classList.toggle('active', x === chip));
      list.querySelectorAll('.card').forEach((card) => {
        card.hidden = c !== 'Semua' && card.dataset.cat !== c;
      });
    };
    return chip;
  }));
}

function renderAutomation(items) {
  document.getElementById('automation-list').replaceChildren(...items.map((a) =>
    el('article', { class: 'card auto' }, [
      el('h3', {}, [el('a', { href: a.link, target: '_blank', rel: 'noopener', text: a.title })]),
      el('p', { text: a.description }),
      tags(a.tools)
    ])
  ));
}

function renderMap(projects) {
  const located = projects.filter((p) => Array.isArray(p.location));
  const map = new maplibregl.Map({
    container: 'map',
    style: 'https://tiles.openfreemap.org/styles/positron',
    center: [110.42, -7.0],
    zoom: 10.5,
    cooperativeGestures: true
  });
  map.addControl(new maplibregl.NavigationControl({ showCompass: false }), 'top-right');

  for (const p of located) {
    const dot = el('button', { class: 'map-dot', 'aria-label': p.title, type: 'button' });
    const popup = new maplibregl.Popup({ offset: 12, closeButton: false }).setDOMContent(
      el('div', {}, [el('b', { text: p.title }), el('br'), el('a', { href: `#p-${p.id}`, text: 'Lihat proyek →' })])
    );
    new maplibregl.Marker({ element: dot }).setLngLat(p.location).setPopup(popup).addTo(map);
  }

  if (located.length > 1) {
    const b = new maplibregl.LngLatBounds();
    located.forEach((p) => b.extend(p.location));
    map.fitBounds(b, { padding: 80, maxZoom: 12, duration: 0 });
  }
}

// Sorot kartu saat dibuka dari popup peta
window.addEventListener('hashchange', () => {
  document.querySelectorAll('.card.highlight').forEach((c) => c.classList.remove('highlight'));
  const card = document.querySelector(location.hash);
  if (card?.classList.contains('card')) {
    card.hidden = false;
    card.classList.add('highlight');
  }
});

document.getElementById('year').textContent = new Date().getFullYear();

Promise.all([loadYaml('projects.yml'), loadYaml('automation.yml')]).then(([projects, automation]) => {
  renderProjects(projects);
  renderAutomation(automation);
  renderMap(projects);
});
