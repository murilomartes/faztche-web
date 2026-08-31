// header-actions.js — logo central + botões de notificação/avatar do header.
// Usado dentro de .header-top nas telas que têm esse padrão de cabeçalho (Início, Buscar...).
// Página só precisa de <div id="header-actions-root" data-context="..."></div>.

// header-actions.js
function renderHeaderActions(context) {
  const homeHref = context === 'profile' ? '../app/home.html' : 'home.html';

  return `
    <div class="header-brand-group">
      <a href="${homeHref}" class="brand-logo" aria-label="Ir para a página inicial">
        <span class="brand-faz">Faz</span><span class="brand-tche">Tchê</span>
      </a>
      <div class="user-location">
        <div class="location-tag">
          <svg width="12" height="14" viewBox="0 0 24 24" fill="var(--color-primary, #0d9488)">
            <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
          </svg>
          <small>Cachoeirinha</small>
        </div>
      </div>
    </div>
    <div class="header-actions">
      <button class="icon-btn" aria-label="Notificações">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#333" stroke-width="2"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>
      </button>
      <button class="profile-avatar-btn" id="open-profile-drawer" aria-label="Abrir opções do perfil">
        <img src="../../assets/images/avatar_placeholder.png" alt="Perfil" class="user-avatar">
      </button>
    </div>
  `;
}

document.addEventListener('DOMContentLoaded', () => {
  const root = document.getElementById('header-actions-root');
  if (!root) return;

  root.outerHTML = `<div class="header-top">${renderHeaderActions(root.dataset.context || 'app')}</div>`;
});