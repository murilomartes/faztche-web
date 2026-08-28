// bottom-nav.js — menu inferior fixo, compartilhado por todas as telas do app.
// Cada página só precisa de <div id="bottom-nav-root" data-active="..." data-context="..."></div>

const BOTTOM_NAV_ITEMS = [
  {
    id: 'home',
    file: 'home.html',
    label: 'Início',
    icon: '<svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor"><path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/></svg>'
  },
  {
    id: 'search',
    file: 'search.html',
    label: 'Buscar',
    icon: '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>'
  },
  {
    id: 'publish',
    file: 'publish.html',
    label: 'Publicar',
    icon: '<div class="plus-circle">+</div>',
    isPublish: true
  },
  {
    id: 'explore',
    file: 'explore.html',
    label: 'Explorar',
    icon: '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M16.24 7.76l-2.12 6.36-6.36 2.12 2.12-6.36z"/></svg>'
  },
  {
    id: 'profile',
    file: 'profile.html',
    label: 'Perfil',
    icon: '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>'
  }
];

// context "app" = página dentro de pages/app/; context "profile" = pages/profile/profile.html
function renderBottomNav(activeId, context) {
  const appPrefix = context === 'profile' ? '../app/' : '';
  const profilePrefix = context === 'profile' ? '' : '../profile/';

  const links = BOTTOM_NAV_ITEMS.map(item => {
    const prefix = item.id === 'profile' ? profilePrefix : appPrefix;
    const classes = ['nav-item', item.isPublish ? 'publish-btn' : '', item.id === activeId ? 'active' : '']
      .filter(Boolean).join(' ');

    return `<a href="${prefix}${item.file}" class="${classes}">${item.icon}<span>${item.label}</span></a>`;
  }).join('');

  return `<nav class="bottom-nav">${links}</nav>`;
}

document.addEventListener('DOMContentLoaded', () => {
  const root = document.getElementById('bottom-nav-root');
  if (!root) return;

  root.outerHTML = renderBottomNav(root.dataset.active, root.dataset.context || 'app');
});
