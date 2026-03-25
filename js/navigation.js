/**
 * Hamburger Menu Navigation
 * Adapted from mldangelo template for vanilla JavaScript
 */

(function() {
  'use strict';

  const MENU_ID = 'mobile-nav-menu';
  const FOCUSABLE_SELECTOR = 'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])';

  let isOpen = false;
  let previousActiveElement = null;
  let savedScrollY = 0;

  // Get DOM elements
  const hamburgerButton = document.getElementById('hamburger-button');
  const hamburgerIcon = document.getElementById('hamburger-icon');
  const slideMenu = document.getElementById(MENU_ID);
  const slideMenuOverlay = document.getElementById('slide-menu-overlay');
  const menuLinks = document.querySelectorAll('.hamburger-ul a');

  if (!hamburgerButton || !slideMenu || !slideMenuOverlay) {
    console.warn('Hamburger menu elements not found');
    return;
  }

  /**
   * Toggle menu open/close
   */
  function toggleMenu() {
    isOpen = !isOpen;
    updateMenuState();
  }

  /**
   * Close the menu
   */
  function closeMenu() {
    if (!isOpen) return;
    isOpen = false;
    updateMenuState();
  }

  /**
   * Update DOM based on menu state
   */
  function updateMenuState() {
    // Update ARIA attributes
    hamburgerButton.setAttribute('aria-expanded', isOpen);
    slideMenu.setAttribute('aria-hidden', !isOpen);

    // Toggle CSS classes
    if (isOpen) {
      hamburgerIcon.classList.add('hamburger-icon--open');
      slideMenu.classList.add('slide-menu--open');
      slideMenuOverlay.classList.add('slide-menu-overlay--open');
      lockBodyScroll();
      trapFocus();
    } else {
      hamburgerIcon.classList.remove('hamburger-icon--open');
      slideMenu.classList.remove('slide-menu--open');
      slideMenuOverlay.classList.remove('slide-menu-overlay--open');
      unlockBodyScroll();
      restoreFocus();
    }
  }

  /**
   * Lock body scroll (iOS-safe)
   */
  function lockBodyScroll() {
    savedScrollY = window.scrollY;
    document.body.style.position = 'fixed';
    document.body.style.top = `-${savedScrollY}px`;
    document.body.style.left = '0';
    document.body.style.right = '0';
  }

  /**
   * Unlock body scroll
   */
  function unlockBodyScroll() {
    document.body.style.position = '';
    document.body.style.top = '';
    document.body.style.left = '';
    document.body.style.right = '';
    window.scrollTo(0, savedScrollY);
  }

  /**
   * Trap focus within menu and save previous focus
   */
  function trapFocus() {
    // Save currently focused element
    previousActiveElement = document.activeElement;

    // Focus first focusable element in menu
    const focusableElements = slideMenu.querySelectorAll(FOCUSABLE_SELECTOR);
    if (focusableElements.length > 0) {
      focusableElements[0].focus();
    }
  }

  /**
   * Restore focus to previously focused element
   */
  function restoreFocus() {
    if (previousActiveElement && previousActiveElement.focus) {
      previousActiveElement.focus();
      previousActiveElement = null;
    }
  }

  /**
   * Handle tab key for focus trapping
   */
  function handleTabKey(e) {
    if (!isOpen || e.key !== 'Tab') return;

    const focusableElements = slideMenu.querySelectorAll(FOCUSABLE_SELECTOR);
    if (focusableElements.length === 0) return;

    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];

    // Shift + Tab on first element -> go to last
    if (e.shiftKey && document.activeElement === firstElement) {
      e.preventDefault();
      lastElement.focus();
    }
    // Tab on last element -> go to first
    else if (!e.shiftKey && document.activeElement === lastElement) {
      e.preventDefault();
      firstElement.focus();
    }
  }

  /**
   * Handle escape key to close menu
   */
  function handleEscapeKey(e) {
    if (isOpen && e.key === 'Escape') {
      e.preventDefault();
      closeMenu();
    }
  }

  // Event listeners
  hamburgerButton.addEventListener('click', toggleMenu);
  slideMenuOverlay.addEventListener('click', closeMenu);
  document.addEventListener('keydown', handleEscapeKey);
  document.addEventListener('keydown', handleTabKey);

  // Close menu when clicking a link
  menuLinks.forEach(link => {
    link.addEventListener('click', closeMenu);
  });

  // Prevent scroll on menu when using touch
  slideMenu.addEventListener('touchmove', function(e) {
    e.stopPropagation();
  }, { passive: true });

})();
