import React, { useEffect, useRef, useState } from 'react';
import translations from './translations';

const GITHUB_USER = 'Jo-Dev28';
const GH_TOKEN = import.meta.env.VITE_GITHUB_TOKEN;
const ghFetch = (url) => fetch(url, GH_TOKEN ? { headers: { Authorization: `Bearer ${GH_TOKEN}` } } : {});

const langColors = {
  JavaScript: '#fbbf24',
  TypeScript: '#60a5fa',
  HTML: '#fb923c',
  CSS: '#818cf8',
  Python: '#4ade80',
  Solidity: '#a78bfa',
  Java: '#fb923c',
  'C++': '#60a5fa',
  Rust: '#fb923c',
  Go: '#4ade80',
  PHP: '#8892bf',
  'Jupyter Notebook': '#f37626',
};

function RepoModal({ repo, onClose }) {
  const [readme, setReadme] = useState(null);
  const [readmeLoading, setReadmeLoading] = useState(true);
  const hasDesc = !!repo.description;
  const [tab, setTab] = useState('readme');
  const [language, setLanguage] = useState(() => localStorage.getItem('language') || 'en');
  const t = translations[language];

  useEffect(() => {
    fetch(`https://api.github.com/repos/${GITHUB_USER}/${repo.name}/readme`, {
      headers: { Accept: 'application/vnd.github.raw', ...(GH_TOKEN ? { Authorization: `Bearer ${GH_TOKEN}` } : {}) }
    })
      .then(r => r.ok ? r.text() : Promise.reject())
      .then(text => setReadme(text))
      .catch(() => setReadme(null))
      .finally(() => setReadmeLoading(false));
  }, [repo.name]);

  useEffect(() => {
    if (!readmeLoading) {
      if (readme) setTab('readme');
      else if (hasDesc) setTab('description');
    }
  }, [readmeLoading]);

  useEffect(() => {
    const onKey = e => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [onClose]);

  const hasReadme = !!readme;
  const showTabs = hasReadme && hasDesc;

  return (
    <div
      className="fixed inset-0 z-[999] flex items-center justify-center p-4"
      style={{background:'rgba(0,0,0,0.85)', backdropFilter:'blur(8px)'}}
      onClick={e => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="relative bg-neutral-950 border border-neutral-800 rounded-[2rem] w-full max-w-3xl max-h-[80vh] flex flex-col overflow-hidden shadow-2xl">
        <div className="flex items-center justify-between px-8 py-5 border-b border-neutral-800 flex-shrink-0">
          <div className="flex items-center gap-3">
            <iconify-icon icon="solar:document-bold-duotone" class="text-emerald-400" style={{fontSize:'1.25rem'}}></iconify-icon>
            <span className="text-white font-semibold text-sm uppercase tracking-widest font-bricolage">{repo.name}</span>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-neutral-900 border border-neutral-800 flex items-center justify-center text-neutral-400 hover:text-white hover:border-neutral-600 transition-all"
          >
            <iconify-icon icon="solar:close-bold" style={{fontSize:'1rem'}}></iconify-icon>
          </button>
        </div>

        {showTabs && (
          <div className="flex gap-1 px-8 pt-4 flex-shrink-0">
            {[
              { key: 'readme', label: 'README', icon: 'solar:document-bold-duotone' },
              { key: 'description', label: t.modal_desc || 'Description', icon: 'solar:info-circle-bold-duotone' },
            ].map(({ key, label, icon }) => (
              <button
                key={key}
                onClick={() => setTab(key)}
                className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-[0.65rem] font-bold uppercase tracking-widest transition-all ${
                  tab === key
                    ? 'bg-neutral-800 text-white border border-neutral-700'
                    : 'text-neutral-500 hover:text-neutral-300'
                }`}
              >
                <iconify-icon icon={icon} style={{fontSize:'0.875rem'}}></iconify-icon>
                {label}
              </button>
            ))}
          </div>
        )}

        <div className="overflow-y-auto px-8 py-6 flex-1">
          {readmeLoading ? (
            <div className="flex items-center justify-center py-16">
              <div className="w-6 h-6 border-2 border-emerald-400 border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : tab === 'readme' && hasReadme ? (
            <pre className="text-neutral-300 text-xs leading-relaxed whitespace-pre-wrap font-mono">{readme}</pre>
          ) : tab === 'description' && hasDesc ? (
            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-2">
                <iconify-icon icon="solar:info-circle-bold-duotone" class="text-emerald-400" style={{fontSize:'1.25rem'}}></iconify-icon>
                <span className="text-white font-semibold text-sm uppercase tracking-widest">{t.modal_desc || 'Description'}</span>
              </div>
              <p className="text-neutral-300 text-sm leading-relaxed">{repo.description}</p>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-16 gap-3 text-neutral-500">
              <iconify-icon icon="solar:document-bold-duotone" style={{fontSize:'2.5rem', opacity:0.3}}></iconify-icon>
              <p className="text-xs uppercase tracking-widest">{t.modal_error || 'No documentation available'}</p>
            </div>
          )}
        </div>

        <div className="px-8 py-4 border-t border-neutral-800 flex-shrink-0 flex justify-end">
          <a
            href={repo.html_url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-5 py-2.5 rounded-full border border-neutral-700 text-[0.65rem] font-bold uppercase tracking-widest text-neutral-300 hover:bg-neutral-800 transition-all"
          >
            <iconify-icon icon="simple-icons:github" style={{fontSize:'1rem'}}></iconify-icon>
            {t.modal_btn_github || 'Open on GitHub'}
            <iconify-icon icon="solar:arrow-right-bold-duotone" class="text-emerald-400" style={{fontSize:'0.875rem'}}></iconify-icon>
          </a>
        </div>
      </div>
    </div>
  );
}

function App() {
  const containerRef = useRef(null);
  const [repos, setRepos] = useState([]);
  const [reposLoading, setReposLoading] = useState(true);
  const [showAllRepos, setShowAllRepos] = useState(false);
  const [readmeRepo, setReadmeRepo] = useState(null);
  const [commitCounts, setCommitCounts] = useState({});
  const [contributions, setContributions] = useState(null);
  const [language, setLanguage] = useState(() => localStorage.getItem('language') || 'en');
  const t = translations[language];

  const toggleLanguage = () => {
    const newLang = language === 'en' ? 'fr' : 'en';
    setLanguage(newLang);
    localStorage.setItem('language', newLang);
  };
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    ghFetch(`https://api.github.com/users/${GITHUB_USER}/repos?sort=pushed&direction=desc&per_page=100`)
      .then(r => r.json())
      .then(data => {
        if (!Array.isArray(data)) return;
        const filtered = data
          .filter(r => !r.fork)
          .sort((a, b) => new Date(b.pushed_at) - new Date(a.pushed_at));
        setRepos(filtered);
      })
      .catch(() => {})
      .finally(() => setReposLoading(false));
  }, []);

  useEffect(() => {
    const visible = showAllRepos ? repos : repos.slice(0, 4);
    visible.forEach(repo => {
      if (commitCounts[repo.name] !== undefined) return;
      ghFetch(`https://api.github.com/repos/${GITHUB_USER}/${repo.name}/commits?per_page=1`)
        .then(r => {
          if (!r.ok) return;
          const link = r.headers.get('Link') || '';
          const match = link.match(/[?&]page=(\d+)>;\s*rel="last"/);
          const count = match ? parseInt(match[1]) : 1;
          setCommitCounts(prev => ({ ...prev, [repo.name]: count }));
        })
        .catch(() => {});
    });
  }, [repos, showAllRepos]);

  useEffect(() => {
    const query = `{ user(login: "${GITHUB_USER}") { contributionsCollection { contributionCalendar { totalContributions weeks { contributionDays { contributionCount date } } } } } }`;
    fetch('https://api.github.com/graphql', {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${GH_TOKEN}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ query }),
    })
      .then(r => r.json())
      .then(d => {
        const cal = d?.data?.user?.contributionsCollection?.contributionCalendar;
        if (cal) setContributions(cal);
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const el = entry.target;
          const type = el.dataset.animation || 'up';
          const delay = el.dataset.delay || 0;
          setTimeout(() => {
            if (type === 'left') el.classList.add('animate-left');
            else if (type === 'right') el.classList.add('animate-right');
            else if (type === 'fade') el.classList.add('animate-fade');
            else el.classList.add('animate-up');
          }, parseInt(delay));
          observer.unobserve(el);
        }
      });
    }, { threshold: 0.1 });

    if (containerRef.current) {
      containerRef.current
        .querySelectorAll('.animate-on-scroll:not(.animate-up):not(.animate-left):not(.animate-right):not(.animate-fade)')
        .forEach(el => observer.observe(el));
    }
    return () => observer.disconnect();
  }, [repos, showAllRepos]);

  return (
    <main ref={containerRef} className="border-gradient xl:rounded-[3.5rem] xl:p-12 overflow-hidden flex flex-col xl:max-w-[96rem] xl:shadow-2xl bg-neutral-900 w-full rounded-none pt-6 pr-6 pb-6 pl-6 relative shadow-none justify-between">

      {/* BG: Jonathan image */}
      <img
        src="/Jo.png"
        alt="Jonathan Bosimwenda"
        className="w-1/2 h-[960px] object-cover object-top rounded-[40px] absolute top-4 right-4 bottom-0 pointer-events-none"
      />

      <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-neutral-800/20 via-transparent to-blue-950/10 pointer-events-none"></div>

      <div className="absolute inset-0 pointer-events-none overflow-hidden xl:rounded-[3.5rem]">
        <div className="absolute top-0 bottom-0 left-[10%] w-px bg-gradient-to-b from-transparent via-neutral-700/30 to-transparent"></div>
        <div className="absolute top-0 bottom-0 left-[25%] w-px bg-gradient-to-b from-transparent via-neutral-700/20 to-transparent"></div>
        <div className="absolute top-0 bottom-0 left-[50%] w-px bg-gradient-to-b from-transparent via-neutral-700/30 to-transparent"></div>
        <div className="absolute top-0 bottom-0 left-[75%] w-px bg-gradient-to-b from-transparent via-neutral-700/20 to-transparent"></div>
        <div className="absolute top-0 bottom-0 left-[90%] w-px bg-gradient-to-b from-transparent via-neutral-700/30 to-transparent"></div>
      </div>

      {/* ===== NAV ===== */}
      <nav className="z-20 flex flex-wrap gap-6 md:mb-0 mix-blend-plus-lighter mb-12 relative gap-x-6 gap-y-6 items-center justify-between">
        <div className="animate-on-scroll flex items-center group cursor-pointer" data-animation="left" data-delay="0">
          <iconify-icon icon="solar:code-bold-duotone" class="text-white group-hover:rotate-[22.5deg] transition-transform duration-500 ease-out" style={{fontSize:'2.5rem'}}></iconify-icon>  Jonathan Bosimwenda
        </div>
        
        <div className="hidden md:flex items-center gap-8 text-xs font-medium tracking-widest uppercase text-neutral-400">
          <a href="#projets" className="animate-on-scroll hover:text-white transition-colors flex items-center gap-2" data-animation="up" data-delay="100">
            <div className="w-2 h-2 rounded-full bg-white"></div>{t.nav_projects}
          </a>
          <a href="#expertise" className="animate-on-scroll hover:text-white transition-colors flex items-center gap-2" data-animation="up" data-delay="150">
            <div className="w-2 h-2 rounded-full border border-neutral-600"></div>{t.nav_expertise}
          </a>
          <a href="#parcours" className="animate-on-scroll hover:text-white transition-colors" data-animation="up" data-delay="200">{t.nav_journey}</a>
          <a href="#contact" className="animate-on-scroll hover:text-white transition-colors" data-animation="up" data-delay="250">{t.nav_contact}</a>
        </div>
        
        <div className="flex items-center gap-2">
        {/* Language Icon - Always visible on mobile */}
        <button 
          onClick={toggleLanguage}
          className="flex items-center gap-1 px-2 py-2 rounded-full border border-neutral-700 text-[0.7rem] font-bold uppercase tracking-widest hover:bg-neutral-800 transition-colors"
        >
          <iconify-icon icon="solar:global-bold-duotone" class="text-emerald-400" style={{fontSize:'1rem'}}></iconify-icon>
          <span className="hidden sm:inline">{language === 'en' ? 'FR' : 'EN'}</span>
        </button>
  
        {/* Desktop CV button */}
        <a
          href="/JonathanBosimwenda_CV.pdf"
          download
          className="animate-on-scroll hidden uppercase hover:bg-neutral-800 transition-colors md:flex text-xs font-semibold tracking-widest bg-gradient-to-br from-white/10 to-white/0 rounded-full px-6 py-3"
          data-animation="right"
          data-delay="100"
        >
          {t.btn_cv}
        </a>
  
        {/* Mobile Menu Button */}
          <button 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-full bg-white/10 text-white"
          >
            <iconify-icon icon={mobileMenuOpen ? "solar:close-bold" : "solar:hamburger-menu-bold-duotone"} style={{fontSize:'1.25rem'}}></iconify-icon>
          </button>
      </div>
    </nav>
    {/* mobile menu */}
    <div className={`md:hidden fixed top-20 left-0 right-0 bg-black/80 backdrop-blur-md border-b border-white/10 z-40 transition-all duration-300 ${mobileMenuOpen ? 'opacity-100 visible' : 'opacity-0 invisible'}`}>
      <div className="flex flex-col p-4 gap-1">
        <a 
          href="#projets" 
          onClick={() => setMobileMenuOpen(false)} 
          className="flex items-center gap-3 px-3 py-2 rounded-lg text-white hover:bg-white/10 transition-all duration-200"
        >
          <iconify-icon icon="solar:code-square-bold-duotone" class="text-emerald-400 text-lg"></iconify-icon>
          <span className="text-sm">{t.nav_projects}</span>
        </a>
        
        <a 
          href="#expertise" 
          onClick={() => setMobileMenuOpen(false)} 
          className="flex items-center gap-3 px-3 py-2 rounded-lg text-white hover:bg-white/10 transition-all duration-200"
        >
          <iconify-icon icon="solar:monitor-bold-duotone" class="text-blue-400 text-lg"></iconify-icon>
          <span className="text-sm">{t.nav_expertise}</span>
        </a>
        
        <a 
          href="#parcours" 
          onClick={() => setMobileMenuOpen(false)} 
          className="flex items-center gap-3 px-3 py-2 rounded-lg text-white hover:bg-white/10 transition-all duration-200"
        >
          <iconify-icon icon="solar:roadmap-bold-duotone" class="text-purple-400 text-lg"></iconify-icon>
          <span className="text-sm">{t.nav_journey}</span>
        </a>
        
        <a 
          href="#contact" 
          onClick={() => setMobileMenuOpen(false)} 
          className="flex items-center gap-3 px-3 py-2 rounded-lg text-white hover:bg-white/10 transition-all duration-200"
        >
          <iconify-icon icon="solar:letter-bold-duotone" class="text-orange-400 text-lg"></iconify-icon>
          <span className="text-sm">{t.nav_contact}</span>
        </a>
        
        <div className="h-px bg-white/10 my-2"></div>
        
        <a 
          href="/JonathanBosimwenda_CV.pdf" 
          download 
          onClick={() => setMobileMenuOpen(false)} 
          className="flex items-center gap-3 px-3 py-2 rounded-lg text-white hover:bg-white/10 transition-all duration-200"
        >
          <iconify-icon icon="solar:document-bold-duotone" class="text-rose-400 text-lg"></iconify-icon>
          <span className="text-sm">{t.btn_cv}</span>
        </a>
        
        <button 
          onClick={() => { toggleLanguage(); setMobileMenuOpen(false); }} 
          className="flex items-center gap-3 px-3 py-2 rounded-lg text-white hover:bg-white/10 transition-all duration-200 border border-white/10 mt-1"
        >
          <iconify-icon icon="solar:global-bold-duotone" class="text-emerald-400 text-lg"></iconify-icon>
          <span className="text-sm flex-1 text-left">{language === 'en' ? 'Français' : 'English'}</span>
          <span className="text-xs bg-white/10 px-2 py-0.5 rounded-full">{language === 'en' ? 'FR' : 'EN'}</span>
        </button>
      </div>
    </div>

      {/* ===== HERO CONTENT ===== */}
      <div className="z-10 flex-grow flex flex-col md:py-0 pt-10 pb-10 relative justify-center">
        <div className="animate-on-scroll flex md:mb-4 md:mt-12 mt-4 mb-6 gap-x-4 gap-y-4 items-center" data-animation="up" data-delay="300">
          <p className="text-xs md:text-sm uppercase tracking-widest text-neutral-500 max-w-md font-medium">
            {t.hero_status}
          </p>
        </div>

        <div className="group relative">
          <div className="animate-on-scroll hidden lg:flex bg-neutral-900 z-20 border-neutral-700 border rounded-full px-5 py-2 absolute top-[0%] left-[38%] -top-4 shadow-sm gap-x-2 gap-y-2 items-center hover:scale-105 transition-transform cursor-default" data-animation="fade" data-delay="800">
            <span className="text-[0.65rem] font-bold uppercase tracking-widest text-neutral-300">{t.hero_remote}</span>
          </div>
          <div className="animate-on-scroll hidden lg:flex bg-neutral-900 z-20 border-neutral-700 border rounded-full px-5 py-2 absolute top-[45%] right-[0%] shadow-sm gap-x-2 gap-y-2 items-center hover:scale-105 transition-transform cursor-default" data-animation="right" data-delay="900">
            <span className="text-[0.65rem] font-bold uppercase tracking-widest text-neutral-300">{t.hero_edu_badge}</span>
          </div>
          <div className="animate-on-scroll hidden lg:flex z-20 gap-2 text-neutral-950 bg-emerald-400 rounded-full px-5 py-2 absolute bottom-[-12%] left-[2%] shadow-lg gap-x-2 gap-y-2 items-center hover:scale-105 transition-transform cursor-default" data-animation="left" data-delay="1000">
            <span className="text-[0.65rem] font-bold uppercase tracking-widest">{t.hero_fullstack_badge}</span>
          </div>
          <h1 className="text-[16vw] md:text-[14vw] lg:text-[12rem] leading-[0.8] uppercase select-none md:text-left font-medium text-white tracking-tighter font-oswald text-center mix-blend-normal max-w-4xl">
            <span className="animate-on-scroll inline-block" data-animation="up" data-delay="400">{t.hero_title1}</span>
            <span className="animate-on-scroll inline-block pl-0 md:pl-16" data-animation="up" data-delay="500">{t.hero_title2}</span>
            <span className="animate-on-scroll block text-neutral-600" data-animation="up" data-delay="600">{t.hero_title3}</span>
          </h1>
        </div>
      </div>

      {/* ===== HERO BOTTOM ===== */}
      <div className="z-20 flex flex-col lg:flex-row gap-12 mt-8 relative gap-x-12 gap-y-12 items-end justify-between">
        <div className="flex flex-col gap-6 max-w-lg">
          <div className="animate-on-scroll flex items-center gap-3 text-xs font-bold tracking-widest uppercase text-neutral-500" data-animation="up" data-delay="700">
            <span>{t.hero_badge1}</span>
            <span className="w-4 h-[1px] bg-neutral-600 inline-block"></span>
            <span>{t.hero_badge2}</span>
          </div>
          <p className="animate-on-scroll text-sm md:text-base text-neutral-400 leading-relaxed font-normal uppercase tracking-wide" data-animation="up" data-delay="800">
            {t.hero_desc}
          </p>
          <div className="flex flex-wrap gap-3 items-center">
            <a
              href="#contact"
              className="animate-on-scroll group flex overflow-hidden uppercase transition-all duration-500 hover:scale-[1.02] hover:shadow-[0_0_40px_-10px_rgba(59,130,246,0.5)] text-sm font-medium text-white tracking-widest font-space rounded-full pt-5 pr-12 pb-5 pl-12 relative items-center justify-center"
              data-animation="up"
              data-delay="900"
            >
              <div className="absolute inset-0 -z-20 rounded-full overflow-hidden p-[1px]">
                <div className="absolute inset-[-100%] bg-[conic-gradient(from_0deg,transparent_0_300deg,#3b82f6_360deg)]" style={{ animation: 'beam-spin 3s linear infinite' }}></div>
                <div className="absolute inset-[1px] rounded-full bg-neutral-950"></div>
              </div>
              <div className="-z-10 overflow-hidden bg-neutral-950 rounded-full absolute top-[2px] right-[2px] bottom-[2px] left-[2px]">
                <div className="absolute inset-0 bg-gradient-to-b from-neutral-800/60 to-transparent"></div>
                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-2/3 h-1/2 bg-blue-500/10 blur-2xl rounded-full transition-colors duration-500 group-hover:bg-blue-500/30"></div>
              </div>
              <span className="relative z-10 text-white/90 group-hover:text-white">{t.hero_btn_contact}</span>
              <iconify-icon icon="solar:arrow-right-bold-duotone" class="relative z-10 ml-2 transition-transform duration-300 group-hover:translate-x-1" style={{fontSize:'1rem'}}></iconify-icon>
            </a>
            <a
              href="https://github.com/Jo-Dev28"
              target="_blank"
              rel="noopener noreferrer"
              className="animate-on-scroll px-5 py-2 rounded-full border border-neutral-700 text-[0.7rem] font-bold uppercase tracking-widest hover:bg-neutral-800 transition-colors"
              data-animation="up"
              data-delay="1000"
            >
              {t.hero_btn_github}
            </a>
          </div>
        </div>

        {/* Feature cards */}
        <div className="lg:w-auto flex flex-col md:flex-row gap-4 w-full gap-x-4 gap-y-4">
          <div
            className="animate-on-scroll group flex-1 lg:flex-none lg:w-48 hover:bg-white hover:text-neutral-950 hover:border-white transition-all duration-300 cursor-pointer overflow-hidden bg-neutral-800/50 rounded-2xl pt-5 pr-5 pb-5 pl-5 backdrop-blur-lg"
            data-animation="up"
            data-delay="1100"
          >
            <div className="relative h-28 mb-4 overflow-hidden" style={{ maskImage: 'linear-gradient(to bottom, transparent, black 20%, black 80%, transparent)', WebkitMaskImage: 'linear-gradient(to bottom, transparent, black 20%, black 80%, transparent)' }}>
              <div className="marquee-content flex flex-col">
                {['solar:code-square-bold-duotone|#60a5fa|PHP', 'solar:server-bold-duotone|#4ade80|MySQL', 'solar:layers-bold-duotone|#a78bfa|Laravel', 'solar:document-bold-duotone|#fb923c|React', 'solar:database-bold-duotone|#818cf8|PostgreSQL', 'solar:code-square-bold-duotone|#60a5fa|JS', 'solar:server-bold-duotone|#4ade80|Tailwind', 'solar:layers-bold-duotone|#a78bfa|REST API'].map((item, i) => {
                  const [icon, color, label] = item.split('|');
                  return (
                    <div key={i} className="flex items-center gap-2 pb-3">
                      <iconify-icon icon={icon} style={{color, fontSize:'1.25rem'}}></iconify-icon>
                      <span className="text-[0.6rem] uppercase tracking-wider opacity-70">{label}</span>
                    </div>
                  );
                })}
              </div>
            </div>
            <h3 className="text-xs font-semibold uppercase tracking-widest mb-1">{t.card_tech_title}</h3>
            <p className="text-[0.65rem] leading-normal opacity-70 uppercase">{t.card_tech_desc}</p>
          </div>

          <div
            className="animate-on-scroll group flex-1 lg:flex-none lg:w-48 hover:bg-white hover:text-neutral-950 hover:border-white transition-all duration-300 cursor-pointer overflow-hidden bg-neutral-800/50 rounded-2xl pt-5 pr-5 pb-5 pl-5 backdrop-blur-lg"
            data-animation="up"
            data-delay="1200"
          >
            <div className="relative h-28 mb-4 overflow-hidden" style={{ maskImage: 'linear-gradient(to bottom, transparent, black 20%, black 80%, transparent)', WebkitMaskImage: 'linear-gradient(to bottom, transparent, black 20%, black 80%, transparent)', animationDuration: '25s' }}>
              <div className="marquee-content flex flex-col" style={{animationDuration:'25s'}}>
                {['P|POS System', 'V|Voting System', 'E|E-commerce', 'S|Student MGMT', 'P|POS System', 'V|Voting System', 'E|E-commerce', 'S|Student MGMT'].map((item, i) => {
                  const [letter, label] = item.split('|');
                  return (
                    <div key={i} className="flex items-center gap-2 pb-3">
                      <div className="w-5 h-5 rounded bg-white/10 flex items-center justify-center text-[0.5rem] font-bold">{letter}</div>
                      <span className="text-[0.6rem] uppercase tracking-wider opacity-70">{label}</span>
                    </div>
                  );
                })}
              </div>
            </div>
            <h3 className="text-xs font-semibold uppercase tracking-widest mb-1">{t.card_projects_title}</h3>
            <p className="text-[0.65rem] leading-normal opacity-70 uppercase">{t.card_projects_desc}</p>
          </div>

          <div
            className="animate-on-scroll group flex-1 lg:flex-none lg:w-48 hover:bg-white hover:text-neutral-950 hover:border-white transition-all duration-300 cursor-pointer overflow-hidden bg-neutral-800/50 rounded-2xl pt-5 pr-5 pb-5 pl-5 backdrop-blur-lg"
            data-animation="up"
            data-delay="1300"
          >
            <div className="relative h-28 mb-4 overflow-hidden" style={{ maskImage: 'linear-gradient(to bottom, transparent, black 20%, black 80%, transparent)', WebkitMaskImage: 'linear-gradient(to bottom, transparent, black 20%, black 80%, transparent)' }}>
              <div className="marquee-content flex flex-col" style={{animationDuration:'18s'}}>
                {['solar:letter-bold-duotone|#818cf8|Email', 'simple-icons:linkedin|#60a5fa|LinkedIn', 'solar:chat-round-bold-duotone|#4ade80|WhatsApp', 'solar:code-bold-duotone|#a3a3a3|GitHub', 'solar:letter-bold-duotone|#818cf8|Email', 'simple-icons:linkedin|#60a5fa|LinkedIn', 'solar:chat-round-bold-duotone|#4ade80|WhatsApp', 'solar:code-bold-duotone|#a3a3a3|GitHub'].map((item, i) => {
                  const [icon, color, label] = item.split('|');
                  return (
                    <div key={i} className="flex items-center gap-2 pb-3">
                      <iconify-icon icon={icon} style={{color, fontSize:'1.25rem'}}></iconify-icon>
                      <span className="text-[0.6rem] uppercase tracking-wider opacity-70">{label}</span>
                    </div>
                  );
                })}
              </div>
            </div>
            <h3 className="text-xs font-semibold uppercase tracking-widest mb-1">{t.card_contact_title}</h3>
            <p className="text-[0.65rem] leading-normal opacity-70 uppercase">{t.card_contact_desc}</p>
          </div>
        </div>
      </div>

      {/* ===== EXPERTISE ===== */}
      <div id="expertise" className="flex flex-col md:px-0 z-20 w-full max-w-[90rem] border-white/5 border-t mt-32 mr-auto ml-auto pt-12 pr-4 pb-12 pl-4 relative gap-x-16 gap-y-16">
        <div className="flex flex-col items-center text-center gap-6 max-w-3xl mx-auto">
          <h2 className="animate-on-scroll md:text-5xl lg:text-6xl uppercase leading-[0.9] text-3xl font-medium text-white tracking-tight font-bricolage" data-animation="up" data-delay="0">
            {t.exp_title} <span className="text-neutral-600">{t.exp_title_span}</span>
          </h2>
          <p className="animate-on-scroll text-sm md:text-base text-neutral-400 font-normal uppercase tracking-wide max-w-xl" data-animation="up" data-delay="100">
            {t.exp_desc}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 w-full">
          {/* Card 1: Application Engineering */}
          <div className="animate-on-scroll group relative bg-neutral-900 border border-neutral-800 rounded-[2.5rem] p-8 md:p-12 overflow-hidden flex flex-col h-[600px] hover:border-neutral-700 transition-all duration-500" data-animation="left" data-delay="200">
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#171717_1px,transparent_1px),linear-gradient(to_bottom,#171717_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none"></div>
            <div className="relative z-10 flex flex-col gap-4 mb-12">
              <div className="w-12 h-12 rounded-full bg-neutral-800 flex items-center justify-center mb-2 border border-neutral-700" style={{boxShadow:'0 0 15px -3px rgba(52,211,153,0.3)'}}>
                <iconify-icon icon="solar:code-square-bold-duotone" class="text-emerald-400" style={{fontSize:'1.5rem'}}></iconify-icon>
              </div>
              <h3 className="uppercase text-2xl font-semibold text-white tracking-tight font-bricolage">{t.exp_card1_title}</h3>
              <p className="text-neutral-400 text-sm leading-relaxed max-w-xs font-space">{t.exp_card1_desc}</p>
              <div className="flex items-center gap-3 text-[0.6rem] font-bold uppercase tracking-widest text-neutral-500 mt-2">
                <span className="bg-neutral-800 px-3 py-1 rounded-full border border-neutral-700">{t.exp_card1_tag1}</span>
                <span className="w-8 h-[1px] bg-neutral-700 inline-block"></span>
                <span className="text-emerald-400">{t.exp_card1_tag2}</span>
                <span className="w-8 h-[1px] bg-neutral-700 inline-block"></span>
                <span className="bg-neutral-800 px-3 py-1 rounded-full border border-neutral-700">{t.exp_card1_tag3}</span>
              </div>
            </div>
            <div className="flex-1 w-full mt-4 relative" style={{perspective:'1000px'}}>
              <div className="flex absolute top-0 right-0 bottom-0 left-0 items-center justify-center" style={{transform:'rotateX(12deg)'}}>
                <svg className="pointer-events-none z-0 w-full h-full absolute top-0 right-0 bottom-0 left-0" viewBox="0 0 400 300" preserveAspectRatio="xMidYMid slice" style={{overflow:'visible'}}>
                  <path d="M 200 150 L 200 80 Q 200 60 180 60 L 40 60" stroke="#262626" strokeWidth="1" fill="none"></path>
                  <path d="M 200 150 L 200 80 Q 200 60 180 60 L 40 60" stroke="#10b981" strokeWidth="1.5" fill="none" strokeDasharray="6 6" strokeLinecap="round" style={{animation:'flow-noodle 3s linear infinite'}}></path>
                  <path d="M 200 150 L 340 150 Q 360 150 360 130 L 360 80" stroke="#262626" strokeWidth="1" fill="none"></path>
                  <path d="M 200 150 L 340 150 Q 360 150 360 130 L 360 80" stroke="#10b981" strokeWidth="1.5" fill="none" strokeDasharray="6 6" strokeLinecap="round" style={{animation:'flow-noodle 4s linear infinite reverse'}}></path>
                  <path d="M 200 150 L 200 220 Q 200 240 180 240 L 60 240" stroke="#262626" strokeWidth="1" fill="none"></path>
                  <path d="M 200 150 L 200 220 Q 200 240 180 240 L 60 240" stroke="#10b981" strokeWidth="1.5" fill="none" strokeDasharray="6 6" strokeLinecap="round" style={{animation:'flow-noodle 3.5s linear infinite'}}></path>
                </svg>
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 rounded-full border border-emerald-500/20 bg-emerald-500/5 blur-3xl z-0"></div>
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20">
                  <div className="bg-neutral-950 border border-emerald-500/30 p-3 rounded-2xl cursor-pointer hover:border-emerald-500/60 transition-colors" style={{boxShadow:'0 0 30px -10px rgba(16,185,129,0.3)'}}>
                    <iconify-icon icon="solar:cpu-bold-duotone" class="text-emerald-400" style={{fontSize:'1.5rem'}}></iconify-icon>
                  </div>
                </div>
                <div className="transition-transform duration-700 hover:-translate-y-2 absolute" style={{top:'20%',left:'10%',transform:'translate(-50%, -250%)'}}>
                  <div className="flex items-center gap-2 bg-neutral-800/90 backdrop-blur-md border border-neutral-700 pr-4 pl-3 py-2 rounded-full shadow-xl hover:border-blue-500/50 transition-all cursor-pointer">
                    <iconify-icon icon="simple-icons:react" class="text-blue-400" style={{fontSize:'1rem'}}></iconify-icon>
                    <span className="text-xs font-medium text-white">React</span>
                  </div>
                </div>
                <div className="transition-transform duration-700 delay-100 hover:-translate-y-2 z-10 absolute" style={{top:'27%',right:'10%',transform:'translate(50%, -200%)'}}>
                  <div className="flex items-center gap-2 bg-neutral-800/90 backdrop-blur-md border border-neutral-700 pr-4 pl-3 py-2 rounded-full shadow-xl hover:border-purple-500/50 transition-all cursor-pointer">
                    <iconify-icon icon="solar:database-bold-duotone" class="text-purple-400" style={{fontSize:'1rem'}}></iconify-icon>
                    <span className="text-xs font-medium text-white">MySQL</span>
                  </div>
                </div>
                <div className="absolute transition-transform duration-700 delay-200 hover:-translate-y-2 z-10" style={{bottom:'20%',left:'15%',transform:'translate(-50%, 250%)'}}>
                  <div className="flex items-center gap-2 bg-neutral-800/90 backdrop-blur-md border border-neutral-700 pr-4 pl-3 py-2 rounded-full shadow-xl hover:border-green-500/50 transition-all cursor-pointer">
                    <iconify-icon icon="solar:server-bold-duotone" class="text-green-400" style={{fontSize:'1rem'}}></iconify-icon>
                    <span className="text-xs font-medium text-white">PHP</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Card 2: UI/UX & Product Design */}
          <div className="animate-on-scroll group relative bg-neutral-900 border border-neutral-800 rounded-[2.5rem] p-8 md:p-12 overflow-hidden flex flex-col h-[600px] hover:border-neutral-700 transition-all duration-500" data-animation="right" data-delay="300">
            <div className="absolute top-0 right-0 w-96 h-96 bg-blue-900/10 rounded-full blur-3xl pointer-events-none"></div>
            <div className="relative z-10 flex flex-col gap-4 mb-10">
              <div className="flex bg-neutral-800 w-12 h-12 border-neutral-700 border rounded-full mb-2 items-center justify-center">
                <iconify-icon icon="solar:palette-bold-duotone" class="text-blue-400" style={{fontSize:'1.5rem'}}></iconify-icon>
              </div>
              <h3 className="uppercase text-2xl font-semibold text-white tracking-tight font-bricolage">{t.exp_card3_title}</h3>
              <p className="text-neutral-400 text-sm leading-relaxed max-w-xs font-space">{t.exp_card3_desc}</p>
            </div>
            <div className="relative z-10 flex-1 w-full bg-neutral-950 border border-neutral-800 rounded-2xl p-6 shadow-2xl flex flex-col gap-4 overflow-hidden group-hover:border-neutral-700/50 transition-colors">
              <div className="flex items-center justify-between border-b border-neutral-800 pb-4 mb-2">
                <div className="flex items-center gap-2">
                  <iconify-icon icon="solar:pen-bold-duotone" class="text-neutral-400" style={{fontSize:'1rem'}}></iconify-icon>
                  <span className="text-xs font-bold uppercase tracking-wider text-neutral-300">{t.exp_card3_tool_title}</span>
                </div>
                <span className="bg-blue-900/20 text-blue-300 border border-blue-800/50 text-[0.6rem] font-bold uppercase tracking-wider px-2 py-1 rounded">Figma</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-[0.65rem] font-bold uppercase tracking-wider text-neutral-500 w-10 text-right">UX</span>
                <div className="flex-1 bg-neutral-900 border border-neutral-700 rounded-lg px-3 py-2.5 text-xs text-neutral-300 flex justify-between items-center cursor-pointer hover:border-neutral-600 transition-colors">
                  <div className="flex items-center gap-2">
                    <iconify-icon icon="solar:user-id-bold-duotone" style={{fontSize:'1rem',color:'#a78bfa'}}></iconify-icon>
                    <span>{t.exp_card3_item1}</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-[0.65rem] font-bold uppercase tracking-wider text-neutral-500 w-10 text-right">UI</span>
                <div className="flex-1 bg-neutral-900 border border-neutral-700 rounded-lg px-3 py-2.5 text-xs text-neutral-300 flex justify-between items-center cursor-pointer hover:border-neutral-600 transition-colors">
                  <div className="flex items-center gap-2">
                    <iconify-icon icon="solar:figma-bold-duotone" style={{fontSize:'1rem'}}></iconify-icon>
                    <span>{t.exp_card3_item2}</span>
                  </div>
                </div>
                <div className="w-14 bg-neutral-900 border border-neutral-700 rounded-lg px-3 py-2.5 text-xs text-white font-medium flex items-center justify-center">
                  <iconify-icon icon="solar:check-circle-bold-duotone" class="text-emerald-400" style={{fontSize:'1rem'}}></iconify-icon>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-[0.65rem] font-bold uppercase tracking-wider text-neutral-500 w-10 text-right">Tech</span>
                <div className="flex-1 bg-neutral-900 border border-neutral-700 rounded-lg px-3 py-2.5 text-xs text-neutral-300 flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <iconify-icon icon="solar:document-bold-duotone" style={{fontSize:'1rem',color:'#fb923c'}}></iconify-icon>
                    <span>{t.exp_card3_item3}</span>
                  </div>
                </div>
                <div className="w-24 bg-neutral-900 border border-neutral-700 rounded-lg px-3 py-2.5 text-xs text-white font-medium">Responsive</div>
              </div>
              <button className="mt-2 flex items-center gap-2 text-neutral-500 text-xs font-bold uppercase tracking-widest hover:text-white transition-colors w-max py-2">
                <iconify-icon icon="solar:add-circle-bold-duotone" style={{fontSize:'1rem'}}></iconify-icon>
                <span>{t.exp_card3_btn}</span>
              </button>
            </div>
          </div>
        </div>

        {/* Cards 3 & 4 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[
            { id:'info', icon:'solar:monitor-bold-duotone', color:'#818cf8', glow:'rgba(99,102,241,0.1)', title:t.exp_card2_title, desc:t.exp_card2_desc, tags:[t.exp_card2_tag1, t.exp_card2_tag2, t.exp_card2_tag3], delay:'400' },
            { id:'strat', icon:'solar:chart-2-bold-duotone', color:'#c084fc', glow:'rgba(168,85,247,0.1)', title:t.exp_card4_title, desc:t.exp_card4_desc, tags:[t.exp_card4_tag1, t.exp_card4_tag2, t.exp_card4_tag3], delay:'500' },
          ].map(({ id, icon, color, glow, title, desc, tags, delay }) => (
            <div key={id} className="animate-on-scroll group relative bg-neutral-900 border border-neutral-800 rounded-[2rem] p-8 overflow-hidden hover:border-neutral-700 transition-all duration-500" data-animation="up" data-delay={delay}>
              <div className="absolute top-0 right-0 w-64 h-64 rounded-full blur-3xl pointer-events-none" style={{background:glow}}></div>
              <div className="w-12 h-12 rounded-full bg-neutral-800 flex items-center justify-center mb-6 border border-neutral-700">
                <iconify-icon icon={icon} style={{color,fontSize:'1.5rem'}}></iconify-icon>
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

      {/* ===== GITHUB PROJECTS ===== */}
      <div id="projets" className="flex flex-col md:px-0 z-20 w-full max-w-[90rem] border-white/5 border-t mt-32 mr-auto ml-auto pt-12 pr-4 pb-12 pl-4 relative gap-y-16">
        <div className="flex flex-col items-center text-center gap-6 max-w-3xl mx-auto">
          <div className="animate-on-scroll flex items-center gap-2 px-3 py-1 rounded-full border border-neutral-800 bg-neutral-900/50 text-[0.65rem] uppercase tracking-widest text-neutral-400 font-semibold" data-animation="up" data-delay="0">
            <iconify-icon icon="solar:code-bold-duotone" class="text-emerald-400" style={{fontSize:'0.75rem'}}></iconify-icon>
            <span>{t.proj_subtitle}</span>
          </div>
          <h2 className="animate-on-scroll md:text-5xl lg:text-6xl uppercase leading-[0.9] text-3xl font-medium text-white tracking-tight font-bricolage" data-animation="up" data-delay="100">
            GitHub <span className="text-neutral-600">{t.proj_title}</span>
          </h2>
          <p className="animate-on-scroll text-sm md:text-base text-neutral-400 font-normal uppercase tracking-wide max-w-xl" data-animation="up" data-delay="150">
            {t.proj_desc}
          </p>
        </div>

        {reposLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 px-2">
            {[...Array(4)].map((_, i) => (
              <div key={i} className={`animate-pulse bg-neutral-900/40 border border-white/5 rounded-[2rem] h-[420px] ${i % 2 === 1 ? 'lg:mt-12' : ''}`}></div>
            ))}
          </div>
        ) : (
          <>
            <div className="w-full relative perspective-[2000px]">
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[60%] h-[40%] bg-emerald-900/10 blur-[120px] rounded-full pointer-events-none"></div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 px-2">
                {(showAllRepos ? repos : repos.slice(0, 4)).map((repo, index) => (
                  <div
                    key={repo.id}
                    className={`animate-on-scroll group relative flex flex-col justify-between h-[420px] bg-neutral-950/40 backdrop-blur-xl border border-white/5 hover:border-white/20 rounded-[2rem] p-8 transition-all duration-500 overflow-hidden ${index % 2 === 0 ? 'animate-levitate' : 'animate-levitate-delayed'} ${index % 2 === 1 ? 'lg:mt-12' : ''}`}
                    data-animation="up"
                    data-delay={String(200 + (index % 4) * 100)}
                  >
                    <div className="absolute inset-0 bg-gradient-to-b from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>
                    <div className="flex justify-between items-start z-10 relative">
                      <span className="text-[0.6rem] font-bold uppercase tracking-widest text-neutral-500 border border-white/5 px-2 py-1 rounded-md bg-neutral-900/50">
                        {repo.language || 'Code'}
                      </span>
                      <div className="flex items-center gap-1">
                        <iconify-icon icon="solar:star-bold-duotone" class="text-yellow-400" style={{fontSize:'0.875rem'}}></iconify-icon>
                        <span className="text-sm font-medium" style={{color: langColors[repo.language] || '#a3a3a3'}}>
                          {repo.stargazers_count}
                        </span>
                      </div>
                    </div>
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none overflow-hidden px-6">
                      <span
                        className="text-white font-bricolage font-bold text-center leading-none select-none transition-all duration-500 opacity-[0.06] group-hover:opacity-[0.14]"
                        style={{fontSize:'clamp(1.5rem, 5vw, 3rem)', wordBreak:'break-word', textAlign:'center', textTransform:'uppercase', letterSpacing:'-0.04em'}}
                      >{repo.name}</span>
                    </div>
                    <div className="z-10 relative flex flex-col gap-2 border-t border-white/5 pt-4">
                      <div className="flex items-baseline gap-2">
                        <span className="text-3xl font-black text-white font-bricolage group-hover:translate-x-1 transition-transform duration-300 leading-none">{commitCounts[repo.name] ?? '—'}</span>
                        <span className="text-[0.6rem] font-bold uppercase tracking-widest text-neutral-500">{t.proj_commits}</span>
                      </div>
                      <div className="flex items-center justify-between mt-1">
                        <a
                          href={repo.html_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs text-neutral-500 uppercase tracking-wider font-semibold flex items-center gap-1.5 hover:text-white transition-colors"
                          onClick={e => e.stopPropagation()}
                        >
                          <iconify-icon icon="simple-icons:github" style={{fontSize:'0.875rem'}}></iconify-icon>
                          GitHub
                          <iconify-icon icon="solar:arrow-right-bold-duotone" class="text-neutral-600 group-hover:text-white transition-colors" style={{fontSize:'0.75rem'}}></iconify-icon>
                        </a>
                        <button
                          onClick={() => setReadmeRepo(repo)}
                          className="text-xs text-neutral-500 uppercase tracking-wider font-semibold flex items-center gap-1.5 hover:text-emerald-400 transition-colors"
                        >
                          <iconify-icon icon="solar:document-bold-duotone" style={{fontSize:'0.875rem'}}></iconify-icon>
                          {t.proj_view_readme}
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            {repos.length > 4 && (
              <div className="flex justify-center mt-8">
                <button
                  onClick={() => setShowAllRepos(v => !v)}
                  className="group flex items-center gap-3 px-8 py-4 rounded-full border border-neutral-700 text-[0.7rem] font-bold uppercase tracking-widest text-neutral-300 hover:bg-neutral-800 hover:border-neutral-600 transition-all duration-300"
                >
                  <iconify-icon icon="solar:code-square-bold-duotone" class="text-emerald-400" style={{fontSize:'1rem'}}></iconify-icon>
                  {showAllRepos ? t.show_less : t.show_more}
                  <iconify-icon
                    icon="solar:alt-arrow-down-bold-duotone"
                    class="text-neutral-500 group-hover:text-white transition-all duration-300"
                    style={{fontSize:'1rem', transform: showAllRepos ? 'rotate(180deg)' : 'rotate(0deg)', transition:'transform 0.3s'}}
                  ></iconify-icon>
                </button>
              </div>
            )}
          </>
        )}
      </div>

      {/* ===== CONTRIBUTION GRAPH ===== */}
      {contributions && (() => {
        const weeks = contributions.weeks;
        const total = contributions.totalContributions;
        const allCounts = weeks.flatMap(w => w.contributionDays.map(d => d.contributionCount));
        const maxCount = Math.max(...allCounts, 1);
        const getColor = (count) => {
          if (count === 0) return '#161616';
          const intensity = count / maxCount;
          if (intensity < 0.25) return '#0d4429';
          if (intensity < 0.5)  return '#006d32';
          if (intensity < 0.75) return '#26a641';
          return '#39d353';
        };
        const months = [];
        weeks.forEach((week, wi) => {
          const firstDay = week.contributionDays[0];
          if (firstDay) {
            const d = new Date(firstDay.date);
            if (d.getDate() <= 7) {
              months.push({ label: d.toLocaleString(language === 'en' ? 'en-US' : 'fr-FR', { month: 'short' }), weekIndex: wi });
            }
          }
        });
        const days = language === 'en' ? ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'] : ['Dim','Lun','Mar','Mer','Jeu','Ven','Sam'];
        return (
          <div className="flex flex-col md:px-0 z-20 w-full max-w-[90rem] border-white/5 border-t mt-32 mr-auto ml-auto pt-12 pr-4 pb-12 pl-4 relative gap-y-8">
            <div className="flex flex-col items-center text-center gap-4 max-w-3xl mx-auto">
              <div className="animate-on-scroll flex items-center gap-2 px-3 py-1 rounded-full border border-neutral-800 bg-neutral-900/50 text-[0.65rem] uppercase tracking-widest text-neutral-400 font-semibold" data-animation="up" data-delay="0">
                <iconify-icon icon="solar:graph-bold-duotone" class="text-emerald-400" style={{fontSize:'0.75rem'}}></iconify-icon>
                <span>{t.proj_contrib}</span>
              </div>
              <h2 className="animate-on-scroll md:text-4xl lg:text-5xl uppercase leading-[0.9] text-2xl font-medium text-white tracking-tight font-bricolage" data-animation="up" data-delay="100">
                <span className="text-emerald-400">{total.toLocaleString()}</span> {t.contributions_text} <span className="text-neutral-600">{t.this_year}</span>
              </h2>
            </div>
            <div className="animate-on-scroll overflow-x-auto flex justify-center" data-animation="up" data-delay="150">
              <div className="inline-flex gap-3 p-6 bg-neutral-900/40 border border-white/5 rounded-[2rem]">
                <div className="flex flex-col justify-between pt-6 pb-0 gap-0" style={{minWidth:'28px'}}>
                  {[1,3,5].map(i => (
                    <span key={i} className="text-[0.55rem] text-neutral-600 uppercase tracking-wider leading-none" style={{height:'13px', lineHeight:'13px'}}>{days[i]}</span>
                  ))}
                </div>
                <div className="flex flex-col flex-1 gap-1">
                  <div className="flex gap-[3px] mb-1" style={{paddingLeft:'0px'}}>
                    {weeks.map((_, wi) => {
                      const month = months.find(m => m.weekIndex === wi);
                      return (
                        <div key={wi} style={{width:'13px', flexShrink:0}}>
                          {month ? <span className="text-[0.55rem] text-neutral-500 uppercase tracking-wider whitespace-nowrap">{month.label}</span> : null}
                        </div>
                      );
                    })}
                  </div>
                  <div className="flex gap-[3px]">
                    {weeks.map((week, wi) => (
                      <div key={wi} className="flex flex-col gap-[3px]">
                        {week.contributionDays.map((day, di) => (
                          <div
                            key={di}
                            title={`${day.date} — ${day.contributionCount} ${t.contribution_singular}${day.contributionCount !== 1 ? 's' : ''}`}
                            className="rounded-[2px] transition-transform duration-150 hover:scale-125 cursor-default"
                            style={{width:'13px', height:'13px', background: getColor(day.contributionCount), border: '1px solid rgba(255,255,255,0.04)'}}
                          ></div>
                        ))}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              <div className="flex items-center justify-end gap-2 mt-3 pr-2">
                <span className="text-[0.6rem] text-neutral-600 uppercase tracking-wider">{t.less}</span>
                {['#161616','#0d4429','#006d32','#26a641','#39d353'].map(c => (
                  <div key={c} className="w-3 h-3 rounded-[2px]" style={{background:c, border:'1px solid rgba(255,255,255,0.04)'}}></div>
                ))}
                <span className="text-[0.6rem] text-neutral-600 uppercase tracking-wider">{t.more}</span>
              </div>
            </div>
          </div>
        );
      })()}

      {/* ===== JOURNEY ===== */}
      <div id="parcours" className="flex flex-col md:px-0 z-20 w-full max-w-[90rem] border-white/5 border-t mt-32 mr-auto ml-auto pt-12 pr-4 pb-12 pl-4 relative gap-y-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 w-full">
          <div className="lg:col-span-5 relative flex flex-col justify-center p-6 lg:p-12 overflow-hidden rounded-[2.5rem] bg-neutral-900/50 border border-white/5">
            <div className="absolute inset-0 opacity-20 pointer-events-none" style={{backgroundImage:'radial-gradient(#10b981 1.5px, transparent 1.5px)',backgroundSize:'32px 32px'}}></div>
            <div className="absolute inset-0 bg-gradient-to-r from-neutral-950 via-transparent to-transparent"></div>
            <div className="relative z-10 flex flex-col gap-8">
              <div className="flex items-center gap-4">
                <span className="h-px w-8 bg-emerald-500/50 inline-block"></span>
                <span className="text-emerald-400 text-xs font-bold tracking-[0.2em] uppercase font-space">{t.roadmap_badge}</span>
              </div>
              <h2 className="animate-on-scroll text-4xl md:text-5xl font-medium text-white tracking-tight font-bricolage leading-[1.1]" data-animation="left" data-delay="0">
                {t.roadmap_title}, <span className="text-neutral-500">{t.roadmap_title_span}</span>
              </h2>
              <p className="animate-on-scroll text-neutral-400 text-sm md:text-base leading-relaxed font-space max-w-md" data-animation="left" data-delay="100">
                {t.roadmap_desc}
              </p>
              <a href="/JonathanBosimwenda_CV.pdf" download className="mt-4 group flex items-center gap-3 text-sm font-medium text-white w-max">
                <span className="border-b border-emerald-500 pb-0.5 group-hover:border-white transition-colors">{t.view_cv}</span>
                <iconify-icon icon="solar:arrow-right-bold-duotone" class="text-emerald-400 group-hover:translate-x-1 transition-transform" style={{fontSize:'1rem'}}></iconify-icon>
              </a>
            </div>
          </div>

          <div className="lg:col-span-7 bg-white text-neutral-950 rounded-[2.5rem] p-8 md:p-16 flex flex-col justify-between relative overflow-hidden">
            <div className="absolute -top-20 -right-20 w-64 h-64 bg-emerald-100 rounded-full blur-[80px] opacity-60 pointer-events-none"></div>
            {[
              { icon:'solar:graduation-cap-bold-duotone', iconColor:'#4ade80', period:t.timeline_period1, title:t.timeline_title1, subtitle:t.timeline_subtitle1, badgeBg:'#f0fdf4', badgeBorder:'#bbf7d0', badgeColor:'#15803d', badgeText:t.timeline_badge1, pulse:false },
              { icon:'solar:cpu-bolt-bold-duotone', iconColor:'#60a5fa', period:t.timeline_period2, title:t.timeline_title2, subtitle:t.timeline_subtitle2, badgeBg:'#eff6ff', badgeBorder:'#bfdbfe', badgeColor:'#1d4ed8', badgeText:t.timeline_badge2, pulse:false },
              { icon:'solar:code-square-bold-duotone', iconColor:'#c084fc', period:t.timeline_period3, title:t.timeline_title3, subtitle:t.timeline_subtitle3, badgeBg:'#faf5ff', badgeBorder:'#e9d5ff', badgeColor:'#7e22ce', badgeText:t.timeline_badge3, pulse:false },
              { icon:'solar:rocket-bold-duotone', iconColor:'#fb923c', period:t.timeline_period4, title:t.timeline_title4, subtitle:t.timeline_subtitle4, badgeBg:'#fff7ed', badgeBorder:'#fed7aa', badgeColor:'#c2410c', badgeText:t.timeline_badge4, pulse:true },
            ].map(({ icon, iconColor, period, title, subtitle, badgeBg, badgeBorder, badgeColor, badgeText, pulse }, i, arr) => (
              <React.Fragment key={title}>
                <div className="animate-on-scroll flex flex-col sm:flex-row gap-4 sm:gap-8 items-start sm:items-center relative z-10 py-6 group" data-animation="up" data-delay={String(i * 100)}>
                  <div className="flex items-center gap-4 w-full sm:w-52 shrink-0">
                    <div className="w-10 h-10 rounded-xl bg-neutral-950 flex items-center justify-center shrink-0">
                      <iconify-icon icon={icon} style={{fontSize:'1.25rem',color:iconColor}}></iconify-icon>
                    </div>
                    <span className="text-sm font-bold tracking-tight text-neutral-900 whitespace-nowrap">{period}</span>
                  </div>
                  <div className="flex-1 flex flex-col gap-1">
                    <span className="text-base font-semibold text-neutral-900 tracking-tight">{title}</span>
                    <span className="text-xs text-neutral-400 uppercase tracking-widest">{subtitle}</span>
                  </div>
                  <div className="flex items-center gap-2 px-3 py-1.5 rounded-full shrink-0 border" style={{background:badgeBg, borderColor:badgeBorder}}>
                    {pulse && <span className="w-2 h-2 rounded-full bg-orange-400 animate-ping inline-block"></span>}
                    {pulse && <span className="w-2 h-2 rounded-full bg-orange-400 inline-block -ml-1"></span>}
                    <span className="text-[0.65rem] font-black uppercase tracking-widest whitespace-nowrap" style={{color:badgeColor}}>{badgeText}</span>
                  </div>
                </div>
                {i < arr.length - 1 && <div className="h-px w-full bg-neutral-100"></div>}
              </React.Fragment>
            ))}
          </div>
        </div>
      </div>

      {/* ===== CONTACT ===== */}
      <div id="contact" className="flex flex-col md:px-0 z-20 w-full max-w-[90rem] border-white/5 border-t mt-32 mr-auto ml-auto pt-12 pr-4 pb-24 pl-4 relative gap-y-12 items-center text-center">
        <div className="flex flex-col items-center gap-6 max-w-3xl">
          <div className="animate-on-scroll flex items-center gap-2 px-3 py-1 rounded-full border border-neutral-800 bg-neutral-900/50 text-[0.65rem] uppercase tracking-widest text-neutral-400 font-semibold" data-animation="up" data-delay="0">
            <iconify-icon icon="solar:star-bold-duotone" class="text-emerald-400" style={{fontSize:'0.75rem'}}></iconify-icon>
            <span>{t.contact_status}</span>
          </div>
          <h2 className="animate-on-scroll md:text-5xl lg:text-6xl uppercase leading-[0.9] text-3xl font-medium text-white tracking-tight font-bricolage" data-animation="up" data-delay="100">
            {t.contact_title_pre} <span className="text-neutral-600">{t.contact_title_main}</span>
          </h2>
          <p className="animate-on-scroll text-sm md:text-base text-neutral-400 font-normal uppercase tracking-wide max-w-xl" data-animation="up" data-delay="150">
            {t.contact_desc}
          </p>
          <div className="animate-on-scroll flex flex-wrap justify-center gap-4" data-animation="up" data-delay="200">
            <a href="mailto:josbosimwenda@gmail.com" className="group flex items-center gap-2 overflow-hidden uppercase transition-all duration-500 hover:scale-[1.02] hover:shadow-[0_0_40px_-10px_rgba(59,130,246,0.5)] text-sm font-medium text-white tracking-widest rounded-full pt-5 pr-10 pb-5 pl-10 relative">
              <div className="absolute inset-0 -z-20 rounded-full overflow-hidden p-[1px]">
                <div className="absolute inset-[-100%] bg-[conic-gradient(from_0deg,transparent_0_300deg,#3b82f6_360deg)]" style={{animation:'beam-spin 3s linear infinite'}}></div>
                <div className="absolute inset-[1px] rounded-full bg-neutral-950"></div>
              </div>
              <div className="-z-10 overflow-hidden bg-neutral-950 rounded-full absolute top-[2px] right-[2px] bottom-[2px] left-[2px]">
                <div className="absolute inset-0 bg-gradient-to-b from-neutral-800/60 to-transparent"></div>
                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-2/3 h-1/2 bg-blue-500/10 blur-2xl rounded-full group-hover:bg-blue-500/30 transition-colors"></div>
              </div>
              <iconify-icon icon="solar:letter-bold-duotone" class="relative z-10 text-blue-400" style={{fontSize:'1rem'}}></iconify-icon>
              <span className="relative z-10">{t.contact_btn_email}</span>
            </a>
            <a href="https://www.linkedin.com/in/jonathan-bosimwenda" target="_blank" rel="noopener noreferrer" className="animate-on-scroll px-6 py-4 rounded-full border border-neutral-700 text-[0.7rem] font-bold uppercase tracking-widest hover:bg-neutral-800 transition-colors flex items-center gap-2" data-animation="up" data-delay="250">
              <iconify-icon icon="simple-icons:linkedin" class="text-blue-400" style={{fontSize:'1rem'}}></iconify-icon>
              {t.contact_btn_linkedin}
            </a>
            <a href="https://wa.me/254768062600" target="_blank" rel="noopener noreferrer" className="animate-on-scroll px-6 py-4 rounded-full border border-neutral-700 text-[0.7rem] font-bold uppercase tracking-widest hover:bg-neutral-800 transition-colors flex items-center gap-2" data-animation="up" data-delay="300">
              <iconify-icon icon="solar:chat-round-bold-duotone" class="text-emerald-400" style={{fontSize:'1rem'}}></iconify-icon>
              {t.contact_btn_whatsapp}
            </a>
            <a href="/JonathanBosimwenda_CV.pdf" download className="animate-on-scroll px-6 py-4 rounded-full border border-neutral-700 text-[0.7rem] font-bold uppercase tracking-widest hover:bg-neutral-800 transition-colors flex items-center gap-2" data-animation="up" data-delay="350">
              <iconify-icon icon="solar:download-bold-duotone" class="text-orange-400" style={{fontSize:'1rem'}}></iconify-icon>
              {t.btn_cv}
            </a>
          </div>
        </div>
      </div>

      {/* ===== FOOTER ===== */}
      <footer className="bg-neutral-950 w-full border-white/5 rounded-3xl border-t mt-0 pt-24 pb-12 relative">
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[80%] h-[300px] bg-gradient-to-t from-emerald-900/10 to-transparent blur-[100px] pointer-events-none"></div>
        <div className="max-w-[90rem] mx-auto px-6 md:px-12 relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8 mb-20">
            <div className="flex flex-col gap-6">
              <a href="#" className="text-2xl font-bold tracking-tight text-white">Jonathan<span className="text-emerald-400">.</span></a>
              <p className="text-neutral-400 text-sm leading-relaxed max-w-xs font-space">
                {t.footer_desc}
              </p>
              <div className="flex items-center gap-4 mt-2">
                {[
                  {href:'https://www.linkedin.com/in/jonathan-bosimwenda',icon:'simple-icons:linkedin'},
                  {href:'tel:+254768062600',icon:'solar:phone-bold-duotone'},
                  {href:'mailto:josbosimwenda@gmail.com',icon:'solar:letter-bold-duotone'},
                ].map(({href,icon}) => (
                  <a key={href} href={href} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-neutral-900 border border-neutral-800 flex items-center justify-center text-neutral-400 hover:text-white transition-all duration-300">
                    <iconify-icon icon={icon} style={{fontSize:'1.25rem'}}></iconify-icon>
                  </a>
                ))}
              </div>
            </div>
            <div className="flex flex-col gap-4">
              <h4 className="text-white font-semibold text-sm uppercase tracking-widest mb-2">{t.footer_nav}</h4>
              {[['#projets', t.nav_projects],['#expertise', t.nav_expertise],['#parcours', t.nav_journey],['#contact', t.nav_contact]].map(([href,label]) => (
                <a key={href} href={href} className="text-neutral-400 hover:text-emerald-400 text-sm transition-colors w-max">{label}</a>
              ))}
            </div>
            <div className="flex flex-col gap-4">
              <h4 className="text-white font-semibold text-sm uppercase tracking-widest mb-2">{t.footer_stack}</h4>
              {['PHP / Laravel','MySQL / PostgreSQL','JavaScript / React','Tailwind CSS'].map(s => (
                <span key={s} className="text-neutral-400 text-sm">{s}</span>
              ))}
            </div>
            <div className="flex flex-col gap-4">
              <h4 className="text-white font-semibold text-sm uppercase tracking-widest mb-2">{t.footer_internship}</h4>
              <div className="p-6 rounded-3xl bg-neutral-900 border border-neutral-800 relative overflow-hidden">
                <div className="flex items-center gap-2 text-emerald-400 font-black text-[0.65rem] mb-3 uppercase tracking-widest">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                  </span>
                  {t.footer_available}
                </div>
                <p className="text-xs text-neutral-400 leading-relaxed font-medium">{t.footer_ready}</p>
              </div>
            </div>
          </div>
          <div className="w-full border-t border-white/5 pt-12 flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="flex items-center gap-8 grayscale opacity-30 hover:grayscale-0 hover:opacity-100 transition-all duration-500">
              <iconify-icon icon="simple-icons:vercel" class="text-white" style={{fontSize:'1.5rem'}}></iconify-icon>
              <iconify-icon icon="simple-icons:react" class="text-white" style={{fontSize:'1.5rem'}}></iconify-icon>
              <iconify-icon icon="simple-icons:tailwindcss" class="text-white" style={{fontSize:'1.5rem'}}></iconify-icon>
              <iconify-icon icon="simple-icons:laravel" class="text-white" style={{fontSize:'1.5rem'}}></iconify-icon>
            </div>
            <p className="text-neutral-600 text-xs font-medium uppercase tracking-wider">
              {t.footer_copyright}
            </p>
          </div>
        </div>
      </footer>

      <div className="hidden lg:flex w-32 h-32 border-neutral-700/30 border rounded-full absolute right-[25%] bottom-[20%] items-center justify-center" style={{animation:'spin 10s linear infinite'}}>
        <div className="w-full h-[1px] bg-neutral-700/30"></div>
      </div>

      {readmeRepo && (
        <RepoModal repo={readmeRepo} onClose={() => setReadmeRepo(null)} />
      )}
    </main>
  );
}

export default App;