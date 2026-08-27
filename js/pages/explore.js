/* =========================================================
   explore.js — Feed "Explorar" (estilo Reels/TikTok) do FazTchê
   -----------------------------------------------------------
   Organizado por seções:
     1. Inicialização geral
     2. Dados simulados (mock) dos posts
     3. Renderização do feed
     4. Autoplay do vídeo visível (IntersectionObserver)
     5. Interações do post (play/pause, mudo, curtir, comentar, compartilhar)
     6. Chips de categoria (filtro)
   -----------------------------------------------------------
   Ideia geral: cada post pode ser "video" ou "image". Os vídeos
   tocam automaticamente só enquanto estão na tela (como num
   feed de Reels) e começam mudos — o usuário liga o som pelo
   botão de alto-falante em cada post.
   ========================================================= */


/* =========================================================
   1. INICIALIZAÇÃO GERAL
   ========================================================= */
document.addEventListener('DOMContentLoaded', () => {
  initExploreFeed();
  initCategoryTabs();
});

// Guarda o observer atual pra poder desligar e recriar quando o feed é filtrado
let feedObserver = null;

function initExploreFeed() {
  const feedContainer = document.getElementById('explore-feed');
  if (!feedContainer) return;

  renderFeed(mockExplorePosts, feedContainer);
  observeFeedItems(feedContainer);
}


/* =========================================================
   2. DADOS SIMULADOS (MOCK) DOS POSTS
   -----------------------------------------------------------
   type: "video" | "image"
   category: "servicos" | "turismo" | "promocoes"
   (a aba "Para você" mostra todos, sem filtrar por categoria)

   Os vídeos aqui são exemplos públicos de teste (Big Buck Bunny
   e outros vídeos de demonstração do Google) — só pra já testar
   o player funcionando. Trocar pelas mídias reais dos usuários
   quando o upload de vídeo existir.
   ========================================================= */
const mockExplorePosts = [
  {
    id: 1,
    type: 'image',
    category: 'turismo',
    mediaUrl: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80',
    authorName: 'Cachoeira do Salto',
    authorAvatar: '../../assets/images/avatar_placeholder.png',
    location: 'Gramado, RS',
    likes: 512,
    comments: 34,
    shares: 86,
    isLiked: false
  },
  {
    id: 2,
    type: 'video',
    category: 'servicos',
    mediaUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
    authorName: 'Barbearia MK',
    authorAvatar: '../../assets/images/avatar_placeholder.png',
    location: 'Canoas, RS',
    likes: 245,
    comments: 12,
    shares: 20,
    isLiked: false
  },
  {
    id: 3,
    type: 'video',
    category: 'promocoes',
    mediaUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
    authorName: 'Doces & Cia',
    authorAvatar: '../../assets/images/avatar_placeholder.png',
    location: 'Canoas, RS',
    likes: 189,
    comments: 8,
    shares: 15,
    isLiked: true
  },
  {
    id: 4,
    type: 'image',
    category: 'turismo',
    mediaUrl: 'https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=800&q=80',
    authorName: 'Trilha da Serra',
    authorAvatar: '../../assets/images/avatar_placeholder.png',
    location: 'Nova Petrópolis, RS',
    likes: 320,
    comments: 21,
    shares: 40,
    isLiked: false
  },
  {
    id: 5,
    type: 'video',
    category: 'servicos',
    mediaUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
    authorName: 'Oficina Rápida',
    authorAvatar: '../../assets/images/avatar_placeholder.png',
    location: 'Canoas, RS',
    likes: 98,
    comments: 5,
    shares: 9,
    isLiked: false
  },
  {
    id: 6,
    type: 'video',
    category: 'promocoes',
    mediaUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
    authorName: 'Loja Estrela',
    authorAvatar: '../../assets/images/avatar_placeholder.png',
    location: 'Canoas, RS',
    likes: 410,
    comments: 30,
    shares: 55,
    isLiked: false
  }
];


/* =========================================================
   3. RENDERIZAÇÃO DO FEED
   ========================================================= */
function renderFeed(posts, container) {
  if (posts.length === 0) {
    container.innerHTML = `<p class="empty-feed-message">Ainda não tem publicações nessa categoria.</p>`;
    return;
  }

  container.innerHTML = posts.map(post => `
    <article class="feed-item" data-post-id="${post.id}">
      ${renderMedia(post)}
      <div class="feed-overlay"></div>

      ${post.type === 'video' ? `
        <button class="mute-btn" data-action="toggle-mute" aria-label="Ativar/desativar som">
          ${muteIconSvg(true)}
        </button>
      ` : ''}

      <!-- Ícone de play/pause que pisca ao tocar no vídeo -->
      <div class="play-pause-indicator" id="indicator-${post.id}">
        ${pauseIconSvg()}
      </div>

      <!-- Informações do Autor -->
      <div class="author-info">
        <img src="${post.authorAvatar}" alt="${post.authorName}" class="author-avatar">
        <div class="author-meta">
          <h3>${post.authorName}</h3>
          <span>📍 ${post.location}</span>
        </div>
      </div>

      <!-- Botão Ver Mais -->
      <button class="see-more-btn" data-action="see-more">
        Ver mais <span>›</span>
      </button>

      <!-- Ações Laterais -->
      <aside class="feed-actions">
        <button class="action-btn like-btn ${post.isLiked ? 'liked' : ''}" data-action="like">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="${post.isLiked ? 'currentColor' : 'none'}" stroke="currentColor" stroke-width="${post.isLiked ? '0' : '2'}"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg>
          <span class="like-count">${post.likes}</span>
        </button>

        <button class="action-btn" data-action="comment">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M20 2H4c-1.1 0-1.99.9-1.99 2L2 22l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zM6 9h12v2H6V9zm8 5H6v-2h8v2zm4-6H6V6h12v2z"/></svg>
          <span>${post.comments}</span>
        </button>

        <button class="action-btn" data-action="share">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M18 16.08c-.76 0-1.44.3-1.96.77L8.91 12.7c.05-.23.09-.46.09-.7s-.04-.47-.09-.7l7.05-4.11c.54.5 1.25.81 2.04.81 1.66 0 3-1.34 3-3s-1.34-3-3-3-3 1.34-3 3c0 .24.04.47.09.7L8.04 9.81C7.5 9.31 6.79 9 6 9c-1.66 0-3 1.34-3 3s1.34 3 3 3c.79 0 1.5-.31 2.04-.81l7.12 4.16c-.05.21-.08.43-.08.65 0 1.61 1.31 2.92 2.92 2.92 1.61 0 2.92-1.31 2.92-2.92s-1.31-2.92-2.92-2.92z"/></svg>
          <span>${post.shares}</span>
        </button>

        <div class="user-profile-thumb">
          <img src="${post.authorAvatar}" alt="Perfil">
        </div>
      </aside>
    </article>
  `).join('');
}

// Monta a tag de mídia certa (vídeo ou imagem) pra um post
function renderMedia(post) {
  if (post.type === 'video') {
    return `
      <video class="feed-bg" src="${post.mediaUrl}" muted loop playsinline preload="metadata" data-action="toggle-play"></video>
    `;
  }

  return `<img class="feed-bg" src="${post.mediaUrl}" alt="${post.authorName}">`;
}

function pauseIconSvg() {
  return `<svg width="28" height="28" viewBox="0 0 24 24" fill="#fff"><rect x="6" y="5" width="4" height="14" rx="1"/><rect x="14" y="5" width="4" height="14" rx="1"/></svg>`;
}

function playIconSvg() {
  return `<svg width="28" height="28" viewBox="0 0 24 24" fill="#fff"><polygon points="7 4 20 12 7 20 7 4"/></svg>`;
}

function muteIconSvg(isMuted) {
  return isMuted
    ? `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2"><path d="M11 5 6 9H2v6h4l5 4V5z"/><line x1="23" y1="9" x2="17" y2="15"/><line x1="17" y1="9" x2="23" y2="15"/></svg>`
    : `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2"><path d="M11 5 6 9H2v6h4l5 4V5z"/><path d="M15.54 8.46a5 5 0 0 1 0 7.07"/><path d="M19.07 4.93a10 10 0 0 1 0 14.14"/></svg>`;
}


/* =========================================================
   4. AUTOPLAY DO VÍDEO VISÍVEL (IntersectionObserver)
   -----------------------------------------------------------
   Cada .feed-item vira "ativo" quando ocupa boa parte da tela
   (o scroll-snap já garante que só um por vez fica assim).
   O vídeo desse item toca; os outros ficam pausados e voltam
   pro início, pra economizar recurso e não continuar tocando
   som fora de tela.
   ========================================================= */
function observeFeedItems(container) {
  if (feedObserver) feedObserver.disconnect();

  const items = container.querySelectorAll('.feed-item');
  if (items.length === 0) return;

  feedObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      const video = entry.target.querySelector('video');
      if (!video) return;

      if (entry.isIntersecting) {
        video.play().catch(() => {}); // ignora bloqueio de autoplay do navegador, se houver
      } else {
        video.pause();
        video.currentTime = 0;
      }
    });
  }, { threshold: 0.6 });

  items.forEach(item => feedObserver.observe(item));
}


/* =========================================================
   5. INTERAÇÕES DO POST
   -----------------------------------------------------------
   Um único listener de clique no feed (delegação de evento),
   lendo o atributo [data-action] de quem foi clicado — evita
   precisar re-ligar listeners toda vez que o feed é re-renderizado.
   ========================================================= */
document.addEventListener('DOMContentLoaded', () => {
  const feedContainer = document.getElementById('explore-feed');
  if (!feedContainer) return;

  feedContainer.addEventListener('click', (event) => {
    const actionEl = event.target.closest('[data-action]');
    if (!actionEl) return;

    const postEl = event.target.closest('.feed-item');
    const postId = postEl ? Number(postEl.dataset.postId) : null;

    switch (actionEl.dataset.action) {
      case 'toggle-play':
        togglePlayPause(actionEl, postId);
        break;
      case 'toggle-mute':
        toggleMute(actionEl, postEl);
        break;
      case 'like':
        handleLike(actionEl, postId);
        break;
      case 'comment':
        console.log(`Abrir comentários do post ${postId}`);
        break;
      case 'share':
        sharePost(postId);
        break;
      case 'see-more':
        console.log(`Ver mais detalhes do post ${postId}`);
        break;
    }
  });
});

// Toca/pausa o vídeo ao tocar nele, e pisca o ícone central rapidamente
function togglePlayPause(video, postId) {
  const indicator = document.getElementById(`indicator-${postId}`);

  if (video.paused) {
    video.play().catch(() => {});
    if (indicator) indicator.innerHTML = playIconSvg();
  } else {
    video.pause();
    if (indicator) indicator.innerHTML = pauseIconSvg();
  }

  if (indicator) {
    indicator.classList.add('show');
    setTimeout(() => indicator.classList.remove('show'), 500);
  }
}

// Liga/desliga o som do vídeo do post (não deixa o clique "vazar" pro play/pause)
function toggleMute(button, postEl) {
  const video = postEl.querySelector('video');
  if (!video) return;

  video.muted = !video.muted;
  button.innerHTML = muteIconSvg(video.muted);
}

// Curtir/descurtir, atualizando o mock e o DOM (mesmo padrão usado no feed da Início)
function handleLike(button, postId) {
  const post = mockExplorePosts.find(p => p.id === postId);
  if (!post) return;

  post.isLiked = !post.isLiked;
  post.likes += post.isLiked ? 1 : -1;

  const countEl = button.querySelector('.like-count');
  const svg = button.querySelector('svg');

  button.classList.toggle('liked', post.isLiked);
  svg.setAttribute('fill', post.isLiked ? 'currentColor' : 'none');
  svg.setAttribute('stroke-width', post.isLiked ? '0' : '2');
  countEl.textContent = post.likes;
}

function sharePost(postId) {
  if (navigator.share) {
    navigator.share({ title: 'Confira no FazTchê', url: window.location.href });
  } else {
    alert('Link copiado para a área de transferência!');
  }
}


/* =========================================================
   6. CHIPS DE CATEGORIA (FILTRO)
   -----------------------------------------------------------
   "Para você" mostra todos os posts; as outras abas filtram
   pelo campo "category" do mock. Ao trocar de aba, o feed é
   re-renderizado do zero e o observer de autoplay é recriado
   (senão continuaria observando elementos que não existem mais).
   ========================================================= */
function initCategoryTabs() {
  const tabs = document.querySelectorAll('.tab-chip');
  const feedContainer = document.getElementById('explore-feed');
  if (!tabs.length || !feedContainer) return;

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');

      const category = tab.dataset.category;
      const filtered = category === 'para-voce'
        ? mockExplorePosts
        : mockExplorePosts.filter(post => post.category === category);

      renderFeed(filtered, feedContainer);
      feedContainer.scrollTop = 0;
      observeFeedItems(feedContainer);
    });
  });
}