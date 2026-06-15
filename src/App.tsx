import { useState, useCallback, useRef, useEffect } from 'react'
import HeroText from './components/HeroText'
import Projects from './components/Projects'
import NetworkBackground from './components/NetworkBackground'
import AboutSkills from './components/AboutSkills'
import Contact from './components/Contact'
import Character from './components/Character'
import Assistant from './components/Assistant'
import type { SkipRect } from './components/HeroText'

export default function App() {
  const [skipRects, setSkipRects] = useState<SkipRect[]>([])
  const [networkOpacity, setNetworkOpacity] = useState(0)
  const [assistantOpen, setAssistantOpen] = useState(false)
  const heroRef     = useRef<HTMLElement>(null)
  const projectsRef = useRef<HTMLDivElement>(null)
  const aboutRef    = useRef<HTMLDivElement>(null)
  const contactRef  = useRef<HTMLDivElement>(null)
  const cardRectRef = useRef<{ x: number; y: number; w: number; h: number } | null>(null)

  const handleSkipRects = useCallback((rects: SkipRect[]) => {
    setSkipRects(rects)
  }, [])

  // Fade network in as hero scrolls away
  useEffect(() => {
    const hero = heroRef.current
    if (!hero) return
    const observer = new IntersectionObserver(
      ([entry]) => setNetworkOpacity(1 - entry.intersectionRatio),
      { threshold: Array.from({ length: 21 }, (_, i) => i / 20) }
    )
    observer.observe(hero)
    return () => observer.disconnect()
  }, [])

  // Scroll helpers
  useEffect(() => {
    const onViewWork = () => projectsRef.current?.scrollIntoView({ behavior: 'smooth' })
    const onKnowMe   = () => aboutRef.current?.scrollIntoView({ behavior: 'smooth' })
    const onContact = () => document.getElementById('lets-talk')?.scrollIntoView({ behavior: 'smooth' })
    window.addEventListener('hero:viewWork', onViewWork)
    window.addEventListener('hero:knowMe',   onKnowMe)
    window.addEventListener('hero:contact',  onContact)
    return () => {
      window.removeEventListener('hero:viewWork', onViewWork)
      window.removeEventListener('hero:knowMe',   onKnowMe)
      window.removeEventListener('hero:contact',  onContact)
    }
  }, [])

  return (
    <div style={{ background: '#0a0a0a' }}>

      {/* ── Fixed Network Background ── */}
      <div style={{
        position: 'fixed', inset: 0, zIndex: 0,
        opacity: networkOpacity, transition: 'opacity 0.4s ease',
        pointerEvents: 'none',
      }}>
        <NetworkBackground cardRectRef={cardRectRef} />
      </div>

      {/* ── Hero ── */}
      <section
        ref={heroRef}
        style={{ position: 'relative', width: '100%', height: '100vh', overflow: 'hidden', zIndex: 1 }}
      >
        <HeroText onSkipRects={handleSkipRects} />
      </section>

      {/* ── Projects ── */}
      <div ref={projectsRef} style={{ position: 'relative', zIndex: 1 }}>
        <Projects cardRectRef={cardRectRef} />
      </div>

      {/* ── About & Skills ── */}
      <div ref={aboutRef} style={{ position: 'relative', zIndex: 1 }}>
        <AboutSkills />
      </div>

      {/* ── Contact + Right Now + FAQs ── */}
      <div ref={contactRef} style={{ position: 'relative', zIndex: 1 }}>
        <Contact />
      </div>

      {/* ── Persistent Assistant orb ── */}
      <Character onClick={() => setAssistantOpen(prev => !prev)} />
      <Assistant isOpen={assistantOpen} onClose={() => setAssistantOpen(false)} />

    </div>
  )
}