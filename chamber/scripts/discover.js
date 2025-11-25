// In scripts/discover.js

document.addEventListener('DOMContentLoaded', () => {

    // --- 1. DYNAMIC VISIT MESSAGE LOGIC ---
    const visitMessageEl = document.getElementById('visit-message');
    
    // Get the current date in milliseconds
    const now = Date.now();
    
    // Get the last visit date from localStorage (it will be null on first visit)
    const lastVisit = localStorage.getItem('lastVisitTime');

    if (!lastVisit) {
        // This is the user's first visit
        visitMessageEl.textContent = "Welcome! Let us know if you have any questions.";
    } else {
        // The user has visited before, calculate the difference
        const timeDiff = now - parseInt(lastVisit);
        const daysDiff = Math.floor(timeDiff / (1000 * 60 * 60 * 24));

        if (daysDiff < 1) {
            visitMessageEl.textContent = "Back so soon! Awesome!";
        } else {
            // Handle pluralization of "day"
            const dayString = daysDiff === 1 ? "day" : "days";
            visitMessageEl.textContent = `You last visited ${daysDiff} ${dayString} ago.`;
        }
    }

    // CRUCIAL: Store the current visit time for the NEXT visit
    localStorage.setItem('lastVisitTime', now);


    // --- 2. LAZY LOADING IMAGES LOGIC ---
    const imagesToLoad = document.querySelectorAll('img[data-src]');

    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            // If the image is in the viewport
            if (entry.isIntersecting) {
                const img = entry.target;

                // Load the image by swapping data-src to src
                img.src = img.dataset.src;

                // Stop observing the image once it has loaded
                img.removeAttribute('data-src');
                observer.unobserve(img);
            }
        });
    });

    // Start observing each image
    imagesToLoad.forEach(image => {
        imageObserver.observe(image);
    });

});