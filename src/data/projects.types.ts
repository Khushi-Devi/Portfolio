export interface Project {
  id: number
  title: string
  description: string
  problem?: string
  solution?: string
  impact?: string
  technologies: string[]
  liveUrl?: string
  codeUrl?: string
  imageUrl?: string
  gradient?: string
  accentColor?: string
  symbol?: 'pulse' | 'spark' | 'qr' | 'network' | 'dots'
}