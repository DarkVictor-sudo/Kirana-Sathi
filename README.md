# 🛒 किराना साथी (Kirana Saathi)
> **Problem Statement:** "The Kirana Problem" — Hackathon Project  
> **Target Audience:** Small Indian Kirana & Grocery Store Owners  
> **Architecture:** 100% Offline-First Progressive Web App (PWA) — Zero Backend, Zero Paid APIs, Zero Setup Dependencies.

---

## 🌟 Overview & Key Highlights

Traditional retail POS software is overly complex, requires expensive barcode scanners, reliable high-speed internet, and complex English menus. Small neighborhood kirana store owners manage loose commodities (e.g., 2.5 kg rice, 500 gm sugar, 1.5 litres mustard oil) and need a **fast, thumb-friendly, Hindi-first digital munim (manager)**.

**Kirana Saathi** solves this with:
1. **Hindi-First Interface** with instant 1-tap English toggle.
2. **Decimal Quantities Supported**: 2.5 kg, 0.5 litre, 250 gm, loose or packaged goods.
3. **1-Tap Quick Sale Flow**: Choose product, enter or tap +0.5 / +1 quantity, and deduct stock in one tap with zero delays.
4. **Actionable Reorder List**: Clean, plain list of items at or below minimum threshold with suggested reorder amounts and instant **WhatsApp / Share / Copy** functionality.
5. **Dead Stock Intelligence (14-Day Rule)**: Identifies unsold capital tied up in slow-moving stock without misidentifying newly added inventory (<14 days old).
6. **Offline-First Design**: Inventory and sales stay in **IndexedDB**. Optional DeepSeek analysis needs internet and sends product-level stock/sales data only when the user requests an AI answer.
7. **Optional Demo Data**: One-click demo loader to test all features immediately without requiring dummy setup.

---

## 📂 Project Structure

```text
kirhs/
├── index.html        # Mobile-first semantic markup, accessible UI views, modal & banners
├── styles.css        # Pure Vanilla CSS, high-contrast Indian retail palette & thumb targets
├── app.js            # Pure Vanilla JS: IndexedDB engine, state, offline sync, decimal logic
├── sw.js             # Service Worker for offline shell caching and network fallback
├── manifest.json     # PWA Web App Manifest for mobile/desktop homescreen installation
├── icon.svg          # Crisp vector PWA grocery bag icon (works at all resolutions)
├── README.md         # Full project documentation, testing guide, and setup instructions
└── .gitignore        # Git ignore rules for clean repository management
```

---

## 🚀 How to Run Locally on Windows

No complicated build steps or `npm install` required! Because this is built with modern vanilla web standards, you can run it using any simple local HTTP server.

> **Note on Service Workers:** Modern browsers require an `http://localhost` or HTTPS origin to register Service Workers and test PWA offline capabilities.

### Option 1: VS Code Live Server (Easiest)
1. Open the `kirhs` folder in **Visual Studio Code**.
2. If you have the **Live Server** extension installed, right-click `index.html` and choose **"Open with Live Server"**.
3. The app will open at `http://127.0.0.1:5500`.

### Option 2: Python (Pre-installed on most Windows developer machines)
1. Open PowerShell or Command Prompt in the project folder:
   ```powershell
   cd "c:\Users\Dark Victor\OneDrive\Desktop\kirhs"
   ```
2. Run:
   ```powershell
   python -m http.server 8000
   ```
3. Open your browser and visit: `http://localhost:8000`

### Option 3: Node.js (npx serve)
1. Run:
   ```powershell
   npx -y serve . -p 8000
   ```
2. Open `http://localhost:8000`.

## 📱 Build an Android APK

The Android version packages the same app files inside a native Capacitor WebView. It does not need a backend or an internet connection after installation.

1. Install Android Studio and its Android SDK, then open this project in a terminal.
2. Install JDK 21 and project dependencies once with `npm install`.
3. Build a debug APK with `npm run android:apk`. On Windows, the build script automatically finds Temurin JDK 21 and the default Android SDK folder. For non-default install locations, set `JAVA_HOME` and `ANDROID_HOME` first.
4. Find the APK at `android/app/build/outputs/apk/debug/app-debug.apk` and install it on an Android device.

To open the native project in Android Studio, first run `npm run android:sync`, then open the `android` folder and select JDK 21 in Gradle settings.

## 🤖 Optional DeepSeek AI

The inventory and sales features continue working offline. The AI assistant is optional and needs an internet-connected Node server. The app sends product names, quantities, minimum levels, recent product-level sales, and the question only after the user requests AI analysis. Do not send customer or personal information in product names. DeepSeek API usage may incur provider charges.

1. Create a DeepSeek API key in your DeepSeek account. Do not paste it into the app, APK, or source code.
2. Copy `.env.example` to `.env`. Set `DEEPSEEK_API_KEY` and a long random `AI_ACCESS_TOKEN` in `.env`. This file is ignored by Git.
3. Start the backend with `npm run ai:server`. It listens on port `8787` by default. Check `http://127.0.0.1:8787/health` for status.
4. In the app, open **दुकान AI**, enter the server URL and the matching app access token, then save. For an Android phone, use the computer's reachable HTTPS backend URL, not `localhost`; allow the app origin in the server's `ALLOWED_ORIGINS` setting.
5. For a deployed/public server, use HTTPS, a private access token, and hosting-level request limits. The app access token is not the DeepSeek key; anyone who can extract it from a distributed client could use your proxy, so do not distribute a personal backend configuration broadly.

The backend proxy validates request sizes, limits request rates, restricts browser origins, and keeps the DeepSeek API key on the server. An AI answer is advice only: the app never changes inventory or places supplier orders from model output.

The AI screen also includes a microphone button. Android asks for microphone/speech permission on first use; speech recognition uses the phone's available recognition service. Common stock, low-stock, saved purchase-price, and sales questions are answered directly from IndexedDB, so those work offline. Forecast and smart-reorder shortcuts call DeepSeek when the backend is configured. Live cheapest-supplier comparisons are not available until a verified supplier/price feed is connected.

---

## 🧪 How to Verify All Requirements

### 1. Home Screen & Hindi-First Toggle
- Open the app. The interface defaults to Hindi (**"किराना साथी - दुकान का डिजिटल मुनीम"**).
- Tap the top-right **"🌐 English"** button to toggle everything to English instantly. Tap again to return to Hindi.
- Notice the three primary thumb-friendly buttons: **"माल जोड़ें"**, **"बिक्री करें"**, **"स्टॉक देखें"**.
- Tap **"📦 डेमो सामान लोड करें"** (Load Demo Products) to instantly populate realistic store data.

### 2. Add Stock with Decimal & Unit Support
- Tap **"माल जोड़ें"** (Add Stock).
- Enter:
  - Name: `बासमती चावल` (Basmati Rice)
  - Quantity: `2.5` (supports decimals like 2.5 kg or 3.5 litres)
  - Unit: Choose from `किलो`, `ग्राम`, `लीटर`, `पैकेट`, `पीस`
  - Min Threshold: `5`
  - Purchase / Sell Price: `₹80` / `₹95` (Optional)
- Tap **"माल सुरक्षित करें"**.
- **Duplicate Prevention Test**: Try adding the same product name again. The app detects the existing product and asks if you want to add the quantity to current stock instead of creating an accidental duplicate.

### 3. Quick Sale Flow
- Tap **"बिक्री करें"** (Quick Sale).
- Pick an item from the dropdown (e.g., `बासमती चावल`).
- The available stock and rate per unit appear instantly.
- Enter quantity or tap the quick thumb buttons (`+0.25`, `+0.5`, `+1`, `+2`, `+5`).
- **Validation Test**: Try to sell more than the available stock. The app strictly blocks the sale and displays an alert: `उपलब्ध स्टॉक केवल X है!`
- Tap **"⚡ बिक्री दर्ज करें"**: Stock is deducted in IndexedDB in 1 tap, the sale record is logged, and the recent sales feed updates below.

### 4. Reorder List & Supplier Sharing
- Tap **"स्टॉक देखें"** (View Stock) ➔ **"⚠️ रीऑर्डर सूची"** tab.
- All products with `quantity <= minStock` are listed.
- Each item shows: Current Quantity, Unit, Minimum Threshold, and Suggested Reorder Quantity (`(minStock * 2) - currentQuantity`).
- Tap **"📲 WhatsApp / शेयर करें"** or **"📋 कॉपी करें"**:
  - Uses the native phone Web Share API or copies a cleanly formatted order list directly to the clipboard for pasting into WhatsApp to suppliers.

### 5. Dead Stock (14-Day Intelligence Rule)
- Tap the **"⏳ रुका हुआ माल"** tab.
- **Rule Verification**:
  - Products must have remaining stock (`quantity > 0`) AND no recorded sales in the last 14 days.
  - **Crucial Rule**: Newly added products are **never** marked as dead stock until they have been tracked in the system for at least 14 days (`createdAt <= now - 14 days`).
  - Demo product `साबुत लाल मसूर दाल` (added 25 days ago with zero sales) will show up here, while items added recently will not.

### 6. Verify Offline Support
1. Load the app once in Google Chrome or Microsoft Edge.
2. Press `F12` to open Developer Tools.
3. Switch to the **Network** tab and select the **"Offline"** dropdown (or turn off Wi-Fi).
4. Reload the page (`Ctrl + R` / `F5`).
5. Confirm the app reloads and the status badge changes to offline. Add a product and record a sale while offline, then reload and check that both the stock and sale history remain. A local browser smoke test was run for this project: after the first load, the server was stopped, the cached app reloaded, and a decimal sale was recorded and shown in sale history. Repeat this check in the target Android browser before relying on offline behavior there.

---

## 🛡️ Technical Architecture & Zero-Dependency Guarantee

- **No Framework Overkill**: Built entirely on HTML5, CSS3, and modern Vanilla ES6+ JavaScript.
- **Persistent Storage**: Browser-native `IndexedDB` (`KiranaSaathiDB`) with two object stores: `products` and `sales`.
- **Decimal Quantities**: Inputs accept hundredths (step `0.01`) and stock subtraction is rounded to two decimal places.
- **Mobile Responsive**: Built mobile-first for small Android screen sizes (320px+ viewport) with touch targets >= 48px.
