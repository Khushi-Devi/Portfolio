import { useEffect, useRef } from 'react'

interface CardRect { x: number; y: number; w: number; h: number }

interface NetworkBackgroundProps {
  cardRectRef: React.RefObject<CardRect | null>
}

const NetworkBackground = ({ cardRectRef }: NetworkBackgroundProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')!

    let animId: number
    let W = 0, H = 0

    const resize = () => {
      W = canvas.offsetWidth
      H = canvas.offsetHeight
      canvas.width  = W * window.devicePixelRatio
      canvas.height = H * window.devicePixelRatio
      ctx.scale(window.devicePixelRatio, window.devicePixelRatio)
    }
    resize()
    window.addEventListener('resize', resize)

    const TOTAL = 52

    const makeNode = (i: number) => ({
      x: Math.random() * (W || window.innerWidth),
      y: Math.random() * (H || window.innerHeight),
      vx: (Math.random() - 0.5) * 0.06,
      vy: (Math.random() - 0.5) * 0.06,
      r: 16 + Math.random() * 20,
      pulse: Math.random() * Math.PI * 2,
      wanderAngle: Math.random() * Math.PI * 2,
      age: Math.floor(Math.random() * (900 + Math.random() * 600)),
      maxAge: 900 + Math.random() * 600,
    })

    const pts = Array.from({ length: TOTAL }, (_, i) => makeNode(i))

    let t = 0

    const getAnchors = () => {
      const cr = cardRectRef.current
      if (!cr) return []
      return [
        { x: cr.x,            y: cr.y            },
        { x: cr.x + cr.w,     y: cr.y            },
        { x: cr.x,            y: cr.y + cr.h     },
        { x: cr.x + cr.w,     y: cr.y + cr.h     },
        { x: cr.x + cr.w / 2, y: cr.y            },
        { x: cr.x + cr.w / 2, y: cr.y + cr.h     },
        { x: cr.x,            y: cr.y + cr.h / 2 },
        { x: cr.x + cr.w,     y: cr.y + cr.h / 2 },
      ]
    }

    const draw = () => {
      ctx.fillStyle = 'rgba(10,10,10,0.22)'
      ctx.fillRect(0, 0, W, H)
      t += 0.005

      pts.forEach((p, i) => {
        p.age++
        if (p.age >= p.maxAge) {
          const respawned = makeNode(i)
          respawned.age = 0
          Object.assign(p, respawned)
          return
        }

        const fadeIn  = Math.min(1, p.age / 120)
        const fadeOut = Math.min(1, (p.maxAge - p.age) / 120)
        const alpha   = fadeIn * fadeOut

        p.wanderAngle += (Math.random() - 0.5) * 0.015
        p.vx += Math.cos(p.wanderAngle) * 0.001
        p.vy += Math.sin(p.wanderAngle) * 0.001
        const spd = Math.sqrt(p.vx * p.vx + p.vy * p.vy)
        if (spd > 0.07) { p.vx *= 0.07 / spd; p.vy *= 0.07 / spd }
        p.x += p.vx; p.y += p.vy; p.pulse += 0.02
        if (p.x < -40 || p.x > W + 40) p.vx *= -1
        if (p.y < -40 || p.y > H + 40) p.vy *= -1

        ;(p as any).alpha = alpha
      })

      // Node-to-node lines
      for (let i = 0; i < pts.length; i++) {
        for (let j = i + 1; j < pts.length; j++) {
          const dx = pts[j].x - pts[i].x, dy = pts[j].y - pts[i].y
          const d  = Math.sqrt(dx * dx + dy * dy)
          if (d < 240) {
            const a = (1 - d / 240) * 0.52
            const combined = a * Math.min((pts[i] as any).alpha ?? 1, (pts[j] as any).alpha ?? 1)
            ctx.strokeStyle = `rgba(200,198,194,${combined})`
            ctx.lineWidth = 0.6
            ctx.beginPath(); ctx.moveTo(pts[i].x, pts[i].y)
            ctx.lineTo(pts[j].x, pts[j].y); ctx.stroke()
          }
        }
      }

      // Lines to card anchors
      const anchors = getAnchors()
      pts.forEach((p, pi) => {
        const nodeAlpha = (p as any).alpha ?? 1
        anchors.forEach((a, ai) => {
          const dx = a.x - p.x, dy = a.y - p.y
          const d  = Math.sqrt(dx * dx + dy * dy)
          if (d < 220) {
            const base    = (1 - d / 220) * 0.85
            const flicker = 0.65 + Math.sin(t * 2.8 + pi * 0.7 + ai * 0.5) * 0.35
            ctx.strokeStyle = `rgba(220,218,214,${base * flicker * nodeAlpha})`
            ctx.lineWidth = 0.65
            ctx.beginPath(); ctx.moveTo(p.x, p.y); ctx.lineTo(a.x, a.y); ctx.stroke()
            if (Math.sin(t * 1.8 + pi * 0.9 + ai * 1.1) > 0.78) {
              const prog = Math.sin(t * 3.5 + pi * 0.4) * 0.5 + 0.5
              ctx.fillStyle = `rgba(235,233,229,${0.85 * nodeAlpha})`
              ctx.beginPath()
              ctx.arc(p.x + dx * prog, p.y + dy * prog, 1.4, 0, Math.PI * 2)
              ctx.fill()
            }
          }
        })
      })

      // Blobs
      pts.forEach(p => {
        const nodeAlpha = (p as any).alpha ?? 1
        const r = p.r * (0.92 + Math.sin(p.pulse) * 0.08)
        const g = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, r)
        g.addColorStop(0, `rgba(190,188,184,${0.18 * nodeAlpha})`)
        g.addColorStop(1, 'rgba(0,0,0,0)')
        ctx.fillStyle = g
        ctx.beginPath(); ctx.arc(p.x, p.y, r, 0, Math.PI * 2); ctx.fill()
      })

      // Node dots
      pts.forEach(p => {
        const nodeAlpha = (p as any).alpha ?? 1
        const b = 0.35 + Math.sin(p.pulse) * 0.35
        ctx.fillStyle = `rgba(215,213,209,${b * nodeAlpha})`
        ctx.beginPath(); ctx.arc(p.x, p.y, 1.3, 0, Math.PI * 2); ctx.fill()
      })

      // Anchor dots
      anchors.forEach((a, i) => {
        const bright = 0.3 + Math.sin(t * 2 + i * 0.9) * 0.25
        const g2 = ctx.createRadialGradient(a.x, a.y, 0, a.x, a.y, 9)
        g2.addColorStop(0, `rgba(220,218,214,${bright * 0.65})`)
        g2.addColorStop(1, 'rgba(0,0,0,0)')
        ctx.fillStyle = g2
        ctx.beginPath(); ctx.arc(a.x, a.y, 9, 0, Math.PI * 2); ctx.fill()
        ctx.fillStyle = `rgba(235,233,229,${bright})`
        ctx.beginPath(); ctx.arc(a.x, a.y, 1.6, 0, Math.PI * 2); ctx.fill()
      })

      // Diagonal sheen sweep
      const sweep = ((t * 55) % (W + 300)) - 150
      const sg = ctx.createLinearGradient(sweep, 0, sweep + 200, H)
      sg.addColorStop(0,   'rgba(200,198,194,0)')
      sg.addColorStop(0.5, 'rgba(200,198,194,0.025)')
      sg.addColorStop(1,   'rgba(200,198,194,0)')
      ctx.fillStyle = sg; ctx.fillRect(0, 0, W, H)

      animId = requestAnimationFrame(draw)
    }

    draw()
    return () => {
      cancelAnimationFrame(animId)
      window.removeEventListener('resize', resize)
    }
  }, [cardRectRef])

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'absolute',
        inset: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
      }}
    />
  )
}

export default NetworkBackground