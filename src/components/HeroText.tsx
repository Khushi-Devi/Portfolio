import { useEffect, useRef, useState, useCallback } from 'react';

export interface SkipRect {
  top: number; left: number; right: number; bottom: number;
}
export interface HeroTextProps {
  onSkipRects?: (rects: SkipRect[]) => void;
  className?: string;
}

const PAD = 32;

export default function HeroText({ onSkipRects, className }: HeroTextProps) {
  const prefixRef  = useRef<HTMLSpanElement>(null);
  const nameRef    = useRef<HTMLHeadingElement>(null);
  const dividerRef = useRef<HTMLDivElement>(null);
  const taglineRef = useRef<HTMLParagraphElement>(null);
  const buttonsRef = useRef<HTMLDivElement>(null);
  const canvasRef  = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [mounted, setMounted] = useState(false);

  const reportRects = useCallback(() => {
    if (!onSkipRects) return;
    const els = [prefixRef, nameRef, dividerRef, taglineRef, buttonsRef];
    const rects: SkipRect[] = els
      .filter(r => r.current !== null)
      .map(r => {
        const b = r.current!.getBoundingClientRect();
        return { top: b.top - PAD, left: b.left - PAD, right: b.right + PAD, bottom: b.bottom + PAD };
      });
    onSkipRects(rects);
  }, [onSkipRects]);

  useEffect(() => {
    setMounted(true);
    const t = setTimeout(reportRects, 60);
    window.addEventListener('resize', reportRects);
    return () => { clearTimeout(t); window.removeEventListener('resize', reportRects); };
  }, [reportRects]);

  // ── Canvas: floating fragments + orbital rings ──
  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;
    const ctx = canvas.getContext('2d')!;
    const DPR = devicePixelRatio || 1;
    let animId: number;
    let W = 0, H = 0;
    let mouse = { x: -9999, y: -9999 };

    const FRAGMENTS_SRC = [
      // identity — KD only once, no duplicates
      { t: 'KD',                font: "600 54px 'Cormorant Garamond',Georgia,serif",  base: 0.55 },
      { t: 'Khushi',            font: "300 18px 'Cormorant Garamond',Georgia,serif",  base: 0.45 },
      // ML equations
      { t: '∇L(θ)',             font: "300 30px 'Cormorant Garamond',serif",          base: 0.72 },
      { t: 'σ(z)=1/(1+e⁻ᶻ)',   font: "300 13px 'DM Sans',sans-serif",               base: 0.58 },
      { t: 'y = Wx + b',        font: "300 16px 'DM Sans',sans-serif",               base: 0.62 },
      { t: '∂L/∂w',             font: "300 26px 'Cormorant Garamond',serif",         base: 0.68 },
      { t: 'P(y|x; θ)',         font: "300 15px 'DM Sans',sans-serif",               base: 0.55 },
      { t: 'argmax f(x)',        font: "300 13px 'DM Sans',sans-serif",               base: 0.52 },
      { t: 'loss → 0',          font: "300 18px 'DM Sans',sans-serif",               base: 0.62 },
      { t: 'accuracy: 0.96',    font: "300 12px 'DM Sans',sans-serif",               base: 0.50 },
      { t: 'epochs=50',         font: "300 11px 'DM Sans',sans-serif",               base: 0.48 },
      { t: 'f(x)→ŷ',            font: "300 22px 'Cormorant Garamond',serif",         base: 0.62 },
      { t: 'n=∞',               font: "300 24px 'Cormorant Garamond',serif",         base: 0.58 },
      // code
      { t: 'model.fit(X)',      font: "300 12px 'DM Mono',monospace",                base: 0.58 },
      { t: 'git push',          font: "300 11px 'DM Mono',monospace",                base: 0.52 },
      { t: 'flask run',         font: "300 11px 'DM Mono',monospace",                base: 0.50 },
      { t: 'import torch',      font: "300 12px 'DM Mono',monospace",                base: 0.55 },
      { t: 'predict(x)',        font: "300 12px 'DM Mono',monospace",                base: 0.52 },
      { t: '</>',               font: "300 28px 'DM Sans',sans-serif",               base: 0.62 },
      { t: '01010011',          font: "300 10px 'DM Mono',monospace",                base: 0.42 },
      // quotes
      { t: 'built to last',      font: "300 italic 15px 'Cormorant Garamond',serif", base: 0.60 },
      { t: 'systems that think', font: "300 italic 13px 'Cormorant Garamond',serif", base: 0.58 },
      { t: 'from data to deploy',font: "300 italic 12px 'Cormorant Garamond',serif", base: 0.52 },
      { t: 'craft & code',       font: "300 italic 17px 'Cormorant Garamond',serif", base: 0.62 },
      { t: 'every project ships',font: "300 italic 12px 'Cormorant Garamond',serif", base: 0.52 },
    ];

    interface Frag {
      t: string; font: string; base: number;
      x: number; y: number; vy: number; vx: number;
      alpha: number; phase: number; drift: number;
    }
    let frags: Frag[] = [];

    const buildFrags = () => {
      // Spawn 3 copies of each fragment at different positions for density
      frags = [];
      for (let copy = 0; copy < 4; copy++) {
        FRAGMENTS_SRC.forEach(s => {
          frags.push({
            ...s,
            x: W * 0.52 + Math.random() * W * 0.46,
            y: Math.random() * H,
            vy: -(1.1 + Math.random() * 1.1),
            vx: (Math.random() - 0.5) * 0.1,
            alpha: s.base * 0.8 + Math.random() * s.base * 1.1,
            phase: Math.random() * Math.PI * 2,
            drift: (Math.random() - 0.5) * 0.32,
          });
        });
      }
    };

    const resize = () => {
      W = canvas.offsetWidth;
      H = canvas.offsetHeight;
      canvas.width = W * DPR;
      canvas.height = H * DPR;
      ctx.scale(DPR, DPR);
      buildFrags();
    };
    resize();
    window.addEventListener('resize', resize);

    const onMouseMove = (e: MouseEvent) => {
      const r = canvas.getBoundingClientRect();
      mouse = { x: e.clientX - r.left, y: e.clientY - r.top };
    };
    const onMouseLeave = () => { mouse = { x: -9999, y: -9999 }; };
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseleave', onMouseLeave);



    let t = 0;
    const draw = () => {
      ctx.clearRect(0, 0, W, H);
      t += 0.012;

      // rings removed

      // Floating fragments — fade based on x position (organic left fade)
      frags.forEach(f => {
        f.y += f.vy;
        f.x += f.vx + Math.sin(t * 0.4 + f.phase) * f.drift;
        if (f.y < -50) f.y = H + 20;
        if (f.x < -100) f.x = W + 20;
        if (f.x > W + 100) f.x = -20;

        // Mouse proximity boost
        const dx = f.x - mouse.x, dy = f.y - mouse.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        const boost = dist < 110 ? (1 - dist / 110) * 0.3 : 0;

        // Organic left fade — starts fading from 45% of width, fully gone by 20%
        // No hard boundary — pure gradual opacity based on x position
        const fadeStart = W * 0.62;
        const fadeEnd   = W * 0.50;
        const xFade = f.x < fadeStart
          ? Math.max(0, (f.x - fadeEnd) / (fadeStart - fadeEnd))
          : 1;

        const breathe = f.base * (0.65 + Math.sin(t * 0.55 + f.phase) * 0.35);
        const finalA = Math.min(0.88, (breathe + boost) * xFade);
        if (finalA < 0.01) return;

        ctx.font = f.font;
        ctx.fillStyle = `rgba(235,235,240,${finalA})`;
        ctx.textBaseline = 'middle';
        ctx.fillText(f.t, f.x, f.y);
      });

      animId = requestAnimationFrame(draw);
    };
    draw();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', resize);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseleave', onMouseLeave);
    };
  }, []);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;1,300&family=DM+Sans:wght@300;400;500&family=DM+Mono:wght@300&display=swap');

        .hero-root {
          position: absolute; inset: 0;
          display: flex; align-items: center;
          pointer-events: none; z-index: 10;
          overflow: hidden;
        }
        .hero-canvas {
          position: absolute; inset: 0;
          width: 100%; height: 100%;
          pointer-events: none;
        }
        .hero-left {
          position: relative; z-index: 2;
          flex: 0 0 52%;
          padding: 0 0 0 11%;
          display: flex; flex-direction: column;
          justify-content: center;
          pointer-events: auto;
        }
        .hero-prefix {
          font-family: 'DM Sans', sans-serif;
          font-size: 14px; font-weight: 400;
          letter-spacing: 0.32em; text-transform: uppercase;
          color: rgba(230,230,235,0.75);
          margin-bottom: 18px;
          opacity: 0; transform: translateY(8px);
          transition: opacity 0.9s ease 0.1s, transform 0.9s ease 0.1s;
        }
        .hero-name {
          font-family: 'Cormorant Garamond', serif;
          font-size: clamp(68px, 9.5vw, 122px);
          font-weight: 300; letter-spacing: -0.02em;
          color: rgba(245,245,250,0.98);
          line-height: 0.95; margin: 0 0 24px;
          opacity: 0; transform: translateY(12px);
          transition: opacity 0.9s ease 0.22s, transform 0.9s ease 0.22s;
        }
        .hero-divider {
          width: 48px; height: 1px;
          background: rgba(230,230,240,0.5);
          margin-bottom: 24px;
          opacity: 0;
          transition: opacity 0.9s ease 0.38s;
        }
        .hero-tagline {
          font-family: 'DM Sans', sans-serif;
          font-size: 18px; font-weight: 300;
          color: rgba(225,225,230,0.78);
          line-height: 1.75; margin: 0 0 38px;
          max-width: 340px;
          opacity: 0; transform: translateY(8px);
          transition: opacity 0.9s ease 0.5s, transform 0.9s ease 0.5s;
        }
        .hero-buttons {
          display: flex; gap: 10px; flex-wrap: wrap;
          opacity: 0; transform: translateY(8px);
          transition: opacity 0.9s ease 0.65s, transform 0.9s ease 0.65s;
        }
        .btn-primary {
          padding: 11px 26px; border-radius: 999px;
          border: 0.5px solid rgba(200,198,194,0.38);
          background: rgba(200,198,194,0.07);
          color: rgba(229,228,226,0.9);
          font-family: 'DM Sans', sans-serif;
          font-size: 12px; font-weight: 400;
          letter-spacing: 0.09em; cursor: pointer;
          transition: background 0.22s ease, border-color 0.22s ease, transform 0.15s ease;
        }
        .btn-primary:hover {
          background: rgba(200,198,194,0.14);
          border-color: rgba(200,198,194,0.6);
          transform: translateY(-1px);
        }
        .btn-ghost {
          padding: 11px 26px; border-radius: 999px;
          border: 0.5px solid rgba(200,198,194,0.16);
          background: transparent;
          color: rgba(200,198,194,0.48);
          font-family: 'DM Sans', sans-serif;
          font-size: 12px; font-weight: 400;
          letter-spacing: 0.09em; cursor: pointer;
          transition: border-color 0.22s ease, color 0.22s ease, transform 0.15s ease;
        }
        .btn-ghost:hover {
          border-color: rgba(230,230,235,0.75);
          color: rgba(229,228,226,0.75);
          transform: translateY(-1px);
        }
        .hero-left.is-mounted .hero-prefix,
        .hero-left.is-mounted .hero-name,
        .hero-left.is-mounted .hero-divider,
        .hero-left.is-mounted .hero-tagline,
        .hero-left.is-mounted .hero-buttons {
          opacity: 1; transform: translateY(0);
        }
        @media (max-width: 640px) {
          .hero-left { flex: 0 0 100%; padding: 0 6%; }
          .hero-canvas { opacity: 0.4; }
        }
      `}</style>

      <div className={`hero-root ${className ?? ''}`}>
        {/* Floating fragments + orbital rings canvas */}
        <canvas ref={canvasRef} className="hero-canvas" />

        {/* Left text panel */}
        <div ref={containerRef} className={`hero-left ${mounted ? 'is-mounted' : ''}`}>
          <span ref={prefixRef} className="hero-prefix">
            Full Stack · ML Engineer
          </span>
          <h1 ref={nameRef} className="hero-name">
            Khushi<br />Devi
          </h1>
          <div ref={dividerRef} className="hero-divider" />
          <p ref={taglineRef} className="hero-tagline">
            Building systems that learn, scale,<br />
            and ship — from model to interface.
          </p>
          <div ref={buttonsRef} className="hero-buttons">
            <button 
              className="btn-primary"
              onClick={() => window.dispatchEvent(new Event('hero:viewWork'))}
            >
            View Work
            </button>

            <button 
              className="btn-ghost"
              onClick={() => window.dispatchEvent(new Event('hero:knowMe'))}
            >
            Know Me
            </button>
            <button 
            className="btn-ghost"
            onClick={() => window.dispatchEvent(new Event('hero:contact'))}
            >
            Contact Me
            </button>
          </div>
        </div>
      </div>
    </>
  );
}