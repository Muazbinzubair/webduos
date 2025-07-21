// Main JavaScript functionality for WebDuos website
// Handles navigation, mobile menu, scroll effects, and general interactions

document.addEventListener('DOMContentLoaded', function() {
    // Initialize all main functionality
    initMobileNavigation();
    initScrollEffects();
    initScrollToTop();
    initAnimations();
    initGeneralInteractions();
});

// Mobile Navigation
function initMobileNavigation() {
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const mobileMenu = document.querySelector('.mobile-menu');
    
    if (mobileMenuBtn && mobileMenu) {
        mobileMenuBtn.addEventListener('click', function() {
            toggleMobileMenu();
        });
        
        // Close mobile menu when clicking outside
        document.addEventListener('click', function(e) {
            if (!mobileMenuBtn.contains(e.target) && !mobileMenu.contains(e.target)) {
                closeMobileMenu();
            }
        });
        
        // Close mobile menu when window is resized to desktop
        window.addEventListener('resize', function() {
            if (window.innerWidth >= 768) {
                closeMobileMenu();
            }
        });
    }
}

function toggleMobileMenu() {
    const mobileMenu = document.querySelector('.mobile-menu');
    const menuIcon = document.querySelector('.mobile-menu-btn i');
    
    if (mobileMenu.classList.contains('hidden')) {
        openMobileMenu();
    } else {
        closeMobileMenu();
    }
}

function openMobileMenu() {
    const mobileMenu = document.querySelector('.mobile-menu');
    const menuIcon = document.querySelector('.mobile-menu-btn i');
    
    mobileMenu.classList.remove('hidden');
    mobileMenu.classList.add('show');
    menuIcon.classList.remove('fa-bars');
    menuIcon.classList.add('fa-times');
    
    // Prevent body scroll when menu is open
    document.body.style.overflow = 'hidden';
}

function closeMobileMenu() {
    const mobileMenu = document.querySelector('.mobile-menu');
    const menuIcon = document.querySelector('.mobile-menu-btn i');
    
    mobileMenu.classList.add('hidden');
    mobileMenu.classList.remove('show');
    menuIcon.classList.remove('fa-times');
    menuIcon.classList.add('fa-bars');
    
    // Restore body scroll
    document.body.style.overflow = '';
}

// Smooth page transitions
document.addEventListener('DOMContentLoaded', function() {
    // Add page transition class to body
    document.body.classList.add('page-transition');
    
    // Handle all internal links
    document.querySelectorAll('a[href^="#"], a[href^="/"], a[href^="."]').forEach(link => {
        if (link.href.includes(window.location.origin)) {
            link.addEventListener('click', function(e) {
                // Don't intercept if it's a target blank or has a special class
                if (this.target === '_blank' || this.classList.contains('no-transition')) {
                    return;
                }
                
                e.preventDefault();
                const href = this.getAttribute('href');
                
                // Add fade-out animation
                document.body.classList.remove('page-transition');
                document.body.classList.add('page-transition-out');
                
                // Navigate after animation completes
                setTimeout(() => {
                    if (href.startsWith('#')) {
                        // Handle anchor links
                        const target = document.querySelector(href);
                        if (target) {
                            target.scrollIntoView({ behavior: 'smooth' });
                        }
                        document.body.classList.remove('page-transition-out');
                        document.body.classList.add('page-transition');
                    } else {
                        // Handle page transitions
                        window.location.href = href;
                    }
                }, 300);
            });
        }
    });
    
    // Add hover effects to all buttons
    document.querySelectorAll('button, .btn, [class*="btn-"]').forEach(button => {
        button.addEventListener('mouseenter', function() {
            this.classList.add('hover');
        });
        button.addEventListener('mouseleave', function() {
            this.classList.remove('hover');
        });
    });
    
    // Add animation to hero section elements
    const heroElements = document.querySelectorAll('.hero-section h1, .hero-section p, .hero-section .cta-button');
    heroElements.forEach((el, index) => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.animation = `fadeInUp 0.5s ease-out ${index * 0.2}s forwards`;
    });
});

// Scroll Effects
function initScrollEffects() {
    // Smooth scrolling for anchor links
    const anchorLinks = document.querySelectorAll('a[href^="#"]');
    anchorLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href').substring(1);
            const targetElement = document.getElementById(targetId);
            
            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
                
                // Close mobile menu if open
                closeMobileMenu();
            }
        });
    });
    
    // Navbar scroll effect
    const navbar = document.querySelector('nav');
    if (navbar) {
        window.addEventListener('scroll', function() {
            if (window.scrollY > 100) {
                navbar.classList.add('scrolled');
            } else {
                navbar.classList.remove('scrolled');
            }
        });
    }
    
    // Parallax effect for hero sections
    const heroSections = document.querySelectorAll('.hero-section');
    heroSections.forEach(section => {
        window.addEventListener('scroll', function() {
            const scrolled = window.pageYOffset;
            const parallax = section.querySelector('.parallax-bg');
            if (parallax) {
                parallax.style.transform = `translateY(${scrolled * 0.5}px)`;
            }
        });
    });
}

// Scroll to Top Button
function initScrollToTop() {
    // Create scroll to top button
    const scrollToTopBtn = document.createElement('button');
    scrollToTopBtn.className = 'scroll-to-top';
    scrollToTopBtn.innerHTML = '<i class="fas fa-chevron-up"></i>';
    scrollToTopBtn.setAttribute('aria-label', 'Scroll to top');
    document.body.appendChild(scrollToTopBtn);
    
    // Show/hide scroll to top button
    window.addEventListener('scroll', function() {
        if (window.pageYOffset > 300) {
            scrollToTopBtn.classList.add('show');
        } else {
            scrollToTopBtn.classList.remove('show');
        }
    });
    
    // Scroll to top functionality
    scrollToTopBtn.addEventListener('click', function() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

// Animation on Scroll
function initAnimations() {
    // Intersection Observer for fade-in animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-fade-in');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    // Observe elements for animation
    const animateElements = document.querySelectorAll('.service-card, .portfolio-item, .timeline-item, .team-member');
    animateElements.forEach(el => {
        observer.observe(el);
    });
    
    // Counter animation for statistics
    const counters = document.querySelectorAll('[data-counter]');
    const counterObserver = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateCounter(entry.target);
                counterObserver.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    counters.forEach(counter => {
        counterObserver.observe(counter);
    });
}

function animateCounter(element) {
    const target = parseInt(element.textContent.replace(/[^\d]/g, ''));
    const duration = 2000; // 2 seconds
    const increment = target / (duration / 16); // 60fps
    let current = 0;
    
    const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
            current = target;
            clearInterval(timer);
        }
        
        // Format number based on original text
        const originalText = element.textContent;
        if (originalText.includes('+')) {
            element.textContent = Math.floor(current) + '+';
        } else if (originalText.includes('%')) {
            element.textContent = Math.floor(current) + '%';
        } else {
            element.textContent = Math.floor(current);
        }
    }, 16);
}

// General Interactions
function initGeneralInteractions() {
    // Hover effects for interactive elements
    const interactiveElements = document.querySelectorAll('.service-card, .portfolio-item, .team-member, .cta-button');
    
    interactiveElements.forEach(element => {
        element.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-10px)';
        });
        
        element.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
        });
    });
    
    // Add ripple effect to buttons
    const buttons = document.querySelectorAll('button, .btn, .cta-button');
    buttons.forEach(button => {
        button.addEventListener('click', createRipple);
    });
    
    // Preload images for better performance
    preloadImages();
    
    // Handle external links
    const externalLinks = document.querySelectorAll('a[href^="http"]:not([href*="webduos.com"])');
    externalLinks.forEach(link => {
        link.setAttribute('target', '_blank');
        link.setAttribute('rel', 'noopener noreferrer');
    });
}

function createRipple(event) {
    const button = event.currentTarget;
    const circle = document.createElement('span');
    const diameter = Math.max(button.clientWidth, button.clientHeight);
    const radius = diameter / 2;
    
    circle.style.width = circle.style.height = `${diameter}px`;
    circle.style.left = `${event.clientX - button.offsetLeft - radius}px`;
    circle.style.top = `${event.clientY - button.offsetTop - radius}px`;
    circle.classList.add('ripple');
    
    const ripple = button.getElementsByClassName('ripple')[0];
    if (ripple) {
        ripple.remove();
    }
    
    button.appendChild(circle);
    
    // Remove ripple after animation
    setTimeout(() => {
        circle.remove();
    }, 600);
}

function preloadImages() {
    const images = [
        'https://pixabay.com/get/g28099086eab10fe192dc4ed4401579e210126c9575dcc620971c82f48e564f0f5b88bbc1399673e1c85dd232797e3608a8cb27255889de006a673f29c817ef18_1280.png',
        'https://pixabay.com/get/gca7304527fca0c9d8a31c7cc9a422b1559d5361928188f9a801cea078f23cdf1f6eac233e178a031687ed85d4040c69351b9eca84288536df86fa1048a452e25_1280.jpg',
        'https://pixabay.com/get/g14e7e5f9d00a38397033547f645e934e87c9c3cc0abf89fc6dcafb08dc42ed65c9207c1d7b28ffa04d933e1e9d5bcdc9733f45b83e89dcff8aaa9b3cce77074f_1280.jpg'
    ];
    
    images.forEach(src => {
        const img = new Image();
        img.src = src;
    });
}

// Utility functions
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

function throttle(func, limit) {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

// Error handling
window.addEventListener('error', function(e) {
    console.error('JavaScript error:', e.error);
    // In production, you might want to send this to an error tracking service
});

// Performance monitoring
window.addEventListener('load', function() {
    // Log page load time for optimization
    const loadTime = performance.timing.loadEventEnd - performance.timing.navigationStart;
    console.log('Page load time:', loadTime + 'ms');
});

// Accessibility improvements
document.addEventListener('keydown', function(e) {
    // Close mobile menu with Escape key
    if (e.key === 'Escape') {
        closeMobileMenu();
    }
    
    // Skip to main content with Tab
    if (e.key === 'Tab' && e.target.tagName === 'BODY') {
        const mainContent = document.querySelector('main') || document.querySelector('.hero-section');
        if (mainContent) {
            mainContent.focus();
        }
    }
});

// Add CSS for ripple effect
const rippleCSS = `
.ripple {
    position: absolute;
    border-radius: 50%;
    background-color: rgba(255, 255, 255, 0.4);
    transform: scale(0);
    animation: ripple-animation 0.6s linear;
    pointer-events: none;
}

@keyframes ripple-animation {
    to {
        transform: scale(4);
        opacity: 0;
    }
}

.animate-fade-in {
    animation: fadeInUp 0.6s ease-out;
}

@keyframes fadeInUp {
    from {
        opacity: 0;
        transform: translateY(30px);
    }
    to {
        opacity: 1;
        transform: translateY(0);
    }
}

nav.scrolled {
    background-color: rgba(255, 255, 255, 0.95);
    backdrop-filter: blur(10px);
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
}
`;

// Inject CSS
const style = document.createElement('style');
style.textContent = rippleCSS;
document.head.appendChild(style);

// Export functions for use in other scripts
window.WebDuosMain = {
    toggleMobileMenu,
    closeMobileMenu,
    createRipple,
    debounce,
    throttle
};