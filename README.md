# AI WhatsApp Assistant

Bot WhatsApp sederhana berbasis Node.js yang menerima pesan masuk, mengirim prompt ke Ollama, lalu membalas hasilnya ke WhatsApp.

## Requirements

- Node.js 18 atau lebih baru
- npm
- Ollama sudah terpasang dan berjalan di lokal
- Akun WhatsApp untuk scan QR login

## Project Structure

- `index.js` sebagai entry point
- `whatsapp.js` untuk koneksi WhatsApp via Baileys
- `ollama.js` untuk request ke API Ollama
- `.env` untuk konfigurasi model dan URL Ollama

## Environment Variables

Project ini memakai variabel berikut:

```env
OLLAMA_URL=http://localhost:11434
MODEL=llama3
```

Disarankan buat file `.env` dengan isi seperti di atas.

## Install Dependencies

Jalankan:

```bash
npm install
```

## Menjalankan Ollama

Pastikan service Ollama aktif, lalu pull model yang ingin dipakai jika belum tersedia:

```bash
ollama pull llama3
```

Lalu pastikan Ollama berjalan di:

```bash
http://localhost:11434
```

## Running Project

1. Install dependency dengan `npm install`
2. Pastikan Ollama sudah aktif
3. Pastikan file `.env` sudah terisi dengan benar
4. Jalankan bot:

```bash
node index.js
```

5. Saat QR muncul di terminal, scan dengan akun WhatsApp
6. Setelah terkoneksi, bot akan membalas pesan masuk menggunakan response dari Ollama

## Login Session

Session WhatsApp akan disimpan di folder `auth/` setelah login pertama. Folder ini sudah dimasukkan ke `.gitignore` dan tidak perlu di-commit.

## Notes

- Jika model di `.env` tidak tersedia di Ollama, request akan gagal
- Jika Ollama tidak aktif, bot akan membalas dengan `Error contacting AI`
- Saat koneksi WhatsApp terputus dan belum logout, bot akan mencoba reconnect otomatis

## Run Again

Setelah pernah login sekali, biasanya cukup jalankan ulang:

```bash
node index.js
```

Tanpa perlu scan QR lagi selama session `auth/` masih valid.
