import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { rightNow } from '../data/rightnow.data'
import { faqs } from '../data/faqs.data'

const cardVariants = {
  hidden: { opacity: 0, y: 28 },
  visible: (i: number) => ({
    opacity: 1, y: 0,
    transition: { delay: i * 0.1, duration: 0.75, ease: [0.22, 1, 0.36, 1] },
  }),
}

export default function Contact() {
  const [openFaq, setOpenFaq] = useState<number | null>(null)

  return (
    <>
      {/* ══════════════════════════════════════════
          SECTION 1 — Right Now
      ══════════════════════════════════════════ */}
      <section
        id="contact"
        style={{
          position: 'relative', width: '100%', minHeight: '100vh',
          display: 'flex', flexDirection: 'column', alignItems: 'center',
          justifyContent: 'center', background: 'transparent',
          padding: '100px 0 120px', boxSizing: 'border-box',
        }}
      >
        <motion.div
          initial={{ opacity: 0, y: -18 }} whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
          style={{ textAlign: 'center', marginBottom: '52px' }}
        >
          <p style={{
            fontSize: '10px', letterSpacing: '0.32em', textTransform: 'uppercase',
            color: 'rgba(200,198,194,0.50)', margin: '0 0 12px',
            fontFamily: "'DM Sans', sans-serif",
          }}>A snapshot of this moment</p>
          <h2 style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontSize: 'clamp(36px, 5vw, 68px)', fontWeight: 300,
            letterSpacing: '-0.025em', color: 'rgba(229,228,226,0.90)',
            lineHeight: 1, margin: '0 0 10px',
          }}>Right Now.</h2>
          <p style={{
            fontFamily: "'DM Sans', sans-serif", fontSize: '12px',
            color: 'rgba(200,198,194,0.50)', letterSpacing: '0.12em', margin: 0,
          }}>Not a résumé. Just honest.</p>
        </motion.div>

        <div style={{
          width: '100%', maxWidth: '1100px', padding: '0 48px',
          boxSizing: 'border-box', display: 'grid',
          gridTemplateColumns: 'repeat(2, 1fr)', gap: '28px',
        }}>
          {rightNow.map((card, i) => (
            <motion.div
              key={card.label} custom={i} variants={cardVariants}
              initial="hidden" whileInView="visible" viewport={{ once: true }}
              style={{
                borderRadius: '20px',
                background: 'linear-gradient(160deg, #181818 0%, #111111 50%, #0d0d0d 100%)',
                border: `0.5px solid ${card.accent.replace('0.7', '0.18')}`,
                padding: '32px 36px', display: 'flex', flexDirection: 'column',
                gap: '14px', minHeight: '160px', justifyContent: 'space-between',
              }}
            >
              <p style={{
                fontFamily: "'DM Sans', sans-serif", fontSize: '10px',
                letterSpacing: '0.3em', textTransform: 'uppercase',
                color: card.accent.replace('0.7', '0.65'), margin: 0,
              }}>{card.label}</p>
              <p style={{
                fontFamily: "'Cormorant Garamond', serif",
                fontSize: 'clamp(18px, 2vw, 26px)', fontWeight: 300,
                color: 'rgba(229,228,226,0.88)', margin: 0,
                lineHeight: 1.2, letterSpacing: '-0.01em',
              }}>{card.value}</p>
              <p style={{
                fontFamily: "'DM Sans', sans-serif", fontSize: '12px',
                color: 'rgba(200,198,194,0.38)', margin: 0,
                lineHeight: 1.6, fontStyle: 'italic',
              }}>{card.note}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ══════════════════════════════════════════
          SECTION 2 — Let's Talk (glass card)
      ══════════════════════════════════════════ */}
      <section  id="lets-talk" style={{
        position: 'relative', width: '100%', minHeight: '100vh',
        display: 'flex', flexDirection: 'column', alignItems: 'center',
        justifyContent: 'center', background: 'transparent',
        padding: '100px 48px', boxSizing: 'border-box',
      }}>
        <motion.div
          initial={{ opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
          style={{
            width: '100%', maxWidth: '700px',
            borderRadius: '28px',
            background: 'rgba(255,255,255,0.03)',
            backdropFilter: 'blur(24px)',
            WebkitBackdropFilter: 'blur(24px)',
            border: '0.5px solid rgba(200,198,194,0.18)',
            boxShadow: '0 8px 48px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.06)',
            padding: '72px 72px 64px',
            display: 'flex', flexDirection: 'column',
            alignItems: 'center', textAlign: 'center',
          }}
        >
          <p style={{
            fontSize: '10px', letterSpacing: '0.32em', textTransform: 'uppercase',
            color: 'rgba(200,198,194,0.55)', margin: '0 0 16px',
            fontFamily: "'DM Sans', sans-serif",
          }}>Don't be a stranger</p>

          <h2 style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontSize: 'clamp(42px, 6vw, 80px)', fontWeight: 300,
            letterSpacing: '-0.025em', color: 'rgba(229,228,226,0.95)',
            lineHeight: 1, margin: '0 0 28px',
          }}>Let's Talk.</h2>

          <div style={{
            width: '48px', height: '0.5px',
            background: 'rgba(200,198,194,0.3)',
            marginBottom: '28px',
          }} />

          <p style={{
            fontFamily: "'DM Sans', sans-serif", fontSize: '15px', fontWeight: 300,
            color: 'rgba(200,198,194,0.65)', letterSpacing: '0.03em',
            margin: '0 0 44px', lineHeight: 1.85, maxWidth: '380px',
          }}>
            Open to roles, collabs, and curious conversations.<br />
            If something moved you to reach out — that's enough reason.
          </p>

          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', justifyContent: 'center' }}>
            <motion.button
              onClick={() => { window.location.href = 'mailto:devikhushi466@gmail.com' }}
              whileHover={{ scale: 1.04, background: 'rgba(200,198,194,0.16)' }}
              whileTap={{ scale: 0.97 }}
                style={{
                padding: '11px 26px', borderRadius: '999px',
                border: '0.5px solid rgba(200,198,194,0.45)',
                background: 'rgba(200,198,194,0.08)', color: 'rgba(229,228,226,0.92)',
                fontFamily: "'DM Sans', sans-serif", fontSize: '12px',
                letterSpacing: '0.09em', cursor: 'pointer',
                display: 'inline-flex', alignItems: 'center', gap: '8px',
                transition: 'background 0.22s ease',
            }}
          >
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
    <rect x="2" y="4" width="20" height="16" rx="2" /><path d="m2 7 10 7 10-7" />
  </svg>
  Email
</motion.button>

            <motion.a
              href="https://github.com/Khushi-Devi"
              target="_blank" rel="noopener noreferrer"
              whileHover={{ scale: 1.04, borderColor: 'rgba(200,198,194,0.5)', color: 'rgba(229,228,226,0.8)' }}
              whileTap={{ scale: 0.97 }}
              style={{
                padding: '11px 26px', borderRadius: '999px',
                border: '0.5px solid rgba(200,198,194,0.2)', background: 'transparent',
                color: 'rgba(200,198,194,0.6)', fontFamily: "'DM Sans', sans-serif",
                fontSize: '12px', letterSpacing: '0.09em', cursor: 'pointer',
                textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '8px',
                transition: 'border-color 0.22s ease, color 0.22s ease',
              }}
            >
              <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0 1 12 6.844a9.59 9.59 0 0 1 2.504.337c1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.02 10.02 0 0 0 22 12.017C22 6.484 17.522 2 12 2z" />
              </svg>
              GitHub
            </motion.a>

            <motion.a
              href="https://www.linkedin.com/in/khushi-devi-83b701306/"
              target="_blank" rel="noopener noreferrer"
              whileHover={{ scale: 1.04, borderColor: 'rgba(200,198,194,0.5)', color: 'rgba(229,228,226,0.8)' }}
              whileTap={{ scale: 0.97 }}
              style={{
                padding: '11px 26px', borderRadius: '999px',
                border: '0.5px solid rgba(200,198,194,0.2)', background: 'transparent',
                color: 'rgba(200,198,194,0.6)', fontFamily: "'DM Sans', sans-serif",
                fontSize: '12px', letterSpacing: '0.09em', cursor: 'pointer',
                textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '8px',
                transition: 'border-color 0.22s ease, color 0.22s ease',
              }}
            >
              <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor">
                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
              </svg>
              LinkedIn
            </motion.a>
          </div>
        </motion.div>
      </section>

      {/* ══════════════════════════════════════════
          SECTION 3 — A Few Things (FAQs)
      ══════════════════════════════════════════ */}
      <section style={{
        position: 'relative', width: '100%', minHeight: '100vh',
        display: 'flex', flexDirection: 'column', alignItems: 'center',
        justifyContent: 'center', background: 'transparent',
        padding: '100px 0 120px', boxSizing: 'border-box',
      }}>
        <motion.div
          initial={{ opacity: 0, y: -18 }} whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
          style={{ textAlign: 'center', marginBottom: '64px' }}
        >
          <p style={{
            fontSize: '10px', letterSpacing: '0.32em', textTransform: 'uppercase',
            color: 'rgba(200,198,194,0.50)', margin: '0 0 12px',
            fontFamily: "'DM Sans', sans-serif",
          }}>The questions people actually ask</p>
          <h2 style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontSize: 'clamp(36px, 5vw, 68px)', fontWeight: 300,
            letterSpacing: '-0.025em', color: 'rgba(229,228,226,0.90)',
            lineHeight: 1, margin: 0,
          }}>A Few Things.</h2>
        </motion.div>

        <div style={{
          width: '100%', maxWidth: '820px', padding: '0 48px',
          boxSizing: 'border-box',
        }}>
          {/* Glass card wrapping all FAQs */}
          <div style={{
            borderRadius: '24px',
            background: 'rgba(255,255,255,0.025)',
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)',
            border: '0.5px solid rgba(200,198,194,0.14)',
            boxShadow: '0 8px 40px rgba(0,0,0,0.35), inset 0 1px 0 rgba(255,255,255,0.05)',
            padding: '8px 0',
            overflow: 'hidden',
          }}>
            {faqs.map((faq, i) => (
              <div
                key={i}
                style={{
                  borderBottom: i < faqs.length - 1 ? '0.5px solid rgba(200,198,194,0.1)' : 'none',
                }}
              >
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  style={{
                    width: '100%', background: 'none', border: 'none',
                    padding: '22px 36px', cursor: 'pointer',
                    display: 'flex', justifyContent: 'space-between',
                    alignItems: 'center', gap: '24px',
                  }}
                >
                  <span style={{
                    fontFamily: "'Cormorant Garamond', serif",
                    fontSize: 'clamp(16px, 1.8vw, 19px)', fontWeight: 300,
                    color: openFaq === i ? 'rgba(229,228,226,0.95)' : 'rgba(229,228,226,0.80)',
                    textAlign: 'left', lineHeight: 1.3,
                    transition: 'color 0.25s ease',
                  }}>
                    {faq.question}
                  </span>
                  <motion.span
                    animate={{ rotate: openFaq === i ? 45 : 0 }}
                    transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
                    style={{
                      flexShrink: 0, width: '20px', height: '20px',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      color: openFaq === i ? 'rgba(200,198,194,0.7)' : 'rgba(200,198,194,0.4)',
                      fontSize: '22px', lineHeight: 1,
                      transition: 'color 0.25s ease',
                    }}
                  >+</motion.span>
                </button>

                <AnimatePresence initial={false}>
                  {openFaq === i && (
                    <motion.div
                      key="answer"
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                      style={{ overflow: 'hidden' }}
                    >
                      <p style={{
                        fontFamily: "'DM Sans', sans-serif",
                        fontSize: '14px', fontWeight: 300,
                        color: 'rgba(200,198,194,0.68)', lineHeight: 1.85,
                        padding: '0 36px 26px', margin: 0,
                      }}>
                        {faq.answer}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>
        </div>

        <motion.p
          initial={{ opacity: 0 }} whileInView={{ opacity: 1 }}
          viewport={{ once: true }} transition={{ delay: 0.5 }}
          style={{
            fontFamily: "'DM Sans', sans-serif", fontSize: '9px',
            letterSpacing: '0.24em', color: 'rgba(200,198,194,0.12)',
            textTransform: 'uppercase', margin: '72px 0 0',
          }}
        >Khushi Devi · 2025</motion.p>
      </section>
    </>
  )
}