export interface NowCard {
  label: string
  value: string
  note: string
  accent: string
}

export const rightNow: NowCard[] = [
  {
    label: 'Reading',
    value: "Omniscient Reader's Viewpoint",
    note: 'ORV — because some stories choose you.',
    accent: 'rgba(139, 92, 246, 0.7)',
  },
  {
    label: 'Listening',
    value: 'Imagine Dragons',
    note: 'On repeat. Loudly.',
    accent: 'rgba(32, 178, 170, 0.7)',
  },
  {
    label: 'Building',
    value: 'This portfolio',
    note: 'And whatever comes next.',
    accent: 'rgba(52, 211, 153, 0.7)',
  },
  {
    label: 'Thinking about',
    value: 'Writing a book',
    note: 'Some thoughts are too big for code.',
    accent: 'rgba(251, 191, 36, 0.7)',
  },
]