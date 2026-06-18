export interface SkillGroup {
  label: string
  accent: string
  skills: string[]
  span?: number
}

export const skillGroups: SkillGroup[] = [
  {
    label: 'Languages',
    accent: 'rgba(32, 178, 170, 0.7)',
    skills: ['Python', 'Java', 'JavaScript', 'TypeScript', 'SQL'],
  },
  {
    label: 'Frameworks & Libraries',
    accent: 'rgba(139, 92, 246, 0.7)',
    skills: ['React', 'Flask', 'Django', 'Node.js', 'Bootstrap', 'SQLAlchemy', 'Flask-Login', 'Flask-Mail', 'Jinja2', 'Vite', 'Framer Motion', 'Scikit-learn', 'Pandas', 'Matplotlib'],
    span: 2,
  },
  {
    label: 'Tools & Platforms',
    accent: 'rgba(251, 191, 36, 0.7)',
    skills: ['Docker', 'AWS', 'Azure', 'Streamlit', 'Power BI', 'Git', 'Jupyter'],
  },
  {
    label: 'Databases',
    accent: 'rgba(52, 211, 153, 0.7)',
    skills: ['SQL', 'MongoDB', 'SQLite', 'PostgreSQL'],
  },
  {
    label: 'Machine Learning',
    accent: 'rgba(251, 113, 133, 0.7)',
    skills: ['Generative AI', 'NLP', 'Supervised Learning', 'Unsupervised Learning', 'Data Preprocessing', 'LLaMA', 'PyTorch'],
  },
]
