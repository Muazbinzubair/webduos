// Portfolio-specific functionality for WebDuos website
// Handles portfolio filtering and video carousel

document.addEventListener('DOMContentLoaded', function() {
    // Only initialize portfolio functionality if we're on the portfolio page
    if (document.querySelector('.portfolio-grid')) {
        initPortfolioFilter();
    }
    
    if (document.querySelector('.video-carousel')) {
        initVideoCarousel();
    }
});

// Portfolio Filtering System
function initPortfolioFilter() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    const portfolioItems = document.querySelectorAll('.portfolio-item');
    
    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            const filter = this.getAttribute('data-filter');
            
            // Update active button
            filterButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
            
            // Filter portfolio items
            filterPortfolioItems(filter, portfolioItems);
        });
    });
}

function filterPortfolioItems(filter, items) {
    items.forEach((item, index) => {
        const categories = item.getAttribute('data-category') || '';
        const shouldShow = filter === 'all' || categories.includes(filter);
        
        if (shouldShow) {
            // Show item with animation delay
            setTimeout(() => {
                item.classList.remove('hidden');
                item.style.animation = `fadeInUp 0.6s ease-out ${index * 0.1}s both`;
            }, index * 50);
        } else {
            // Hide item
            item.classList.add('hidden');
        }
    });
    
    // Update results count
    updateResultsCount(filter, items);
}

function updateResultsCount(filter, items) {
    const visibleItems = Array.from(items).filter(item => !item.classList.contains('hidden'));
    const resultsText = document.querySelector('.results-count');
    
    if (resultsText) {
        const count = visibleItems.length;
        const filterName = filter === 'all' ? 'All Projects' : filter.charAt(0).toUpperCase() + filter.slice(1);
        resultsText.textContent = `Showing ${count} ${filterName}`;
    }
}

// Auto-scrolling Video Carousel
function initVideoCarousel() {
    const carousel = document.querySelector('.video-carousel');
    const carouselContainer = document.querySelector('.video-carousel-container');
    
    if (!carousel || !carouselContainer) return;
    
    // Clone video items for seamless loop
    const videoItems = carousel.querySelectorAll('.video-item');
    videoItems.forEach(item => {
        const clone = item.cloneNode(true);
        carousel.appendChild(clone);
    });
    
    let isHovered = false;
    let animationPaused = false;
    
    // Pause animation on hover
    carouselContainer.addEventListener('mouseenter', function() {
        isHovered = true;
        carousel.style.animationPlayState = 'paused';
    });
    
    // Resume animation when not hovering
    carouselContainer.addEventListener('mouseleave', function() {
        isHovered = false;
        if (!animationPaused) {
            carousel.style.animationPlayState = 'running';
        }
    });
    
    // Add click handlers to video placeholders
    const videoPlaceholders = carousel.querySelectorAll('.video-item');
    videoPlaceholders.forEach((placeholder, index) => {
        placeholder.addEventListener('click', function() {
            openVideoModal(index);
        });
        
        // Add keyboard support
        placeholder.setAttribute('tabindex', '0');
        placeholder.setAttribute('role', 'button');
        placeholder.setAttribute('aria-label', `Play video ${index + 1}`);
        
        placeholder.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                openVideoModal(index);
            }
        });
    });
    
    // Adjust animation speed based on screen size
    adjustCarouselSpeed();
    window.addEventListener('resize', debounce(adjustCarouselSpeed, 250));
}

function adjustCarouselSpeed() {
    const carousel = document.querySelector('.video-carousel');
    if (!carousel) return;
    
    const screenWidth = window.innerWidth;
    let duration;
    
    if (screenWidth < 640) {
        duration = '12s';
    } else if (screenWidth < 768) {
        duration = '15s';
    } else {
        duration = '20s';
    }
    
    carousel.style.animationDuration = duration;
}

function openVideoModal(videoIndex) {
    // Create modal for video playback
    const modal = createVideoModal(videoIndex);
    document.body.appendChild(modal);
    
    // Prevent body scroll
    document.body.style.overflow = 'hidden';
    
    // Focus management
    modal.focus();
    
    // Close modal handlers
    const closeBtn = modal.querySelector('.close-modal');
    const overlay = modal.querySelector('.modal-overlay');
    
    closeBtn.addEventListener('click', closeVideoModal);
    overlay.addEventListener('click', closeVideoModal);
    
    // Keyboard handling
    modal.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            closeVideoModal();
        }
    });
}

function createVideoModal(videoIndex) {
    const modal = document.createElement('div');
    modal.className = 'video-modal fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50';
    modal.setAttribute('tabindex', '-1');
    modal.setAttribute('role', 'dialog');
    modal.setAttribute('aria-modal', 'true');
    modal.setAttribute('aria-label', 'Video player');
    
    modal.innerHTML = `
        <div class="modal-overlay absolute inset-0"></div>
        <div class="modal-content relative bg-white rounded-lg max-w-4xl w-full mx-4 overflow-hidden">
            <div class="flex justify-between items-center p-4 border-b">
                <h3 class="text-xl font-semibold">Project Video ${videoIndex + 1}</h3>
                <button class="close-modal text-gray-500 hover:text-gray-700 text-2xl">
                    <i class="fas fa-times"></i>
                </button>
            </div>
            <div class="p-4">
                <div class="aspect-video bg-gray-900 rounded-lg flex items-center justify-center">
                    <div class="text-center text-white">
                        <i class="fas fa-play-circle text-6xl mb-4 opacity-70"></i>
                        <h4 class="text-xl font-semibold mb-2">Video Placeholder</h4>
                        <p class="text-gray-300">Ready for video upload</p>
                        <div class="mt-6">
                            <button class="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium">
                                Upload Video
                            </button>
                        </div>
                    </div>
                </div>
                <div class="mt-4">
                    <h4 class="font-semibold text-lg mb-2">Project Details</h4>
                    <p class="text-gray-600">This video showcases the features and functionality of our web development project. Upload your project video to display it here.</p>
                </div>
            </div>
        </div>
    `;
    
    return modal;
}

function closeVideoModal() {
    const modal = document.querySelector('.video-modal');
    if (modal) {
        modal.remove();
        document.body.style.overflow = '';
    }
}

// Portfolio Search Functionality
function initPortfolioSearch() {
    const searchInput = document.querySelector('.portfolio-search');
    if (!searchInput) return;
    
    searchInput.addEventListener('input', debounce(function(e) {
        const searchTerm = e.target.value.toLowerCase();
        const portfolioItems = document.querySelectorAll('.portfolio-item');
        
        portfolioItems.forEach(item => {
            const title = item.querySelector('h3').textContent.toLowerCase();
            const description = item.querySelector('p').textContent.toLowerCase();
            const tags = Array.from(item.querySelectorAll('.tag')).map(tag => tag.textContent.toLowerCase());
            
            const matches = title.includes(searchTerm) || 
                          description.includes(searchTerm) || 
                          tags.some(tag => tag.includes(searchTerm));
            
            if (matches || searchTerm === '') {
                item.classList.remove('hidden');
            } else {
                item.classList.add('hidden');
            }
        });
        
        // Update results count
        updateSearchResults(searchTerm);
    }, 300));
}

function updateSearchResults(searchTerm) {
    const visibleItems = document.querySelectorAll('.portfolio-item:not(.hidden)');
    const resultsCount = document.querySelector('.search-results-count');
    
    if (resultsCount) {
        if (searchTerm) {
            resultsCount.textContent = `Found ${visibleItems.length} results for "${searchTerm}"`;
        } else {
            resultsCount.textContent = '';
        }
    }
}

// Portfolio Item Hover Effects
function initPortfolioHoverEffects() {
    const portfolioItems = document.querySelectorAll('.portfolio-item');
    
    portfolioItems.forEach(item => {
        const image = item.querySelector('img');
        const overlay = document.createElement('div');
        overlay.className = 'absolute inset-0 bg-black bg-opacity-50 opacity-0 transition-opacity duration-300 flex items-center justify-center';
        overlay.innerHTML = `
            <div class="text-center text-white">
                <i class="fas fa-eye text-3xl mb-2"></i>
                <p class="font-semibold">View Project</p>
            </div>
        `;
        
        if (image) {
            image.parentElement.style.position = 'relative';
            image.parentElement.appendChild(overlay);
        }
        
        item.addEventListener('mouseenter', function() {
            overlay.classList.remove('opacity-0');
            overlay.classList.add('opacity-100');
        });
        
        item.addEventListener('mouseleave', function() {
            overlay.classList.remove('opacity-100');
            overlay.classList.add('opacity-0');
        });
    });
}

// Portfolio Loading Animation
function showPortfolioLoader() {
    const portfolioGrid = document.querySelector('.portfolio-grid');
    if (!portfolioGrid) return;
    
    const loader = document.createElement('div');
    loader.className = 'portfolio-loader text-center py-20';
    loader.innerHTML = `
        <div class="spinner mx-auto mb-4"></div>
        <p class="text-gray-600">Loading portfolio items...</p>
    `;
    
    portfolioGrid.appendChild(loader);
    
    // Simulate loading delay
    setTimeout(() => {
        loader.remove();
    }, 1000);
}

// Initialize additional portfolio features
function initAdvancedPortfolioFeatures() {
    initPortfolioSearch();
    initPortfolioHoverEffects();
    
    // Initialize lightbox for portfolio images
    initPortfolioLightbox();
    
    // Initialize lazy loading for portfolio images
    initLazyLoading();
}

// Portfolio Lightbox
function initPortfolioLightbox() {
    const portfolioImages = document.querySelectorAll('.portfolio-item img');
    
    portfolioImages.forEach((img, index) => {
        img.addEventListener('click', function(e) {
            e.preventDefault();
            openLightbox(img.src, img.alt, index);
        });
        
        img.style.cursor = 'pointer';
        img.setAttribute('title', 'Click to view larger image');
    });
}

function openLightbox(imageSrc, imageAlt, currentIndex) {
    const lightbox = document.createElement('div');
    lightbox.className = 'lightbox fixed inset-0 bg-black bg-opacity-95 flex items-center justify-center z-50';
    lightbox.innerHTML = `
        <div class="lightbox-content relative max-w-7xl w-full mx-4">
            <button class="absolute top-4 right-4 text-white text-3xl hover:text-gray-300 z-10">
                <i class="fas fa-times"></i>
            </button>
            <img src="${imageSrc}" alt="${imageAlt}" class="w-full h-auto max-h-screen object-contain">
            <div class="absolute bottom-4 left-4 text-white">
                <p class="text-sm opacity-80">${imageAlt}</p>
            </div>
        </div>
    `;
    
    document.body.appendChild(lightbox);
    document.body.style.overflow = 'hidden';
    
    // Close lightbox handlers
    const closeBtn = lightbox.querySelector('button');
    closeBtn.addEventListener('click', closeLightbox);
    
    lightbox.addEventListener('click', function(e) {
        if (e.target === lightbox) {
            closeLightbox();
        }
    });
    
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            closeLightbox();
        }
    });
}

function closeLightbox() {
    const lightbox = document.querySelector('.lightbox');
    if (lightbox) {
        lightbox.remove();
        document.body.style.overflow = '';
    }
}

// Lazy Loading for Portfolio Images
function initLazyLoading() {
    const images = document.querySelectorAll('.portfolio-item img[data-src]');
    
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    img.classList.remove('lazy');
                    imageObserver.unobserve(img);
                }
            });
        });
        
        images.forEach(img => imageObserver.observe(img));
    } else {
        // Fallback for browsers without IntersectionObserver
        images.forEach(img => {
            img.src = img.dataset.src;
        });
    }
}

// Utility function (if not available from main.js)
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// CSS for portfolio animations
const portfolioCSS = `
.spinner {
    width: 40px;
    height: 40px;
    border: 4px solid #f3f3f3;
    border-top: 4px solid #3b82f6;
    border-radius: 50%;
    animation: spin 1s linear infinite;
}

@keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
}

.lazy {
    opacity: 0;
    transition: opacity 0.3s;
}

.lazy.loaded {
    opacity: 1;
}

.lightbox {
    animation: fadeIn 0.3s ease-out;
}

@keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
}
`;

// Inject portfolio-specific CSS
const portfolioStyle = document.createElement('style');
portfolioStyle.textContent = portfolioCSS;
document.head.appendChild(portfolioStyle);

// Initialize advanced features on load
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initAdvancedPortfolioFeatures);
} else {
    initAdvancedPortfolioFeatures();
}

// Export functions for external use
window.WebDuosPortfolio = {
    filterPortfolioItems,
    openVideoModal,
    closeVideoModal,
    openLightbox,
    closeLightbox
};
