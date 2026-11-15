import { useState, useRef, useEffect } from 'react';
import {
  Box,
  ChevronDown,
  Menu,
  X,
  Home,
  BookOpen,
  Compass,
  PenTool,
  ClipboardCheck,
  Award,
  HelpCircle,
  Target,
  Info,
} from 'lucide-react';
import { MenuId } from '../types/learning';

interface NavbarProps {
  activeMenu: MenuId;
  onNavigate: (menu: MenuId) => void;
}

export const ALL_MENUS: {
  id: MenuId;
  label: string;
  shortLabel: string;
  description: string;
  iconName:
    | 'home'
    | 'guide'
    | 'target'
    | 'book'
    | 'box'
    | 'pen'
    | 'check'
    | 'award'
    | 'info';
}[] = [
  {
    id: 'beranda',
    label: 'Beranda',
    shortLabel: 'Beranda',
    description: 'Halaman utama dan peta kegiatan belajar bangun ruang.',
    iconName: 'home',
  },
  {
    id: 'petunjuk',
    label: 'Petunjuk Penggunaan',
    shortLabel: 'Petunjuk',
    description: 'Panduan langkah demi langkah memakai menu dan objek 3D.',
    iconName: 'guide',
  },
  {
    id: 'tujuan',
    label: 'Tujuan Pembelajaran',
    shortLabel: 'Tujuan',
    description: 'Capaian belajar dan lima indikator literasi matematis.',
    iconName: 'target',
  },
  {
    id: 'materi',
    label: 'Materi Bangun Ruang',
    shortLabel: 'Materi',
    description: 'Sifat, rumus, benda sekitar, dan 5 langkah literasi 7 bangun.',
    iconName: 'book',
  },
  {
    id: 'eksplorasi3d',
    label: 'Eksplorasi Bangun Ruang 3D',
    shortLabel: 'Eksplorasi 3D',
    description: 'Putar, perbesar, klik bagian, dan buka jaring-jaring 3D.',
    iconName: 'box',
  },
  {
    id: 'latihan',
    label: 'Latihan Literasi Matematis',
    shortLabel: 'Latihan',
    description: '22 soal cerita sehari-hari dengan petunjuk dan pembahasan.',
    iconName: 'pen',
  },
  {
    id: 'evaluasi',
    label: 'Evaluasi',
    shortLabel: 'Evaluasi',
    description: '12 soal evaluasi literasi matematis lengkap dengan skor.',
    iconName: 'check',
  },
  {
    id: 'hasil',
    label: 'Hasil Belajar',
    shortLabel: 'Hasil Belajar',
    description: 'Ringkasan nilai, indikator literasi, rekomendasi, dan ekspor.',
    iconName: 'award',
  },
  {
    id: 'profil',
    label: 'Profil Media',
    shortLabel: 'Profil Media',
    description: 'Identitas media pembelajaran, sekolah, dan pengembang.',
    iconName: 'info',
  },
];

export function renderMenuIcon(iconName: string, className = 'w-5 h-5') {
  switch (iconName) {
    case 'home':
      return <Home className={className} />;
    case 'guide':
      return <HelpCircle className={className} />;
    case 'target':
      return <Target className={className} />;
    case 'book':
      return <BookOpen className={className} />;
    case 'box':
      return <Box className={className} />;
    case 'pen':
      return <PenTool className={className} />;
    case 'check':
      return <ClipboardCheck className={className} />;
    case 'award':
      return <Award className={className} />;
    case 'info':
      return <Info className={className} />;
    default:
      return <Compass className={className} />;
  }
}

export function Navbar({ activeMenu, onNavigate }: NavbarProps) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [moreOpen, setMoreOpen] = useState(false);
  const moreRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onDocClick = (e: MouseEvent) => {
      if (moreRef.current && !moreRef.current.contains(e.target as Node)) {
        setMoreOpen(false);
      }
    };
    document.addEventListener('mousedown', onDocClick);
    return () => document.removeEventListener('mousedown', onDocClick);
  }, []);

  const primaryIds: MenuId[] = ['beranda', 'materi', 'eksplorasi3d', 'latihan', 'evaluasi'];
  const secondaryIds: MenuId[] = ['petunjuk', 'tujuan', 'hasil', 'profil'];

  const handleSelect = (id: MenuId) => {
    onNavigate(id);
    setMobileOpen(false);
    setMoreOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-slate-200">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-8">
        {/* Zone 1: Single-line Brand Title */}
        <button
          type="button"
          onClick={() => handleSelect('beranda')}
          className="flex items-center gap-2.5 text-left font-display text-lg sm:text-xl font-bold tracking-tight text-slate-900 whitespace-nowrap shrink-0 cursor-pointer"
        >
          <span className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-sky-600 text-white">
            <Box className="w-5 h-5" />
          </span>
          <span>Bangun Ruang 3D</span>
        </button>

        {/* Zone 2: Primary Desktop Nav Links + Lainnya Dropdown */}
        <nav className="hidden lg:flex items-center gap-6" aria-label="Menu Utama">
          {primaryIds.map((id) => {
            const item = ALL_MENUS.find((m) => m.id === id)!;
            const active = activeMenu === id;
            return (
              <button
                key={id}
                type="button"
                onClick={() => handleSelect(id)}
                className={`py-2 text-sm font-semibold whitespace-nowrap shrink-0 transition-colors cursor-pointer border-b-2 ${
                  active
                    ? 'text-sky-700 border-sky-600'
                    : 'text-slate-600 border-transparent hover:text-slate-900 hover:border-slate-300'
                }`}
              >
                {item.shortLabel}
              </button>
            );
          })}

          <div className="relative" ref={moreRef}>
            <button
              type="button"
              onClick={() => setMoreOpen((v) => !v)}
              aria-expanded={moreOpen}
              className={`inline-flex items-center gap-1 py-2 text-sm font-semibold whitespace-nowrap shrink-0 transition-colors cursor-pointer border-b-2 ${
                secondaryIds.includes(activeMenu)
                  ? 'text-sky-700 border-sky-600'
                  : 'text-slate-600 border-transparent hover:text-slate-900'
              }`}
            >
              <span>Menu Lainnya</span>
              <ChevronDown className="w-4 h-4" />
            </button>

            {moreOpen && (
              <div className="absolute right-0 mt-2 w-64 rounded-2xl bg-white border border-slate-200 shadow-lg p-2 z-50">
                {secondaryIds.map((id) => {
                  const item = ALL_MENUS.find((m) => m.id === id)!;
                  const active = activeMenu === id;
                  return (
                    <button
                      key={id}
                      type="button"
                      onClick={() => handleSelect(id)}
                      className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left text-sm font-semibold transition-colors cursor-pointer ${
                        active
                          ? 'bg-sky-50 text-sky-700'
                          : 'text-slate-700 hover:bg-slate-50 hover:text-slate-900'
                      }`}
                    >
                      {renderMenuIcon(item.iconName, 'w-4 h-4 shrink-0')}
                      <span className="truncate">{item.label}</span>
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </nav>

        {/* Zone 3: Single Primary Action + Mobile Toggle */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            type="button"
            onClick={() => handleSelect('hasil')}
            className={`hidden sm:inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold whitespace-nowrap shrink-0 transition-colors cursor-pointer ${
              activeMenu === 'hasil'
                ? 'bg-emerald-700 text-white'
                : 'bg-sky-600 text-white hover:bg-sky-700'
            }`}
          >
            <Award className="w-4 h-4" />
            <span>Hasil Belajar</span>
          </button>

          <button
            type="button"
            onClick={() => setMobileOpen((v) => !v)}
            className="lg:hidden inline-flex items-center justify-center min-h-[44px] min-w-[44px] rounded-xl border border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100 cursor-pointer"
            aria-label={mobileOpen ? 'Tutup menu' : 'Buka menu'}
            aria-expanded={mobileOpen}
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation Drawer */}
      {mobileOpen && (
        <div className="lg:hidden border-t border-slate-200 bg-white px-4 py-4 max-h-[80vh] overflow-y-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {ALL_MENUS.map((item) => {
              const active = activeMenu === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => handleSelect(item.id)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl text-left text-sm font-semibold min-h-[48px] transition-colors cursor-pointer ${
                    active
                      ? 'bg-sky-600 text-white'
                      : 'bg-slate-50 text-slate-800 hover:bg-sky-50 hover:text-sky-800'
                  }`}
                >
                  {renderMenuIcon(item.iconName, 'w-5 h-5 shrink-0')}
                  <span className="truncate">{item.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      )}
    </header>
  );
}
