# POMONADE: A POMONADE TIMER🍋

## Kelompok 12:

- Silfia Mei Wulandari (5026221073)
- Widyantari Nuriyanti (5026221137)
- Sheva Aulia (5026221145)

![Screenshot](screenshot.png)

## Deskripsi Aplikasi

Aplikasi timer dengan menerapkan metode pomodoro yaitu 25 menit bekerja secara aktif serta istirahat antar sesi. Waktu istirahat dapat dipilih sesuai dengan kebutuhan pengguna, terdapat pilihan Istirahat Sebentar dan Istirahat Lama.

Aplikasi ini diambil melalui forking source pada github https://github.com/luizbatanero/pomodoro-react. Perubahan fitur yang dilakukan adalah menambahkan custom lama waktu untuk bekerja secara aktif sehingga bisa disesuaikan dengan keinginan pengguna.

## Tools yang Digunakan

Kami memanfaatkan tools berikut dalam membuat Pipeline CI/CD untuk aplikasi Pomonode:
- AWS (Amazon Web Services): Menjalankan aplikasi container dari Docker Hub via ECS tanpa perlu mengatur server manual. Mendukung deployment yang scalable dan terkelola.
- GitHub Actions: Otomatisasi CI/CD langsung dari GitHub. Memicu build, test, dan deployment setiap ada commit atau pull request.
- ESLint: Linter untuk kode JavaScript. Menjaga kualitas dan konsistensi kode dengan deteksi error otomatis di pipeline CI/CD.
- Vitest: Framework testing modern untuk proyek berbasis Vite. Memastikan kestabilan dan kebenaran fungsi aplikasi.
- Docker: Platform untuk membungkus aplikasi dan dependensinya dalam container yang portabel dan konsisten. Menghindari masalah perbedaan environment.
- AWS CloudWatch: Layanan monitoring dari AWS untuk mengawasi metrik, log, dan performa aplikasi serta infrastruktur. Membantu mendeteksi error, memantau resource, dan mengatur notifikasi otomatis bila terjadi gangguan.

## Tahap Pengembangan (CI/CD Pipeline)

Alur kerja CI/CD kami mengotomatiskan proses pembuatan, pengujian, dan penerapan Pomonode. Berikut ini adalah uraian langkah-langkah utama:

### AWS Setup

1. Buat Pengguna IAM untuk GitHub Actions
   Untuk memungkinkan GitHub Actions berinteraksi dengan AWS, kami membuat pengguna IAM khusus:

- Masuk ke Konsol AWS > IAM > Pengguna (Users) > Tambahkan pengguna (Add users).
- Beri nama (e.g., DevOpsPomo).
- Pilih Akses terprogram (Programmatic access).
- Lampirkan kebijakan:
  - AmazonEC2ContainerRegistryPowerUser
  - AmazonECS_FullAccess
  - IAMReadOnlyAccess
- Selesaikan pembuatan pengguna, lalu catat Access Key ID dan Secret Access Key.

2. Membuat Peran pada Layanan ECS
   Peran IAM dibuat agar ECS dapat menjalankan tugas:

- Masuk ke Konsol AWS > IAM > Peran (Roles) > Buat peran (Create role).
- Pilih Layanan AWS (AWS Service) as the trusted entity.
- Cari dan pilih "Elastic Container Service".
- Lanjutkan dan buat peran. Pastikan namanya otomatis menjadi AWSServiceRoleForECS.

3. Membuat Klaster ECS
   Klaster ECS berfungsi sebagai pengelompokan logis untuk layanan kami:

- Masuk ke Konsol AWS > ECS > Kluster (Clusters) > Buat Kluster (Create Cluster).
  Pilih template "AWS Fargate".
- Beri Nama kluster yang persis sama dengan ECS_CLUSTER_NAME di cicd.yml (misal devopspomo-cluster).
- Biarkan pengaturan VPC default.
- Selesaikan pembuatan kluster.

4. Membuat Definisi Tugas (Task Definition) ECS
   Definisi tugas menjelaskan bagaimana aplikasi kita berjalan di ECS:

- Masuk ke Konsol AWS > ECS > Definisi Tugas (Task Definitions) > Buat definisi tugas baru (Create new Task Definition).
- Pilih "Fargate".
- Beri Nama definisi tugas yang persis sama dengan ECS_SERVICE_NAME di cicd.yml (misal devopspomo-service).
- Peran Eksekusi Tugas: Pilih "Buat peran baru" (akan membuat ecsTaskExecutionRole).
- Ukuran Tugas: Pilih 0.5GB memori dan 0.25 vCPU.
- Tambahkan Kontainer:
  - Nama kontainer: Persis sama dengan CONTAINER_NAME di main-pipeline.yml (misal devopspomo-container).
  - Image: Masukkan URI image Docker Hub publik ( widyantari/pomonade:latest).
  - Port mappings: 80 (untuk Nginx).
  - Selesaikan pembuatan definisi tugas.

5. Membuat Layanan ECS (Service) dan Application Load Balancer (ALB)
   Layanan ECS mempertahankan jumlah tugas yang diinginkan, dan ALB mendistribusikan lalu lintas masuk:

- Dari halaman ringkasan Definisi Tugas yang baru dibuat, klik "Buat Layanan" (Create Service).
- Langkah 1: Konfigurasi Layanan:
  - Kluster: Pilih kluster (devopspomo-cluster).
  - Jenis Peluncuran: "Fargate".
  - Definisi Tugas: Pilih definisi tugas yang baru dibuat (devopspomo-service:revisi_terbaru).
  - Nama Layanan: Persis sama dengan ECS_SERVICE_NAME di main-pipeline.yml (misal devopspomo-service).
  - Jumlah Tugas yang diinginkan: 1.
- Langkah 2: Konfigurasi Jaringan:
  - VPC: VPC default.
  - Subnet: Pilih setidaknya dua subnet publik.
  - Grup keamanan (Security Group): Buat grup keamanan baru (misal devopspomo-sg), atur aturan \* masuk HTTP port 80 dari 0.0.0.0/0.
  - Penyeimbang Beban (Load Balancing): Pilih "Application Load Balancer".
  - Nama penyeimbang beban: Buat baru (devopspomo-alb).
  - Grup target untuk penyeimbang beban: Buat grup target baru (misal devopspomo-tg), atur protokol HTTP port 80.
- Langkah 3: Atur Autoscaling: Pilih "Jangan konfigurasikan penskalaan otomatis".

Runs the app in development mode.<br>
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

## PSO A
