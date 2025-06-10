# POMONADE: A POMONADE TIMER🍋
## Kelompok 12:
* Silfia Mei Wulandari (5026221073)
* Widyantari Nuriyanti (5026221137)
* Sheva Aulia (5026221145)

![Screenshot](screenshot.png)

## Deskripsi Aplikasi
Aplikasi timer dengan menerapkan metode pomodoro yaitu 25 menit bekerja secara aktif serta istirahat antar sesi. Waktu istirahat dapat dipilih sesuai dengan kebutuhan pengguna, terdapat pilihan Istirahat Sebentar dan Istirahat Lama. 

Aplikasi ini diambil melalui forking source pada github https://github.com/luizbatanero/pomodoro-react. Perubahan fitur yang dilakukan adalah menambahkan custom lama waktu untuk bekerja secara aktif sehingga bisa disesuaikan dengan keinginan pengguna.

## Tools yang Digunakan
Kami memanfaatkan alat-alat berikut untuk membuat Pipeline CI/CD yang baik untuk Pomonode:

### AWS (Amazon Web Services)
AWS (Amazon Web Services) bisa digunakan untuk menjalankan aplikasi yang sudah dibuat dalam bentuk container, seperti yang ada di Docker Hub. Setelah aplikasi dikirim ke Docker Hub, AWS lewat layanan bernama ECS (Elastic Container Service) bisa mengambil aplikasi itu dan menjalankannya di server milik AWS. Dengan cara ini, kita bisa menjalankan aplikasi tanpa perlu mengatur server secara manual, dan AWS bisa membantu mengatur jalannya aplikasi supaya tetap lancar.

### GitHub Actions
GitHub Actions adalah fitur otomatisasi terintegrasi dalam platform GitHub yang dirancang untuk mengotomatisasi alur kerja pengembangan perangkat lunak secara langsung dari repositori. Fungsinya mencakup dukungan untuk Continuous Integration (CI), seperti eksekusi pengujian otomatis dan pemeriksaan kualitas kode, serta Continuous Deployment (CD) guna mengotomatiskan proses pengiriman aplikasi. Lebih lanjut, GitHub Actions juga sangat efektif untuk manajemen rilis, pembaruan dokumentasi, dan berbagai tugas repetitif lainnya. Setiap kali terjadi perubahan pada kode, misalnya melalui commit atau pull request, sebuah proses otomatis akan terpicu untuk melakukan build, pengujian, dan distribusi aplikasi. 

### ESLint
ESLint adalah alat penting yang berfungsi untuk memeriksa dan memperbaiki kode JavaScript secara statis, memastikan kode tetap rapi dan bebas dari kesalahan. Dengan ESLint, pengembang dapat memastikan kode mengikuti standar dan aturan tertentu, serta mencegah potensi bug sejak tahap awal pengembangan. Di proyek pomonade, pemanfaatan ESLint diintegrasikan langsung pada pipeline CI/CD. Hal ini sangat krusial karena setiap perubahan kode akan secara otomatis melalui pemeriksaan kualitas oleh ESLint, sehingga kami dapat menjaga konsistensi dan kualitas kode secara berkelanjutan di seluruh proyek.

### Vitest
Vitest adalah sebuah framework pengujian (testing) modern berbasis JavaScript yang dirancang untuk performa tinggi dan kompatibilitas yang luas, terutama dalam ekosistem Vite. Dengan integrasi yang mulus terhadap proyek Vite, Vitest membantu memastikan bahwa kode aplikasi berjalan sesuai harapan dan tetap stabil dalam setiap iterasi pengembangan.

### Docker
Docker merupakan sebuah platform containerization untuk membuat, mendistribusikan, dan menjalankan aplikasi dalam wadah (container) yang portabel, konsisten, dan terisolasi. Dengan menggunakan Docker, aplikasi beserta dependensinya dapat dikemas menjadi satu kesatuan yang dapat dijalankan di berbagai lingkungan, baik pada perangkat lokal, server cloud, maupun infrastruktur lainnya, tanpa perlu melakukan pengaturan ulang yang kompleks. Hal ini juga mengurangi risiko terjadinya ketidakcocokan environtment, antar device karena seluruh eksekusi aplikasi dilakukan pada lingkungan yang sama secara konsisten. Berikut ini adalah kode dari dockerfile dan hasilnya yaitu docker image

## Tahap Pengembangan (CI/CD Pipeline)
Alur kerja CI/CD kami mengotomatiskan proses pembuatan, pengujian, dan penerapan Pomonode. Berikut ini adalah uraian langkah-langkah utama:

### AWS Setup
1. Buat Pengguna IAM untuk GitHub Actions
Untuk memungkinkan GitHub Actions berinteraksi dengan AWS, kami membuat pengguna IAM khusus:
* Masuk ke Konsol AWS > IAM > Pengguna (Users) > Tambahkan pengguna (Add users).
* Beri nama (e.g., DevOpsPomo).
* Pilih Akses terprogram (Programmatic access).
* Lampirkan kebijakan:
  * AmazonEC2ContainerRegistryPowerUser
  * AmazonECS_FullAccess
  * IAMReadOnlyAccess
* Selesaikan pembuatan pengguna, lalu catat Access Key ID dan Secret Access Key.
  
2. Membuat Peran pada Layanan ECS
Peran IAM dibuat agar ECS dapat menjalankan tugas:
* Masuk ke Konsol AWS > IAM > Peran (Roles) > Buat peran (Create role).
* Pilih Layanan AWS (AWS Service) as the trusted entity.
* Cari dan pilih "Elastic Container Service".
* Lanjutkan dan buat peran. Pastikan namanya otomatis menjadi AWSServiceRoleForECS.

3. Membuat Klaster ECS
Klaster ECS berfungsi sebagai pengelompokan logis untuk layanan kami:
* Masuk ke Konsol AWS > ECS > Kluster (Clusters) > Buat Kluster (Create Cluster).
Pilih template "AWS Fargate".
* Beri Nama kluster yang persis sama dengan ECS_CLUSTER_NAME di cicd.yml (misal devopspomo-cluster).
* Biarkan pengaturan VPC default.
* Selesaikan pembuatan kluster.

4. Membuat Definisi Tugas (Task Definition) ECS
Definisi tugas menjelaskan bagaimana aplikasi kita berjalan di ECS:
* Masuk ke Konsol AWS > ECS > Definisi Tugas (Task Definitions) > Buat definisi tugas baru (Create new Task Definition).
* Pilih "Fargate".
* Beri Nama definisi tugas yang persis sama dengan ECS_SERVICE_NAME di cicd.yml (misal devopspomo-service).
* Peran Eksekusi Tugas: Pilih "Buat peran baru" (akan membuat ecsTaskExecutionRole).
* Ukuran Tugas: Pilih 0.5GB memori dan 0.25 vCPU.
* Tambahkan Kontainer:
  * Nama kontainer: Persis sama dengan CONTAINER_NAME di main-pipeline.yml (misal devopspomo-container).
  * Image: Masukkan URI image Docker Hub publik ( widyantari/pomonade:latest).
  * Port mappings: 80 (untuk Nginx).
  * Selesaikan pembuatan definisi tugas.

5. Membuat Layanan ECS (Service) dan Application Load Balancer (ALB)
Layanan ECS mempertahankan jumlah tugas yang diinginkan, dan ALB mendistribusikan lalu lintas masuk:
* Dari halaman ringkasan Definisi Tugas yang baru dibuat, klik "Buat Layanan" (Create Service).
* Langkah 1: Konfigurasi Layanan:
  * Kluster: Pilih kluster (devopspomo-cluster).
  * Jenis Peluncuran: "Fargate".
  * Definisi Tugas: Pilih definisi tugas yang baru dibuat (devopspomo-service:revisi_terbaru).
  * Nama Layanan: Persis sama dengan ECS_SERVICE_NAME di main-pipeline.yml (misal devopspomo-service).
  * Jumlah Tugas yang diinginkan: 1.
* Langkah 2: Konfigurasi Jaringan:
  * VPC: VPC default.
  * Subnet: Pilih setidaknya dua subnet publik.
  * Grup keamanan (Security Group): Buat grup keamanan baru (misal devopspomo-sg), atur aturan   * masuk HTTP port 80 dari 0.0.0.0/0.
  * Penyeimbang Beban (Load Balancing): Pilih "Application Load Balancer".
  * Nama penyeimbang beban: Buat baru (devopspomo-alb).
  * Grup target untuk penyeimbang beban: Buat grup target baru (misal devopspomo-tg), atur protokol HTTP port 80.
* Langkah 3: Atur Autoscaling: Pilih "Jangan konfigurasikan penskalaan otomatis".
  
Runs the app in development mode.<br>
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

## PSO A
