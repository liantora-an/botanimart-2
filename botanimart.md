Dokumen Perencanaan Pengembangan E-Commerce: Botani Mart

Tujuan Sistem: Membangun platform e-commerce berkinerja tinggi yang skalabel untuk penjualan tanaman, mencakup antarmuka pengguna (pembeli), dasbor manajemen (admin), dan integrasi pembayaran otomatis.
Stack Teknologi Utama: * Frontend & Fullstack Framework: Next.js (App Router)

    Styling: Sesuai desain Figma (komponen diekstrak ke dalam utilitas CSS/Tailwind)

    Database & Authentication: Supabase (PostgreSQL & Supabase Auth)

    Payment Gateway: Midtrans (Snap API & Webhook)

1. Standar Arsitektur Sistem (Penting)

Proyek ini wajib menggunakan Layered Architecture yang dipisahkan secara ketat untuk menjaga kebersihan kode dan skalabilitas:

    Types/Models (types/): Hanya berisi definisi antarmuka (Interface) dan tipe data TypeScript dari skema database.

    Repository (repositories/): Layer Data Access. Semua operasi CRUD langsung ke Supabase (query database mentah) hanya boleh ditulis di sini.

    Service (services/): Layer Business Logic. Menangani validasi, kalkulasi, pemrosesan data, dan komunikasi dengan API pihak ketiga (seperti Midtrans) sebelum atau sesudah memanggil Repository.

    Controller/Route Handlers (controllers/ & app/api/): Layer pengatur Request/Response HTTP dan Webhook.

2. Skema Database (Supabase PostgreSQL)

Buat tabel relasional berikut:

    users: Ekstensi dari Supabase Auth. Kolom utama: id, email, role (User/Admin), created_at.

    plants: Data katalog. Kolom utama: id, name, description, price, stock, image_url (terhubung ke Supabase Storage), is_recommended (boolean), created_at.

    carts: Keranjang sementara. Kolom utama: id, user_id, plant_id, quantity.

    orders: Transaksi utama. Kolom utama: id, user_id, total_amount, status (Pending / Settlement / Expire / Cancel), midtrans_transaction_id, snap_token, created_at.

    order_items: Rincian item yang dibeli. Kolom utama: id, order_id, plant_id, price_at_purchase, quantity.

3. Struktur Direktori Proyek Utama

Terapkan struktur folder berikut secara presisi:
Plaintext

project/
├── app/                        // RUTE FRONTEND (Next.js App Router)
│   ├── (auth)/
│   │   ├── login/page.tsx
│   │   └── register/page.tsx
│   ├── (user)/
│   │   ├── akun/page.tsx       // Riwayat transaksi
│   │   ├── keranjang/page.tsx  // Tinjauan keranjang & Tombol Checkout
│   │   └── toko/page.tsx       // Katalog utama
│   ├── admin/
│   │   ├── page.tsx            // Dasbor pemantauan pesanan
│   │   └── tanaman/page.tsx    // CRUD & Stok
│   ├── api/
│   │   └── webhooks/
│   │       └── midtrans/route.ts // Endpoint notifikasi Midtrans
│   ├── layout.tsx
│   └── page.tsx                // Beranda (Rekomendasi & Tanaman Terbaru)
│
├── components/                 // KOMPONEN UI REUSABLE
│   ├── layout/                 // Navbar, Footer, Sidebar
│   ├── toko/                   // Product Card, Search
│   ├── keranjang/              // Cart Item, Checkout Summary
│   └── admin/                  // Data Table, Form, Modal
│
├── backend/                    // LOGIKA BACKEND (Layered Architecture)
│   ├── config/
│   │   ├── supabase.ts         // Kredensial Supabase
│   │   └── midtrans.ts         // Kredensial Midtrans Client/Server Key
│   ├── controllers/
│   │   ├── auth.controller.ts
│   │   ├── cart.controller.ts
│   │   ├── catalog.controller.ts
│   │   ├── order.controller.ts
│   │   └── payment.controller.ts
│   ├── services/
│   │   ├── auth.service.ts
│   │   ├── cart.service.ts
│   │   ├── catalog.service.ts
│   │   ├── order.service.ts
│   │   └── payment.service.ts  // Logika Snap Token & Validasi Signature Webhook
│   ├── repositories/
│   │   ├── cart.repository.ts
│   │   ├── catalog.repository.ts
│   │   └── order.repository.ts
│   ├── middlewares/
│   │   └── auth.middleware.ts  // Proteksi akses route berbasis Role (Admin/User)
│   └── types/
│       └── index.ts            // Definisi Model TypeScript
│
├── lib/
│   └── supabase/
│       ├── client.ts           // Inisialisasi Supabase sisi klien
│       └── server.ts           // Inisialisasi Supabase sisi server
│
├── public/                     // Aset statis & file gambar default
└── middleware.ts               // Next.js Edge Middleware

4. Alur Kerja Fitur (User Journey)
A. Alur Pengguna (User)

    Akses & Otentikasi: Pengguna mendaftar/masuk via Supabase Auth. Akses ke /keranjang dan /akun diproteksi middleware.

    Eksplorasi: Halaman Beranda memanggil catalog.repository.ts untuk menampilkan tanaman is_recommended=true dan urutan data terbaru. Katalog lengkap ada di halaman Toko.

    Keranjang Belanja: Interaksi penambahan tanaman disimpan ke tabel carts melalui cart.service.ts.

    Checkout & Pembayaran (Midtrans):

        Pengguna klik "Bayar".

        order.service.ts memindahkan isi carts ke orders dan order_items (status pending), lalu mengosongkan carts.

        payment.service.ts mengirim request ke Midtrans, mendapatkan Snap Token, dan menyimpannya di tabel orders.

        Antarmuka menampilkan popup Midtrans Snap Pay.

B. Alur Webhook (Otomatisasi Pembayaran)

    Midtrans mengirim HTTP POST request ke /api/webhooks/midtrans saat pengguna selesai mentransfer dana.

    payment.controller.ts memverifikasi Signature Key demi keamanan.

    Jika status dari Midtrans adalah settlement, panggil order.repository.ts untuk mengubah status pesanan menjadi lunas, dan kurangi stock tanaman secara otomatis di tabel plants.

C. Alur Admin (Manajemen)

    Proteksi Area: Rute /app/admin hanya dapat dirender jika sesi pengguna memiliki atribut role === 'Admin'.

    Manajemen Data: Melalui dasbor Admin, fungsi CRUD dilakukan. Penambahan gambar diunggah ke Supabase Storage, dan URL gambar di-insert ke tabel plants.

    Pantauan Pesanan: Admin memantau daftar pesanan dari tabel orders. Fokus utama adalah menyiapkan barang untuk pesanan yang statusnya sudah settlement (terbayar otomatis lewat Webhook).