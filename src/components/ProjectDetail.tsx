import { useRef, useEffect, useCallback } from 'react'
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion'
import { Project } from '../data/projects.types'

interface OriginRect { x: number; y: number; w: number; h: number }

interface ProjectDetailProps {
  project: Project
  originRect: OriginRect | null
  onClose: () => void
}

const Symbol = ({ type, accent }: { type: string; accent: string }) => {
  switch (type) {
    case 'pulse':
      return (
        <svg width="90" height="58" viewBox="0 0 90 58" fill="none">
          <polyline points="0,29 15,29 22,7 30,51 38,18 45,40 52,29 90,29"
            stroke={accent} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"
            style={{ filter: `drop-shadow(0 0 12px ${accent})` }} />
        </svg>
      )
    case 'spark':
      return (
        <svg width="72" height="72" viewBox="0 0 72 72" fill="none">
          <path d="M36 4 L41 30 L68 36 L41 42 L36 68 L31 42 L4 36 L31 30 Z"
            stroke={accent} strokeWidth="1.6" fill="none" strokeLinejoin="round"
            style={{ filter: `drop-shadow(0 0 12px ${accent})` }} />
        </svg>
      )
    case 'qr':
      return (
        <svg width="72" height="72" viewBox="0 0 72 72" fill="none">
          <rect x="2" y="2" width="28" height="28" rx="3" stroke={accent} strokeWidth="1.6" />
          <rect x="9" y="9" width="14" height="14" rx="2" fill={accent} opacity="0.45" />
          <rect x="42" y="2" width="28" height="28" rx="3" stroke={accent} strokeWidth="1.6" />
          <rect x="49" y="9" width="14" height="14" rx="2" fill={accent} opacity="0.45" />
          <rect x="2" y="42" width="28" height="28" rx="3" stroke={accent} strokeWidth="1.6" />
          <rect x="9" y="49" width="14" height="14" rx="2" fill={accent} opacity="0.45" />
          <rect x="42" y="42" width="12" height="12" rx="2" stroke={accent} strokeWidth="1.4" />
          <rect x="58" y="42" width="12" height="12" rx="2" stroke={accent} strokeWidth="1.4" />
          <rect x="42" y="58" width="12" height="12" rx="2" stroke={accent} strokeWidth="1.4" />
        </svg>
      )
    case 'network':
      return (
        <svg width="90" height="72" viewBox="0 0 90 72" fill="none">
          <circle cx="45" cy="36" r="8" stroke={accent} strokeWidth="1.6"
            style={{ filter: `drop-shadow(0 0 10px ${accent})` }} />
          <circle cx="10" cy="12" r="5" stroke={accent} strokeWidth="1.3" opacity="0.7" />
          <circle cx="80" cy="12" r="5" stroke={accent} strokeWidth="1.3" opacity="0.7" />
          <circle cx="10" cy="60" r="5" stroke={accent} strokeWidth="1.3" opacity="0.7" />
          <circle cx="80" cy="60" r="5" stroke={accent} strokeWidth="1.3" opacity="0.7" />
          <line x1="45" y1="36" x2="10" y2="12" stroke={accent} strokeWidth="0.9" opacity="0.5" />
          <line x1="45" y1="36" x2="80" y2="12" stroke={accent} strokeWidth="0.9" opacity="0.5" />
          <line x1="45" y1="36" x2="10" y2="60" stroke={accent} strokeWidth="0.9" opacity="0.5" />
          <line x1="45" y1="36" x2="80" y2="60" stroke={accent} strokeWidth="0.9" opacity="0.5" />
        </svg>
      )
    default:
      return (
        <svg width="72" height="22" viewBox="0 0 72 22" fill="none">
          {[12, 36, 60].map((cx, i) => (
            <circle key={i} cx={cx} cy="11" r="4.5" stroke={accent} strokeWidth="1.3"
              opacity={0.3 + i * 0.25} />
          ))}
        </svg>
      )
  }
}

const ProjectDetail = ({ project, onClose }: ProjectDetailProps) => {
  const overlayRef = useRef<HTMLDivElement>(null)
  const imageRef   = useRef<HTMLDivElement>(null)

  const rawX = useMotionValue(0)
  const rawY = useMotionValue(0)
  const springCfg = { stiffness: 100, damping: 20 }
  const rotateX = useSpring(useTransform(rawY, [-1, 1], [4, -4]), springCfg)
  const rotateY = useSpring(useTransform(rawX, [-1, 1], [-4, 4]), springCfg)

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    window.addEventListener('keydown', onKey)
    return () => {
      window.removeEventListener('keydown', onKey)
      document.body.style.overflow = prev
    }
  }, [onClose])

  const handleImageMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!imageRef.current) return
    const rect = imageRef.current.getBoundingClientRect()
    rawX.set((e.clientX - (rect.left + rect.width  / 2)) / (rect.width  / 2))
    rawY.set((e.clientY - (rect.top  + rect.height / 2)) / (rect.height / 2))
  }, [rawX, rawY])

  const handleImageMouseLeave = useCallback(() => {
    rawX.set(0); rawY.set(0)
  }, [rawX, rawY])

  const handleOverlayClick = useCallback((e: React.MouseEvent) => {
    if (e.target === overlayRef.current) onClose()
  }, [onClose])

  const sections = [
    ...(project.problem  ? [{ label: 'Problem',  text: project.problem  }] : []),
    ...(project.solution ? [{ label: 'Approach', text: project.solution }] : []),
    ...(project.impact   ? [{ label: 'Impact',   text: project.impact   }] : []),
  ]

  const accent = project.accentColor || 'rgba(200,198,194,0.5)'

  return (
    <motion.div
      ref={overlayRef}
      onClick={handleOverlayClick}
      initial={{ opacity: 1 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 1 }}
      transition={{ duration: 0 }}
      style={{
        position: 'fixed', top: 0, left: 0,
        width: '100vw', height: '100vh',
        zIndex: 9999,
        display: 'flex',
        overflow: 'hidden',
      }}
    >
      {/* ── LEFT PANEL — slides in from left, 30% width ── */}
      <motion.div
        ref={imageRef}
        onMouseMove={handleImageMouseMove}
        onMouseLeave={handleImageMouseLeave}

        style={{
          flex: '0 0 30%',
          width: '30%',
          height: '100vh',
          position: 'relative',
          overflow: 'hidden',
          background: project.gradient || '#030303',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          perspective: '1000px',
        }}
      >
        <motion.div
          style={{
            rotateX, rotateY,
            transformStyle: 'preserve-3d',
            width: '100%', height: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            position: 'relative',
          }}
        >
          {/* Symbol */}
          <motion.div
            initial={{ opacity: 0, scale: 0.7 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3, type: 'spring', stiffness: 180, damping: 18 }}
          >
            <Symbol type={project.symbol || 'dots'} accent={accent.replace('0.7', '0.95')} />
          </motion.div>

          {/* Ghost number */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35 }}
            style={{
              position: 'absolute', bottom: '36px', left: '32px',
              fontFamily: "'Cormorant Garamond', serif",
              fontSize: 'clamp(72px, 9vw, 120px)', fontWeight: 300,
              color: 'rgba(200,198,194,0.07)', letterSpacing: '-0.04em',
              lineHeight: 1, pointerEvents: 'none', userSelect: 'none',
            }}
          >
            {String(project.id ?? '').padStart(2, '0')}
          </motion.div>

          {/* Accent radial glow */}
          <div style={{
            position: 'absolute', inset: 0, pointerEvents: 'none',
            background: `radial-gradient(ellipse 80% 60% at 50% 50%, ${accent.replace('0.7', '0.12')} 0%, transparent 70%)`,
          }} />
        </motion.div>

        {/* Right edge fade into right panel */}
        <div style={{
          position: 'absolute', top: 0, right: 0,
          width: '80px', height: '100%',
          background: 'linear-gradient(to right, transparent, #161614)',
          pointerEvents: 'none',
        }} />
      </motion.div>

      {/* ── RIGHT PANEL — slides in from right, 70% width ── */}
      <motion.div

        style={{
          flex: 1,
          height: '100vh',
          overflowY: 'auto',
          overflowX: 'hidden',
          background: 'linear-gradient(160deg, #161614 0%, #131312 50%, #111110 100%)',
          borderLeft: `1px solid ${accent.replace('0.7', '0.12')}`,
          position: 'relative',
        }}
      >
        {/* Close button */}
        <motion.button
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
          whileHover={{ scale: 1.08, background: 'rgba(200,198,194,0.1)' }}
          whileTap={{ scale: 0.95 }}
          onClick={onClose}
          style={{
            position: 'absolute', top: '28px', right: '32px', zIndex: 10,
            width: '44px', height: '44px', borderRadius: '50%',
            background: 'rgba(200,198,194,0.05)',
            border: '0.5px solid rgba(200,198,194,0.2)',
            color: 'rgba(229,228,226,0.7)', cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '22px', fontWeight: 300, lineHeight: 1,
          }}
        >×</motion.button>

        {/* Content */}
        <div style={{ padding: '72px 64px 96px 56px' }}>

          {/* Eyebrow */}
          <motion.p
            initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            style={{
              fontFamily: "'DM Sans', sans-serif",
              fontSize: '11px', letterSpacing: '0.32em',
              textTransform: 'uppercase',
              color: accent.replace('0.7', '0.6'),
              marginBottom: '14px', fontWeight: 500,
            }}
          >
            Project {String(project.id ?? '').padStart(2, '0')}
          </motion.p>

          {/* Title — large, bright */}
          <motion.h1
            initial={{ opacity: 0, x: 24 }} animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.24 }}
            style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontSize: 'clamp(36px, 4vw, 58px)',
              fontWeight: 400, letterSpacing: '-0.025em',
              color: 'rgba(235,233,230,0.97)',
              marginBottom: '8px', lineHeight: 1.1,
            }}
          >
            {project.title}
          </motion.h1>

          {/* Thin accent line under title */}
          <motion.div
            initial={{ scaleX: 0 }} animate={{ scaleX: 1 }}
            transition={{ delay: 0.3, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            style={{
              height: '1px', width: '60px',
              background: accent.replace('0.7', '0.6'),
              transformOrigin: 'left',
              marginBottom: '28px',
            }}
          />

          {/* Description */}
          <motion.p
            initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.28 }}
            style={{
              fontFamily: "'DM Sans', sans-serif",
              fontSize: '16px', lineHeight: 1.8,
              color: 'rgba(210,208,205,0.72)',
              marginBottom: '44px',
              paddingLeft: '18px',
              borderLeft: `2px solid ${accent.replace('0.7', '0.35')}`,
              fontWeight: 300,
            }}
          >
            {project.description}
          </motion.p>

          {/* Divider */}
          <div style={{
            height: '0.5px',
            background: 'linear-gradient(90deg, rgba(200,198,194,0.15), transparent)',
            marginBottom: '36px',
          }} />

          {/* Sections */}
          {sections.map(({ label, text }, si) => (
            <motion.div
              key={label}
              initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.32 + si * 0.06 }}
              style={{ marginBottom: '32px' }}
            >
              <p style={{
                fontFamily: "'DM Sans', sans-serif",
                fontSize: '10px', letterSpacing: '0.3em',
                textTransform: 'uppercase',
                color: accent.replace('0.7', '0.65'),
                marginBottom: '10px', fontWeight: 600,
              }}>{label}</p>
              <p style={{
                fontFamily: "'DM Sans', sans-serif",
                fontSize: '15px', lineHeight: 1.82,
                color: 'rgba(215,213,210,0.72)',
                fontWeight: 300,
              }}>{text}</p>
            </motion.div>
          ))}

          {/* Divider */}
          <div style={{
            height: '0.5px',
            background: 'linear-gradient(90deg, rgba(200,198,194,0.15), transparent)',
            marginBottom: '30px',
          }} />

          {/* Stack */}
          {project.technologies?.length > 0 && (
            <motion.div
              initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.44 }}
              style={{ marginBottom: '40px' }}
            >
              <p style={{
                fontFamily: "'DM Sans', sans-serif",
                fontSize: '10px', letterSpacing: '0.3em',
                textTransform: 'uppercase',
                color: 'rgba(200,198,194,0.38)',
                marginBottom: '14px', fontWeight: 600,
              }}>Stack</p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                {project.technologies.map((tech, i) => (
                  <motion.span
                    key={tech}
                    initial={{ opacity: 0, scale: 0.88 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.46 + i * 0.02 }}
                    whileHover={{ scale: 1.06, color: 'rgba(235,233,230,0.9)' }}
                    style={{
                      fontFamily: "'DM Sans', sans-serif",
                      fontSize: '12.5px', padding: '6px 16px',
                      borderRadius: '999px',
                      background: accent.replace('0.7', '0.07'),
                      border: `0.5px solid ${accent.replace('0.7', '0.22')}`,
                      color: 'rgba(210,208,205,0.7)',
                      letterSpacing: '0.03em', cursor: 'default',
                      transition: 'all 0.2s ease',
                    }}
                  >{tech}</motion.span>
                ))}
              </div>
            </motion.div>
          )}

          {/* Divider */}
          <div style={{
            height: '0.5px',
            background: 'linear-gradient(90deg, rgba(200,198,194,0.15), transparent)',
            marginBottom: '36px',
          }} />

          {/* CTAs */}
          <motion.div
            initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 }}
            style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}
          >
            {project.liveUrl ? (
              <motion.a
                whileHover={{ scale: 1.04, boxShadow: `0 0 20px ${accent.replace('0.7', '0.2')}` }}
                whileTap={{ scale: 0.97 }}
                href={project.liveUrl} target="_blank" rel="noopener noreferrer"
                style={{
                  display: 'inline-flex', alignItems: 'center', gap: '9px',
                  padding: '13px 28px', borderRadius: '999px',
                  background: accent.replace('0.7', '0.1'),
                  border: `1px solid ${accent.replace('0.7', '0.45')}`,
                  color: 'rgba(235,233,230,0.95)', fontSize: '13px', fontWeight: 500,
                  letterSpacing: '0.07em', textDecoration: 'none',
                  fontFamily: "'DM Sans', sans-serif", cursor: 'pointer',
                  transition: 'box-shadow 0.3s ease',
                }}
              >
                Live Demo
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                  <polyline points="15 3 21 3 21 9" /><line x1="10" y1="14" x2="21" y2="3" />
                </svg>
              </motion.a>
            ) : (
              <div style={{
                display: 'inline-flex', alignItems: 'center',
                padding: '13px 28px', borderRadius: '999px',
                background: 'rgba(200,198,194,0.02)',
                border: '0.5px solid rgba(200,198,194,0.1)',
                color: 'rgba(200,198,194,0.3)', fontSize: '13px',
                letterSpacing: '0.07em', fontFamily: "'DM Sans', sans-serif",
              }}>
                Deploy Pending
              </div>
            )}
            {project.codeUrl && (
              <motion.a
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.97 }}
                href={project.codeUrl} target="_blank" rel="noopener noreferrer"
                style={{
                  display: 'inline-flex', alignItems: 'center', gap: '9px',
                  padding: '13px 28px', borderRadius: '999px',
                  background: 'rgba(200,198,194,0.03)',
                  border: '0.5px solid rgba(200,198,194,0.15)',
                  color: 'rgba(200,198,194,0.65)', fontSize: '13px', fontWeight: 500,
                  letterSpacing: '0.07em', textDecoration: 'none',
                  fontFamily: "'DM Sans', sans-serif", cursor: 'pointer',
                }}
              >
                View Code
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polyline points="16 18 22 12 16 6" /><polyline points="8 6 2 12 8 18" />
                </svg>
              </motion.a>
            )}
          </motion.div>

          {/* Close hint */}
          <motion.p
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.7 }}
            onClick={onClose}
            style={{
              marginTop: '48px', fontSize: '10px', letterSpacing: '0.26em',
              color: 'rgba(200,198,194,0.18)', cursor: 'pointer',
              textTransform: 'uppercase', fontFamily: "'DM Sans', sans-serif",
            }}
          >← Esc or click to close</motion.p>
        </div>
      </motion.div>
    </motion.div>
  )
}

export default ProjectDetail