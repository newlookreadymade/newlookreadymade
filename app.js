/* ==========================================================================
   NEW LOOK READYMADE - Salemabad | JavaScript Master Logic
   Includes: Dynamic Catalog, Search, Filters, Wishlist, Cart Drawer,
   Customer Checkout Modal (Address + Payment Modes: UPI/COD + Order Success),
   Admin Panel Management System AND Circular Store Owner Profile Manager!
   ========================================================================== */

const INITIAL_PRODUCTS = [
  {
    id: 1,
    title: "Premium Men's Cotton Formal Shirt",
    category: "men",
    price: 899,
    mrp: 1499,
    discount: "40% OFF",
    sizes: ["M", "L", "XL", "XXL"],
    image: "mens_shirt.jpg",
    tag: "BESTSELLER",
    description: "High-grade 100% pure breathable cotton formal shirt. Perfect for office, weddings, and special events."
  },
  {
    id: 2,
    title: "Women's Designer Embroidered Kurti Set",
    category: "women",
    price: 1299,
    mrp: 2199,
    discount: "41% OFF",
    sizes: ["S", "M", "L", "XL"],
    image: "womens_kurti.jpg",
    tag: "NEW ARRIVAL",
    description: "Elegant silk blend Kurti featuring royal zari gold thread work with matching dupatta."
  },
  {
    id: 3,
    title: "Royal Men's Silk Ethnic Kurta Pajama",
    category: "men",
    price: 1499,
    mrp: 2499,
    discount: "40% OFF",
    sizes: ["M", "L", "XL"],
    image: "mens_kurta.jpg",
    tag: "FESTIVE SPECIAL",
    description: "Rich navy blue silk kurta set with detailed collar embroidery. Ideal for weddings and festivals."
  },
  {
    id: 4,
    title: "Festive Kids Boys & Girls Party Wear",
    category: "kids",
    price: 999,
    mrp: 1799,
    discount: "44% OFF",
    sizes: ["24", "28", "32", "36"],
    image: "kids_wear.jpg",
    tag: "POPULAR",
    description: "Soft, comfortable, and charming traditional outfit set designed for kids with skin-friendly lining."
  }
];

// STATE MANAGEMENT
let products = JSON.parse(localStorage.getItem('nlr_products')) || INITIAL_PRODUCTS;
let cart = JSON.parse(localStorage.getItem('nlr_cart')) || [];
let wishlist = JSON.parse(localStorage.getItem('nlr_wishlist')) || [];
let ordersLog = JSON.parse(localStorage.getItem('nlr_orders_log')) || [];
let adminPin = localStorage.getItem('nlr_admin_pin') || "8503";
let ownerPhoto = localStorage.getItem('nlr_owner_photo') || "owner.png";

let activeCategory = 'all';
let searchQuery = '';

// DOM ELEMENTS
const productGrid = document.getElementById('product-grid');
const cartBadge = document.getElementById('cart-badge');
const wishlistBadge = document.getElementById('wishlist-badge');
const searchInput = document.getElementById('search-input');
const filterBtns = document.querySelectorAll('.filter-btn');
const mobileToggle = document.getElementById('mobile-toggle');
const mobileOverlay = document.getElementById('mobile-overlay');
const closeDrawerBtn = document.getElementById('close-drawer');
const cartBtn = document.getElementById('cart-btn');
const cartOverlay = document.getElementById('cart-overlay');
const closeCartBtn = document.getElementById('close-cart');
const cartBody = document.getElementById('cart-body');
const cartSubtotalEl = document.getElementById('cart-subtotal');
const checkoutBtn = document.getElementById('checkout-btn');

// MODALS
const modalOverlay = document.getElementById('modal-overlay');
const modalBody = document.getElementById('modal-body');
const checkoutModalOverlay = document.getElementById('checkout-modal-overlay');
const closeCheckoutBtn = document.getElementById('close-checkout');

// ADMIN DOM ELEMENTS
const adminBtn = document.getElementById('admin-btn');
const adminModalOverlay = document.getElementById('admin-modal-overlay');
const adminLoginSec = document.getElementById('admin-login-sec');
const adminPanelSec = document.getElementById('admin-panel-sec');
const adminPinInput = document.getElementById('admin-pin-input');
const adminLoginBtn = document.getElementById('admin-login-btn');
const closeAdminBtn = document.getElementById('close-admin');

// INITIALIZE APP
document.addEventListener('DOMContentLoaded', () => {
  loadOwnerProfilePhoto();
  renderProducts();
  updateBadges();
  setupEventListeners();
  setupCheckoutListeners();
  setupAdminListeners();
});

function loadOwnerProfilePhoto() {
  const headerImg = document.getElementById('header-owner-img');
  const heroImg = document.getElementById('hero-owner-img');
  if (headerImg) headerImg.src = ownerPhoto;
  if (heroImg) heroImg.src = ownerPhoto;
}

// EVENT LISTENERS SETUP
function setupEventListeners() {
  if (mobileToggle) {
    mobileToggle.addEventListener('click', () => mobileOverlay.classList.add('active'));
  }
  if (closeDrawerBtn) {
    closeDrawerBtn.addEventListener('click', () => mobileOverlay.classList.remove('active'));
  }
  if (mobileOverlay) {
    mobileOverlay.addEventListener('click', (e) => {
      if (e.target === mobileOverlay) mobileOverlay.classList.remove('active');
    });
  }

  if (cartBtn) {
    cartBtn.addEventListener('click', () => {
      renderCartDrawer();
      cartOverlay.classList.add('active');
    });
  }
  if (closeCartBtn) {
    closeCartBtn.addEventListener('click', () => cartOverlay.classList.remove('active'));
  }
  if (cartOverlay) {
    cartOverlay.addEventListener('click', (e) => {
      if (e.target === cartOverlay) cartOverlay.classList.remove('active');
    });
  }

  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      searchQuery = e.target.value.toLowerCase().trim();
      renderProducts();
    });
  }

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      activeCategory = btn.getAttribute('data-category');
      renderProducts();
    });
  });

  if (checkoutBtn) {
    checkoutBtn.addEventListener('click', () => {
      if (cart.length === 0) {
        alert('आपकी कार्ट खाली है! कृपया पहले अपनी पसंद के कपड़े जोड़ें।');
        return;
      }
      cartOverlay.classList.remove('active');
      openCheckoutModal();
    });
  }
}

// RENDER PRODUCTS
function renderProducts() {
  if (!productGrid) return;

  const filtered = products.filter(product => {
    const matchesCategory = (activeCategory === 'all') || (product.category === activeCategory);
    const matchesSearch = product.title.toLowerCase().includes(searchQuery) || 
                          product.category.toLowerCase().includes(searchQuery);
    return matchesCategory && matchesSearch;
  });

  if (filtered.length === 0) {
    productGrid.innerHTML = `
      <div style="grid-column: 1/-1; text-align:center; padding:50px 20px; color:#64748b;">
        <div style="font-size:3rem; margin-bottom:10px;">🔍</div>
        <h3>कोई प्रोडक्ट नहीं मिला</h3>
        <p>कृपया दूसरा कीवर्ड या कैटेगरी सर्च करके देखें।</p>
      </div>
    `;
    return;
  }

  productGrid.innerHTML = filtered.map(product => {
    const isWishlisted = wishlist.includes(product.id);
    const whatsappMsg = encodeURIComponent(
      `Namaste New Look Readymade, mujhe is product ke baare mein enquiry karni hai:\n\n*${product.title}*\nPrice: ₹${product.price}\nSalemabad Shop`
    );

    const imgSrc = product.image || 'logo.png';

    return `
      <div class="product-card">
        <div class="product-image-wrap">
          <span class="product-tag">${product.tag || 'POPULAR'}</span>
          <button class="wishlist-btn ${isWishlisted ? 'active' : ''}" onclick="toggleWishlist(${product.id})" title="Wishlist">
            ${isWishlisted ? '❤️' : '🤍'}
          </button>
          <img src="${imgSrc}" alt="${product.title}" loading="lazy" onerror="this.onerror=null; this.src='logo.png';">
        </div>
        <div class="product-details">
          <span class="product-category-lbl">${product.category.toUpperCase()} COLLECTION</span>
          <h4 class="product-title">${product.title}</h4>
          <div class="size-pills">
            ${(product.sizes || ['M', 'L']).map(s => `<span class="size-pill">Size: ${s}</span>`).join('')}
          </div>
          <div class="product-price-row">
            <span class="current-price">₹${product.price}</span>
            <span class="original-price">₹${product.mrp || Math.round(product.price * 1.4)}</span>
            <span class="discount-badge">${product.discount || 'OFFER'}</span>
          </div>
          <div class="product-actions">
            <button class="btn btn-outline btn-sm" onclick="openQuickView(${product.id})">🔍 Details</button>
            <a class="btn btn-whatsapp btn-sm" href="https://wa.me/918503090848?text=${whatsappMsg}" target="_blank">
              📲 Order
            </a>
          </div>
        </div>
      </div>
    `;
  }).join('');
}

function toggleWishlist(productId) {
  const index = wishlist.indexOf(productId);
  if (index > -1) {
    wishlist.splice(index, 1);
  } else {
    wishlist.push(productId);
  }
  localStorage.setItem('nlr_wishlist', JSON.stringify(wishlist));
  updateBadges();
  renderProducts();
}

function openQuickView(productId) {
  const product = products.find(p => p.id === productId);
  if (!product) return;

  const defaultSize = (product.sizes && product.sizes.length > 0) ? product.sizes[0] : "M";
  const whatsappMsg = encodeURIComponent(
    `Namaste New Look Readymade, mujhe order karna hai:\n*Product*: ${product.title}\n*Price*: ₹${product.price}\n*Size*: ${defaultSize}\nAddress: Salemabad`
  );

  modalBody.innerHTML = `
    <div class="modal-content">
      <button class="close-modal" onclick="closeModal()">✕</button>
      <div class="modal-img-container">
        <img src="${product.image}" alt="${product.title}" onerror="this.onerror=null; this.src='logo.png';">
      </div>
      <div class="modal-details-container">
        <span class="product-category-lbl">${product.category.toUpperCase()} • ${product.tag || 'SPECIAL'}</span>
        <h2 style="font-family:'Playfair Display',serif; font-size:1.6rem; margin:6px 0 12px;">${product.title}</h2>
        <div class="product-price-row" style="margin-bottom:12px;">
          <span class="current-price" style="font-size:1.5rem;">₹${product.price}</span>
          <span class="original-price" style="font-size:1.1rem;">₹${product.mrp || Math.round(product.price * 1.4)}</span>
          <span class="discount-badge">${product.discount || 'OFFER'}</span>
        </div>
        <p style="color:#64748b; font-size:0.92rem; margin-bottom:20px;">${product.description || 'New Look Readymade Salemabad Premium Quality Ready-Made Apparel.'}</p>
        
        <div style="margin-bottom:20px;">
          <label style="font-weight:700; font-size:0.88rem; display:block; margin-bottom:8px;">AVAILABLE SIZES:</label>
          <div style="display:flex; gap:8px;">
            ${(product.sizes || ['M', 'L', 'XL']).map((size, i) => `
              <button class="filter-btn ${i === 0 ? 'active' : ''}" style="padding:6px 14px; font-size:0.85rem;" onclick="selectModalSize(this, '${size}')">${size}</button>
            `).join('')}
          </div>
        </div>

        <div style="display:flex; gap:12px;">
          <button class="btn btn-gold" style="flex:1;" onclick="addToCart(${product.id})">🛒 Add to Cart</button>
          <button class="btn btn-whatsapp" style="flex:1.2;" onclick="directCheckoutSingleItem(${product.id})">
            💳 Order Now
          </button>
        </div>
      </div>
    </div>
  `;

  modalOverlay.classList.add('active');
}

function closeModal() {
  modalOverlay.classList.remove('active');
}

function selectModalSize(btn, size) {
  const parent = btn.parentElement;
  parent.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
}

function addToCart(productId) {
  const existing = cart.find(item => item.id === productId);
  if (existing) {
    existing.qty += 1;
  } else {
    const product = products.find(p => p.id === productId);
    cart.push({ ...product, qty: 1, selectedSize: (product.sizes && product.sizes[0]) || 'M' });
  }
  localStorage.setItem('nlr_cart', JSON.stringify(cart));
  updateBadges();
  renderCartDrawer();
  closeModal();
  cartOverlay.classList.add('active');
}

function updateCartQty(productId, change) {
  const item = cart.find(i => i.id === productId);
  if (!item) return;
  item.qty += change;
  if (item.qty <= 0) {
    cart = cart.filter(i => i.id !== productId);
  }
  localStorage.setItem('nlr_cart', JSON.stringify(cart));
  updateBadges();
  renderCartDrawer();
}

function renderCartDrawer() {
  if (!cartBody) return;

  if (cart.length === 0) {
    cartBody.innerHTML = `
      <div class="cart-empty-msg">
        <div style="font-size:3.5rem; margin-bottom:12px;">🛍️</div>
        <h4>आपकी कार्ट खाली है</h4>
        <p style="font-size:0.85rem; margin-top:4px;">न्यू कलेक्शन एक्सप्लोर करें और अपने पसंदीदा कपड़े ऐड करें!</p>
      </div>
    `;
    cartSubtotalEl.innerText = '₹0';
    return;
  }

  let total = 0;
  cartBody.innerHTML = cart.map(item => {
    const itemTotal = item.price * item.qty;
    total += itemTotal;
    return `
      <div class="cart-item">
        <img src="${item.image}" class="cart-item-img" alt="${item.title}" onerror="this.onerror=null; this.src='logo.png';">
        <div class="cart-item-info">
          <div class="cart-item-title">${item.title}</div>
          <div class="cart-item-meta">Size: ${item.selectedSize || 'Standard'} • ₹${item.price}</div>
          <div class="cart-item-price">₹${itemTotal}</div>
        </div>
        <div class="cart-item-qty">
          <button class="qty-btn" onclick="updateCartQty(${item.id}, -1)">-</button>
          <span>${item.qty}</span>
          <button class="qty-btn" onclick="updateCartQty(${item.id}, 1)">+</button>
        </div>
      </div>
    `;
  }).join('');

  cartSubtotalEl.innerText = `₹${total}`;
}

function updateBadges() {
  const totalCartQty = cart.reduce((acc, i) => acc + i.qty, 0);
  if (cartBadge) cartBadge.innerText = totalCartQty;
  if (wishlistBadge) wishlistBadge.innerText = wishlist.length;
}

/* ==========================================================================
   CUSTOMER CHECKOUT & PAYMENT MODES ENGINE
   ========================================================================== */

function setupCheckoutListeners() {
  if (closeCheckoutBtn) {
    closeCheckoutBtn.addEventListener('click', closeCheckoutModal);
  }

  const checkoutForm = document.getElementById('customer-checkout-form');
  if (checkoutForm) {
    checkoutForm.addEventListener('submit', processCustomerOrderSubmit);
  }
}

function openCheckoutModal() {
  renderCheckoutOrderSummary();
  checkoutModalOverlay.classList.add('active');
  document.getElementById('checkout-form-sec').style.display = 'block';
  document.getElementById('checkout-success-sec').style.display = 'none';
}

function closeCheckoutModal() {
  checkoutModalOverlay.classList.remove('active');
}

function directCheckoutSingleItem(productId) {
  addToCart(productId);
  cartOverlay.classList.remove('active');
  openCheckoutModal();
}

function renderCheckoutOrderSummary() {
  const summaryBox = document.getElementById('checkout-order-summary');
  if (!summaryBox) return;

  let total = 0;
  const itemsHtml = cart.map(item => {
    const itemTotal = item.price * item.qty;
    total += itemTotal;
    return `
      <div style="display:flex; justify-content:space-between; font-size:0.88rem; margin-bottom:6px;">
        <span>${item.title} (Size: ${item.selectedSize}, Qty: ${item.qty})</span>
        <b>₹${itemTotal}</b>
      </div>
    `;
  }).join('');

  summaryBox.innerHTML = `
    <div style="background:#f8fafc; border:1px solid #e2e8f0; border-radius:8px; padding:12px; margin-bottom:15px;">
      <h4 style="font-size:0.95rem; margin-bottom:8px;">📦 Order Items Summary:</h4>
      ${itemsHtml}
      <hr style="margin:10px 0; border:none; border-top:1px dashed #cbd5e1;">
      <div style="display:flex; justify-content:space-between; font-weight:800; font-size:1.1rem;">
        <span>Total Payable Amount:</span>
        <span style="color:#0f172a;">₹${total}</span>
      </div>
      <div style="font-size:0.75rem; color:#16a34a; font-weight:bold; margin-top:4px;">
        🚚 Salemabad City Limits में Home Delivery बिल्कुल FREE!
      </div>
    </div>
  `;
}

function togglePaymentMethodDetails(method) {
  const upiSec = document.getElementById('upi-details-sec');
  const codSec = document.getElementById('cod-details-sec');
  
  if (method === 'UPI') {
    upiSec.style.display = 'block';
    codSec.style.display = 'none';
  } else {
    upiSec.style.display = 'none';
    codSec.style.display = 'block';
  }
}

function processCustomerOrderSubmit(e) {
  e.preventDefault();

  const custName = document.getElementById('cust-name').value.trim();
  const custPhone = document.getElementById('cust-phone').value.trim();
  const custAddress = document.getElementById('cust-address').value.trim();
  const custCity = document.getElementById('cust-city').value.trim() || 'Salemabad';
  const paymentMode = document.querySelector('input[name="payment_method"]:checked').value;

  if (!custName || !custPhone || !custAddress) {
    alert('कृपया अपना नाम, मोबाइल नंबर और डिलीवरी एड्रेस पूरा दर्ज करें।');
    return;
  }

  let totalAmount = 0;
  cart.forEach(item => totalAmount += (item.price * item.qty));

  const orderId = 'NLR-' + Math.floor(100000 + Math.random() * 900000);
  const orderDate = new Date().toLocaleString('hi-IN');

  const newOrderObj = {
    orderId,
    date: orderDate,
    customerName: custName,
    phone: custPhone,
    address: `${custAddress}, ${custCity}`,
    paymentMode,
    items: [...cart],
    total: totalAmount
  };

  ordersLog.unshift(newOrderObj);
  localStorage.setItem('nlr_orders_log', JSON.stringify(ordersLog));

  let text = `🛍️ *NEW LOOK READYMADE - ORDER RECEIPT*\n`;
  text += `-----------------------------------\n`;
  text += `📋 *Order ID*: ${orderId}\n`;
  text += `📅 *Date*: ${orderDate}\n`;
  text += `👤 *Customer*: ${custName}\n`;
  text += `📞 *Phone*: ${custPhone}\n`;
  text += `📍 *Delivery Address*: ${custAddress}, ${custCity}\n`;
  text += `💳 *Payment Mode*: ${paymentMode === 'UPI' ? 'Online UPI Payment (GPay/PhonePe)' : 'Cash on Delivery (COD)'}\n`;
  text += `-----------------------------------\n*ORDERED ITEMS*:\n`;

  cart.forEach((item, index) => {
    text += `${index + 1}. *${item.title}*\n   Size: ${item.selectedSize} | Qty: ${item.qty} | Price: ₹${item.price * item.qty}\n`;
  });

  text += `-----------------------------------\n`;
  text += `💰 *TOTAL AMOUNT*: ₹${totalAmount}\n`;
  text += `🚚 *Status*: Order Placed (Home Delivery Salemabad)\n`;

  document.getElementById('checkout-form-sec').style.display = 'none';
  const successSec = document.getElementById('checkout-success-sec');
  
  successSec.innerHTML = `
    <div style="text-align:center; padding:20px 10px;">
      <div style="font-size:4rem; color:#10b981; margin-bottom:10px;">🎉</div>
      <h2 style="font-family:'Playfair Display',serif; color:#0f172a; margin-bottom:6px;">ऑर्डर सफलतापूर्वक प्राप्त हुआ!</h2>
      <p style="color:#64748b; font-size:0.95rem; margin-bottom:18px;">
        धन्यवाद <b>${custName}</b>! आपका ऑर्डर नंबर <b>${orderId}</b> सहेज लिया गया है।
      </p>

      <div style="background:#f8fafc; border:1px solid #e2e8f0; border-radius:12px; padding:15px; text-align:left; margin-bottom:20px; font-size:0.9rem;">
        <div><b>कुल बिल (Total)</b>: ₹${totalAmount}</div>
        <div><b>पेमेंट का माध्यम</b>: ${paymentMode === 'UPI' ? '💳 Online UPI (Google Pay/PhonePe/Paytm)' : '💵 Cash on Delivery (COD)'}</div>
        <div><b>डिलीवरी पता</b>: ${custAddress}, ${custCity}</div>
        <div><b>संपर्क नंबर</b>: ${custPhone}</div>
      </div>

      <div style="display:flex; flex-direction:column; gap:10px;">
        <a class="btn btn-whatsapp" style="width:100%; font-size:1.05rem;" href="https://wa.me/918503090848?text=${encodeURIComponent(text)}" target="_blank">
          📲 WhatsApp पर रसीद (Receipt) सेंड करें
        </a>
        <button class="btn btn-outline" style="color:#111; border-color:#cbd5e1;" onclick="closeCheckoutModal()">
          🛍️ और शॉपिंग करें
        </button>
      </div>
    </div>
  `;

  successSec.style.display = 'block';

  cart = [];
  localStorage.setItem('nlr_cart', JSON.stringify(cart));
  updateBadges();
  renderCartDrawer();
}

/* ==========================================================================
   ADMIN PANEL & OWNER CIRCULAR AVATAR ENGINE
   ========================================================================== */

function setupAdminListeners() {
  if (adminBtn) {
    adminBtn.addEventListener('click', (e) => {
      e.preventDefault();
      openAdminModal();
    });
  }

  if (closeAdminBtn) {
    closeAdminBtn.addEventListener('click', closeAdminModal);
  }

  if (adminLoginBtn) {
    adminLoginBtn.addEventListener('click', handleAdminLogin);
  }

  if (adminPinInput) {
    adminPinInput.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') handleAdminLogin();
    });
  }

  const addProductForm = document.getElementById('add-product-form');
  if (addProductForm) {
    addProductForm.addEventListener('submit', handleAddNewProduct);
  }

  const imgFileInput = document.getElementById('admin-prod-file');
  if (imgFileInput) {
    imgFileInput.addEventListener('change', (e) => {
      const file = e.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = function(evt) {
          document.getElementById('admin-prod-imgurl').value = evt.target.result;
          document.getElementById('img-preview-box').innerHTML = `
            <img src="${evt.target.result}" style="max-height:100px; border-radius:8px; margin-top:8px;">
          `;
        };
        reader.readAsDataURL(file);
      }
    });
  }

  // Owner Photo File Upload Handler
  const ownerFileInput = document.getElementById('admin-owner-file');
  if (ownerFileInput) {
    ownerFileInput.addEventListener('change', (e) => {
      const file = e.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = function(evt) {
          document.getElementById('admin-owner-url').value = evt.target.result;
        };
        reader.readAsDataURL(file);
      }
    });
  }
}

function openAdminModal() {
  adminModalOverlay.classList.add('active');
  adminLoginSec.style.display = 'block';
  adminPanelSec.style.display = 'none';
  if (adminPinInput) adminPinInput.value = '';
}

function closeAdminModal() {
  adminModalOverlay.classList.remove('active');
}

function handleAdminLogin() {
  const enteredPin = adminPinInput.value.trim();
  if (enteredPin === adminPin) {
    adminLoginSec.style.display = 'none';
    adminPanelSec.style.display = 'block';
    renderAdminInventoryList();
    renderAdminOrdersList();
  } else {
    alert('❌ गलत Admin PIN! डिफ़ॉल्ट PIN 8503 दर्ज करें।');
  }
}

function switchAdminTab(tabName) {
  document.querySelectorAll('.admin-tab-content').forEach(t => t.style.display = 'none');
  document.querySelectorAll('.admin-tab-btn').forEach(b => b.classList.remove('active'));

  document.getElementById(`admin-tab-${tabName}`).style.display = 'block';
  event.target.classList.add('active');
}

function handleAddNewProduct(e) {
  e.preventDefault();

  const title = document.getElementById('admin-prod-title').value.trim();
  const category = document.getElementById('admin-prod-category').value;
  const price = parseFloat(document.getElementById('admin-prod-price').value);
  const mrp = parseFloat(document.getElementById('admin-prod-mrp').value) || (price * 1.4);
  const tag = document.getElementById('admin-prod-tag').value || 'NEW ARRIVAL';
  let image = document.getElementById('admin-prod-imgurl').value.trim();
  const description = document.getElementById('admin-prod-desc').value.trim();

  const sizes = [];
  document.querySelectorAll('.admin-size-cb:checked').forEach(cb => sizes.push(cb.value));

  if (!title || !price) {
    alert('कृपया प्रोडक्ट का नाम और कीमत सही दर्ज करें।');
    return;
  }

  if (!image) {
    image = 'mens_shirt.jpg';
  }

  const discountPercent = Math.round(((mrp - price) / mrp) * 100);

  const newProduct = {
    id: Date.now(),
    title,
    category,
    price,
    mrp,
    discount: `${discountPercent}% OFF`,
    sizes: sizes.length > 0 ? sizes : ["M", "L", "XL"],
    image,
    tag,
    description: description || "New Look Readymade Salemabad Premium Quality Ready-Made Apparel."
  };

  products.unshift(newProduct);
  localStorage.setItem('nlr_products', JSON.stringify(products));

  alert(`✅ शानदार! "${title}" सफलता से आपकी दुकान पर लाइव जोड़ दिया गया है।`);
  
  document.getElementById('add-product-form').reset();
  document.getElementById('img-preview-box').innerHTML = '';
  
  renderProducts();
  renderAdminInventoryList();
  switchAdminTab('inventory');
}

function renderAdminInventoryList() {
  const container = document.getElementById('admin-inventory-list');
  if (!container) return;

  if (products.length === 0) {
    container.innerHTML = `<p style="text-align:center; color:#94a3b8; padding:20px;">कोई प्रोडक्ट उपलब्ध नहीं है।</p>`;
    return;
  }

  container.innerHTML = products.map(p => `
    <div style="display:flex; align-items:center; justify-content:space-between; padding:12px; border-bottom:1px solid #e2e8f0; background:#fff; margin-bottom:8px; border-radius:8px;">
      <div style="display:flex; align-items:center; gap:12px;">
        <img src="${p.image}" style="width:48px; height:48px; border-radius:6px; object-fit:cover;" onerror="this.onerror=null; this.src='logo.png';">
        <div>
          <b style="font-size:0.95rem;">${p.title}</b>
          <div style="font-size:0.8rem; color:#64748b;">Category: ${p.category.toUpperCase()} | ₹${p.price} (MRP: ₹${p.mrp})</div>
        </div>
      </div>
      <button onclick="deleteProductByAdmin(${p.id})" style="background:#ef4444; color:white; border:none; padding:6px 12px; border-radius:6px; cursor:pointer; font-size:0.8rem;">
        🗑️ बताएं/हताएं
      </button>
    </div>
  `).join('');
}

function deleteProductByAdmin(productId) {
  if (confirm('क्या आप वाकई इस प्रोडक्ट को दुकान से हटाना चाहते हैं?')) {
    products = products.filter(p => p.id !== productId);
    localStorage.setItem('nlr_products', JSON.stringify(products));
    renderProducts();
    renderAdminInventoryList();
  }
}

function renderAdminOrdersList() {
  const container = document.getElementById('admin-orders-list');
  if (!container) return;

  if (ordersLog.length === 0) {
    container.innerHTML = `<p style="text-align:center; color:#94a3b8; padding:20px;">अभी तक कोई ग्राहक ऑर्डर दर्ज नहीं हुआ है।</p>`;
    return;
  }

  container.innerHTML = ordersLog.map((order, i) => `
    <div style="background:#fff; border:1px solid #e2e8f0; border-radius:8px; padding:15px; margin-bottom:12px;">
      <div style="display:flex; justify-content:space-between; font-weight:700; margin-bottom:6px;">
        <span>ऑर्डर #${order.orderId || (ordersLog.length - i)}</span>
        <span style="color:#64748b; font-size:0.82rem;">${order.date}</span>
      </div>
      <div style="font-size:0.88rem; font-weight:bold; color:#0f172a; margin-bottom:4px;">
        👤 ग्राहक: ${order.customerName} (${order.phone})
      </div>
      <div style="font-size:0.82rem; color:#475569; margin-bottom:6px;">
        📍 पता: ${order.address} | Payment: <b>${order.paymentMode}</b>
      </div>
      <div style="font-size:0.85rem; color:#334155; margin-bottom:8px;">
        ${order.items.map(item => `• ${item.title} (Size: ${item.selectedSize}, Qty: ${item.qty})`).join('<br>')}
      </div>
      <div style="font-weight:800; color:#16a34a; font-size:0.95rem;">कुल राशी: ₹${order.total}</div>
    </div>
  `).join('');
}

function updateOwnerProfilePhoto() {
  const photoUrl = document.getElementById('admin-owner-url').value.trim();
  if (photoUrl) {
    ownerPhoto = photoUrl;
    localStorage.setItem('nlr_owner_photo', ownerPhoto);
    loadOwnerProfilePhoto();
    alert('✅ आपकी गोल (Circular) ऑनर फोटो सफलता से अपडेट कर दी गई है!');
    closeAdminModal();
  } else {
    alert('कृपया पहले अपनी फोटो सेलेक्ट करें या लिंक पेस्ट करें।');
  }
}

function resetAdminProductsDefault() {
  if (confirm('क्या आप सभी प्रोडक्ट्स को वापस डिफ़ॉल्ट सैंपल पर रीसेट करना चाहते हैं?')) {
    products = INITIAL_PRODUCTS;
    localStorage.setItem('nlr_products', JSON.stringify(products));
    renderProducts();
    renderAdminInventoryList();
    alert('सफलतापूर्वक डिफ़ॉल्ट पर रीसेट किया गया!');
  }
}

function changeAdminPin() {
  const newPin = prompt('नया 4-डिजिट Admin PIN दर्ज करें:', adminPin);
  if (newPin && newPin.trim().length >= 4) {
    adminPin = newPin.trim();
    localStorage.setItem('nlr_admin_pin', adminPin);
    alert(`✅ आपका Admin PIN बदलकर "${adminPin}" कर दिया गया है!`);
  }
}
