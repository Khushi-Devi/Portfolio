import { motion, AnimatePresence } from 'framer-motion'
import { useState, useRef, useEffect } from 'react'
import { projects } from '../data/projects.data'

interface AssistantProps {
  isOpen: boolean
  onClose: () => void
}

interface Message {
  id: string
  text: string
  sender: 'user' | 'assistant'
  timestamp: Date
}

const Assistant = ({ isOpen, onClose }: AssistantProps) => {
  const [messages, setMessages] = useState<Message[]>([])
  const [inputValue, setInputValue] = useState('')
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (isOpen && messages.length === 0) {
      setMessages([
        {
          id: 'welcome',
          text: "✨ Hi! I'm your AI assistant. Ask me about:\n\n• My projects\n• Tech stack\n• About the developer\n\nWhat would you like to know?",
          sender: 'assistant',
          timestamp: new Date(),
        },
      ])
    }
  }, [isOpen, messages.length])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const getResponse = (query: string): string => {
    const lowerQuery = query.toLowerCase()
    
    if (lowerQuery.includes('project') || lowerQuery.includes('portfolio') || lowerQuery.includes('work')) {
      const projectList = projects.map(p => `• ${p.title}: ${p.description}`).join('\n')
      return `📁 Here are my featured projects:\n\n${projectList}\n\nClick on any project card to see more details!`
    } 
    else if (lowerQuery.includes('tech') || lowerQuery.includes('stack') || lowerQuery.includes('technology')) {
      return `⚙️ Tech Stack:\n\n• React 18\n• TypeScript\n• Tailwind CSS\n• Framer Motion\n• Vite\n\nAll built with modern best practices and smooth animations!`
    }
    else if (lowerQuery.includes('about') || lowerQuery.includes('who') || lowerQuery.includes('developer')) {
      return `👨‍💻 About Me:\n\nI'm a frontend developer passionate about creating immersive, animated web experiences. This portfolio showcases my skills in:\n\n• Interactive animations\n• Fluid UI/UX design\n• Modern React patterns\n• Creative problem solving\n\nFeel free to explore my projects!`
    }
    else if (lowerQuery.includes('hello') || lowerQuery.includes('hi') || lowerQuery.includes('hey')) {
      return `👋 Hello! I'm here to help you learn about my work. Ask me about projects, my tech stack, or anything you're curious about!`
    }
    else {
      return `💡 I can tell you about:\n\n• My projects and what I've built\n• Technologies I work with\n• My background and experience\n\nWhat would you like to know?`
    }
  }

  const handleSendMessage = () => {
    if (!inputValue.trim()) return

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputValue,
      sender: 'user',
      timestamp: new Date(),
    }
    setMessages((prev) => [...prev, userMessage])
    setInputValue('')

    setTimeout(() => {
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: getResponse(inputValue),
        sender: 'assistant',
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, assistantMessage])
    }, 400)
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: 100, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 100, scale: 0.9 }}
          transition={{ type: 'spring', damping: 25, stiffness: 200 }}
          className="fixed bottom-6 right-6 w-[400px] h-[550px] bg-black/40 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/20 z-30 flex flex-col overflow-hidden"
        >
          <div className="flex justify-between items-center p-4 border-b border-white/20 bg-gradient-to-r from-blue-500/10 to-purple-500/10">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
              <h3 className="text-white font-semibold">✨ Aurora Assistant</h3>
            </div>
            <button
              onClick={onClose}
              className="text-white/60 hover:text-white transition-colors text-xl leading-none"
            >
              ✕
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-3 custom-scrollbar">
            {messages.map((message) => (
              <motion.div
                key={message.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[85%] p-3 rounded-2xl whitespace-pre-wrap ${
                    message.sender === 'user'
                      ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white'
                      : 'bg-white/10 backdrop-blur-sm text-white border border-white/20'
                  }`}
                >
                  {message.text}
                </div>
              </motion.div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          <div className="p-4 border-t border-white/20 bg-black/20">
            <div className="flex gap-2">
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                placeholder="Ask me anything..."
                className="flex-1 bg-white/10 text-white placeholder-white/50 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm"
              />
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleSendMessage}
                className="px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-lg hover:opacity-90 transition-opacity text-sm font-medium"
              >
                Send
              </motion.button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export default Assistant