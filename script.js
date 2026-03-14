// Initialization
document.addEventListener('DOMContentLoaded', () => {
  initStickyHeader();
  initScrollReveal();
  initCompulsoryLogin();
  initThemeToggle();
  initMenuFilter();
});

// Sticky Header
function initStickyHeader() {
  const header = document.querySelector('.header');
  if(!header) return;

  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  });

  // Mobile menu toggle
  const mobileBtn = document.querySelector('.mobile-menu-btn');
  const nav = document.querySelector('.nav-links');
  
  if(mobileBtn && nav) {
    mobileBtn.addEventListener('click', () => {
        const isDisplay = window.getComputedStyle(nav).display;
        if(isDisplay === 'none' || !nav.style.display || nav.style.display === '') {
            nav.style.display = 'flex';
            nav.style.flexDirection = 'column';
            nav.style.position = 'absolute';
            nav.style.top = '100%';
            nav.style.left = '0';
            nav.style.width = '100%';
            nav.style.background = 'rgba(255,255,255,0.95)';
            nav.style.padding = '1rem 0';
            nav.style.boxShadow = '0 10px 15px -3px rgba(0,0,0,0.1)';
            mobileBtn.innerHTML = '<i class="fa-solid fa-xmark"></i>';
        } else {
            nav.style.display = '';
            mobileBtn.innerHTML = '<i class="fa-solid fa-bars"></i>';
        }
    });

    // Close mobile nav on link click
    const links = nav.querySelectorAll('a');
    links.forEach(link => {
        link.addEventListener('click', () => {
            if(window.innerWidth <= 768) {
                nav.style.display = '';
                mobileBtn.innerHTML = '<i class="fa-solid fa-bars"></i>';
            }
        });
    });
    
    // Reset on window resize
    window.addEventListener('resize', () => {
        if(window.innerWidth > 768) {
            nav.style.display = '';
            mobileBtn.innerHTML = '<i class="fa-solid fa-bars"></i>';
        }
    });
  }
}

// Scroll Reveal Animations
function initScrollReveal() {
  const reveals = document.querySelectorAll('.reveal');
  
  const revealOnScroll = () => {
    const windowHeight = window.innerHeight;
    const elementVisible = 120;
    
    reveals.forEach(reveal => {
      const elementTop = reveal.getBoundingClientRect().top;
      if (elementTop < windowHeight - elementVisible) {
        reveal.classList.add('active');
      }
    });
  };
  
  window.addEventListener('scroll', revealOnScroll);
  revealOnScroll(); // Trigger on load
}


// Compulsory Login Logic
function initCompulsoryLogin() {
  const loginOverlay = document.getElementById('loginOverlay');
  const loginForm = document.getElementById('loginForm');
  const headerBtn = document.getElementById('headerLoginBtn');
  
  // Check if user is already logged in (using sessionStorage for demo)
  const isLoggedIn = sessionStorage.getItem('waves_user_logged_in');
  
  if (!isLoggedIn) {
    // Force login after 15 seconds of browsing
    setTimeout(() => {
      showLoginModal();
    }, 15000);
  } else {
    updateHeaderForLoggedInUser();
  }
  
  // Also open on manual header button click
  if (headerBtn) {
    headerBtn.addEventListener('click', (e) => {
      e.preventDefault();
      if (!sessionStorage.getItem('waves_user_logged_in')) {
        showLoginModal();
      }
    });
  }
  
  // Close button logic
  const closeBtn = document.getElementById('closeLoginBtn');
  if (closeBtn) {
    closeBtn.addEventListener('click', () => {
      hideLoginModal();
    });
  }
  
  // Handle form submission (mock authentication)
  if (loginForm) {
    loginForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const btn = loginForm.querySelector('button');
      
      btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Authenticating...';
      
      // Simulate network request
      setTimeout(() => {
        btn.innerHTML = '<i class="fa-solid fa-check"></i> Success!';
        btn.style.background = '#38b000';
        
        // Save state
        sessionStorage.setItem('waves_user_logged_in', 'true');
        
        setTimeout(() => {
          hideLoginModal();
          updateHeaderForLoggedInUser();
          btn.innerHTML = 'Sign In';
          btn.style.background = '';
          loginForm.reset();
        }, 1000);
      }, 1500);
    });
  }
  
  function showLoginModal() {
    loginOverlay.classList.add('active');
    document.body.classList.add('locked');
  }
  
  function hideLoginModal() {
    loginOverlay.classList.remove('active');
    document.body.classList.remove('locked');
  }
  
  function updateHeaderForLoggedInUser() {
    if (headerBtn) {
      headerBtn.innerHTML = '<i class="fa-solid fa-user"></i> My Account';
      headerBtn.classList.remove('btn-outline');
      headerBtn.style.background = 'rgba(255, 94, 0, 0.1)';
      headerBtn.style.color = 'var(--primary)';
      headerBtn.style.border = 'none';
      
      // Optional: Add logout logic here later
      headerBtn.addEventListener('click', (e) => {
          e.preventDefault();
          alert('Account Dashboard Panel (Coming Soon)');
      });
    }
  }
}



// Dark/Light Mode Toggle
function initThemeToggle() {
  const themeToggleBtn = document.getElementById('themeToggle');
  const icon = themeToggleBtn ? themeToggleBtn.querySelector('i') : null;
  const currentTheme = localStorage.getItem('waves_theme');

  // Apply saved theme on load
  if (currentTheme === 'dark') {
    document.body.classList.add('dark-mode');
    if (icon) {
      icon.classList.remove('fa-moon');
      icon.classList.add('fa-sun');
    }
  }

  // Handle toggle logic
  if (themeToggleBtn) {
    themeToggleBtn.addEventListener('click', () => {
      document.body.classList.toggle('dark-mode');
      
      const theme = document.body.classList.contains('dark-mode') ? 'dark' : 'light';
      localStorage.setItem('waves_theme', theme);

      // Icon update
      if (theme === 'dark') {
        icon.classList.remove('fa-moon');
        icon.classList.add('fa-sun');
      } else {
        icon.classList.remove('fa-sun');
        icon.classList.add('fa-moon');
      }
    });
  }
}

// Menu Filtering
function initMenuFilter() {
  const filterBtns = document.querySelectorAll('.filter-btn');
  const menuItems = document.querySelectorAll('.menu-item');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      // Remove active class from all buttons
      filterBtns.forEach(b => b.classList.remove('active'));
      // Add active class to clicked button
      btn.classList.add('active');

      const filterValue = btn.getAttribute('data-filter');

      menuItems.forEach(item => {
        if (filterValue === 'all' || item.getAttribute('data-category') === filterValue) {
          item.style.display = 'flex';
          setTimeout(() => {
            item.style.opacity = '1';
            item.style.transform = 'scale(1)';
          }, 50);
        } else {
          item.style.opacity = '0';
          item.style.transform = 'scale(0.8)';
          setTimeout(() => {
            item.style.display = 'none';
          }, 400); // Wait for transition to finish
        }
      });
    });
  });
}
