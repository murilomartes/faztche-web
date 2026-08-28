// search.js — lógica da tela Buscar (filtros de texto/categoria/distância/avaliação/status)
// O drawer de perfil e o bottom-nav vêm de js/components/.
// Tudo roda em cima do array mockBusinesses por enquanto; quando a busca real existir,
// a ideia é trocar applyFilters() para consultar o backend em vez do array local.

document.addEventListener('DOMContentLoaded', () => {
  initSearchPage();
});

function initSearchPage() {
  const resultsContainer = document.getElementById('results-list');
  if (!resultsContainer) return; // página errada, não faz nada

  renderResults(mockBusinesses, resultsContainer);

  initSearchInput();
  initToggleChips();
  initCategorySelect();
}


// Dados simulados dos estabelecimentos.
// status: "aberto" | "disponivel" | "fechado" (os dois primeiros contam
// como "disponível agora" para o chip de filtro; só "fechado" fica de fora)
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


// Renderização dos cards de resultado
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


// Filtros: texto, chips de alternância, categoria — applyFilters() combina tudo

// Campo de busca por texto: filtra a cada tecla digitada
function initSearchInput() {
  const input = document.getElementById('search-input');
  if (!input) return;

  input.addEventListener('input', () => applyFilters());
}

// Chips que alternam entre ativo/inativo (distância, avaliação, disponibilidade)
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

// Select de categoria
function initCategorySelect() {
  const select = document.getElementById('filter-category');
  if (!select) return;

  select.addEventListener('change', () => applyFilters());
}

// Lê o estado atual de todos os filtros e re-renderiza a lista
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