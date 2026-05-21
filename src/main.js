import './style.css'
import translations from './translations.js';

const GITHUB_USERNAME = 'Peter23xp';
let currentLang = 'fr';

// Language Color Mapping
const langColors = {
  'JavaScript': 'bg-yellow-400',
  'TypeScript': 'bg-blue-500',
  'HTML': 'bg-orange-500',
  'CSS': 'bg-blue-600',
  'Python': 'bg-blue-400',
  'Code': 'bg-slate-400'
};

// I18N Logic
function getTranslation(key) {
  return translations[currentLang][key] || translations['fr'][key] || key;
}

function applyTranslations() {
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.getAttribute('data-i18n');
    const translation = getTranslation(key);
    if (translation) {
      if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') {
        el.placeholder = translation;
      } else {
        el.innerHTML = translation;
      }
    }
  });
  
  // Update document title if needed
  document.title = `Peter Akilimali | ${getTranslation('hero_title_dev')}`;
}

function detectLanguage() {
  const savedLang = localStorage.getItem('portfolio_lang');
  if (savedLang && translations[savedLang]) {
    currentLang = savedLang;
  } else {
    const browserLang = navigator.language.split('-')[0];
    if (translations[browserLang]) {
      currentLang = browserLang;
    } else {
      currentLang = 'fr'; // Default
    }
  }
  applyTranslations();
  updateLangToggle();
}

function toggleLanguage() {
  currentLang = currentLang === 'fr' ? 'en' : 'fr';
  localStorage.setItem('portfolio_lang', currentLang);
  applyTranslations();
  updateLangToggle();
  // Refresh repos to update dynamic text
  fetchGitHubRepos();
}

function updateLangToggle() {
  const btn = document.getElementById('lang-toggle-text');
  if (btn) btn.textContent = currentLang.toUpperCase();
}

// GitHub Repos Fetcher
async function fetchGitHubRepos() {
  const container = document.getElementById('github-projects');
  if (!container) return;

  try {
    const response = await fetch(`https://api.github.com/users/${GITHUB_USERNAME}/repos?sort=updated&per_page=100`);
    const repos = await response.json();

    if (!Array.isArray(repos)) throw new Error('Failed to fetch');

    const allRepos = repos;

    container.innerHTML = allRepos
      .map(repo => {
        const langColor = langColors[repo.language] || langColors['Code'];
        const owner = repo.owner.login;
        const name = repo.name;
        
        return `
        <div class="group p-6 sm:p-8 rounded-[2rem] bg-white border border-slate-100 hover:border-blue-500/30 transition-all duration-500 hover:shadow-2xl hover:shadow-slate-200/50 flex flex-col justify-between h-full opacity-0 translate-y-10 reveal-animated relative overflow-hidden">
          <!-- Subtle Glow Effect -->
          <div class="absolute -top-24 -right-24 w-48 h-48 bg-blue-600/5 rounded-full blur-3xl group-hover:bg-blue-600/10 transition-colors duration-700"></div>
          
          <div class="relative z-10">
            <div class="w-14 h-14 rounded-2xl bg-blue-50 flex items-center justify-center text-blue-600 mb-8 group-hover:scale-110 group-hover:rotate-6 group-hover:bg-blue-600 group-hover:text-white transition-all duration-500 shadow-sm">
              <svg viewBox="0 0 24 24" fill="currentColor" class="w-7 h-7">
                <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/>
              </svg>
            </div>
            <h3 class="text-2xl font-bold mb-4 text-slate-900 group-hover:text-blue-600 transition-colors tracking-tight">${repo.name}</h3>
            <div class="mb-6 min-h-[72px]">
              ${repo.description ? `
                <p class="text-slate-500 text-sm line-clamp-3 leading-relaxed font-medium">
                  ${repo.description}
                </p>
              ` : `
                <div class="flex flex-col gap-2">
                  <p class="text-slate-400 text-xs italic font-medium">${getTranslation('proj_no_desc')}</p>
                  <button onclick="openReadmeModal('${owner}', '${name}')" class="inline-flex items-center gap-2 text-xs font-bold text-blue-600 hover:text-blue-700 transition-colors group/readme">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" class="w-4 h-4 group-hover/readme:translate-x-0.5 transition-transform">
                      <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/>
                      <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/>
                    </svg>
                    ${getTranslation('proj_view_readme')}
                  </button>
                </div>
              `}
            </div>
          </div>
          
          <div class="flex items-center justify-between pt-8 border-t border-slate-50 mt-auto relative z-10">
            <div class="flex items-center gap-5 text-xs font-bold text-slate-400">
              <span class="flex items-center gap-1.5">
                <svg viewBox="0 0 24 24" fill="currentColor" class="w-4 h-4 text-orange-400">
                  <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/>
                </svg>
                ${repo.stargazers_count}
              </span>
              <span class="flex items-center gap-2 text-slate-600">
                <span class="w-2.5 h-2.5 rounded-full ${langColor}"></span> ${repo.language || 'Code'}
              </span>
            </div>
            <a href="${repo.html_url}" target="_blank" class="w-12 h-12 flex items-center justify-center rounded-2xl bg-slate-50 text-slate-400 hover:bg-blue-600 hover:text-white hover:scale-110 transition-all duration-300 shadow-sm" title="Ouvrir sur GitHub">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" class="w-5 h-5">
                <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6M15 3h6v6M10 14L21 3"/>
              </svg>
            </a>
          </div>
        </div>
        `;
      })
      .join('');

    // Re-observe new elements
    const newElements = container.querySelectorAll('.reveal-animated');
    newElements.forEach(el => observer.observe(el));

  } catch (error) {
    console.error('GitHub API Error:', error);
    container.innerHTML = `
      <div class="col-span-full text-center py-24 bg-slate-50 rounded-[3rem] border border-dashed border-slate-200">
        <div class="w-16 h-16 bg-white rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-sm">
          <i class="ph-bold ph-warning-circle text-3xl text-slate-300"></i>
        </div>
        <p class="text-slate-500 font-medium">${getTranslation('proj_error')}</p>
        <button onclick="window.location.reload()" class="mt-4 text-blue-600 font-bold hover:underline transition-all">${getTranslation('proj_retry')}</button>
      </div>
    `;
  }
}

// README Modal Functions
window.openReadmeModal = async (owner, repo) => {
  const modal = document.getElementById('readme-modal');
  const content = document.getElementById('readme-content');
  const repoName = document.getElementById('modal-repo-name');
  const githubLink = document.getElementById('modal-github-link');
  
  if (!modal || !content) return;
  
  // Show modal with loading state
  modal.classList.remove('hidden');
  document.body.style.overflow = 'hidden';
  repoName.textContent = repo;
  githubLink.href = `https://github.com/${owner}/${repo}`;
  githubLink.innerHTML = `<i class="ph-bold ph-github-logo text-xl"></i> ${getTranslation('modal_btn_github')}`;

  content.innerHTML = `
    <div class="flex flex-col items-center justify-center py-20 animate-pulse">
      <div class="w-12 h-12 bg-slate-100 rounded-full mb-4"></div>
      <p class="text-slate-400 text-sm font-medium">${getTranslation('modal_loading')}</p>
    </div>
  `;

  try {
    const response = await fetch(`https://api.github.com/repos/${owner}/${repo}/readme`);
    const data = await response.json();

    if (!data.content) throw new Error('No content found');

    const rawMarkdown = decodeURIComponent(escape(atob(data.content)));
    
    if (window.marked) {
      content.innerHTML = window.marked.parse(rawMarkdown);
    } else {
      content.innerHTML = `<pre class="whitespace-pre-wrap text-sm">${rawMarkdown}</pre>`;
    }
  } catch (error) {
    content.innerHTML = `
      <div class="text-center py-20">
        <i class="ph-bold ph-file-search text-5xl text-slate-200 mb-4 block"></i>
        <p class="text-slate-500 font-medium">${getTranslation('modal_error')}</p>
        <p class="text-slate-400 text-xs mt-2">${getTranslation('modal_error_sub')}</p>
      </div>
    `;
  }
};

const closeModal = () => {
  const modal = document.getElementById('readme-modal');
  if (modal) {
    modal.classList.add('hidden');
    document.body.style.overflow = '';
  }
};

// Simple animation observer
const observerOptions = {
  threshold: 0.1
};

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('opacity-100', 'translate-y-0');
      entry.target.classList.remove('opacity-0', 'translate-y-10');
    }
  });
}, observerOptions);

document.addEventListener('DOMContentLoaded', () => {
  // Initialize translations
  detectLanguage();

  // Setup Language Toggle
  const langToggle = document.getElementById('lang-toggle');
  if (langToggle) {
    langToggle.onclick = toggleLanguage;
  }

  const animatableElements = document.querySelectorAll('section h2, section p, .group:not(.reveal-animated)');

  animatableElements.forEach(el => {
    el.classList.add('transition-all', 'duration-700', 'opacity-0', 'translate-y-10');
    observer.observe(el);
  });

  fetchGitHubRepos();

  document.getElementById('close-modal')?.addEventListener('click', closeModal);
  document.getElementById('readme-modal')?.addEventListener('click', (e) => {
    if (e.target === document.getElementById('readme-modal') || e.target.classList.contains('bg-slate-900/60')) {
      closeModal();
    }
  });
});

console.log('Portfolio initialized with i18n support ❤️');

