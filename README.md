# Portfolio Arsya Dika

Situs portfolio GIS & WebGIS. Satu halaman statis, tanpa proses build.

## Menambah atau mengubah proyek

1. Simpan gambar preview di `assets/img/`.
2. Tambahkan satu blok di `projects.yml` (format dijelaskan di bagian atas file).
3. Commit dan push. GitHub Pages memperbarui situs dalam 1–2 menit.

Script dan workflow di bagian "Otomasi" diatur lewat `automation.yml`.

## Menjalankan lokal

```bash
python -m http.server 8000
# buka http://localhost:8000
```

## Teknologi

HTML, CSS, JavaScript · MapLibre GL JS · js-yaml · OpenFreeMap
