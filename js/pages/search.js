/* =========================================================
   search.js — Lógica da tela Buscar (FazTchê)
   -----------------------------------------------------------
   Organizado por seções:
     1. Inicialização geral (+ drawer de perfil)
     2. Dados simulados (mock) dos estabelecimentos
     3. Renderização dos cards de resultado
     4. Filtros (texto, categoria, distância, avaliação, status)
   -----------------------------------------------------------
   Por enquanto tudo roda em cima do array mockBusinesses, só
   para já ter a demonstração funcionando como no protótipo.
   Quando a busca real existir (API/backend), a ideia é trocar
   applyFilters() para consultar o backend em vez de filtrar
   o array local — o resto (render, chips, etc.) continua igual.
   ========================================================= */


/* =========================================================
   1. INICIALIZAÇÃO GERAL
   ========================================================= */
document.addEventListener('DOMContentLoaded', () => {
  initSearchPage();
});

function initSearchPage() {
  const resultsContainer = document.getElementById('results-list');
  if (!resultsContainer) return; // página errada, não faz nada

  // Mostra todos os estabelecimentos assim que a tela carrega
  renderResults(mockBusinesses, resultsContainer);

  initSearchInput();
  initToggleChips();
  initCategorySelect();
  initProfileDrawer();
}

// Abre/fecha o drawer lateral de perfil e segurança (mesma lógica do home.js)
function initProfileDrawer() {
  const openBtn = document.getElementById('open-profile-drawer');
  const closeBtn = document.getElementById('close-profile-drawer');
  const drawer = document.getElementById('profile-drawer');
  const overlay = document.getElementById('profile-overlay');

  if (!drawer || !overlay) return;

  function openProfile() {
    drawer.classList.add('active');
    overlay.classList.add('active');
    document.body.style.overflow = 'hidden'; // evita rolagem da tela de fundo
  }

  function closeProfile() {
    drawer.classList.remove('active');
    overlay.classList.remove('active');
    document.body.style.overflow = '';
  }

  if (openBtn) openBtn.addEventListener('click', openProfile);
  if (closeBtn) closeBtn.addEventListener('click', closeProfile);
  overlay.addEventListener('click', closeProfile);
}


/* =========================================================
   2. DADOS SIMULADOS (MOCK) DOS ESTABELECIMENTOS
   -----------------------------------------------------------
   status: "aberto" | "disponivel" | "fechado"
   (os dois primeiros contam como "disponível agora" para o
   chip de filtro; só "fechado" fica de fora)
   ========================================================= */
const mockBusinesses = [
  {
    id: 1,
    name: "Barbearia MK",
    category: "Barbearia",
    distance: 2.1,
    rating: 4.9,
    status: "aberto",
    image: "../../assets/images/avatar_placeholder.png"
  },
  {
    id: 2,
    name: "Padaria Pão Doce",
    category: "Padaria",
    distance: 1.3,
    rating: 4.8,
    status: "aberto",
    image: "../../assets/images/promocao_placeholder.png"
  },
  {
    id: 3,
    name: "Eletricista Silva",
    category: "Serviços",
    distance: 3.2,
    rating: 4.7,
    status: "disponivel",
    image: "../../assets/images/avatar_placeholder.png"
  },
  {
    id: 4,
    name: "Barbearia Vintage",
    category: "Barbearia",
    distance: 12.4,
    rating: 4.2,
    status: "fechado",
    image: "../../assets/images/avatar_placeholder.png"
  },
  {
    id: 5,
    name: "Padaria Estrela",
    category: "Padaria",
    distance: 6.8,
    rating: 3.6,
    status: "aberto",
    image: "../../assets/images/promocao_placeholder.png"
  },
  {
    id: 6,
    name: "Encanador Rápido",
    category: "Serviços",
    distance: 4.5,
    rating: 4.0,
    status: "disponivel",
    image: "../../assets/images/avatar_placeholder.png"
  }
];


/* =========================================================
   3. RENDERIZAÇÃO DOS CARDS DE RESULTADO
   ========================================================= */
function renderResults(businesses, container) {
  if (businesses.length === 0) {
    container.innerHTML = `<p class="no-results">Nenhum resultado encontrado para esses filtros.</p>`;
    return;
  }

  container.innerHTML = businesses.map(business => `
    <article class="business-card" data-business-id="${business.id}">
      <img src="${business.image}" alt="${business.name}">

      <div class="business-info">
        <h3>${business.name}</h3>
        <p class="category">${business.category}</p>
        <p class="distance">${formatDistance(business.distance)}</p>
        <p class="status ${business.status === 'fechado' ? 'closed' : ''}">${statusLabel(business.status)}</p>
      </div>

      <span class="business-rating">★ ${business.rating.toFixed(1).replace('.', ',')}</span>
    </article>
  `).join('');
}

// Converte o status interno no texto exibido no card
function statusLabel(status) {
  if (status === 'aberto') return 'Aberto agora';
  if (status === 'disponivel') return 'Disponível agora';
  return 'Fechado';
}

// Formata a distância em km, trocando ponto por vírgula (padrão BR)
function formatDistance(distanceKm) {
  return `${distanceKm.toFixed(1).replace('.', ',')} km`;
}


/* =========================================================
   4. FILTROS
   -----------------------------------------------------------
   4.1 Busca por texto (nome do estabelecimento)
   4.2 Chips de alternância (distância, avaliação, status)
   4.3 Select de categoria
   4.4 applyFilters() — combina tudo e re-renderiza a lista
   ========================================================= */

// 4.1 — Campo de busca por texto: filtra a cada tecla digitada
function initSearchInput() {
  const input = document.getElementById('search-input');
  if (!input) return;

  input.addEventListener('input', () => applyFilters());
}

// 4.2 — Chips que alternam entre ativo/inativo (distância, avaliação, disponibilidade)
function initToggleChips() {
  const toggleChips = document.querySelectorAll('.filter-chip[data-active]');

  toggleChips.forEach(chip => {
    chip.addEventListener('click', () => {
      const isActive = chip.dataset.active === 'true';
      chip.dataset.active = String(!isActive);
      applyFilters();
    });
  });
}

// 4.3 — Select de categoria
function initCategorySelect() {
  const select = document.getElementById('filter-category');
  if (!select) return;

  select.addEventListener('change', () => applyFilters());
}

// 4.4 — Lê o estado atual de todos os filtros e re-renderiza a lista
function applyFilters() {
  const resultsContainer = document.getElementById('results-list');
  if (!resultsContainer) return;

  const searchTerm = (document.getElementById('search-input')?.value || '').trim().toLowerCase();
  const selectedCategory = document.getElementById('filter-category')?.value || '';
  const distanceActive = document.getElementById('filter-distance')?.dataset.active === 'true';
  const ratingActive = document.getElementById('filter-rating')?.dataset.active === 'true';
  const statusActive = document.getElementById('filter-status')?.dataset.active === 'true';

  const filtered = mockBusinesses.filter(business => {
    const matchesSearch = !searchTerm || business.name.toLowerCase().includes(searchTerm);
    const matchesCategory = !selectedCategory || business.category === selectedCategory;
    const matchesDistance = !distanceActive || business.distance <= 10;
    const matchesRating = !ratingActive || business.rating >= 4.0;
    const matchesStatus = !statusActive || business.status !== 'fechado';

    return matchesSearch && matchesCategory && matchesDistance && matchesRating && matchesStatus;
  });

  renderResults(filtered, resultsContainer);
}