# My Portfolio

A personal portfolio built with React, TypeScript, and Vite — featuring a generative network background, an interactive project carousel, and Arch, an AI assistant that knows the site inside out.

**Live site:** https://portfolio-kd11.vercel.app/

---

## Stack

- **React 18** + **TypeScript**
- **Vite** — build tool and dev server
- **Framer Motion** — animations and transitions
- **Tailwind CSS** — utility styling
- **Groq API** (`llama-3.1-8b-instant`) — powers the Arch assistant

---

## Features

- **Hero** — floating ML-themed text fragments on an animated canvas, with smooth entrance transitions
- **Projects** — a draggable 3D carousel with scroll-hijack navigation and an animated detail expansion view
- **Network Background** — a fixed canvas of connected nodes that fades in as you scroll past the hero, with lines anchoring to the active project card
- **Who I Am / What I Know** — personal narrative and a categorized skills grid, both pulling from versioned data files
- **Right Now / Let's Talk / A Few Things** — a living snapshot of current interests, a glass-paneled contact card, and an FAQ accordion
- **Arch** — an AI assistant (powered by Groq) that answers questions about projects, skills, and contact info, speaking in first person on the site owner's behalf
- **Character orb** — a mercury-like ripple animation that toggles the assistant panel, with a one-time onboarding tooltip

---

## Project Structure

```
src/
├── components/
│   ├── HeroText.tsx          # Landing hero with canvas text animation
│   ├── Projects.tsx          # 3D project carousel
│   ├── ProjectCard.tsx       # Individual carousel card
│   ├── ProjectDetail.tsx     # Expanded project view
│   ├── NetworkBackground.tsx # Fixed canvas network animation
│   ├── AboutSkills.tsx       # "Who I Am" + "What I Know" sections
│   ├── Contact.tsx           # "Right Now" + "Let's Talk" + FAQ accordion
│   ├── Character.tsx         # Animated orb that toggles the assistant
│   └── Assistant.tsx         # Arch — the AI chat assistant
├── data/
│   ├── projects.data.ts      # Project content
│   ├── projects.types.ts     # Shared project types
│   ├── skills.data.ts        # Skill groups and tags
│   ├── rightnow.data.ts      # "Right Now" status cards
│   └── faqs.data.ts          # FAQ questions and answers
├── App.tsx                   # Section composition, scroll routing
└── main.tsx
```

### Editing content

Most copy lives in `src/data/*.ts` — update these files directly without touching component code:

- `skills.data.ts` — skill categories and tags
- `rightnow.data.ts` — the four "Right Now" cards
- `faqs.data.ts` — questions and answers shown in "A Few Things"
- `projects.data.ts` — project titles, descriptions, links, and accent colors

---

## Setup

```bash
npm install
```

Create a `.env` file in the project root:

```
VITE_GROQ_API_KEY=your_groq_api_key_here
```

Get a free key at [console.groq.com](https://console.groq.com).

Run the dev server:

```bash
npm run dev
```

Build for production:

```bash
npm run build
```

---

## Notes

- Contact links (email, GitHub, LinkedIn) are set in `Contact.tsx` and referenced in `Assistant.tsx`'s system prompt — update both if they change.
- `.env` is gitignored and should never be committed.
- The assistant's knowledge is generated from the data files at build time — adding a new project or skill automatically updates what Arch knows.