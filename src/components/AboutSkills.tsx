import { motion } from 'framer-motion'
import { skillGroups } from '../data/skills.data'

const cardVariants = {
  hidden: { opacity: 0, y: 32 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.09, duration: 0.7, ease: [0.22, 1, 0.36, 1] },
  }),
}

export default function AboutSkills() {
  return (
    <>
      <style>{`
        @media (max-width: 860px) {
          .who-i-am-grid {
            grid-template-columns: 1fr !important;
          }
          .what-i-know-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>

      {/* ══════════════════════════════════════════
          SECTION 1 — Who I Am
      ══════════════════════════════════════════ */}
      <section
        id="about"
        style={{
          position: 'relative',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'flex-start',
          background: 'transparent',
          padding: '40px 0 40px',
          boxSizing: 'border-box',
        }}
      >
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
          style={{ textAlign: 'center', marginBottom: '28px', width: '100%' }}
        >
          <p style={{
            fontSize: '10px', letterSpacing: '0.32em', textTransform: 'uppercase',
            color: 'rgba(200,198,194,0.50)', margin: '0 0 12px',
            fontFamily: "'DM Sans', sans-serif",
          }}>
            The person behind the code
          </p>
          <h2 style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontSize: 'clamp(36px, 5vw, 68px)', fontWeight: 300,
            letterSpacing: '-0.025em', color: 'rgba(229,228,226,0.90)',
            lineHeight: 1, margin: '0 0 10px',
          }}>
            Who I Am.
          </h2>
          <p style={{
            fontFamily: "'DM Sans', sans-serif", fontSize: '12px',
            color: 'rgba(200,198,194,0.50)', letterSpacing: '0.12em', margin: 0,
          }}>
            Not just a stack. A story.
          </p>
        </motion.div>

        {/* Three-column equal layout — full width, equal height */}
        <div className="who-i-am-grid" style={{
          width: '100%',
          maxWidth: '1400px',
          padding: '0 48px',
          boxSizing: 'border-box',
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: '16px',
          alignItems: 'stretch',
        }}>

          {/* COL 1 — About (solid dark card) */}
          <motion.div
            custom={0} variants={cardVariants} initial="hidden"
            whileInView="visible" viewport={{ once: true }}
            style={{
              borderRadius: '20px',
              background: 'linear-gradient(160deg, #181818 0%, #111111 50%, #0d0d0d 100%)',
              border: '0.5px solid rgba(200,198,194,0.14)',
              padding: '28px 30px 24px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
            }}
          >
            <div>
              <p style={{
                fontFamily: "'DM Sans', sans-serif", fontSize: '10px',
                letterSpacing: '0.3em', textTransform: 'uppercase',
                color: 'rgba(200,198,194,0.68)', margin: '0 0 16px',
              }}>About</p>
              <p style={{
                fontFamily: "'Cormorant Garamond', serif",
                fontSize: 'clamp(15px, 1.2vw, 18px)', fontWeight: 300,
                color: 'rgba(229,228,226,0.82)', lineHeight: 1.8,
                margin: 0, letterSpacing: '0.01em',
              }}>
                I bring experience across Artificial Intelligence, Machine Learning,
                Full-Stack Development, and Data Analytics, with a strong focus on
                designing and implementing end-to-end solutions. I specialize in
                transforming complex concepts into practical, high-impact solutions —
                managing projects from architecture and development to testing and deployment.
              </p>
            </div>
            <p style={{
              fontFamily: "'DM Sans', sans-serif", fontSize: '11px',
              fontWeight: 300, color: 'rgba(200,198,194,0.60)',
              lineHeight: 1.75, margin: '20px 0 0',
            }}>
              B.Tech · GLA University, Mathura
              <span style={{ color: 'rgba(200,198,194,0.35)', margin: '0 10px' }}>·</span>
              Aug 2024 – May 2028
            </p>
            <div
              style={{
                marginTop: '18px',
                display: 'flex',
                flexDirection: 'column',
                gap: '6px',
              }}
            >
              <p
                style={{
                  fontFamily: "'DM Sans', sans-serif",
                  fontSize: '10px',
                  letterSpacing: '0.28em',
                  textTransform: 'uppercase',
                  color: 'rgba(200,198,194,0.50)',
                  margin: 0,
                }}
              >
                Focus Areas
              </p>

              <p
                style={{
                  fontFamily: "'DM Sans', sans-serif",
                  fontSize: '13px',
                  color: 'rgba(229,228,226,0.72)',
                  lineHeight: 1.6,
                  margin: 0,
                }}
              >
                AI / ML · Full Stack · Data Analytics · Product Development
              </p>
            </div>
          </motion.div>

          {/* COL 2 — Currently (solid) + Quote (most translucent) stacked */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>

            {/* Currently — solid dark */}
            <motion.div
              custom={1} variants={cardVariants} initial="hidden"
              whileInView="visible" viewport={{ once: true }}
              style={{
                borderRadius: '20px',
                background: 'linear-gradient(160deg, #181818 0%, #111111 50%, #0d0d0d 100%)',
                border: '0.5px solid rgba(200,198,194,0.14)',
                padding: '24px 28px',
                display: 'flex',
                flexDirection: 'column',
                gap: '14px',
              }}
            >
              <p style={{
                fontFamily: "'DM Sans', sans-serif", fontSize: '10px',
                letterSpacing: '0.3em', textTransform: 'uppercase',
                color: 'rgba(200,198,194,0.68)', margin: 0,
              }}>Currently</p>
              <div style={{
                display: 'inline-flex', alignItems: 'center', gap: '7px',
                padding: '6px 14px', borderRadius: '999px',
                border: '0.5px solid rgba(52, 211, 153, 0.35)',
                background: 'rgba(52, 211, 153, 0.06)', width: 'fit-content',
              }}>
                <div style={{
                  width: '6px', height: '6px', borderRadius: '50%',
                  background: 'rgba(52, 211, 153, 0.9)',
                  boxShadow: '0 0 6px rgba(52, 211, 153, 0.7)',
                }} />
                <span style={{
                  fontFamily: "'DM Sans', sans-serif", fontSize: '11px',
                  color: 'rgba(52, 211, 153, 0.9)', letterSpacing: '0.06em',
                }}>Open to roles</span>
              </div>
              <p style={{
                fontFamily: "'Cormorant Garamond', serif",
                fontSize: 'clamp(26px, 2.2vw, 34px)',
                fontWeight: 300, color: 'rgba(229,228,226,0.88)',
                margin: 0, lineHeight: 1.25, letterSpacing: '-0.02em',
              }}>
                Full Stack<br />ML Engineering
              </p>
              <p style={{
                fontFamily: "'DM Sans', sans-serif", fontSize: '11px',
                color: 'rgba(200,198,194,0.58)', margin: 0,
              }}>📍 Mathura, Uttar Pradesh</p>
            </motion.div>

            {/* Quote — Wilson's Law */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 1.0, ease: [0.22, 1, 0.36, 1], delay: 0.15 }}
              style={{
                borderRadius: '20px',
                background: 'rgba(255,255,255,0.015)',
                backdropFilter: 'blur(16px)',
                WebkitBackdropFilter: 'blur(16px)',
                border: '0.5px solid rgba(200,198,194,0.09)',
                padding: '24px 28px 22px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'flex-start',
                gap: '10px',
                flex: 1,
              }}
            >
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '10px',
                }}
              >
                <p
                  style={{
                    fontFamily: "'DM Sans', sans-serif",
                    fontSize: '10px',
                    letterSpacing: '0.3em',
                    textTransform: 'uppercase',
                    color: 'rgba(200,198,194,0.50)',
                    margin: 0,
                  }}
                >
                  Wilson's Law
                </p>

                <p
                  style={{
                    fontFamily: "'Cormorant Garamond', serif",
                    fontSize: 'clamp(16px, 1.3vw, 20px)',
                    fontWeight: 400,
                    color: 'rgba(229,228,226,0.90)',
                    lineHeight: 1.6,
                    letterSpacing: '-0.01em',
                    margin: 0,
                  }}
                >
                  "If you prioritize knowledge and intelligence, everything else follows."
                </p>

                <p
                  style={{
                    fontFamily: "'DM Sans', sans-serif",
                    fontSize: '12px',
                    fontWeight: 500,
                    color: 'rgba(229,228,226,0.72)',
                    letterSpacing: '0.08em',
                    margin: '10px 0 0',
                  }}
                >
                  — The principle I build by.
                </p>
              </div>
            </motion.div>

          </div>

          {/* COL 3 — The longer version (medium translucent) */}
          <motion.div
            custom={2} variants={cardVariants} initial="hidden"
            whileInView="visible" viewport={{ once: true }}
            style={{
              borderRadius: '20px',
              background: 'rgba(255,255,255,0.035)',
              backdropFilter: 'blur(16px)',
              WebkitBackdropFilter: 'blur(16px)',
              border: '0.5px solid rgba(200,198,194,0.13)',
              boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.04)',
              padding: '36px 34px 30px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'flex-start',
            }}
          >
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '16px',
              }}
            >
              <p style={{
                fontFamily: "'Cormorant Garamond', serif",
                fontSize: 'clamp(16px, 1.25vw, 19px)',
                fontWeight: 400,
                color: 'rgba(229,228,226,0.90)',
                lineHeight: 1.65,
                letterSpacing: '-0.01em',
                margin: 0,
              }}>
                I don't think a career is something you discover once and then follow forever.
                My path has changed more than once, and each change has taught me something
                valuable about how I work, learn, and grow.
              </p>
              <p style={{
                fontFamily: "'DM Sans', sans-serif",
                fontSize: '14px',
                fontWeight: 400,
                color: 'rgba(200,198,194,0.75)',
                lineHeight: 1.8,
                margin: 0,
              }}>
                What has remained constant is my desire to build meaningful solutions —
                and the standard I hold myself to. Every project, challenge, and new skill
                is another step toward becoming someone capable of creating lasting impact
                through technology.
              </p>
            </div>

          </motion.div>

        </div>
      </section>

      {/* ══════════════════════════════════════════
          SECTION 2 — What I Know
      ══════════════════════════════════════════ */}
      <section style={{
        position: 'relative',
        width: '100%',
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'transparent',
        padding: '100px 0 120px',
        boxSizing: 'border-box',
      }}>
        <motion.div
          initial={{ opacity: 0, y: -18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
          style={{ textAlign: 'center', marginBottom: '64px' }}
        >
          <p style={{
            fontSize: '10px', letterSpacing: '0.32em', textTransform: 'uppercase',
            color: 'rgba(200,198,194,0.50)', margin: '0 0 12px',
            fontFamily: "'DM Sans', sans-serif",
          }}>
            Tools, languages, frameworks
          </p>
          <h2 style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontSize: 'clamp(36px, 5vw, 68px)', fontWeight: 300,
            letterSpacing: '-0.025em', color: 'rgba(229,228,226,0.90)',
            lineHeight: 1, margin: '0 0 10px',
          }}>
            What I Know.
          </h2>
          <p style={{
            fontFamily: "'DM Sans', sans-serif", fontSize: '12px',
            color: 'rgba(200,198,194,0.50)', letterSpacing: '0.12em', margin: 0,
          }}>
            The stack behind the work.
          </p>
        </motion.div>

        <div className="what-i-know-grid" style={{
          width: '100%', maxWidth: '1100px', padding: '0 48px',
          boxSizing: 'border-box', display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)', gap: '28px',
        }}>
          {skillGroups.map((group, gi) => (
            <motion.div
              key={group.label}
              custom={gi} variants={cardVariants} initial="hidden"
              whileInView="visible" viewport={{ once: true }}
              style={{
                gridColumn: group.span ? `span ${group.span}` : 'span 1',
                borderRadius: '20px',
                background: 'linear-gradient(160deg, #181818 0%, #111111 50%, #0d0d0d 100%)',
                border: `0.5px solid ${group.accent.replace('0.7', '0.15')}`,
                padding: '28px 30px 26px',
                display: 'flex', flexDirection: 'column', gap: '16px',
              }}
            >
              <p style={{
                fontFamily: "'DM Sans', sans-serif", fontSize: '10px',
                letterSpacing: '0.3em', textTransform: 'uppercase',
                color: group.accent.replace('0.7', '0.65'), margin: 0,
              }}>{group.label}</p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '7px' }}>
                {group.skills.map((skill) => (
                  <motion.span
                    key={skill}
                    whileHover={{ scale: 1.05 }}
                    style={{
                      fontFamily: "'DM Sans', sans-serif", fontSize: '11px',
                      padding: '4px 13px', borderRadius: '999px',
                      border: `0.5px solid ${group.accent.replace('0.7', '0.22')}`,
                      color: 'rgba(200,198,194,0.65)', letterSpacing: '0.03em',
                      cursor: 'default', transition: 'all 0.2s ease',
                      background: group.accent.replace('0.7', '0.05'),
                    }}
                  >{skill}</motion.span>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </section>
    </>
  )
}