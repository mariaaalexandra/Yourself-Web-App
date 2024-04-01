import { Component, HostListener, OnInit } from '@angular/core';
import AOS from 'aos';
import Swiper from 'swiper'; // Import Swiper
import Isotope from 'isotope-layout';

import GLightbox from 'glightbox';
import { ViewEncapsulation } from '@angular/core';
import { NgIf } from '@angular/common';

@Component({
    selector: 'app-start-page',
    standalone: true,
    imports: [NgIf],
    templateUrl: './index.html',
    styleUrl: './start-page.component.css',
    encapsulation: ViewEncapsulation.Emulated
  })

  export class StartPageComponent implements OnInit {

    checkLoginStatus(): boolean {
        return localStorage.getItem('isLoggedIn') === 'etru';
    }


    ngOnInit(): void {
      // Initialize AOS (Animate On Scroll) library with a duration of 1000 milliseconds
      AOS.init({
        duration: 1000,
        easing: "ease-in-out", // Easing function for the animations
        once: true,           // Whether animation should happen only once - while scrolling down
        mirror: false         // Whether elements should animate out while scrolling past them
      });

      // Highlight navbar buttons based on what section you are in
      this.initNavbarLinksActive();

      // Add a border to the navbar when scrolling
      this.headerScrolled();

      // Go back to top
      this.toggleBackToTop();

      // Prevent page from refreshing when clicking navbar items
      this.setupNavbarLinksClick();

      // Also back on top button to prevent refreshing
      this.setupBackToTopButtonClick();

      // Scroll with offset on page load with hash links in the URL
      this.handleHashScrollOnLoad();

      // Add mobile navigation event listener
      this.initMobileNavToggle();

      // Same with learn more
      this.setupLearnMoreButtonClick();
    }

    ngAfterViewInit(): void {
      // Initialize portfolio isotope and filter
      this.initPortfolioIsotope();

      // Initialize portfolio lightbox
      this.initPortfolioLightbox();

      // Initialize portfolio details slider
      this.initPortfolioDetailsSlider();

      // Initialize accordion functionality - dropdowns in about us
      this.initAccordion();
    }

    /**
     * Initializes the active state handling for navbar links
     * based on scroll position.
     */
    private initNavbarLinksActive(): void {
      const select = (el: string, all: boolean = false): Element | null | NodeListOf<Element> => {
        el = el.trim();
        if (all) {
          return document.querySelectorAll(el);
        } else {
          return document.querySelector(el);
        }
      };

      let navbarlinks: NodeListOf<Element> = select('#navbar .scrollto', true) as NodeListOf<Element>;

      const navbarlinksActive = () => {
        let position = window.scrollY + 200;
        let currentActiveLink: Element | null = null;

        navbarlinks.forEach((navbarlink: Element) => {
          const link = navbarlink as HTMLAnchorElement;
          if (!link.hash) return;
          let section = select(link.hash) as HTMLElement;
          if (!section) return;

          // Check if the section is at or past the current scroll position
          if (position >= section.offsetTop && position <= (section.offsetTop + section.offsetHeight)) {
            navbarlink.classList.add('active');
            currentActiveLink = navbarlink;  // Update the current active link
          } else {
            navbarlink.classList.remove('active');
          }
        });

        // Ensure at least one link is always active
        if (!currentActiveLink && navbarlinks.length > 0) {
          // Find the last link that should be active based on the scroll position
          for (let i = navbarlinks.length - 1; i >= 0; i--) {
            const link = navbarlinks[i] as HTMLAnchorElement;
            if (link.hash) {
              const section = select(link.hash) as HTMLElement;
              if (section && position > section.offsetTop) {
                navbarlinks[i].classList.add('active');
                break;
              }
            }
          }
        }
      };

      window.addEventListener('load', navbarlinksActive);
      document.addEventListener('scroll', navbarlinksActive);
    }

    private setupNavbarLinksClick(): void {
      const navbarLinks = document.querySelectorAll('.nav-link.scrollto');
      navbarLinks.forEach(link => {
        link.addEventListener('click', (event) => {
          event.preventDefault(); // Prevent the default anchor behavior
          const sectionId = (event.target as HTMLAnchorElement).getAttribute('href');
          if (sectionId) {
            this.scrollto(sectionId);
          }
        });
      });
    }

    // Set up learn more to not refresh
    private setupLearnMoreButtonClick(): void {
      const learnMoreButton = document.querySelector('.btn-learn-more');
      if (learnMoreButton) {
        learnMoreButton.addEventListener('click', (event) => {
          event.preventDefault(); // Prevent the default anchor behavior
          const whyUsSection = document.querySelector('#why-us');
          if (whyUsSection) {
            whyUsSection.scrollIntoView({
              behavior: 'smooth'
            });
          }
        });
      }
    }



    /**
     * Adds or removes the 'header-scrolled' class from the header element
     * based on the scroll position of the window.
     */
    private headerScrolled(): void {
      // Select the header element
      const selectHeader = document.getElementById('header');

      // Check if the header element exists
      if (selectHeader) {
        // Define the function to toggle the 'header-scrolled' class
        const toggleHeaderClass = () => {
          if (window.scrollY > 100) {
            selectHeader.classList.add('header-scrolled');
          } else {
            selectHeader.classList.remove('header-scrolled');
          }
        };

        // Execute the function on load to ensure correct initial state
        toggleHeaderClass();

        // Add the function as an event listener for the scroll event
        window.addEventListener('scroll', toggleHeaderClass);
      }
    }

    /**
     * Scrolls smoothly to the given element on the page.
     * Accounts for the offset height of the header to ensure the element is not hidden behind it.
     * @param el - The selector for the element to scroll to.
     */
    private scrollto(el: string): void {
      console.log("scrollto called with:", el);
      const header = document.getElementById('header') as HTMLElement;
      const offset = header ? header.offsetHeight : 0;
      console.log("Header offset:", offset);
      const element = document.querySelector(el) as HTMLElement | null;

      if (element) {
        const elementPos = element.offsetTop;
        console.log("Scrolling to position:", elementPos - offset);
        window.scrollTo({
          top: elementPos - offset,
          behavior: 'smooth'
        });
      } else {
        console.log("Element not found for selector:", el);
      }
    }

    /**
     * Toggles the visibility of the back-to-top button based on the scroll position.
     * Shows the button when scrolled down a certain distance.
     */
    private toggleBackToTop(): void {
      const backtotop = document.querySelector('.back-to-top');
      const checkScroll = () => {
        if (window.scrollY > 100) {
          backtotop?.classList.add('active');
        } else {
          backtotop?.classList.remove('active');
        }
      };

      checkScroll(); // Check immediately on load
      window.addEventListener('scroll', checkScroll);
    }

    private setupBackToTopButtonClick(): void {
      const backToTopButton = document.querySelector('.back-to-top');
      if (backToTopButton) {
        backToTopButton.addEventListener('click', (event) => {
          event.preventDefault(); // Prevent the default anchor behavior
          window.scrollTo({
            top: 0,
            behavior: 'smooth'
          });
        });
      }
    }

    /**
     * Handles scroll to element with offset on page load for hash links in the URL.
     */
    private handleHashScrollOnLoad(): void {
      const hash = window.location.hash;
      if (hash) {
        const element = document.querySelector(hash) as HTMLElement;
        if (element) {
          this.scrollto(hash);
        }
      }
    }

    /**
     * Listens for the window scroll event and triggers header scroll and back-to-top toggle methods.
     * Ensures that the UI updates in response to user scrolling.
     */
    @HostListener('window:scroll', ['$event'])
    onWindowScroll() {
      this.headerScrolled();
      this.toggleBackToTop();
    }

    private initPortfolioIsotope(): void {
      window.onload = () => {
        const portfolioContainer = document.querySelector('.portfolio-container') as HTMLElement;
        if (portfolioContainer) {
          const portfolioIsotope: any = new Isotope(portfolioContainer, {
            itemSelector: '.portfolio-item',
            layoutMode: 'fitRows',
          });

          const portfolioFilters = document.querySelectorAll('#portfolio-flters li');

          portfolioFilters.forEach((filter) => {
            filter.addEventListener('click', (e) => {
              e.preventDefault();
              portfolioFilters.forEach((el) => {
                el.classList.remove('filter-active');
              });
              filter.classList.add('filter-active');

              const filterValue = filter.getAttribute('data-filter');

              if (filterValue !== null) {
                portfolioIsotope.arrange({ filter: filterValue });
              }
            });
          });
        }
      };
    }
    private initAccordion(): void {
      const accordionItems = document.querySelectorAll('.accordion-list a');
      accordionItems.forEach(item => {
        item.addEventListener('click', (event) => {
          event.preventDefault();
          const currentPanel = item.nextElementSibling as HTMLElement;
          const isOpen = currentPanel.classList.contains('show');

          // Close all panels and set the icons to arrow down
          accordionItems.forEach(itm => {
            const panel = itm.nextElementSibling as HTMLElement;
            panel.classList.remove('show');
            itm.classList.add('collapsed');
            this.toggleIcon(itm, false);
          });

          // Open the clicked panel if it was not already open and switch its icon to arrow up
          if (!isOpen) {
            currentPanel.classList.add('show');
            item.classList.remove('collapsed');
            this.toggleIcon(item, true);
          }
        });
      });
    }

    private toggleIcon(item: Element, isOpen: boolean): void {
      const iconShow = item.querySelector('.icon-show');
      const iconClose = item.querySelector('.icon-close');

      if (iconShow && iconClose) {
        if (isOpen) {
          iconShow.classList.add('hidden');
          iconShow.classList.remove('visible');
          iconClose.classList.add('visible');
          iconClose.classList.remove('hidden');
        } else {
          iconShow.classList.add('visible');
          iconShow.classList.remove('hidden');
          iconClose.classList.add('hidden');
          iconClose.classList.remove('visible');
        }
      }
    }

    /**
     * Initializes portfolio lightbox.
     */
    private initPortfolioLightbox(): void {
      const portfolioLightbox: any = GLightbox({
        selector: '.portfolio-lightbox'
      });
    }

    /**
   * Initialize mobile navigation toggle
   */
  private initMobileNavToggle(): void {
    const mobileNavToggle = document.querySelector('.mobile-nav-toggle') as HTMLElement;
    const navbarMobile = document.getElementById('navbar');
    const navLinks = document.querySelectorAll('.nav-link.scrollto');

    if (mobileNavToggle && navbarMobile) {
      mobileNavToggle.addEventListener('click', () => {
        navbarMobile.classList.toggle('navbar-mobile');
        mobileNavToggle.classList.toggle('bi-list');
        mobileNavToggle.classList.toggle('bi-x');
      });

      // Show the mobile navigation toggle button when you resize the window to a larger width
      window.addEventListener('resize', () => {
        if (window.innerWidth > 991) {
          // Check if the window width is greater than 991 pixels (not in mobile mode)
          navbarMobile.classList.remove('navbar-mobile'); // Remove the navbar-mobile class
          mobileNavToggle.classList.toggle('bi-list', true); // Ensure the toggle button shows the menu icon
          mobileNavToggle.classList.toggle('bi-x', false);
        }
      });

      // Add an event listener to all navigation links to collapse the mobile nav when any link is clicked
      navLinks.forEach(link => {
        link.addEventListener('click', () => {
          navbarMobile.classList.remove('navbar-mobile'); // Remove the navbar-mobile class
          mobileNavToggle.classList.toggle('bi-list', true); // Ensure the toggle button shows the menu icon
          mobileNavToggle.classList.toggle('bi-x', false);
        });
      });
    }
  }

    /**
     * Initializes portfolio details slider.
     */
    private initPortfolioDetailsSlider(): void {
      new Swiper('.portfolio-details-slider', {
        speed: 400,
        loop: true,
        autoplay: {
          delay: 5000,
          disableOnInteraction: false
        },
        pagination: {
          el: '.swiper-pagination',
          type: 'bullets',
          clickable: true
        }
      });
    }
  }

