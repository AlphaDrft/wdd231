// In scripts/discover.js

document.addEventListener('DOMContentLoaded', () => {

    // --- 1. DYNAMIC VISIT MESSAGE LOGIC (No changes here) ---
    const visitMessageEl = document.getElementById('visit-message');
    const now = Date.now();
    const lastVisit = localStorage.getItem('lastVisitTime');

    if (!lastVisit) {
        visitMessageEl.textContent = "Welcome! Let us know if you have any questions.";
    } else {
        const timeDiff = now - parseInt(lastVisit);
        const daysDiff = Math.floor(timeDiff / (1000 * 60 * 60 * 24));
        if (daysDiff < 1) {
            visitMessageEl.textContent = "Back so soon! Awesome!";
        } else {
            const dayString = daysDiff === 1 ? "day" : "days";
            visitMessageEl.textContent = `You last visited ${daysDiff} ${dayString} ago.`;
        }
    }
    localStorage.setItem('lastVisitTime', now);

    // --- NEW: DYNAMICALLY BUILD DISCOVER CARDS FROM JSON ---
    const cardsContainer = document.getElementById('discover-cards-container');

    async function loadLocations() {
        try {
            const response = await fetch('data/discover.json');
            const data = await response.json();
            displayLocations(data.locations);
        } catch (error) {
            console.error("Error loading location data:", error);
        }
    }

    function displayLocations(locations) {
        cardsContainer.innerHTML = ''; // Clear any existing content
        locations.forEach(location => {
            const card = document.createElement('div');
            card.className = 'discover-card';
            card.innerHTML = `
                <img src="data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7" 
                     data-src="${location.photo}" 
                     alt="${location.title}">
                <h3>${location.title}</h3>
                <p><strong>Address:</strong> ${location.address}</p>
                <p>${location.description}</p>
                <a href="${location.learnMoreUrl}" class="learn-more-btn" target="_blank">Learn More</a>
            `;
            cardsContainer.appendChild(card);
        });

        // IMPORTANT: Re-run the lazy load setup AFTER the cards have been created
        setupLazyLoading();
    }

    // --- 2. LAZY LOADING IMAGES LOGIC (Now in a function) ---
    function setupLazyLoading() {
        const imagesToLoad = document.querySelectorAll('img[data-src]');
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    img.removeAttribute('data-src');
                    observer.unobserve(img);
                }
            });
        });
        imagesToLoad.forEach(image => {
            imageObserver.observe(image);
        });
    }

    // Initial call to load the locations
    loadLocations();
});