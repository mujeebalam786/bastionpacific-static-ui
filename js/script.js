/* ========================================
   BASTION PACIFIC - VANILLA JAVASCRIPT
   ======================================== */

document.addEventListener('DOMContentLoaded', function() {
  
  // ========================================
  // HERO CAROUSEL
  // ========================================
  const heroCarousel = {
    slides: document.querySelectorAll('.carousel-slide'),
    dots: document.querySelectorAll('.carousel-dots .dot'),
    prevBtn: document.querySelector('.carousel-arrow.prev'),
    nextBtn: document.querySelector('.carousel-arrow.next'),
    currentIndex: 0,
    autoPlayInterval: null,
    autoPlayDelay: 5000,

    init: function() {
      if (this.slides.length === 0) return;
      
      this.prevBtn.addEventListener('click', () => this.prev());
      this.nextBtn.addEventListener('click', () => this.next());
      
      this.dots.forEach((dot, index) => {
        dot.addEventListener('click', () => this.goTo(index));
      });
      
      this.startAutoPlay();
      
      // Pause on hover
      const container = document.querySelector('.carousel-container');
      container.addEventListener('mouseenter', () => this.stopAutoPlay());
      container.addEventListener('mouseleave', () => this.startAutoPlay());
    },

    goTo: function(index) {
      this.slides[this.currentIndex].classList.remove('active');
      this.dots[this.currentIndex].classList.remove('active');
      
      this.currentIndex = index;
      
      if (this.currentIndex >= this.slides.length) this.currentIndex = 0;
      if (this.currentIndex < 0) this.currentIndex = this.slides.length - 1;
      
      this.slides[this.currentIndex].classList.add('active');
      this.dots[this.currentIndex].classList.add('active');
    },

    next: function() {
      this.goTo(this.currentIndex + 1);
    },

    prev: function() {
      this.goTo(this.currentIndex - 1);
    },

    startAutoPlay: function() {
      this.stopAutoPlay();
      this.autoPlayInterval = setInterval(() => this.next(), this.autoPlayDelay);
    },

    stopAutoPlay: function() {
      if (this.autoPlayInterval) {
        clearInterval(this.autoPlayInterval);
        this.autoPlayInterval = null;
      }
    }
  };

  heroCarousel.init();

  // ========================================
  // CATEGORY CAROUSEL
  // ========================================
  const categoryCarousel = {
    track: document.querySelector('.categories-track'),
    prevBtn: document.querySelector('.category-nav .cat-arrow.prev'),
    nextBtn: document.querySelector('.category-nav .cat-arrow.next'),
    scrollAmount: 200,

    init: function() {
      if (!this.track) return;
      
      this.prevBtn.addEventListener('click', () => this.scrollLeft());
      this.nextBtn.addEventListener('click', () => this.scrollRight());
    },

    scrollLeft: function() {
      this.track.parentElement.scrollBy({
        left: -this.scrollAmount,
        behavior: 'smooth'
      });
    },

    scrollRight: function() {
      this.track.parentElement.scrollBy({
        left: this.scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  categoryCarousel.init();

  // ========================================
  // MOBILE MENU
  // ========================================
  const mobileMenu = {
    btn: document.querySelector('.mobile-menu-btn'),
    nav: document.querySelector('.nav-menu'),
    isOpen: false,

    init: function() {
      if (!this.btn) return;
      
      this.btn.addEventListener('click', () => this.toggle());
      
      // Close menu when clicking outside
      document.addEventListener('click', (e) => {
        if (this.isOpen && 
            !this.nav.contains(e.target) && 
            !this.btn.contains(e.target)) {
          this.close();
        }
      });
    },

    toggle: function() {
      this.isOpen = !this.isOpen;
      
      if (this.isOpen) {
        this.nav.classList.add('active');
        this.btn.classList.add('active');
        document.body.style.overflow = 'hidden';
      } else {
        this.close();
      }
    },
    
    close: function() {
      this.isOpen = false;
      this.nav.classList.remove('active');
      this.btn.classList.remove('active');
      document.body.style.overflow = '';
      
      // Also close all mobile mega menus if open
      if (mobileMegaMenu) {
        mobileMegaMenu.hideAll();
      }
    }
  };

  mobileMenu.init();

  // ========================================
  // MOBILE MEGA MENU - MULTI-LEVEL
  // ========================================
  const mobileMegaMenu = {
    productsLink: document.querySelector('.mobile-products-link'),
    megaMenus: document.querySelectorAll('.mobile-mega-menu'),
    currentLevel: null,
    menuStack: [],

    init: function() {
      if (!this.productsLink || this.megaMenus.length === 0) return;
      
      // Open level 2 (Browse Products) when Products link is clicked on mobile
      this.productsLink.addEventListener('click', (e) => {
        if (window.innerWidth <= 1024) {
          e.preventDefault();
          this.showLevel(2);
        }
      });
      
      // Handle category clicks in level 2
      const level2Menu = document.querySelector('.mobile-mega-menu[data-level="2"]');
      if (level2Menu) {
        const categoryLinks = level2Menu.querySelectorAll('.mobile-mega-menu-item[data-category]');
        categoryLinks.forEach(link => {
          link.addEventListener('click', (e) => {
            e.preventDefault();
            const category = link.getAttribute('data-category');
            this.showCategory(category);
          });
        });
      }
      
      // Handle back buttons
      const backButtons = document.querySelectorAll('.mobile-mega-menu-back');
      backButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
          e.preventDefault();
          const backTo = btn.getAttribute('data-back-to');
          if (backTo === 'main') {
            this.hideAll();
            mobileMenu.close();
          } else if (backTo === 'products') {
            this.showLevel(2);
          }
        });
      });
      
      // Close mega menu when clicking outside (on the background)
      this.megaMenus.forEach(menu => {
        menu.addEventListener('click', (e) => {
          if (e.target === menu) {
            this.hideAll();
          }
        });
      });
    },

    showLevel: function(level) {
      // Hide all menus first
      this.hideAll();
      
      // Show the requested level
      const targetMenu = document.querySelector(`.mobile-mega-menu[data-level="${level}"]`);
      if (targetMenu) {
        targetMenu.classList.add('active');
        this.currentLevel = level;
        this.menuStack.push(level);
        document.body.style.overflow = 'hidden';
      }
    },

    showCategory: function(category) {
      // Hide all menus first
      this.hideAll();
      
      // Show the category submenu
      const categoryMenu = document.querySelector(`.mobile-mega-menu[data-category="${category}"]`);
      if (categoryMenu) {
        categoryMenu.classList.add('active');
        this.currentLevel = 3;
        this.menuStack.push(3);
        document.body.style.overflow = 'hidden';
      }
    },

    hideAll: function() {
      this.megaMenus.forEach(menu => {
        menu.classList.remove('active');
      });
      this.currentLevel = null;
      this.menuStack = [];
      document.body.style.overflow = '';
    },

    goBack: function() {
      if (this.menuStack.length > 1) {
        this.menuStack.pop();
        const previousLevel = this.menuStack[this.menuStack.length - 1];
        this.showLevel(previousLevel);
      } else {
        this.hideAll();
        mobileMenu.close();
      }
    }
  };

  mobileMegaMenu.init();

  // ========================================
  // SMOOTH SCROLL FOR ANCHOR LINKS
  // ========================================
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const href = this.getAttribute('href');
      if (href === '#') return;
      
      e.preventDefault();
      const target = document.querySelector(href);
      if (target) {
        target.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      }
    });
  });

  // ========================================
  // SCROLL ANIMATIONS
  // ========================================
  const animateOnScroll = {
    elements: document.querySelectorAll('.promo-card, .category-card, .product-card, .product-category-card, .about-content, .about-image'),
    
    init: function() {
      this.elements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
      });
      
      this.checkVisibility();
      window.addEventListener('scroll', () => this.checkVisibility());
    },

    checkVisibility: function() {
      this.elements.forEach(el => {
        const rect = el.getBoundingClientRect();
        const windowHeight = window.innerHeight;
        
        if (rect.top < windowHeight * 0.85) {
          el.style.opacity = '1';
          el.style.transform = 'translateY(0)';
        }
      });
    }
  };

  animateOnScroll.init();

  // ========================================
  // SEARCH FUNCTIONALITY
  // ========================================
  const searchBox = document.querySelector('.search-input');
  const searchBtn = document.querySelector('.search-btn');
  
  if (searchBtn && searchBox) {
    searchBtn.addEventListener('click', function() {
      const query = searchBox.value.trim();
      if (query) {
        alert('Search for: ' + query);
        // In a real site, this would navigate to search results
      }
    });
    
    searchBox.addEventListener('keypress', function(e) {
      if (e.key === 'Enter') {
        searchBtn.click();
      }
    });
  }

  // ========================================
  // HEADER SCROLL EFFECT
  // ========================================
  const header = document.querySelector('.header');
  let lastScroll = 0;
  
  window.addEventListener('scroll', function() {
    const currentScroll = window.pageYOffset;
    
    if (currentScroll > 100) {
      header.style.boxShadow = '0 4px 20px rgba(0,0,0,0.15)';
    } else {
      header.style.boxShadow = '0 4px 6px rgba(0,0,0,0.1)';
    }
    
    lastScroll = currentScroll;
  });

  // ========================================
  // CART FUNCTIONALITY (Demo)
  // ========================================
  const cartBtn = document.querySelector('.cart-btn');
  const cartCount = document.querySelector('.cart-count');
  let cartItems = 0;
  
  // Add to cart functionality for product cards (both products.html and product-subcategory.html)
  document.querySelectorAll('.product-link, .product-category-link, .view-link').forEach(link => {
    link.addEventListener('click', function(e) {
      e.preventDefault();
      cartItems++;
      cartCount.textContent = cartItems;
      
      // Animation effect
      cartBtn.style.transform = 'scale(1.2)';
      setTimeout(() => {
        cartBtn.style.transform = 'scale(1)';
      }, 200);
    });
  });

  // ========================================
  // LAZY LOADING IMAGES
  // ========================================
  if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target;
          if (img.dataset.src) {
            img.src = img.dataset.src;
            img.removeAttribute('data-src');
          }
          observer.unobserve(img);
        }
      });
    });

    document.querySelectorAll('img[data-src]').forEach(img => {
      imageObserver.observe(img);
    });
  }

  // ========================================
  // SIDEBAR TOGGLE (Products Page)
  // ========================================
  const sidebarToggle = {
    sidebar: document.querySelector('.sidebar'),
    toggleBtn: document.querySelector('.sidebar-toggle'),
    sidebarHeader: document.querySelector('.sidebar-header'),
    sidebarNav: document.querySelector('.sidebar-nav'),
    
    init: function() {
      if (!this.sidebar || !this.toggleBtn) return;
      
      // Toggle on button click
      this.toggleBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        this.toggle();
      });
      
      // Toggle on header click
      if (this.sidebarHeader) {
        this.sidebarHeader.addEventListener('click', (e) => {
          // Don't trigger if clicking the button itself
          if (!e.target.closest('.sidebar-toggle')) {
            this.toggle();
          }
        });
      }
    },
    
    toggle: function() {
      if (this.sidebar) {
        this.sidebar.classList.toggle('collapsed');
      }
    }
  };
  
  sidebarToggle.init();

  // ========================================
  // SIDEBAR "SEE MORE" FUNCTIONALITY
  // ========================================
  const sidebarSeeMore = {
    sidebarList: document.querySelector('.sidebar-list'),
    seeMoreBtn: document.querySelector('.see-more-btn'),
    isExpanded: false,
    
    init: function() {
      if (!this.sidebarList || !this.seeMoreBtn) return;
      
      const links = this.sidebarList.querySelectorAll('.sidebar-link');
      
      // Hide button if 5 or fewer links
      if (links.length <= 5) {
        this.seeMoreBtn.classList.add('hidden');
        return;
      }
      
      // Add click event to toggle
      this.seeMoreBtn.addEventListener('click', () => {
        this.toggle();
      });
    },
    
    toggle: function() {
      this.isExpanded = !this.isExpanded;
      
      if (this.isExpanded) {
        this.sidebarList.classList.add('expanded');
        this.seeMoreBtn.textContent = 'See less';
      } else {
        this.sidebarList.classList.remove('expanded');
        this.seeMoreBtn.textContent = 'See more';
      }
    }
  };
  
  sidebarSeeMore.init();

  // ========================================
  // PRODUCT VIEW TOGGLE (Product Subcategory Page)
  // ========================================
  const productViewToggle = {
    viewBtns: document.querySelectorAll('.view-btn'),
    productsGrid: document.querySelector('.products-grid'),
    
    init: function() {
      if (!this.productsGrid || this.viewBtns.length === 0) return;
      
      // Check if mobile screen and set list view as default
      const isMobile = window.innerWidth <= 768;
      
      if (isMobile) {
        // Set list view as default on mobile
        this.setView('list');
      }
      // Desktop: Set default view (4 columns - no class needed)
      // The 4-grid button is active by default for visual consistency with design
      
      this.viewBtns.forEach(btn => {
        btn.addEventListener('click', () => {
          const view = btn.getAttribute('data-view');
          this.setView(view);
        });
      });
      
      // Also handle window resize to apply list view on mobile
      window.addEventListener('resize', () => {
        const isMobileNow = window.innerWidth <= 768;
        if (isMobileNow && !this.productsGrid.classList.contains('view-list')) {
          this.setView('list');
        }
      });
    },
    
    setView: function(view) {
      // Remove active class from all buttons
      this.viewBtns.forEach(btn => {
        btn.classList.remove('active');
      });
      
      // Add active class to clicked button
      const activeBtn = document.querySelector(`.view-btn[data-view="${view}"]`);
      if (activeBtn) {
        activeBtn.classList.add('active');
      }
      
      // Remove all view classes from grid
      this.productsGrid.classList.remove('view-list', 'view-grid-2', 'view-grid-3');
      
      // Add appropriate view class
      if (view === 'list') {
        this.productsGrid.classList.add('view-list');
      } else if (view === 'grid-2') {
        this.productsGrid.classList.add('view-grid-2');
      } else if (view === 'grid-3') {
        this.productsGrid.classList.add('view-grid-3');
      }
      // Default (grid-4) - no class needed, it's the default CSS
    }
  };
  
  productViewToggle.init();

  // ========================================
  // PRODUCT DETAIL PAGE - IMAGE GALLERY
  // ========================================
  const productDetailGallery = {
    images: [
      'https://www.bastionpacific.com.au/bastionpacific%20website%20item%20images/BWR3130_1_new.jpg?resizeid=9&resizeh=1200&resizew=1200',
      'https://www.bastionpacific.com.au/bastionpacific%20website%20item%20images/BWR3130_0.jpg?resizeid=9&resizeh=1200&resizew=1200',
      'https://www.bastionpacific.com.au/bastionpacific%20website%20item%20images/BWR3130_1.jpg?resizeid=9&resizeh=1200&resizew=1200',
      'https://www.bastionpacific.com.au/bastionpacific%20website%20item%20images/BWR3130_2.jpg?resizeid=9&resizeh=1200&resizew=1200',
      'https://www.bastionpacific.com.au/bastionpacific%20website%20item%20images/BWR3130_3.jpg?resizeid=9&resizeh=1200&resizew=1200',
      'https://www.bastionpacific.com.au/bastionpacific%20website%20item%20images/BWR3130_4.jpg?resizeid=9&resizeh=1200&resizew=1200'
    ],
    currentIndex: 0,

    init: function() {
      // Only initialize if we're on the product detail page
      const mainImage = document.getElementById('mainImage');
      if (!mainImage) return;

      // Make functions globally available for onclick handlers
      window.changeImage = (direction) => this.changeImage(direction);
      window.setImage = (index) => this.setImage(index);
      window.updateQty = (btn, change) => this.updateQty(btn, change);

      // Initialize image zoom on hover
      this.initImageZoom();
    },

    initImageZoom: function() {
      const mainImage = document.getElementById('mainImage');
      const mainImageContainer = mainImage.closest('.main-image');
      
      if (!mainImage || !mainImageContainer) return;

      const zoomScale = 2.3; // Zoom level (adjust as needed)

      mainImageContainer.addEventListener('mousemove', (e) => {
        const rect = mainImageContainer.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        // Calculate percentage for transform-origin
        const xPercent = (x / rect.width) * 100;
        const yPercent = (y / rect.height) * 100;

        // Apply zoom with transform-origin at mouse position
        mainImage.style.transformOrigin = `${xPercent}% ${yPercent}%`;
        mainImage.style.transform = `scale(${zoomScale})`;
      });

      mainImageContainer.addEventListener('mouseenter', () => {
        mainImage.style.transition = 'transform 0.1s ease-out';
      });

      mainImageContainer.addEventListener('mouseleave', () => {
        mainImage.style.transition = 'transform 0.3s ease-in';
        mainImage.style.transform = 'scale(1)';
        mainImage.style.transformOrigin = 'center center';
      });
    },

    changeImage: function(direction) {
      this.currentIndex += direction;
      
      if (this.currentIndex >= this.images.length) {
        this.currentIndex = 0;
      } else if (this.currentIndex < 0) {
        this.currentIndex = this.images.length - 1;
      }
      
      this.updateMainImage();
      this.updateThumbnails();
    },

    setImage: function(index) {
      this.currentIndex = index;
      this.updateMainImage();
      this.updateThumbnails();
    },

    updateMainImage: function() {
      const mainImage = document.getElementById('mainImage');
      if (mainImage) {
        mainImage.src = this.images[this.currentIndex];
      }
    },

    updateThumbnails: function() {
      const thumbnails = document.querySelectorAll('.thumbnail');
      thumbnails.forEach((thumb, index) => {
        thumb.classList.toggle('active', index === this.currentIndex);
      });
    },

    updateQty: function(btn, change) {
      const input = btn.parentElement.querySelector('.qty-input');
      if (input) {
        let value = parseInt(input.value) || 0;
        value += change;
        if (value < 0) value = 0;
        input.value = value;
      }
    }
  };

  productDetailGallery.init();

  // ========================================
  // PRODUCT DETAIL PAGE - OPTION BUTTONS
  // ========================================
  const productDetailOptions = {
    init: function() {
      const optionGroups = document.querySelectorAll('.option-group');
      if (optionGroups.length === 0) return;
      
      optionGroups.forEach(group => {
        const buttons = group.querySelectorAll('.option-btn');
        
        buttons.forEach(btn => {
          btn.addEventListener('click', function() {
            buttons.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
          });
        });
      });
      
      // Select all checkbox
      const selectAll = document.getElementById('selectAll');
      if (selectAll) {
        selectAll.addEventListener('change', function() {
          const radios = document.querySelectorAll('.product-table input[type="radio"]');
          // Radio buttons can't be "select all" - this is just for visual consistency
        });
      }
    }
  };

  productDetailOptions.init();

  console.log('Bastion Pacific Static Site Loaded Successfully!');
});