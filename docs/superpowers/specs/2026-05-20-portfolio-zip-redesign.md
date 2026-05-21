
**Fichiers archivés (git, pas supprimés) :**
- `index.html` → renommé `index.html.bak` avant écrasement
- `src/main.js`, `src/style.css`, `src/translations.js`, `src/counter.js` → conservés dans git

---

## Sections & Contenu

### 1. Hero (structure 100% ZIP)

**Structure ZIP conservée :**
- Container principal : `bg-neutral-950`, `xl:rounded-[3.5rem]`, `border-gradient`, `xl:shadow-2xl`
- Image background droite : `w-1/2 h-[960px]` → remplacée par `/Jo.png`
- Lignes verticales décoratives : identiques
- Animations `animate-on-scroll` avec IntersectionObserver : identiques

**Données Jonathan substituées :**
- Logo : icône Iconify personnalisée (même position ZIP)
- Nav links : `Projects · Expertise · Journey · Contact` (+ button `CV PDF`)
- Badge avatars : "Open for 2026 Internship · Nairobi, Kenya"
- Floating labels : `Remote Friendly` · `JKUAT · 2024-2027` · `Full-Stack`
- Typo massive : **"Full Stack Developer"** — adapté de ZIP
- CTA beam button : `Contact Me` + `View GitHub`
- 3 feature cards marquee :
  - Card 1 : Stack tech (PHP, MySQL, Laravel, React, PostgreSQL, Tailwind, REST API)
  - Card 2 : Projects (POS System, Voting System, E-commerce, Student MGMT)
  - Card 3 : Contacts (Email, LinkedIn, WhatsApp, GitHub)

### 2. Expertise (remplace "Matching Engine" du ZIP)

**Structure ZIP conservée :** titre uppercase, 2 grandes cards `h-[600px]` avec grille de fond, SVG/noodles animés, floating tech pills, 2 cards secondaires.

**Données Jonathan :**
- Card 1 : Application Engineering — icône `solar:code-square-bold-duotone` (vert), flow tags Full-Stack → PHP/Laravel → API Design, pills React/MySQL/PHP
- Card 2 : UI/UX Architecture — icône `solar:palette-bold-duotone` (bleu), UI mockup "Design Tools" style Filter Rules ZIP
- Card 3 : Information Systems — icône `solar:monitor-bold-duotone` (violet), tags ERP/CRM/Digital Audit
- Card 4 : Strategic Analysis — icône `solar:chart-2-bold-duotone` (purple), tags Business/ROI/Strategy

### 3. Projets GitHub (remplace "Venture Backed" du ZIP)

**Structure ZIP conservée :** 4 cards lévitation avec décalage alterné (`lg:mt-12`), icône large en fond (opacity 40%), border `border-white/5`, hover `border-white/20`, animations `animate-levitate` et `animate-levitate-delayed`.

**Données dynamiques :** API GitHub `https://api.github.com/users/Jo-Dev28/repos?sort=updated&per_page=100`

Chaque card affiche :
- Langage (badge top-left)
- Étoiles (top-right, icône `solar:star-bold-duotone`)
- Icône repo en fond (opacity 40%)
- Nom du repo (grand, bas)
- Description courte (ou lien README)
- Lien vers GitHub (flèche)

Grille responsive : 1 col mobile → 2 col md → 4 col lg (ou adapté au nombre de repos).

### 4. Parcours (remplace "Statistics" du ZIP)

**Structure ZIP conservée :** layout `lg:grid-cols-12`, col-5 dark avec dot pattern + texte, col-7 blanc avec lignes horizontales séparant les items.

**Données Jonathan :**
- Panel gauche dark : "My evolution, Simplified." + link "View full CV"
- Panel droit blanc : 4 milestones avec icônes Solar + badges colorés
  1. JKUAT 2024–Present — `solar:graduation-cap-bold-duotone` — badge "Current" green
  2. Zetech Internship 2023 — `solar:cpu-bolt-bold-duotone` — badge "Experience" blue
  3. IT Diploma 2020–2023 — `solar:chart-2-bold-duotone` — badge "Foundation" purple
  4. Internship 2026 — `solar:rocket-bold-duotone` — badge "Open" orange animated (pulse)

### 5. Contact (adapté du ZIP Footer CTA)

- Badge "Open for Professional Opportunities"
- Title : "Let's Build the Next Great Solution"
- Description Jonathan (internship 2026, JKUAT, Nairobi)
- 4 buttons pills style ZIP : Email (`josbosimwenda@gmail.com`) · LinkedIn · WhatsApp (`+254768062600`) · CV PDF

### 6. Footer (structure ZIP conservée)

- 4 columns : Brand+socials · Navigation · Tech Stack · Internship 2026 Status
- Bottom bar : grayscale tech logos (Vercel, React, Tailwind, Laravel) + copyright "2025 Jonathan Bosimwenda · Nairobi, Kenya"

---

## Animations (identiques au ZIP)

- `IntersectionObserver` avec `animate-on-scroll` : `animate-up`, `animate-left`, `animate-right`, `animate-fade`
- `marquee-up` : cartes feature hero (scroll vertical infini)
- `beam-spin` : bouton CTA principal (border animée)
- `dots-move` : texture dots dans CTA
- `levitate` + `levitate-delayed` : cards projets GitHub
- `flow-noodle` : SVG animés dans cards Expertise

---

## SEO & Meta

Conserver toutes les balises meta du `index.html` actuel :
- `<title>Jonathan Bosimwenda | Full-Stack Developer & UI/UX Architect</title>`
- Open Graph, Twitter Card, canonical, sitemap, robots
- Google Fonts : Space Grotesk + Oswald + Bricolage Grotesque (remplace Outfit)

---

## Dépendances (package.json ZIP)

```json
{
  "dependencies": {
    "iconify-icon": "^2.1.0",
    "react": "^18.3.1",
    "react-dom": "^18.3.1"
  },
  "devDependencies": {
    "@vitejs/plugin-react": "^4.3.1",
    "autoprefixer": "^10.4.20",
    "tailwindcss": "^3.4.10",
    "vite": "^5.4.1",
    "postcss": "^8.4.41"
  }
}