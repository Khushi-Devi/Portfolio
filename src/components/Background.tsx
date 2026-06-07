import { useEffect, useRef } from 'react'

export interface SkipRect {
  top: number; left: number; right: number; bottom: number;
}

interface BackgroundProps {
  skipRects?: SkipRect[]
  className?: string
  style?: React.CSSProperties
}

export default function Background({ className, style }: BackgroundProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')!
    const DPR = devicePixelRatio || 1
    let animId: number
    let W = 0, H = 0, t = 0

    const resize = () => {
      W = canvas.offsetWidth
      H = canvas.offsetHeight
      canvas.width  = W * DPR
      canvas.height = H * DPR
      ctx.setTransform(1,0,0,1,0,0)
      ctx.scale(DPR, DPR)
    }
    resize()
    window.addEventListener('resize', resize)

    const draw = () => {
      t += 0.003
      ctx.fillStyle = '#0a0a0a'
      ctx.fillRect(0, 0, W, H)

      // Subtle central radial glow
      const radial = ctx.createRadialGradient(W*0.5, H*0.48, 0, W*0.5, H*0.48, W*0.6)
      radial.addColorStop(0,   'rgba(200,198,194,0.022)')
      radial.addColorStop(0.5, 'rgba(200,198,194,0.007)')
      radial.addColorStop(1,   'rgba(0,0,0,0)')
      ctx.fillStyle = radial
      ctx.fillRect(0, 0, W, H)

      // Slow diagonal platinum sheen
      const sweep = ((t * 38) % (W + 400)) - 200
      const sg = ctx.createLinearGradient(sweep, 0, sweep + 280, H)
      sg.addColorStop(0,   'rgba(200,198,194,0)')
      sg.addColorStop(0.5, 'rgba(200,198,194,0.016)')
      sg.addColorStop(1,   'rgba(200,198,194,0)')
      ctx.fillStyle = sg
      ctx.fillRect(0, 0, W, H)

      // Vignette
      const vignette = ctx.createRadialGradient(W/2, H/2, H*0.28, W/2, H/2, H*0.82)
      vignette.addColorStop(0, 'rgba(0,0,0,0)')
      vignette.addColorStop(1, 'rgba(0,0,0,0.38)')
      ctx.fillStyle = vignette
      ctx.fillRect(0, 0, W, H)

      animId = requestAnimationFrame(draw)
    }
    draw()

    return () => {
      cancelAnimationFrame(animId)
      window.removeEventListener('resize', resize)
    }
  }, [])

  return (
    <div className={className} style={{
      position: 'relative', width: '100%', height: '100vh',
      background: '#0a0a0a', overflow: 'hidden', ...style,
    }}>
      <canvas ref={canvasRef} style={{ display: 'block', width: '100%', height: '100%' }} />
    </div>
  )
}