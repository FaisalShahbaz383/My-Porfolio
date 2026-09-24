/**
 * ==========================================================================
 * MUHAMMAD FAISAL - PORTFOLIO INTERACTION SCRIPT
 * Senior Frontend Engineer Clean Architecture
 * Features:
 * - Mobile navigation menu toggle (open/close with hamburger button)
 * - Auto-close mobile menu when section link is clicked
 * - Close mobile menu when clicking outside or pressing Escape
 * - Header styling and subtle elevation on scroll
 * - Active navigation link state synchronization via IntersectionObserver
 * - Dynamic copyright year
 * ==========================================================================
 */

document.addEventListener('DOMContentLoaded', () => {
  'use strict';

  // Core DOM Element Selectors
  const header = document.getElementById('header');
  const navToggle = document.getElementById('nav-toggle') || document.querySelector('.mobile-toggle') || document.querySelector('.hamburger-btn');
  const navMenu = document.getElementById('nav-menu') || document.querySelector('.nav-links');
  const navLinks = document.querySelectorAll('.nav-link');
  const sections = document.querySelectorAll('section[id]');
  const yearElement = document.getElementById('current-year');
  const navLinksList = document.querySelector('.nav-links');

  // Set current year dynamically in footer
  if (yearElement) {
    yearElement.textContent = new Date().getFullYear();
  }

  /* --------------------------------------------------------------------------
     1. MOBILE NAVIGATION MENU TOGGLE & ACCESSIBILITY
     -------------------------------------------------------------------------- */
  if (navToggle && navMenu) {
    /**
     * Toggles the mobile menu open/closed state
     * @param {boolean} shouldOpen - Desired menu open state
     */
    const toggleMenu = (shouldOpen) => {
      if (shouldOpen) {
        navMenu.classList.add('is-open', 'active');
        navToggle.classList.add('is-active', 'active');
        navToggle.setAttribute('aria-expanded', 'true');
        if (navLinksList && navLinksList !== navMenu) {
          navLinksList.classList.add('is-open', 'active');
        }
        document.body.style.overflow = 'hidden'; // Prevent background scrolling when menu is open on mobile
      } else {
        navMenu.classList.remove('is-open', 'active');
        navToggle.classList.remove('is-active', 'active');
        navToggle.setAttribute('aria-expanded', 'false');
        if (navLinksList && navLinksList !== navMenu) {
          navLinksList.classList.remove('is-open', 'active');
        }
        document.body.style.overflow = '';
      }
    };

    // Toggle menu when clicking the hamburger button
    navToggle.addEventListener('click', (event) => {
      event.stopPropagation();
      const isOpen = navMenu.classList.contains('is-open') || navMenu.classList.contains('active');
      toggleMenu(!isOpen);
    });

    // Auto-close menu when clicking any section anchor link
    navLinks.forEach((link) => {
      link.addEventListener('click', () => {
        if (navMenu.classList.contains('is-open') || navMenu.classList.contains('active')) {
          toggleMenu(false);
        }
      });
    });

    // Close menu when clicking outside the navigation container
    document.addEventListener('click', (event) => {
      if (
        (navMenu.classList.contains('is-open') || navMenu.classList.contains('active')) &&
        !navMenu.contains(event.target) &&
        !navToggle.contains(event.target)
      ) {
        toggleMenu(false);
      }
    });

    // Close menu gracefully when pressing the Escape key
    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape' && (navMenu.classList.contains('is-open') || navMenu.classList.contains('active'))) {
        toggleMenu(false);
        navToggle.focus();
      }
    });

    // Ensure body scroll is reset if user resizes window to desktop view
    window.addEventListener('resize', () => {
      if (window.innerWidth > 768 && (navMenu.classList.contains('is-open') || navMenu.classList.contains('active'))) {
        toggleMenu(false);
      }
    });
  }

  /* --------------------------------------------------------------------------
     2. HEADER SCROLL ELEVATION
     -------------------------------------------------------------------------- */
  const handleScrollHeader = () => {
    if (header) {
      if (window.scrollY >= 40) {
        header.classList.add('scrolled');
      } else {
        header.classList.remove('scrolled');
      }
    }
  };

  window.addEventListener('scroll', handleScrollHeader, { passive: true });
  handleScrollHeader(); // Run on initial page load

  /* --------------------------------------------------------------------------
     3. ACTIVE NAVIGATION LINK ON SCROLL (INTERSECTION OBSERVER)
     -------------------------------------------------------------------------- */
  if ('IntersectionObserver' in window && sections.length > 0) {
    const observerOptions = {
      root: null,
      rootMargin: '-25% 0px -65% 0px',
      threshold: 0
    };

    const sectionObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const sectionId = entry.target.getAttribute('id');
          navLinks.forEach((link) => {
            const linkTarget = link.getAttribute('href');
            if (linkTarget === `#${sectionId}`) {
              link.classList.add('active-link');
            } else {
              link.classList.remove('active-link');
            }
          });
        }
      });
    }, observerOptions);

    sections.forEach((section) => {
      sectionObserver.observe(section);
    });
  }
});
