import React from 'react'
import { motion, AnimatePresence, useMotionValue, animate, PanInfo } from 'framer-motion'
import { useState, useRef, useEffect, useCallback } from 'react'
import { projects } from '../data/projects.data'
import { Project } from '../data/projects.types'
import ProjectCard from './ProjectCard'
import ProjectDetail from './ProjectDetail'

interface ProjectsProps {
  cardRectRef: React.MutableRefObject<{
  x: number
  y: number
  w: number
  h: number
} | null>
}

const Projects = ({ cardRectRef }: ProjectsProps) => {
  const [selectedProject, setSelectedProject] = useState<Project | null>(null)
  const [originRect, setOriginRect] = useState<{ x: number; y: number; w: number; h: number } | null>(null)
  const [currentIndex, setCurrentIndex] = useState(0)
  const dragX = useMotionValue(0)
  const sectionRef = useRef<HTMLElement>(null)
  
  const lastNavTime = useRef(0)
  const accDelta = useRef(0)
  const isInsideSection = useRef(false)
  const isSectionFullyVisible = useRef(false)
  const isNavigating = useRef(false) // lock to prevent multi-card jumps

  const getCardStyle = (distance: number) => {
    const abs = Math.abs(distance)
    if (abs === 0) return { scale: 1,    opacity: 1,    xOffset: 0,   zIndex: 10 }
    if (abs === 1) return { scale: 0.86, opacity: 1,    xOffset: 480, zIndex: 5  }
                   return { scale: 0.70, opacity: 1,    xOffset: 780, zIndex: 1  }
  }

  const goTo = useCallback((idx: number) => {
    setCurrentIndex(Math.max(0, Math.min(projects.length - 1, idx)))
  }, [])

  // Card always rests at the exact center of the section — static, never chases animations
  useEffect(() => {
    const measure = () => {
      if (!sectionRef.current) return
      const section = sectionRef.current.getBoundingClientRect()
      const cardW = 400, cardH = 360
      cardRectRef.current = {
        x: (section.width  - cardW) / 2,
        y: (section.height - cardH) / 2,
        w: cardW,
        h: cardH,
      }
    }
    measure()
    window.addEventListener('resize', measure)
    return () => window.removeEventListener('resize', measure)
  }, [])

  const handleDragEnd = (_: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    // Only ever move one card per drag gesture
    if (info.offset.x > 60 && currentIndex > 0) {
      goTo(currentIndex - 1)
    } else if (info.offset.x < -60 && currentIndex < projects.length - 1) {
      goTo(currentIndex + 1)
    }
    animate(dragX, 0, { type: 'spring', stiffness: 300, damping: 30 })
  }

  // FIX 2: IntersectionObserver — only intercept scroll when section is fully in view
  useEffect(() => {
    const el = sectionRef.current
    if (!el) return

    const onEnter = () => { isInsideSection.current = true }
    const onLeave = () => { isInsideSection.current = false; accDelta.current = 0 }
    el.addEventListener('mouseenter', onEnter)
    el.addEventListener('mouseleave', onLeave)

    const observer = new IntersectionObserver(
      ([entry]) => {
        isSectionFullyVisible.current = entry.intersectionRatio >= 0.95
        if (!isSectionFullyVisible.current) accDelta.current = 0
      },
      { threshold: [0, 0.5, 0.95, 1.0] }
    )
    observer.observe(el)

    return () => {
      el.removeEventListener('mouseenter', onEnter)
      el.removeEventListener('mouseleave', onLeave)
      observer.disconnect()
    }
  }, [])

  useEffect(() => {
    const handleWheel = (e: WheelEvent) => {
      if (selectedProject) return

      // FIX 2: Only hijack when mouse is over section AND section is fully visible
      if (!isInsideSection.current || !isSectionFullyVisible.current) return

      const isHorizontalSwipe = Math.abs(e.deltaX) > Math.abs(e.deltaY)
      const delta = isHorizontalSwipe ? e.deltaX : e.deltaY

      const atStart = currentIndex === 0
      const atEnd   = currentIndex === projects.length - 1

      // Let page scroll through at edges (vertical scroll only)
      if (!isHorizontalSwipe) {
        if (atStart && delta < 0) return
        if (atEnd   && delta > 0) return
      }

      e.preventDefault()
      e.stopPropagation()

      // Hard lock — ignore all input while navigating, prevents multi-card jumps
      if (isNavigating.current) return

      accDelta.current += delta
      const now = Date.now()
      const isTrackpad = Math.abs(e.deltaY) < 50 || isHorizontalSwipe
      // Higher threshold for trackpad — require deliberate swipe, not a nudge
      const threshold = isTrackpad ? 55 : 35

      if (Math.abs(accDelta.current) >= threshold && now - lastNavTime.current > 420) {
        lastNavTime.current = now
        accDelta.current = 0
        isNavigating.current = true
        // Release lock after spring animation settles (~500ms)
        setTimeout(() => { isNavigating.current = false }, 520)

        if (delta > 0 && currentIndex < projects.length - 1) goTo(currentIndex + 1)
        if (delta < 0 && currentIndex > 0) goTo(currentIndex - 1)
      }
    }
    window.addEventListener('wheel', handleWheel, { passive: false })
    return () => window.removeEventListener('wheel', handleWheel)
  }, [currentIndex, goTo, selectedProject])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (selectedProject) return
      if ((e.key === 'ArrowRight' || e.key === 'ArrowDown') && currentIndex < projects.length - 1) goTo(currentIndex + 1)
      if ((e.key === 'ArrowLeft'  || e.key === 'ArrowUp')   && currentIndex > 0) goTo(currentIndex - 1)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [currentIndex, goTo, selectedProject])

  return (
    <>
      <section
        ref={sectionRef}
        style={{
          position: 'relative',
          width: '100%',
          height: '100vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          overflow: 'hidden',
          background: 'transparent',
          boxSizing: 'border-box',
        }}
      >
        <style>{`
          html { scrollbar-width: none; }
          html::-webkit-scrollbar { display: none; }
          body { -ms-overflow-style: none; }
        `}</style>

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
          style={{
            textAlign: 'center',
            position: 'relative',
            zIndex: 10,
            marginBottom: '36px',
            flexShrink: 0,
          }}
        >
          <p style={{
            fontSize: '10px',
            letterSpacing: '0.32em',
            textTransform: 'uppercase',
            color: 'rgba(200,198,194,0.5)',
            margin: '0 0 12px',
            fontFamily: "'DM Sans', sans-serif",
          }}>
            Engineering · Design · Deployment
          </p>
          <h2 style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontSize: 'clamp(36px, 5vw, 68px)',
            fontWeight: 300,
            letterSpacing: '-0.025em',
            color: 'rgba(229,228,226,0.90)',
            lineHeight: 1,
            margin: '0 0 10px',
          }}>
            Built to Last.
          </h2>
          <p style={{
            fontFamily: "'DM Sans', sans-serif",
            fontSize: '12px',
            color: 'rgba(200,198,194,0.5)',
            letterSpacing: '0.12em',
            margin: 0,
          }}>
            Every project ships with intent.
          </p>
        </motion.div>

        {/* Carousel */}
        <motion.div
          drag="x"
          dragConstraints={{ left: 0, right: 0 }}
          dragElastic={0.06}
          onDragEnd={handleDragEnd}
          style={{
            position: 'relative',
            width: '100%',
            height: 'clamp(340px, 42vh, 420px)',
            flexShrink: 0,
            cursor: 'grab',
            x: dragX,
          }}
          className="active:cursor-grabbing"
        >
          {/* Cards — drag is on this wrapper so it never blocks card clicks */}
          {projects.map((project, idx) => {
            const distance = idx - currentIndex
            const { scale, opacity, xOffset, zIndex } = getCardStyle(distance)
            const xPos = distance === 0 ? 0 : Math.sign(distance) * xOffset

            return (
              <motion.div
                key={project.id}
                data-card-id={project.id}
                style={{
                  position: 'absolute',
                  width: '400px',
                  left: '50%', top: '50%',
                  marginLeft: '-200px', marginTop: '-190px',
                  zIndex,
                  // FIX 1: All visible cards get pointer events, not just center
                  pointerEvents: Math.abs(distance) > 1 ? 'none' : 'auto',
                }}
                animate={{ x: xPos, scale, opacity }}
                transition={{ type: 'spring', stiffness: 160, damping: 32, mass: 1.6 }}
              >
                <ProjectCard
                  project={project}
                  isCenter={idx === currentIndex}
                  onClick={() => {
                    if (idx === currentIndex) {
                      // Capture the card's screen position at click time
                      const el = document.querySelector(`[data-card-id="${project.id}"]`)
                      if (el) {
                        const r = el.getBoundingClientRect()
                        setOriginRect({ x: r.left, y: r.top, w: r.width, h: r.height })
                      }
                      setSelectedProject(project)
                    } else {
                      goTo(idx)
                    }
                  }}
                />
              </motion.div>
            )
          })}

          {/* Prev arrow */}
          <AnimatePresence>
            {currentIndex > 0 && (
              <motion.button
                key="prev"
                initial={{ opacity: 0, x: -12 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -12 }}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.94 }}
                onClick={() => goTo(currentIndex - 1)}
                style={{
                  position: 'absolute',
                  left: 'calc(50% - 340px)', top: '50%',
                  transform: 'translateY(-50%)', zIndex: 30,
                  width: '42px', height: '42px', borderRadius: '50%',
                  background: 'rgba(200,198,194,0.04)',
                  border: '0.5px solid rgba(200,198,194,0.14)',
                  color: 'rgba(200,198,194,0.55)', fontSize: '18px',
                  cursor: 'pointer', backdropFilter: 'blur(8px)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}
              >←</motion.button>
            )}
          </AnimatePresence>

          {/* Next arrow */}
          <AnimatePresence>
            {currentIndex < projects.length - 1 && (
              <motion.button
                key="next"
                initial={{ opacity: 0, x: 12 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 12 }}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.94 }}
                onClick={() => goTo(currentIndex + 1)}
                style={{
                  position: 'absolute',
                  right: 'calc(50% - 340px)', top: '50%',
                  transform: 'translateY(-50%)', zIndex: 30,
                  width: '42px', height: '42px', borderRadius: '50%',
                  background: 'rgba(200,198,194,0.04)',
                  border: '0.5px solid rgba(200,198,194,0.14)',
                  color: 'rgba(200,198,194,0.55)', fontSize: '18px',
                  cursor: 'pointer', backdropFilter: 'blur(8px)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}
              >→</motion.button>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Counter + progress bar */}
        <div style={{
          display: 'flex', flexDirection: 'column', alignItems: 'center',
          gap: '10px', marginTop: '24px', flexShrink: 0, zIndex: 10,
        }}>
          <span style={{
            fontFamily: "'DM Sans', sans-serif",
            fontSize: '11px', letterSpacing: '0.18em',
            color: 'rgba(200,198,194,0.55)',
          }}>
            {String(currentIndex + 1).padStart(2, '0')} / {String(projects.length).padStart(2, '0')}
          </span>
          <div style={{
            width: '120px', height: '1px',
            background: 'rgba(200,198,194,0.1)', borderRadius: '999px',
            position: 'relative', overflow: 'hidden',
          }}>
            <motion.div
              animate={{ width: `${((currentIndex + 1) / projects.length) * 100}%` }}
              transition={{ type: 'spring', stiffness: 200, damping: 30 }}
              style={{
                position: 'absolute', left: 0, top: 0, height: '100%',
                background: 'linear-gradient(90deg, rgba(200,198,194,0.7), rgba(200,198,194,0.25))',
                borderRadius: '999px',
              }}
            />
          </div>
        </div>

        <motion.p
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.6 }}
          style={{
            marginTop: '14px', fontSize: '9px', letterSpacing: '0.24em',
            color: 'rgba(200,198,194,0.55)', textTransform: 'uppercase',
            fontFamily: "'DM Sans', sans-serif", flexShrink: 0,
          }}
        >
          Swipe · Scroll · Arrow keys
        </motion.p>
      </section>

      <AnimatePresence>
        {selectedProject && (
          <ProjectDetail
            project={selectedProject}
            originRect={originRect}
            onClose={() => { setSelectedProject(null); setOriginRect(null) }}
          />
        )}
      </AnimatePresence>
    </>
  )
}

export default Projects