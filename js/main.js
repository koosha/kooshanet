/**
 * Main JavaScript for Personal Website
 * Handles navigation, scroll effects, and interactions
 */

// ============================================
// NAVIGATION
// ============================================

class Navigation {
    constructor() {
        this.header = document.querySelector('.header');
        this.nav = document.querySelector('.nav');
        this.navToggle = document.querySelector('.nav__toggle');
        this.navMenu = document.querySelector('.nav__menu');
        this.navLinks = document.querySelectorAll('.nav__link');

        this.init();
    }

    init() {
        // Mobile menu toggle
        if (this.navToggle) {
            this.navToggle.addEventListener('click', () => this.toggleMenu());
        }

        // Close menu when clicking a link
        this.navLinks.forEach(link => {
            link.addEventListener('click', () => {
                if (this.navMenu.classList.contains('active')) {
                    this.toggleMenu();
                }
            });
        });

        // Scroll effects
        window.addEventListener('scroll', () => this.handleScroll());

        // Set active link based on current page
        this.setActiveLink();

        // Close menu when clicking outside
        document.addEventListener('click', (e) => {
            if (!this.nav.contains(e.target) && this.navMenu.classList.contains('active')) {
                this.toggleMenu();
            }
        });
    }

    toggleMenu() {
        this.navMenu.classList.toggle('active');
        this.navToggle.classList.toggle('active');

        // Prevent body scroll when menu is open
        document.body.style.overflow = this.navMenu.classList.contains('active') ? 'hidden' : '';
    }

    handleScroll() {
        const scrollY = window.scrollY;

        // Add shadow to header on scroll
        if (scrollY > 50) {
            this.header.classList.add('scrolled');
        } else {
            this.header.classList.remove('scrolled');
        }
    }

    setActiveLink() {
        const currentPath = window.location.pathname;

        this.navLinks.forEach(link => {
            const linkPath = new URL(link.href).pathname;

            if (linkPath === currentPath ||
                (currentPath === '/' && linkPath === '/index.html') ||
                (currentPath === '/index.html' && linkPath === '/')) {
                link.classList.add('active');
            } else {
                link.classList.remove('active');
            }
        });
    }
}

// ============================================
// SCROLL REVEAL ANIMATIONS
// ============================================

class ScrollReveal {
    constructor() {
        this.revealElements = document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .reveal-scale');
        this.init();
    }

    init() {
        // Initial check
        this.checkVisibility();

        // Check on scroll
        window.addEventListener('scroll', () => this.checkVisibility());

        // Check on resize
        window.addEventListener('resize', () => this.checkVisibility());
    }

    checkVisibility() {
        const windowHeight = window.innerHeight;
        const triggerPoint = windowHeight * 0.85;

        this.revealElements.forEach(element => {
            const elementTop = element.getBoundingClientRect().top;

            if (elementTop < triggerPoint) {
                element.classList.add('active');
            }
        });
    }
}

// ============================================
// SMOOTH SCROLL
// ============================================

class SmoothScroll {
    constructor() {
        this.links = document.querySelectorAll('a[href^="#"]');
        this.init();
    }

    init() {
        this.links.forEach(link => {
            link.addEventListener('click', (e) => {
                const href = link.getAttribute('href');

                // Only handle internal anchor links
                if (href !== '#' && href.startsWith('#')) {
                    e.preventDefault();
                    const target = document.querySelector(href);

                    if (target) {
                        const headerHeight = document.querySelector('.header')?.offsetHeight || 0;
                        const targetPosition = target.offsetTop - headerHeight - 20;

                        window.scrollTo({
                            top: targetPosition,
                            behavior: 'smooth'
                        });
                    }
                }
            });
        });
    }
}

// ============================================
// FORM HANDLER (for contact page)
// ============================================

class FormHandler {
    constructor() {
        this.forms = document.querySelectorAll('.contact-form');
        this.init();
    }

    init() {
        this.forms.forEach(form => {
            form.addEventListener('submit', (e) => this.handleSubmit(e, form));
        });
    }

    async handleSubmit(e, form) {
        e.preventDefault();

        const submitBtn = form.querySelector('[type="submit"]');
        const originalText = submitBtn.textContent;

        try {
            // Show loading state
            submitBtn.textContent = 'Sending...';
            submitBtn.disabled = true;

            // Get form data
            const formData = new FormData(form);
            const data = Object.fromEntries(formData.entries());

            // Here you would typically send to a backend
            // For now, just simulate success
            await new Promise(resolve => setTimeout(resolve, 1000));

            // Show success message
            this.showMessage(form, 'Message sent successfully!', 'success');
            form.reset();

        } catch (error) {
            console.error('Form submission error:', error);
            this.showMessage(form, 'Failed to send message. Please try again.', 'error');
        } finally {
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;
        }
    }

    showMessage(form, message, type) {
        // Remove existing messages
        const existingMessage = form.querySelector('.form-message');
        if (existingMessage) {
            existingMessage.remove();
        }

        // Create new message
        const messageDiv = document.createElement('div');
        messageDiv.className = `form-message form-message--${type} fade-in`;
        messageDiv.textContent = message;
        messageDiv.style.cssText = `
            padding: 1rem;
            margin-top: 1rem;
            border-radius: 0.5rem;
            text-align: center;
            font-weight: 600;
            ${type === 'success'
                ? 'background-color: #d1fae5; color: #065f46;'
                : 'background-color: #fee2e2; color: #991b1b;'
            }
        `;

        form.appendChild(messageDiv);

        // Remove message after 5 seconds
        setTimeout(() => messageDiv.remove(), 5000);
    }
}

// ============================================
// LAZY LOADING IMAGES
// ============================================

class LazyLoader {
    constructor() {
        this.images = document.querySelectorAll('img[data-src]');
        this.init();
    }

    init() {
        if ('IntersectionObserver' in window) {
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

            this.images.forEach(img => imageObserver.observe(img));
        } else {
            // Fallback for older browsers
            this.images.forEach(img => {
                img.src = img.dataset.src;
            });
        }
    }
}

// ============================================
// UTILITIES
// ============================================

const Utils = {
    // Debounce function for performance
    debounce(func, wait = 100) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    },

    // Throttle function for scroll events
    throttle(func, limit = 100) {
        let inThrottle;
        return function(...args) {
            if (!inThrottle) {
                func.apply(this, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    },

    // Check if element is in viewport
    isInViewport(element) {
        const rect = element.getBoundingClientRect();
        return (
            rect.top >= 0 &&
            rect.left >= 0 &&
            rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
            rect.right <= (window.innerWidth || document.documentElement.clientWidth)
        );
    },

    // Get scroll percentage
    getScrollPercentage() {
        const windowHeight = window.innerHeight;
        const documentHeight = document.documentElement.scrollHeight - windowHeight;
        const scrolled = window.scrollY;
        return (scrolled / documentHeight) * 100;
    }
};

// ============================================
// INITIALIZATION
// ============================================

document.addEventListener('DOMContentLoaded', () => {
    // Initialize all components
    new Navigation();
    new ScrollReveal();
    new SmoothScroll();
    new FormHandler();
    new LazyLoader();

    // Add page transition class
    document.body.classList.add('page-transition');

    // Log initialization (remove in production)
    console.log('✨ Website initialized successfully');
});

// ============================================
// EXPORT FOR POTENTIAL MODULE USE
// ============================================

if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        Navigation,
        ScrollReveal,
        SmoothScroll,
        FormHandler,
        LazyLoader,
        Utils
    };
}
