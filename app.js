/* ==========================================================================
   NEW LOOK READYMADE - Salemabad | JavaScript Master Logic
   Includes: Dynamic Catalog, Search, Filters, Wishlist, Cart Drawer,
   Customer Checkout Modal (Address + Payment Modes: UPI/COD + Order Success),
   Clean Header Gear ⚙️ Owner Login, Royal Blue Accent Borders, and Owner Photo Uploader!
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

const DEFAULT_OWNER_UPI_ID = "8503090848@ybl";
let ownerUpiId = localStorage.getItem('nlr_owner_upi') || DEFAULT_OWNER_UPI_ID;

function getOwnerUpiId() {
  const saved = (localStorage.getItem('nlr_owner_upi') || DEFAULT_OWNER_UPI_ID).trim();
  return saved || DEFAULT_OWNER_UPI_ID;
}


// ============================================================
// 🔐 ADMIN SECURITY CONFIG — SIRF AAPKO PATA HONA CHAHIYE
// ============================================================
// MASTER SECRET KEY: Yahi key PIN change karne ke liye chahiye
// Is key ko KABHI bhi kisi ko mat batao
const MASTER_SECRET_KEY = "NEWLOOK@9999"; // ← Aap is key ko apne hisaab se badal sakte hain

// Brute Force Protection — failed login tracking
let pinChangeFailed = parseInt(localStorage.getItem('nlr_pcf') || '0');
let pinChangeLockUntil = parseInt(localStorage.getItem('nlr_pcl') || '0');

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


/* ==========================================================================
   🌐 CUSTOMER LANGUAGE SWITCHER — English default, Hindi optional
   ========================================================================== */
const translations = {
  en: {
    home: "Home", categories: "Categories", collection: "Collection",
    offers: "Special Offers", visit: "Visit Store", return: "↩ Return",
    search: "Search clothes...", checkoutTitle: "Delivery Details",
    checkoutSubtitle: "Enter your name and complete delivery address.",
    fullName: "Full Name: *", mobile: "Mobile / WhatsApp No.: *",
    address: "Delivery Address: *", city: "City: *", state: "State: *",
    pincode: "Pincode: *", house: "House No., Street, Area, Landmark...",
    pincodePh: "6-digit Pincode",
    allIndia: "🚚 All India Delivery: Delivery is available across India to your complete address, city, state and pincode.",
    continuePayment: "Continue to Payment", paymentTitle: "Make Payment",
    paymentSubtitle: "Your delivery details are saved. Now pay the Store Owner by UPI.",
    orderAmount: "Order Amount", ownerUpi: "Owner UPI ID",
    copy: "📋 Copy", editDetails: "← Edit Delivery Details",
    returnTitle: "Return Order", language: "Language"
  },
  hi: {
    home: "होम", categories: "कैटेगरी", collection: "कलेक्शन",
    offers: "खास ऑफर", visit: "स्टोर देखें", return: "↩ रिटर्न",
    search: "कपड़े खोजें...", checkoutTitle: "डिलीवरी विवरण",
    checkoutSubtitle: "अपना नाम और पूरा डिलीवरी पता भरें।",
    fullName: "पूरा नाम: *", mobile: "मोबाइल / WhatsApp नंबर: *",
    address: "डिलीवरी पता: *", city: "शहर: *", state: "राज्य: *",
    pincode: "पिन कोड: *", house: "मकान नंबर, गली, मोहल्ला, लैंडमार्क...",
    pincodePh: "6 अंकों का पिन कोड",
    allIndia: "🚚 पूरे भारत में डिलीवरी: सही पता, शहर, राज्य और पिनकोड दें।",
    continuePayment: "पेमेंट के लिए आगे बढ़ें", paymentTitle: "पेमेंट करें",
    paymentSubtitle: "आपकी डिलीवरी जानकारी सेव है। अब Store Owner को UPI Payment करें।",
    orderAmount: "ऑर्डर राशि", ownerUpi: "Owner UPI ID",
    copy: "📋 कॉपी", editDetails: "← डिलीवरी विवरण बदलें",
    returnTitle: "ऑर्डर रिटर्न", language: "भाषा"
  }
};



/* ========================================================================
   FULL-PAGE CUSTOMER LANGUAGE TRANSLATION
   English is the default. Static and dynamically-rendered Hindi customer
   text is translated when EN is selected; the reverse mapping restores Hindi.
   ======================================================================== */
const FULL_PAGE_HI_EN = {
  "पूरे भारत में Home Delivery उपलब्ध": "All India Home Delivery Available",
  "WhatsApp ऑर्डर: 8503090848": "WhatsApp Order: 8503090848",
  "आपके पूरे परिवार के लिए": "For Your Entire Family",
  "नया Fashion Look": "New Fashion Look",
  "Men • Women • Kids — लेटेस्ट रेडीमेड कलेक्शन, प्रीमियम फैब्रिक, बेहतरीन फिटिंग और पूरे भारत में सीधी WhatsApp होम डिलीवरी।": "Men • Women • Kids — Latest readymade collection, premium fabrics, great fitting and direct WhatsApp home delivery across India.",
  "WhatsApp पर पूछें": "Ask on WhatsApp",
  "Salemabad के ग्राहकों के लिए विशेष डिस्काउंट और कॉम्बो डील्स की जानकारी सीधे WhatsApp पर पाएं।": "Get special discounts and combo deal updates for Salemabad customers directly on WhatsApp.",
  "Men, Women और Kids की ताज़ा वैरायटी": "Latest variety for Men, Women and Kids",
  "फोटो भेजकर घर बैठे पूछताछ व ऑर्डर करें": "Send a photo to enquire and order from home",
  "पूरे भारत में Home Delivery": "All India Home Delivery",
  "हमारे दुकान मालिक": "Our Store Owner",
  "New Look Readymade के दुकान मालिक": "New Look Readymade Store Owner",
  "पूरे भारत में डिलीवरी करने वाला आपका भरोसेमंद Readymade Store।": "Your trusted Readymade Store delivering across India.",
  "Men, Women और Kids के लिए नवीनतम फैशन कलेक्शन उपलब्ध है।": "Latest fashion collections are available for Men, Women and Kids.",
  "Google Maps पर लोकेशन देखें": "View Location on Google Maps",
  "कलेक्शन देखने, साइज पूछने या नया आर्डर देने के लिए तुरंत कॉल या व्हाट्सएप करें।": "Call or WhatsApp us to view the collection, ask about sizes, or place a new order.",
  "कुल राशि (Total):": "Total Amount:",
  "📋 डिलीवरी Details भरें & Order करें": "📋 Enter Delivery Details & Place Order",
  "Pay Now": "Pay Now",
  "Payment पूरा करने के बाद वेबसाइट पर वापस आएँ — Payment Success स्क्रीन दिखाई जाएगी।": "After completing the payment, return to the website — the Payment Success screen will appear.",
  "⚠️ Static website UPI transaction को bank-level पर स्वतः verify नहीं कर सकती। Payment के बाद Owner payment status verify कर सकता है।": "⚠️ A static website cannot automatically verify a UPI transaction at bank level. The Owner can verify the payment status after payment.",
  "अपना Order ID और जानकारी भरें। Return Request WhatsApp पर भेजी जाएगी।": "Enter your Order ID and details. The Return Request will be sent on WhatsApp.",
  "कारण चुनें": "Select Reason",
  "कृपया समस्या/Return की जानकारी लिखें...": "Please describe the issue/return details...",
  "ℹ️ Return request प्राप्त होने के बाद Store Team आपसे WhatsApp/Call पर Return की प्रक्रिया और eligibility की पुष्टि करेगी।": "ℹ️ After receiving the return request, the Store Team will contact you by WhatsApp/Call to confirm the return process and eligibility.",
  "↩️ Return Request भेजें": "↩️ Send Return Request",
  "अपनी दुकान के नए कपड़े जोड़ने, फोटो, प्राइस व साइज अपडेट करने के लिए Owner PIN दर्ज करें।": "Enter the Owner PIN to add new products and update photos, prices and sizes.",
  "➕ नया कपड़ा जोड़ें": "➕ Add New Product",
  "📦 मैनेज कपड़े": "📦 Manage Products",
  "📑 ग्राहक ऑर्डर्स": "📑 Customer Orders",
  "⚙️ सेटिंग्स & ऑनर फोटो": "⚙️ Settings & Owner Photo",
  "कपड़े का नाम (Product Name):": "Product Name:",
  "कैटेगरी (Category):": "Category:",
  "Men's Wear (पुरुष)": "Men's Wear",
  "Women's Wear (महिला)": "Women's Wear",
  "Kids Wear (बच्चे)": "Kids Wear",
  "बिक्री मूल्य (Price ₹):": "Sale Price (₹):",
  "पुराना मूल्य (MRP ₹):": "Old Price (MRP ₹):",
  "टैग (Badge Tag):": "Badge Tag:",
  "उपलब्ध साइज (Check Sizes):": "Available Sizes:",
  "कपड़े की फोटो (Upload Image File or Paste Link):": "Product Image (Upload Image File or Paste Link):",
  "या फोटो का वेब लिंक paste करें (Option)": "Or paste the image web link (Optional)",
  "विवरण (Description):": "Description:",
  "कपड़े का फैब्रिक, स्टाइल विवरण लिखें...": "Enter fabric and style details...",
  "🚀 वेबसाइट पर कपड़ा लाइव सहेजें": "🚀 Save Product Live on Website",
  "दुकान में मौजूद कपड़े (Current Catalog):": "Products in Store (Current Catalog):",
  "ग्राहक ऑर्डर्स व डिलीवरी (Customer Orders Log):": "Customer Orders & Delivery (Customer Orders Log):",
  "📸 दुकान मालिक (Store Owner) की गोल फोटो बदलें:": "📸 Change Store Owner Profile Photo:",
  "या अपनी फोटो की वेब लिंक Paste करें": "Or paste your photo web link",
  "✨ ऑनर फोटो सहेजें (Update Owner Photo)": "✨ Save Owner Photo (Update Owner Photo)",
  "💳 Owner UPI ID बदलें:": "💳 Change Owner UPI ID:",
  "यही UPI ID Customer को Payment Step में दिखाई जाएगी।": "This UPI ID will be shown to the Customer during the Payment Step.",
  "💾 Owner UPI ID सहेजें": "💾 Save Owner UPI ID",
  "🔑 Admin PIN बदलें": "🔑 Change Admin PIN",
  "🔄 डिफ़ॉल्ट सैंपल इमेजेज पर रीसेट करें": "🔄 Reset to Default Sample Images",
  "आपके पूरे परिवार के लिए बेहतरीन रेडीमेड कपड़ों का एकमात्र विश्वसनीय शोरूम। Men, Women और Kids के लेटेस्ट फैशन कलेक्शन के लिए Salemabad में पधारें।": "Your trusted family readymade showroom. Visit us in Salemabad for the latest fashion collections for Men, Women and Kids.",
  "आपकी कार्ट खाली है! कृपया पहले अपनी पसंद के कपड़े जोड़ें।": "Your cart is empty! Please add your preferred products first.",
  "कोई प्रोडक्ट नहीं मिला": "No products found",
  "कृपया दूसरा कीवर्ड या कैटेगरी सर्च करके देखें।": "Please try another keyword or category.",
  "Size चुनें & Cart में जोड़ें": "Select Size & Add to Cart",
  "Size चुनें & Add": "Select Size & Add",
  "📏 साइज़ चुनें": "📏 Select Size",
  "⚠️ कृपया पहले साइज़ चुनें!": "⚠️ Please select a size first!",
  "🛒 Cart में जोड़ें": "🛒 Add to Cart",
  "💳 अभी Order करें": "💳 Order Now",
  "आपकी कार्ट खाली है": "Your Cart is Empty",
  "न्यू कलेक्शन एक्सप्लोर करें और अपने पसंदीदा कपड़े ऐड करें!": "Explore the new collection and add your favorite products!",
  "📦 आपके Selected Items (": "📦 Your Selected Items (",
  "कुल देय राशि:": "Total Payable Amount:",
  "कृपया नाम, मोबाइल, पूरा पता, City, State और 6 अंकों का Pincode सही दर्ज करें।": "Please enter your name, mobile number, complete address, city, state and a valid 6-digit pincode.",
  "UPI ID कॉपी हो गई:": "UPI ID copied:",
  "Checkout session नहीं मिला। कृपया दोबारा order करें।": "Checkout session not found. Please place the order again.",
  "धन्यवाद ": "Thank you ",
  "! आपका ऑर्डर नंबर ": "! Your Order Number ",
  "कुल बिल": "Total Bill",
  "डिलीवरी पता": "Delivery Address",
  "संपर्क नंबर": "Contact Number",
  "पेमेंट": "Payment",
  "Payment verification Owner द्वारा की जाएगी।": "Payment verification will be done by the Owner.",
  "📲 WhatsApp पर Order Details भेजें": "📲 Send Order Details on WhatsApp",
  "🛍️ और शॉपिंग करें": "🛍️ Continue Shopping",
  "कृपया Order ID, Mobile Number और Return Reason भरें।": "Please enter Order ID, Mobile Number and Return Reason.",
  "कृपया Return/Exchange प्रक्रिया के लिए ग्राहक से संपर्क करें।": "Please contact the customer for the Return/Exchange process.",
  "Return Request भेज दी गई!": "Return Request Sent!",
  "आपका Return Request ID:": "Your Return Request ID:",
  "📲 WhatsApp पर Return Request भेजें": "📲 Send Return Request on WhatsApp",
  "बंद करें": "Close",
  "❌ गलत Owner PIN! डिफ़ॉल्ट PIN 8503 दर्ज करें।": "❌ Incorrect Owner PIN! Enter the default PIN 8503.",
  "कृपया प्रोडक्ट का नाम और कीमत सही दर्ज करें।": "Please enter a valid product name and price.",
  "सफलता से आपकी दुकान पर लाइव जोड़ दिया गया है।": "has been successfully added to your store.",
  "कोई प्रोडक्ट उपलब्ध नहीं है।": "No products are available.",
  "🗑️ हटाएं": "🗑️ Delete",
  "क्या आप वाकई इस प्रोडक्ट को दुकान से हटाना चाहते हैं?": "Are you sure you want to delete this product from the store?",
  "अभी तक कोई ग्राहक ऑर्डर दर्ज नहीं हुआ है।": "No customer orders have been recorded yet.",
  "ऑर्डर #": "Order #",
  "👤 ग्राहक:": "👤 Customer:",
  "📍 पता:": "📍 Address:",
  "कुल राशी:": "Total Amount:",
  "आपकी ऑनर फोटो सफलता से सहेज दी गई है!": "Your Owner photo has been saved successfully!",
  "कृपया पहले अपनी फोटो सेलेक्ट करें या लिंक पेस्ट करें।": "Please select your photo or paste a link first.",
  "⚠️ कृपया सही UPI ID डालें। उदाहरण:": "⚠️ Please enter a valid UPI ID. Example:",
  "Owner UPI ID सफलतापूर्वक बदल गई:": "Owner UPI ID changed successfully:",
  "क्या आप सभी प्रोडक्ट्स को वापस डिफ़ॉल्ट सैंपल पर रीसेट करना चाहते हैं?": "Do you want to reset all products to the default samples?",
  "सफलतापूर्वक डिफ़ॉल्ट पर रीसेट किया गया!": "Successfully reset to defaults!",
  "Admin PIN बदलें": "Change Admin PIN",
  "पहले Master Secret Key डालें": "Enter the Master Secret Key first",
  "Master key डालें...": "Enter Master Key...",
  "🔑 नया Admin PIN (4+ अंक)": "🔑 New Admin PIN (4+ digits)",
  "नया PIN डालें...": "Enter New PIN...",
  "❌ रद्द करें": "❌ Cancel",
  "✅ PIN बदलें": "✅ Change PIN",
  "🛡️ सिर्फ Store Owner के लिए": "🛡️ Store Owner Only",
  "🚫 3 बार गलत! 30 मिनट के लिए बंद किया गया।": "🚫 3 failed attempts! Locked for 30 minutes.",
  "❌ गलत Master Key! ": "❌ Incorrect Master Key! ",
  "⚠️ PIN कम से कम 4 अंक का होना चाहिए!": "⚠️ PIN must contain at least 4 digits!",
  "⚠️ PIN में सिर्फ नंबर (0-9) डालें!": "⚠️ PIN must contain numbers only (0-9)!",
  "आपका Admin PIN बदलकर ": "Your Admin PIN has been changed to ",
  "🔐 अब Master Secret Key के बिना कोई PIN नहीं बदल सकता।": "🔐 No one can change the PIN without the Master Secret Key.",
  "हिं": "HI",
  "हिंदी": "Hindi",
  "पूरे भारत में": "Across India",
  "नया आर्डर": "new order"
};
const FULL_PAGE_EN_HI = Object.fromEntries(Object.entries(FULL_PAGE_HI_EN).map(([hi,en]) => [en,hi]));
function translateVisibleText(lang) {
  const map = lang === 'hi' ? FULL_PAGE_EN_HI : FULL_PAGE_HI_EN;
  const keys = Object.keys(map).filter(Boolean).sort((a,b)=>b.length-a.length);
  const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
  const nodes=[];
  while(walker.nextNode()) nodes.push(walker.currentNode);
  nodes.forEach(node => {
    if (!node.parentElement || ['SCRIPT','STYLE'].includes(node.parentElement.tagName)) return;
    let text=node.nodeValue;
    for (const key of keys) if (text.includes(key)) text=text.split(key).join(map[key]);
    if (text!==node.nodeValue) node.nodeValue=text;
  });
}

function applyLanguage(lang) {
  lang = lang === 'hi' ? 'hi' : 'en';
  localStorage.setItem('nlr_language', lang);
  document.documentElement.lang = lang === 'hi' ? 'hi' : 'en';

  const t = translations[lang];
  const nav = document.querySelectorAll('.nav-menu a');
  if (nav.length >= 6) {
    nav[0].textContent = t.home;
    nav[1].textContent = t.categories;
    nav[2].textContent = t.collection;
    nav[3].textContent = t.offers;
    nav[4].textContent = t.visit;
    if (nav[6]) nav[6].textContent = t.return;
  }

  const search = document.getElementById('search-input');
  if (search) search.placeholder = t.search;

  const title = document.getElementById('checkout-title');
  if (title) title.textContent = t.checkoutTitle;
  const subtitle = document.getElementById('checkout-subtitle');
  if (subtitle) subtitle.textContent = t.checkoutSubtitle;

  const map = {
    'lbl-cust-name': t.fullName, 'lbl-cust-phone': t.mobile,
    'lbl-cust-address': t.address, 'lbl-cust-city': t.city,
    'lbl-cust-state': t.state, 'lbl-cust-pincode': t.pincode
  };
  Object.entries(map).forEach(([id, text]) => {
    const el = document.getElementById(id);
    if (el) el.textContent = text;
  });

  const address = document.getElementById('cust-address');
  if (address) address.placeholder = t.house;
  const pin = document.getElementById('cust-pincode');
  if (pin) pin.placeholder = t.pincodePh;

  // All-India delivery notice in checkout.
  const notices = document.querySelectorAll('#checkout-form-sec > form + div, #checkout-form-sec div[style*="All India Delivery"]');
  notices.forEach(el => {
    if (el && el.textContent.includes('All India Delivery')) el.innerHTML = t.allIndia;
  });

  const payTitle = document.getElementById('payment-title');
  if (payTitle) payTitle.textContent = t.paymentTitle;

  const paySec = document.getElementById('checkout-payment-sec');
  if (paySec) {
    const ps = paySec.querySelector('p');
    if (ps) ps.textContent = t.paymentSubtitle;
    const amountLabel = paySec.querySelector('span');
    if (amountLabel) amountLabel.textContent = t.orderAmount;
    const upiLabel = paySec.querySelector('div[style*="font-size:.78rem"]');
    if (upiLabel) upiLabel.textContent = t.ownerUpi;
    const copyBtn = paySec.querySelector('button[onclick="copyOwnerUpiId()"]');
    if (copyBtn) copyBtn.textContent = t.copy;
    const editBtn = paySec.querySelector('button[onclick="backToCheckoutDetails()"]');
    if (editBtn) editBtn.textContent = t.editDetails;
  }

  const langBtn = document.getElementById('language-toggle');
  if (langBtn) {
    langBtn.innerHTML = lang === 'en'
      ? '<span class="lang-active">EN</span><span class="lang-sep">|</span><span>हिं</span>'
      : '<span>EN</span><span class="lang-sep">|</span><span class="lang-active">हिं</span>';
    langBtn.title = t.language;
  }

  // Keep customer-facing return link language consistent.
  document.querySelectorAll('.return-nav-link').forEach(el => el.textContent = t.return);

  // Translate all remaining static/dynamic customer-visible text on the page.
  translateVisibleText(lang);
}

function setupLanguageSwitcher() {
  const btn = document.getElementById('language-toggle');
  if (!btn) return;
  btn.addEventListener('click', () => {
    const current = localStorage.getItem('nlr_language') || 'en';
    applyLanguage(current === 'en' ? 'hi' : 'en');
  });
  const LANG_VERSION = '3';
  if (localStorage.getItem('nlr_language_version') !== LANG_VERSION) { localStorage.setItem('nlr_language_version', LANG_VERSION); localStorage.setItem('nlr_language', 'en'); }
  applyLanguage(localStorage.getItem('nlr_language') || 'en');

  // Keep newly-created cart, product, return and payment UI in the selected language.
  if (!window.__nlrLanguageObserver) {
    window.__nlrLanguageObserver = new MutationObserver(() => {
      const activeLang = localStorage.getItem('nlr_language') || 'en';
      if (activeLang === 'en') translateVisibleText('en');
    });
    window.__nlrLanguageObserver.observe(document.body, { childList: true, subtree: true });
  }
}

// INITIALIZE APP
function loadOwnerProfilePhoto() {
  const ownerPhoto = document.getElementById('owner-profile-photo');
  if (!ownerPhoto) return;
  const savedPhoto = localStorage.getItem('nlr_owner_photo');
  ownerPhoto.src = savedPhoto || 'owner.png';
  ownerPhoto.onerror = () => { ownerPhoto.src = 'owner.jpg'; };
}

document.addEventListener('DOMContentLoaded', () => {
  loadOwnerProfilePhoto();
  renderProducts();
  updateBadges();
  setupLanguageSwitcher();
  setupEventListeners();
  setupCheckoutListeners();
  setupReturnListeners();
  setupAdminListeners();
});

// CLOSE ALL MODALS FUNCTION TO PREVENT OVERLAP
function closeAllModals() {
  if (modalOverlay) modalOverlay.classList.remove('active');
  if (checkoutModalOverlay) checkoutModalOverlay.classList.remove('active');
  if (adminModalOverlay) adminModalOverlay.classList.remove('active');
  if (cartOverlay) cartOverlay.classList.remove('active');
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
      closeAllModals();
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
      closeAllModals();
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
          <div class="product-actions" style="flex-direction:column; gap:8px;">
            <button class="btn btn-gold" style="width:100%; font-size:0.88rem; padding:9px 12px;" onclick="showSizeSelectorPopup(${product.id})">🛒 Size चुनें & Cart में जोड़ें</button>
            <div style="display:flex; gap:8px;">
              <button class="btn btn-outline btn-sm" style="flex:1;" onclick="openQuickView(${product.id})">🔍 Details</button>
              <a class="btn btn-whatsapp btn-sm" style="flex:1; text-align:center;" href="https://wa.me/918503090848?text=${whatsappMsg}" target="_blank">
                📲 Order
              </a>
            </div>
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

  closeAllModals();

  const defaultSize = (product.sizes && product.sizes.length > 0) ? product.sizes[0] : "M";
  const whatsappMsg = encodeURIComponent(
    `Namaste New Look Readymade, mujhe order karna hai:\n*Product*: ${product.title}\n*Price*: ₹${product.price}\n*Size*: ${defaultSize}\nAddress: Salemabad`
  );

  modalBody.innerHTML = `
    <div class="modal-content" style="max-width:760px; width:100%; border:2px solid var(--accent-blue);">
      <button class="close-modal" onclick="closeModal()">✕</button>
      <div class="modal-img-container">
        <img src="${product.image}" alt="${product.title}" onerror="this.onerror=null; this.src='logo.png';">
      </div>
      <div class="modal-details-container" style="padding:25px;">
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
          <button class="btn btn-gold" style="flex:1;" onclick="showSizeSelectorPopup(${product.id})">🛒 Size चुनें & Add</button>
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

// ============================================================
// 🛒 SIZE SELECTOR POPUP — Add to Cart ke pehle
// ============================================================
function showSizeSelectorPopup(productId) {
  const product = products.find(p => p.id === productId);
  if (!product) return;

  const sizes = (product.sizes && product.sizes.length > 0) ? product.sizes : ['S', 'M', 'L', 'XL', 'XXL'];
  const imgSrc = product.image || 'logo.png';

  // Remove old popup
  const old = document.getElementById('size-selector-popup');
  if (old) old.remove();

  const overlay = document.createElement('div');
  overlay.id = 'size-selector-popup';
  overlay.style.cssText = `
    position:fixed; inset:0; background:rgba(0,0,0,0.65);
    display:flex; align-items:center; justify-content:center;
    z-index:99998; font-family:'Inter',sans-serif; padding:16px;
  `;

  overlay.innerHTML = `
    <div style="background:#fff; border-radius:20px; width:100%; max-width:400px;
                box-shadow:0 30px 80px rgba(0,0,0,0.35); overflow:hidden; animation:popIn .25s ease;">

      <!-- Product Preview -->
      <div style="display:flex; align-items:center; gap:14px; padding:18px 18px 14px; border-bottom:1px solid #f1f5f9;">
        <img src="${imgSrc}" alt="${product.title}"
          onerror="this.src='logo.png'"
          style="width:70px; height:70px; object-fit:cover; border-radius:12px; border:1px solid #e2e8f0;">
        <div style="flex:1; min-width:0;">
          <div style="font-size:0.72rem; color:#d97706; font-weight:700; letter-spacing:.5px;"
            >${(product.category || '').toUpperCase()} COLLECTION</div>
          <div style="font-weight:700; font-size:1rem; color:#0f172a; margin:2px 0; white-space:nowrap; overflow:hidden; text-overflow:ellipsis;"
            >${product.title}</div>
          <div style="font-size:1.05rem; font-weight:800; color:#d97706;">₹${product.price}</div>
        </div>
        <button onclick="closeSizeSelectorPopup()"
          style="background:none; border:none; font-size:1.4rem; cursor:pointer; color:#94a3b8; padding:4px; flex-shrink:0;">✕</button>
      </div>

      <!-- Size Picker -->
      <div style="padding:18px 18px 0;">
        <div style="font-size:0.85rem; font-weight:700; color:#334155; margin-bottom:12px;">
          📏 साइज़ चुनें <span style="color:#ef4444;">*</span>
        </div>
        <div id="size-btn-group" style="display:flex; flex-wrap:wrap; gap:10px; margin-bottom:6px;">
          ${sizes.map((s, i) => `
            <button
              class="size-pick-btn"
              data-size="${s}"
              onclick="selectSizeBtn(this)"
              style="padding:10px 18px; border-radius:10px; border:2px solid ${i===0?'#d97706':'#e2e8f0'};
                     background:${i===0?'#fef3c7':'#fff'}; color:${i===0?'#92400e':'#475569'};
                     font-weight:700; font-size:0.95rem; cursor:pointer; transition:all .18s;"
            >${s}</button>
          `).join('')}
        </div>
        <div id="size-error-msg" style="color:#ef4444; font-size:0.8rem; display:none; margin-bottom:4px;">
          ⚠️ कृपया पहले साइज़ चुनें!
        </div>
      </div>

      <!-- Actions -->
      <div style="padding:16px 18px 20px; display:flex; flex-direction:column; gap:10px;">
        <button onclick="confirmAddToCart(${product.id})"
          style="width:100%; padding:13px; border-radius:12px; border:none;
                 background:linear-gradient(135deg,#d97706,#b45309); color:#fff;
                 font-size:1rem; font-weight:700; cursor:pointer;
                 box-shadow:0 4px 14px rgba(217,119,6,.35);">
          🛒 Cart में जोड़ें
        </button>
        <button onclick="confirmDirectCheckout(${product.id})"
          style="width:100%; padding:13px; border-radius:12px; border:none;
                 background:linear-gradient(135deg,#25d366,#128c7e); color:#fff;
                 font-size:1rem; font-weight:700; cursor:pointer;">
          💳 अभी Order करें
        </button>
      </div>
    </div>
  `;

  // Close on backdrop click
  overlay.addEventListener('click', (e) => { if (e.target === overlay) closeSizeSelectorPopup(); });
  overlay.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeSizeSelectorPopup(); });
  document.body.appendChild(overlay);

  // Auto-select first size
  const firstBtn = overlay.querySelector('.size-pick-btn');
  if (firstBtn) firstBtn.dataset.selected = 'true';
}

function selectSizeBtn(btn) {
  // Deselect all
  document.querySelectorAll('.size-pick-btn').forEach(b => {
    b.style.borderColor = '#e2e8f0';
    b.style.background = '#fff';
    b.style.color = '#475569';
    b.dataset.selected = '';
  });
  // Select clicked
  btn.style.borderColor = '#d97706';
  btn.style.background = '#fef3c7';
  btn.style.color = '#92400e';
  btn.dataset.selected = 'true';
  // Hide error
  const errEl = document.getElementById('size-error-msg');
  if (errEl) errEl.style.display = 'none';
}

function getSelectedSize() {
  const selected = document.querySelector('.size-pick-btn[data-selected="true"]');
  return selected ? selected.dataset.size : null;
}

function closeSizeSelectorPopup() {
  const popup = document.getElementById('size-selector-popup');
  if (popup) popup.remove();
}

function confirmAddToCart(productId) {
  const size = getSelectedSize();
  if (!size) {
    const errEl = document.getElementById('size-error-msg');
    if (errEl) errEl.style.display = 'block';
    return;
  }
  closeSizeSelectorPopup();
  addToCart(productId, size);
}

function confirmDirectCheckout(productId) {
  const size = getSelectedSize();
  if (!size) {
    const errEl = document.getElementById('size-error-msg');
    if (errEl) errEl.style.display = 'block';
    return;
  }
  closeSizeSelectorPopup();
  addToCart(productId, size);
  closeAllModals();
  openCheckoutModal();
}

function addToCart(productId, selectedSize) {
  const product = products.find(p => p.id === productId);
  if (!product) return;
  const size = selectedSize || (product.sizes && product.sizes[0]) || 'M';

  // Agar same product same size cart mein hai → qty badhao
  const existing = cart.find(item => item.id === productId && item.selectedSize === size);
  if (existing) {
    existing.qty += 1;
  } else {
    cart.push({ ...product, qty: 1, selectedSize: size });
  }
  localStorage.setItem('nlr_cart', JSON.stringify(cart));
  updateBadges();
  renderCartDrawer();
  closeModal();
  // Show cart drawer with success flash
  cartOverlay.classList.add('active');
  // Flash cart badge
  if (cartBadge) {
    cartBadge.style.transform = 'scale(1.6)';
    cartBadge.style.background = '#10b981';
    setTimeout(() => {
      cartBadge.style.transform = 'scale(1)';
      cartBadge.style.background = '';
    }, 400);
  }
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

  const payBtn = document.getElementById('upi-pay-btn');
  if (payBtn) {
    payBtn.addEventListener('click', handlePayNowClick);
  }
}

function openCheckoutModal() {
  closeAllModals();
  renderCheckoutOrderSummary();
  checkoutModalOverlay.classList.add('active');

  document.getElementById('checkout-form-sec').style.display = 'block';
  document.getElementById('checkout-payment-sec').style.display = 'none';
  document.getElementById('checkout-success-sec').style.display = 'none';
}

function closeCheckoutModal() {
  checkoutModalOverlay.classList.remove('active');
}

function directCheckoutSingleItem(productId) {
  addToCart(productId);
  closeAllModals();
  openCheckoutModal();
}

function renderCheckoutOrderSummary() {
  const summaryBox = document.getElementById('checkout-order-summary');
  if (!summaryBox) return;

  if (cart.length === 0) {
    summaryBox.innerHTML = '';
    return;
  }

  let total = 0;
  const itemsHtml = cart.map(item => {
    const itemTotal = item.price * item.qty;
    total += itemTotal;
    return `
      <div style="display:flex; align-items:center; gap:10px; padding:10px;
                  background:#fff; border-radius:10px; border:1px solid #e2e8f0; margin-bottom:8px;">
        <img src="${item.image || 'logo.png'}" alt="${item.title}"
          onerror="this.src='logo.png'"
          style="width:52px; height:52px; object-fit:cover; border-radius:8px; flex-shrink:0; border:1px solid #f1f5f9;">
        <div style="flex:1; min-width:0;">
          <div style="font-weight:700; font-size:0.88rem; color:#0f172a; white-space:nowrap;
                      overflow:hidden; text-overflow:ellipsis;">${item.title}</div>
          <div style="display:flex; gap:6px; margin-top:4px; flex-wrap:wrap;">
            <span style="background:#fef3c7; color:#92400e; font-size:0.72rem; font-weight:700;
                         padding:2px 8px; border-radius:20px;">📏 Size: ${item.selectedSize}</span>
            <span style="background:#e0f2fe; color:#0369a1; font-size:0.72rem; font-weight:700;
                         padding:2px 8px; border-radius:20px;">Qty: ${item.qty}</span>
          </div>
        </div>
        <div style="font-weight:800; font-size:0.95rem; color:#0f172a; flex-shrink:0;">₹${itemTotal}</div>
      </div>
    `;
  }).join('');

  summaryBox.innerHTML = `
    <div style="background:#f8fafc; border:1.5px solid #bfdbfe; border-radius:12px; padding:14px; margin-bottom:16px;">
      <div style="font-size:0.8rem; font-weight:700; color:#1e40af; margin-bottom:10px; letter-spacing:.3px;">
        📦 आपके Selected Items (${cart.length} item${cart.length > 1 ? 's' : ''}):
      </div>
      ${itemsHtml}
      <div style="border-top:1.5px dashed #cbd5e1; margin-top:8px; padding-top:10px;
                  display:flex; justify-content:space-between; align-items:center;">
        <span style="font-weight:700; font-size:0.92rem; color:#334155;">कुल देय राशि:</span>
        <span style="font-weight:900; font-size:1.25rem; color:#d97706;">₹${total}</span>
      </div>
      <div style="font-size:0.75rem; color:#16a34a; font-weight:700; text-align:center; margin-top:6px;">
        🚚 पूरे भारत में Home Delivery उपलब्ध
      </div>
    </div>
  `;
}

function processCustomerOrderSubmit(e) {
  e.preventDefault();

  const custName = document.getElementById('cust-name').value.trim();
  const custPhone = document.getElementById('cust-phone').value.trim();
  const custAddress = document.getElementById('cust-address').value.trim();
  const custCity = document.getElementById('cust-city').value.trim();
  const custState = document.getElementById('cust-state').value.trim();
  const custPincode = document.getElementById('cust-pincode').value.trim();

  if (!custName || !custPhone || !custAddress || !custCity || !custState || !/^\d{6}$/.test(custPincode)) {
    alert('कृपया नाम, मोबाइल, पूरा पता, City, State और 6 अंकों का Pincode सही दर्ज करें।');
    return;
  }

  let totalAmount = 0;
  cart.forEach(item => totalAmount += (item.price * item.qty));

  const pendingCheckout = {
    orderId: 'NLR-' + Math.floor(100000 + Math.random() * 900000),
    orderDate: new Date().toLocaleString('hi-IN'),
    custName,
    custPhone,
    custAddress,
    custCity,
    custState,
    custPincode,
    fullAddress: `${custAddress}, ${custCity}, ${custState} - ${custPincode}`,
    totalAmount,
    items: [...cart]
  };

  localStorage.setItem('nlr_pending_checkout', JSON.stringify(pendingCheckout));
  showCheckoutPaymentStep(pendingCheckout);
}


function handlePayNowClick(e) {
  const btn = e.currentTarget;
  const raw = localStorage.getItem('nlr_pending_checkout');
  if (!raw) return;

  // The UPI URI is already assigned by showCheckoutPaymentStep().
  // Open the UPI app, then finalize when the customer returns to this page.
  localStorage.setItem('nlr_payment_started_at', String(Date.now()));
  localStorage.setItem('nlr_waiting_for_upi_return', '1');

  // Do not prevent the normal UPI navigation.
  setTimeout(() => {
    if (document.visibilityState === 'visible' && localStorage.getItem('nlr_waiting_for_upi_return') === '1') {
      showPaymentReturnConfirmation();
    }
  }, 1200);
}

function showPaymentReturnConfirmation() {
  if (localStorage.getItem('nlr_waiting_for_upi_return') !== '1') return;
  localStorage.removeItem('nlr_waiting_for_upi_return');

  // This is a customer-side confirmation screen. The static site cannot
  // independently verify the bank transaction.
  finalizeCustomerOrderAfterPayment();
}

document.addEventListener('visibilitychange', () => {
  if (document.visibilityState === 'visible' &&
      localStorage.getItem('nlr_waiting_for_upi_return') === '1') {
    setTimeout(showPaymentReturnConfirmation, 500);
  }
});

window.addEventListener('focus', () => {
  if (localStorage.getItem('nlr_waiting_for_upi_return') === '1') {
    setTimeout(showPaymentReturnConfirmation, 500);
  }
});

function showCheckoutPaymentStep(data) {
  const formSec = document.getElementById('checkout-form-sec');
  const paymentSec = document.getElementById('checkout-payment-sec');
  const successSec = document.getElementById('checkout-success-sec');

  if (!formSec || !paymentSec) return;

  formSec.style.display = 'none';
  successSec.style.display = 'none';
  paymentSec.style.display = 'block';

  const upi = getOwnerUpiId();
  const amount = Number(data.totalAmount || 0).toFixed(2);
  const upiLink =
    `upi://pay?pa=${encodeURIComponent(upi)}` +
    `&pn=${encodeURIComponent('New Look Readymade')}` +
    `&am=${encodeURIComponent(amount)}` +
    `&cu=INR` +
    `&tn=${encodeURIComponent('New Look Order ' + data.orderId)}`;

  const upiText = document.getElementById('payment-upi-id');
  const amountText = document.getElementById('payment-total-amount');
  const payBtn = document.getElementById('upi-pay-btn');

  if (upiText) upiText.textContent = upi;
  if (amountText) amountText.textContent = `₹${Number(data.totalAmount || 0).toLocaleString('en-IN')}`;
  if (payBtn) {
    payBtn.href = upiLink;
    payBtn.textContent = `💳 Pay Now — ₹${Number(data.totalAmount || 0).toLocaleString('en-IN')}`;
  }
}

function copyOwnerUpiId() {
  const upi = getOwnerUpiId();
  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(upi).then(
      () => alert(`✅ UPI ID कॉपी हो गई:\n${upi}`),
      () => alert(`Owner UPI ID:\n${upi}`)
    );
  } else {
    alert(`Owner UPI ID:\n${upi}`);
  }
}

function backToCheckoutDetails() {
  const formSec = document.getElementById('checkout-form-sec');
  const paymentSec = document.getElementById('checkout-payment-sec');
  if (paymentSec) paymentSec.style.display = 'none';
  if (formSec) formSec.style.display = 'block';
}

function finalizeCustomerOrderAfterPayment() {
  const raw = localStorage.getItem('nlr_pending_checkout');
  if (!raw) {
    alert('Checkout session नहीं मिला। कृपया दोबारा order करें।');
    backToCheckoutDetails();
    return;
  }

  const data = JSON.parse(raw);
  const orderId = data.orderId;
  const orderDate = data.orderDate;
  const custName = data.custName;
  const custPhone = data.custPhone;
  const fullAddress = data.fullAddress;
  const totalAmount = data.totalAmount;
  const paymentUpi = getOwnerUpiId();

  const newOrderObj = {
    orderId,
    date: orderDate,
    customerName: custName,
    phone: custPhone,
    address: fullAddress,
    city: data.custCity,
    state: data.custState,
    pincode: data.custPincode,
    paymentMode: 'UPI',
    paymentStatus: 'Customer marked payment completed',
    paymentUpi,
    items: data.items,
    total: totalAmount,
    status: 'Order Placed - Payment Marked Done'
  };

  ordersLog.unshift(newOrderObj);
  localStorage.setItem('nlr_orders_log', JSON.stringify(ordersLog));

  let text = `🛍️ *NEW LOOK READYMADE - NEW ORDER*\n-----------------------------------\n`;
  text += `📋 *Order ID*: ${orderId}\n📅 *Date*: ${orderDate}\n`;
  text += `👤 *Customer*: ${custName}\n📞 *Phone*: ${custPhone}\n`;
  text += `📍 *Delivery Address*: ${fullAddress}\n🚚 *Delivery*: All India Home Delivery\n`;
  text += `💰 *TOTAL AMOUNT*: ₹${totalAmount}\n`;
  text += `💳 *Payment Mode*: UPI\n`;
  text += `🏦 *Owner UPI*: ${paymentUpi}\n`;
  text += `✅ *Customer Status*: Payment marked as completed\n`;
  text += `-----------------------------------\n*ORDERED ITEMS*:\n`;
  data.items.forEach((item,index)=>{
    text += `${index+1}. *${item.title}*\n   Size: ${item.selectedSize} | Qty: ${item.qty} | Price: ₹${item.price*item.qty}\n`;
  });
  text += `-----------------------------------\n🚚 *Status*: Order Placed - All India Delivery\n`;

  document.getElementById('checkout-payment-sec').style.display = 'none';
  const successSec = document.getElementById('checkout-success-sec');

  successSec.innerHTML = `
    <div style="text-align:center;padding:20px 10px;">
      <div style="font-size:4rem;color:#10b981;">✅</div>
      <h2 style="font-family:'Playfair Display',serif;color:#0f172a;">Payment Successful</h2>
      <div style="display:inline-block;background:#ecfdf5;color:#166534;border:1px solid #bbf7d0;border-radius:999px;padding:6px 14px;font-weight:800;margin:4px 0 10px;">✅ Payment Submitted Successfully</div>
      <p style="color:#64748b;">धन्यवाद <b>${custName}</b>! आपका ऑर्डर नंबर <b>${orderId}</b> दर्ज हो गया है।</p>
      <div style="background:#f8fafc;border:1px solid #e2e8f0;border-radius:12px;padding:15px;text-align:left;margin:18px 0;font-size:.9rem;">
        <div><b>कुल बिल</b>: ₹${totalAmount}</div>
        <div><b>डिलीवरी पता</b>: ${fullAddress}</div>
        <div><b>संपर्क नंबर</b>: ${custPhone}</div>
        <div><b>डिलीवरी</b>: 🚚 All India Home Delivery</div>
        <div><b>पेमेंट</b>: 💳 UPI — Customer marked payment completed</div>
      </div>
      <div style="background:#fff7ed;border:1px solid #fed7aa;border-radius:10px;padding:10px;font-size:.78rem;color:#9a3412;margin-bottom:12px;">
        ⚠️ Payment verification Owner द्वारा की जाएगी।
      </div>
      <div style="display:flex;flex-direction:column;gap:10px;">
        <a class="btn btn-whatsapp" style="width:100%;font-size:1.05rem;" href="https://wa.me/918503090848?text=${encodeURIComponent(text)}" target="_blank">📲 WhatsApp पर Order Details भेजें</a>
        <button class="btn btn-outline" style="color:#111;border-color:#cbd5e1;" onclick="closeCheckoutModal()">🛍️ और शॉपिंग करें</button>
      </div>
    </div>`;

  successSec.style.display='block';

  localStorage.removeItem('nlr_pending_checkout');
  cart = [];
  localStorage.setItem('nlr_cart', JSON.stringify(cart));
  updateBadges();
  renderCartDrawer();
}

function openReturnModal(){ closeAllModals(); const overlay=document.getElementById('return-modal-overlay'); if(overlay) overlay.classList.add('active'); }
function closeReturnModal(){ const overlay=document.getElementById('return-modal-overlay'); if(overlay) overlay.classList.remove('active'); }
function setupReturnListeners(){
  const form=document.getElementById('customer-return-form'); if(!form) return;
  form.addEventListener('submit',function(e){
    e.preventDefault();
    const orderId=document.getElementById('return-order-id').value.trim();
    const phone=document.getElementById('return-phone').value.trim();
    const reason=document.getElementById('return-reason').value;
    const details=document.getElementById('return-details').value.trim();
    if(!orderId||!phone||!reason){ alert('कृपया Order ID, Mobile Number और Return Reason भरें।'); return; }
    const returnId='RET-'+Math.floor(100000+Math.random()*900000);
    const returnDate=new Date().toLocaleString('hi-IN');
    const returnsLog=JSON.parse(localStorage.getItem('nlr_returns_log')||'[]');
    returnsLog.unshift({returnId,orderId,phone,reason,details,date:returnDate,status:'Return Request Received'});
    localStorage.setItem('nlr_returns_log',JSON.stringify(returnsLog));
    let msg=`↩️ *NEW LOOK READYMADE - RETURN REQUEST*\n-----------------------------------\n`;
    msg+=`🔖 *Return ID*: ${returnId}\n📋 *Order ID*: ${orderId}\n📞 *Customer Mobile*: ${phone}\n📝 *Reason*: ${reason}\n`;
    if(details) msg+=`📄 *Details*: ${details}\n`;
    msg+=`📅 *Date*: ${returnDate}\n-----------------------------------\nकृपया Return/Exchange प्रक्रिया के लिए ग्राहक से संपर्क करें।`;
    document.getElementById('return-form-sec').innerHTML=`<div style="text-align:center;padding:20px 10px;"><div style="font-size:4rem;color:#10b981;">↩️</div><h2 style="font-family:'Playfair Display',serif;color:#0f172a;">Return Request भेज दी गई!</h2><p style="color:#64748b;">आपका Return Request ID: <b>${returnId}</b></p><a class="btn btn-whatsapp" style="width:100%;margin-top:12px;" href="https://wa.me/918503090848?text=${encodeURIComponent(msg)}" target="_blank">📲 WhatsApp पर Return Request भेजें</a><button class="btn btn-outline" style="width:100%;margin-top:10px;" onclick="closeReturnModal()">बंद करें</button></div>`;
  });
}

/* ==========================================================================
   STORE OWNER / ADMIN PANEL & OWNER PROFILE PHOTO ENGINE
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

  const ownerFileInput = document.getElementById('admin-owner-file');
  if (ownerFileInput) {
    ownerFileInput.addEventListener('change', (e) => {
      const file = e.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = function(evt) {
          document.getElementById('admin-owner-url').value = evt.target.result;
          document.getElementById('owner-img-preview-box').innerHTML = `
            <img src="${evt.target.result}" style="width:60px; height:60px; border-radius:50%; object-fit:cover; border:2px solid var(--accent-blue);">
          `;
        };
        reader.readAsDataURL(file);
      }
    });
  }
}

function openAdminModal() {
  closeAllModals();
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
    loadAdminUpiSettings();
    renderAdminInventoryList();
    renderAdminOrdersList();
  } else {
    alert('❌ गलत Owner PIN! डिफ़ॉल्ट PIN 8503 दर्ज करें।');
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
        🗑️ हटाएं
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
        📍 पता: ${order.address}
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
    localStorage.setItem('nlr_owner_photo', photoUrl);
    const ownerPhoto = document.getElementById('owner-profile-photo');
    if (ownerPhoto) ownerPhoto.src = photoUrl;
    alert('✅ आपकी ऑनर फोटो सफलता से सहेज दी गई है!');
    closeAdminModal();
  } else {
    alert('कृपया पहले अपनी फोटो सेलेक्ट करें या लिंक पेस्ट करें।');
  }
}

function loadAdminUpiSettings() {
  const input = document.getElementById('admin-upi-id');
  if (input) input.value = getOwnerUpiId();
}

function saveOwnerUpiId() {
  const input = document.getElementById('admin-upi-id');
  if (!input) return;

  const value = input.value.trim().toLowerCase();
  const upiPattern = /^[a-zA-Z0-9._-]{2,}@[a-zA-Z0-9._-]{2,}$/;

  if (!upiPattern.test(value)) {
    alert('⚠️ कृपया सही UPI ID डालें। उदाहरण: 8503090848@ybl');
    input.focus();
    return;
  }

  localStorage.setItem('nlr_owner_upi', value);
  ownerUpiId = value;
  alert(`✅ Owner UPI ID सफलतापूर्वक बदल गई:\n${value}`);
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

// ============================================================
// 🔐 SECURE changeAdminPin — 2-Step Verification with Lockout
// ============================================================
function changeAdminPin() {
  const now = Date.now();

  // 🔒 Brute-force check: agar lockout active hai
  if (pinChangeLockUntil > now) {
    const minutesLeft = Math.ceil((pinChangeLockUntil - now) / 60000);
    alert(`🚫 Bahut zyada galat koshish! ${minutesLeft} minute baad try karein.`);
    return;
  }

  // ✅ Step 1: Master Secret Key maango
  showSecurePinChangeDialog();
}

function showSecurePinChangeDialog() {
  // Remove old dialog if any
  const oldDialog = document.getElementById('secure-pin-dialog');
  if (oldDialog) oldDialog.remove();

  // Create modal overlay
  const overlay = document.createElement('div');
  overlay.id = 'secure-pin-dialog';
  overlay.style.cssText = `
    position: fixed; inset: 0; background: rgba(0,0,0,0.75);
    display: flex; align-items: center; justify-content: center;
    z-index: 99999; font-family: 'Inter', sans-serif;
  `;

  overlay.innerHTML = `
    <div style="background:#1e293b; border-radius:16px; padding:28px 24px; width:90%; max-width:360px;
                box-shadow:0 25px 60px rgba(0,0,0,0.5); border:1px solid #334155; color:#f1f5f9;">
      <div style="text-align:center; margin-bottom:20px;">
        <div style="font-size:2.5rem;">🔐</div>
        <h2 style="margin:8px 0 4px; font-size:1.2rem; color:#f8fafc;">Admin PIN बदलें</h2>
        <p style="font-size:0.8rem; color:#94a3b8; margin:0;">पहले Master Secret Key डालें</p>
      </div>

      <div style="margin-bottom:14px;">
        <label style="font-size:0.8rem; color:#94a3b8; display:block; margin-bottom:6px;">🗝️ Master Secret Key</label>
        <input type="password" id="spc-master-key" placeholder="Master key डालें..."
          style="width:100%; padding:11px 14px; border-radius:8px; border:1px solid #475569;
                 background:#0f172a; color:#f1f5f9; font-size:0.95rem; box-sizing:border-box;
                 outline:none;"
          autocomplete="off"
        />
      </div>

      <div style="margin-bottom:20px;">
        <label style="font-size:0.8rem; color:#94a3b8; display:block; margin-bottom:6px;">🔑 नया Admin PIN (4+ अंक)</label>
        <input type="password" id="spc-new-pin" placeholder="नया PIN डालें..."
          style="width:100%; padding:11px 14px; border-radius:8px; border:1px solid #475569;
                 background:#0f172a; color:#f1f5f9; font-size:0.95rem; box-sizing:border-box;
                 outline:none;"
          autocomplete="off" maxlength="12"
        />
      </div>

      <div id="spc-error" style="color:#ef4444; font-size:0.8rem; text-align:center;
           margin-bottom:12px; display:none;"></div>

      <div style="display:flex; gap:10px;">
        <button onclick="closeSecurePinDialog()"
          style="flex:1; padding:11px; border-radius:8px; border:1px solid #475569;
                 background:transparent; color:#94a3b8; cursor:pointer; font-size:0.9rem;">
          ❌ रद्द करें
        </button>
        <button onclick="confirmSecurePinChange()"
          style="flex:1; padding:11px; border-radius:8px; border:none;
                 background:linear-gradient(135deg,#d97706,#b45309); color:white;
                 cursor:pointer; font-size:0.9rem; font-weight:600;">
          ✅ PIN बदलें
        </button>
      </div>

      <p style="text-align:center; font-size:0.72rem; color:#64748b; margin:14px 0 0;">
        🛡️ सिर्फ Store Owner के लिए
      </p>
    </div>
  `;

  document.body.appendChild(overlay);

  // Focus on master key input
  setTimeout(() => {
    const keyInput = document.getElementById('spc-master-key');
    if (keyInput) keyInput.focus();
  }, 100);

  // Allow Enter key to submit
  overlay.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') confirmSecurePinChange();
    if (e.key === 'Escape') closeSecurePinDialog();
  });
}

function closeSecurePinDialog() {
  const dialog = document.getElementById('secure-pin-dialog');
  if (dialog) dialog.remove();
}

function confirmSecurePinChange() {
  const enteredKey = (document.getElementById('spc-master-key')?.value || '').trim();
  const newPin = (document.getElementById('spc-new-pin')?.value || '').trim();
  const errorEl = document.getElementById('spc-error');

  // ✅ Validate Master Secret Key
  if (enteredKey !== MASTER_SECRET_KEY) {
    pinChangeFailed++;
    localStorage.setItem('nlr_pcf', pinChangeFailed);

    if (pinChangeFailed >= 3) {
      // 🔒 Lock for 30 minutes after 3 failed attempts
      pinChangeLockUntil = Date.now() + (30 * 60 * 1000);
      localStorage.setItem('nlr_pcl', pinChangeLockUntil);
      pinChangeFailed = 0;
      localStorage.setItem('nlr_pcf', '0');
      closeSecurePinDialog();
      alert('🚫 3 बार गलत! 30 मिनट के लिए बंद किया गया।');
      return;
    }

    const remaining = 3 - pinChangeFailed;
    if (errorEl) {
      errorEl.textContent = `❌ गलत Master Key! ${remaining} मौका बाकी है।`;
      errorEl.style.display = 'block';
    }
    // Clear master key input
    const keyInput = document.getElementById('spc-master-key');
    if (keyInput) { keyInput.value = ''; keyInput.focus(); }
    return;
  }

  // ✅ Validate new PIN
  if (!newPin || newPin.length < 4) {
    if (errorEl) {
      errorEl.textContent = '⚠️ PIN कम से कम 4 अंक का होना चाहिए!';
      errorEl.style.display = 'block';
    }
    return;
  }

  if (!/^\d+$/.test(newPin)) {
    if (errorEl) {
      errorEl.textContent = '⚠️ PIN में सिर्फ नंबर (0-9) डालें!';
      errorEl.style.display = 'block';
    }
    return;
  }

  // ✅ Success — reset failed counter and save new PIN
  pinChangeFailed = 0;
  pinChangeLockUntil = 0;
  localStorage.setItem('nlr_pcf', '0');
  localStorage.setItem('nlr_pcl', '0');

  adminPin = newPin;
  localStorage.setItem('nlr_admin_pin', adminPin);

  closeSecurePinDialog();
  alert(`✅ आपका Admin PIN बदलकर "${adminPin}" कर दिया गया है!\n\n🔐 अब Master Secret Key के बिना कोई PIN नहीं बदल सकता।`);
}
