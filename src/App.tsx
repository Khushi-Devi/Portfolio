import { useState, useCallback } from 'react'
import Background from './components/Background'
import HeroText from './components/HeroText'
import Projects from './components/Projects'
import type { SkipRect } from './components/HeroText'

export default function App() {
  const [skipRects, setSkipRects] = useState<SkipRect[]>([])

  const handleSkipRects = useCallback((rects: SkipRect[]) => {
    setSkipRects(rects)
  }, [])

  return (
    <div style={{ background: '#050506' }}>

      {/* ── Hero section — Background + Text layered together ── */}
      <section style={{ position: 'relative', width: '100%', height: '100vh', overflow: 'hidden' }}>
        <Background
          skipRects={skipRects}
          style={{ position: 'absolute', inset: 0 }}
        />
        <HeroText onSkipRects={handleSkipRects} />
      </section>

      {/* ── Projects section — sits below hero, scrolls naturally ── */}
      <Projects />

    </div>
  )
}