// --- DOM Elements ---
const championGrid = document.getElementById('champion-grid');
const yearSpan = document.getElementById('current-year');
const modalContainer = document.getElementById('modal-container');
const modalContent = document.getElementById('modal-content');
const modalCloseBtn = document.getElementById('modal-close-btn');
const filterBtn = document.getElementById('filter-favorites-btn');
const roleFiltersContainer = document.getElementById('role-filters');
const navLinks = document.getElementById('nav-links');
const hamburgerBtn = document.getElementById('hamburger-btn');

// --- Global State ---
let championsData = [];
let favorites = [];
let isFavoritesViewActive = false;
let activeRoleFilter = 'all'; // New state for role filtering

// --- Local Storage Functions ---
const loadFavorites = () => {
    const favoritesJSON = localStorage.getItem('summoners-index-favorites');
    favorites = favoritesJSON ? JSON.parse(favoritesJSON) : [];
};

const saveFavorites = () => localStorage.setItem('summoners-index-favorites', JSON.stringify(favorites));

// --- UI Update Functions ---
const updateCardFavoriteStatus = (championId) => {
    const card = document.querySelector(`.champion-card[data-id="${championId}"]`);
    if (card) card.classList.toggle('is-favorite', favorites.includes(championId));
};

const toggleFavorite = (championId) => {
    const favoriteIndex = favorites.indexOf(championId);
    if (favoriteIndex > -1) favorites.splice(favoriteIndex, 1);
    else favorites.push(championId);
    saveFavorites();
    updateCardFavoriteStatus(championId);
    if (isFavoritesViewActive) renderFilteredChampions();
};

const renderFilteredChampions = () => {
    let filteredList = [...championsData];

    // 1. Apply role filter
    if (activeRoleFilter !== 'all') {
        filteredList = filteredList.filter(champ => champ.role.toLowerCase() === activeRoleFilter);
    }

    // 2. Apply favorites filter
    if (isFavoritesViewActive) {
        filteredList = filteredList.filter(champ => favorites.includes(champ.id));
    }

    displayChampions(filteredList);

    // Update button states
    filterBtn.textContent = isFavoritesViewActive ? 'Show All Champions' : 'Show Favorites';
    filterBtn.classList.toggle('active', isFavoritesViewActive);

    document.querySelectorAll('.role-filter-btn').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.role === activeRoleFilter);
    });
};

// --- Data Fetching and Display ---
const getChampionData = async () => {
    try {
        const response = await fetch('data/champions.json');
        if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
        championsData = await response.json();
    } catch (error) {
        console.error("Could not fetch champion data:", error);
        championGrid.innerHTML = '<p class="error-message">Could not load champion data.</p>';
    }
};

const displayChampions = (championList) => {
    championGrid.innerHTML = '';
    if (championList.length === 0) {
        championGrid.innerHTML = '<p class="info-message">No champions match the current filters.</p>';
        return;
    }
    championList.forEach(champion => {
        const card = document.createElement('div');
        const isFavorite = favorites.includes(champion.id);
        card.className = `champion-card ${isFavorite ? 'is-favorite' : ''}`;
        card.dataset.id = champion.id;

        // NEW: Enhanced card HTML structure
        card.innerHTML = `
            <span class="favorite-indicator">⭐</span>
            <img src="${champion.imageURL}" alt="${champion.name}" loading="lazy">
            <div class="card-info">
                <p class="card-role">${champion.role}</p>
                <h3>${champion.name}</h3>
                <p>${champion.title}</p>
                <div class="card-difficulty">
                    <p>Difficulty</p>
                    <div class="difficulty-bar ${champion.difficulty.toLowerCase()}">
                        <span></span><span></span><span></span>
                    </div>
                </div>
            </div>
        `;
        championGrid.appendChild(card);
    });
};

const setupRoleFilters = () => {
    const roles = ['all', 'assassin', 'fighter', 'mage', 'marksman', 'support', 'tank'];
    roles.forEach(role => {
        const btn = document.createElement('button');
        btn.className = 'role-filter-btn';
        btn.dataset.role = role;
        btn.textContent = role.charAt(0).toUpperCase() + role.slice(1);
        roleFiltersContainer.appendChild(btn);
    });
};

// --- Modal Functions ---
const openModal = (championId) => {
    const champion = championsData.find(c => c.id === championId);
    if (!champion) return;

    const isFavorite = favorites.includes(champion.id);
    const btnText = isFavorite ? 'Remove from Favorites' : 'Add to Favorites';
    const btnClass = isFavorite ? 'is-favorite' : '';

    modalContent.innerHTML = `<img src="http://ddragon.leagueoflegends.com/cdn/img/champion/splash/${champion.id}_0.jpg" alt="Splash art for ${champion.name}">
    <h2>${champion.name}</h2>
    <h3>${champion.title}</h3>
    <p>${champion.lore}</p>
    <button id="favorite-btn" class="favorite-btn ${btnClass}" data-id="${champion.id}">${btnText}</button>
    `;
    modalContainer.classList.add('active');
};
const closeModal = () => modalContainer.classList.remove('active');

// --- Initialization and Event Listeners ---
const main = async () => {
    yearSpan.textContent = new Date().getFullYear();
    loadFavorites();
    await getChampionData();
    setupRoleFilters();
    renderFilteredChampions(); // Initial render
};

roleFiltersContainer.addEventListener('click', (e) => {
    if (e.target.classList.contains('role-filter-btn')) {
        activeRoleFilter = e.target.dataset.role;
        renderFilteredChampions();
    }
});

filterBtn.addEventListener('click', () => {
    isFavoritesViewActive = !isFavoritesViewActive;
    renderFilteredChampions();
});

hamburgerBtn.addEventListener('click', () => {
    document.body.classList.toggle('nav-open');
});
championGrid.addEventListener('click', (e) => {
    const card = e.target.closest('.champion-card');
    if (card) openModal(card.dataset.id);
});

modalContent.addEventListener('click', (e) => {
    if (e.target.id === 'favorite-btn') {
        const championId = e.target.dataset.id;
        toggleFavorite(championId);
        openModal(championId); // Re-open modal to update button
    }
});
modalCloseBtn.addEventListener('click', closeModal);
modalContainer.addEventListener('click', (e) => { if (e.target === modalContainer) closeModal(); });

main();