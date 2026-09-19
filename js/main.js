/* ==========================================================================
   VELVET FLAME — Main Interactive Logic
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  // ------------------------------------------------------------------------
  // 1. Navigation & Scroll Effects
  // ------------------------------------------------------------------------
  const navbar = document.querySelector('.navbar');
  const navLinks = document.querySelectorAll('.nav-link');
  const sections = document.querySelectorAll('section[id]');

  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }

    // ScrollSpy active link update
    let current = '';
    sections.forEach(section => {
      const sectionTop = section.offsetTop - 120;
      const sectionHeight = section.offsetHeight;
      if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
        current = section.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${current}`) {
        link.classList.add('active');
      }
    });
  });

  // Mobile Menu Drawer
  const mobileToggle = document.querySelector('.mobile-toggle');
  const mobileMenu = document.querySelector('.mobile-menu');
  const mobileClose = document.querySelector('.mobile-close');

  if (mobileToggle && mobileMenu && mobileClose) {
    mobileToggle.addEventListener('click', () => {
      mobileMenu.classList.add('active');
    });

    mobileClose.addEventListener('click', () => {
      mobileMenu.classList.remove('active');
    });

    document.querySelectorAll('.mobile-nav-links a').forEach(link => {
      link.addEventListener('click', () => {
        mobileMenu.classList.remove('active');
      });
    });
  }

  // ------------------------------------------------------------------------
  // 2. Menu Items Data & Filtering System
  // ------------------------------------------------------------------------
  const menuData = [
    // Burgers & Combos
    { id: 'b1', title: 'Velvet Royale Burger', category: 'burgers', price: 1190, desc: 'Double-seared beef, melted cheddar, caramelized onions and signature Velvet sauce in a toasted brioche bun.', tag: 'SIGNATURE BURGER', img: 'assets/images/cat_burger.jpg' },
    { id: 'b2', title: 'Classic Beef Burger', category: 'burgers', price: 950, desc: 'Prime beef patty, aged cheddar, lettuce, fresh tomato and house pickle relish.', tag: 'POPULAR', img: 'assets/images/hero_burger.jpg' },
    { id: 'b3', title: 'Crispy Chicken Burger', category: 'burgers', price: 890, desc: 'Golden buttermilk fried chicken breast, creamy coleslaw and spicy mayo.', tag: '', img: 'https://images.unsplash.com/photo-1625813506062-0aeb1d7a094b?auto=format&fit=crop&w=600&q=80' },
    { id: 'b4', title: 'Zinger Supreme', category: 'burgers', price: 920, desc: 'Extra crispy spicy chicken fillet with jalapeños and signature fiery sauce.', tag: '', img: 'https://images.unsplash.com/photo-1550547660-d9450f859349?auto=format&fit=crop&w=600&q=80' },
    { id: 'b5', title: 'BBQ Flame Burger', category: 'burgers', price: 1050, desc: 'Flame-grilled patty smothered in smoky BBQ sauce with onion rings & cheese.', tag: '', img: 'https://images.unsplash.com/photo-1586190848861-99aa4a171e90?auto=format&fit=crop&w=600&q=80' },
    { id: 'b6', title: 'Signature Combo Box', category: 'burgers', price: 1490, desc: 'Velvet Royale burger served with loaded cheese fries & crisp soft drink.', tag: 'VALUE', img: 'assets/images/signature_combo_box.jpg' },

    // Pizza & Flatbreads
    { id: 'p1', title: 'Flame Kissed Tikka Pizza', category: 'pizza', price: 1650, desc: 'Smoky chicken tikka, rich mozzarella, signature sauce and a golden crust.', tag: "CHEF'S SPECIAL", img: 'assets/images/cat_pizza.jpg' },
    { id: 'p2', title: 'Pepperoni Classic', category: 'pizza', price: 1590, desc: 'Loaded with beef pepperoni, melted mozzarella, and fresh basil herbs.', tag: '', img: 'assets/images/tikka_pizza.jpg' },
    { id: 'p3', title: 'Fajita Supreme', category: 'pizza', price: 1620, desc: 'Marinated chicken fajita, bell peppers, onions, and rich spicy pizza sauce.', tag: '', img: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=600&q=80' },
    { id: 'p4', title: 'Creamy Alfredo Pizza', category: 'pizza', price: 1690, desc: 'Rich garlic alfredo sauce, grilled chicken breast, mushrooms and parmesan.', tag: '', img: 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?auto=format&fit=crop&w=600&q=80' },
    { id: 'p5', title: 'Four Cheese Gourmet', category: 'pizza', price: 1750, desc: 'Blend of Mozzarella, Cheddar, Parmesan and Cream cheese on sourdough crust.', tag: 'CHEESY', img: 'https://images.unsplash.com/photo-1573821663912-569905455b1c?auto=format&fit=crop&w=600&q=80' },
    { id: 'p6', title: 'BBQ Chicken Pizza', category: 'pizza', price: 1650, desc: 'Tangy smoky BBQ chicken, red onions, mozzarella and fresh cilantro.', tag: '', img: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?auto=format&fit=crop&w=600&q=80' },

    // Shawarma & Wraps
    { id: 's1', title: 'Golden Velvet Shawarma', category: 'shawarma', price: 690, desc: 'Tender seasoned chicken, creamy garlic sauce and crisp vegetables in a wrap.', tag: 'BESTSELLER', img: 'assets/images/cat_shawarma.jpg' },
    { id: 's2', title: 'Classic Chicken Shawarma', category: 'shawarma', price: 550, desc: 'Traditional pita wrap filled with charbroiled chicken & authentic toum sauce.', tag: '', img: 'assets/images/golden_shawarma.jpg' },
    { id: 's3', title: 'Golden Crunch Shawarma', category: 'shawarma', price: 720, desc: 'Crispy fried chicken strips wrapped with cheese sauce & pickled jalapeños.', tag: '', img: 'https://images.unsplash.com/photo-1626700051175-6818013e1d4f?auto=format&fit=crop&w=600&q=80' },
    { id: 's4', title: 'Arabic Wrap Platter', category: 'shawarma', price: 890, desc: 'Sliced chicken shawarma wrap served with garlic dip, french fries & pickles.', tag: 'SPECIAL', img: 'https://images.unsplash.com/photo-1529006557810-274b9b2fc783?auto=format&fit=crop&w=600&q=80' },
    { id: 's5', title: 'Grilled Chicken Wrap', category: 'shawarma', price: 680, desc: 'Herb-marinated grilled chicken breast, lettuce, tomato and tahini dressing.', tag: '', img: 'assets/images/grilled_chicken_wrap_new.jpg' },
    { id: 's6', title: 'Loaded Beef Shawarma', category: 'shawarma', price: 780, desc: 'Slow-roasted spicy beef shawarma with tahini sauce and roasted tomatoes.', tag: '', img: 'https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?auto=format&fit=crop&w=600&q=80' },

    // Desi Kitchen
    { id: 'd1', title: 'Royal Flame Chicken Karahi', category: 'desi', price: 1850, desc: 'Rich, sizzling chicken karahi infused with tomatoes, fresh ginger & spices.', tag: 'DESI SIGNATURE', img: 'assets/images/royal_chicken_karahi.jpg' },
    { id: 'd2', title: 'Mutton Karahi Special', category: 'desi', price: 2850, desc: 'Tender mutton cooked in traditional wok with fresh butter & green chilies.', tag: 'ROYAL', img: 'assets/images/mutton_karahi.jpg' },
    { id: 'd3', title: 'Creamy Chicken Handi', category: 'desi', price: 1790, desc: 'Boneless chicken cubes simmered in a velvet butter and cashew cream gravy.', tag: '', img: 'https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?auto=format&fit=crop&w=600&q=80' },
    { id: 'd4', title: 'Smoky Chicken Tikka', category: 'desi', price: 650, desc: 'Quarter chicken leg/breast marinated in spicy yogurt & flame-grilled.', tag: '', img: 'https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?auto=format&fit=crop&w=600&q=80' },
    { id: 'd5', title: 'Reshmi Malai Boti', category: 'desi', price: 980, desc: 'Melt-in-your-mouth chicken bites marinated in cream, cheese and light spices.', tag: '', img: 'https://images.unsplash.com/photo-1610057099443-fde8c4d50f91?auto=format&fit=crop&w=600&q=80' },
    { id: 'd6', title: 'Royal Seekh Kebab (4 pcs)', category: 'desi', price: 920, desc: 'Minced beef kebabs mixed with herbs and flame-roasted to perfection.', tag: '', img: 'https://images.unsplash.com/photo-1603360946369-dc9bb6258143?auto=format&fit=crop&w=600&q=80' },

    // Sides & Snacks
    { id: 'sn1', title: 'Velvet Loaded Cheese Fries', category: 'sides', price: 590, desc: 'Golden crispy fries topped with creamy cheese sauce and seasoning blend.', tag: 'HOT', img: 'assets/images/cat_snacks.jpg' },
    { id: 'sn2', title: 'Crispy Wings (6 pcs)', category: 'sides', price: 650, desc: 'Golden fried chicken wings tossed in honey BBQ or spicy buffalo sauce.', tag: '', img: 'https://images.unsplash.com/photo-1567620832903-9fc6debc209f?auto=format&fit=crop&w=600&q=80' },
    { id: 'sn3', title: 'Chicken Nuggets (8 pcs)', category: 'sides', price: 490, desc: 'Crispy white-meat chicken nuggets served with honey mustard sauce.', tag: '', img: 'https://images.unsplash.com/photo-1562967914-608f82629710?auto=format&fit=crop&w=600&q=80' },
    { id: 'sn4', title: 'Golden Onion Rings', category: 'sides', price: 390, desc: 'Thick cut onion rings in crunchy batter served with garlic dip.', tag: '', img: 'https://images.unsplash.com/photo-1639024471283-03518883512d?auto=format&fit=crop&w=600&q=80' },
    { id: 'sn5', title: 'Mozzarella Sticks', category: 'sides', price: 550, desc: 'Gooey melted mozzarella cheese wrapped in herb breadcrumbs.', tag: '', img: 'https://images.unsplash.com/photo-1531749668029-2db88e4276c7?auto=format&fit=crop&w=600&q=80' },

    // Drinks & Refreshers
    { id: 'dr1', title: 'Mint Margarita', category: 'drinks', price: 390, desc: 'Blend of fresh mint leaves, lime juice, lemon-lime soda and crushed ice.', tag: 'REFRESHING', img: 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&w=600&q=80' },
    { id: 'dr2', title: 'Fresh Lemonade', category: 'drinks', price: 290, desc: 'Chilled freshly squeezed lemon juice with a touch of mint syrup.', tag: '', img: 'https://images.unsplash.com/photo-1621263764928-df1444c5e859?auto=format&fit=crop&w=600&q=80' },
    { id: 'dr3', title: 'Peach Iced Tea', category: 'drinks', price: 350, desc: 'Brewed black tea infused with natural peach nectar and fresh ice.', tag: '', img: 'https://images.unsplash.com/photo-1556679343-c7306c1976bc?auto=format&fit=crop&w=600&q=80' },
    { id: 'dr4', title: 'Velvet Cold Coffee', category: 'drinks', price: 450, desc: 'Rich espresso blended with chilled milk, vanilla ice cream, and chocolate.', tag: '', img: 'https://images.unsplash.com/photo-1517701604599-bb29b565090c?auto=format&fit=crop&w=600&q=80' },

    // Desserts
    { id: 'ds1', title: 'Midnight Velvet Shake', category: 'desserts', price: 650, desc: 'Thick, creamy chocolate indulgence with rich cocoa flavor and smooth finish.', tag: 'INDULGENT', img: 'assets/images/midnight_shake.jpg' },
    { id: 'ds2', title: 'Molten Lava Cake', category: 'desserts', price: 750, desc: 'Warm dark chocolate cake with a gooey liquid center, served with ice cream.', tag: 'MUST TRY', img: 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?auto=format&fit=crop&w=600&q=80' },
    { id: 'ds3', title: 'Lotus Biscoff Cheesecake', category: 'desserts', price: 790, desc: 'Creamy cheesecake topped with Biscoff spread crumble and crunchy biscuit.', tag: '', img: 'https://images.unsplash.com/photo-1533134242443-d4fd215305ad?auto=format&fit=crop&w=600&q=80' },
    { id: 'ds4', title: 'Chocolate Fudge Brownie', category: 'desserts', price: 490, desc: 'Dense fudgy chocolate brownie topped with hot chocolate ganache.', tag: '', img: 'https://images.unsplash.com/photo-1564355808539-22fda35bed7e?auto=format&fit=crop&w=600&q=80' }
  ];

  const fullMenuGrid = document.getElementById('fullMenuGrid');
  const menuTabs = document.querySelectorAll('.menu-tab');
  const menuSearchInput = document.getElementById('menuSearchInput');

  function renderMenuItems(items) {
    if (!fullMenuGrid) return;

    if (items.length === 0) {
      fullMenuGrid.innerHTML = `<div style="grid-column: 1/-1; text-align: center; color: var(--text-muted); padding: 40px;">No dishes match your search criteria.</div>`;
      return;
    }

    fullMenuGrid.innerHTML = items.map(item => `
      <div class="glass-card menu-item-card" data-category="${item.category}">
        <div class="menu-item-img-box">
          <img src="${item.img}" alt="${item.title}" class="menu-item-img" onerror="this.onerror=null;this.src='assets/images/combo_solo.jpg';">
        </div>
        <div class="menu-item-body">
          <div>
            <div class="menu-item-cat">${item.category}</div>
            <div class="menu-item-header">
              <h4 class="menu-item-title">${item.title}</h4>
              <span class="menu-item-price">Rs. ${item.price.toLocaleString()}</span>
            </div>
            <p class="menu-item-desc">${item.desc}</p>
          </div>
          <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 12px;">
            ${item.tag ? `<span class="dish-tag" style="position:static; font-size: 0.7rem; padding: 4px 10px;">${item.tag}</span>` : '<span></span>'}
            <button class="btn btn-flame btn-sm add-to-cart-btn" data-id="${item.id}" data-title="${item.title}" data-price="${item.price}">
              <i class="fas fa-plus"></i> Add
            </button>
          </div>
        </div>
      </div>
    `).join('');

    attachAddToCartListeners();
  }

  // Filter Event Listeners
  if (menuTabs) {
    menuTabs.forEach(tab => {
      tab.addEventListener('click', () => {
        menuTabs.forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        const filter = tab.getAttribute('data-filter');
        filterMenu(filter, menuSearchInput ? menuSearchInput.value : '');
      });
    });
  }

  if (menuSearchInput) {
    menuSearchInput.addEventListener('input', (e) => {
      const activeTab = document.querySelector('.menu-tab.active');
      const filter = activeTab ? activeTab.getAttribute('data-filter') : 'all';
      filterMenu(filter, e.target.value);
    });
  }

  function filterMenu(categoryFilter, searchQuery) {
    const query = searchQuery.toLowerCase().trim();
    const filtered = menuData.filter(item => {
      const matchesCat = (categoryFilter === 'all') || (item.category === categoryFilter);
      const matchesSearch = item.title.toLowerCase().includes(query) || item.desc.toLowerCase().includes(query);
      return matchesCat && matchesSearch;
    });
    renderMenuItems(filtered);
  }

  // Initial render
  renderMenuItems(menuData);

  // ------------------------------------------------------------------------
  // 3. Interactive Shopping Cart System
  // ------------------------------------------------------------------------
  let cart = [];

  const cartTrigger = document.querySelector('.cart-trigger');
  const cartOverlay = document.getElementById('cartDrawerOverlay');
  const cartDrawer = document.getElementById('cartDrawer');
  const cartClose = document.getElementById('cartClose');
  const cartBadge = document.querySelector('.cart-badge');
  const cartBody = document.getElementById('cartBody');
  const cartTotalAmount = document.getElementById('cartTotalAmount');
  const checkoutBtn = document.getElementById('checkoutBtn');

  function openCart() {
    if (cartOverlay && cartDrawer) {
      cartOverlay.classList.add('active');
      cartDrawer.classList.add('active');
    }
  }

  function closeCart() {
    if (cartOverlay && cartDrawer) {
      cartOverlay.classList.remove('active');
      cartDrawer.classList.remove('active');
    }
  }

  if (cartTrigger) cartTrigger.addEventListener('click', openCart);
  if (cartClose) cartClose.addEventListener('click', closeCart);
  if (cartOverlay) cartOverlay.addEventListener('click', closeCart);

  function updateCartUI() {
    const totalCount = cart.reduce((sum, item) => sum + item.quantity, 0);
    const totalPrice = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

    if (cartBadge) {
      cartBadge.textContent = totalCount;
      cartBadge.classList.remove('bump');
      void cartBadge.offsetWidth; // trigger reflow
      cartBadge.classList.add('bump');
    }

    if (!cartBody) return;

    if (cart.length === 0) {
      cartBody.innerHTML = `<div class="cart-empty-msg"><i class="fas fa-shopping-bag" style="font-size: 2.5rem; margin-bottom: 12px; opacity:0.4;"></i><p>Your order bag is currently empty.</p></div>`;
    } else {
      cartBody.innerHTML = cart.map(item => `
        <div class="cart-item">
          <div class="cart-item-info">
            <h4>${item.title}</h4>
            <span>Rs. ${(item.price * item.quantity).toLocaleString()}</span>
          </div>
          <div class="cart-item-qty">
            <button class="qty-btn" onclick="changeQty('${item.id}', -1)">-</button>
            <span>${item.quantity}</span>
            <button class="qty-btn" onclick="changeQty('${item.id}', 1)">+</button>
          </div>
        </div>
      `).join('');
    }

    if (cartTotalAmount) {
      cartTotalAmount.textContent = `Rs. ${totalPrice.toLocaleString()}`;
    }
  }

  window.changeQty = function(id, change) {
    const itemIndex = cart.findIndex(i => i.id === id);
    if (itemIndex > -1) {
      cart[itemIndex].quantity += change;
      if (cart[itemIndex].quantity <= 0) {
        cart.splice(itemIndex, 1);
      }
      updateCartUI();
    }
  };

  function addToCart(id, title, price) {
    const existing = cart.find(item => item.id === id);
    if (existing) {
      existing.quantity += 1;
    } else {
      cart.push({ id, title, price: Number(price), quantity: 1 });
    }
    updateCartUI();
    showToast(`Added "${title}" to your order.`);
  }

  function attachAddToCartListeners() {
    document.querySelectorAll('.add-to-cart-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        const id = btn.getAttribute('data-id');
        const title = btn.getAttribute('data-title');
        const price = btn.getAttribute('data-price');
        addToCart(id, title, price);
      });
    });
  }

  // Initial attachment for static buttons (e.g. Signature dishes & combos)
  attachAddToCartListeners();

  if (checkoutBtn) {
    checkoutBtn.addEventListener('click', () => {
      if (cart.length === 0) {
        showToast('Your cart is empty!');
        return;
      }
      showToast('Thank you! Your Velvet Flame order has been submitted successfully.');
      cart = [];
      updateCartUI();
      closeCart();
    });
  }

  // ------------------------------------------------------------------------
  // 4. Contact Form & Toast Notifications
  // ------------------------------------------------------------------------
  const contactForm = document.getElementById('contactForm');
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = document.getElementById('contactName').value;
      showToast(`Thank you ${name}! Your message has been received. Our team will contact you shortly.`);
      contactForm.reset();
    });
  }

  function showToast(message) {
    let container = document.querySelector('.toast-container');
    if (!container) {
      container = document.createElement('div');
      container.className = 'toast-container';
      document.body.appendChild(container);
    }

    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.innerHTML = `<i class="fas fa-fire-flame-curved"></i> <span>${message}</span>`;
    container.appendChild(toast);

    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateX(100%)';
      toast.style.transition = 'all 0.3s ease';
      setTimeout(() => toast.remove(), 300);
    }, 4000);
  }

  // ------------------------------------------------------------------------
  // 5. Scroll Reveal Animations (Re-triggers Every Time on Scroll)
  // ------------------------------------------------------------------------
  const observerOptions = {
    threshold: 0.12,
    rootMargin: '0px 0px -40px 0px'
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
      } else {
        // Remove class so animation re-triggers every single time when scrolling up/down!
        entry.target.classList.remove('revealed');
      }
    });
  }, observerOptions);

  // Automatically observe all section components & cards
  const targetSelector = '.reveal-fade-up, .reveal-fade-left, .reveal-fade-right, .reveal-scale-up, .reveal-flip-up, .glass-card, .dish-card, .why-card, .combo-card, .review-card, .category-card, .section-header, .feature-banner, .story-grid, .contact-grid, .hero-content, .hero-image-wrapper';

  document.querySelectorAll(targetSelector).forEach(el => {
    // If no explicit direction class was assigned in HTML, default to reveal-fade-up
    if (!el.classList.contains('reveal-fade-left') &&
        !el.classList.contains('reveal-fade-right') &&
        !el.classList.contains('reveal-scale-up') &&
        !el.classList.contains('reveal-flip-up') &&
        !el.classList.contains('reveal-fade-up')) {
      el.classList.add('reveal-fade-up');
    }
    observer.observe(el);
  });
});
