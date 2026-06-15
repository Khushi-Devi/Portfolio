import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { projects } from '../data/projects.data'
import { skillGroups } from '../data/skills.data'
import { faqs } from '../data/faqs.data'
import { rightNow } from '../data/rightnow.data'

interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
}

interface AssistantProps {
  isOpen: boolean
  onClose: () => void
}

const SYSTEM_PROMPT = `You are Arch, a personal AI assistant embedded in Khushi Devi's portfolio. You speak on her behalf, in first person — as if you are her voice.

About Khushi:
- Full Stack and ML Engineer
- B.Tech student at ABES Engineering College, Mathura, Uttar Pradesh, India (Aug 2024 – May 2028)
- Open to Full Stack and ML Engineering roles
- She builds systems that learn, scale, and ship — from model to interface, without cutting corners.

Contact:
- Email: devikhushi466@gmail.com
- GitHub: https://github.com/Khushi-Devi
- LinkedIn: https://www.linkedin.com/in/khushi-devi-83b701306/

Projects:
${projects.map(p => `- ${p.title}: ${p.description} | Stack: ${p.technologies?.join(', ')} | Live: ${p.liveUrl || 'not deployed yet'}`).join('\n')}

Skills:
${skillGroups.map(g => `- ${g.label}: ${g.skills.join(', ')}`).join('\n')}

Right Now:
${rightNow.map(c => `- ${c.label}: ${c.value} — ${c.note}`).join('\n')}

FAQs:
${faqs.map(f => `Q: ${f.question}\nA: ${f.answer}`).join('\n\n')}

Rules:
- Always speak as Khushi in first person: "I built...", "I'm currently...", "You can reach me at..."
- Be warm, direct, and honest — not corporate or robotic
- Keep answers concise — this is a chat panel, not an essay
- If asked something you don't know, say so honestly
- Never make up projects, skills, or facts not listed above`

const STARTER_PROMPTS = [
  'What have you built?',
  'Are you open to work?',
  'How can I reach you?',
]

export default function Assistant({ isOpen, onClose }: AssistantProps) {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [showStarters, setShowStarters] = useState(true)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 300)
      if (messages.length === 0) {
        setMessages([{
          id: 'welcome',
          role: 'assistant',
          content: "Hey — I'm Arch. Ask me anything about Khushi's work, stack, or how to get in touch.",
        }])
      }
    }
  }, [isOpen])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const send = async (text: string) => {
    if (!text.trim() || loading) return
    setShowStarters(false)
    const userMsg: Message = { id: Date.now().toString(), role: 'user', content: text }
    setMessages(prev => [...prev, userMsg])
    setInput('')
    setLoading(true)

    try {
      const res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${import.meta.env.VITE_GROQ_API_KEY}`,
        },
        body: JSON.stringify({
          model: 'llama-3.1-8b-instant',
          max_tokens: 400,
          messages: [
            { role: 'system', content: SYSTEM_PROMPT },
            ...messages
              .filter(m => m.id !== 'welcome')
              .map(m => ({ role: m.role, content: m.content })),
            { role: 'user', content: text },
          ],
        }),
      })

      const data = await res.json()
      const reply = data.choices?.[0]?.message?.content || "I couldn't get a response. Try again."
      setMessages(prev => [...prev, {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: reply,
      }])
    } catch {
      setMessages(prev => [...prev, {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: "Something went wrong. Check the API key in your .env file.",
      }])
    } finally {
      setLoading(false)
    }
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.97 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.97 }}
          transition={{ type: 'spring', damping: 28, stiffness: 260 }}
          style={{
            position: 'fixed',
            bottom: '108px',
            right: '36px',
            width: '420px',
            height: '580px',
            zIndex: 200,
            display: 'flex',
            flexDirection: 'column',
            borderRadius: '20px',
            // Style B — light smoke
            background: 'rgba(30,30,28,0.72)',
            backdropFilter: 'blur(32px)',
            WebkitBackdropFilter: 'blur(32px)',
            border: '0.5px solid rgba(255,255,255,0.18)',
            boxShadow: '0 24px 64px rgba(0,0,0,0.45), inset 0 1px 0 rgba(255,255,255,0.07)',
            overflow: 'hidden',
          }}
        >
          {/* Header */}
          <div style={{
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            padding: '16px 20px',
            borderBottom: '0.5px solid rgba(255,255,255,0.1)',
            background: 'rgba(255,255,255,0.03)',
            flexShrink: 0,
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{
                width: '7px', height: '7px', borderRadius: '50%',
                background: 'rgba(52,211,153,0.9)',
                boxShadow: '0 0 8px rgba(52,211,153,0.6)',
              }} />
              <span style={{
                fontFamily: "'Cormorant Garamond', serif",
                fontSize: '17px', fontWeight: 300,
                color: 'rgba(245,244,242,0.95)',
                letterSpacing: '0.02em',
              }}>Arch</span>
              <span style={{
                fontFamily: "'DM Sans', sans-serif",
                fontSize: '10px', letterSpacing: '0.18em',
                color: 'rgba(180,178,174,0.4)',
                textTransform: 'uppercase',
              }}>· Khushi's assistant</span>
            </div>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={onClose}
              style={{
                background: 'none', border: 'none', cursor: 'pointer',
                color: 'rgba(180,178,174,0.45)', fontSize: '20px',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                width: '28px', height: '28px', lineHeight: 1,
                transition: 'color 0.2s ease',
              }}
            >×</motion.button>
          </div>

          {/* Messages */}
          <div style={{
            flex: 1, overflowY: 'auto', padding: '16px 18px',
            display: 'flex', flexDirection: 'column', gap: '10px',
            scrollbarWidth: 'none',
          }}>
            {messages.map(msg => (
              <motion.div
                key={msg.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
                style={{
                  display: 'flex',
                  justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start',
                }}
              >
                <div style={{
                  maxWidth: '84%',
                  padding: '10px 14px',
                  borderRadius: msg.role === 'user'
                    ? '14px 14px 3px 14px'
                    : '14px 14px 14px 3px',
                  background: msg.role === 'user'
                    ? 'rgba(255,255,255,0.12)'
                    : 'rgba(255,255,255,0.08)',
                  border: msg.role === 'user'
                    ? '0.5px solid rgba(255,255,255,0.18)'
                    : '0.5px solid rgba(255,255,255,0.12)',
                  fontFamily: "'DM Sans', sans-serif",
                  fontSize: '13px', fontWeight: 300,
                  color: msg.role === 'user'
                    ? 'rgba(245,243,240,0.92)'
                    : 'rgba(220,218,215,0.85)',
                  lineHeight: 1.65,
                  whiteSpace: 'pre-wrap',
                }}>
                  {msg.content}
                </div>
              </motion.div>
            ))}

            {/* Loading dots */}
            {loading && (
              <motion.div
                initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                style={{ display: 'flex', justifyContent: 'flex-start' }}
              >
                <div style={{
                  padding: '12px 16px',
                  borderRadius: '14px 14px 14px 3px',
                  background: 'rgba(255,255,255,0.08)',
                  border: '0.5px solid rgba(255,255,255,0.12)',
                  display: 'flex', gap: '5px', alignItems: 'center',
                }}>
                  {[0, 1, 2].map(i => (
                    <motion.div
                      key={i}
                      animate={{ opacity: [0.3, 1, 0.3] }}
                      transition={{ duration: 1.2, repeat: Infinity, delay: i * 0.2 }}
                      style={{
                        width: '5px', height: '5px', borderRadius: '50%',
                        background: 'rgba(220,218,215,0.6)',
                      }}
                    />
                  ))}
                </div>
              </motion.div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Starter prompts */}
          <AnimatePresence>
            {showStarters && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                style={{
                  padding: '0 18px 10px',
                  display: 'flex', flexWrap: 'wrap', gap: '7px',
                  flexShrink: 0,
                }}
              >
                {STARTER_PROMPTS.map(prompt => (
                  <motion.button
                    key={prompt}
                    whileHover={{ scale: 1.03, borderColor: 'rgba(255,255,255,0.35)' }}
                    whileTap={{ scale: 0.97 }}
                    onClick={() => send(prompt)}
                    style={{
                      padding: '6px 13px', borderRadius: '999px',
                      border: '0.5px solid rgba(255,255,255,0.18)',
                      background: 'rgba(255,255,255,0.06)',
                      color: 'rgba(200,198,194,0.65)',
                      fontFamily: "'DM Sans', sans-serif",
                      fontSize: '11px', letterSpacing: '0.04em',
                      cursor: 'pointer',
                      transition: 'border-color 0.2s ease',
                    }}
                  >{prompt}</motion.button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Input */}
          <div style={{
            padding: '12px 18px 16px',
            borderTop: '0.5px solid rgba(255,255,255,0.08)',
            background: 'rgba(255,255,255,0.02)',
            display: 'flex', gap: '10px', alignItems: 'center',
            flexShrink: 0,
          }}>
            <input
              ref={inputRef}
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && !e.shiftKey && send(input)}
              placeholder="Ask me anything..."
              style={{
                flex: 1,
                background: 'rgba(255,255,255,0.07)',
                border: '0.5px solid rgba(255,255,255,0.14)',
                borderRadius: '12px',
                padding: '10px 14px',
                fontFamily: "'DM Sans', sans-serif",
                fontSize: '13px',
                color: 'rgba(235,233,230,0.88)',
                outline: 'none',
                transition: 'border-color 0.2s ease',
              }}
              onFocus={e => e.target.style.borderColor = 'rgba(255,255,255,0.32)'}
              onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.14)'}
            />
            <motion.button
              whileHover={{ scale: 1.08 }}
              whileTap={{ scale: 0.94 }}
              onClick={() => send(input)}
              disabled={loading || !input.trim()}
              style={{
                width: '38px', height: '38px',
                borderRadius: '12px', flexShrink: 0,
                background: input.trim()
                  ? 'rgba(255,255,255,0.12)'
                  : 'rgba(255,255,255,0.04)',
                border: '0.5px solid rgba(255,255,255,0.18)',
                color: input.trim()
                  ? 'rgba(235,233,230,0.9)'
                  : 'rgba(200,198,194,0.25)',
                cursor: input.trim() ? 'pointer' : 'default',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                transition: 'all 0.2s ease',
              }}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M22 2L11 13M22 2L15 22l-4-9-9-4 20-7z" />
              </svg>
            </motion.button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}