# 🚀 Cloudflare Pages Hosting Guide - New Look Readymade (Salemabad)

यह गाइड आपकी **New Look Readymade** दुकान की वेबसाइट को **Cloudflare Pages** पर बिल्कुल मुफ्त (FREE) और सुपर-फास्ट होस्ट करने के लिए बनाई गई है।

---

## 📌 तरीक़ा 1: Cloudflare Dashboard द्वारा 1-Click Upload (सबसे आसान)

1. अपने कंप्यूटर पर `C:\Users\brtho\.gemini\antigravity\scratch\new-look-readymade` फोल्डर को खोलें।
2. इस फोल्डर की सभी फाइलों (`index.html`, `style.css`, `app.js`, `logo.png`, `_headers`, `_routes.json` और `assets` फोल्डर) का एक नया **`new-look-website.zip`** बनाएं।
3. अपने ब्राउजर में **[dash.cloudflare.com](https://dash.cloudflare.com/)** पर जाकर लॉगिन करें (अगर अकाउंट नहीं है तो 1 मिनट में फ्री साइनअप करें)।
4. बायीं तरफ मेन्यू में **Workers & Pages** पर क्लिक करें।
5. **Create application** -> **Pages** टैब पर क्लिक करें।
6. **Upload assets** ऑप्शन चुनें।
7. **Project Name** में `new-look-readymade` दर्ज करें और अपनी `new-look-website.zip` फाइल ड्रैग-एंड-ड्रॉप करें।
8. **Deploy Site** पर क्लिक करें! ⚡

🎉 आपकी वेबसाइट तुरंत लाइव हो जाएगी जैसे: `https://new-look-readymade.pages.dev`

---

## 📌 तरीक़ा 2: GitHub ऑटो-सिंक द्वारा (Auto-Update)

अगर आप कोड में बार-बार बदलाव करना चाहते हैं:

1. अपने GitHub पर `new-look-readymade` नाम से एक न्यू रिपॉजिटरी (Repository) बनाएं।
2. इस फोल्डर की फाइलों को GitHub रिपॉजिटरी में push कर दें:
   ```bash
   git init
   git add .
   git commit -m "Initial commit for New Look Readymade"
   git branch -M main
   git remote add origin YOUR_GITHUB_REPO_URL
   git push -u origin main
   ```
3. Cloudflare Dashboard -> **Workers & Pages** -> **Connect to Git** पर जाएं।
4. अपनी GitHub रिपॉजिटरी सेलेक्ट करें।
5. **Build setting**: 
   - Framework preset: `None`
   - Build command: (खाली छोड़ें)
   - Build output directory: `./`
6. **Save and Deploy** दबाएं। अब आप जब भी GitHub पर अपडेट करेंगे, Cloudflare स्वतः ही वेबसाइट अपडेट कर देगा!

---

## 📌 तरीक़ा 3: Wrangler CLI (Command Line Interface)

यदि आपके सिस्टम में Node.js और Wrangler इनस्टॉल है:

```bash
npx wrangler pages deploy C:\Users\brtho\.gemini\antigravity\scratch\new-look-readymade --project-name=new-look-readymade
```

---

## 🌐 Custom Domain जोड़ना (उदा: www.newlookreadymade.com)

1. Cloudflare Pages में अपने `new-look-readymade` प्रोजेक्ट पर क्लिक करें।
2. **Custom Domains** टैब पर जाएं।
3. **Set up a custom domain** बटन दबाएं।
4. अपना डोमेन नाम दर्ज करें और Confirm पर क्लिक करें। Cloudflare ऑटोमैटिक SSL सर्टिफिकेट (HTTPS) एक्टिवेट कर देगा!

---

## 🛍️ वेबसाइट फीचर्स सूची:
- ✅ **Salemabad Local SEO & Map**: दुकान का पता, गूगल मैप्स डायरेक्ट बटन व कॉल लिंक।
- ✅ **WhatsApp Smart Checkout**: कार्ट के कपड़े अपने आप व्हाट्सएप मैसेज बनकर 8503090848 पर सेंड हो जाते हैं।
- ✅ **Dynamic Search & Filters**: कपड़ों को श्रेणी (Men, Women, Kids) व नाम से खोजना।
- ✅ **Product Quick View**: साइज़ व फोटो देखने के लिए पॉपअप मॉडल।
- ✅ **Responsive Mobile Menu**: मोबाइल, टैबलेट व डेस्कटॉप पर बेहतरीन डिज़ाइन।
