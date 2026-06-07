import { useRef, useCallback } from 'react'
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion'
import { Project } from '../data/projects.types'

interface ProjectCardProps {
  project: Project
  isCenter: boolean
  onClick: () => void
}

// SVG symbols per project type
const Symbol = ({ type, accent }: { type: string; accent: string }) => {
  switch (type) {
    case 'pulse':
      return (
        <svg width="48" height="32" viewBox="0 0 48 32" fill="none">
          <polyline
            points="0,16 8,16 12,4 16,28 20,10 24,22 28,16 48,16"
            stroke={accent} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"
            style={{ filter: `drop-shadow(0 0 4px ${accent})` }}
          />
        </svg>
      )
    case 'spark':
      return (
        <svg width="36" height="36" viewBox="0 0 36 36" fill="none">
          <path d="M18 2 L21 15 L34 18 L21 21 L18 34 L15 21 L2 18 L15 15 Z"
            stroke={accent} strokeWidth="1.2" fill="none" strokeLinejoin="round"
            style={{ filter: `drop-shadow(0 0 5px ${accent})` }}
          />
        </svg>
      )
    case 'qr':
      return (
        <svg width="36" height="36" viewBox="0 0 36 36" fill="none">
          <rect x="2" y="2" width="13" height="13" rx="2" stroke={accent} strokeWidth="1.2" />
          <rect x="5" y="5" width="7" height="7" rx="1" fill={accent} opacity="0.5" />
          <rect x="21" y="2" width="13" height="13" rx="2" stroke={accent} strokeWidth="1.2" />
          <rect x="24" y="5" width="7" height="7" rx="1" fill={accent} opacity="0.5" />
          <rect x="2" y="21" width="13" height="13" rx="2" stroke={accent} strokeWidth="1.2" />
          <rect x="5" y="24" width="7" height="7" rx="1" fill={accent} opacity="0.5" />
          <rect x="21" y="21" width="5" height="5" rx="1" stroke={accent} strokeWidth="1.2" />
          <rect x="30" y="21" width="5" height="5" rx="1" stroke={accent} strokeWidth="1.2" />
          <rect x="21" y="30" width="5" height="5" rx="1" stroke={accent} strokeWidth="1.2" />
        </svg>
      )
    case 'network':
      return (
        <svg width="44" height="36" viewBox="0 0 44 36" fill="none">
          <circle cx="22" cy="18" r="4" stroke={accent} strokeWidth="1.2" style={{ filter: `drop-shadow(0 0 4px ${accent})` }} />
          <circle cx="6"  cy="8"  r="3" stroke={accent} strokeWidth="1.2" opacity="0.7" />
          <circle cx="38" cy="8"  r="3" stroke={accent} strokeWidth="1.2" opacity="0.7" />
          <circle cx="6"  cy="28" r="3" stroke={accent} strokeWidth="1.2" opacity="0.7" />
          <circle cx="38" cy="28" r="3" stroke={accent} strokeWidth="1.2" opacity="0.7" />
          <line x1="22" y1="18" x2="6"  y2="8"  stroke={accent} strokeWidth="0.8" opacity="0.5" />
          <line x1="22" y1="18" x2="38" y2="8"  stroke={accent} strokeWidth="0.8" opacity="0.5" />
          <line x1="22" y1="18" x2="6"  y2="28" stroke={accent} strokeWidth="0.8" opacity="0.5" />
          <line x1="22" y1="18" x2="38" y2="28" stroke={accent} strokeWidth="0.8" opacity="0.5" />
        </svg>
      )
    case 'dots':
    default:
      return (
        <svg width="44" height="14" viewBox="0 0 44 14" fill="none">
          {[7, 22, 37].map((cx, i) => (
            <circle key={i} cx={cx} cy="7" r="3" stroke={accent} strokeWidth="1.2" opacity={0.3 + i * 0.2} />
          ))}
        </svg>
      )
  }
}

const ProjectCard = ({ project, isCenter, onClick }: ProjectCardProps) => {
  const cardRef = useRef<HTMLDivElement>(null)
  const rawX = useMotionValue(0)
  const rawY = useMotionValue(0)
  const springCfg = { stiffness: 160, damping: 24 }
  const rotateX = useSpring(useTransform(rawY, [-1, 1], [5, -5]), springCfg)
  const rotateY = useSpring(useTransform(rawX, [-1, 1], [-5, 5]), springCfg)

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current || !isCenter) return
    const rect = cardRef.current.getBoundingClientRect()
    rawX.set((e.clientX - (rect.left + rect.width / 2)) / (rect.width / 2))
    rawY.set((e.clientY - (rect.top + rect.height / 2)) / (rect.height / 2))
  }, [isCenter, rawX, rawY])

  const handleMouseLeave = useCallback(() => {
    rawX.set(0); rawY.set(0)
  }, [rawX, rawY])

  const accent = project.accentColor || 'rgba(200,198,194,0.5)'

  return (
    <motion.div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onClick={onClick}
      className="relative select-none"
      style={isCenter
        ? { rotateX, rotateY, transformStyle: 'preserve-3d', cursor: 'pointer' }
        : { cursor: 'pointer' }
      }
    >
      {/* Active border ring — center card */}
      {isCenter && (
        <div aria-hidden style={{
          position: 'absolute', inset: '-1px', borderRadius: '19px',
          pointerEvents: 'none', zIndex: 3,
          border: '1px solid rgba(200,198,194,0.26)',
          boxShadow: '0 0 18px rgba(200,198,194,0.06)',
        }} />
      )}

      {/* Side card border ring — subtle platinum edge */}
      {!isCenter && (
        <div aria-hidden style={{
          position: 'absolute', inset: '-1px', borderRadius: '19px',
          pointerEvents: 'none', zIndex: 3,
          border: '0.5px solid rgba(200,198,194,0.1)',
        }} />
      )}

      <div
        className="relative overflow-hidden flex flex-col"
        style={{
          width: '400px',
          borderRadius: '18px',
          background: 'linear-gradient(160deg, #181818 0%, #111111 50%, #0d0d0d 100%)',
          isolation: 'isolate',
          border: isCenter
            ? '0.5px solid rgba(200,198,194,0.22)'
            : '0.5px solid rgba(200,198,194,0.11)',
          boxShadow: isCenter
            ? `0 32px 80px rgba(0,0,0,0.88), 0 0 40px ${accent.replace('0.7', '0.06')}, inset 0 1px 0 rgba(200,198,194,0.04)`
            : '0 8px 24px rgba(0,0,0,0.5)',
          transition: 'box-shadow 0.5s ease, border-color 0.5s ease',
          transformStyle: 'preserve-3d',
        }}
      >
        {/* Visual area — gradient + symbol */}
        <div style={{
          height: '160px', flexShrink: 0, position: 'relative', overflow: 'hidden',
          background: project.gradient || 'linear-gradient(135deg, #0a0a0a, #111)',
          opacity: 1,
        }}>
          {/* Subtle noise overlay */}
          <div style={{
            position: 'absolute', inset: 0,
            background: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 200 200\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'n\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.85\' numOctaves=\'4\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23n)\' opacity=\'0.04\'/%3E%3C/svg%3E")',
            opacity: 0.4, pointerEvents: 'none',
          }} />

          {/* Symbol centered */}
          <div style={{
            position: 'absolute', inset: 0, display: 'flex',
            alignItems: 'center', justifyContent: 'center',
            opacity: isCenter ? 0.9 : 0.6,
            transition: 'opacity 0.4s ease',
          }}>
            <Symbol type={project.symbol || 'dots'} accent={accent.replace('0.7', '0.85')} />
          </div>

          {/* Accent glow at bottom */}
          <div style={{
            position: 'absolute', bottom: 0, left: 0, right: 0, height: '60px',
            background: `linear-gradient(to top, ${accent.replace('0.7', '0.12')}, transparent)`,
            pointerEvents: 'none',
          }} />

          {/* Bottom fade into card */}
          <div style={{
            position: 'absolute', inset: 0,
            background: 'linear-gradient(to bottom, transparent 45%, #111111 100%)',
            pointerEvents: 'none',
          }} />
        </div>

        {/* Text */}
        <div style={{ padding: '14px 20px 18px' }}>
          <h3 style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontSize: '1.28rem', fontWeight: 400, letterSpacing: '-0.015em',
            color: isCenter ? 'rgba(229,228,226,0.92)' : 'rgba(229,228,226,0.62)',
            marginBottom: '5px',
            transition: 'color 0.4s ease', lineHeight: 1.2,
          }}>
            {project.title}
          </h3>

          <p style={{
            fontSize: '11px',
            color: isCenter ? 'rgba(200,198,194,0.44)' : 'rgba(200,198,194,0.32)',
            lineHeight: 1.65, transition: 'color 0.4s ease',
            display: '-webkit-box', WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical', overflow: 'hidden',
          }}>
            {project.description}
          </p>

          {/* Tech tags */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '5px', marginTop: '10px' }}>
            {project.technologies?.slice(0, 4).map((tech) => (
              <span key={tech} style={{
                fontSize: '9px', letterSpacing: '0.07em', padding: '3px 8px',
                borderRadius: '999px',
                border: `0.5px solid ${isCenter ? 'rgba(200,198,194,0.18)' : 'rgba(229,228,226,0.12)'}`,
                color: isCenter ? 'rgba(200,198,194,0.45)' : 'rgba(229,228,226,0.28)',
                transition: 'all 0.4s ease', fontFamily: "'DM Sans', sans-serif",
              }}>
                {tech}
              </span>
            ))}
          </div>

          {/* Active line */}
          <div style={{
            marginTop: '14px', height: '0.5px',
            background: 'rgba(200,198,194,0.06)', borderRadius: '999px', overflow: 'hidden',
          }}>
            {isCenter && (
              <motion.div
                initial={{ scaleX: 0 }} animate={{ scaleX: 1 }}
                transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
                style={{
                  height: '100%',
                  background: `linear-gradient(90deg, ${accent.replace('0.7', '0.7')}, rgba(200,198,194,0.06))`,
                  transformOrigin: 'left',
                }}
              />
            )}
          </div>

          {/* Expand hint */}
          {isCenter && (
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}
              style={{ marginTop: '10px', display: 'flex', alignItems: 'center', gap: '5px' }}
            >
              {/* Expand icon circle */}
              <div style={{
                width: '18px', height: '18px', borderRadius: '50%',
                border: '0.5px solid rgba(200,198,194,0.2)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                background: 'rgba(200,198,194,0.04)',
              }}>
                <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="rgba(200,198,194,0.5)" strokeWidth="2">
                  <path d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
                </svg>
              </div>
              <span style={{
                fontSize: '9px', letterSpacing: '0.16em',
                color: 'rgba(200,198,194,0.22)', textTransform: 'uppercase',
                fontFamily: "'DM Sans', sans-serif",
              }}>
                Click to expand
              </span>
            </motion.div>
          )}
        </div>
      </div>
    </motion.div>
  )
}

export default ProjectCard