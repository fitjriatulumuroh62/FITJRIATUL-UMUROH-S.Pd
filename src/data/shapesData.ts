import { ShapeId, ShapeMaterial } from '../types/learning';

export const SHAPES_LIST: ShapeMaterial[] = [
  {
    id: 'kubus',
    name: 'Kubus',
    shortTag: '6 Sisi Persegi Sama Besar',
    definition:
      'Kubus adalah bangun ruang tiga dimensi yang dibatasi oleh enam buah sisi berbentuk persegi yang semuanya sama ukuran dan saling kongruen.',
    characteristics: [
      'Memiliki 6 sisi berbentuk persegi yang ukurannya sama persis.',
      'Memiliki 12 rusuk yang panjangnya sama semua.',
      'Memiliki 8 titik sudut yang masing-masing membentuk sudut siku-siku (90°).',
      'Sisi yang berhadapan selalu sejajar dan sama luas.',
    ],
    facesCount: '6 sisi persegi',
    edgesCount: '12 rusuk sama panjang',
    verticesCount: '8 titik sudut',
    surfaceAreaFormula: 'L = 6 × s × s = 6 × s²',
    surfaceAreaExplanation:
      's = panjang rusuk kubus. Karena ada 6 persegi yang sama luas, luas satu persegi (s × s) dikalikan 6.',
    volumeFormula: 'V = s × s × s = s³',
    volumeExplanation:
      's = panjang rusuk kubus. Volume kubus adalah luas alas (s × s) dikalikan tingginya (s).',
    everydayObjects: [
      { name: 'Kubus Rubik', detail: 'Mainan asah otak dengan 6 sisi warna berbeda.' },
      { name: 'Dadu Permainan', detail: 'Bentuk kubus kecil dengan titik angka 1 sampai 6.' },
      { name: 'Kotak Kado Persegi', detail: 'Wadah hadiah yang panjang, lebar, dan tingginya sama.' },
      { name: 'Es Batu Cetakan', detail: 'Balok es kecil berbentuk kubus untuk minuman.' },
    ],
    exampleProblem: {
      title: 'Kotak Kado Ulang Tahun Beni',
      story:
        'Beni ingin membungkus kotak kado berbentuk kubus dengan kertas kado. Panjang setiap rusuk kotak kado adalah 12 cm. Berapakah luas minimal kertas kado yang dibutuhkan Beni, dan berapa volume kotak tersebut?',
      steps: {
        memahami:
          'Diketahui: Kotak kado berbentuk kubus dengan panjang rusuk s = 12 cm. Ditanyakan: Luas minimal kertas kado (luas permukaan) dan volume kotak.',
        merumuskan:
          'Karena seluruh 6 permukaan kotak akan dibungkus, gunakan rumus luas permukaan kubus L = 6 × s² dan volume V = s³.',
        menggunakan:
          'Luas permukaan = 6 × 12 × 12 = 6 × 144 = 864 cm². Volume = 12 × 12 × 12 = 1.728 cm³.',
        menafsirkan:
          'Beni membutuhkan minimal 864 cm² kertas kado agar seluruh sisi kotak tertutup rapat, dan ruang di dalam kotak memuat 1.728 cm³.',
        mengevaluasi:
          'Rumus sudah sesuai karena kotak kado tertutup di semua 6 sisi. Satuan luas (cm²) dan volume (cm³) tepat, dan angka 864 cm² wajar (sekitar ukuran kertas sampul buku tulis).',
      },
    },
    defaultDimensions: { p: 4, l: 4, t: 4, r: 2 },
    parts: {
      alas: {
        id: 'alas',
        label: 'Sisi Alas (Bawah)',
        description:
          'Permukaan paling bawah kubus yang berbentuk persegi. Luasnya sama dengan sisi-sisi lainnya (s × s).',
        roleInFormula: 'Sebagai dasar perhitungan volume: Volume = Luas Alas × Tinggi.',
      },
      tutup: {
        id: 'tutup',
        label: 'Sisi Tutup (Atas)',
        description:
          'Permukaan paling atas kubus yang sejajar dan sama besar dengan sisi alas.',
        roleInFormula: 'Jika kubus tanpa tutup (misal bak mandi terbuka), maka luas permukaan menjadi 5 × s².',
      },
      sisi: {
        id: 'sisi',
        label: 'Sisi Tegak Kubus',
        description:
          'Keempat dinding tegak kubus yang masing-masing berbentuk persegi dengan luas s × s.',
        roleInFormula: 'Semua 6 sisi kubus memiliki ukuran sama, sehingga L = 6 × s².',
      },
      rusuk: {
        id: 'rusuk',
        label: 'Rusuk Kubus (s)',
        description:
          'Garis pertemuan antara dua sisi kubus. Kubus memiliki 12 rusuk yang panjangnya sama.',
        roleInFormula: 'Ukuran panjang rusuk (s) menjadi kunci menghitung volume dan luas permukaan.',
      },
      titikSudut: {
        id: 'titikSudut',
        label: 'Titik Sudut',
        description:
          'Titik pojok tempat bertemunya 3 rusuk kubus. Kubus memiliki 8 titik sudut.',
        roleInFormula: 'Menjaga bentuk kubus tetap tegak bersudut siku-siku 90°.',
      },
      tinggi: {
        id: 'tinggi',
        label: 'Garis Tinggi Kubus',
        description:
          'Jarak tegak lurus antara sisi alas dan sisi tutup, panjangnya sama dengan rusuk (s).',
        roleInFormula: 'Dalam V = s × s × s, tinggi kubus bernilai sama dengan panjang dan lebarnya.',
      },
    },
  },
  {
    id: 'balok',
    name: 'Balok',
    shortTag: 'Panjang, Lebar, Tinggi Berbeda',
    definition:
      'Balok adalah bangun ruang yang dibatasi oleh 6 sisi berbentuk persegi panjang (atau kombinasi persegi dan persegi panjang) di mana sisi yang berhadapan sejajar dan sama besar.',
    characteristics: [
      'Memiliki 6 sisi berbentuk persegi panjang (3 pasang sisi berhadapan yang sama besar).',
      'Memiliki 12 rusuk yang terdiri dari 4 rusuk panjang (p), 4 rusuk lebar (l), dan 4 rusuk tinggi (t).',
      'Memiliki 8 titik sudut yang masing-masing siku-siku (90°).',
      'Sisi alas dan sisi tutup memiliki bentuk dan luas yang sama.',
    ],
    facesCount: '6 sisi persegi panjang',
    edgesCount: '12 rusuk (4p, 4l, 4t)',
    verticesCount: '8 titik sudut',
    surfaceAreaFormula: 'L = 2 × (p×l + p×t + l×t)',
    surfaceAreaExplanation:
      'p = panjang, l = lebar, t = tinggi. Ada 3 pasang sisi yang berhadapan: alas-tutup (p×l), depan-belakang (p×t), dan kiri-kanan (l×t).',
    volumeFormula: 'V = p × l × t',
    volumeExplanation:
      'Volume balok diperoleh dengan mengalikan luas alas (p × l) dengan tingginya (t).',
    everydayObjects: [
      { name: 'Akuarium Kaca', detail: 'Wadah ikan berbentuk balok (biasanya tanpa tutup).' },
      { name: 'Kardus Paket / Buku', detail: 'Kemasan pengiriman barang dengan panjang, lebar, tinggi berbeda.' },
      { name: 'Kotak Pensil', detail: 'Tempat alat tulis siswa di sekolah.' },
      { name: 'Lemari Pakaian', detail: 'Perabot rumah berbentuk balok tegak.' },
    ],
    exampleProblem: {
      title: 'Kapasitas dan Kaca Akuarium Kelas',
      story:
        'Kelas VI SDN Arjasa 01 memiliki akuarium kaca tanpa tutup berbentuk balok dengan panjang 60 cm, lebar 40 cm, dan tinggi 50 cm. Berapa liter air maksimal yang dapat ditampung akuarium tersebut? Berapa cm² luas kaca penyusunnya?',
      steps: {
        memahami:
          'Diketahui: Balok tanpa tutup, p = 60 cm, l = 40 cm, t = 50 cm. Ditanyakan: Kapasitas air (liter) dan luas kaca tanpa tutup (cm²).',
        merumuskan:
          'Volume = p × l × t (lalu ubah cm³ ke liter dengan dibagi 1.000). Karena akuarium TANPA TUTUP, luas kaca = (p × l) + 2×(p × t) + 2×(l × t).',
        menggunakan:
          'Volume = 60 × 40 × 50 = 120.000 cm³ = 120 liter. Luas kaca = (60 × 40) + 2×(60 × 50) + 2×(40 × 50) = 2.400 + 6.000 + 4.000 = 12.400 cm².',
        menafsirkan:
          'Akuarium kelas dapat menampung maksimal 120 liter air dan tersusun dari kaca seluas 12.400 cm².',
        mengevaluasi:
          'Penting untuk tidak mengalikan p × l dengan 2 karena bagian atas akuarium terbuka agar udara masuk dan ikan bisa diberi makan. Hasil 120 liter wajar untuk akuarium ukuran 60 cm.',
      },
    },
    defaultDimensions: { p: 5, l: 3.5, t: 3, r: 2 },
    parts: {
      alas: {
        id: 'alas',
        label: 'Sisi Alas Balok',
        description:
          'Sisi bagian bawah berbentuk persegi panjang dengan ukuran panjang (p) × lebar (l).',
        roleInFormula: 'Luas alas = p × l. Dasar untuk mencari volume V = Luas Alas × t.',
      },
      tutup: {
        id: 'tutup',
        label: 'Sisi Tutup Balok',
        description:
          'Sisi bagian atas yang sejajar dan sama besar dengan alas (p × l).',
        roleInFormula: 'Jika soal menyebut wadah tanpa tutup (akuarium, bak mandi), sisi ini tidak dihitung dalam luas permukaan.',
      },
      sisi: {
        id: 'sisi',
        label: 'Sisi Tegak Balok',
        description:
          'Empat dinding tegak balok: sepasang sisi depan-belakang (p × t) dan sepasang sisi kiri-kanan (l × t).',
        roleInFormula: 'Menyumbang bagian 2×(p×t) + 2×(l×t) pada luas permukaan balok.',
      },
      rusuk: {
        id: 'rusuk',
        label: 'Rusuk Balok (p, l, t)',
        description:
          'Memiliki 12 rusuk yang terbagi atas 4 rusuk panjang, 4 rusuk lebar, dan 4 rusuk tinggi.',
        roleInFormula: 'Panjang total kerangka kawat balok adalah 4 × (p + l + t).',
      },
      titikSudut: {
        id: 'titikSudut',
        label: 'Titik Sudut',
        description: 'Terdapat 8 titik sudut siku-siku pada pojok-pojok balok.',
        roleInFormula: 'Titik pertemuan antara rusuk panjang, lebar, dan tinggi.',
      },
      tinggi: {
        id: 'tinggi',
        label: 'Tinggi Balok (t)',
        description: 'Jarak tegak lurus antara sisi alas dan sisi tutup.',
        roleInFormula: 'Mengalikan luas alas (p × l) untuk mendapatkan ruang isi (volume).',
      },
    },
  },
  {
    id: 'prisma',
    name: 'Prisma Segitiga',
    shortTag: 'Alas & Tutup Segitiga Sejajar',
    definition:
      'Prisma adalah bangun ruang yang memiliki alas dan tutup berbentuk segi banyak yang sama dan sejajar, serta sisi tegak berbentuk persegi panjang. Pada kelas VI, yang paling sering dipelajari adalah Prisma Segitiga.',
    characteristics: [
      'Memiliki 5 sisi: 2 sisi alas dan tutup berbentuk segitiga sama besar, serta 3 sisi tegak berbentuk persegi panjang.',
      'Memiliki 9 rusuk (3 rusuk alas, 3 rusuk tutup, dan 3 rusuk tegak).',
      'Memiliki 6 titik sudut.',
      'Nama prisma selalu mengikuti bentuk alasnya (prisma segitiga, prisma segiempat, dst.).',
    ],
    facesCount: '5 sisi (2 segitiga, 3 persegi panjang)',
    edgesCount: '9 rusuk',
    verticesCount: '6 titik sudut',
    surfaceAreaFormula: 'L = (2 × Luas Alas) + (Keliling Alas × Tinggi Prisma)',
    surfaceAreaExplanation:
      'Alas dan tutup berbentuk segitiga (2 × Luas segitiga). Ketiga sisi tegak jika dibuka akan membentuk satu persegi panjang besar selebar Keliling Alas × Tinggi Prisma.',
    volumeFormula: 'V = Luas Alas × Tinggi Prisma',
    volumeExplanation:
      'Untuk prisma segitiga: Luas Alas = ½ × alas segitiga × tinggi segitiga, lalu dikalikan tinggi prisma.',
    everydayObjects: [
      { name: 'Tenda Pramuka', detail: 'Tenda berkemah dengan bagian depan dan belakang berbentuk segitiga.' },
      { name: 'Kemasan Cokelat Segitiga', detail: 'Kotak cokelat batangan yang memanjang berbentuk prisma.' },
      { name: 'Atap Rumah Pelana', detail: 'Bagian ruang loteng di bawah atap miring dua sisi.' },
      { name: 'Pengganjal Pintu Kayu', detail: 'Baji kayu berbentuk prisma segitiga siku-siku.' },
    ],
    exampleProblem: {
      title: 'Volume Tenda Kemah Pramuka',
      story:
        'Regu Elang SDN Arjasa 01 mendirikan tenda berbentuk prisma segitiga. Bagian depan tenda berbentuk segitiga dengan panjang alas 2 m dan tinggi 1,5 m. Panjang tenda ke belakang (tinggi prisma) adalah 3 m. Berapa m³ volume ruang di dalam tenda?',
      steps: {
        memahami:
          'Diketahui: Tenda berbentuk prisma segitiga. Alas segitiga = 2 m, tinggi segitiga = 1,5 m, panjang/tinggi prisma = 3 m. Ditanyakan: Volume ruang tenda (m³).',
        merumuskan:
          'Gunakan rumus volume prisma: V = Luas Alas Segitiga × Tinggi Prisma = (½ × alas × tinggi segitiga) × tinggi prisma.',
        menggunakan:
          'Luas alas segitiga = ½ × 2 × 1,5 = 1,5 m². Volume tenda = 1,5 × 3 = 4,5 m³.',
        menafsirkan:
          'Ruang udara di dalam tenda Regu Elang bervolume 4,5 m³.',
        mengevaluasi:
          'Perhatikan perbedaan "tinggi segitiga" (1,5 m) dan "tinggi prisma" yaitu panjang tenda ke belakang (3 m). Satuannya sama-sama meter sehingga hasilnya m³ dan nilainya wajar untuk tenda berkapasitas 3–4 siswa.',
      },
    },
    defaultDimensions: { p: 4, l: 3.5, t: 4.5, r: 2 },
    parts: {
      alas: {
        id: 'alas',
        label: 'Alas Segitiga',
        description: 'Bidang segitiga bagian bawah yang menjadi dasar bentuk prisma.',
        roleInFormula: 'Luas alas segitiga = ½ × a × t_segitiga, digunakan pada rumus volume dan luas permukaan.',
      },
      tutup: {
        id: 'tutup',
        label: 'Tutup Segitiga',
        description:
          'Bidang segitiga di sisi berseberangan yang sejajar dan sama ukuran dengan alas.',
        roleInFormula: 'Menjadikan jumlah bidang segitiga ada 2 buah pada rumus 2 × Luas Alas.',
      },
      sisi: {
        id: 'sisi',
        label: 'Sisi Tegak Persegi Panjang',
        description:
          'Tiga bidang sisi samping berbentuk persegi panjang yang menghubungkan rusuk alas dan tutup.',
        roleInFormula: 'Luas seluruh sisi tegak = Keliling Alas × Tinggi Prisma.',
      },
      rusuk: {
        id: 'rusuk',
        label: 'Rusuk Prisma',
        description: '9 garis tepi pada prisma segitiga (3 di alas, 3 di tutup, 3 rusuk tegak).',
        roleInFormula: 'Rusuk alas membentuk keliling segitiga untuk menghitung luas sisi tegak.',
      },
      titikSudut: {
        id: 'titikSudut',
        label: 'Titik Sudut',
        description: '6 titik pojok tempat bertemunya rusuk-rusuk prisma.',
        roleInFormula: '3 titik sudut berada di alas dan 3 titik sudut di tutup.',
      },
      tinggi: {
        id: 'tinggi',
        label: 'Tinggi Prisma (t)',
        description: 'Jarak tegak lurus antara bidang alas segitiga dan bidang tutup segitiga.',
        roleInFormula: 'Pengali utama pada V = Luas Alas × Tinggi Prisma (meski prismanya terbaring seperti tenda!).',
      },
    },
  },
  {
    id: 'limas',
    name: 'Limas Segiempat',
    shortTag: 'Memiliki Puncak & Sisi Tegak Segitiga',
    definition:
      'Limas adalah bangun ruang yang memiliki sebuah alas berbentuk segi banyak dan sisi-sisi tegak berbentuk segitiga yang bertemu di satu titik puncak. Di kelas VI, bangun yang sering dipelajari adalah Limas Segiempat.',
    characteristics: [
      'Memiliki 5 sisi: 1 sisi alas berbentuk segiempat (persegi atau persegi panjang) dan 4 sisi tegak berbentuk segitiga.',
      'Memiliki 8 rusuk (4 rusuk alas dan 4 rusuk tegak menuju puncak).',
      'Memiliki 5 titik sudut (4 sudut di alas dan 1 titik puncak di atas).',
      'Tidak memiliki tutup karena ujung atasnya meruncing ke satu titik puncak.',
    ],
    facesCount: '5 sisi (1 segiempat, 4 segitiga)',
    edgesCount: '8 rusuk',
    verticesCount: '5 titik sudut (termasuk puncak)',
    surfaceAreaFormula: 'L = Luas Alas + Jumlah Luas Semua Sisi Tegak Segitiga',
    surfaceAreaExplanation:
      'Hitung luas alas segiempat, lalu jumlahkan dengan luas keempat segitiga sisi tegaknya.',
    volumeFormula: 'V = ⅓ × Luas Alas × Tinggi Limas',
    volumeExplanation:
      'Volume limas adalah sepertiga dari volume prisma/balok yang memiliki alas dan tinggi yang sama.',
    everydayObjects: [
      { name: 'Piramida Mesir', detail: 'Bangunan bersejarah megah berbentuk limas segiempat.' },
      { name: 'Atap Rumah Joglo / Pendopo', detail: 'Bagian atap mengerucut ke satu puncak tengah.' },
      { name: 'Kue Mendut / Kue Bugis', detail: 'Kue tradisional berbungkus daun pisang berbentuk limas.' },
      { name: 'Tenda Piramida', detail: 'Tenda berkemah dengan satu tiang penyangga di tengah.' },
    ],
    exampleProblem: {
      title: 'Kertas Pembungkus Kue Tradisional',
      story:
        'Ibu membuat cetakan agar-agar berbentuk limas segiempat dengan alas persegi berukuran sisi 10 cm dan tinggi limas 12 cm. Berapakah volume agar-agar dalam satu cetakan? Jika tinggi tiap segitiga sisi tegaknya 13 cm, berapa luas seluruh permukaan cetakan itu?',
      steps: {
        memahami:
          'Diketahui: Limas beralas persegi s = 10 cm, tinggi limas t = 12 cm, tinggi sisi tegak segitiga = 13 cm. Ditanyakan: Volume (cm³) dan luas permukaan (cm²).',
        merumuskan:
          'Volume = ⅓ × Luas Alas × t. Luas Permukaan = Luas Alas + 4 × Luas Segitiga Sisi Tegak.',
        menggunakan:
          'Luas alas = 10 × 10 = 100 cm². Volume = ⅓ × 100 × 12 = 400 cm³. Luas 4 segitiga = 4 × (½ × 10 × 13) = 4 × 65 = 260 cm². Luas permukaan = 100 + 260 = 360 cm².',
        menafsirkan:
          'Satu cetakan dapat menampung 400 cm³ adonan agar-agar dan memiliki luas permukaan total 360 cm².',
        mengevaluasi:
          'Volume tidak lupa dikalikan ⅓ (jika tidak dikali ⅓ hasilnya 1.200 cm³ seperti balok). Tinggi limas (12 cm) dipakai untuk volume, sedangkan tinggi segitiga miring (13 cm) dipakai untuk luas sisi tegak.',
      },
    },
    defaultDimensions: { p: 4, l: 4, t: 4.5, r: 2 },
    parts: {
      alas: {
        id: 'alas',
        label: 'Alas Limas',
        description: 'Satu-satunya bidang dasar di bawah limas berbentuk persegi atau persegi panjang.',
        roleInFormula: 'Luas alas menentukan volume (V = ⅓ × Luas Alas × t) dan dasar luas permukaan.',
      },
      sisi: {
        id: 'sisi',
        label: 'Sisi Tegak Segitiga',
        description: 'Empat dinding miring berbentuk segitiga yang ujungnya bertemu di titik puncak.',
        roleInFormula: 'Luas tiap sisi tegak = ½ × alas × tinggi segitiga sisi tegak.',
      },
      rusuk: {
        id: 'rusuk',
        label: 'Rusuk Limas',
        description: 'Terdiri atas 4 rusuk alas dan 4 rusuk miring menuju puncak.',
        roleInFormula: 'Membentuk kerangka piramida limas.',
      },
      titikSudut: {
        id: 'titikSudut',
        label: 'Titik Sudut & Puncak',
        description: '4 titik sudut di alas dan 1 titik puncak tertinggi di atas.',
        roleInFormula: 'Titik puncak adalah ujung dari garis tinggi limas.',
      },
      tinggi: {
        id: 'tinggi',
        label: 'Tinggi Limas (t)',
        description:
          'Garis tegak lurus dari titik puncak langsung menuju pusat bidang alas.',
        roleInFormula: 'Dipakai khusus untuk menghitung volume V = ⅓ × Luas Alas × t.',
      },
    },
  },
  {
    id: 'tabung',
    name: 'Tabung',
    shortTag: 'Alas & Tutup Lingkaran + Selimut Lengkung',
    definition:
      'Tabung adalah bangun ruang sisi lengkung yang memiliki dua bidang alas dan tutup berbentuk lingkaran yang sama besar dan sejajar, serta satu sisi lengkung (selimut) yang menghubungkan keduanya.',
    characteristics: [
      'Memiliki 3 sisi: 2 sisi berbentuk lingkaran (alas dan tutup) dan 1 sisi lengkung (selimut tabung).',
      'Memiliki 2 rusuk lengkung yang mengelilingi lingkaran alas dan tutup.',
      'Tidak memiliki titik sudut.',
      'Jika selimut tabung dibuka rata, bentuknya adalah sebuah persegi panjang.',
    ],
    facesCount: '3 sisi (2 lingkaran, 1 selimut lengkung)',
    edgesCount: '2 rusuk lengkung',
    verticesCount: 'Tidak memiliki titik sudut (0)',
    surfaceAreaFormula: 'L = 2 × π × r × (r + t)',
    surfaceAreaExplanation:
      'r = jari-jari lingkaran alas, t = tinggi tabung, π ≈ 22/7 atau 3,14. Berasal dari 2 luas lingkaran (2×π×r²) ditambah luas selimut (2×π×r×t).',
    volumeFormula: 'V = π × r² × t',
    volumeExplanation:
      'Luas alas lingkaran (π × r²) dikalikan tinggi tabung (t). Gunakan π = 22/7 jika r kelipatan 7, atau π = 3,14.',
    everydayObjects: [
      { name: 'Kaleng Susu / Minuman', detail: 'Kemasan makanan dan minuman berbentuk tabung tertutup.' },
      { name: 'Drum / Tandon Air', detail: 'Wadah penampungan air berukuran besar.' },
      { name: 'Gelas & Botol Minum', detail: 'Wadah minum sehari-hari (tabung tanpa tutup saat terbuka).' },
      { name: 'Celengan Kaleng', detail: 'Tempat menabung berbentuk silinder.' },
    ],
    exampleProblem: {
      title: 'Kapasitas Kaleng Susu Kental',
      story:
        'Sebuah kaleng susu berbentuk tabung memiliki jari-jari alas 7 cm dan tinggi 20 cm. Berapakah volume susu maksimal dalam kaleng tersebut, dan berapa luas label kertas yang menutupi selimutnya? (π = 22/7)',
      steps: {
        memahami:
          'Diketahui: Tabung dengan r = 7 cm, t = 20 cm, π = 22/7. Ditanyakan: Volume kaleng dan luas selimut label kertas.',
        merumuskan:
          'Volume = π × r² × t. Karena label hanya menutupi bagian samping (selimut) tanpa alas dan tutup, Luas Selimut = 2 × π × r × t.',
        menggunakan:
          'Volume = 22/7 × 7 × 7 × 20 = 154 × 20 = 3.080 cm³. Luas selimut = 2 × 22/7 × 7 × 20 = 44 × 20 = 880 cm².',
        menafsirkan:
          'Kaleng dapat menampung 3.080 cm³ (atau 3,08 liter) susu, dan kertas label yang dibutuhkan seluas 880 cm².',
        mengevaluasi:
          'Karena jari-jari r = 7 cm habis dibagi 7, memilih π = 22/7 membuat perhitungan sangat akurat dan mudah. Label tidak menutup alas dan tutup sehingga memakai rumus selimut, bukan luas permukaan penuh.',
      },
    },
    defaultDimensions: { p: 4, l: 4, t: 4.5, r: 1.8 },
    parts: {
      alas: {
        id: 'alas',
        label: 'Alas Lingkaran',
        description: 'Bidang bawah tabung berbentuk lingkaran dengan jari-jari r.',
        roleInFormula: 'Luas alas = π × r², menjadi dasar rumus volume V = π × r² × t.',
      },
      tutup: {
        id: 'tutup',
        label: 'Tutup Lingkaran',
        description: 'Bidang atas berbentuk lingkaran yang ukurannya sama persis dengan alas.',
        roleInFormula: 'Jika tabung tanpa tutup (seperti gelas), luas permukaannya menjadi π×r² + 2×π×r×t.',
      },
      sisi: {
        id: 'sisi',
        label: 'Selimut Tabung',
        description:
          'Sisi lengkung yang membungkus sisi samping tabung. Jika direbahkan akan menjadi persegi panjang.',
        roleInFormula: 'Luas selimut = Keliling Lingkaran × Tinggi = 2 × π × r × t.',
      },
      rusuk: {
        id: 'rusuk',
        label: 'Rusuk Lengkung',
        description: '2 rusuk melingkar yang membatasi selimut dengan alas dan tutup.',
        roleInFormula: 'Panjang satu rusuk lengkung sama dengan keliling lingkaran (2 × π × r).',
      },
      tinggi: {
        id: 'tinggi',
        label: 'Tinggi & Jari-jari (t, r)',
        description:
          'Tinggi (t) menghubungkan pusat alas dan pusat tutup; jari-jari (r) dari pusat lingkaran ke tepi.',
        roleInFormula: 'Pastikan membedakan diameter (d) dengan jari-jari (r = d ÷ 2)!',
      },
    },
  },
  {
    id: 'kerucut',
    name: 'Kerucut',
    shortTag: 'Alas Lingkaran & Puncak Meruncing',
    definition:
      'Kerucut adalah bangun ruang sisi lengkung yang memiliki satu alas berbentuk lingkaran dan satu sisi lengkung (selimut) yang menyempit ke atas menuju sebuah titik puncak.',
    characteristics: [
      'Memiliki 2 sisi: 1 sisi alas berbentuk lingkaran dan 1 sisi lengkung (selimut kerucut).',
      'Memiliki 1 rusuk lengkung berbentuk lingkaran pada bagian alas.',
      'Memiliki 1 titik puncak (sering disebut titik sudut puncak pada bagian atas).',
      'Memiliki tinggi kerucut (t) dan garis pelukis/sisi miring (s).',
    ],
    facesCount: '2 sisi (1 lingkaran, 1 selimut lengkung)',
    edgesCount: '1 rusuk lengkung',
    verticesCount: '1 titik puncak (tidak memiliki sudut alas)',
    surfaceAreaFormula: 'L = π × r × (r + s)',
    surfaceAreaExplanation:
      'r = jari-jari alas, s = garis pelukis (panjang sisi miring dari puncak ke tepi alas). Berasal dari luas alas (π×r²) + luas selimut (π×r×s).',
    volumeFormula: 'V = ⅓ × π × r² × t',
    volumeExplanation:
      'Volume kerucut tepat sepertiga dari volume tabung yang memiliki jari-jari dan tinggi yang sama.',
    everydayObjects: [
      { name: 'Topi Ulang Tahun', detail: 'Topi kerucut kertas yang berlubang di alasnya.' },
      { name: 'Nasi Tumpeng', detail: 'Sajian khas Indonesia berbentuk kerucut menjulang.' },
      { name: 'Pembatas Jalan (Traffic Cone)', detail: 'Kerucut oranye di jalan atau lapangan sekolah.' },
      { name: 'Cone Es Krim', detail: 'Wadah renyah berbentuk kerucut terbalik.' },
    ],
    exampleProblem: {
      title: 'Membuat Topi Ulang Tahun Kertas',
      story:
        'Siti membuat topi ulang tahun berbentuk kerucut tanpa alas dari kertas karton. Jari-jari alas topi 7 cm dan tinggi topi 24 cm. Jika panjang garis pelukis (sisi miringnya) adalah 25 cm, berapa cm² luas karton untuk 1 buah topi?',
      steps: {
        memahami:
          'Diketahui: Topi kerucut TANPA alas, r = 7 cm, t = 24 cm, garis pelukis s = 25 cm, π = 22/7. Ditanyakan: Luas karton untuk 1 topi.',
        merumuskan:
          'Karena topi dipakai di kepala, bagian alasnya berlubang (tidak ditutup karton). Jadi cukup hitung Luas Selimut Kerucut = π × r × s.',
        menggunakan:
          'Luas selimut = 22/7 × 7 × 25 = 22 × 25 = 550 cm².',
        menafsirkan:
          'Untuk membuat 1 buah topi ulang tahun, Siti memerlukan kertas karton seluas 550 cm².',
        mengevaluasi:
          'Jangan menggunakan rumus luas permukaan penuh π×r×(r+s), karena nanti bagian kepala topi tertutup! Juga perhatikan bahwa luas selimut memakai s (25 cm), bukan t (24 cm).',
      },
    },
    defaultDimensions: { p: 4, l: 4, t: 4.5, r: 2 },
    parts: {
      alas: {
        id: 'alas',
        label: 'Alas Lingkaran Kerucut',
        description: 'Bidang datar di bagian bawah kerucut berbentuk lingkaran berjari-jari r.',
        roleInFormula: 'Luas alas = π × r². Pada benda seperti topi atau corong, bagian alas ini terbuka.',
      },
      sisi: {
        id: 'sisi',
        label: 'Selimut Kerucut',
        description:
          'Sisi lengkung miring yang mengelilingi kerucut. Jika dibuka rata, bentuknya seperti potongan kue/juring lingkaran.',
        roleInFormula: 'Luas selimut = π × r × s (dengan s = garis pelukis/sisi miring).',
      },
      rusuk: {
        id: 'rusuk',
        label: 'Rusuk Lengkung',
        description: '1 rusuk melingkar tempat bertemunya alas dan selimut kerucut.',
        roleInFormula: 'Panjangnya sama dengan keliling alas lingkaran: 2 × π × r.',
      },
      titikSudut: {
        id: 'titikSudut',
        label: 'Titik Puncak Kerucut',
        description: 'Titik ujung paling atas tempat selimut kerucut meruncing.',
        roleInFormula: 'Menjadi titik awal pengukuran tinggi kerucut (t) dan garis pelukis (s).',
      },
      tinggi: {
        id: 'tinggi',
        label: 'Tinggi (t) & Jari-jari (r)',
        description:
          'Tinggi (t) tegak lurus dari puncak ke pusat alas. Jari-jari (r) dari pusat alas ke tepi lingkaran.',
        roleInFormula: 'Tinggi (t) dipakai di Volume (V = ⅓×π×r²×t), dan bersama r membentuk segitiga siku-siku dengan s (s² = r² + t²).',
      },
    },
  },
  {
    id: 'bola',
    name: 'Bola',
    shortTag: 'Satu Sisi Lengkung Sempurna',
    definition:
      'Bola adalah bangun ruang tiga dimensi yang dibatasi oleh satu bidang sisi lengkung sempurna, di mana setiap titik pada permukaannya memiliki jarak yang sama (jari-jari) dari titik pusat bola.',
    characteristics: [
      'Hanya memiliki 1 sisi lengkung tertutup.',
      'Tidak memiliki rusuk (0 rusuk).',
      'Tidak memiliki titik sudut (0 titik sudut).',
      'Memiliki titik pusat di tengah dan jari-jari (r) yang sama ke segala arah.',
    ],
    facesCount: '1 sisi lengkung',
    edgesCount: 'Tidak memiliki rusuk (0)',
    verticesCount: 'Tidak memiliki titik sudut (0)',
    surfaceAreaFormula: 'L = 4 × π × r²',
    surfaceAreaExplanation:
      'Luas kulit bola tepat sama dengan 4 kali luas lingkaran yang jari-jarinya sama dengan jari-jari bola.',
    volumeFormula: 'V = 4/3 × π × r³',
    volumeExplanation:
      'r = jari-jari bola, π ≈ 22/7 atau 3,14. Hati-hati, pada volume bola jari-jari dipangkatkan tiga (r × r × r)!',
    everydayObjects: [
      { name: 'Bola Sepak & Basket', detail: 'Alat olahraga berbentuk bulat sempurna.' },
      { name: 'Globe (Bola Dunia)', detail: 'Tiruan bumi berbentuk bola di ruang kelas.' },
      { name: 'Kelereng', detail: 'Mainan kaca kecil berbentuk bola.' },
      { name: 'Buah Semangka / Jeruk', detail: 'Buah di sekitar kita yang menyerupai bentuk bola.' },
    ],
    exampleProblem: {
      title: 'Bahan Kulit Bola Sepak Mini',
      story:
        'Sebuah bola mainan berjari-jari 7 cm akan dilapisi cat pelindung di seluruh permukaannya. Berapakah luas permukaan bola yang harus dicat? (Gunakan π = 22/7)',
      steps: {
        memahami:
          'Diketahui: Bangun ruang berbentuk bola, jari-jari r = 7 cm, π = 22/7. Ditanyakan: Luas permukaan bola (cm²).',
        merumuskan:
          'Gunakan rumus luas permukaan bola: L = 4 × π × r².',
        menggunakan:
          'L = 4 × 22/7 × 7 × 7 = 4 × 22 × 7 = 88 × 7 = 616 cm².',
        menafsirkan:
          'Luas seluruh kulit bola yang perlu dilapisi cat adalah 616 cm².',
        mengevaluasi:
          'Rumus sudah tepat (4 × π × r², bukan volume 4/3 × π × r³). Karena r = 7 cm kelipatan 7, penggunaan π = 22/7 menghasilkan bilangan bulat yang rapi dan masuk akal.',
      },
    },
    defaultDimensions: { p: 4, l: 4, t: 4, r: 2.2 },
    parts: {
      sisi: {
        id: 'sisi',
        label: 'Sisi Lengkung (Kulit Bola)',
        description:
          'Satu-satunya sisi pada bola yang melengkung rata ke segala arah tanpa sudut atau rusuk.',
        roleInFormula: 'Luas kulit bola setara dengan 4 lingkaran berjari-jari sama: L = 4 × π × r².',
      },
      tinggi: {
        id: 'tinggi',
        label: 'Jari-jari (r) & Diameter (d)',
        description:
          'Jari-jari (r) adalah jarak dari titik pusat di dalam bola ke permukaan kulit bola. Diameter (d) = 2 × r.',
        roleInFormula: 'Semua rumus bola hanya bergantung pada panjang jari-jari r.',
      },
    },
  },
];

export const SHAPES_BY_ID: Record<ShapeId, ShapeMaterial> = SHAPES_LIST.reduce(
  (acc, item) => {
    acc[item.id] = item;
    return acc;
  },
  {} as Record<ShapeId, ShapeMaterial>,
);
