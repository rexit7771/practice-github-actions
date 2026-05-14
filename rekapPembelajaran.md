# 📚 Rekap Pembelajaran GitHub Actions

## 📖 Daftar Isi
1. [Pengenalan GitHub Actions](#pengenalan-github-actions)
2. [Konsep Dasar](#konsep-dasar)
3. [Tahap Pembelajaran](#tahap-pembelajaran)
4. [Pipeline CI/CD Lengkap](#pipeline-cicd-lengkap)
5. [Langkah Selanjutnya](#langkah-selanjutnya)

---

## Pengenalan GitHub Actions

**GitHub Actions** adalah alat otomatisasi yang memungkinkan Anda menjalankan skrip atau perintah secara otomatis sebagai respons terhadap *event* tertentu di repositori GitHub Anda.

### Apa yang Bisa Kita Lakukan?
- ✅ Menjalankan tes secara otomatis setiap kali ada `push`
- ✅ Membangun aplikasi (build)
- ✅ Membuat *package* atau **image Docker**
- ✅ Melakukan deployment otomatis
- ✅ Mengirim notifikasi
- ✅ Dan banyak lagi!

---

## Konsep Dasar

### 1. **Workflow**
File konfigurasi berformat YAML yang mendefinisikan otomatisasi Anda. Disimpan di folder `.github/workflows/`.

### 2. **Event** (Pemicu)
Kejadian yang memulai workflow. Contoh:
- `push`: Ketika kode di-push ke repositori
- `pull_request`: Ketika ada pull request baru
- `schedule`: Pada waktu tertentu (jadwal)

### 3. **Job** (Pekerjaan)
Serangkaian tugas yang berjalan di sebuah *runner* (server virtual). Beberapa job bisa berjalan paralel atau berurutan.

### 4. **Step** (Langkah)
Perintah atau aksi individual di dalam sebuah job. Bisa berupa:
- **`run`**: Menjalankan perintah shell
- **`uses`**: Menggunakan *action* yang sudah jadi (seperti `actions/checkout@v4`)

### 5. **Secrets** (Rahasia)
Kredensial atau token yang disimpan dengan aman. Tidak pernah ditampilkan di log atau kode.
- Contoh: `${{ secrets.DOCKERHUB_USERNAME }}`

---

## Tahap Pembelajaran

### ✅ Tahap 1: Workflow Dasar
**File**: `.github/workflows/learn-github-actions.yaml`

Kita membuat workflow sederhana yang:
- Dipicu setiap kali ada `push`
- Menampilkan "Hello, GitHub Actions!" di log

**Pembelajaran**: Struktur dasar workflow YAML dan cara menjalankan perintah shell.

---

### ✅ Tahap 2: Integrasi Node.js dan Express

**File**: `index.js`, `package.json`

Kita membuat:
1. **Aplikasi Express.js** - API sederhana dengan beberapa endpoint
   - `GET /` - Menampilkan pesan sambutan
   - `GET /api/greeting` - Menampilkan JSON message

2. **Workflow yang Diperbarui**
   - Setup lingkungan Node.js (versi `20.x` dan `22.x`)
   - Instalasi dependensi dengan `npm ci`
   - Menggunakan *caching* untuk mempercepat build

**Pembelajaran**: 
- Cara menggunakan action resmi seperti `actions/setup-node@v4`
- Konsep *matrix strategy* untuk menjalankan job di beberapa versi
- Optimisasi dengan caching

---

### ✅ Tahap 3: Testing Otomatis

**File**: `index.test.js`, `package.json` (skrip test)

Kita menambahkan:
1. **Jest** - Framework testing
2. **Supertest** - Library untuk menguji endpoint HTTP
3. **Unit tests** yang menguji endpoint API kita

**Workflow yang Diperbarui**:
- Menjalankan `npm test` sebagai bagian dari pipeline

**Pembelajaran**:
- Pentingnya testing otomatis
- Gerbang kualitas (quality gate) - kode yang gagal tes tidak lanjut ke tahap berikutnya
- Menjalankan test di CI environment

---

### ✅ Tahap 4: Containerisasi dengan Docker

**File**: `Dockerfile`, `.dockerignore`

Kita membuat:
1. **Dockerfile** - Resep untuk membangun image Docker
   - Menggunakan base image `node:20-alpine`
   - Menyalin file aplikasi
   - Menginstal dependensi produksi saja
   - Mendefinisikan perintah startup

2. **Workflow yang Diperbarui**:
   - Job baru `build-and-push-docker` yang membangun image
   - Job ini hanya berjalan jika testing berhasil (`needs: build-and-test`)

**Pembelajaran**:
- Containerisasi aplikasi untuk portabilitas
- Multi-stage building (implisit dengan `--only=production`)
- Dependency management antara build dan runtime

---

### ✅ Tahap 5: Publishing ke Docker Hub

**File**: `.github/workflows/learn-github-actions.yaml`

Kita menambahkan:
1. **GitHub Secrets**:
   - `DOCKERHUB_USERNAME` - Username Docker Hub Anda
   - `DOCKERHUB_TOKEN` - Access Token Docker Hub (bukan password)

2. **Workflow yang Diperbarui**:
   - Login ke Docker Hub dengan `docker/login-action@v3`
   - Build dan push image dengan `docker/build-push-action@v5`
   - Image otomatis di-tag dengan nama repositori Anda

**Pembelajaran**:
- Keamanan credential - tidak pernah hardcode password
- Cara menggunakan GitHub Secrets
- Publishing artefak ke registry (Docker Hub)
- Tagging konvensi untuk image Docker

---

## Pipeline CI/CD Lengkap

Berikut adalah alur kerja otomatis yang sekarang berjalan setiap kali Anda melakukan `push` ke branch `main`:

```
┌─────────────────────┐
│  push ke main       │
└──────────┬──────────┘
           │
           ▼
┌──────────────────────────────┐
│  JOB 1: build-and-test       │
│                              │
│  ✓ Checkout kode             │
│  ✓ Setup Node.js (2 versi)   │
│  ✓ Install dependencies      │
│  ✓ Run tests (npm test)      │
└──────────┬───────────────────┘
           │
    ┌──────▼──────┐
    │  Berhasil?  │
    └──────┬──────┘
           │ Ya
           ▼
┌──────────────────────────────────────┐
│  JOB 2: build-and-push-docker        │
│                                      │
│  ✓ Login ke Docker Hub               │
│  ✓ Build image Docker                │
│  ✓ Push ke Docker Hub                │
│    (dengan tag: username/repo:latest) │
└──────────────────────────────────────┘
           │
           └─▶ Image tersedia di Docker Hub
```

### Tahapan Demi Tahapan

#### **Tahap 1: Continuous Integration (CI)**

**Job**: `build-and-test`

1. **Checkout**: Kode terbaru diunduh dari repositori
2. **Setup Lingkungan**: Node.js disiapkan (versi 20.x dan 22.x)
3. **Instalasi**: Dependensi di-install dengan `npm ci`
4. **Testing**: `npm test` dijalankan
   - ✅ Jika tes **berhasil**: lanjut ke job berikutnya
   - ❌ Jika tes **gagal**: stop di sini, tidak lanjut ke deployment

---

#### **Tahap 2: Continuous Delivery (CD) - Build & Publish**

**Job**: `build-and-push-docker`

Prerequisite: Job `build-and-test` harus berhasil (`needs: build-and-test`)

1. **Autentikasi**: Login ke Docker Hub menggunakan secrets
   - Username dari `${{ secrets.DOCKERHUB_USERNAME }}`
   - Token dari `${{ secrets.DOCKERHUB_TOKEN }}`

2. **Build Image Docker**:
   - Membaca `Dockerfile`
   - Membangun image berdasarkan resep di dalamnya
   - Menambahkan semua file aplikasi ke dalam image

3. **Tag & Push**:
   - Memberi tag pada image: `username/practice-github-actions:latest`
   - Mendorong image ke Docker Hub
   - Image sekarang tersedia untuk di-download dan dijalankan di mana saja

---

### Keuntungan Pipeline Ini

| Aspek | Keuntungan |
|-------|-----------|
| **Kualitas** | Kode otomatis diuji sebelum packaging |
| **Otomatisasi** | Tidak perlu build dan push manual |
| **Konsistensi** | Semua environment menggunakan image Docker yang sama |
| **Kecepatan** | Dari push ke image di Docker Hub hanya dalam hitungan menit |
| **Keamanan** | Kredensial disimpan dalam secrets, tidak terekspos |
| **Portabilitas** | Image Docker dapat dijalankan di mana saja |

---

## Langkah Selanjutnya

### 📌 Langkah 6: Continuous Deployment ke Render.com (Opsional)

Untuk melengkapi CI/CD pipeline dengan deployment otomatis ke server:

1. **Buat akun di Render.com**
2. **Deploy aplikasi dari image Docker Hub Anda**
3. **Buat Deploy Hook** untuk memicu redeploy otomatis
4. **Simpan Deploy Hook ke GitHub Secrets** sebagai `RENDER_DEPLOY_HOOK`
5. **Tambahkan job ketiga** di workflow untuk memanggil deploy hook

Hasil akhirnya:
- Setiap `push` ke `main` otomatis di-**test**, di-**build**, di-**push ke Docker Hub**, dan di-**deploy ke server live**
- Pipeline CI/CD yang **sepenuhnya otomatis**

---

## 🎓 Skill yang Telah Dipelajari

### GitHub Actions
- ✅ Membuat dan mengedit workflow YAML
- ✅ Memahami events, jobs, dan steps
- ✅ Menggunakan built-in actions dan marketplace actions
- ✅ Menggunakan matrix strategy
- ✅ Menyimpan dan menggunakan secrets dengan aman
- ✅ Conditional job execution dengan `needs`

### Node.js & Express
- ✅ Membuat aplikasi Express.js sederhana
- ✅ Mendefinisikan routes dan endpoints
- ✅ Mengirim respons JSON

### Testing
- ✅ Menulis unit tests dengan Jest
- ✅ Menguji HTTP endpoints dengan Supertest
- ✅ Mengintegrasikan testing dalam CI pipeline

### Docker
- ✅ Menulis Dockerfile
- ✅ Memahami base image, layers, dan best practices
- ✅ Membangun image Docker dari kode
- ✅ Mempublikasikan image ke Docker Hub

### DevOps & CI/CD
- ✅ Memahami Continuous Integration (CI)
- ✅ Memahami Continuous Delivery (CD)
- ✅ Membuat pipeline yang terotomatisasi
- ✅ Gerbang kualitas dan dependency management

---

## 📝 File-File Penting

```
practice-github-actions/
├── .github/
│   └── workflows/
│       └── learn-github-actions.yaml    # Workflow utama
├── index.js                              # Aplikasi Express
├── index.test.js                         # Unit tests
├── Dockerfile                            # Docker config
├── .dockerignore                         # Files to ignore in Docker build
├── package.json                          # Node.js dependencies
├── package-lock.json                     # Locked versions
└── rekapPembelajaran.md                  # File ini
```

---

## 🚀 Kesimpulan

Anda telah berhasil membangun pipeline CI/CD yang profesional dan modern:
- ✅ Automated testing pada setiap push
- ✅ Automated Docker image building
- ✅ Automated publishing ke Docker Hub
- ✅ Credential management yang aman

Ini adalah praktik terbaik (best practices) yang digunakan di industri untuk memastikan kualitas kode dan deployment yang reliable.

**Selamat atas pencapaiannya! 🎉**
