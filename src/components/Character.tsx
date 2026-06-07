import { useEffect, useRef } from "react";
import gsap from "gsap";

// ─── Props ────────────────────────────────────────────────────────────────────
interface CharacterProps {
  onClick?: () => void;
}

// ─── Shape Builder Helpers ────────────────────────────────────────────────────

const R = 13;

function buildFlower(petalR: number, pinchR: number, ctrl: number): string {
  const n = 5;
  const tips: { x: number; y: number; a: number }[] = [];
  const pinches: { x: number; y: number; a: number }[] = [];

  for (let i = 0; i < n; i++) {
    const tipA   = (i / n) * Math.PI * 2 - Math.PI / 2;
    const pinchA = tipA + Math.PI / n;
    tips.push({   x: Math.cos(tipA)   * petalR, y: Math.sin(tipA)   * petalR, a: tipA   });
    pinches.push({ x: Math.cos(pinchA) * pinchR, y: Math.sin(pinchA) * pinchR, a: pinchA });
  }

  let d = "";
  for (let i = 0; i < n; i++) {
    const cur  = tips[i];
    const pin  = pinches[i];
    const nxt  = tips[(i + 1) % n];

    const cp1x = Math.cos(cur.a + Math.PI / n * ctrl)  * petalR * 0.85;
    const cp1y = Math.sin(cur.a + Math.PI / n * ctrl)  * petalR * 0.85;
    const cp2x = Math.cos(pin.a - Math.PI / n * ctrl)  * pinchR * 1.40;
    const cp2y = Math.sin(pin.a - Math.PI / n * ctrl)  * pinchR * 1.40;
    const cp3x = Math.cos(pin.a + Math.PI / n * ctrl)  * pinchR * 1.40;
    const cp3y = Math.sin(pin.a + Math.PI / n * ctrl)  * pinchR * 1.40;
    const cp4x = Math.cos(nxt.a - Math.PI / n * ctrl)  * petalR * 0.85;
    const cp4y = Math.sin(nxt.a - Math.PI / n * ctrl)  * petalR * 0.85;

    const f = (v: number) => v.toFixed(4);
    if (i === 0) d += `M ${f(cur.x)} ${f(cur.y)} `;
    d += `C ${f(cp1x)} ${f(cp1y)} ${f(cp2x)} ${f(cp2y)} ${f(pin.x)} ${f(pin.y)} `;
    d += `C ${f(cp3x)} ${f(cp3y)} ${f(cp4x)} ${f(cp4y)} ${f(nxt.x)} ${f(nxt.y)} `;
  }
  return d + "Z";
}

const SHAPES = {
  circle:    `M0-${R}C${R * 0.55}-${R},${R}-${R * 0.55},${R},0C${R},${R * 0.55},${R * 0.55},${R},0,${R}C-${R * 0.55},${R},-${R},${R * 0.55},-${R},0C-${R},-${R * 0.55},-${R * 0.55},-${R},0,-${R}Z`,
  stretch:   `M0-${R * 1.58}C${R * 0.36}-${R * 1.58},${R * 0.58}-${R * 0.36},${R * 0.58},0C${R * 0.58},${R * 0.36},${R * 0.36},${R * 1.58},0,${R * 1.58}C-${R * 0.36},${R * 1.58},-${R * 0.58},${R * 0.36},-${R * 0.58},0C-${R * 0.58},-${R * 0.36},-${R * 0.36},-${R * 1.58},0,-${R * 1.58}Z`,
  ring:      `M0-${R}C${R * 0.55}-${R},${R}-${R * 0.55},${R},0C${R},${R * 0.55},${R * 0.55},${R},0,${R}C-${R * 0.55},${R},-${R},${R * 0.55},-${R},0C-${R},-${R * 0.55},-${R * 0.55},-${R},0,-${R}Z`,
  hourglass: `M0-${R * 1.12}C${R * 0.90}-${R * 1.12},${R * 0.26},-${R * 0.16},${R * 0.20},0C${R * 0.26},${R * 0.16},${R * 0.90},${R * 1.12},0,${R * 1.12}C-${R * 0.90},${R * 1.12},-${R * 0.26},${R * 0.16},-${R * 0.20},0C-${R * 0.26},-${R * 0.16},-${R * 0.90},-${R * 1.12},0,-${R * 1.12}Z`,
  organic:   `M0-${R * 1.08}C${R * 0.70}-${R * 1.22},${R * 1.18},-${R * 0.36},${R * 0.90},${R * 0.28}C${R * 0.66},${R * 0.94},-${R * 0.33},${R * 1.22},-${R * 0.73},${R * 0.84}C-${R * 1.24},${R * 0.40},-${R * 1.14},-${R * 0.62},-${R * 0.53},-${R * 0.94}C-${R * 0.16},-${R * 1.36},-${R * 0.20},-${R * 1.04},0,-${R * 1.08}Z`,
  teardrop:  `M0-${R * 1.28}C${R * 0.08}-${R * 1.28},${R * 0.95}-${R * 0.55},${R * 0.95},${R * 0.22}C${R * 0.95},${R * 0.82},${R * 0.52},${R * 1.18},0,${R * 1.18}C-${R * 0.52},${R * 1.18},-${R * 0.95},${R * 0.82},-${R * 0.95},${R * 0.22}C-${R * 0.95},-${R * 0.55},-${R * 0.08},-${R * 1.28},0,-${R * 1.28}Z`,
  infinity:  `M0-${R * 0.18}C-${R * 0.35}-${R * 0.72},-${R * 1.45}-${R * 0.75},-${R * 1.45},0C-${R * 1.45},${R * 0.75},-${R * 0.35},${R * 0.72},0,${R * 0.18}C${R * 0.35},${R * 0.72},${R * 1.45},${R * 0.75},${R * 1.45},0C${R * 1.45},-${R * 0.75},${R * 0.35},-${R * 0.72},0,-${R * 0.18}Z`,
  flower:    buildFlower(R * 1.18, R * 0.18, 0.55),
} as const;

type ShapeName = keyof typeof SHAPES;

const MORPH_SEQ: ShapeName[] = [
  "circle", "stretch", "teardrop", "circle",
  "ring",   "organic", "circle",   "hourglass",
  "circle", "infinity","flower",   "circle",
  "stretch","hourglass","circle",  "teardrop",
  "flower", "circle",  "ring",     "organic",
  "circle", "infinity","circle",   "flower",
];

const RING_HOLE_R = R * 0.42;
const INF_HOLE_R  = R * 0.40;
const INF_HOLE_X  = R * 0.72;

// ─── Component ────────────────────────────────────────────────────────────────
export default function Character({ onClick }: CharacterProps) {
  const wrapRef     = useRef<HTMLDivElement>(null);
  const svgRef      = useRef<SVGSVGElement>(null);
  const pathRef     = useRef<SVGPathElement>(null);
  const maskHoleRef = useRef<SVGCircleElement>(null);
  const infHoleLRef = useRef<SVGCircleElement>(null);
  const infHoleRRef = useRef<SVGCircleElement>(null);
  const ringEdgeRef = useRef<SVGCircleElement>(null);
  const infEdgeLRef = useRef<SVGCircleElement>(null);
  const infEdgeRRef = useRef<SVGCircleElement>(null);

  useEffect(() => {
    const wrap = wrapRef.current;
    const svg  = svgRef.current;
    const path = pathRef.current;
    if (!wrap || !svg || !path) return;

    path.setAttribute("d", SHAPES.circle);

    // ── LOOP 1 — VERTICAL FLOAT — 100% original ───────────────────────────
    const MARGIN    = 20;
    const FLOAT_DUR = 6.5;
    let floatTween: gsap.core.Tween | null = null;

    function floatUp() {
      const travel = window.innerHeight - MARGIN * 2 - 60;
      gsap.to(svg, { scaleX: 0.88, scaleY: 1.14, duration: 0.9, ease: "sine.out", transformOrigin: "50% 50%" });
      gsap.to(svg, { scaleX: 1.0, scaleY: 1.0, duration: 2.0, ease: "sine.inOut", delay: 1.2, transformOrigin: "50% 50%" });
      floatTween = gsap.to(wrap, {
        y: -travel, duration: FLOAT_DUR, ease: "sine.inOut",
        onComplete() {
          gsap.to(svg, {
            scaleX: 1.10, scaleY: 0.92, duration: 0.22, ease: "power2.out", transformOrigin: "50% 50%",
            onComplete() { gsap.to(svg, { scaleX: 1.0, scaleY: 1.0, duration: 0.45, ease: "elastic.out(1, 0.5)", transformOrigin: "50% 50%" }); },
          });
          floatDown();
        },
      });
    }

    function floatDown() {
      gsap.to(svg, { scaleX: 0.88, scaleY: 1.14, duration: 0.9, ease: "sine.out", transformOrigin: "50% 50%" });
      gsap.to(svg, { scaleX: 1.0, scaleY: 1.0, duration: 2.0, ease: "sine.inOut", delay: 1.2, transformOrigin: "50% 50%" });
      floatTween = gsap.to(wrap, {
        y: 0, duration: FLOAT_DUR, ease: "sine.inOut",
        onComplete() {
          gsap.to(svg, {
            scaleX: 1.10, scaleY: 0.92, duration: 0.22, ease: "power2.out", transformOrigin: "50% 50%",
            onComplete() { gsap.to(svg, { scaleX: 1.0, scaleY: 1.0, duration: 0.45, ease: "elastic.out(1, 0.5)", transformOrigin: "50% 50%" }); },
          });
          floatUp();
        },
      });
    }

    floatUp();

    // ── LOOP 2 — SHAPE MORPH — 100% original ──────────────────────────────
    const MORPH_DUR = 1.1;
    let   morphIdx  = 0;
    let   prevShape: ShapeName = "circle";
    let   morphTimer: gsap.core.Tween | null = null;

    function closeHoles(dur: number) {
      gsap.to(maskHoleRef.current,  { duration: dur, ease: "power2.inOut", attr: { r: 0 } });
      gsap.to(ringEdgeRef.current,  { duration: dur, ease: "power2.inOut", attr: { r: 0 } });
      gsap.to(infHoleLRef.current,  { duration: dur, ease: "power2.inOut", attr: { r: 0 } });
      gsap.to(infHoleRRef.current,  { duration: dur, ease: "power2.inOut", attr: { r: 0 } });
      gsap.to(infEdgeLRef.current,  { duration: dur, ease: "power2.inOut", attr: { r: 0 } });
      gsap.to(infEdgeRRef.current,  { duration: dur, ease: "power2.inOut", attr: { r: 0 } });
    }

    function morphNext() {
      const name        = MORPH_SEQ[morphIdx % MORPH_SEQ.length];
      morphIdx++;
      const isRing      = name      === "ring";
      const isInfinity  = name      === "infinity";
      const wasRing     = prevShape  === "ring";
      const wasInfinity = prevShape  === "infinity";

      if ((wasRing || wasInfinity) && !isRing && !isInfinity) closeHoles(MORPH_DUR * 0.5);
      if (isRing) {
        closeHoles(0.1);
        gsap.to(maskHoleRef.current, { duration: MORPH_DUR * 0.72, ease: "power2.inOut", attr: { r: RING_HOLE_R } });
        gsap.to(ringEdgeRef.current, { duration: MORPH_DUR * 0.72, ease: "power2.inOut", attr: { r: RING_HOLE_R } });
      }
      if (isInfinity) {
        closeHoles(0.1);
        gsap.to(infHoleLRef.current, { duration: MORPH_DUR * 0.72, ease: "power2.inOut", attr: { r: INF_HOLE_R }, delay: 0.15 });
        gsap.to(infHoleRRef.current, { duration: MORPH_DUR * 0.72, ease: "power2.inOut", attr: { r: INF_HOLE_R }, delay: 0.15 });
        gsap.to(infEdgeLRef.current, { duration: MORPH_DUR * 0.72, ease: "power2.inOut", attr: { r: INF_HOLE_R }, delay: 0.15 });
        gsap.to(infEdgeRRef.current, { duration: MORPH_DUR * 0.72, ease: "power2.inOut", attr: { r: INF_HOLE_R }, delay: 0.15 });
      }
      morphTimer = gsap.to(path, { duration: MORPH_DUR, ease: "sine.inOut", attr: { d: SHAPES[name] }, onComplete: morphNext });
      prevShape = name;
    }

    morphNext();

    // ── LOOP 3 — ROTATION — 100% original ─────────────────────────────────
    const rotTween = gsap.to(svg, { rotation: 360, duration: 22, ease: "none", repeat: -1, transformOrigin: "50% 50%" });

    // ── HOVER — 100% original ──────────────────────────────────────────────
    const handleEnter = () => gsap.to(svg, { scale: 1.35, duration: 0.5, ease: "back.out(1.8)", transformOrigin: "50% 50%" });
    const handleLeave = () => gsap.to(svg, { scale: 1.0,  duration: 0.6, ease: "elastic.out(1, 0.5)", transformOrigin: "50% 50%" });

    svg.addEventListener("mouseenter", handleEnter);
    svg.addEventListener("mouseleave", handleLeave);

    return () => {
      floatTween?.kill();
      morphTimer?.kill();
      rotTween.kill();
      gsap.killTweensOf(wrap);
      gsap.killTweensOf(svg);
      gsap.killTweensOf(path);
      gsap.killTweensOf(maskHoleRef.current);
      gsap.killTweensOf(ringEdgeRef.current);
      gsap.killTweensOf(infHoleLRef.current);
      gsap.killTweensOf(infHoleRRef.current);
      gsap.killTweensOf(infEdgeLRef.current);
      gsap.killTweensOf(infEdgeRRef.current);
      svg.removeEventListener("mouseenter", handleEnter);
      svg.removeEventListener("mouseleave", handleLeave);
    };
  }, []);

  return (
    <div
      ref={wrapRef}
      onClick={onClick}
      style={{
        position:       "fixed",
        right:          "36px",  // shifted further left (was 24px)
        bottom:         "40px",  // lifted up (was 20px)
        zIndex:         50,
        width:          "71px",
        height:         "71px",
        display:        "flex",
        alignItems:     "center",
        justifyContent: "center",
        cursor:         "pointer",
        pointerEvents:  "none",
      }}
    >
      <svg
        ref={svgRef}
        width="71"
        height="71"
        viewBox="-35 -35 70 70"
        overflow="visible"
        style={{ pointerEvents: "auto", overflow: "visible" }}
      >
        <defs>
          {/* Fill gradient — 100% original, untouched */}
          <radialGradient id="char-fill" cx="32%" cy="28%" r="68%">
            <stop offset="0%"   stopColor="rgba(255,255,255,0.60)" />
            <stop offset="45%"  stopColor="rgba(140,205,255,0.22)" />
            <stop offset="100%" stopColor="rgba(80,140,255,0.07)"  />
          </radialGradient>

          {/*
            CHANGED — glow filter: boosts perceived brightness by blending
            a colour-amplified blur behind the original source graphic.
            The feColorMatrix multiplies the RGB channels and boosts alpha
            so the shape radiates light without altering the fill colours.
          */}
          <filter id="char-glow" x="-70%" y="-70%" width="240%" height="240%">
            <feGaussianBlur in="SourceGraphic" stdDeviation="3" result="blur" />
            <feColorMatrix
              in="blur" type="matrix"
              values="1 0 0 0 0.35
                      0 1 0 0 0.55
                      0 0 1 0 1.00
                      0 0 0 3.2 0"
              result="coloredGlow"
            />
            <feMerge>
              <feMergeNode in="coloredGlow" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>

          <mask id="char-mask">
            <rect x="-35" y="-35" width="70" height="70" fill="white" />
            <circle ref={maskHoleRef} cx="0"          cy="0" r="0" fill="black" />
            <circle ref={infHoleLRef} cx={-INF_HOLE_X} cy="0" r="0" fill="black" />
            <circle ref={infHoleRRef} cx={INF_HOLE_X}  cy="0" r="0" fill="black" />
          </mask>
        </defs>

        {/* Main shape — glow filter applied here for brightness */}
        <g mask="url(#char-mask)" filter="url(#char-glow)">
          <path
            ref={pathRef}
            fill="url(#char-fill)"
            stroke="rgba(210,235,255,0.80)" // CHANGED: was 0.62 — slightly brighter stroke
            strokeWidth="1.0"               // CHANGED: was 0.8 — marginally thicker
          />
        </g>

        {/* Inner edges — CHANGED: slightly brighter */}
        <circle ref={ringEdgeRef} cx="0"          cy="0" r="0" fill="none" stroke="rgba(180,220,255,0.75)" strokeWidth="0.7" />
        <circle ref={infEdgeLRef} cx={-INF_HOLE_X} cy="0" r="0" fill="none" stroke="rgba(180,220,255,0.75)" strokeWidth="0.7" />
        <circle ref={infEdgeRRef} cx={INF_HOLE_X}  cy="0" r="0" fill="none" stroke="rgba(180,220,255,0.75)" strokeWidth="0.7" />

        {/* Highlights — CHANGED: boosted opacity for more pop */}
        <ellipse cx="-4" cy="-6" rx="4" ry="2.8" fill="rgba(255,255,255,0.60)" transform="rotate(-18,-4,-6)" style={{ pointerEvents: "none" }} />
        <circle  cx="-6" cy="-8" r="1.1"          fill="rgba(255,255,255,0.88)"                              style={{ pointerEvents: "none" }} />
        <ellipse cx="5"  cy="6"  rx="2.5" ry="1.5" fill="rgba(255,255,255,0.25)" transform="rotate(15,5,6)"  style={{ pointerEvents: "none" }} />
      </svg>
    </div>
  );
}