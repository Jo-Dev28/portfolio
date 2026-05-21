# Portfolio ZIP Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Migrer le portfolio Peter Akilimali de Vanilla JS vers React/Vite en reproduisant le design du ZIP `Job-Board-Landing-Page-Template` à 100%, en substituant les données TalentHub par les données de Peter.

**Architecture:** Remplacement complet de la stack — `index.html`, `src/main.jsx`, `src/App.jsx`, `src/index.css`, `tailwind.config.js`, `vite.config.js`, `package.json` sont réécrits à partir du ZIP. Le contenu (textes, liens, icônes, API GitHub) est adapté pour Peter. Les assets `public/` existants sont conservés.

**Tech Stack:** React 18, Vite 5, Tailwind CSS 3, Iconify-icon (Solar duotone), Space Grotesk + Oswald + Bricolage Grotesque fonts, API GitHub REST v3.

---

## File Map

| Fichier | Action | Responsabilité |
|---------|--------|---------------|
| `index.html` | Réécrire | Point d'entrée HTML avec meta SEO Peter + fonts ZIP |
| `src/main.jsx` | Créer | Entrée React (remplace main.js) |
| `src/App.jsx` | Créer | Composant principal : Hero + Expertise + Projets + Parcours + Contact + Footer |
| `src/index.css` | Réécrire | Styles globaux ZIP (animate-on-scroll, marquee, beam-spin, levitate, etc.) |
| `tailwind.config.js` | Réécrire | Config ZIP avec plugin rotate-x/y/z + perspective |
| `vite.config.js` | Réécrire | Vite + @vitejs/plugin-react |
| `package.json` | Réécrire | Dépendances ZIP (react, react-dom, iconify-icon, vite, tailwindcss) |
| `postcss.config.js` | Conserver | Déjà compatible |
| `vercel.json` | Conserver | Déjà compatible |
| `.gitignore` | Modifier | Ajouter `.superpowers/` |

---

## Task 1: Créer la branche et archiver l'ancien code

**Files:**
- Modify: `.gitignore`

- [ ] **Step 1: Vérifier qu'on est sur la branche new-design**

```bash
git branch
```
Expected: `* new-design`

- [ ] **Step 2: Archiver les anciens fichiers source**

```bash
cp index.html index.html.bak
cp src/main.js src/main.js.bak
cp src/style.css src/style.css.bak
cp src/translations.js src/translations.js.bak
```

- [ ] **Step 3: Ajouter .superpowers/ au .gitignore**

Ouvrir `.gitignore` et ajouter à la fin :
```
.superpowers/
*.bak
```

- [ ] **Step 4: Commit**

```bash
git add .gitignore index.html.bak src/main.js.bak src/style.css.bak src/translations.js.bak
git commit -m "chore: archive old vanilla JS files before ZIP migration"
```

---

## Task 2: Mettre à jour package.json et installer les dépendances

**Files:**
- Modify: `package.json`

- [ ] **Step 1: Réécrire package.json**

Remplacer le contenu complet de `package.json` par :

```json
{
  "name": "peter-portfolio",
  "private": true,
  "version": "0.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview"
  },
  "dependencies": {
    "iconify-icon": "^2.1.0",
    "react": "^18.3.1",
    "react-dom": "^18.3.1"
  },
  "devDependencies": {
    "@vitejs/plugin-react": "^4.3.1",
    "autoprefixer": "^10.4.20",
    "eslint": "^9.9.0",
    "postcss": "^8.4.41",
    "tailwindcss": "^3.4.10",
    "vite": "^5.4.1"
  }
}
```

- [ ] **Step 2: Installer les dépendances**

```bash
npm install
```
Expected: `node_modules/` mis à jour, pas d'erreur.

- [ ] **Step 3: Commit**

```bash
git add package.json package-lock.json
git commit -m "chore: update package.json to ZIP React/Vite stack"
```

---

## Task 3: Réécrire vite.config.js et tailwind.config.js

**Files:**
- Modify: `vite.config.js`
- Modify: `tailwind.config.js`

- [ ] **Step 1: Réécrire vite.config.js**

```js
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
})
```

- [ ] **Step 2: Réécrire tailwind.config.js**

```js
/** @type {import('tailwindcss').Config} */
const plugin = require('tailwindcss/plugin')

export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        space: ['"Space Grotesk"', 'sans-serif'],
        oswald: ['"Oswald"', 'sans-serif'],
        bricolage: ['"Bricolage Grotesque"', 'sans-serif'],
      },
    },
  },
  plugins: [
    plugin(function({ addUtilities }) {
      const rotateValues = [0, 5, 10, 15, 20, 30, 45, 75];
      const rotateXUtilities = {};
      const rotateYUtilities = {};
      const rotateZUtilities = {};

      rotateValues.forEach((value) => {
        const transform = `translate3d(var(--tw-translate-x, 0), var(--tw-translate-y, 0), var(--tw-translate-z, 0)) rotateX(var(--tw-rotate-x, 0)) rotateY(var(--tw-rotate-y, 0)) rotateZ(var(--tw-rotate-z, 0)) skewX(var(--tw-skew-x, 0)) skewY(var(--tw-skew-y, 0)) scaleX(var(--tw-scale-x, 1)) scaleY(var(--tw-scale-y, 1))`;
        rotateXUtilities[`.rotate-x-${value}`] = { '--tw-rotate-x': `${value}deg`, transform };
        rotateYUtilities[`.rotate-y-${value}`] = { '--tw-rotate-y': `${value}deg`, transform };
        rotateZUtilities[`.rotate-z-${value}`] = { '--tw-rotate-z': `${value}deg`, transform };
        if (value !== 0) {
          rotateXUtilities[`.-rotate-x-${value}`] = { '--tw-rotate-x': `-${value}deg`, transform };
          rotateYUtilities[`.-rotate-y-${value}`] = { '--tw-rotate-y': `-${value}deg`, transform };
          rotateZUtilities[`.-rotate-z-${value}`] = { '--tw-rotate-z': `-${value}deg`, transform };
        }
      });

      addUtilities({
        ...rotateXUtilities,
        ...rotateYUtilities,
        ...rotateZUtilities,
        ".perspective-none": { perspective: "none" },
        ".perspective-[1000px]": { perspective: "1000px" },
        ".perspective-[2000px]": { perspective: "2000px" },
        ".transform-style-preserve-3d": { "transform-style": "preserve-3d" },
        ".transform-style-flat": { "transform-style": "flat" },
      });
    })
  ],
}
```

- [ ] **Step 3: Commit**

```bash
git add vite.config.js tailwind.config.js
git commit -m "chore: configure Vite + Tailwind with ZIP settings"
```

---

## Task 4: Réécrire index.html avec SEO Peter + fonts ZIP

**Files:**
- Modify: `index.html`

- [ ] **Step 1: Réécrire index.html**

Remplacer le contenu complet de `index.html` par :

```html
<!doctype html>
<html lang="fr" class="scroll-smooth">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />

    <!-- SEO -->
    <title>Peter Akilimali | Ingénieur Logiciel & Architecte Business</title>
    <meta name="title" content="Peter Akilimali | Ingénieur Logiciel & Architecte Business">
    <meta name="description" content="Portfolio de Peter Akilimali, Étudiant en Ingénierie Logicielle (ULK 2027) basé entre Gisenyi (Rwanda) et Goma (RDC). Spécialiste Web3, Architecture Business et solutions informatiques scalables.">
    <meta name="keywords" content="Peter Akilimali, peter23xp, Ingénieur Logiciel, Software Engineer, Goma, RDC, Gisenyi, Rwanda, ULK, Stage 2027, Web3, Smart Contracts, Développeur Web, React, TailwindCSS, Business Architect">
    <meta name="author" content="Peter Akilimali">
    <meta name="robots" content="index, follow">
    <link rel="sitemap" type="application/xml" href="/sitemap.xml">
    <link rel="canonical" href="https://peterakilimali.site/">

    <!-- Open Graph -->
    <meta property="og:type" content="website">
    <meta property="og:url" content="https://peterakilimali.site/">
    <meta property="og:title" content="Peter Akilimali | Software Engineer & Business Architect">
    <meta property="og:description" content="Découvrez les projets open-source, l'expertise Web3 et le parcours de développement logiciel de Peter Akilimali.">
    <meta property="og:image" content="https://peterakilimali.site/peter.jpeg">

    <!-- Twitter -->
    <meta property="twitter:card" content="summary_large_image">
    <meta property="twitter:url" content="https://peterakilimali.site/">
    <meta property="twitter:title" content="Peter Akilimali | Software Engineer">
    <meta property="twitter:description" content="Portfolio de Peter Akilimali, Étudiant en Ingénierie Logicielle (ULK 2027) basé entre Gisenyi (Rwanda) et Goma (RDC).">
    <meta property="twitter:image" content="https://peterakilimali.site/peter.jpeg">

    <!-- Fonts ZIP -->
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:wght@300;400;500;600;700&family=Oswald:wght@500;600&family=Space+Grotesk:wght@300;400;500;600&display=swap" rel="stylesheet">
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.jsx"></script>
  </body>
</html>
```

- [ ] **Step 2: Commit**

```bash
git add index.html
git commit -m "feat: rewrite index.html with Peter SEO meta + ZIP fonts"
```

---

## Task 5: Créer src/main.jsx et réécrire src/index.css

**Files:**
- Create: `src/main.jsx`
- Modify: `src/index.css`

- [ ] **Step 1: Créer src/main.jsx**

```jsx
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import 'iconify-icon'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
```

- [ ] **Step 2: Réécrire src/index.css**

Remplacer le contenu complet par :

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  ::-webkit-scrollbar { display: none; }
  body {
    -ms-overflow-style: none;
    scrollbar-width: none;
    @apply flex flex-col xl:items-center xl:justify-center xl:p-8 antialiased text-white font-space bg-neutral-950 pt-0 pr-0 pb-0 pl-0;
  }
}

@layer utilities {
  .border-gradient {
    position: relative;
  }
  .border-gradient::before {
    content: "";
    position: absolute;
    inset: 0;
    border-radius: 3.5rem;
    padding: 1px;
    -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
    -webkit-mask-composite: xor;
    mask-composite: exclude;
    background: linear-gradient(225deg, rgba(255,255,255,0.0) 0%, rgba(255,255,255,0.2) 50%, rgba(255,255,255,0.0) 100%);
    pointer-events: none;
  }

  [style*="--border-gradient"]::before {
    content: "";
    position: absolute;
    inset: 0;
    padding: 1px;
    border-radius: var(--border-radius-before, inherit);
    -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
    -webkit-mask-composite: xor;
    mask-composite: exclude;
    background: var(--border-gradient);
    pointer-events: none;
  }

  .marquee-content {
    animation: marquee-up 20s linear infinite;
  }

  .animate-on-scroll {
    opacity: 0.01;
    filter: blur(12px);
  }
  .animate-on-scroll.animate-up {
    animation: fadeSlideBlurIn 0.8s cubic-bezier(0.16, 1, 0.3, 1) both;
  }
  .animate-on-scroll.animate-left {
    animation: fadeSlideBlurInLeft 0.8s cubic-bezier(0.16, 1, 0.3, 1) both;
  }
  .animate-on-scroll.animate-right {
    animation: fadeSlideBlurInRight 0.8s cubic-bezier(0.16, 1, 0.3, 1) both;
  }
  .animate-on-scroll.animate-fade {
    animation: fadeBlurIn 0.8s cubic-bezier(0.16, 1, 0.3, 1) both;
  }

  .animate-levitate {
    animation: levitate 6s ease-in-out infinite;
  }
  .animate-levitate-delayed {
    animation: levitate 6s ease-in-out infinite;
    animation-delay: -3s;
  }
}

@keyframes beam-spin { to { transform: rotate(360deg); } }
@keyframes dots-move {
  0% { background-position: 0 0; }
  100% { background-position: 24px 24px; }
}
@keyframes marquee-up {
  0% { transform: translateY(0); }
  100% { transform: translateY(-50%); }
}
@keyframes fadeSlideBlurIn {
  0% { opacity: 0.01; transform: translateY(30px); filter: blur(12px); }
  100% { opacity: 1; transform: translateY(0); filter: blur(0); }
}
@keyframes fadeSlideBlurInLeft {
  0% { opacity: 0.01; transform: translateX(-30px); filter: blur(12px); }
  100% { opacity: 1; transform: translateX(0); filter: blur(0); }
}
@keyframes fadeSlideBlurInRight {
  0% { opacity: 0.01; transform: translateX(30px); filter: blur(12px); }
  100% { opacity: 1; transform: translateX(0); filter: blur(0); }
}
@keyframes fadeBlurIn {
  0% { opacity: 0.01; filter: blur(12px); }
  100% { opacity: 1; filter: blur(0); }
}
@keyframes flow-noodle {
  0% { stroke-dashoffset: 24; }
  100% { stroke-dashoffset: 0; }
}
@keyframes levitate {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-10px); }
}
```

- [ ] **Step 3: Commit**

```bash
git add src/main.jsx src/index.css
git commit -m "feat: add React entry point and ZIP global styles"
```

---

## Task 6: Créer src/App.jsx — Hero Section

**Files:**
- Create: `src/App.jsx` (partiel — Hero uniquement)

- [ ] **Step 1: Créer src/App.jsx avec Hero**

Créer `src/App.jsx` avec le contenu suivant (Hero complet basé sur ZIP, données Peter) :

```jsx
import React, { useEffect, useRef, useState } from 'react';

function App() {
  const containerRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const el = entry.target;
          const type = el.dataset.animation || 'up';
          const delay = el.dataset.delay || 0;
          setTimeout(() => {
            if (type === 'up') el.classList.add('animate-up');
            else if (type === 'left') el.classList.add('animate-left');
            else if (type === 'right') el.classList.add('animate-right');
            else if (type === 'fade') el.classList.add('animate-fade');
            else el.classList.add('animate-up');
          }, parseInt(delay));
          observer.unobserve(el);
        }
      });
    }, { root: null, rootMargin: '0px', threshold: 0.1 });

    if (containerRef.current) {
      containerRef.current.querySelectorAll('.animate-on-scroll').forEach(el => observer.observe(el));
    }
    return () => observer.disconnect();
  }, []);

  return (
    <main ref={containerRef} className="border-gradient xl:rounded-[3.5rem] xl:p-12 overflow-hidden flex flex-col xl:max-w-[96rem] xl:shadow-2xl bg-neutral-900 w-full rounded-none pt-6 pr-6 pb-6 pl-6 relative shadow-none justify-between">

      {/* Background image right — peter.jpeg */}
      <img src="/peter.jpeg" alt="Peter Akilimali" className="w-1/2 h-[960px] object-cover object-top rounded-[40px] absolute top-4 right-4 bottom-0" data-container-bg="true" />

      {/* Background Decor */}
      <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-neutral-800/20 via-transparent to-blue-950/10 pointer-events-none"></div>

      {/* Vertical Lines */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden xl:rounded-[3.5rem]">
        <div className="absolute top-0 bottom-0 left-[10%] w-px bg-gradient-to-b from-transparent via-neutral-700/30 to-transparent"></div>
        <div className="absolute top-0 bottom-0 left-[25%] w-px bg-gradient-to-b from-transparent via-neutral-700/20 to-transparent"></div>
        <div className="absolute top-0 bottom-0 left-[50%] w-px bg-gradient-to-b from-transparent via-neutral-700/30 to-transparent"></div>
        <div className="absolute top-0 bottom-0 left-[75%] w-px bg-gradient-to-b from-transparent via-neutral-700/20 to-transparent"></div>
        <div className="absolute top-0 bottom-0 left-[90%] w-px bg-gradient-to-b from-transparent via-neutral-700/30 to-transparent"></div>
      </div>

      {/* NAV */}
      <nav className="z-20 flex flex-wrap gap-6 md:mb-0 mix-blend-plus-lighter mb-12 relative gap-x-6 gap-y-6 items-center justify-between">
        <div className="animate-on-scroll flex items-center group cursor-pointer" data-animation="left" data-delay="0">
          <iconify-icon icon="solar:code-bold-duotone" class="w-10 h-10 text-white group-hover:rotate-[22.5deg] transition-transform duration-500 ease-out" style={{fontSize:'2.5rem'}}></iconify-icon>
        </div>
        <div className="hidden md:flex items-center gap-12 text-xs font-medium tracking-widest uppercase text-neutral-400">
          <a href="#projets" className="animate-on-scroll hover:text-white transition-colors flex items-center gap-2" data-animation="up" data-delay="100">
            <div className="w-2 h-2 rounded-full bg-white"></div>Projets
          </a>
          <a href="#expertise" className="animate-on-scroll hover:text-white transition-colors flex items-center gap-2" data-animation="up" data-delay="150">
            <div className="w-2 h-2 rounded-full border border-neutral-600"></div>Expertise
          </a>
          <a href="#parcours" className="animate-on-scroll hover:text-white transition-colors mix-blend-hard-light" data-animation="up" data-delay="200">Parcours</a>
          <a href="#contact" className="animate-on-scroll hover:text-white transition-colors" data-animation="up" data-delay="250">Contact</a>
        </div>
        <div className="flex items-center gap-4">
          <a href="/peterCv.pdf" download className="animate-on-scroll hidden uppercase hover:bg-neutral-800 transition-colors md:flex text-xs font-semibold tracking-widest bg-gradient-to-br from-white/10 to-white/0 rounded-full px-6 py-3" data-animation="right" data-delay="100" style={{ position: 'relative', '--border-gradient': 'linear-gradient(135deg, rgba(255,255,255,0.1), rgba(255,255,255,0))', '--border-radius-before': '9999px' }}>
            CV PDF
          </a>
          <button className="md:hidden p-3 rounded-full bg-white text-neutral-950">
            <iconify-icon icon="streamline:interface-setting-menu-1-button-parallel-horizontal-lines-menu-navigation-three-hamburger" style={{fontSize:'1.25rem'}}></iconify-icon>
          </button>
        </div>
      </nav>

      {/* Hero Content */}
      <div className="z-10 flex-grow flex flex-col md:py-0 pt-10 pb-10 relative justify-center">
        {/* Badge */}
        <div className="animate-on-scroll flex md:mb-4 md:mt-12 mt-4 mb-6 gap-x-4 gap-y-4 items-center" data-animation="up" data-delay="300">
          <div className="flex -space-x-2">
            <img src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=40&h=40&fit=crop&crop=face" className="w-8 h-8 rounded-full border-2 border-neutral-900" alt="user" />
            <img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=40&h=40&fit=crop&crop=face" className="w-8 h-8 rounded-full border-2 border-neutral-900" alt="user" />
            <img src="https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=40&h=40&fit=crop&crop=face" className="w-8 h-8 rounded-full border-2 border-neutral-900" alt="user" />
          </div>
          <p className="text-xs md:text-sm uppercase tracking-widest text-neutral-500 max-w-md font-medium">
            Ouvert aux stages 2026 · Gisenyi, Rwanda
          </p>
        </div>

        {/* Massive Typography */}
        <div className="group relative">
          <div className="animate-on-scroll hidden -top-4 hover:scale-105 transition-transform cursor-default lg:flex bg-neutral-900 z-20 border-neutral-700 border rounded-full px-5 py-2 absolute top-[0%] left-[38%] shadow-sm gap-x-2 gap-y-2 items-center" data-animation="fade" data-delay="800">
            <span className="text-[0.65rem] font-bold uppercase tracking-widest text-neutral-300">Remote Friendly</span>
          </div>
          <div className="animate-on-scroll hidden hover:scale-105 transition-transform cursor-default lg:flex bg-neutral-900 z-20 border-neutral-700 border rounded-full px-5 py-2 absolute top-[45%] right-[0%] shadow-sm gap-x-2 gap-y-2 items-center" data-animation="right" data-delay="900">
            <span className="text-[0.65rem] font-bold uppercase tracking-widest text-neutral-300">ULK 2027</span>
          </div>
          <div className="animate-on-scroll hidden lg:flex z-20 gap-2 hover:scale-105 transition-transform cursor-default text-neutral-950 bg-emerald-400 rounded-full px-5 py-2 absolute bottom-[-12%] left-[2%] shadow-lg gap-x-2 gap-y-2 items-center" data-animation="left" data-delay="1000">
            <span className="text-[0.65rem] font-bold uppercase tracking-widest">Full-Stack</span>
          </div>
          <h1 className="text-[16vw] md:text-[14vw] lg:text-[12rem] leading-[0.8] uppercase select-none md:text-left font-medium text-white tracking-tighter font-oswald text-center mix-blend-normal max-w-4xl">
            <span className="animate-on-scroll inline-block" data-animation="up" data-delay="400">Your</span>
            <span className="animate-on-scroll inline-block pl-0 md:pl-16" data-animation="up" data-delay="500">Creative</span>
            <span className="animate-on-scroll block text-neutral-600" data-animation="up" data-delay="600">Journey</span>
          </h1>
        </div>
      </div>

      {/* Bottom Section */}
      <div className="z-20 flex flex-col lg:flex-row gap-12 mt-8 relative gap-x-12 gap-y-12 items-end justify-between">
        {/* Left: Description + CTA */}
        <div className="flex flex-col gap-6 max-w-lg">
          <div className="animate-on-scroll flex items-center gap-3 text-xs font-bold tracking-widest uppercase text-neutral-500" data-animation="up" data-delay="700">
            <span>Ingénierie Logicielle</span>
            <span className="w-4 h-[1px] bg-neutral-600"></span>
            <span>Architecture Business</span>
          </div>
          <p className="animate-on-scroll text-sm md:text-base text-neutral-400 leading-relaxed font-normal text-pretty uppercase tracking-wide" data-animation="up" data-delay="800">
            Étudiant en Software Engineering à l'ULK (Kigali). Je conçois des solutions numériques avec une vision stratégique.
          </p>
          <div className="flex flex-wrap gap-3 items-center">
            {/* Beam CTA */}
            <a href="#contact" className="animate-on-scroll group flex overflow-hidden uppercase transition-all duration-500 hover:scale-[1.02] hover:shadow-[0_0_40px_-10px_rgba(59,130,246,0.5)] focus:outline-none text-sm font-medium text-white tracking-widest font-space rounded-full pt-5 pr-12 pb-5 pl-12 relative items-center justify-center" data-animation="up" data-delay="900">
              <div className="absolute inset-0 -z-20 rounded-full overflow-hidden p-[1px]">
                <div className="absolute inset-[-100%] bg-[conic-gradient(from_0deg,transparent_0_300deg,#3b82f6_360deg)]" style={{ animation: 'beam-spin 3s linear infinite' }}></div>
                <div className="absolute inset-[1px] rounded-full bg-neutral-950"></div>
              </div>
              <div className="-z-10 overflow-hidden bg-neutral-950 rounded-full absolute top-[2px] right-[2px] bottom-[2px] left-[2px]">
                <div className="absolute inset-0 bg-gradient-to-b from-neutral-800/60 to-transparent"></div>
                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-2/3 h-1/2 bg-blue-500/10 blur-2xl rounded-full pointer-events-none transition-colors duration-500 group-hover:bg-blue-500/30"></div>
              </div>
              <span className="relative z-10 text-white/90 transition-colors group-hover:text-white">Me Contacter</span>
              <iconify-icon icon="streamline:arrow-right-1" class="relative z-10 ml-2 w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" style={{fontSize:'1rem'}}></iconify-icon>
            </a>
            <a href="https://github.com/Peter23xp" target="_blank" className="animate-on-scroll px-5 py-2 rounded-full border border-neutral-700 text-[0.7rem] font-bold uppercase tracking-widest hover:bg-neutral-800 transition-colors" data-animation="up" data-delay="1000">
              Voir GitHub
            </a>
          </div>
        </div>

        {/* Right: Feature Cards Marquee */}
        <div className="lg:w-auto flex flex-col md:flex-row gap-4 w-full gap-x-4 gap-y-4">
          {/* Card 1: Stack */}
          <div className="animate-on-scroll group flex-1 lg:flex-none lg:w-48 hover:bg-white hover:text-neutral-950 hover:border-white transition-all duration-300 cursor-pointer overflow-hidden bg-neutral-800/50 rounded-2xl pt-5 pr-5 pb-5 pl-5 backdrop-blur-lg" data-animation="up" data-delay="1100" style={{ position: 'relative', '--border-gradient': 'linear-gradient(135deg, rgba(255,255,255,0.1), rgba(255,255,255,0))', '--border-radius-before': '16px' }}>
            <div className="relative h-28 mb-4 overflow-hidden" style={{ maskImage: 'linear-gradient(to bottom, transparent, black 20%, black 80%, transparent)', WebkitMaskImage: 'linear-gradient(to bottom, transparent, black 20%, black 80%, transparent)' }}>
              <div className="marquee-content">
                {[['solar:code-square-bold-duotone','#60a5fa','React'], ['solar:server-bold-duotone','#4ade80','Node.js'], ['solar:layers-bold-duotone','#a78bfa','Web3'], ['solar:document-bold-duotone','#fb923c','Solidity'], ['solar:database-bold-duotone','#818cf8','PostgreSQL'], ['solar:code-square-bold-duotone','#60a5fa','React'], ['solar:server-bold-duotone','#4ade80','Node.js'], ['solar:layers-bold-duotone','#a78bfa','Web3'], ['solar:document-bold-duotone','#fb923c','Solidity'], ['solar:database-bold-duotone','#818cf8','PostgreSQL']].map(([icon, color, label], i) => (
                  <div key={i} className="flex items-center gap-2 pb-3">
                    <iconify-icon icon={icon} style={{color, fontSize:'1.25rem'}}></iconify-icon>
                    <span className="text-[0.6rem] uppercase tracking-wider opacity-70">{label}</span>
                  </div>
                ))}
              </div>
            </div>
            <h3 className="text-xs font-semibold uppercase tracking-widest mb-1">Stack Tech</h3>
            <p className="text-[0.65rem] leading-normal opacity-70 uppercase">5+ Technologies.</p>
          </div>

          {/* Card 2: Projets */}
          <div className="animate-on-scroll group flex-1 lg:flex-none lg:w-48 hover:bg-white hover:text-neutral-950 hover:border-white transition-all duration-300 cursor-pointer overflow-hidden bg-neutral-800/50 rounded-2xl pt-5 pr-5 pb-5 pl-5 backdrop-blur-lg" data-animation="up" data-delay="1200" style={{ position: 'relative', '--border-gradient': 'linear-gradient(135deg, rgba(255,255,255,0.1), rgba(255,255,255,0))', '--border-radius-before': '16px' }}>
            <div className="relative h-28 mb-4 overflow-hidden" style={{ maskImage: 'linear-gradient(to bottom, transparent, black 20%, black 80%, transparent)', WebkitMaskImage: 'linear-gradient(to bottom, transparent, black 20%, black 80%, transparent)' }}>
              <div className="marquee-content" style={{ animationDuration: '25s' }}>
                {[['G','GitHub'],['V','Vercel'],['U','ULK'],['G','GitHub'],['V','Vercel'],['U','ULK']].map(([letter, label], i) => (
                  <div key={i} className="flex items-center gap-2 pb-3">
                    <div className="w-5 h-5 rounded bg-white/10 flex items-center justify-center text-[0.5rem] font-bold">{letter}</div>
                    <span className="text-[0.6rem] uppercase tracking-wider opacity-70">{label}</span>
                  </div>
                ))}
              </div>
            </div>
            <h3 className="text-xs font-semibold uppercase tracking-widest mb-1">Projets</h3>
            <p className="text-[0.65rem] leading-normal opacity-70 uppercase">Open Source.</p>
          </div>

          {/* Card 3: Contact */}
          <div className="animate-on-scroll group flex-1 lg:flex-none lg:w-48 hover:bg-white hover:text-neutral-950 hover:border-white transition-all duration-300 cursor-pointer overflow-hidden bg-neutral-800/50 rounded-2xl pt-5 pr-5 pb-5 pl-5 backdrop-blur-lg" data-animation="up" data-delay="1300" style={{ position: 'relative', '--border-gradient': 'linear-gradient(135deg, rgba(255,255,255,0.1), rgba(255,255,255,0))', '--border-radius-before': '16px' }}>
            <div className="relative h-28 mb-4 overflow-hidden" style={{ maskImage: 'linear-gradient(to bottom, transparent, black 20%, black 80%, transparent)', WebkitMaskImage: 'linear-gradient(to bottom, transparent, black 20%, black 80%, transparent)' }}>
              <div className="marquee-content" style={{ animationDuration: '18s' }}>
                {[['solar:letter-bold-duotone','#818cf8','Email'],['solar:linkedin-bold-duotone','#60a5fa','LinkedIn'],['solar:chat-round-bold-duotone','#4ade80','WhatsApp'],['solar:code-bold-duotone','#a3a3a3','GitHub'],['solar:letter-bold-duotone','#818cf8','Email'],['solar:linkedin-bold-duotone','#60a5fa','LinkedIn'],['solar:chat-round-bold-duotone','#4ade80','WhatsApp'],['solar:code-bold-duotone','#a3a3a3','GitHub']].map(([icon, color, label], i) => (
                  <div key={i} className="flex items-center gap-2 pb-3">
                    <iconify-icon icon={icon} style={{color, fontSize:'1.25rem'}}></iconify-icon>
                    <span className="text-[0.6rem] uppercase tracking-wider opacity-70">{label}</span>
                  </div>
                ))}
              </div>
            </div>
            <h3 className="text-xs font-semibold uppercase tracking-widest mb-1">Contact</h3>
            <p className="text-[0.65rem] leading-normal opacity-70 uppercase">Disponible.</p>
          </div>
        </div>
      </div>

      {/* Remaining sections placeholder — added in Tasks 7-10 */}
    </main>
  );
}

export default App;
```

- [ ] **Step 2: Vérifier que le build démarre sans erreur**

```bash
npm run dev
```
Expected: `Local: http://localhost:5173/` — pas d'erreur de compilation.

- [ ] **Step 3: Commit**

```bash
git add src/App.jsx
git commit -m "feat: add Hero section (ZIP structure + Peter data)"
```

---

## Task 7: Ajouter la section Expertise dans App.jsx

**Files:**
- Modify: `src/App.jsx`

- [ ] **Step 1: Remplacer le commentaire placeholder par la section Expertise**

Trouver dans `src/App.jsx` :
```jsx
      {/* Remaining sections placeholder — added in Tasks 7-10 */}
    </main>
```

Remplacer par :

```jsx
      {/* ===== EXPERTISE ===== */}
      <div id="expertise" className="flex flex-col md:px-0 z-20 w-full max-w-[90rem] border-white/5 border-t mt-32 mr-auto ml-auto pt-12 pr-4 pb-12 pl-4 relative gap-x-16 gap-y-16">
        <div className="flex flex-col items-center text-center gap-6 max-w-3xl mx-auto">
          <h2 className="animate-on-scroll md:text-5xl lg:text-6xl uppercase leading-[0.9] text-3xl font-medium text-white tracking-tight font-bricolage" data-animation="up" data-delay="0">
            Mon <span className="text-neutral-600">Expertise</span> Spécialisée
          </h2>
          <p className="animate-on-scroll text-sm md:text-base text-neutral-400 font-normal uppercase tracking-wide max-w-xl" data-animation="up" data-delay="100">
            Réduire l'écart entre la précision technique et la croissance business.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 w-full gap-x-6 gap-y-6">
          {/* Card 1: Ingénierie d'Application */}
          <div className="animate-on-scroll group relative bg-neutral-900 border border-neutral-800 rounded-[2.5rem] p-8 md:p-12 overflow-hidden flex flex-col h-[600px] hover:border-neutral-700 transition-all duration-500" data-animation="left" data-delay="200">
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#171717_1px,transparent_1px),linear-gradient(to_bottom,#171717_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none"></div>
            <div className="relative z-10 flex flex-col gap-4 mb-12">
              <div className="w-12 h-12 rounded-full bg-neutral-800 flex items-center justify-center text-emerald-400 mb-2 border border-neutral-700 shadow-[0_0_15px_-3px_rgba(52,211,153,0.3)]">
                <iconify-icon icon="solar:code-square-bold-duotone" style={{fontSize:'1.5rem'}}></iconify-icon>
              </div>
              <h3 className="uppercase text-2xl font-semibold text-white tracking-tight font-bricolage">Ingénierie d'Application</h3>
              <p className="text-neutral-400 text-sm leading-relaxed max-w-xs font-space">Architecture de systèmes robustes et évolutifs. Je transforme des concepts complexes en solutions logicielles fluides.</p>
              <div className="flex items-center gap-3 text-[0.6rem] font-bold uppercase tracking-widest text-neutral-500 mt-2">
                <span className="bg-neutral-800 px-3 py-1 rounded-full border border-neutral-700">Full-Stack</span>
                <span className="w-8 h-[1px] bg-neutral-700"></span>
                <span className="text-emerald-400">React/Node</span>
                <span className="w-8 h-[1px] bg-neutral-700"></span>
                <span className="bg-neutral-800 px-3 py-1 rounded-full border border-neutral-700">API Design</span>
              </div>
            </div>
            <div className="flex-1 w-full mt-4 relative perspective-[1000px]">
              <div className="transform flex absolute top-0 right-0 bottom-0 left-0 scale-100 rotate-x-12 items-center justify-center">
                <svg className="pointer-events-none z-0 w-full h-full absolute top-0 right-0 bottom-0 left-0" viewBox="0 0 400 300" preserveAspectRatio="xMidYMid slice" style={{ overflow: 'visible' }}>
                  <path d="M 200 150 L 200 80 Q 200 60 180 60 L 40 60" stroke="#262626" strokeWidth="1" fill="none"></path>
                  <path d="M 200 150 L 200 80 Q 200 60 180 60 L 40 60" stroke="#10b981" strokeWidth="1.5" fill="none" strokeDasharray="6 6" strokeLinecap="round" style={{ animation: 'flow-noodle 3s linear infinite' }}></path>
                  <path d="M 200 150 L 340 150 Q 360 150 360 130 L 360 80" stroke="#262626" strokeWidth="1" fill="none"></path>
                  <path d="M 200 150 L 340 150 Q 360 150 360 130 L 360 80" stroke="#10b981" strokeWidth="1.5" fill="none" strokeDasharray="6 6" strokeLinecap="round" style={{ animation: 'flow-noodle 4s linear infinite reverse' }}></path>
                  <path d="M 200 150 L 200 220 Q 200 240 180 240 L 60 240" stroke="#262626" strokeWidth="1" fill="none"></path>
                  <path d="M 200 150 L 200 220 Q 200 240 180 240 L 60 240" stroke="#10b981" strokeWidth="1.5" fill="none" strokeDasharray="6 6" strokeLinecap="round" style={{ animation: 'flow-noodle 3.5s linear infinite' }}></path>
                </svg>
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 rounded-full border border-emerald-500/20 bg-emerald-500/5 blur-3xl z-0"></div>
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20">
                  <div className="bg-neutral-950 border border-emerald-500/30 p-3 rounded-2xl shadow-[0_0_30px_-10px_rgba(16,185,129,0.3)] cursor-pointer hover:border-emerald-500/60 transition-colors">
                    <iconify-icon icon="solar:cpu-bold-duotone" class="text-emerald-400" style={{fontSize:'1.5rem'}}></iconify-icon>
                  </div>
                </div>
                <div className="transition-transform duration-700 hover:-translate-y-2 absolute top-[20%] left-[10%]" style={{ transform: 'translate(-50%, -250%)' }}>
                  <div className="flex items-center gap-2 bg-neutral-800/90 backdrop-blur-md border border-neutral-700 pr-4 pl-3 py-2 rounded-full shadow-xl hover:border-blue-500/50 transition-all cursor-pointer group">
                    <iconify-icon icon="simple-icons:react" class="text-blue-400 group-hover:rotate-180 transition-transform duration-700" style={{fontSize:'1rem'}}></iconify-icon>
                    <span className="text-xs font-medium text-white">React Native</span>
                  </div>
                </div>
                <div className="transition-transform duration-700 delay-100 hover:-translate-y-2 z-10 absolute top-[27%] right-[10%]" style={{ transform: 'translate(50%, -200%)' }}>
                  <div className="flex items-center gap-2 bg-neutral-800/90 backdrop-blur-md border border-neutral-700 pr-4 pl-3 py-2 rounded-full shadow-xl hover:border-purple-500/50 transition-all cursor-pointer">
                    <iconify-icon icon="solar:database-bold-duotone" class="text-purple-400" style={{fontSize:'1rem'}}></iconify-icon>
                    <span className="text-xs font-medium text-white">PostgreSQL</span>
                  </div>
                </div>
                <div className="absolute bottom-[20%] left-[15%] transition-transform duration-700 delay-200 hover:-translate-y-2 z-10" style={{ transform: 'translate(-50%, 250%)' }}>
                  <div className="flex items-center gap-2 bg-neutral-800/90 backdrop-blur-md border border-neutral-700 pr-4 pl-3 py-2 rounded-full shadow-xl hover:border-green-500/50 transition-all cursor-pointer">
                    <iconify-icon icon="solar:server-bold-duotone" class="text-green-400" style={{fontSize:'1rem'}}></iconify-icon>
                    <span className="text-xs font-medium text-white">Node.js</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Card 2: Blockchain */}
          <div className="animate-on-scroll group relative bg-neutral-900 border border-neutral-800 rounded-[2.5rem] p-8 md:p-12 overflow-hidden flex flex-col h-[600px] hover:border-neutral-700 transition-all duration-500" data-animation="right" data-delay="300">
            <div className="absolute top-0 right-0 w-96 h-96 bg-blue-900/10 rounded-full blur-3xl pointer-events-none"></div>
            <div className="relative z-10 flex flex-col gap-4 mb-10">
              <div className="flex text-blue-400 bg-neutral-800 w-12 h-12 border-neutral-700 border rounded-full mb-2 items-center justify-center">
                <iconify-icon icon="solar:layers-bold-duotone" style={{fontSize:'1.5rem'}}></iconify-icon>
              </div>
              <h3 className="uppercase text-2xl font-semibold text-white tracking-tight font-bricolage">Expertise Blockchain</h3>
              <p className="text-neutral-400 text-sm leading-relaxed max-w-xs font-space">Développement Web3 & Smart Contracts. Sécurisation et transparence des données décentralisées.</p>
            </div>
            <div className="relative z-10 flex-1 w-full bg-neutral-950 border border-neutral-800 rounded-2xl p-6 shadow-2xl flex flex-col gap-4 font-space overflow-hidden group-hover:border-neutral-700/50 transition-colors">
              <div className="flex items-center justify-between border-b border-neutral-800 pb-4 mb-2">
                <div className="flex items-center gap-2">
                  <iconify-icon icon="solar:shield-check-bold-duotone" class="w-4 h-4 text-neutral-400" style={{fontSize:'1rem'}}></iconify-icon>
                  <span className="text-xs font-bold uppercase tracking-wider text-neutral-300">Smart Contract Deploy</span>
                </div>
                <span className="bg-blue-900/20 text-blue-300 border border-blue-800/50 text-[0.6rem] font-bold uppercase tracking-wider px-2 py-1 rounded">Solidity</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-[0.65rem] font-bold uppercase tracking-wider text-neutral-500 w-10 text-right">Chain</span>
                <div className="flex-1 bg-neutral-900 border border-neutral-700 rounded-lg px-3 py-2.5 text-xs text-neutral-300 flex justify-between items-center cursor-pointer hover:border-neutral-600 transition-colors">
                  <div className="flex items-center gap-2">
                    <iconify-icon icon="simple-icons:ethereum" style={{fontSize:'1rem', color:'#a78bfa'}}></iconify-icon>
                    <span>Ethereum</span>
                  </div>
                  <iconify-icon icon="solar:alt-arrow-down-bold-duotone" style={{fontSize:'1rem'}}></iconify-icon>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-[0.65rem] font-bold uppercase tracking-wider text-neutral-500 w-10 text-right">Type</span>
                <div className="flex-1 bg-neutral-900 border border-neutral-700 rounded-lg px-3 py-2.5 text-xs text-neutral-300 flex justify-between items-center cursor-pointer hover:border-neutral-600 transition-colors">
                  <div className="flex items-center gap-2">
                    <iconify-icon icon="solar:layers-bold-duotone" style={{fontSize:'1rem'}}></iconify-icon>
                    <span>dApp</span>
                  </div>
                  <iconify-icon icon="solar:alt-arrow-down-bold-duotone" style={{fontSize:'1rem'}}></iconify-icon>
                </div>
                <div className="w-14 bg-neutral-900 border border-neutral-700 rounded-lg px-3 py-2.5 text-xs text-white font-medium flex items-center justify-center">
                  <iconify-icon icon="solar:check-circle-bold-duotone" class="text-emerald-400" style={{fontSize:'1rem'}}></iconify-icon>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-[0.65rem] font-bold uppercase tracking-wider text-neutral-500 w-10 text-right">Lang</span>
                <div className="flex-1 bg-neutral-900 border border-neutral-700 rounded-lg px-3 py-2.5 text-xs text-neutral-300 flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <iconify-icon icon="solar:document-bold-duotone" style={{fontSize:'1rem', color:'#fb923c'}}></iconify-icon>
                    <span>Solidity</span>
                  </div>
                </div>
                <div className="w-24 bg-neutral-900 border border-neutral-700 rounded-lg px-3 py-2.5 text-xs text-white font-medium">
                  <span>Web3.js</span>
                </div>
              </div>
              <button className="mt-2 flex items-center gap-2 text-neutral-500 text-xs font-bold uppercase tracking-widest hover:text-white transition-colors w-max py-2">
                <iconify-icon icon="solar:add-circle-bold-duotone" style={{fontSize:'1rem'}}></iconify-icon>
                <span>Voir Projets Web3</span>
              </button>
            </div>
          </div>
        </div>

        {/* Cards 3 & 4 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[
            { id: 'info-gestion', icon: 'solar:monitor-bold-duotone', color: 'text-indigo-400', glow: 'rgba(99,102,241,0.1)', title: 'Informatique en Gestion', desc: 'Systèmes ERP/CRM. Optimisation des processus métiers par l\'intégration technologique.', tags: ['ERP', 'CRM', 'Audit Digital'], delay: '400' },
            { id: 'strategie', icon: 'solar:chart-2-bold-duotone', color: 'text-purple-400', glow: 'rgba(168,85,247,0.1)', title: 'Analyse Stratégique', desc: 'Structure Business, ROI, Optimisation Processus, Stratégie Tech.', tags: ['Business', 'ROI', 'Stratégie'], delay: '500' },
          ].map(({ id, icon, color, glow, title, desc, tags, delay }) => (
            <div key={id} className="animate-on-scroll group relative bg-neutral-900 border border-neutral-800 rounded-[2rem] p-8 overflow-hidden hover:border-neutral-700 transition-all duration-500" data-animation="up" data-delay={delay}>
              <div className={`absolute top-0 right-0 w-64 h-64 rounded-full blur-3xl pointer-events-none`} style={{ background: glow }}></div>
              <div className={`w-12 h-12 rounded-full bg-neutral-800 flex items-center justify-center ${color} mb-6 border border-neutral-700`}>
                <iconify-icon icon={icon} style={{fontSize:'1.5rem'}}></iconify-icon>
              </div>
              <h3 className="uppercase text-xl font-semibold text-white tracking-tight font-bricolage mb-3">{title}</h3>
              <p className="text-neutral-400 text-sm leading-relaxed font-space mb-6">{desc}</p>
              <div className="flex flex-wrap gap-2">
                {tags.map(tag => (
                  <span key={tag} className="bg-neutral-800 px-3 py-1 rounded-full border border-neutral-700 text-[0.6rem] font-bold uppercase tracking-widest text-neutral-400">{tag}</span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Remaining sections placeholder — added in Tasks 8-10 */}
    </main>
  );
}

export default App;
```

- [ ] **Step 2: Vérifier dans le navigateur**

```bash
npm run dev
```
Ouvrir `http://localhost:5173` — la section Expertise doit apparaître avec les 4 cards, SVG animés, floating tech pills.

- [ ] **Step 3: Commit**

```bash
git add src/App.jsx
git commit -m "feat: add Expertise section with ZIP cards and SVG noodles"
```

---

## Task 8: Ajouter la section Projets GitHub dans App.jsx

**Files:**
- Modify: `src/App.jsx`

- [ ] **Step 1: Ajouter le hook GitHub et la section Projets**

En haut de `App()`, après `const containerRef = useRef(null);`, ajouter :

```jsx
  const [repos, setRepos] = useState([]);
  const [reposLoading, setReposLoading] = useState(true);

  useEffect(() => {
    fetch('https://api.github.com/users/Peter23xp/repos?sort=updated&per_page=100')
      .then(r => r.json())
      .then(data => { if (Array.isArray(data)) { setRepos(data); } })
      .catch(() => {})
      .finally(() => setReposLoading(false));
  }, []);

  const langColors = {
    JavaScript: '#fbbf24', TypeScript: '#60a5fa', HTML: '#fb923c',
    CSS: '#60a5fa', Python: '#4ade80', default: '#a3a3a3'
  };
```

Remplacer `{/* Remaining sections placeholder — added in Tasks 8-10 */}` par :

```jsx
      {/* ===== PROJETS GITHUB ===== */}
      <div id="projets" className="flex flex-col md:px-0 z-20 w-full max-w-[90rem] border-white/5 border-t mt-32 mr-auto ml-auto pt-12 pr-4 pb-12 pl-4 relative gap-x-16 gap-y-16">
        <div className="flex flex-col items-center text-center gap-6 max-w-3xl mx-auto">
          <div className="animate-on-scroll flex items-center gap-2 px-3 py-1 rounded-full border border-neutral-800 bg-neutral-900/50 text-[0.65rem] uppercase tracking-widest text-neutral-400 font-semibold" data-animation="up" data-delay="0">
            <iconify-icon icon="solar:code-bold-duotone" class="text-emerald-400" style={{fontSize:'0.75rem'}}></iconify-icon>
            <span>Open Source</span>
          </div>
          <h2 className="animate-on-scroll md:text-5xl lg:text-6xl uppercase leading-[0.9] text-3xl font-medium text-white tracking-tight font-bricolage" data-animation="up" data-delay="100">
            Projets <span className="text-neutral-600">GitHub</span>
          </h2>
          <p className="animate-on-scroll text-sm md:text-base text-neutral-400 font-normal uppercase tracking-wide max-w-xl" data-animation="up" data-delay="150">
            Contributions open-source, de la cybersécurité à la gestion.
          </p>
        </div>

        {reposLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 px-2">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="animate-pulse bg-neutral-900/40 border border-white/5 rounded-[2rem] h-[280px]"></div>
            ))}
          </div>
        ) : (
          <div className="w-full relative perspective-[2000px]">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[60%] h-[40%] bg-emerald-900/10 blur-[120px] rounded-full pointer-events-none"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 px-2">
              {repos.map((repo, index) => (
                <a
                  key={repo.id}
                  href={repo.html_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`animate-on-scroll group relative flex flex-col justify-between bg-neutral-950/40 backdrop-blur-xl border border-white/5 hover:border-white/20 rounded-[2rem] p-8 transition-all duration-500 hover:-translate-y-2 overflow-hidden no-underline ${index % 2 === 1 ? 'lg:mt-12' : ''} ${index % 2 === 0 ? 'animate-levitate' : 'animate-levitate-delayed'}`}
                  data-animation="up"
                  data-delay={String(200 + index * 100)}
                  style={{ minHeight: '280px' }}
                >
                  <div className="absolute inset-0 bg-gradient-to-b from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>
                  <div className="flex justify-between items-start z-10 relative">
                    <span className="text-[0.6rem] font-bold uppercase tracking-widest text-neutral-500 border border-white/5 px-2 py-1 rounded-md bg-neutral-900/50">
                      {repo.language || 'Code'}
                    </span>
                    <div className="flex items-center gap-1">
                      <iconify-icon icon="solar:star-bold-duotone" class="text-yellow-400" style={{fontSize:'0.875rem'}}></iconify-icon>
                      <span className="text-sm font-medium" style={{ color: langColors[repo.language] || langColors.default }}>
                        {repo.stargazers_count}
                      </span>
                    </div>
                  </div>
                  <div className="absolute inset-0 flex items-center justify-center opacity-40 group-hover:opacity-100 transition-all duration-500 grayscale group-hover:grayscale-0 group-hover:scale-110">
                    <iconify-icon icon="solar:code-square-bold-duotone" class="text-white" style={{fontSize:'4rem'}}></iconify-icon>
                  </div>
                  <div className="z-10 relative flex flex-col gap-1 border-t border-white/5 pt-4">
                    <span className="text-2xl font-medium text-white font-bricolage group-hover:translate-x-1 transition-transform duration-300 truncate">{repo.name}</span>
                    {repo.description && (
                      <p className="text-xs text-neutral-500 line-clamp-2 leading-relaxed">{repo.description}</p>
                    )}
                    <p className="text-xs text-neutral-500 uppercase tracking-wider font-semibold flex items-center gap-2 mt-1">
                      GitHub
                      <iconify-icon icon="solar:arrow-right-bold-duotone" class="text-neutral-600 group-hover:text-white transition-colors" style={{fontSize:'0.75rem'}}></iconify-icon>
                    </p>
                  </div>
                </a>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Remaining sections placeholder — added in Tasks 9-10 */}
    </main>
  );
}

export default App;
```

- [ ] **Step 2: Vérifier dans le navigateur**

```bash
npm run dev
```
Ouvrir `http://localhost:5173` — les repos GitHub de `Peter23xp` doivent charger dynamiquement dans les cards lévitation.

- [ ] **Step 3: Commit**

```bash
git add src/App.jsx
git commit -m "feat: add GitHub projects section with live API + levitation cards"
```

---

## Task 9: Ajouter la section Parcours dans App.jsx

**Files:**
- Modify: `src/App.jsx`

- [ ] **Step 1: Remplacer le placeholder par la section Parcours**

Remplacer `{/* Remaining sections placeholder — added in Tasks 9-10 */}` par :

```jsx
      {/* ===== PARCOURS ===== */}
      <div id="parcours" className="flex flex-col md:px-0 z-20 w-full max-w-[90rem] border-white/5 border-t mt-32 mr-auto ml-auto pt-12 pr-4 pb-12 pl-4 relative gap-x-16 gap-y-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 w-full">
          {/* Left panel — dark dot pattern */}
          <div className="lg:col-span-5 relative flex flex-col justify-center p-6 lg:p-12 overflow-hidden rounded-[2.5rem] bg-neutral-900/50 border border-white/5">
            <div className="absolute inset-0 opacity-20 pointer-events-none" style={{ backgroundImage: 'radial-gradient(#10b981 1.5px, transparent 1.5px)', backgroundSize: '32px 32px' }}></div>
            <div className="absolute inset-0 bg-gradient-to-r from-neutral-950 via-transparent to-transparent"></div>
            <div className="relative z-10 flex flex-col gap-8">
              <div className="flex items-center gap-4">
                <span className="h-px w-8 bg-emerald-500/50"></span>
                <span className="text-emerald-400 text-xs font-bold tracking-[0.2em] uppercase font-space">Parcours</span>
              </div>
              <h2 className="animate-on-scroll text-4xl md:text-5xl font-medium text-white tracking-tight font-bricolage leading-[1.1]" data-animation="left" data-delay="0">
                Mon évolution,{' '}
                <span className="text-neutral-500">Simplifiée.</span>
              </h2>
              <p className="animate-on-scroll text-neutral-400 text-sm md:text-base leading-relaxed font-space max-w-md" data-animation="left" data-delay="100">
                De la gestion commerciale vers l'ingénierie logicielle avancée à l'ULK (Kigali).
              </p>
              <a href="/peterCv.pdf" download className="mt-4 group flex items-center gap-3 text-sm font-medium text-white w-max">
                <span className="border-b border-emerald-500 pb-0.5 group-hover:border-white transition-colors">Voir CV complet</span>
                <iconify-icon icon="solar:arrow-right-bold-duotone" class="text-emerald-400 group-hover:translate-x-1 transition-transform" style={{fontSize:'1rem'}}></iconify-icon>
              </a>
            </div>
          </div>

          {/* Right panel — white milestones */}
          <div className="lg:col-span-7 bg-white text-neutral-950 rounded-[2.5rem] p-8 md:p-16 flex flex-col justify-between gap-0 relative overflow-hidden">
            <div className="absolute -top-20 -right-20 w-64 h-64 bg-emerald-100 rounded-full blur-[80px] opacity-60 pointer-events-none"></div>
            {[
              { icon: 'solar:graduation-cap-bold-duotone', iconColor: '#4ade80', period: '2023–2027', title: "ULK — Ingénierie Logicielle", subtitle: 'Kigali · Architecture Système', badgeBg: '#f0fdf4', badgeBorder: '#bbf7d0', badgeColor: '#15803d', badgeText: 'Présent', delay: '0' },
              { icon: 'solar:cpu-bolt-bold-duotone', iconColor: '#60a5fa', period: '2021–2023', title: "Support Technique & Systèmes", subtitle: 'Maintenance · Optimisation', badgeBg: '#eff6ff', badgeBorder: '#bfdbfe', badgeColor: '#1d4ed8', badgeText: 'Expérience', delay: '100' },
              { icon: 'solar:chart-2-bold-duotone', iconColor: '#c084fc', period: 'Avant 2021', title: "Diplôme — Commercial & Gestion", subtitle: 'Économie · Comptabilité', badgeBg: '#faf5ff', badgeBorder: '#e9d5ff', badgeColor: '#7e22ce', badgeText: 'Fondation', delay: '200' },
              { icon: 'solar:rocket-bold-duotone', iconColor: '#fb923c', period: '2026', title: "Stage Ingénierie Logicielle", subtitle: 'Objectif · Disponible', badgeBg: '#fff7ed', badgeBorder: '#fed7aa', badgeColor: '#c2410c', badgeText: 'Ouvert', pulse: true, delay: '300' },
            ].map(({ icon, iconColor, period, title, subtitle, badgeBg, badgeBorder, badgeColor, badgeText, pulse, delay }, i, arr) => (
              <React.Fragment key={title}>
                <div className="animate-on-scroll flex flex-col sm:flex-row gap-6 sm:gap-12 items-start sm:items-center relative z-10 group py-6" data-animation="up" data-delay={delay}>
                  <div className="flex items-center gap-4 w-full sm:w-48 shrink-0">
                    <div className="w-10 h-10 rounded-xl bg-neutral-950 flex items-center justify-center flex-shrink-0">
                      <iconify-icon icon={icon} style={{fontSize:'1.25rem', color: iconColor}}></iconify-icon>
                    </div>
                    <span className="text-sm font-bold tracking-tight text-neutral-900 whitespace-nowrap">{period}</span>
                  </div>
                  <div className="flex-1 flex flex-col gap-1">
                    <span className="text-base font-semibold text-neutral-900 tracking-tight">{title}</span>
                    <span className="text-xs text-neutral-400 uppercase tracking-widest">{subtitle}</span>
                  </div>
                  <div className="flex items-center gap-2 px-3 py-1.5 rounded-full shrink-0 border" style={{ background: badgeBg, borderColor: badgeBorder }}>
                    {pulse && <span className="w-2 h-2 rounded-full bg-orange-400 animate-ping absolute"></span>}
                    {pulse && <span className="w-2 h-2 rounded-full bg-orange-400 relative"></span>}
                    <span className="text-[0.65rem] font-black uppercase tracking-widest whitespace-nowrap" style={{ color: badgeColor }}>{badgeText}</span>
                  </div>
                </div>
                {i < arr.length - 1 && <div className="h-px w-full bg-neutral-100"></div>}
              </React.Fragment>
            ))}
          </div>
        </div>
      </div>

      {/* Remaining sections placeholder — added in Task 10 */}
    </main>
  );
}

export default App;
```

- [ ] **Step 2: Vérifier**

```bash
npm run dev
```
Ouvrir `http://localhost:5173` — section Parcours doit afficher panel dark + 4 milestones blancs.

- [ ] **Step 3: Commit**

```bash
git add src/App.jsx
git commit -m "feat: add Parcours section with ZIP statistics layout"
```

---

## Task 10: Ajouter Contact + Footer dans App.jsx

**Files:**
- Modify: `src/App.jsx`

- [ ] **Step 1: Remplacer le placeholder par Contact + Footer**

Remplacer `{/* Remaining sections placeholder — added in Task 10 */}` par :

```jsx
      {/* ===== CONTACT ===== */}
      <div id="contact" className="flex flex-col md:px-0 z-20 w-full max-w-[90rem] border-white/5 border-t mt-32 mr-auto ml-auto pt-12 pr-4 pb-24 pl-4 relative gap-y-12 items-center text-center">
        <div className="flex flex-col items-center gap-6 max-w-3xl">
          <div className="animate-on-scroll flex items-center gap-2 px-3 py-1 rounded-full border border-neutral-800 bg-neutral-900/50 text-[0.65rem] uppercase tracking-widest text-neutral-400 font-semibold" data-animation="up" data-delay="0">
            <iconify-icon icon="solar:star-bold-duotone" class="text-emerald-400" style={{fontSize:'0.75rem'}}></iconify-icon>
            <span>Ouvert aux Opportunités Professionnelles</span>
          </div>
          <h2 className="animate-on-scroll md:text-5xl lg:text-6xl uppercase leading-[0.9] text-3xl font-medium text-white tracking-tight font-bricolage" data-animation="up" data-delay="100">
            Bâtissons la <span className="text-neutral-600">Prochaine</span> Grande Solution
          </h2>
          <p className="animate-on-scroll text-sm md:text-base text-neutral-400 font-normal uppercase tracking-wide max-w-xl" data-animation="up" data-delay="150">
            Je recherche activement mon Stage 2026. Étudiant en Software Engineering à l'ULK, basé à Gisenyi (Rwanda) / Goma (RDC).
          </p>
          <div className="animate-on-scroll flex flex-wrap justify-center gap-4" data-animation="up" data-delay="200">
            <a href="mailto:peter23xp@gmail.com" className="group flex items-center gap-2 overflow-hidden uppercase transition-all duration-500 hover:scale-[1.02] hover:shadow-[0_0_40px_-10px_rgba(59,130,246,0.5)] text-sm font-medium text-white tracking-widest font-space rounded-full pt-5 pr-10 pb-5 pl-10 relative">
              <div className="absolute inset-0 -z-20 rounded-full overflow-hidden p-[1px]">
                <div className="absolute inset-[-100%] bg-[conic-gradient(from_0deg,transparent_0_300deg,#3b82f6_360deg)]" style={{ animation: 'beam-spin 3s linear infinite' }}></div>
                <div className="absolute inset-[1px] rounded-full bg-neutral-950"></div>
              </div>
              <div className="-z-10 overflow-hidden bg-neutral-950 rounded-full absolute top-[2px] right-[2px] bottom-[2px] left-[2px]">
                <div className="absolute inset-0 bg-gradient-to-b from-neutral-800/60 to-transparent"></div>
                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-2/3 h-1/2 bg-blue-500/10 blur-2xl rounded-full group-hover:bg-blue-500/30 transition-colors"></div>
              </div>
              <iconify-icon icon="solar:letter-bold-duotone" class="relative z-10 text-blue-400" style={{fontSize:'1rem'}}></iconify-icon>
              <span className="relative z-10">M'envoyer un Email</span>
            </a>
            <a href="https://www.linkedin.com/in/peter-akilimali-1a7016282/" target="_blank" rel="noopener noreferrer" className="animate-on-scroll px-6 py-4 rounded-full border border-neutral-700 text-[0.7rem] font-bold uppercase tracking-widest hover:bg-neutral-800 transition-colors flex items-center gap-2" data-animation="up" data-delay="250">
              <iconify-icon icon="solar:linkedin-bold-duotone" class="text-blue-400" style={{fontSize:'1rem'}}></iconify-icon>
              LinkedIn
            </a>
            <a href="https://wa.me/243902238740" target="_blank" rel="noopener noreferrer" className="animate-on-scroll px-6 py-4 rounded-full border border-neutral-700 text-[0.7rem] font-bold uppercase tracking-widest hover:bg-neutral-800 transition-colors flex items-center gap-2" data-animation="up" data-delay="300">
              <iconify-icon icon="solar:chat-round-bold-duotone" class="text-emerald-400" style={{fontSize:'1rem'}}></iconify-icon>
              WhatsApp
            </a>
            <a href="/peterCv.pdf" download className="animate-on-scroll px-6 py-4 rounded-full border border-neutral-700 text-[0.7rem] font-bold uppercase tracking-widest hover:bg-neutral-800 transition-colors flex items-center gap-2" data-animation="up" data-delay="350">
              <iconify-icon icon="solar:download-bold-duotone" class="text-orange-400" style={{fontSize:'1rem'}}></iconify-icon>
              CV PDF
            </a>
          </div>
        </div>
      </div>

      {/* ===== FOOTER ===== */}
      <footer className="bg-neutral-950 w-full border-white/5 rounded-3xl border-t mt-0 pt-24 pb-12 relative">
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[80%] h-[300px] bg-gradient-to-t from-emerald-900/10 to-transparent blur-[100px] pointer-events-none"></div>
        <div className="max-w-[90rem] mx-auto px-6 md:px-12 relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8 mb-20">
            {/* Brand */}
            <div className="lg:col-span-1 flex flex-col gap-6">
              <a href="#" className="text-2xl font-bold tracking-tight text-white">Peter<span className="text-indigo-400">.</span></a>
              <p className="text-neutral-400 text-sm leading-relaxed max-w-xs font-space">
                Ingénieur Logiciel & Architecte Business. Lier rigueur technique et valeur commerciale stratégique.
              </p>
              <div className="flex items-center gap-4 mt-2">
                {[
                  { href: 'https://www.linkedin.com/in/peter-akilimali-1a7016282/', icon: 'solar:linkedin-bold-duotone', hoverColor: 'hover:border-blue-500/50 hover:bg-blue-950/30' },
                  { href: 'tel:+243998439596', icon: 'solar:phone-bold-duotone', hoverColor: 'hover:border-blue-400/50 hover:bg-blue-950/30' },
                  { href: 'mailto:peter23xp@gmail.com', icon: 'solar:letter-bold-duotone', hoverColor: 'hover:border-red-500/50 hover:bg-red-950/30' },
                ].map(({ href, icon, hoverColor }) => (
                  <a key={href} href={href} target="_blank" rel="noopener noreferrer" className={`w-10 h-10 rounded-full bg-neutral-900 border border-neutral-800 flex items-center justify-center text-neutral-400 hover:text-white transition-all duration-300 ${hoverColor}`}>
                    <iconify-icon icon={icon} style={{fontSize:'1.25rem'}}></iconify-icon>
                  </a>
                ))}
              </div>
            </div>

            {/* Navigation */}
            <div className="flex flex-col gap-4">
              <h4 className="text-white font-semibold text-sm uppercase tracking-widest mb-2">Navigation</h4>
              {[['#projets','Projets'],['#expertise','Expertise'],['#parcours','Parcours'],['#contact','Contact']].map(([href, label]) => (
                <a key={href} href={href} className="text-neutral-400 hover:text-emerald-400 text-sm transition-colors w-max">{label}</a>
              ))}
            </div>

            {/* Stack */}
            <div className="flex flex-col gap-4">
              <h4 className="text-white font-semibold text-sm uppercase tracking-widest mb-2">Stack</h4>
              {['React / Next.js', 'Node.js', 'PostgreSQL / MySQL', 'Solidity / Web3'].map(t => (
                <span key={t} className="text-neutral-400 text-sm">{t}</span>
              ))}
            </div>

            {/* Stage */}
            <div className="flex flex-col gap-4">
              <h4 className="text-white font-semibold text-sm uppercase tracking-widest mb-2">Stage 2026</h4>
              <div className="p-6 rounded-3xl bg-neutral-900 border border-neutral-800 relative overflow-hidden group">
                <div className="flex items-center gap-2 text-emerald-400 font-black text-[0.65rem] mb-3 uppercase tracking-widest">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                  </span>
                  Disponible
                </div>
                <p className="text-xs text-neutral-400 leading-relaxed font-medium">Prêt à déployer des solutions techniques.</p>
              </div>
            </div>
          </div>

          {/* Bottom bar */}
          <div className="w-full border-t border-white/5 pt-12 flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="flex items-center gap-8 grayscale opacity-30 hover:grayscale-0 hover:opacity-100 transition-all duration-500">
              <iconify-icon icon="simple-icons:vercel" class="text-white" style={{fontSize:'1.5rem'}}></iconify-icon>
              <iconify-icon icon="simple-icons:react" class="text-white" style={{fontSize:'1.5rem'}}></iconify-icon>
              <iconify-icon icon="simple-icons:tailwindcss" class="text-white" style={{fontSize:'1.5rem'}}></iconify-icon>
              <iconify-icon icon="simple-icons:ethereum" class="text-white" style={{fontSize:'1.5rem'}}></iconify-icon>
            </div>
            <p className="text-neutral-600 text-xs font-medium uppercase tracking-wider">
              &copy; 2025 Peter Akilimali · Gisenyi, Rwanda / Goma, RDC
            </p>
          </div>
        </div>
      </footer>
    </main>
  );
}

export default App;
```

- [ ] **Step 2: Vérifier le build complet**

```bash
npm run build
```
Expected: `dist/` généré, pas d'erreur.

- [ ] **Step 3: Tester le preview**

```bash
npm run preview
```
Ouvrir `http://localhost:4173` — vérifier toutes les sections (Hero, Expertise, Projets, Parcours, Contact, Footer), animations, API GitHub, liens.

- [ ] **Step 4: Commit**

```bash
git add src/App.jsx
git commit -m "feat: add Contact and Footer sections — full ZIP design complete"
```

---

## Task 11: Pousser la branche et créer la Pull Request

**Files:** aucun

- [ ] **Step 1: Pousser la branche**

```bash
git push -u origin new-design
```

- [ ] **Step 2: Créer la PR**

```bash
gh pr create \
  --title "feat: migrate portfolio to ZIP dark design (React/Vite)" \
  --base master \
  --head new-design \
  --body "$(cat <<'EOF'
## Summary
- Migration complète de Vanilla JS vers React 18 + Vite 5
- Design 100% identique au fichier ZIP Job-Board-Landing-Page-Template
- Données Peter Akilimali substituées (nom, photo, GitHub API, contacts, stack)
- Sections : Hero (ZIP exact) · Expertise (4 cards Solar) · Projets GitHub (API live) · Parcours (milestones) · Contact · Footer
- Toutes les animations ZIP préservées : beam-spin, marquee, levitate, flow-noodle, animate-on-scroll
- SEO meta tags actuels conservés
- Zéro emoji — icônes Iconify/Solar uniquement

## Test plan
- [ ] `npm run dev` — toutes les sections s'affichent sans erreur console
- [ ] Hero : container dark arrondi, image peter.jpeg en fond droit, typo massive, floating labels, marquee cards
- [ ] Expertise : 4 cards avec SVG noodles animés et floating tech pills
- [ ] Projets : repos GitHub de Peter23xp chargés dynamiquement en cards lévitation
- [ ] Parcours : panel dark + milestones blancs avec badges colorés
- [ ] Contact : bouton beam animé + 3 liens (LinkedIn, WhatsApp, CV)
- [ ] Footer : 4 colonnes + logos tech grayed out
- [ ] `npm run build` — build sans erreur
- [ ] Déploiement Vercel fonctionnel

🤖 Generated with [Claude Code](https://claude.com/claude-code)
EOF
)"
```

---
