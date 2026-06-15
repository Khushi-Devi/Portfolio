import { useEffect, useRef, useState } from 'react'

interface CharacterProps {
  onClick?: () => void
}

const R = 26
const CX = 36, CY = 36

export default function Character({ onClick }: CharacterProps) {
  const canvasRef  = useRef<HTMLCanvasElement>(null)
  const hoveredRef = useRef(false)
  const [tooltipVisible, setTooltipVisible] = useState(false)
  const [tooltipFading, setTooltipFading] = useState(false)

  // Show tooltip on first visit only
  useEffect(() => {
    
    

    const showTimer = setTimeout(() => {
      setTooltipVisible(true)

      // Auto fade out after 5 seconds
      const fadeTimer = setTimeout(() => {
        setTooltipFading(true)
        setTimeout(() => {
          setTooltipVisible(false)
          
        }, 600)
      }, 5000)

      return () => clearTimeout(fadeTimer)
    }, 2000)

    return () => clearTimeout(showTimer)
  }, [])

  const handleClick = () => {
    // Dismiss tooltip immediately on click
    if (tooltipVisible) {
      setTooltipFading(true)
      setTimeout(() => {
        setTooltipVisible(false)
        
      }, 400)
    }
    onClick?.()
  }

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')!
    const DPR = window.devicePixelRatio || 1

    canvas.width  = 72 * DPR
    canvas.height = 72 * DPR
    ctx.scale(DPR, DPR)

    let t = 0
    let hoverT = 0
    let raf: number
    const PI2 = Math.PI * 2

    function buildSurface(time: number, hv: number) {
      const pts: { x: number; y: number }[] = []
      const N = 128
      for (let i = 0; i < N; i++) {
        const angle = (i / N) * PI2 - Math.PI / 2
        const w1 = Math.sin(angle * 4 + time * 0.9)  * (1.8 + hv * 1.4)
        const w2 = Math.sin(angle * 6 - time * 1.3)  * (1.2 + hv * 1.0)
        const w3 = Math.sin(angle * 3 + time * 0.5 + 1.2) * (1.0 + hv * 0.8)
        const w4 = hv * Math.sin(angle * 9 + time * 2.4) * 1.8
        const w5 = Math.sin(angle * 5 - time * 0.7) * Math.cos(time * 0.4) * 1.0
        const r  = R + w1 + w2 + w3 + w4 + w5
        pts.push({ x: CX + Math.cos(angle) * r, y: CY + Math.sin(angle) * r })
      }
      return pts
    }

    function draw() {
      t += 0.016
      if (hoveredRef.current) hoverT = Math.min(hoverT + 0.06, 1)
      else hoverT = Math.max(hoverT - 0.04, 0)

      ctx.clearRect(0, 0, 72, 72)
      const pts = buildSurface(t, hoverT)

      // Outer halo
      const halo = ctx.createRadialGradient(CX, CY, R * 0.7, CX, CY, R + 18)
      halo.addColorStop(0, `rgba(228,226,222,${0.10 + hoverT * 0.10})`)
      halo.addColorStop(1, 'rgba(0,0,0,0)')
      ctx.fillStyle = halo
      ctx.beginPath(); ctx.arc(CX, CY, R + 18, 0, PI2); ctx.fill()

      // Surface
      ctx.beginPath()
      ctx.moveTo(pts[0].x, pts[0].y)
      for (let i = 1; i < pts.length; i++) {
        const curr = pts[i]
        const next = pts[(i + 1) % pts.length]
        const cpx2 = (curr.x + next.x) / 2
        const cpy2 = (curr.y + next.y) / 2
        ctx.quadraticCurveTo(curr.x, curr.y, cpx2, cpy2)
      }
      ctx.closePath()

      // Fill
      const fill = ctx.createRadialGradient(CX - 7, CY - 9, 2, CX, CY, R + 4)
      fill.addColorStop(0,    `rgba(255,255,255,${0.82 + hoverT * 0.10})`)
      fill.addColorStop(0.30, `rgba(232,230,226,${0.50 + hoverT * 0.08})`)
      fill.addColorStop(0.65, 'rgba(200,198,194,0.22)')
      fill.addColorStop(1,    'rgba(158,156,152,0.06)')
      ctx.fillStyle = fill
      ctx.fill()

      ctx.strokeStyle = `rgba(215,213,209,${0.52 + hoverT * 0.28})`
      ctx.lineWidth = 0.8
      ctx.stroke()

      // Highlight
      ctx.fillStyle = `rgba(255,255,255,${0.52 + hoverT * 0.18})`
      ctx.beginPath(); ctx.ellipse(CX - 8, CY - 10, 7, 4.2, -0.38, 0, PI2); ctx.fill()
      ctx.fillStyle = `rgba(255,255,255,${0.82 + hoverT * 0.12})`
      ctx.beginPath(); ctx.arc(CX - 11, CY - 13, 1.4, 0, PI2); ctx.fill()

      // Inner shimmer rings
      ctx.save(); ctx.clip()
      const shimmerA = 0.04 + hoverT * 0.08
      ctx.strokeStyle = `rgba(240,238,234,${shimmerA})`
      ctx.lineWidth = 1.2
      ctx.setLineDash([6, 10])
      ctx.lineDashOffset = -t * 18
      ctx.beginPath(); ctx.arc(CX, CY, R * 0.62, 0, PI2); ctx.stroke()
      ctx.lineDashOffset = t * 12
      ctx.strokeStyle = `rgba(240,238,234,${shimmerA * 0.6})`
      ctx.beginPath(); ctx.arc(CX, CY, R * 0.38, 0, PI2); ctx.stroke()
      ctx.setLineDash([]); ctx.restore()

      raf = requestAnimationFrame(draw)
    }

    draw()
    return () => cancelAnimationFrame(raf)
  }, [])

  return (
    <div style={{
      position: 'fixed',
      right: '36px',
      bottom: '36px',
      zIndex: 150,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
    }}>

      {/* Tooltip */}
      {tooltipVisible && (
        <div style={{
          position: 'absolute',
          bottom: '86px',
          right: '8px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-end',
          gap: '4px',
          opacity: tooltipFading ? 0 : 1,
          transform: tooltipFading ? 'translateY(6px)' : 'translateY(0)',
          transition: 'opacity 0.6s ease, transform 0.6s ease',
          animation: tooltipFading ? 'none' : 'tooltipIn 0.5s ease forwards',
          pointerEvents: 'none',
        }}>
          <span style={{
            fontFamily: "'DM Sans', sans-serif",
            fontSize: '11px',
            letterSpacing: '0.14em',
            textTransform: 'uppercase',
            color: 'rgba(200,198,194,0.75)',
            whiteSpace: 'nowrap',
            padding: '6px 12px',
            borderRadius: '999px',
            background: 'rgba(20,20,18,0.72)',
            backdropFilter: 'blur(12px)',
            WebkitBackdropFilter: 'blur(12px)',
            border: '0.5px solid rgba(200,198,194,0.18)',
            boxShadow: '0 4px 16px rgba(0,0,0,0.3)',
          }}>
            click me
          </span>

          {/* Curved arrow pointing down-right toward orb */}
          <svg
            width="28" height="32"
            viewBox="0 0 28 32"
            fill="none"
            style={{ marginRight: '10px' }}
          >
            <path
              d="M 6 2 C 6 18, 20 18, 22 28"
              stroke="rgba(200,198,194,0.55)"
              strokeWidth="1.2"
              strokeLinecap="round"
              fill="none"
              strokeDasharray="3 3"
            />
            {/* Arrowhead */}
            <path
              d="M 18 26 L 22 29 L 24 24"
              stroke="rgba(200,198,194,0.55)"
              strokeWidth="1.2"
              strokeLinecap="round"
              strokeLinejoin="round"
              fill="none"
            />
          </svg>
        </div>
      )}

      <style>{`
        @keyframes tooltipIn {
          from { opacity: 0; transform: translateY(8px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>

      {/* Orb */}
      <div
        onClick={handleClick}
        onMouseEnter={() => { hoveredRef.current = true }}
        onMouseLeave={() => { hoveredRef.current = false }}
        style={{ cursor: 'pointer', width: '72px', height: '72px' }}
      >
        <canvas
          ref={canvasRef}
          style={{ width: '72px', height: '72px' }}
        />
      </div>
    </div>
  )
}