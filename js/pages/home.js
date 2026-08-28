// home.js — lógica da tela Início (feed, categorias, carrossel de banners)
// O drawer de perfil e o bottom-nav vêm de js/components/.

document.addEventListener('DOMContentLoaded', () => {
  initBannerCarousel();
  initCommunityFeed();
  initNearbyCarousel();
  initCategories();
  initCategoriesDrawer();
});


// Feed da comunidade

// Dados simulados do feed
const mockPosts = [
  {
    id: 1,
    user: {
      name: "Carlos Eduardo",
      avatar: "../../assets/images/avatar_placeholder.png",
      category: "Confeitaria"
    },
    timeAgo: "Há 15 min",
    content: "Galera de Cachoeirinha, encomenda de bolos e doces para o fim de semana com 10% de desconto! Só chamar no WhatsApp.",
    image: "../../assets/images/promocao_placeholder.png",
    likes: 12,
    comments: 3,
    isLiked: false
  },
  {
    id: 2,
    user: {
      name: "Oficina do Silva",
      avatar: "../../assets/images/avatar_placeholder.png",
      category: "Mecânica"
    },
    timeAgo: "Há 2 horas",
    content: "Troca de óleo e revisão preventiva com agendamento rápido na Araçatuba. Atendemos até as 19h!",
    image: null, // post apenas de texto, sem mídia
    likes: 24,
    comments: 8,
    isLiked: true
  }
];

// Inicializa e renderiza o feed no container
function initCommunityFeed() {
  const postsContainer = document.getElementById('posts-container');
  if (!postsContainer) return;

  renderFeed(mockPosts, postsContainer);
}

function renderFeed(posts, container) {
  if (posts.length === 0) {
    container.innerHTML = `<p class="empty-feed">Nenhuma publicação recente na comunidade.</p>`;
    return;
  }

  container.innerHTML = posts.map(post => `
    <article class="post-card" data-post-id="${post.id}">
      <!-- Header do post: autor + categoria + tempo -->
      <div class="post-header">
        <div class="post-author">
          <img src="${post.user.avatar}" alt="${post.user.name}" class="author-avatar">
          <div class="author-info">
            <h3>${post.user.name}</h3>
            <div class="author-meta">
              <span class="category-badge">${post.user.category}</span>
              <span class="dot-separator">•</span>
              <span class="post-time">${post.timeAgo}</span>
            </div>
          </div>
        </div>
        <button class="post-more-btn" aria-label="Mais opções">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#64748b" stroke-width="2"><circle cx="12" cy="12" r="1"/><circle cx="19" cy="12" r="1"/><circle cx="5" cy="12" r="1"/></svg>
        </button>
      </div>

      <!-- Conteúdo do post: texto + mídia (se houver) -->
      <div class="post-body">
        <p class="post-text">${post.content}</p>
        ${post.image ? `<div class="post-media"><img src="${post.image}" alt="Mídia do post"></div>` : ''}
      </div>

      <!-- Ações: curtir, comentar, compartilhar -->
      <div class="post-actions">
        <button class="action-btn like-btn ${post.isLiked ? 'liked' : ''}" onclick="handleLike(${post.id})">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="${post.isLiked ? 'currentColor' : 'none'}" stroke="currentColor" stroke-width="2">
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
          </svg>
          <span class="like-count">${post.likes}</span>
        </button>

        <button class="action-btn comment-btn" onclick="openComments(${post.id})">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/>
          </svg>
          <span>${post.comments}</span>
        </button>

        <button class="action-btn share-btn" onclick="sharePost(${post.id})">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/>
            <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/>
          </svg>
        </button>
      </div>
    </article>
  `).join('');
}

// Ações interativas do post
function handleLike(postId) {
  const post = mockPosts.find(p => p.id === postId);
  if (!post) return;

  post.isLiked = !post.isLiked;
  post.likes += post.isLiked ? 1 : -1;

  // Atualiza apenas o post curtido no DOM, sem re-renderizar o feed inteiro
  const postElement = document.querySelector(`[data-post-id="${postId}"]`);
  if (!postElement) return;

  const likeBtn = postElement.querySelector('.like-btn');
  const likeCount = postElement.querySelector('.like-count');

  likeBtn.classList.toggle('liked', post.isLiked);
  likeBtn.querySelector('svg').setAttribute('fill', post.isLiked ? 'currentColor' : 'none');
  likeCount.textContent = post.likes;
}

function openComments(postId) {
  // TODO: abrir modal/tela de comentários do post
  console.log(`Abrir modal de comentários do post ${postId}`);
}

function sharePost(postId) {
  if (navigator.share) {
    navigator.share({ title: 'Confira no FazTchê', url: window.location.href });
  } else {
    // Fallback simples para navegadores sem suporte à Web Share API
    alert('Link copiado para a área de transferência!');
  }
}


// Estabelecimentos "Perto de Você"

// Dados simulados dos estabelecimentos próximos
const mockNearby = [
  {
    id: 101,
    name: "Barbearia Tradicional",
    category: "Barbearia",
    distance: "400m",
    rating: "4.9",
    image: "../../assets/images/promocao_placeholder.png"
  },
  {
    id: 102,
    name: "Doces da Vovó",
    category: "Confeitaria",
    distance: "1.2 km",
    rating: "4.8",
    image: "../../assets/images/promocao_placeholder.png"
  },
  {
    id: 103,
    name: "Auto Center Cachoeirinha",
    category: "Mecânica",
    distance: "850m",
    rating: "5.0",
    image: "../../assets/images/promocao_placeholder.png"
  }
];

// Inicializa e renderiza o carrossel de "Perto de Você"
function initNearbyCarousel() {
  renderNearbyCarousel();
}

function renderNearbyCarousel() {
  const container = document.getElementById('nearby-container');
  if (!container) return;

  container.innerHTML = mockNearby.map(item => `
    <div class="nearby-card" onclick="openPlaceDetails(${item.id})">
      <div class="nearby-cover">
        <img src="${item.image}" alt="${item.name}">
        <div class="badge-rating">
          <svg width="10" height="10" viewBox="0 0 24 24" fill="#f59e0b"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
          <span>${item.rating}</span>
        </div>
      </div>
      <div class="nearby-info">
        <h3 class="nearby-title">${item.name}</h3>
        <div class="nearby-meta">
          <span>${item.category}</span>
          <span>•</span>
          <span class="nearby-distance">${item.distance}</span>
        </div>
      </div>
    </div>
  `).join('');
}

function openPlaceDetails(id) {
  // TODO: navegar para a página de detalhes do estabelecimento
  console.log(`Abrir página do estabelecimento: ${id}`);
}


// Categorias (carrossel de filtros)
function initCategories() {
  const filterCategories = document.querySelectorAll('.category-item:not(.category-more-btn)');
  const openMenuBtn = document.getElementById('open-categories-menu');

  // Clique em uma categoria: alterna o estado ativo (multi-seleção, ver toggleCategory abaixo)
  filterCategories.forEach(item => {
    item.addEventListener('click', () => toggleCategory(item.dataset.category));
  });

  // Clique em "Ver mais": abre o drawer lateral de categorias
  if (openMenuBtn) {
    openMenuBtn.addEventListener('click', openCategoriesDrawer);
  }
}


// Drawer lateral de categorias (estilo iFood), aberto pelo card "Ver mais".
// Não fecha sozinho ao selecionar, para dar pra marcar várias antes de fechar.
function initCategoriesDrawer() {
  const drawer = document.getElementById('categories-drawer');
  const overlay = document.getElementById('categories-overlay');
  const closeBtn = document.getElementById('close-categories-drawer');
  const gridItems = document.querySelectorAll('.grid-category-item');

  if (!drawer || !overlay) return;

  if (closeBtn) closeBtn.addEventListener('click', closeCategoriesDrawer);
  overlay.addEventListener('click', closeCategoriesDrawer);

  // Clique em uma categoria da grade: alterna a seleção e sincroniza com o carrossel
  gridItems.forEach(item => {
    item.addEventListener('click', () => toggleCategory(item.dataset.category));
  });
}

function openCategoriesDrawer() {
  const drawer = document.getElementById('categories-drawer');
  const overlay = document.getElementById('categories-overlay');
  if (!drawer || !overlay) return;

  drawer.classList.add('active');
  overlay.classList.add('active');
  document.body.style.overflow = 'hidden';
}

function closeCategoriesDrawer() {
  const drawer = document.getElementById('categories-drawer');
  const overlay = document.getElementById('categories-overlay');
  if (!drawer || !overlay) return;

  drawer.classList.remove('active');
  overlay.classList.remove('active');
  document.body.style.overflow = '';
}

// Alterna (liga/desliga) uma categoria — precisa de 2 cliques para desmarcar.
// Mantém sincronizados o carrossel principal e a grade do drawer, já que a
// mesma categoria aparece nos dois lugares.
function toggleCategory(category) {
  document.querySelectorAll(`.category-item[data-category="${category}"]`).forEach(btn => {
    btn.classList.toggle('active');
  });

  document.querySelectorAll(`.grid-category-item[data-category="${category}"]`).forEach(btn => {
    btn.classList.toggle('active');
  });

  console.log('Categorias selecionadas:', getSelectedCategories());
  // TODO: disparar filtro real do feed/estabelecimentos pelas categorias selecionadas
}

// Retorna a lista de categorias atualmente marcadas como ativas
function getSelectedCategories() {
  return Array.from(document.querySelectorAll('.category-item.active:not(.category-more-btn)'))
    .map(btn => btn.dataset.category);
}


// Carrossel de banners/promoções. O "deslizar com o dedo" vem do scroll
// nativo do trilho (.banner-track tem overflow-x + scroll-snap no CSS) —
// o JS aqui só monta os slides e mantém a bolinha ativa em sincronia.

// Dados simulados dos banners
const mockBanners = [
  { id: 1, image: "../../assets/images/promocao_placeholder.png", alt: "Promoção 1" },
  { id: 2, image: "../../assets/images/promocao_placeholder.png", alt: "Promoção 2" },
  { id: 3, image: "../../assets/images/promocao_placeholder.png", alt: "Promoção 3" }
];

// Monta os slides e as bolinhas, e liga o scroll ao troca-bolinha
function initBannerCarousel() {
  const track = document.getElementById('banner-track');
  const dotsContainer = document.getElementById('banner-dots');
  if (!track || !dotsContainer) return;

  renderBannerSlides(mockBanners, track);
  renderBannerDots(mockBanners, dotsContainer);

  // Atualiza a bolinha ativa conforme o usuário desliza o dedo pelo trilho.
  // Usa um pequeno debounce (setTimeout) para não recalcular a cada pixel rolado.
  let scrollTimeout;
  track.addEventListener('scroll', () => {
    clearTimeout(scrollTimeout);
    scrollTimeout = setTimeout(() => updateActiveDot(track, dotsContainer), 80);
  });

  // Clicar numa bolinha também navega até o slide correspondente
  dotsContainer.addEventListener('click', (event) => {
    const dot = event.target.closest('.dot');
    if (!dot) return;

    const index = Number(dot.dataset.index);
    track.scrollTo({ left: index * track.clientWidth, behavior: 'smooth' });
  });
}

function renderBannerSlides(banners, track) {
  track.innerHTML = banners.map(banner => `
    <div class="banner-slide">
      <img src="${banner.image}" alt="${banner.alt}">
    </div>
  `).join('');
}

function renderBannerDots(banners, dotsContainer) {
  dotsContainer.innerHTML = banners.map((banner, index) => `
    <span class="dot ${index === 0 ? 'active' : ''}" data-index="${index}"></span>
  `).join('');
}

// Calcula qual slide está mais visível e marca a bolinha correspondente
function updateActiveDot(track, dotsContainer) {
  const slideWidth = track.clientWidth;
  if (!slideWidth) return;

  const activeIndex = Math.round(track.scrollLeft / slideWidth);
  const dots = dotsContainer.querySelectorAll('.dot');

  dots.forEach((dot, index) => {
    dot.classList.toggle('active', index === activeIndex);
  });
}