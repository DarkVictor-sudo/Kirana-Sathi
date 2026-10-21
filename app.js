/**
 * किराना साथी (Kirana Saathi) - Offline PWA Application Logic
 * Pure Vanilla JavaScript + IndexedDB + Service Worker
 */

'use strict';

// ==========================================================================
// 1. Translations & Localization Dictionary (Hindi / English)
// ==========================================================================
const TRANSLATIONS = {
  hi: {
    appTitle: 'किराना साथी',
    appSubtitle: 'दुकान का डिजिटल मुनीम',
    online: 'ऑनलाइन',
    offline: 'ऑफलाइन (कैश सक्रिय)',
    welcomeGreeting: 'नमस्ते दुकानदार भाई! 🙏',
    welcomeSub: 'आज की बिक्री और स्टॉक प्रबंधित करें',
    today: 'आज',
    
    // Metrics
    totalProducts: 'कुल सामान',
    lowStock: 'कम स्टॉक',
    deadStock: 'रुका हुआ माल (14 दिन)',
    todaySales: 'आज की बिक्री',

    // Home Actions
    actionAddTitle: 'माल जोड़ें',
    actionAddDesc: 'दुकान में नया सामान या स्टॉक दर्ज करें',
    actionSaleTitle: 'बिक्री करें',
    actionSaleDesc: 'एक टैप में ग्राहक की बिक्री और स्टॉक घटाएं',
    actionStockTitle: 'स्टॉक देखें',
    actionStockDesc: 'रीऑर्डर सूची और रुका हुआ माल जांचें',
    actionAiTitle: 'दुकान AI',
    actionAiDesc: 'स्टॉक, ऑर्डर और बिक्री पर सवाल पूछें',
    aiHeading: 'दुकान AI सहायक',
    aiWorking: 'दुकान का डेटा देख रहा हूं...',
    aiConfirmSale: 'क्या {name} के {quantity} {unit} की बिक्री दर्ज करके स्टॉक घटाऊं?',
    aiConfirmRestock: 'क्या {name} के स्टॉक में {quantity} {unit} जोड़ दूं?',
    aiSaleDone: '{name} की {quantity} {unit} बिक्री दर्ज हुई। बचा स्टॉक: {remaining} {unit}।',
    aiRestockDone: '{name} में {quantity} {unit} जोड़ा। नया स्टॉक: {remaining} {unit}।',
    aiCommandCancelled: 'ठीक है, कोई बदलाव नहीं किया।',
    aiNeedQuantity: 'कितनी मात्रा? सामान का नाम और मात्रा बोलें, जैसे: आटा 2 किलो बेचो।',
    aiCommandNotFound: 'यह सामान स्टॉक में नहीं मिला। पहले इसे माल जोड़ें स्क्रीन से दर्ज करें।',
    aiWorkingOffline: 'मैं फोन के सेव किए स्टॉक और बिक्री डेटा पर सीधे काम करता हूं। supplier के live भाव अभी जुड़े नहीं हैं।',
    aiReorder: '📦 रीऑर्डर सलाह',
    aiForecast: '📈 मांग का अनुमान',
    aiQuestionLabel: 'दुकान के बारे में पूछें',
      aiQuestionPlaceholder: 'अपना सवाल लिखें या माइक दबाकर बोलें',
      aiCommandHint: 'उदाहरण: कितना स्टॉक है? कौन सा माल कम है? आज कितनी बिक्री हुई? आटा 2 किलो बेचो।',
    aiSend: '✦ AI से पूछें',
    aiMicLabel: 'बोलकर सवाल पूछें',
    aiMicListening: 'सुन रहा हूं... अब अपना सवाल बोलें।',
    aiMicUnsupported: 'इस डिवाइस पर आवाज़ से सवाल उपलब्ध नहीं है।',
    aiMicPermission: 'माइक की अनुमति दें, फिर दोबारा दबाएं।',
    aiMicNoSpeech: 'आवाज़ समझ नहीं आई। दोबारा बोलें।',
    aiMicError: 'माइक शुरू नहीं हो सका। अनुमति और इंटरनेट जांचें।',
    aiNoProducts: 'अभी स्टॉक में कोई सामान दर्ज नहीं है।',
    aiAllStock: 'अभी दुकान में {count} सामान दर्ज हैं:',
    aiLowStockAnswer: 'कम या खत्म होने वाला स्टॉक ({count}):',
    aiNoLowStock: 'अभी कोई सामान न्यूनतम सीमा पर या उससे नीचे नहीं है।',
    aiProductStock: '{name}: अभी {quantity} {unit} उपलब्ध है; न्यूनतम सीमा {minimum} {unit} है।',
    aiUnknownProduct: 'इस नाम का सामान स्टॉक सूची में नहीं मिला।',
    aiSalesSummary: 'आज {count} बिक्री हुई; कुल दर्ज बिक्री {amount} है।',
    aiSalesSummaryPeriod: 'पिछले 30 दिनों में {count} बिक्री हुई; दर्ज बिक्री {amount} है।',
    aiNoSales: 'इस अवधि में अभी कोई बिक्री दर्ज नहीं है।',
    aiProductSales: '{name} की चुनी अवधि में {quantity} {unit} बिका ({count} बिक्री रिकॉर्ड)।',
    aiNoProductSales: 'इस सामान की चुनी अवधि में बिक्री दर्ज नहीं है।',
    aiPurchasePrice: '{name} का दर्ज खरीद भाव ₹{price} प्रति {unit} है। यह केवल तुम्हारे सेव किए भाव हैं, live supplier prices नहीं।',
    aiNoPurchasePrice: 'इस सामान का खरीद भाव ऐप में सेव नहीं है।',
    aiNeedProductName: 'किस सामान के बारे में पूछ रहे हो? सामान का नाम लिखें या बोलें।',
    aiSupplierNoLiveData: 'मेरे पास अभी live supplier listings या market prices जुड़े नहीं हैं, इसलिए सबसे सस्ता supplier verify नहीं कर सकता। मैं ऐप में सेव खरीद भाव दिखा सकता हूं।',
    aiQuestionNotUnderstood: 'मैं stock, low stock, sales, या सेव खरीद भाव बता सकता हूं। सवाल को थोड़ा साफ लिखें; बाकी सवाल DeepSeek AI को भेजूंगा।',
    aiReorderPrompt: 'मेरी कम स्टॉक वाली चीजों को प्राथमिकता से बताएं। मौजूदा स्टॉक, न्यूनतम सीमा और पिछले 30 दिनों की बिक्री देखकर कितनी मात्रा मंगानी चाहिए, उसका व्यावहारिक सुझाव दें।',
    aiForecastPrompt: 'पिछले 30 दिनों और उससे पहले के 30 दिनों की बिक्री की तुलना करके अगले 7 दिनों की मांग का सावधान अनुमान दें। कम डेटा होने पर स्पष्ट बताएं।',
    aiMissingEndpoint: 'पहले अपना AI सर्वर URL सेव करें।',
    aiEmptyQuestion: 'पहले अपना सवाल लिखें।',
    aiRequestFailed: 'AI से जवाब नहीं मिला। सर्वर URL और इंटरनेट कनेक्शन जांचें।',
    
    // Banner
    alertTitle: 'कम स्टॉक चेतावनी!',
    alertDesc: '{count} सामान न्यूनतम सीमा पर या उससे नीचे हैं।',
    btnViewReorder: 'रीऑर्डर देखें',

    // Helper Box
    offlineBadge: 'ऑफलाइन के लिए तैयार',
    offlineTip: 'ऐप एक बार लोड होने के बाद ऑफलाइन इस्तेमाल करें',
    btnDemo: 'डेमो सामान लोड करें',
    btnReset: 'डेटा रीसेट',

    // Forms
    formAddHeading: 'नया माल जोड़ें (Add Stock)',
    lblFormName: 'सामान का नाम *',
    placeholderName: 'जैसे: बासमती चावल, फॉर्च्यून तेल...',
    hintName: 'सामान का साफ़ नाम लिखें (उदा: टाटा नमक 1kg)',
    lblFormQty: 'मात्रा (दशमलव संभव) *',
    lblFormUnit: 'इकाई *',
    lblFormMin: 'न्यूनतम स्टॉक सीमा (रीऑर्डर अलर्ट) *',
    lblFormBuy: 'खरीद दर ₹ (ऐच्छिक)',
    lblFormSell: 'बिक्री दर ₹ (ऐच्छिक)',
    btnSaveStock: 'माल सुरक्षित करें (Save)',

    // Quick Sale
    formSaleHeading: 'त्वरित बिक्री (Quick Sale)',
    lblSaleSelect: 'सामान चुनें *',
    selectProductPrompt: '-- सामान चुनें (Select Product) --',
    lblAvailStock: 'मौजूदा उपलब्ध स्टॉक:',
    lblRate: 'प्रति इकाई दर:',
    lblSaleQty: 'बेची जाने वाली मात्रा *',
    lblSaleTotal: 'कुल अनुमानित मूल्य:',
    btnConfirmSale: 'बिक्री दर्ज करें (One-Tap Sale)',
    txtRecentSales: 'हाल की बिक्री (Recent Sales)',
    txtNoSalesYet: 'अभी तक कोई बिक्री दर्ज नहीं हुई।',
    noProductSale: 'स्टॉक में कोई सामान नहीं है!',
    noProductSaleSub: 'पहले "माल जोड़ें" बटन से सामान दर्ज करें।',

    // Stock View
    stockHeading: 'दुकान का स्टॉक (Stock)',
    tabAll: 'सभी सामान',
    tabReorder: 'रीऑर्डर सूची',
    tabDead: 'रुका हुआ माल',
    reorderBarTitle: '📋 सप्लायर को भेजने के लिए:',
    btnShare: 'WhatsApp / शेयर करें',
    btnCopy: 'कॉपी करें',
    searchPlaceholder: '🔍 सामान खोजें (उदा. आटा, चीनी, तेल...)',

    // Bottom Nav
    navHome: 'होम',
    navAdd: 'माल जोड़ें',
    navSale: 'बिक्री करें',
    navStock: 'स्टॉक देखें',

    // Units
    units: {
      'किलो': 'किलो (kg)',
      'ग्राम': 'ग्राम (gm)',
      'लीटर': 'लीटर (ltr)',
      'पैकेट': 'पैकेट (pkt)',
      'पीस': 'पीस (pc)'
    },

    // Alerts / Toasts
    savedSuccess: 'सामान सफलतापूर्वक सेव हो गया!',
    updatedSuccess: 'स्टॉक सफलतापूर्वक बढ़ा दिया गया!',
    saleSuccess: 'बिक्री दर्ज हुई: {qty} {unit} {name}',
    saleErrorExceed: 'त्रुटि! उपलब्ध स्टॉक केवल {avail} {unit} है।',
    confirmDelete: 'क्या आप वाकई "{name}" को हटाना चाहते हैं?',
    confirmReset: 'सावधानी! क्या आप वाकई सभी सामान और बिक्री का डेटा मिटाना चाहते हैं?',
    demoLoaded: 'डेमो उत्पाद और बिक्री डेटा लोड हो गया!',
    dbResetSuccess: 'सारा डेटा साफ़ कर दिया गया!',
    reorderCopied: '📋 रीऑर्डर सूची कॉपी हो गई!',
    noReorderItems: 'रीऑर्डर के लिए कोई कम स्टॉक सामान नहीं है!',
    shareTitle: '🛒 किराना साथी - रीऑर्डर सूची'
  },
  en: {
    appTitle: 'Kirana Saathi',
    appSubtitle: 'Your Digital Store Manager',
    online: 'Online',
    offline: 'Offline (Cache Active)',
    welcomeGreeting: 'Welcome, Kirana Store Partner! 🙏',
    welcomeSub: 'Manage daily sales and inventory offline',
    today: 'Today',

    // Metrics
    totalProducts: 'Total Items',
    lowStock: 'Low Stock',
    deadStock: 'Dead Stock (14d)',
    todaySales: "Today's Sales",

    // Home Actions
    actionAddTitle: 'Add Stock',
    actionAddDesc: 'Record new stock or items in store',
    actionSaleTitle: 'Quick Sale',
    actionSaleDesc: '1-tap sale & instant stock deduction',
    actionStockTitle: 'View Stock',
    actionStockDesc: 'Check reorder list and dead stock',
    actionAiTitle: 'Shop AI',
    actionAiDesc: 'Ask about stock, orders, and sales',
    aiHeading: 'Kirana Saathi AI',
    aiWorking: 'Checking your shop data...',
    aiConfirmSale: 'Record a sale of {quantity} {unit} of {name} and reduce its stock?',
    aiConfirmRestock: 'Add {quantity} {unit} to {name} stock?',
    aiSaleDone: 'Sold {quantity} {unit} of {name}. Remaining stock: {remaining} {unit}.',
    aiRestockDone: 'Added {quantity} {unit} to {name}. New stock: {remaining} {unit}.',
    aiCommandCancelled: 'Okay, nothing was changed.',
    aiNeedQuantity: 'How much? Say the product and amount, for example: sell 2 kg atta.',
    aiCommandNotFound: 'That product is not in stock. Add it from the Add Stock screen first.',
    aiWorkingOffline: 'I work directly with stock and sales saved on this phone. Live supplier prices are not connected.',
    aiReorder: '📦 Reorder advice',
    aiForecast: '📈 Demand forecast',
    aiQuestionLabel: 'Ask about your shop',
    aiQuestionPlaceholder: 'Type a question or tap the mic to speak',
    aiCommandHint: 'Examples: How much atta is left? What is low? How many sales today? Sell 2 kg atta.',
    aiSend: '✦ Ask AI',
    aiMicLabel: 'Ask by voice',
    aiMicListening: 'Listening... speak your question now.',
    aiMicUnsupported: 'Voice input is unavailable on this device.',
    aiMicPermission: 'Allow microphone access, then tap again.',
    aiMicNoSpeech: 'I could not hear that. Please try again.',
    aiMicError: 'Could not start the microphone. Check permission and internet.',
    aiNoProducts: 'No products have been added to stock yet.',
    aiAllStock: '{count} products are currently recorded:',
    aiLowStockAnswer: 'Low or out-of-stock products ({count}):',
    aiNoLowStock: 'No products are at or below their minimum stock right now.',
    aiProductStock: '{name}: {quantity} {unit} available; minimum is {minimum} {unit}.',
    aiUnknownProduct: 'That product was not found in your inventory.',
    aiSalesSummary: '{count} sales recorded today; recorded sales total {amount}.',
    aiSalesSummaryPeriod: '{count} sales recorded in the last 30 days; recorded sales total {amount}.',
    aiNoSales: 'No sales are recorded for this period yet.',
    aiProductSales: '{quantity} {unit} of {name} sold in this period ({count} sale records).',
    aiNoProductSales: 'No sales for this product are recorded in this period.',
    aiPurchasePrice: 'Saved purchase price for {name}: ₹{price} per {unit}. This is your saved price, not a live supplier quote.',
    aiNoPurchasePrice: 'No purchase price is saved for this product.',
    aiNeedProductName: 'Which product do you mean? Please say or type its name.',
    aiSupplierNoLiveData: 'Live supplier listings and market prices are not connected, so I cannot verify the cheapest supplier. I can show purchase prices saved in your app.',
    aiQuestionNotUnderstood: 'I can answer stock, low-stock, sales, or saved purchase-price questions locally. Rephrase your question, or I can send other questions to DeepSeek AI.',
    aiReorderPrompt: 'Prioritize items that need reordering. Use current stock, minimum thresholds, and sales from the last 30 days to suggest practical quantities to order.',
    aiForecastPrompt: 'Compare sales from the last 30 days with the previous 30 days and cautiously estimate demand for the next 7 days. Clearly mention when there is not enough data.',
    aiMissingEndpoint: 'Save your AI server URL first.',
    aiEmptyQuestion: 'Enter a question first.',
    aiRequestFailed: 'Could not get an AI reply. Check the server URL and internet connection.',

    // Banner
    alertTitle: 'Low Stock Alert!',
    alertDesc: '{count} item(s) are at or below minimum limit.',
    btnViewReorder: 'View Reorder',

    // Helper Box
    offlineBadge: 'Offline ready',
    offlineTip: 'Use offline after the app loads successfully once',
    btnDemo: 'Load Demo Products',
    btnReset: 'Reset Data',

    // Forms
    formAddHeading: 'Add New Stock',
    lblFormName: 'Product Name *',
    placeholderName: 'e.g. Basmati Rice, Fortune Oil...',
    hintName: 'Clear name with brand/pack size (e.g. Tata Salt 1kg)',
    lblFormQty: 'Quantity (Decimals allowed) *',
    lblFormUnit: 'Unit *',
    lblFormMin: 'Minimum Stock Threshold (Reorder Alert) *',
    lblFormBuy: 'Purchase Price ₹ (Optional)',
    lblFormSell: 'Selling Price ₹ (Optional)',
    btnSaveStock: 'Save Stock',

    // Quick Sale
    formSaleHeading: 'Quick Sale',
    lblSaleSelect: 'Select Product *',
    selectProductPrompt: '-- Select Product --',
    lblAvailStock: 'Available In Stock:',
    lblRate: 'Rate per unit:',
    lblSaleQty: 'Quantity Sold *',
    lblSaleTotal: 'Estimated Total:',
    btnConfirmSale: 'Confirm Sale (One-Tap)',
    txtRecentSales: 'Recent Sales',
    txtNoSalesYet: 'No sales recorded yet.',
    noProductSale: 'No products in inventory!',
    noProductSaleSub: 'Add items first using the "Add Stock" button.',

    // Stock View
    stockHeading: 'Store Inventory',
    tabAll: 'All Products',
    tabReorder: 'Reorder List',
    tabDead: 'Dead Stock',
    reorderBarTitle: '📋 Send to Supplier:',
    btnShare: 'Share / WhatsApp',
    btnCopy: 'Copy List',
    searchPlaceholder: '🔍 Search product (e.g. Rice, Sugar, Oil...)',

    // Bottom Nav
    navHome: 'Home',
    navAdd: 'Add Stock',
    navSale: 'Quick Sale',
    navStock: 'View Stock',

    // Units
    units: {
      'किलो': 'Kg (किलो)',
      'ग्राम': 'Gram (ग्राम)',
      'लीटर': 'Liter (लीटर)',
      'पैकेट': 'Packet (पैकेट)',
      'पीस': 'Piece (पीस)'
    },

    // Alerts / Toasts
    savedSuccess: 'Product saved successfully!',
    updatedSuccess: 'Stock quantity updated!',
    saleSuccess: 'Sale recorded: {qty} {unit} {name}',
    saleErrorExceed: 'Error! Available stock is only {avail} {unit}.',
    confirmDelete: 'Are you sure you want to delete "{name}"?',
    confirmReset: 'Warning! Do you really want to erase all products & sales data?',
    demoLoaded: 'Demo products & sales loaded successfully!',
    dbResetSuccess: 'All local data has been reset!',
    reorderCopied: '📋 Reorder list copied to clipboard!',
    noReorderItems: 'No items need reordering right now!',
    shareTitle: '🛒 Kirana Saathi - Reorder List'
  }
};

let currentLang = localStorage.getItem('kirana_lang') || 'hi';

// ==========================================================================
// 2. IndexedDB Storage Engine (Zero External Dependencies)
// ==========================================================================
const DB_NAME = 'KiranaSaathiDB';
const DB_VERSION = 1;
let db = null;

function initDB() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = (event) => {
      const dbInstance = event.target.result;

      // Products Store
      if (!dbInstance.objectStoreNames.contains('products')) {
        const productStore = dbInstance.createObjectStore('products', {
          keyPath: 'id',
          autoIncrement: true
        });
        productStore.createIndex('name', 'name', { unique: false });
        productStore.createIndex('normalizedName', 'normalizedName', { unique: false });
        productStore.createIndex('createdAt', 'createdAt', { unique: false });
      }

      // Sales Store
      if (!dbInstance.objectStoreNames.contains('sales')) {
        const salesStore = dbInstance.createObjectStore('sales', {
          keyPath: 'id',
          autoIncrement: true
        });
        salesStore.createIndex('productId', 'productId', { unique: false });
        salesStore.createIndex('soldAt', 'soldAt', { unique: false });
      }
    };

    request.onsuccess = (event) => {
      db = event.target.result;
      resolve(db);
    };

    request.onerror = (event) => {
      console.error('IndexedDB Error:', event.target.error);
      reject(event.target.error);
    };
  });
}

// Database Operations
const DBService = {
  // Products
  async getAllProducts() {
    return new Promise((resolve, reject) => {
      const tx = db.transaction('products', 'readonly');
      const store = tx.objectStore('products');
      const req = store.getAll();
      req.onsuccess = () => resolve(req.result || []);
      req.onerror = () => reject(req.error);
    });
  },

  async getProductById(id) {
    return new Promise((resolve, reject) => {
      const tx = db.transaction('products', 'readonly');
      const store = tx.objectStore('products');
      const req = store.get(Number(id));
      req.onsuccess = () => resolve(req.result || null);
      req.onerror = () => reject(req.error);
    });
  },

  async addProduct(product) {
    return new Promise((resolve, reject) => {
      const tx = db.transaction('products', 'readwrite');
      const store = tx.objectStore('products');
      const req = store.add(product);
      req.onsuccess = () => resolve(req.result);
      req.onerror = () => reject(req.error);
    });
  },

  async updateProduct(product) {
    return new Promise((resolve, reject) => {
      const tx = db.transaction('products', 'readwrite');
      const store = tx.objectStore('products');
      const req = store.put(product);
      req.onsuccess = () => resolve(req.result);
      req.onerror = () => reject(req.error);
    });
  },

  async deleteProduct(id) {
    return new Promise((resolve, reject) => {
      const tx = db.transaction('products', 'readwrite');
      const store = tx.objectStore('products');
      const req = store.delete(Number(id));
      req.onsuccess = () => resolve(true);
      req.onerror = () => reject(req.error);
    });
  },

  // Sales
  async addSale(sale) {
    return new Promise((resolve, reject) => {
      const tx = db.transaction('sales', 'readwrite');
      const store = tx.objectStore('sales');
      const req = store.add(sale);
      req.onsuccess = () => resolve(req.result);
      req.onerror = () => reject(req.error);
    });
  },

  async recordSale(productId, quantitySold, soldAt) {
    return new Promise((resolve, reject) => {
      const tx = db.transaction(['products', 'sales'], 'readwrite');
      const products = tx.objectStore('products');
      const sales = tx.objectStore('sales');
      let transactionError = null;
      let updatedProduct = null;

      const request = products.get(Number(productId));
      request.onsuccess = () => {
        const product = request.result;
        if (!product) {
          transactionError = new Error('Product not found');
          tx.abort();
          return;
        }

        const available = cleanDecimal(product.quantity);
        if (quantitySold > available) {
          transactionError = new Error('Insufficient stock');
          transactionError.available = available;
          tx.abort();
          return;
        }

        updatedProduct = {
          ...product,
          quantity: cleanDecimal(available - quantitySold),
          updatedAt: soldAt
        };
        const sellingPrice = product.sellingPrice ?? null;

        products.put(updatedProduct);
        sales.add({
          productId: product.id,
          productName: product.name,
          quantitySold,
          unit: product.unit,
          sellingPrice,
          totalPrice: sellingPrice === null ? null : cleanDecimal(quantitySold * sellingPrice),
          soldAt
        });
      };

      tx.oncomplete = () => resolve(updatedProduct);
      tx.onabort = () => reject(transactionError || tx.error || new Error('Sale could not be saved'));
      tx.onerror = () => reject(transactionError || tx.error || new Error('Sale could not be saved'));
    });
  },

  async getAllSales() {
    return new Promise((resolve, reject) => {
      const tx = db.transaction('sales', 'readonly');
      const store = tx.objectStore('sales');
      const req = store.getAll();
      req.onsuccess = () => resolve(req.result || []);
      req.onerror = () => reject(req.error);
    });
  },

  async getSalesForProduct(productId) {
    return new Promise((resolve, reject) => {
      const tx = db.transaction('sales', 'readonly');
      const store = tx.objectStore('sales');
      const index = store.index('productId');
      const req = index.getAll(Number(productId));
      req.onsuccess = () => resolve(req.result || []);
      req.onerror = () => reject(req.error);
    });
  },

  async clearAll() {
    return new Promise((resolve, reject) => {
      const tx = db.transaction(['products', 'sales'], 'readwrite');
      tx.objectStore('products').clear();
      tx.objectStore('sales').clear();
      tx.oncomplete = () => resolve(true);
      tx.onerror = () => reject(tx.error);
    });
  }
};

// ==========================================================================
// 3. Helper Functions (Decimals, Dates, Formatting)
// ==========================================================================

// Round clean decimals avoiding floating point artifacts (e.g., 2.5 - 0.1 = 2.40)
function cleanDecimal(val, places = 2) {
  const num = parseFloat(val);
  if (isNaN(num)) return 0;
  const factor = Math.pow(10, places);
  return Math.round(num * factor) / factor;
}

// Format numbers for display (e.g., 2.5 or 10)
function formatQty(val) {
  const num = cleanDecimal(val, 2);
  return num.toString();
}

function formatPrice(val) {
  if (val === null || val === undefined || val === '' || isNaN(val)) return '-';
  return '₹ ' + cleanDecimal(val, 2).toFixed(2);
}

function formatDate(isoStr) {
  if (!isoStr) return '-';
  const d = new Date(isoStr);
  return d.toLocaleDateString('hi-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric'
  });
}

function formatTime(isoStr) {
  if (!isoStr) return '';
  const d = new Date(isoStr);
  return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

// Normalize strings for duplicate detection
function normalize(str) {
  return (str || '').trim().toLowerCase();
}

// Toast Notifications
function showToast(message, type = 'success') {
  const container = document.getElementById('toast-container');
  if (!container) return;

  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;
  toast.textContent = message;
  container.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateY(-10px)';
    toast.style.transition = 'all 0.25s ease';
    setTimeout(() => toast.remove(), 250);
  }, 2800);
}

// ==========================================================================
// 4. UI Localization & Translation Helpers
// ==========================================================================
function t(key, vars = {}) {
  const dict = TRANSLATIONS[currentLang] || TRANSLATIONS.hi;
  let text = dict[key] || TRANSLATIONS.hi[key] || key;

  // Replace placeholders like {count}, {qty}, etc.
  for (const [k, v] of Object.entries(vars)) {
    text = text.replace(new RegExp(`\\{${k}\\}`, 'g'), v);
  }
  return text;
}

function applyLocalization() {
  document.documentElement.lang = currentLang;

  // Language button label
  const btnLang = document.getElementById('btn-lang-toggle');
  if (btnLang) {
    btnLang.textContent = currentLang === 'hi' ? '🌐 English' : '🌐 हिंदी';
  }

  // App titles
  setText('txt-app-title', t('appTitle'));
  setText('txt-app-subtitle', t('appSubtitle'));
  updateNetworkStatus();

  // Home Screen
  setText('txt-welcome-greeting', t('welcomeGreeting'));
  setText('txt-welcome-sub', t('welcomeSub'));
  setText('lbl-total-products', t('totalProducts'));
  setText('lbl-low-stock', t('lowStock'));
  setText('lbl-dead-stock', t('deadStock'));
  setText('lbl-today-sales', t('todaySales'));

  setText('txt-action-add-title', t('actionAddTitle'));
  setText('txt-action-add-desc', t('actionAddDesc'));
  setText('txt-action-sale-title', t('actionSaleTitle'));
  setText('txt-action-sale-desc', t('actionSaleDesc'));
  setText('txt-action-stock-title', t('actionStockTitle'));
  setText('txt-action-stock-desc', t('actionStockDesc'));
  setText('txt-action-ai-title', t('actionAiTitle'));
  setText('txt-action-ai-desc', t('actionAiDesc'));

  setText('home-alert-title', t('alertTitle'));
  setText('btn-goto-reorder', t('btnViewReorder'));
  setText('txt-offline-badge', t('offlineBadge'));
  setText('txt-offline-tip', t('offlineTip'));
  setText('txt-btn-demo', t('btnDemo'));
  setText('txt-btn-reset', t('btnReset'));

  // Add Stock Form
  setText('txt-form-add-heading', t('formAddHeading'));
  setText('lbl-form-name', t('lblFormName'));
  setPlaceholder('input-product-name', t('placeholderName'));
  setText('hint-name', t('hintName'));
  setText('lbl-form-qty', t('lblFormQty'));
  setText('lbl-form-unit', t('lblFormUnit'));
  setText('lbl-form-min', t('lblFormMin'));
  setText('lbl-form-buy', t('lblFormBuy'));
  setText('lbl-form-sell', t('lblFormSell'));
  setText('txt-btn-save-stock', t('btnSaveStock'));

  // Quick Sale
  setText('txt-form-sale-heading', t('formSaleHeading'));
  setText('lbl-sale-select', t('lblSaleSelect'));
  setText('lbl-avail-stock', t('lblAvailStock'));
  setText('lbl-rate', t('lblRate'));
  setText('lbl-sale-qty', t('lblSaleQty'));
  setText('lbl-sale-total', t('lblSaleTotal'));
  setText('txt-btn-confirm-sale', t('btnConfirmSale'));
  setText('txt-recent-sales', t('txtRecentSales'));
  setText('txt-no-sales-yet', t('txtNoSalesYet'));
  setText('txt-no-product-sale', t('noProductSale'));
  setText('txt-no-product-sale-sub', t('noProductSaleSub'));

  // Stock View
  setText('txt-stock-heading', t('stockHeading'));
  setText('txt-tab-all', t('tabAll'));
  setText('txt-tab-reorder', t('tabReorder'));
  setText('txt-tab-dead', t('tabDead'));
  setText('txt-reorder-bar-title', t('reorderBarTitle'));
  setText('txt-btn-share', t('btnShare'));
  setText('txt-btn-copy', t('btnCopy'));
  setPlaceholder('input-stock-search', t('searchPlaceholder'));

  setText('txt-ai-heading', t('aiHeading'));
  setText('btn-ai-reorder', t('aiReorder'));
  setText('btn-ai-forecast', t('aiForecast'));
  setText('lbl-ai-question', t('aiQuestionLabel'));
  setPlaceholder('input-ai-question', t('aiQuestionPlaceholder'));
  setText('txt-ai-command-hint', t('aiCommandHint'));
  setText('btn-ai-send', t('aiSend'));
  document.getElementById('btn-ai-mic')?.setAttribute('aria-label', t('aiMicLabel'));

  // Bottom Nav
  setText('lbl-nav-home', t('navHome'));
  setText('lbl-nav-add', t('navAdd'));
  setText('lbl-nav-sale', t('navSale'));
  setText('lbl-nav-stock', t('navStock'));

  // Unit Options in dropdown
  updateUnitDropdown();
}

async function collectShopAIContext() {
  const [products, sales] = await Promise.all([
    DBService.getAllProducts(),
    DBService.getAllSales()
  ]);
  const now = Date.now();
  const thirtyDays = 30 * 24 * 60 * 60 * 1000;
  const recentSales = sales
    .filter((sale) => now - new Date(sale.soldAt).getTime() <= 60 * thirtyDays)
    .sort((a, b) => new Date(b.soldAt) - new Date(a.soldAt))
    .slice(0, 200)
    .map((sale) => ({
      productName: sale.productName,
      quantity: cleanDecimal(sale.quantitySold),
      unit: sale.unit,
      date: sale.soldAt
    }));

  const productContext = products.map((product) => {
    const productSales = sales.filter((sale) => sale.productId === product.id);
    const soldInWindow = (start, end) => cleanDecimal(productSales
      .filter((sale) => {
        const date = new Date(sale.soldAt).getTime();
        return date >= start && date < end;
      })
      .reduce((sum, sale) => sum + Number(sale.quantitySold || 0), 0));

    return {
      name: product.name,
      quantity: cleanDecimal(product.quantity),
      unit: product.unit,
      minimum: cleanDecimal(product.minStock),
      sellingPrice: product.sellingPrice,
      soldLast30Days: soldInWindow(now - thirtyDays, now),
      soldPrevious30Days: soldInWindow(now - 2 * thirtyDays, now - thirtyDays)
    };
  });

  return { products: productContext, sales: recentSales };
}

function aiQuestionHas(question, terms) {
  return terms.some((term) => question.includes(term));
}

function matchQuestionProduct(question, products) {
  return products
    .map((product) => {
      const words = normalize(product.name).split(/[^\p{L}\p{N}]+/u).filter((word) => word.length >= 3);
      const score = words.reduce((total, word) => total + (question.includes(word) ? word.length : 0), 0);
      return { product, score };
    })
    .filter((match) => match.score > 0)
    .sort((a, b) => b.score - a.score)[0]?.product || null;
}

async function answerShopQuestionLocally(questionText) {
  const question = normalize(questionText);
  const products = await DBService.getAllProducts();
  const sales = await DBService.getAllSales();
  const product = matchQuestionProduct(question, products);
  const amountMatch = question.match(/(\d+(?:[.,]\d+)?)/);
  const requestedQuantity = amountMatch ? cleanDecimal(amountMatch[1].replace(',', '.')) : 0;
  const asksSellCommand = aiQuestionHas(question, ['बेचो', 'बेच दो', 'बेच दें', 'becho', 'bech do', 'bech de', 'bikri karo', 'बिक्री करो', 'sale kar', 'sell ', 'sell it', 'निकाल दो']);
  const asksRestockCommand = aiQuestionHas(question, ['स्टॉक जोड़', 'माल जोड़', 'जोड़ दो', 'बढ़ा दो', 'jod do', 'jod de', 'stock jod', 'maal jod', 'add stock', 'restock', 'add ']);
  const asksSupplier = aiQuestionHas(question, ['कहां से', 'kahase', 'kaha se', 'supplier', 'सप्लायर', 'सबसे सस्ता', 'sasta', 'cheap', 'best price', 'कहां खरीद', 'where to buy']);
  const asksLowStock = aiQuestionHas(question, ['कम स्टॉक', 'kam stock', 'low stock', 'खत्म', 'khatm', 'khatam', 'khatam ho raha', 'khatm ho raha', 'कम हो रहा', 'out of stock', 'reorder', 'रीऑर्डर', 'कौन सा खत्म', 'kaun sa khatam', 'kaun sa stock khatam']);
  const asksSales = aiQuestionHas(question, ['बिक्री', 'sales', 'sale', 'बेचा', 'bika', 'kitne hue', 'कितने हुए', 'revenue', 'कमाई']);
  const asksStock = aiQuestionHas(question, ['स्टॉक', 'stock', 'माल कितना', 'kitna hai', 'कितना है', 'उपलब्ध', 'available', 'inventory']);
  const asksPurchasePrice = aiQuestionHas(question, ['खरीद भाव', 'purchase price', 'खरीदा', 'buying price', 'दर्ज भाव']);
  const asksForecast = aiQuestionHas(question, ['अनुमान', 'forecast', 'मांग', 'demand', 'अगले हफ्ते', 'next week']);
  const asksReorderAdvice = aiQuestionHas(question, ['रीऑर्डर सलाह', 'reorder advice', 'क्या मंगाऊं', 'kya mangau', 'क्या खरीदूं']);

  if (asksSellCommand || asksRestockCommand) {
    if (!product) return t('aiCommandNotFound');
    if (!Number.isFinite(requestedQuantity) || requestedQuantity <= 0) return t('aiNeedQuantity');
    if (asksSellCommand) {
      if (requestedQuantity > cleanDecimal(product.quantity)) {
        return t('saleErrorExceed', { avail: formatQty(product.quantity), unit: product.unit });
      }
      const approved = confirm(t('aiConfirmSale', {
        name: product.name,
        quantity: formatQty(requestedQuantity),
        unit: product.unit
      }));
      if (!approved) return t('aiCommandCancelled');

      const soldProduct = await DBService.recordSale(product.id, requestedQuantity, new Date().toISOString());
      await refreshAllViews();
      return t('aiSaleDone', {
        name: soldProduct.name,
        quantity: formatQty(requestedQuantity),
        unit: soldProduct.unit,
        remaining: formatQty(soldProduct.quantity)
      });
    }

    const approved = confirm(t('aiConfirmRestock', {
      name: product.name,
      quantity: formatQty(requestedQuantity),
      unit: product.unit
    }));
    if (!approved) return t('aiCommandCancelled');
    product.quantity = cleanDecimal(cleanDecimal(product.quantity) + requestedQuantity);
    product.updatedAt = new Date().toISOString();
    await DBService.updateProduct(product);
    await refreshAllViews();
    return t('aiRestockDone', {
      name: product.name,
      quantity: formatQty(requestedQuantity),
      unit: product.unit,
      remaining: formatQty(product.quantity)
    });
  }

  if (asksSupplier) {
    if (product && product.purchasePrice !== null && product.purchasePrice !== undefined) {
      return t('aiPurchasePrice', {
        name: product.name,
        price: cleanDecimal(product.purchasePrice).toFixed(2),
        unit: product.unit
      }) + '\n\n' + t('aiSupplierNoLiveData');
    }
    return t('aiSupplierNoLiveData');
  }

  if (asksLowStock) {
    const lowProducts = products.filter(isLowStock).sort((a, b) => a.quantity - b.quantity);
    if (!lowProducts.length) return t('aiNoLowStock');
    const lines = lowProducts.map((item) => {
      const condition = cleanDecimal(item.quantity) <= 0
        ? (currentLang === 'hi' ? 'स्टॉक खत्म' : 'out of stock')
        : `${formatQty(item.quantity)} ${item.unit} (${currentLang === 'hi' ? 'न्यूनतम' : 'min'} ${formatQty(item.minStock)} ${item.unit})`;
      return `• ${item.name}: ${condition}; ${currentLang === 'hi' ? 'मंगाने का सुझाव' : 'suggested reorder'} ${formatQty(calculateSuggestedReorder(item))} ${item.unit}`;
    });
    return `${t('aiLowStockAnswer', { count: lowProducts.length })}\n${lines.join('\n')}`;
  }

  if (asksReorderAdvice) {
    const lowProducts = products.filter(isLowStock).sort((a, b) => a.quantity - b.quantity);
    if (!lowProducts.length) return t('aiNoLowStock');
    return `${t('aiLowStockAnswer', { count: lowProducts.length })}\n${lowProducts.map((item) => {
      const recentQuantity = sales
        .filter((sale) => sale.productId === item.id && Date.now() - new Date(sale.soldAt).getTime() <= 30 * 24 * 60 * 60 * 1000)
        .reduce((sum, sale) => sum + Number(sale.quantitySold || 0), 0);
      const dailyAverage = recentQuantity / 30;
      const demandSuggestion = Math.max(calculateSuggestedReorder(item), cleanDecimal(dailyAverage * 7));
      return `• ${item.name}: ${formatQty(item.quantity)} ${item.unit} ${currentLang === 'hi' ? 'बाकी; अगले 7 दिन का दर्ज औसत' : 'left; recorded 7-day demand'} ${formatQty(cleanDecimal(dailyAverage * 7))} ${item.unit}; ${currentLang === 'hi' ? 'मंगाने का सुझाव' : 'suggested order'} ${formatQty(demandSuggestion)} ${item.unit}`;
    }).join('\n')}`;
  }

  if (asksForecast) {
    const recentWindowStart = Date.now() - 30 * 24 * 60 * 60 * 1000;
    const soldRecently = sales.filter((sale) => new Date(sale.soldAt).getTime() >= recentWindowStart);
    if (!soldRecently.length) return t('aiNoSales');
    return `${currentLang === 'hi' ? 'पिछले 30 दिनों की बिक्री के आधार पर अगले 7 दिनों का साधारण अनुमान:' : 'Simple next-7-day estimate from the last 30 days of sales:'}\n${products.map((item) => {
      const quantity = soldRecently
        .filter((sale) => sale.productId === item.id)
        .reduce((sum, sale) => sum + Number(sale.quantitySold || 0), 0);
      return `• ${item.name}: ${formatQty(cleanDecimal(quantity / 30 * 7))} ${item.unit}`;
    }).join('\n')}\n${currentLang === 'hi' ? 'यह दर्ज बिक्री का औसत है, पक्का market forecast नहीं।' : 'This is a recorded-sales average, not a guaranteed market forecast.'}`;
  }

  if (asksSales) {
    const now = Date.now();
    const asksToday = aiQuestionHas(question, ['आज', 'today', 'aaj']);
    const periodStart = asksToday
      ? new Date().setHours(0, 0, 0, 0)
      : now - 30 * 24 * 60 * 60 * 1000;
    const periodSales = sales.filter((sale) => new Date(sale.soldAt).getTime() >= periodStart);
    if (!periodSales.length) return t('aiNoSales');

    if (product) {
      const productSales = periodSales.filter((sale) => sale.productId === product.id);
      if (!productSales.length) return t('aiNoProductSales');
      const quantity = cleanDecimal(productSales.reduce((sum, sale) => sum + Number(sale.quantitySold || 0), 0));
      return t('aiProductSales', { name: product.name, quantity: formatQty(quantity), unit: product.unit, count: productSales.length });
    }

    const amount = periodSales.reduce((sum, sale) => sum + Number(sale.totalPrice || 0), 0);
    const amountText = `₹${cleanDecimal(amount).toFixed(2)}${periodSales.some((sale) => sale.totalPrice == null) ? (currentLang === 'hi' ? ' (कुछ बिक्री का भाव दर्ज नहीं था)' : ' (some sales had no price recorded)') : ''}`;
    return asksToday
      ? t('aiSalesSummary', { count: periodSales.length, amount: amountText })
      : t('aiSalesSummaryPeriod', { count: periodSales.length, amount: amountText });
  }

  if (asksPurchasePrice) {
    if (!product) return t('aiNeedProductName');
    return product.purchasePrice == null
      ? t('aiNoPurchasePrice')
      : t('aiPurchasePrice', { name: product.name, price: cleanDecimal(product.purchasePrice).toFixed(2), unit: product.unit });
  }

  if (asksStock) {
    if (!products.length) return t('aiNoProducts');
    if (product) {
      return t('aiProductStock', {
        name: product.name,
        quantity: formatQty(product.quantity),
        unit: product.unit,
        minimum: formatQty(product.minStock)
      });
    }
    const lines = products
      .slice()
      .sort((a, b) => a.name.localeCompare(b.name))
      .map((item) => `• ${item.name}: ${formatQty(item.quantity)} ${item.unit}${isLowStock(item) ? (currentLang === 'hi' ? ' (कम स्टॉक)' : ' (low stock)') : ''}`);
    return `${t('aiAllStock', { count: products.length })}\n${lines.join('\n')}`;
  }

  return t('aiQuestionNotUnderstood');
}

async function askShopAI(question) {
  const answer = document.getElementById('ai-answer');
  const submitButton = document.getElementById('btn-ai-send');
  submitButton.disabled = true;
  answer.textContent = t('aiWorking');
  answer.classList.remove('hidden', 'ai-answer-error');

  try {
    const localAnswer = await answerShopQuestionLocally(question);
    if (localAnswer) {
      answer.textContent = localAnswer;
      submitButton.disabled = false;
      return;
    }
  } catch (error) {
    console.error('Local shop answer failed:', error);
  }
  answer.textContent = t('aiQuestionNotUnderstood');
  submitButton.disabled = false;
}

function handleAIQuestionSubmit(event) {
  event.preventDefault();
  const input = document.getElementById('input-ai-question');
  const question = input.value.trim();
  if (!question) {
    showToast(t('aiEmptyQuestion'), 'warning');
    input.focus();
    return;
  }
  askShopAI(question);
}

async function startAIListening() {
  const button = document.getElementById('btn-ai-mic');
  const status = document.getElementById('ai-mic-status');
  const input = document.getElementById('input-ai-question');
  button.disabled = true;
  status.textContent = t('aiMicListening');
  button.classList.add('is-listening');
  button.setAttribute('aria-pressed', 'true');

  try {
    let spokenText = '';
    const nativeSpeech = window.KiranaSpeechRecognition;
    if (nativeSpeech && window.Capacitor?.isNativePlatform?.()) {
      const availability = await nativeSpeech.available();
      if (!availability.available) throw new Error('unsupported');

      const permission = await nativeSpeech.requestPermissions();
      if (permission.speechRecognition !== 'granted') throw new Error('permission');

      const result = await nativeSpeech.start({
        language: currentLang === 'hi' ? 'hi-IN' : 'en-IN',
        maxResults: 1,
        prompt: t('aiMicLabel'),
        partialResults: false,
        popup: true
      });
      spokenText = result.matches?.[0] || '';
    } else {
      const BrowserSpeech = window.SpeechRecognition || window.webkitSpeechRecognition;
      if (!BrowserSpeech) throw new Error('unsupported');
      spokenText = await new Promise((resolve, reject) => {
        const recognition = new BrowserSpeech();
        recognition.lang = currentLang === 'hi' ? 'hi-IN' : 'en-IN';
        recognition.maxAlternatives = 1;
        recognition.onresult = (event) => resolve(event.results[0][0].transcript);
        recognition.onerror = (event) => reject(new Error(event.error));
        recognition.onend = () => resolve('');
        recognition.start();
      });
    }

    if (!spokenText.trim()) {
      status.textContent = t('aiMicNoSpeech');
      return;
    }
    input.value = spokenText.trim();
    status.textContent = '';
    await askShopAI(input.value);
  } catch (error) {
    console.warn('Voice input failed:', error);
    if (error.message === 'permission' || error.message?.toLowerCase().includes('permission')) {
      status.textContent = t('aiMicPermission');
    } else if (error.message === 'unsupported') {
      status.textContent = t('aiMicUnsupported');
    } else {
      status.textContent = t('aiMicError');
    }
  } finally {
    button.disabled = false;
    button.classList.remove('is-listening');
    button.setAttribute('aria-pressed', 'false');
  }
}

function setText(id, text) {
  const el = document.getElementById(id);
  if (el) el.textContent = text;
}

function setPlaceholder(id, text) {
  const el = document.getElementById(id);
  if (el) el.placeholder = text;
}

function updateUnitDropdown() {
  const unitSelect = document.getElementById('input-product-unit');
  if (!unitSelect) return;
  const currentVal = unitSelect.value || 'किलो';
  const units = TRANSLATIONS[currentLang].units;
  unitSelect.innerHTML = `
    <option value="किलो">${units['किलो']}</option>
    <option value="ग्राम">${units['ग्राम']}</option>
    <option value="लीटर">${units['लीटर']}</option>
    <option value="पैकेट">${units['पैकेट']}</option>
    <option value="पीस">${units['पीस']}</option>
  `;
  unitSelect.value = currentVal;
}

function toggleLanguage() {
  currentLang = currentLang === 'hi' ? 'en' : 'hi';
  localStorage.setItem('kirana_lang', currentLang);
  applyLocalization();
  refreshAllViews();
}

// Network Status
function updateNetworkStatus() {
  const badge = document.getElementById('network-badge');
  const txt = document.getElementById('txt-network-status');
  if (!badge || !txt) return;

  if (navigator.onLine) {
    badge.className = 'badge-status online';
    txt.textContent = t('online');
  } else {
    badge.className = 'badge-status offline';
    txt.textContent = t('offline');
  }
}

// ==========================================================================
// 5. Navigation & View Routing
// ==========================================================================
let currentView = 'view-home';
let currentStockTab = 'all'; // 'all' | 'reorder' | 'dead'

function navigateTo(viewId) {
  const views = document.querySelectorAll('.view');
  views.forEach((v) => v.classList.remove('active'));

  const target = document.getElementById(viewId);
  if (target) {
    target.classList.add('active');
    currentView = viewId;
  }

  // Update bottom navigation tabs
  const navTabs = document.querySelectorAll('.nav-tab');
  navTabs.forEach((tab) => {
    if (tab.getAttribute('data-view') === viewId) {
      tab.classList.add('active');
    } else {
      tab.classList.remove('active');
    }
  });

  // View specific refreshes
  if (viewId === 'view-quick-sale') {
    refreshSaleProductSelect();
    loadRecentSales();
  } else if (viewId === 'view-stock') {
    renderStockList();
  } else if (viewId === 'view-home') {
    refreshHomeMetrics();
  }

  window.scrollTo({ top: 0, behavior: 'smooth' });
}

// ==========================================================================
// 6. Business Logic: Reorder List & Dead Stock
// ==========================================================================

/**
 * Reorder Rule:
 * Product is in reorder list if current quantity <= minStock
 * Suggested reorder quantity = (minStock * 2) - currentQuantity
 */
function isLowStock(product) {
  const qty = cleanDecimal(product.quantity);
  const min = cleanDecimal(product.minStock);
  return qty <= min;
}

function calculateSuggestedReorder(product) {
  const qty = cleanDecimal(product.quantity);
  const min = cleanDecimal(product.minStock);
  const target = min * 2;
  const suggested = target - qty;
  return cleanDecimal(Math.max(suggested, min, 1));
}

/**
 * Dead Stock Rule:
 * 1. Product must have remaining stock (> 0).
 * 2. Crucial: "Do not mark newly added products as dead stock until they have been tracked for at least 14 days".
 * 3. Has had NO recorded sales in the last 14 days.
 */
function isDeadStock(product, salesForProduct) {
  const qty = cleanDecimal(product.quantity);
  if (qty <= 0) return false;

  const now = Date.now();
  const FOURTEEN_DAYS_MS = 14 * 24 * 60 * 60 * 1000;

  const createdTime = new Date(product.createdAt).getTime();
  const ageMs = now - createdTime;

  // If added less than 14 days ago, it cannot be considered dead stock!
  if (ageMs < FOURTEEN_DAYS_MS) {
    return false;
  }

  // If product has been tracked 14+ days:
  if (!salesForProduct || salesForProduct.length === 0) {
    // No sales recorded ever, and older than 14 days -> Dead Stock!
    return true;
  }

  // Find the most recent sale
  let latestSaleTime = 0;
  for (const s of salesForProduct) {
    const saleTime = new Date(s.soldAt).getTime();
    if (saleTime > latestSaleTime) {
      latestSaleTime = saleTime;
    }
  }

  // If latest sale occurred more than 14 days ago -> Dead Stock!
  return (now - latestSaleTime) >= FOURTEEN_DAYS_MS;
}

// ==========================================================================
// 7. Data Synchronization & View Rendering
// ==========================================================================

async function refreshAllViews() {
  await refreshHomeMetrics();
  if (currentView === 'view-stock') renderStockList();
  if (currentView === 'view-quick-sale') refreshSaleProductSelect();
}

// Refresh Home Metrics and Low-Stock Alert Banner
async function refreshHomeMetrics() {
  try {
    const products = await DBService.getAllProducts();
    const sales = await DBService.getAllSales();

    let lowCount = 0;
    let deadCount = 0;

    // Map sales by productId for fast lookup
    const salesMap = {};
    for (const s of sales) {
      if (!salesMap[s.productId]) salesMap[s.productId] = [];
      salesMap[s.productId].push(s);
    }

    for (const p of products) {
      if (isLowStock(p)) lowCount++;
      if (isDeadStock(p, salesMap[p.id])) deadCount++;
    }

    // Count today's sales
    const todayStr = new Date().toDateString();
    let todaySalesCount = 0;
    for (const s of sales) {
      if (new Date(s.soldAt).toDateString() === todayStr) {
        todaySalesCount++;
      }
    }

    // Update Counters
    setText('stat-total-products', products.length);
    setText('stat-low-stock', lowCount);
    setText('stat-dead-stock', deadCount);
    setText('stat-today-sales', todaySalesCount);

    // Update Banner
    const banner = document.getElementById('home-alert-banner');
    const lowCountSpan = document.getElementById('home-low-count');
    const alertDesc = document.getElementById('home-alert-desc');

    if (banner) {
      if (lowCount > 0) {
        banner.classList.remove('hidden');
        if (lowCountSpan) lowCountSpan.textContent = lowCount;
        if (alertDesc) alertDesc.textContent = t('alertDesc', { count: lowCount });
      } else {
        banner.classList.add('hidden');
      }
    }
  } catch (err) {
    console.error('Failed to load metrics:', err);
  }
}

// ==========================================================================
// 8. Add Stock Implementation
// ==========================================================================
async function handleAddProductSubmit(event) {
  event.preventDefault();

  const nameInput = document.getElementById('input-product-name');
  const qtyInput = document.getElementById('input-product-qty');
  const unitSelect = document.getElementById('input-product-unit');
  const minInput = document.getElementById('input-product-min');
  const buyInput = document.getElementById('input-product-buy');
  const sellInput = document.getElementById('input-product-sell');

  const name = nameInput.value.trim();
  const quantity = cleanDecimal(qtyInput.value);
  const unit = unitSelect.value;
  const minStock = cleanDecimal(minInput.value);
  const purchasePrice = buyInput.value !== '' ? cleanDecimal(buyInput.value) : null;
  const sellingPrice = sellInput.value !== '' ? cleanDecimal(sellInput.value) : null;

  if (!name || isNaN(quantity) || quantity <= 0) {
    showToast('कृपया मान्य नाम और मात्रा दर्ज करें!', 'error');
    return;
  }

  try {
    const existingProducts = await DBService.getAllProducts();
    const normalizedNewName = normalize(name);
    const existing = existingProducts.find(
      (p) => normalize(p.name) === normalizedNewName && p.unit === unit
    );

    if (existing) {
      // Duplicate protection: Ask or update existing
      const confirmAdd = confirm(
        currentLang === 'hi'
          ? `‘${existing.name}’ पहले से स्टॉक में है (उपलब्ध: ${existing.quantity} ${existing.unit})।\nक्या आप इसमें ${quantity} ${unit} और जोड़ना चाहते हैं?`
          : `"${existing.name}" already exists (${existing.quantity} ${existing.unit} in stock).\nDo you want to add ${quantity} ${unit} to current stock?`
      );

      if (confirmAdd) {
        existing.quantity = cleanDecimal(existing.quantity + quantity);
        if (sellingPrice !== null) existing.sellingPrice = sellingPrice;
        if (purchasePrice !== null) existing.purchasePrice = purchasePrice;
        if (minStock > 0) existing.minStock = minStock;
        existing.updatedAt = new Date().toISOString();

        await DBService.updateProduct(existing);
        showToast(t('updatedSuccess'), 'success');
        resetAddForm();
        navigateTo('view-stock');
        return;
      } else {
        return; // User cancelled
      }
    }

    // New Product Entry
    const newProduct = {
      name,
      normalizedName: normalizedNewName,
      quantity,
      unit,
      minStock: minStock >= 0 ? minStock : 5,
      purchasePrice,
      sellingPrice,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    await DBService.addProduct(newProduct);
    showToast(t('savedSuccess'), 'success');
    resetAddForm();
    navigateTo('view-stock');
  } catch (err) {
    console.error('Add product error:', err);
    showToast('त्रुटि! माल सेव नहीं हो सका।', 'error');
  }
}

function resetAddForm() {
  const form = document.getElementById('form-add-product');
  if (form) form.reset();
  const minInput = document.getElementById('input-product-min');
  if (minInput) minInput.value = '5';
}

// ==========================================================================
// 9. Quick Sale Implementation
// ==========================================================================
let currentSelectedProductForSale = null;

async function refreshSaleProductSelect() {
  const select = document.getElementById('select-sale-product');
  const emptyGuard = document.getElementById('sale-empty-guard');
  const form = document.getElementById('form-quick-sale');
  const card = document.getElementById('sale-item-card');

  if (!select) return;

  const products = await DBService.getAllProducts();

  if (products.length === 0) {
    if (emptyGuard) emptyGuard.classList.remove('hidden');
    if (form) form.classList.add('hidden');
    return;
  }

  if (emptyGuard) emptyGuard.classList.add('hidden');
  if (form) form.classList.remove('hidden');

  select.innerHTML = `<option value="">${t('selectProductPrompt')}</option>`;

  // Sort alphabetically
  products.sort((a, b) => a.name.localeCompare(b.name));

  products.forEach((p) => {
    const isOut = cleanDecimal(p.quantity) <= 0;
    const option = document.createElement('option');
    option.value = p.id;
    option.textContent = `${p.name} (${formatQty(p.quantity)} ${p.unit})${isOut ? ' - स्टॉक समाप्त' : ''}`;
    if (isOut) {
      option.disabled = true;
    }
    select.appendChild(option);
  });

  // Reset fields
  card.classList.add('hidden');
  document.getElementById('input-sale-qty').value = '';
  document.getElementById('sale-total-box').classList.add('hidden');
  document.getElementById('sale-unit-badge').textContent = '-';
  currentSelectedProductForSale = null;
}

async function handleProductSelectionChange(productId) {
  const card = document.getElementById('sale-item-card');
  const availQtyEl = document.getElementById('sale-avail-qty');
  const rateEl = document.getElementById('sale-item-rate');
  const unitBadge = document.getElementById('sale-unit-badge');
  const qtyInput = document.getElementById('input-sale-qty');

  if (!productId) {
    card.classList.add('hidden');
    unitBadge.textContent = '-';
    currentSelectedProductForSale = null;
    return;
  }

  currentSelectedProductForSale = await DBService.getProductById(productId);

  if (currentSelectedProductForSale) {
    card.classList.remove('hidden');
    availQtyEl.textContent = `${formatQty(currentSelectedProductForSale.quantity)} ${currentSelectedProductForSale.unit}`;
    
    if (currentSelectedProductForSale.sellingPrice) {
      rateEl.textContent = `₹ ${cleanDecimal(currentSelectedProductForSale.sellingPrice).toFixed(2)} / ${currentSelectedProductForSale.unit}`;
    } else {
      rateEl.textContent = '-';
    }

    unitBadge.textContent = currentSelectedProductForSale.unit;
    qtyInput.max = currentSelectedProductForSale.quantity;
    qtyInput.focus();
    updateSaleTotalCalculation();
  }
}

function updateSaleTotalCalculation() {
  const qtyInput = document.getElementById('input-sale-qty');
  const totalBox = document.getElementById('sale-total-box');
  const totalAmountEl = document.getElementById('sale-total-price');

  if (!currentSelectedProductForSale || !currentSelectedProductForSale.sellingPrice) {
    totalBox.classList.add('hidden');
    return;
  }

  const qty = cleanDecimal(qtyInput.value);
  if (qty > 0) {
    const total = cleanDecimal(qty * currentSelectedProductForSale.sellingPrice);
    totalAmountEl.textContent = `₹ ${total.toFixed(2)}`;
    totalBox.classList.remove('hidden');
  } else {
    totalBox.classList.add('hidden');
  }
}

async function handleQuickSaleSubmit(event) {
  event.preventDefault();

  if (!currentSelectedProductForSale) {
    showToast('कृपया पहले सामान चुनें!', 'warning');
    return;
  }

  const qtyInput = document.getElementById('input-sale-qty');
  const qtySold = Number(qtyInput.value);

  if (!Number.isFinite(qtySold) || qtySold <= 0) {
    showToast('कृपया सही मात्रा दर्ज करें!', 'error');
    return;
  }

  try {
    const soldProduct = await DBService.recordSale(
      currentSelectedProductForSale.id,
      cleanDecimal(qtySold),
      new Date().toISOString()
    );

    const successMsg = t('saleSuccess', {
      qty: formatQty(qtySold),
      unit: soldProduct.unit,
      name: soldProduct.name
    });
    showToast(successMsg, 'success');

    currentSelectedProductForSale = soldProduct;
    await refreshSaleProductSelect();
    await loadRecentSales();
    await refreshHomeMetrics();
  } catch (err) {
    console.error('Sale error:', err);
    if (err.message === 'Insufficient stock') {
      showToast(t('saleErrorExceed', {
        avail: formatQty(err.available),
        unit: currentSelectedProductForSale.unit
      }), 'error');
      await refreshSaleProductSelect();
      return;
    }
    showToast('बिक्री दर्ज करने में त्रुटि हुई!', 'error');
  }
}

async function loadRecentSales() {
  const container = document.getElementById('recent-sales-list');
  if (!container) return;

  const sales = await DBService.getAllSales();
  if (sales.length === 0) {
    container.innerHTML = `<div class="empty-list-hint">${t('txtNoSalesYet')}</div>`;
    return;
  }

  // Show last 6 sales, newest first
  const recent = sales.slice(-6).reverse();

  container.innerHTML = recent
    .map((s, index) => {
      const priceText = s.totalPrice ? ` (₹ ${cleanDecimal(s.totalPrice).toFixed(2)})` : '';
      return `
      <div class="sale-history-item">
        <div class="sale-hist-left">
          <span class="sale-hist-name" data-index="${index}"></span>
          <span class="sale-hist-time">${formatDate(s.soldAt)} • ${formatTime(s.soldAt)}</span>
        </div>
        <div class="sale-hist-qty">
          -${formatQty(s.quantitySold)} ${s.unit}${priceText}
        </div>
      </div>
    `;
    })
    .join('');

  container.querySelectorAll('.sale-hist-name').forEach((nameElement) => {
    nameElement.textContent = recent[Number(nameElement.dataset.index)].productName;
  });
}

// ==========================================================================
// 10. Stock & Inventory Lists (All / Reorder / Dead Stock)
// ==========================================================================
async function renderStockList() {
  const container = document.getElementById('stock-list-container');
  const searchInput = document.getElementById('input-stock-search');
  const reorderBar = document.getElementById('reorder-action-bar');
  const query = normalize(searchInput ? searchInput.value : '');

  if (!container) return;

  const products = await DBService.getAllProducts();
  const sales = await DBService.getAllSales();

  // Map sales by productId
  const salesMap = {};
  for (const s of sales) {
    if (!salesMap[s.productId]) salesMap[s.productId] = [];
    salesMap[s.productId].push(s);
  }

  // Calculate counts for subtab badges
  let reorderProducts = [];
  let deadStockProducts = [];

  for (const p of products) {
    if (isLowStock(p)) reorderProducts.push(p);
    if (isDeadStock(p, salesMap[p.id])) deadStockProducts.push(p);
  }

  setText('count-tab-all', products.length);
  setText('count-tab-reorder', reorderProducts.length);
  setText('count-tab-dead', deadStockProducts.length);

  // Show/Hide Reorder Share Bar
  if (currentStockTab === 'reorder') {
    reorderBar.classList.remove('hidden');
  } else {
    reorderBar.classList.add('hidden');
  }

  // Select target list based on active tab
  let targetList = products;
  if (currentStockTab === 'reorder') targetList = reorderProducts;
  if (currentStockTab === 'dead') targetList = deadStockProducts;

  // Apply search query
  if (query) {
    targetList = targetList.filter((p) => normalize(p.name).includes(query));
  }

  // Empty State
  if (targetList.length === 0) {
    let emptyMsg = currentLang === 'hi' ? 'कोई सामान नहीं मिला' : 'No products found';
    if (currentStockTab === 'reorder') {
      emptyMsg = currentLang === 'hi' ? '🎉 सभी स्टॉक पर्याप्त है! कोई कम सामान नहीं।' : '🎉 All stock is sufficient!';
    } else if (currentStockTab === 'dead') {
      emptyMsg = currentLang === 'hi' ? '✅ कोई रुका हुआ माल (14 दिन) नहीं मिला।' : '✅ No dead stock found.';
    }

    container.innerHTML = `
      <div class="empty-state">
        <div class="empty-icon">${currentStockTab === 'reorder' ? '✅' : '📦'}</div>
        <h3>${emptyMsg}</h3>
      </div>
    `;
    return;
  }

  // Sort: Reorder priority first, or name
  if (currentStockTab === 'all') {
    targetList.sort((a, b) => {
      const aLow = isLowStock(a);
      const bLow = isLowStock(b);
      if (aLow && !bLow) return -1;
      if (!aLow && bLow) return 1;
      return a.name.localeCompare(b.name);
    });
  }

  // Render Cards
  container.innerHTML = targetList
    .map((p) => {
      const isLow = isLowStock(p);
      const isDead = isDeadStock(p, salesMap[p.id]);
      const suggestedReorder = calculateSuggestedReorder(p);

      let cardClass = 'stock-card';
      if (isLow) cardClass += ' is-low';
      else if (isDead) cardClass += ' is-dead';

      let statusBadge = '';
      if (isLow) {
        statusBadge = `<span class="stock-card-unit-badge">⚠️ ${t('lowStock')}</span>`;
      } else if (isDead) {
        statusBadge = `<span class="stock-card-unit-badge">⏳ 14 दिन से बिक्री नहीं</span>`;
      } else {
        statusBadge = `<span class="stock-card-unit-badge">सामान्य</span>`;
      }

      // Action Tag
      let actionTag = '';
      if (currentStockTab === 'reorder' || isLow) {
        actionTag = `
          <div class="reorder-suggest-tag">
            रीऑर्डर सलाह: +${formatQty(suggestedReorder)} ${p.unit}
          </div>
        `;
      } else if (isDead) {
        actionTag = `
          <div class="dead-stock-tag">
            सुझाव: डिस्काउंट दें या बंडल बनाएं
          </div>
        `;
      }

      const sellPriceDisplay = p.sellingPrice ? `बिक्री: ₹ ${cleanDecimal(p.sellingPrice).toFixed(2)}` : '';
      const minStockDisplay = `न्यूनतम: ${formatQty(p.minStock)} ${p.unit}`;

      return `
      <div class="${cardClass}" data-id="${p.id}">
        <div class="stock-card-top">
          <span class="stock-card-title"></span>
          ${statusBadge}
        </div>

        <div class="stock-card-middle">
          <div class="stock-qty-display">
            ${formatQty(p.quantity)} <small>${p.unit}</small>
          </div>
          <div class="stock-meta-info">
            ${minStockDisplay} ${sellPriceDisplay ? '• ' + sellPriceDisplay : ''}
          </div>
        </div>

        <div class="stock-card-bottom">
          ${actionTag}
          <div class="stock-card-actions">
            <button class="btn-icon-action btn-quick-restock" data-id="${p.id}" title="स्टॉक बढ़ाएं">
              ➕ स्टॉक
            </button>
            <button class="btn-icon-action btn-delete-item" data-id="${p.id}" title="हटाएं">
              🗑️
            </button>
          </div>
        </div>
      </div>
    `;
    })
    .join('');

  container.querySelectorAll('.stock-card').forEach((card, index) => {
    card.querySelector('.stock-card-title').textContent = targetList[index].name;
    card.querySelector('.btn-delete-item').dataset.name = targetList[index].name;
  });
}

// ==========================================================================
// 11. Share / Copy Reorder List (WhatsApp / SMS / Web Share API)
// ==========================================================================
async function generateReorderSummaryText() {
  const products = await DBService.getAllProducts();
  const lowItems = products.filter(isLowStock);

  if (lowItems.length === 0) return null;

  const dateStr = new Date().toLocaleDateString('hi-IN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  });

  let text = `🛒 *किराना साथी - रीऑर्डर सामान सूची*\n`;
  text += `📅 तारीख: ${dateStr}\n`;
  text += `--------------------------------\n`;

  lowItems.forEach((item, index) => {
    const suggested = calculateSuggestedReorder(item);
    text += `${index + 1}. *${item.name}*\n`;
    text += `   ➡️ जरूरत (सलाह): *${formatQty(suggested)} ${item.unit}*\n`;
    text += `   (अभी उपलब्ध: ${formatQty(item.quantity)} ${item.unit}, न्यूनतम सीमा: ${formatQty(item.minStock)} ${item.unit})\n`;
  });

  text += `--------------------------------\n`;
  text += `कुल रीऑर्डर सामान: ${lowItems.length}\n`;
  text += `_किराना साथी ऐप से भेजा गया_`;

  return text;
}

async function handleShareReorderList() {
  const text = await generateReorderSummaryText();
  if (!text) {
    showToast(t('noReorderItems'), 'warning');
    return;
  }

  const nativeShare = window.Capacitor?.Plugins?.Share;
  if (nativeShare) {
    try {
      await nativeShare.share({
        title: t('shareTitle'),
        text,
        dialogTitle: t('shareTitle')
      });
      return;
    } catch (err) {
      console.error('Native share error:', err);
      showToast('शेयर नहीं हो सका। सूची कॉपी करने की कोशिश करें।', 'error');
      await copyToClipboard(text);
      return;
    }
  }

  if (navigator.share) {
    try {
      await navigator.share({
        title: t('shareTitle'),
        text: text
      });
      showToast('सूची साझा कर दी गई!', 'success');
      return;
    } catch (err) {
      if (err.name !== 'AbortError') {
        // Fallback to clipboard
        await copyToClipboard(text);
      }
    }
  } else {
    await copyToClipboard(text);
  }
}

async function handleCopyReorderList() {
  const text = await generateReorderSummaryText();
  if (!text) {
    showToast(t('noReorderItems'), 'warning');
    return;
  }
  await copyToClipboard(text);
}

async function copyToClipboard(text) {
  try {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      await navigator.clipboard.writeText(text);
    } else {
      // Fallback
      const textarea = document.createElement('textarea');
      textarea.value = text;
      textarea.style.position = 'fixed';
      textarea.style.opacity = '0';
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
    }
    showToast(t('reorderCopied'), 'success');
  } catch (err) {
    console.error('Clipboard copy error:', err);
    showToast('कॉपी करने में विफल!', 'error');
  }
}

// ==========================================================================
// 12. Restock Modal & Delete Logic
// ==========================================================================
let activeRestockProductId = null;

async function openRestockModal(productId) {
  const product = await DBService.getProductById(productId);
  if (!product) return;

  activeRestockProductId = product.id;
  const modal = document.getElementById('restock-modal');
  const nameEl = document.getElementById('modal-product-name');
  const stockEl = document.getElementById('modal-current-stock');
  const inputQty = document.getElementById('input-restock-add-qty');

  nameEl.textContent = product.name;
  stockEl.textContent = `मौजूदा स्टॉक: ${formatQty(product.quantity)} ${product.unit}`;
  inputQty.value = '';
  inputQty.placeholder = `उदा: 5 ${product.unit}`;

  modal.classList.remove('hidden');
  inputQty.focus();
}

function closeRestockModal() {
  const modal = document.getElementById('restock-modal');
  modal.classList.add('hidden');
  activeRestockProductId = null;
}

async function handleConfirmRestock() {
  if (!activeRestockProductId) return;
  const inputQty = document.getElementById('input-restock-add-qty');
  const addedQty = cleanDecimal(inputQty.value);

  if (isNaN(addedQty) || addedQty <= 0) {
    showToast('कृपया सही मात्रा दर्ज करें!', 'error');
    return;
  }

  const product = await DBService.getProductById(activeRestockProductId);
  if (product) {
    product.quantity = cleanDecimal(cleanDecimal(product.quantity) + addedQty);
    product.updatedAt = new Date().toISOString();
    await DBService.updateProduct(product);

    showToast(`+${addedQty} ${product.unit} स्टॉक जुड़ गया!`, 'success');
    closeRestockModal();
    refreshAllViews();
  }
}

async function handleDeleteProduct(productId, productName) {
  const msg = t('confirmDelete', { name: productName });
  if (confirm(msg)) {
    await DBService.deleteProduct(productId);
    showToast(`"${productName}" हटा दिया गया!`, 'success');
    refreshAllViews();
  }
}

// ==========================================================================
// 13. Demo Data Loader & Database Reset
// ==========================================================================
async function loadDemoData() {
  const now = Date.now();
  const ONE_DAY_MS = 24 * 60 * 60 * 1000;

  // Realistic Kirana demo items:
  // 1. Basmati Rice: Low stock (2.5 kg vs min 10 kg)
  // 2. Sugar: Low stock (4 kg vs min 15 kg)
  // 3. Aashirvaad Atta: Healthy stock (25 kg vs min 5 kg)
  // 4. Fortune Mustard Oil: Healthy stock (12 L vs min 5 L)
  // 5. Red Masoor Dal: Created 22 days ago with NO sales -> Dead Stock!
  // 6. Tata Salt: Healthy stock (20 pkts vs min 10 pkts)
  // 7. Maggi Noodles: Low stock (6 pkts vs min 12 pkts)
  const demoProducts = [
    {
      name: 'बासमती चावल (Basmati Rice)',
      normalizedName: 'बासमती चावल (basmati rice)',
      quantity: 2.5,
      unit: 'किलो',
      minStock: 10,
      purchasePrice: 75,
      sellingPrice: 90,
      createdAt: new Date(now - 10 * ONE_DAY_MS).toISOString(),
      updatedAt: new Date(now - 1 * ONE_DAY_MS).toISOString()
    },
    {
      name: 'सफेद चीनी (Sugar)',
      normalizedName: 'सफेद चीनी (sugar)',
      quantity: 4.0,
      unit: 'किलो',
      minStock: 15,
      purchasePrice: 38,
      sellingPrice: 44,
      createdAt: new Date(now - 12 * ONE_DAY_MS).toISOString(),
      updatedAt: new Date(now - 2 * ONE_DAY_MS).toISOString()
    },
    {
      name: 'आशीर्वाद चक्की आटा (Atta)',
      normalizedName: 'आशीर्वाद चक्की आटा (atta)',
      quantity: 25.0,
      unit: 'किलो',
      minStock: 5,
      purchasePrice: 35,
      sellingPrice: 42,
      createdAt: new Date(now - 18 * ONE_DAY_MS).toISOString(),
      updatedAt: new Date(now - 1 * ONE_DAY_MS).toISOString()
    },
    {
      name: 'फॉर्च्यून सरसों तेल (Mustard Oil)',
      normalizedName: 'फॉर्च्यून सरसों तेल (mustard oil)',
      quantity: 12.0,
      unit: 'लीटर',
      minStock: 5,
      purchasePrice: 135,
      sellingPrice: 155,
      createdAt: new Date(now - 15 * ONE_DAY_MS).toISOString(),
      updatedAt: new Date(now - 3 * ONE_DAY_MS).toISOString()
    },
    {
      name: 'साबुत लाल मसूर दाल (Masoor Dal)',
      normalizedName: 'साबुत लाल मसूर दाल (masoor dal)',
      quantity: 8.5,
      unit: 'किलो',
      minStock: 5,
      purchasePrice: 70,
      sellingPrice: 85,
      // Tracked for 25 days with zero sales -> Demonstrates Dead Stock condition!
      createdAt: new Date(now - 25 * ONE_DAY_MS).toISOString(),
      updatedAt: new Date(now - 25 * ONE_DAY_MS).toISOString()
    },
    {
      name: 'टाटा नमक 1kg (Tata Salt)',
      normalizedName: 'टाटा नमक 1kg (tata salt)',
      quantity: 20,
      unit: 'पैकेट',
      minStock: 10,
      purchasePrice: 22,
      sellingPrice: 28,
      createdAt: new Date(now - 20 * ONE_DAY_MS).toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      name: 'मैगी नूडल्स 4-पैक (Maggi Noodles)',
      normalizedName: 'मैगी नूडल्स 4-पैक (maggi noodles)',
      quantity: 6,
      unit: 'पैकेट',
      minStock: 12,
      purchasePrice: 50,
      sellingPrice: 58,
      createdAt: new Date(now - 5 * ONE_DAY_MS).toISOString(),
      updatedAt: new Date().toISOString()
    }
  ];

  const existingProducts = await DBService.getAllProducts();
  const existingNames = new Set(existingProducts.map((product) => normalize(product.name)));

  for (const item of demoProducts) {
    if (existingNames.has(normalize(item.name))) continue;
    const newId = await DBService.addProduct(item);
    existingNames.add(normalize(item.name));

    // Add recent sales for some items to show activity
    if (item.name.includes('Tata Salt')) {
      await DBService.addSale({
        productId: newId,
        productName: item.name,
        quantitySold: 2,
        unit: item.unit,
        sellingPrice: item.sellingPrice,
        totalPrice: cleanDecimal(2 * item.sellingPrice),
        soldAt: new Date().toISOString()
      });
    } else if (item.name.includes('Atta')) {
      await DBService.addSale({
        productId: newId,
        productName: item.name,
        quantitySold: 5,
        unit: item.unit,
        sellingPrice: item.sellingPrice,
        totalPrice: cleanDecimal(5 * item.sellingPrice),
        soldAt: new Date().toISOString()
      });
    }
  }

  showToast(t('demoLoaded'), 'success');
  await refreshAllViews();
}

async function resetAllData() {
  if (confirm(t('confirmReset'))) {
    await DBService.clearAll();
    showToast(t('dbResetSuccess'), 'success');
    await refreshAllViews();
  }
}

// ==========================================================================
// 14. Event Listeners & App Lifecycle
// ==========================================================================
function setupEventListeners() {
  // Language Switcher
  document.getElementById('btn-lang-toggle')?.addEventListener('click', toggleLanguage);

  // Network Online / Offline Detection
  window.addEventListener('online', updateNetworkStatus);
  window.addEventListener('offline', updateNetworkStatus);

  // Today Date in Header Card
  const dateEl = document.getElementById('today-date');
  if (dateEl) {
    dateEl.textContent = new Date().toLocaleDateString('hi-IN', {
      day: 'numeric',
      month: 'short'
    });
  }

  // Bottom Navigation
  document.querySelectorAll('.nav-tab').forEach((tab) => {
    tab.addEventListener('click', () => {
      const targetView = tab.getAttribute('data-view');
      navigateTo(targetView);
    });
  });

  // Home 3 Action Cards
  document.getElementById('btn-action-add')?.addEventListener('click', () => navigateTo('view-add-stock'));
  document.getElementById('btn-action-sale')?.addEventListener('click', () => navigateTo('view-quick-sale'));
  document.getElementById('btn-action-stock')?.addEventListener('click', () => navigateTo('view-stock'));
  document.getElementById('btn-action-ai')?.addEventListener('click', () => navigateTo('view-ai'));

  document.getElementById('form-ai-question')?.addEventListener('submit', handleAIQuestionSubmit);
  document.getElementById('btn-ai-mic')?.addEventListener('click', startAIListening);
  document.querySelectorAll('.ai-task-button').forEach((button) => {
    button.addEventListener('click', () => {
      const promptKey = button.dataset.aiTask === 'reorder' ? 'aiReorderPrompt' : 'aiForecastPrompt';
      const prompt = t(promptKey);
      document.getElementById('input-ai-question').value = prompt;
      askShopAI(prompt);
    });
  });

  // Home Low Stock Banner CTA
  document.getElementById('btn-goto-reorder')?.addEventListener('click', () => {
    navigateTo('view-stock');
    switchStockTab('reorder');
  });

  // Back Buttons (Navigate to Home)
  document.querySelectorAll('.btn-nav-home').forEach((btn) => {
    btn.addEventListener('click', () => navigateTo('view-home'));
  });

  document.querySelectorAll('.btn-nav-add').forEach((btn) => {
    btn.addEventListener('click', () => navigateTo('view-add-stock'));
  });

  // Demo Buttons
  document.getElementById('btn-load-demo')?.addEventListener('click', loadDemoData);
  document.getElementById('btn-reset-db')?.addEventListener('click', resetAllData);

  // Add Product Form
  document.getElementById('form-add-product')?.addEventListener('submit', handleAddProductSubmit);

  // Quick Sale Product Select
  const saleSelect = document.getElementById('select-sale-product');
  saleSelect?.addEventListener('change', (e) => {
    handleProductSelectionChange(e.target.value);
  });

  // Quick Sale Qty Input (Live Price Calculation)
  const saleQtyInput = document.getElementById('input-sale-qty');
  saleQtyInput?.addEventListener('input', updateSaleTotalCalculation);

  // Quick Sale Thumb Pills (+0.25, +0.5, +1, +2, +5)
  document.querySelectorAll('.btn-pill').forEach((pill) => {
    pill.addEventListener('click', () => {
      const addVal = parseFloat(pill.getAttribute('data-qty') || '0');
      const currentVal = parseFloat(saleQtyInput.value || '0');
      const newVal = cleanDecimal(currentVal + addVal);
      saleQtyInput.value = newVal;
      updateSaleTotalCalculation();
    });
  });

  // Quick Sale Form Submit
  document.getElementById('form-quick-sale')?.addEventListener('submit', handleQuickSaleSubmit);

  // Stock Subtabs (All / Reorder / Dead Stock)
  document.querySelectorAll('.subtab-btn').forEach((btn) => {
    btn.addEventListener('click', () => {
      const tabName = btn.getAttribute('data-tab');
      switchStockTab(tabName);
    });
  });

  // Stock Search
  document.getElementById('input-stock-search')?.addEventListener('input', renderStockList);

  // Reorder Share & Copy
  document.getElementById('btn-share-reorder')?.addEventListener('click', handleShareReorderList);
  document.getElementById('btn-copy-reorder')?.addEventListener('click', handleCopyReorderList);

  // Stock List Delegated Actions (Restock & Delete)
  const stockList = document.getElementById('stock-list-container');
  stockList?.addEventListener('click', (e) => {
    const restockBtn = e.target.closest('.btn-quick-restock');
    if (restockBtn) {
      const id = restockBtn.getAttribute('data-id');
      openRestockModal(id);
      return;
    }

    const deleteBtn = e.target.closest('.btn-delete-item');
    if (deleteBtn) {
      const id = deleteBtn.getAttribute('data-id');
      const name = deleteBtn.getAttribute('data-name');
      handleDeleteProduct(id, name);
    }
  });

  // Restock Modal Buttons
  document.getElementById('btn-close-modal')?.addEventListener('click', closeRestockModal);
  document.getElementById('btn-cancel-modal')?.addEventListener('click', closeRestockModal);
  document.getElementById('btn-confirm-restock')?.addEventListener('click', handleConfirmRestock);
}

function switchStockTab(tabName) {
  currentStockTab = tabName;
  document.querySelectorAll('.subtab-btn').forEach((btn) => {
    if (btn.getAttribute('data-tab') === tabName) {
      btn.classList.add('active');
    } else {
      btn.classList.remove('active');
    }
  });
  renderStockList();
}

// ==========================================================================
// 15. Service Worker Registration (Offline Support)
// ==========================================================================
function registerServiceWorker() {
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker
        .register('./sw.js')
        .then((reg) => {
          console.log('Service Worker Registered successfully. Scope:', reg.scope);
        })
        .catch((err) => {
          console.warn('Service Worker registration skipped or failed:', err);
        });
    });
  }
}

// ==========================================================================
// 16. App Bootstrapper
// ==========================================================================
async function initApp() {
  try {
    await initDB();
    setupEventListeners();
    applyLocalization();
    await refreshHomeMetrics();
    registerServiceWorker();
  } catch (err) {
    console.error('App initialization error:', err);
    showToast('ऐप शुरू करने में त्रुटि!', 'error');
  }
}

// Start app when DOM is ready
document.addEventListener('DOMContentLoaded', initApp);
