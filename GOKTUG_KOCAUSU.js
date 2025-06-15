(function () {
  'use strict';

  let favorites = [];
  let allProducts = null;
  
  const currentPage = window.location.pathname;
  if (currentPage !== '/' && !currentPage.includes('/anasayfa') && currentPage !== '') {
    console.log('wrong page');
    return;
  }

  if (typeof Storage !== 'undefined') {
        try {
        const saved = localStorage.getItem('ebebek_favorites');
         if (saved) {
         favorites = JSON.parse(saved);
          }
     } catch (e) {
     console.log('favoriler okunamadi');
    }
  }

  const startCarousel = () => {
    const addCarouselHTML = () => {
        if (document.querySelector('.ebebek-carousel')) {
            return;
 }

      const carouselHTML = `
        <div class="banner ebebek-carousel">
          <div class="container">
            <div class="carousel-header">
              <h2 class="carousel-title">Beğenebileceğinizi düşündüklerimiz</h2>
            </div>
            <div class="carousel-body">
              <div class="carousel-container">
                <button class="arrow-btn arrow-left">
                  <i class="arrow-icon arrow-icon-left"></i>
                </button>
                <div class="products-wrapper">
                  <div class="products-list"></div>
                </div>
                <button class="arrow-btn arrow-right">
                  <i class="arrow-icon arrow-icon-right"></i>
                </button>
              </div>
            </div>
          </div>
        </div>
      `;

      const div = document.createElement('div');
      div.innerHTML = carouselHTML;

      const sizinIcinSectiklerimiz = Array.from(document.querySelectorAll('.banner')).find(banner => {
        const title = banner.querySelector('.title-primary');
        return title && title.textContent.includes('Sizin için Seçtiklerimiz');
      });

      if (sizinIcinSectiklerimiz) {
        sizinIcinSectiklerimiz.parentNode.insertBefore(div.firstElementChild, sizinIcinSectiklerimiz);
        return;
      }

      const heroSection = document.querySelector('eb-hero-banner-carousel');
      if (heroSection) {
        heroSection.parentNode.insertBefore(div.firstElementChild, heroSection.nextSibling);
      }
    };

   const addStyles = () => {
  const styles = `
    <style>
      .ebebek-carousel {
        background-color: #ffffff;
        padding: 30px 0;
        margin: 30px 0;
        border-radius: 0;
        max-width: 100%;
      }
      .ebebek-carousel .container {
        max-width: 1200px;
        margin: 0 auto;
        padding: 0 15px;
      }
      .ebebek-carousel .carousel-header {
        background-color: #fff8f0;
        padding: 12px 20px;               
        margin: 0 0 20px 0;
        border-radius: 10px;
      }
      .ebebek-carousel .carousel-title {
        font-size: 22px;                  
        font-weight: 700;
        color: #ff6000;
        margin: 0;
        text-align: left;
        font-family: 'Open Sans', sans-serif;
      }
      .ebebek-carousel .carousel-body {
        padding: 0 40px;                  
        position: relative;
      }
      .ebebek-carousel .products-wrapper {
        overflow: hidden;
        width: 100%;
      }
      .ebebek-carousel .products-list {
        display: flex;
        transition: transform 0.3s ease-in-out;
        gap: 14px;                      
      }
      .ebebek-carousel .product-card {
        flex: 0 0 calc(20% - 14px);    
        background: #fff;
        border: 1px solid #ededed;
        border-radius: 10px;
        position: relative;
        transition: box-shadow 0.3s ease;
        cursor: pointer;
      }
      .ebebek-carousel .product-card:hover {
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
      }
      .ebebek-carousel .product-item {
        padding: 5px;
        display: flex;
        flex-direction: column;
        height: 100%;
        font-family: Poppins, cursive;
      }
      .ebebek-carousel .product-image-wrapper {
        position: relative;
        width: 100%;
        height: 250px;
        display: flex;
        align-items: center;
        justify-content: center;
        margin-bottom: 10px;
      }
      .ebebek-carousel .product-image {
        max-width: 100%;
        max-height: 100%;
        object-fit: contain;
      }
      .ebebek-carousel .product-badges {
        position: absolute;
        top: 8px;
        left: 8px;
        z-index: 1;
      }
      .ebebek-carousel .badges-container {
        display: flex;
        flex-direction: column;
        gap: 5px;
      }
      .ebebek-carousel .heart {
        position: absolute;
        top: 8px;
        right: 8px;
        background: white;
        border-radius: 50%;
        width: 36px;
        height: 36px;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        z-index: 3;
        box-shadow: 0 2px 8px rgba(0,0,0,0.15);
      }
      .ebebek-carousel .heart svg {
        stroke: #666;
        width: 20px;
        height: 20px;
      }
      .ebebek-carousel .heart.active svg {
        stroke: #ff6000;
        fill: #ff6000;
      }
       .ebebek-carousel .product-info {
         font-size: 13px;
        line-height: 1.4;
        margin: 0 0 8px 0;
         padding: 0 10px;
        min-height: 50px;
      }
      .ebebek-carousel .product-brand {
        font-weight: 700;
        color: #000;
        font-size: 13px;
      }
      .ebebek-carousel .product-name {
        color: #7d7d7d;
        font-size: 12px;
        margin-top: 2px;
        line-height: 1.3;
        min-height: 38px;                 
        overflow: hidden;
      }
      
      .ebebek-carousel .rating-section {
        display: flex;
        align-items: center;
        padding: 0 10px;
        margin-bottom: 8px;
        gap: 5px;
      }
      .ebebek-carousel .stars { display: flex; gap: 2px; }
      .ebebek-carousel .star { color: #ffc107; font-size: 12px; }
      .ebebek-carousel .star:before { content: "★"; }
      .ebebek-carousel .star.empty { color: #e0e0e0; }
      .ebebek-carousel .review-count {
        font-size: 12px;
        color: #999;
        margin: 0;
      }
      .ebebek-carousel .price-section {
        padding: 0 10px;
        margin-bottom: 10px;
      }
      .ebebek-carousel .old-price {
        text-decoration: line-through;
        color: #999;
        font-size: 14px;
        margin-right: 8px;
      }
      .ebebek-carousel .current-price {
        color: #ff6000;
        font-size: 18px;
        font-weight: 700;
        display: block;
      }
      .ebebek-carousel .discount-badge {
        background: #4caf50;
        color: white;
        padding: 2px 6px;
        border-radius: 4px;
        font-size: 12px;
        font-weight: 600;
        margin-left: 8px;
      }
      .ebebek-carousel .add-to-cart {
        width: calc(100% - 20px);
        background-color: #f28e00;
        color: #fff;
        border: none;
        padding: 12px;
        border-radius: 37.5px;
        font-weight: 700;
        margin: 10px;
        margin-top: auto;
        font-size: 14px;
        cursor: pointer;
        transition: background 0.2s ease;
      }
      .ebebek-carousel .add-to-cart:hover { 
      background-color: #e07e00; 
      }
      .ebebek-carousel .arrow-btn {
        position: absolute;
        top: 50%;
        transform: translateY(-50%);
        background: white;
        border: 1px solid #e0e0e0;
        border-radius: 50%;
        width: 32px; height: 32px;        
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        transition: all 0.2s ease;
        z-index: 2;
      }
      .ebebek-carousel .arrow-left  { left: 10px; }    
      .ebebek-carousel .arrow-right { right: 10px; }
      .ebebek-carousel .arrow-btn:hover  { background: #f5f5f5; border-color: #ff6000; }
      .ebebek-carousel .arrow-btn:disabled{ opacity: 0.3; cursor: not-allowed; }
      .ebebek-carousel .arrow-icon-left:before  { 
      content: "‹"; font-size: 24px; font-weight: bold; }
      .ebebek-carousel .arrow-icon-right:before { content: "›"; font-size: 24px; font-weight: bold; }
      .ebebek-carousel .flex-row { display: flex; align-items: center; }

      
      @media (max-width: 1200px) {
        .ebebek-carousel .product-card { flex: 0 0 calc(25% - 14px); } 
        .ebebek-carousel .carousel-body { padding: 0 40px; }
      }
      @media (max-width: 992px) {
        .ebebek-carousel .product-card { flex: 0 0 calc(25% - 12px); }  
        .ebebek-carousel .carousel-body { padding: 0 30px; }
      }
      @media (max-width: 768px) {
        .ebebek-carousel .product-card { flex: 0 0 calc(50% - 10px); }
        .ebebek-carousel .carousel-body { padding: 0 20px; }
        .ebebek-carousel .arrow-left  { left: 5px; }
        .ebebek-carousel .arrow-right { right: 5px; }
      }
      @media (max-width: 480px) {
        .ebebek-carousel .carousel-title { font-size: 1rem; }
        .ebebek-carousel .product-image-wrapper { height: 200px; }
      }
    </style>
  `;
  document.head.insertAdjacentHTML('beforeend', styles);
};


    const makeProductCard = (product) => {
        const productName = (product.name || product.title || '').trim();
  console.log('[CARD]', product.id, productName);
      const isFav = favorites.includes(product.id);
 const hasDiscount = product.price !== product.original_price;
      const discount = hasDiscount ? Math.round((1 - product.price / product.original_price) * 100) : 0;

      const card = document.createElement('div');
      card.className = 'product-card';
      card.dataset.productId = product.id;

      let badges = '';
      if (Math.random() > 0.5) {
        badges = `
          <div class="product-badges" style="z-index: 1;">
            <span class="badges-container">
              <img alt="Popular" loading="lazy" src="https://www.e-bebek.com/assets/images/cok-satan.png" style="width: 60px; height: auto; margin-bottom: 5px;">
              ${Math.random() > 0.5 ? '<img alt="Popular" loading="lazy" src="https://www.e-bebek.com/assets/images/yildiz-urun.png" style="width: 60px; height: auto;">' : ''}
            </span>
          </div>
        `;
      }

      card.innerHTML = `
        <div class="product-item">
          <figure class="product-image-wrapper">
            ${badges}
            <div class="heart ${isFav ? 'active' : ''}" data-product-id="${product.id}">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
               </svg>
               </div>
            <img class="product-image" src="${product.img || product.image || ''}" alt="${product.name}" loading="lazy" onerror="this.onerror=null; this.src='data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%22200%22 height=%22200%22 viewBox=%220 0 200 200%22%3E%3Crect width=%22200%22 height=%22200%22 fill=%22%23f0f0f0%22/%3E%3Ctext x=%2250%25%22 y=%2250%25%22 text-anchor=%22middle%22 dy=%22.3em%22 fill=%22%23999%22 font-size=%2216%22 font-family=%22Arial%22%3ENo Image%3C/text%3E%3C/svg%3E'">
           </figure>
          <div class="product-info">
             <div class="product-brand">${product.brand} -</div>
       <div class="product-name">${productName}</div>


     </div>
          <div class="rating-section">
            <div class="stars">${makeStars(4 + Math.random())}</div>
            <p class="review-count">(${Math.floor(Math.random() * 500) + 1})</p>
           </div>
          <div class="price-section">
            ${hasDiscount ? `
              <div class="flex-row">
                <span class="old-price">${formatMoney(product.original_price)}</span>
                <span class="discount-badge">%${discount} <i>↓</i></span>
              </div>
            ` : ''}
            <span class="current-price">${formatMoney(product.price)}</span>
           </div>
           <button class="add-to-cart">Sepete Ekle</button>
     </div>
      `;

      card.addEventListener('click', (e) => {
        if (!e.target.closest('.heart') && !e.target.closest('.add-to-cart')) {
          window.open(product.url || '#', '_blank');
        }
      });


      const heartButton = card.querySelector('.heart');
      heartButton.addEventListener('click', (e) => {
        e.stopPropagation();
        addOrRemoveFavorite(product.id);
        heartButton.classList.toggle('active');
      });


return card;

    };

    const makeStars = (rating) => {
      const fullStars = Math.floor(rating);
      const stars = [];

      for (let i = 0; i < 5; i++) {
        stars.push(`<i class="star${i < fullStars ? '' : ' empty'}"></i>`);
      }

      return stars.join('');
    };

    const formatMoney = (price) => {
      return price.toLocaleString('tr-TR', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
      }) + ' TL';
    };

    const addOrRemoveFavorite = (productId) => {
      const index = favorites.indexOf(productId);
      if (index > -1) {
        favorites.splice(index, 1);
      } else {
        favorites.push(productId);
      }

      if (typeof Storage !== 'undefined') {
        try {
          localStorage.setItem('ebebek_favorites', JSON.stringify(favorites));
        } catch (e) {
          console.log('favoriler kaydedilemedi');
        }
      }
    };

    const makeCarousel = (products) => {
      const track = document.querySelector('.ebebek-carousel .products-list');
      const leftButton = document.querySelector('.ebebek-carousel .arrow-left');
      const rightButton = document.querySelector('.ebebek-carousel .arrow-right');

      if (!track || !leftButton || !rightButton) {
        return;
      }

      track.innerHTML = '';
      products.forEach(product => {
        track.appendChild(makeProductCard(product));
      });

      let currentPosition = 0;
      const itemsVisible = getVisibleItems();
      const maxPosition = Math.max(0, products.length - itemsVisible);

      const moveCarousel = () => {
        const cardWidth = track.firstElementChild?.offsetWidth || 200;
        const gap = 20;
        const moveDistance = currentPosition * (cardWidth + gap);
        track.style.transform = `translateX(-${moveDistance}px)`;

        leftButton.disabled = currentPosition === 0;
        rightButton.disabled = currentPosition >= maxPosition;
      };

      leftButton.addEventListener('click', () => {
        if (currentPosition > 0) {
          currentPosition--;
          moveCarousel();
        }
      });

      rightButton.addEventListener('click', () => {
        if (currentPosition < maxPosition) {
          currentPosition++;
          moveCarousel();
        }
      });

      let resizeTimer;
      window.addEventListener('resize', () => {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(() => {
          currentPosition = 0;
          moveCarousel();
        }, 250);
      });

      moveCarousel();

    };

    const getVisibleItems = () => {
      const width = window.innerWidth;
      if (width <= 480) return 2;
      if (width <= 768) return 2;
      if (width <= 992) return 3;
      if (width <= 1200) return 4;
      return 5;
    };

    const getProducts = async () => {
      const cached = localStorage.getItem('ebebek_products');
      if (cached) {
        try {
          const products = JSON.parse(cached);
           if (!products[0]?.name) throw new Error('old cache');
            return products;
        } catch (e) {
          localStorage.removeItem('ebebek_products');
        }
      }

      try {
        const response = await fetch('https://gist.githubusercontent.com/sevindi/8bcbde9f02c1d4abe112809c974e1f49/raw/9bf93b58df623a9b16f1db721cd0a7a539296cf0/products.json');
        const data = await response.json();
        localStorage.setItem('ebebek_products', JSON.stringify(data));
        return data;
      } catch (error) {
        console.log('urunler yuklenemedi');
        return [];
      }
    };

    const run = async () => {
      try {
        addStyles();
        addCarouselHTML();
        const products = await getProducts();
        if (products.length > 0) {
          makeCarousel(products);
        }
      } catch (error) {
        console.log('bir hata oluştu');
      }
    };

    run();
  };

  const watchForElement = () => {
    const observer = new MutationObserver((mutations) => {
      const targetElement = Array.from(document.querySelectorAll('.banner')).find(banner => {
        const title = banner.querySelector('.title-primary');
        return title && title.textContent.includes('Sizin için Seçtiklerimiz');
      });

      if (targetElement && !document.querySelector('.ebebek-carousel')) {
        startCarousel();
      }
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true
    });
  };
  
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      setTimeout(startCarousel, 1000);
      watchForElement();
    });
  } else {
    setTimeout(startCarousel, 1000);
    watchForElement();
  }
})();