import { ShapeId } from '../types/learning';

interface Props {
  shapeId: ShapeId;
  className?: string;
}

export function ShapeIllustrationSVG({ shapeId, className = 'w-full h-48' }: Props) {
  switch (shapeId) {
    case 'kubus':
      return (
        <svg viewBox="0 0 240 190" className={className} role="img" aria-label="Diagram Kubus">
          <defs>
            <linearGradient id="kubusFront" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.85" />
              <stop offset="100%" stopColor="#0284c7" stopOpacity="0.95" />
            </linearGradient>
          </defs>
          {/* Back hidden edges */}
          <line x1="90" y1="30" x2="90" y2="115" stroke="#94a3b8" strokeWidth="1.5" strokeDasharray="4 4" />
          <line x1="90" y1="115" x2="175" y2="115" stroke="#94a3b8" strokeWidth="1.5" strokeDasharray="4 4" />
          <line x1="90" y1="115" x2="55" y2="150" stroke="#94a3b8" strokeWidth="1.5" strokeDasharray="4 4" />
          {/* Front face */}
          <polygon points="55,65 140,65 140,150 55,150" fill="url(#kubusFront)" stroke="#0369a1" strokeWidth="2.2" />
          {/* Top face */}
          <polygon points="55,65 90,30 175,30 140,65" fill="#fde047" fillOpacity="0.85" stroke="#0369a1" strokeWidth="2.2" />
          {/* Right face */}
          <polygon points="140,65 175,30 175,115 140,150" fill="#34d399" fillOpacity="0.85" stroke="#0369a1" strokeWidth="2.2" />
          {/* Labels */}
          <text x="95" y="170" textAnchor="middle" className="fill-slate-800 text-xs font-semibold font-mono">s</text>
          <text x="163" y="142" textAnchor="middle" className="fill-slate-800 text-xs font-semibold font-mono">s</text>
          <text x="38" y="112" textAnchor="middle" className="fill-slate-800 text-xs font-semibold font-mono">s</text>
        </svg>
      );

    case 'balok':
      return (
        <svg viewBox="0 0 260 190" className={className} role="img" aria-label="Diagram Balok">
          <line x1="85" y1="40" x2="85" y2="120" stroke="#94a3b8" strokeWidth="1.5" strokeDasharray="4 4" />
          <line x1="85" y1="120" x2="215" y2="120" stroke="#94a3b8" strokeWidth="1.5" strokeDasharray="4 4" />
          <line x1="85" y1="120" x2="45" y2="155" stroke="#94a3b8" strokeWidth="1.5" strokeDasharray="4 4" />
          <polygon points="45,75 175,75 175,155 45,155" fill="#38bdf8" fillOpacity="0.85" stroke="#0369a1" strokeWidth="2.2" />
          <polygon points="45,75 85,40 215,40 175,75" fill="#fde047" fillOpacity="0.85" stroke="#0369a1" strokeWidth="2.2" />
          <polygon points="175,75 215,40 215,120 175,155" fill="#34d399" fillOpacity="0.85" stroke="#0369a1" strokeWidth="2.2" />
          <text x="110" y="174" textAnchor="middle" className="fill-slate-800 text-xs font-semibold font-mono">p (panjang)</text>
          <text x="206" y="146" textAnchor="middle" className="fill-slate-800 text-xs font-semibold font-mono">l</text>
          <text x="28" y="118" textAnchor="middle" className="fill-slate-800 text-xs font-semibold font-mono">t</text>
        </svg>
      );

    case 'prisma':
      return (
        <svg viewBox="0 0 240 190" className={className} role="img" aria-label="Diagram Prisma Segitiga">
          <line x1="70" y1="145" x2="150" y2="145" stroke="#94a3b8" strokeWidth="1.5" strokeDasharray="4 4" />
          {/* Left triangle face */}
          <polygon points="70,145 110,50 150,145" fill="#34d399" fillOpacity="0.3" />
          {/* Side quad */}
          <polygon points="110,50 185,35 210,125 150,145" fill="#38bdf8" fillOpacity="0.8" stroke="#0369a1" strokeWidth="2.2" />
          {/* Front triangle */}
          <polygon points="55,150 105,55 150,145" fill="#fde047" fillOpacity="0.88" stroke="#0369a1" strokeWidth="2.2" />
          <line x1="105" y1="55" x2="185" y2="35" stroke="#0369a1" strokeWidth="2.2" />
          <line x1="150" y1="145" x2="210" y2="125" stroke="#0369a1" strokeWidth="2.2" />
          <line x1="55" y1="150" x2="130" y2="125" stroke="#94a3b8" strokeWidth="1.5" strokeDasharray="4 4" />
          <line x1="130" y1="125" x2="185" y2="35" stroke="#94a3b8" strokeWidth="1.5" strokeDasharray="4 4" />
          <line x1="130" y1="125" x2="210" y2="125" stroke="#94a3b8" strokeWidth="1.5" strokeDasharray="4 4" />
          {/* Triangle height */}
          <line x1="105" y1="55" x2="105" y2="147" stroke="#dc2626" strokeWidth="1.8" strokeDasharray="3 3" />
          <text x="102" y="169" textAnchor="middle" className="fill-slate-800 text-xs font-semibold font-mono">alas Δ</text>
          <text x="188" y="152" textAnchor="middle" className="fill-slate-800 text-xs font-semibold font-mono">t prisma</text>
        </svg>
      );

    case 'limas':
      return (
        <svg viewBox="0 0 240 190" className={className} role="img" aria-label="Diagram Limas Segiempat">
          {/* Base */}
          <polygon points="50,145 150,145 185,115 85,115" fill="#34d399" fillOpacity="0.7" stroke="#0369a1" strokeWidth="2" />
          {/* Back hidden edge */}
          <line x1="118" y1="30" x2="85" y2="115" stroke="#94a3b8" strokeWidth="1.5" strokeDasharray="4 4" />
          {/* Front & side faces */}
          <polygon points="118,30 50,145 150,145" fill="#38bdf8" fillOpacity="0.8" stroke="#0369a1" strokeWidth="2.2" />
          <polygon points="118,30 150,145 185,115" fill="#fde047" fillOpacity="0.82" stroke="#0369a1" strokeWidth="2.2" />
          {/* Height line */}
          <line x1="118" y1="30" x2="118" y2="130" stroke="#dc2626" strokeWidth="2" strokeDasharray="4 3" />
          <circle cx="118" cy="130" r="3" fill="#dc2626" />
          <text x="128" y="95" className="fill-red-700 text-xs font-semibold font-mono">t</text>
          <text x="100" y="167" textAnchor="middle" className="fill-slate-800 text-xs font-semibold font-mono">sisi alas</text>
        </svg>
      );

    case 'tabung':
      return (
        <svg viewBox="0 0 240 190" className={className} role="img" aria-label="Diagram Tabung">
          <ellipse cx="120" cy="145" rx="58" ry="18" fill="#34d399" fillOpacity="0.75" stroke="#0369a1" strokeWidth="2.2" />
          <path d="M62,48 L62,145 A58,18 0 0,0 178,145 L178,48 Z" fill="#38bdf8" fillOpacity="0.75" stroke="#0369a1" strokeWidth="2.2" />
          <ellipse cx="120" cy="48" rx="58" ry="18" fill="#fde047" fillOpacity="0.9" stroke="#0369a1" strokeWidth="2.2" />
          {/* Radius & height */}
          <line x1="120" y1="48" x2="178" y2="48" stroke="#dc2626" strokeWidth="2" />
          <circle cx="120" cy="48" r="3" fill="#0369a1" />
          <line x1="120" y1="48" x2="120" y2="145" stroke="#0f172a" strokeWidth="1.6" strokeDasharray="4 3" />
          <text x="148" y="42" textAnchor="middle" className="fill-red-700 text-xs font-semibold font-mono">r</text>
          <text x="130" y="102" className="fill-slate-900 text-xs font-semibold font-mono">t</text>
        </svg>
      );

    case 'kerucut':
      return (
        <svg viewBox="0 0 240 190" className={className} role="img" aria-label="Diagram Kerucut">
          <ellipse cx="120" cy="145" rx="60" ry="18" fill="#34d399" fillOpacity="0.75" stroke="#0369a1" strokeWidth="2.2" />
          <path d="M120,28 L60,145 A60,18 0 0,0 180,145 Z" fill="#38bdf8" fillOpacity="0.82" stroke="#0369a1" strokeWidth="2.2" />
          <line x1="120" y1="28" x2="120" y2="145" stroke="#dc2626" strokeWidth="2" strokeDasharray="4 3" />
          <line x1="120" y1="145" x2="180" y2="145" stroke="#0f172a" strokeWidth="2" />
          <circle cx="120" cy="145" r="3" fill="#0f172a" />
          <circle cx="120" cy="28" r="3.5" fill="#f59e0b" stroke="#0f172a" strokeWidth="1.2" />
          <text x="110" y="96" className="fill-red-700 text-xs font-semibold font-mono">t</text>
          <text x="150" y="139" className="fill-slate-900 text-xs font-semibold font-mono">r</text>
          <text x="160" y="88" className="fill-sky-900 text-xs font-semibold font-mono">s</text>
        </svg>
      );

    case 'bola':
      return (
        <svg viewBox="0 0 240 190" className={className} role="img" aria-label="Diagram Bola">
          <defs>
            <radialGradient id="bolaGrad" cx="35%" cy="35%" r="65%">
              <stop offset="0%" stopColor="#fde047" />
              <stop offset="55%" stopColor="#38bdf8" />
              <stop offset="100%" stopColor="#0284c7" />
            </radialGradient>
          </defs>
          <circle cx="120" cy="95" r="65" fill="url(#bolaGrad)" stroke="#0369a1" strokeWidth="2.4" />
          <ellipse cx="120" cy="95" rx="65" ry="18" fill="none" stroke="#ffffff" strokeWidth="1.8" strokeDasharray="5 4" />
          <line x1="120" y1="95" x2="185" y2="95" stroke="#dc2626" strokeWidth="2.4" />
          <circle cx="120" cy="95" r="3.5" fill="#dc2626" />
          <text x="152" y="88" textAnchor="middle" className="fill-red-800 text-xs font-bold font-mono">r</text>
        </svg>
      );
  }
}
