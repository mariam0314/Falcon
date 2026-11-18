/**
 * deviceCatalogFallback.js
 * Comprehensive fallback data for FELCON Sell Flow.
 * Guarantees that mobile and desktop screens NEVER show blank screens,
 * missing brand cards, or "Could not load brands" errors, even if the
 * remote backend is cold-starting, offline, or experiencing network latency.
 */

export const FALLBACK_BRAND_LOGOS = {
  Apple: "/images/brands/Apple.png",
  Google: "/images/brands/Google.png",
  Motorola: "/images/brands/Motorola.png",
  Nokia: "/images/brands/Nokia.png",
  Nothing: "/images/brands/Nothing.webp",
  OnePlus: "/images/brands/OnePlus.png",
  Oppo: "/images/brands/Oppo.png",
  Poco: "/images/brands/Poco.png",
  Realme: "/images/brands/Realme.png",
  Samsung: "/images/brands/Samsung.png",
  Vivo: "/images/brands/Vivo.png",
  Xiaomi: "/images/brands/Xiaomi.png",
  Sony: "/images/brands/Sony.png",
};

export const FALLBACK_BRANDS_BY_CATEGORY = {
  mobile: [
    { brand: "Apple", logo: "/images/brands/Apple.png" },
    { brand: "Samsung", logo: "/images/brands/Samsung.png" },
    { brand: "Google", logo: "/images/brands/Google.png" },
    { brand: "OnePlus", logo: "/images/brands/OnePlus.png" },
    { brand: "Xiaomi", logo: "/images/brands/Xiaomi.png" },
    { brand: "Realme", logo: "/images/brands/Realme.png" },
    { brand: "Vivo", logo: "/images/brands/Vivo.png" },
    { brand: "Oppo", logo: "/images/brands/Oppo.png" },
    { brand: "Motorola", logo: "/images/brands/Motorola.png" },
    { brand: "Nothing", logo: "/images/brands/Nothing.webp" },
    { brand: "Poco", logo: "/images/brands/Poco.png" },
    { brand: "Nokia", logo: "/images/brands/Nokia.png" },
  ],
  laptop: [
    { brand: "Apple", logo: "/images/brands/Apple.png" },
    { brand: "Dell", logo: null },
    { brand: "HP", logo: null },
    { brand: "Lenovo", logo: null },
    { brand: "Asus", logo: null },
    { brand: "Acer", logo: null },
    { brand: "MSI", logo: null },
    { brand: "Samsung", logo: "/images/brands/Samsung.png" },
  ],
  tablet: [
    { brand: "Apple", logo: "/images/brands/Apple.png" },
    { brand: "Samsung", logo: "/images/brands/Samsung.png" },
    { brand: "OnePlus", logo: "/images/brands/OnePlus.png" },
    { brand: "Xiaomi", logo: "/images/brands/Xiaomi.png" },
    { brand: "Lenovo", logo: null },
    { brand: "Google", logo: "/images/brands/Google.png" },
    { brand: "Redmi", logo: "/images/brands/Xiaomi.png" },
  ],
  smartwatch: [
    { brand: "Apple", logo: "/images/brands/Apple.png" },
    { brand: "Samsung", logo: "/images/brands/Samsung.png" },
    { brand: "Google", logo: "/images/brands/Google.png" },
    { brand: "Garmin", logo: null },
    { brand: "Amazfit", logo: null },
    { brand: "Noise", logo: null },
    { brand: "OnePlus", logo: "/images/brands/OnePlus.png" },
    { brand: "boAt", logo: null },
  ],
};

export function getFallbackBrands(category = "mobile") {
  const cat = String(category).toLowerCase();
  return FALLBACK_BRANDS_BY_CATEGORY[cat] || FALLBACK_BRANDS_BY_CATEGORY.mobile;
}

export const FALLBACK_MODELS = {
  // ─── Apple Mobiles ───
  "mobile_apple": [
    { id: "app-m-1", name: "Apple iPhone 16 Pro Max", image: "/images/products/smartphones/apple/apple-iphone-16-pro-max.webp", soldCount: 42 },
    { id: "app-m-2", name: "Apple iPhone 16 Pro", image: "/images/products/smartphones/apple/apple-iphone-16-pro.webp", soldCount: 38 },
    { id: "app-m-3", name: "Apple iPhone 16 Plus", image: "/images/products/smartphones/apple/apple-iphone-16-plus.webp", soldCount: 29 },
    { id: "app-m-4", name: "Apple iPhone 16", image: "/images/products/smartphones/apple/apple-iphone-16.webp", soldCount: 54 },
    { id: "app-m-5", name: "Apple iPhone 15 Pro Max", image: "/images/products/smartphones/apple/apple-iphone-15-pro-max.webp", soldCount: 88 },
    { id: "app-m-6", name: "Apple iPhone 15 Pro", image: "/images/products/smartphones/apple/apple-iphone-15-pro.webp", soldCount: 76 },
    { id: "app-m-7", name: "Apple iPhone 15", image: "/images/products/smartphones/apple/apple-iphone-15.webp", soldCount: 110 },
    { id: "app-m-8", name: "Apple iPhone 14 Pro Max", image: "/images/products/smartphones/apple/apple-iphone-14-pro-max.webp", soldCount: 95 },
    { id: "app-m-9", name: "Apple iPhone 14", image: "/images/products/smartphones/apple/apple-iphone-14.webp", soldCount: 120 },
    { id: "app-m-10", name: "Apple iPhone 13 Pro Max", image: "/images/products/smartphones/apple/apple-iphone-13-pro-max.webp", soldCount: 104 },
    { id: "app-m-11", name: "Apple iPhone 13", image: "/images/products/smartphones/apple/apple-iphone-13.webp", soldCount: 145 },
    { id: "app-m-12", name: "Apple iPhone 12", image: "/images/products/smartphones/apple/apple-iphone-12.webp", soldCount: 130 },
  ],

  // ─── Samsung Mobiles ───
  "mobile_samsung": [
    { id: "sam-m-1", name: "Samsung Galaxy S25 Ultra", image: "/images/products/smartphones/samsung/samsung-galaxy-s25-ultra-5g.webp", soldCount: 35 },
    { id: "sam-m-2", name: "Samsung Galaxy S25+", image: "/images/products/smartphones/samsung/samsung-galaxy-s25-plus-5g.webp", soldCount: 28 },
    { id: "sam-m-3", name: "Samsung Galaxy S25", image: "/images/products/smartphones/samsung/samsung-galaxy-s25-5g.webp", soldCount: 46 },
    { id: "sam-m-4", name: "Samsung Galaxy S24 Ultra", image: "/images/products/smartphones/samsung/samsung-galaxy-s24-ultra-5g.webp", soldCount: 92 },
    { id: "sam-m-5", name: "Samsung Galaxy S24", image: "/images/products/smartphones/samsung/samsung-galaxy-s24-5g.webp", soldCount: 78 },
    { id: "sam-m-6", name: "Samsung Galaxy S23 Ultra", image: "/images/products/smartphones/samsung/samsung-galaxy-s23-ultra-5g.webp", soldCount: 84 },
    { id: "sam-m-7", name: "Samsung Galaxy Z Fold 6", image: "/images/products/smartphones/samsung/samsung-galaxy-z-fold6-5g.webp", soldCount: 22 },
    { id: "sam-m-8", name: "Samsung Galaxy Z Flip 6", image: "/images/products/smartphones/samsung/samsung-galaxy-z-flip6-5g.webp", soldCount: 39 },
    { id: "sam-m-9", name: "Samsung Galaxy A56 5G", image: "/images/products/smartphones/samsung/samsung-galaxy-a56.webp", soldCount: 65 },
  ],

  // ─── Google Mobiles ───
  "mobile_google": [
    { id: "goo-m-1", name: "Google Pixel 10 Pro XL", image: "/images/products/smartphones/google/google-pixel-10-pro-xl.webp", soldCount: 20 },
    { id: "goo-m-2", name: "Google Pixel 10 Pro", image: "/images/products/smartphones/google/google-pixel-10-pro.webp", soldCount: 24 },
    { id: "goo-m-3", name: "Google Pixel 9 Pro XL", image: "/images/products/smartphones/google/google-pixel-9-pro-xl.webp", soldCount: 45 },
    { id: "goo-m-4", name: "Google Pixel 9 Pro", image: "/images/products/smartphones/google/google-pixel-9-pro.webp", soldCount: 40 },
    { id: "goo-m-5", name: "Google Pixel 9", image: "/images/products/smartphones/google/google-pixel-9.webp", soldCount: 52 },
    { id: "goo-m-6", name: "Google Pixel 8 Pro", image: "/images/products/smartphones/google/google-pixel-8-pro.webp", soldCount: 61 },
    { id: "goo-m-7", name: "Google Pixel 8", image: "/images/products/smartphones/google/google-pixel-8.webp", soldCount: 75 },
    { id: "goo-m-8", name: "Google Pixel 7a", image: "/images/products/smartphones/google/google-pixel-7a.webp", soldCount: 80 },
  ],

  // ─── OnePlus Mobiles ───
  "mobile_oneplus": [
    { id: "op-m-1", name: "OnePlus 13", image: "/images/products/smartphones/oneplus/oneplus-13.webp", soldCount: 36 },
    { id: "op-m-2", name: "OnePlus 13R", image: "/images/products/smartphones/oneplus/oneplus-13r.webp", soldCount: 44 },
    { id: "op-m-3", name: "OnePlus 12", image: "/images/products/smartphones/oneplus/oneplus-12.webp", soldCount: 70 },
    { id: "op-m-4", name: "OnePlus 11", image: "/images/products/smartphones/oneplus/oneplus-11.webp", soldCount: 62 },
    { id: "op-m-5", name: "OnePlus Nord 5", image: "/images/products/smartphones/oneplus/oneplus-nord-5.webp", soldCount: 58 },
    { id: "op-m-6", name: "OnePlus Nord 4", image: "/images/products/smartphones/oneplus/oneplus-nord-4-5g.webp", soldCount: 85 },
  ],

  // ─── Xiaomi Mobiles ───
  "mobile_xiaomi": [
    { id: "xm-m-1", name: "Xiaomi 15 Ultra", image: "/images/products/smartphones/xiaomi/xiaomi-15-ultra.webp", soldCount: 25 },
    { id: "xm-m-2", name: "Xiaomi Redmi Note 14 Pro+ 5G", image: "/images/products/smartphones/xiaomi/xiaomi-redmi-note-14-pro-plus-5g.webp", soldCount: 95 },
    { id: "xm-m-3", name: "Xiaomi 14", image: "/images/products/smartphones/xiaomi/xiaomi-14.webp", soldCount: 48 },
    { id: "xm-m-4", name: "Xiaomi Redmi Note 13 Pro", image: "/images/products/smartphones/xiaomi/xiaomi-redmi-note-13-pro.webp", soldCount: 110 },
  ],

  // ─── Realme Mobiles ───
  "mobile_realme": [
    { id: "rm-m-1", name: "Realme GT 7 Pro", image: "/images/products/smartphones/realme/realme-gt-7-pro.webp", soldCount: 40 },
    { id: "rm-m-2", name: "Realme GT 6 5G", image: "/images/products/smartphones/realme/realme-gt-6-5g.webp", soldCount: 55 },
    { id: "rm-m-3", name: "Realme 13 Pro+ 5G", image: "/images/products/smartphones/realme/realme-13-pro-plus-5g.webp", soldCount: 68 },
  ],

  // ─── Vivo Mobiles ───
  "mobile_vivo": [
    { id: "vv-m-1", name: "Vivo X200 Pro", image: "/images/products/smartphones/vivo/vivo-x200-pro.webp", soldCount: 30 },
    { id: "vv-m-2", name: "Vivo V50", image: "/images/products/smartphones/vivo/vivo-v50.webp", soldCount: 45 },
    { id: "vv-m-3", name: "Vivo V40 Pro", image: "/images/products/smartphones/vivo/vivo-v40-pro.webp", soldCount: 60 },
  ],

  // ─── Oppo Mobiles ───
  "mobile_oppo": [
    { id: "op-o-1", name: "Oppo Find X8 Pro", image: "/images/products/smartphones/oppo/oppo-find-x8-pro-5g.webp", soldCount: 22 },
    { id: "op-o-2", name: "Oppo Reno 13 Pro", image: "/images/products/smartphones/oppo/oppo-reno-13-pro.webp", soldCount: 50 },
  ],

  // ─── Motorola Mobiles ───
  "mobile_motorola": [
    { id: "mot-m-1", name: "Motorola Edge 60 Pro", image: "/images/products/smartphones/motorola/motorola-edge-60-pro.webp", soldCount: 25 },
    { id: "mot-m-2", name: "Motorola Edge 50 Ultra", image: "/images/products/smartphones/motorola/motorola-edge-50-ultra.webp", soldCount: 40 },
    { id: "mot-m-3", name: "Motorola Edge 50 Pro", image: "/images/products/smartphones/motorola/motorola-edge-50-pro.webp", soldCount: 65 },
  ],

  // ─── Nothing Mobiles ───
  "mobile_nothing": [
    { id: "not-m-1", name: "Nothing Phone (3)", image: "/images/products/smartphones/nothing/nothing-phone-3.webp", soldCount: 30 },
    { id: "not-m-2", name: "Nothing Phone (3a)", image: "/images/products/smartphones/nothing/nothing-phone-3a.webp", soldCount: 45 },
    { id: "not-m-3", name: "Nothing Phone (2)", image: "/images/products/smartphones/nothing/nothing-phone-2.webp", soldCount: 70 },
  ],

  // ─── Poco Mobiles ───
  "mobile_poco": [
    { id: "pc-m-1", name: "Poco X7 Pro", image: "/images/products/smartphones/poco/poco-x7-pro.webp", soldCount: 45 },
    { id: "pc-m-2", name: "Poco F6 5G", image: "/images/products/smartphones/poco/poco-f6-5g.webp", soldCount: 55 },
  ],

  // ─── Apple Laptops ───
  "laptop_apple": [
    { id: "app-l-1", name: "MacBook Pro 16-inch (M4 Max)", image: "/images/products/laptops/apple-macbook-pro-16-inch-m4-max.webp", soldCount: 18 },
    { id: "app-l-2", name: "MacBook Pro 14-inch (M4 Pro)", image: "/images/products/laptops/apple-macbook-pro-14-inch-m4-pro.webp", soldCount: 26 },
    { id: "app-l-3", name: "MacBook Air 15-inch (M4)", image: "/images/products/laptops/apple-macbook-air-15-inch-m4.webp", soldCount: 35 },
    { id: "app-l-4", name: "MacBook Air 13-inch (M3)", image: "/images/products/laptops/apple-macbook-air-13-inch-m3.webp", soldCount: 60 },
    { id: "app-l-5", name: "MacBook Air 13-inch (M2)", image: "/images/products/laptops/apple-macbook-air-13-inch-m2.webp", soldCount: 85 },
  ],

  // ─── Dell Laptops ───
  "laptop_dell": [
    { id: "del-l-1", name: "Dell XPS 16 (9640)", image: "/images/products/laptops/dell-xps-16-9640.webp", soldCount: 15 },
    { id: "del-l-2", name: "Dell XPS 14 (9440)", image: "/images/products/laptops/dell-xps-14-9440.webp", soldCount: 22 },
    { id: "del-l-3", name: "Dell XPS 13 (9340)", image: "/images/products/laptops/dell-xps-13-9340.webp", soldCount: 38 },
    { id: "del-l-4", name: "Dell Inspiron 15 (3530)", image: "/images/products/laptops/dell-inspiron-15-3530.webp", soldCount: 65 },
  ],

  // ─── HP Laptops ───
  "laptop_hp": [
    { id: "hp-l-1", name: "HP Spectre x360 14 (2024)", image: "/images/products/laptops/hp-spectre-x360-14-2024.webp", soldCount: 20 },
    { id: "hp-l-2", name: "HP Envy x360 14 (2024)", image: "/images/products/laptops/hp-envy-x360-14-2024.webp", soldCount: 35 },
    { id: "hp-l-3", name: "HP Pavilion 15 (eg3000)", image: "/images/products/laptops/hp-pavilion-15-eg3000.webp", soldCount: 55 },
  ],

  // ─── Lenovo Laptops ───
  "laptop_lenovo": [
    { id: "len-l-1", name: "Lenovo ThinkPad X1 Carbon Gen 12", image: "/images/products/laptops/lenovo-thinkpad-x1-carbon-gen-12.webp", soldCount: 25 },
    { id: "len-l-2", name: "Lenovo Yoga 9i Dual-Gen 9", image: "/images/products/laptops/lenovo-yoga-9i-dual-gen-9.webp", soldCount: 18 },
    { id: "len-l-3", name: "Lenovo IdeaPad Slim 5 (Gen 9)", image: "/images/products/laptops/lenovo-ideapad-slim-5-gen-9.webp", soldCount: 60 },
  ],

  // ─── Tablets ───
  "tablet_apple": [
    { id: "app-t-1", name: "iPad Pro 13-inch (M4)", image: "/images/products/tablets/apple-ipad-pro-13-inch-m4.webp", soldCount: 22 },
    { id: "app-t-2", name: "iPad Air 13-inch (M2)", image: "/images/products/tablets/apple-ipad-air-13-inch-m2.webp", soldCount: 34 },
    { id: "app-t-3", name: "iPad 10th Gen (10.9-inch)", image: "/images/products/tablets/apple-ipad-10th-gen.webp", soldCount: 75 },
  ],
  "tablet_samsung": [
    { id: "sam-t-1", name: "Samsung Galaxy Tab S10 Ultra", image: "/images/products/tablets/samsung-galaxy-tab-s10-ultra.webp", soldCount: 18 },
    { id: "sam-t-2", name: "Samsung Galaxy Tab S9 FE", image: "/images/products/tablets/samsung-galaxy-tab-s9-fe.webp", soldCount: 45 },
  ],

  // ─── Smartwatches ───
  "smartwatch_apple": [
    { id: "app-w-1", name: "Apple Watch Ultra 2", image: "/images/products/smartwatches/apple-watch-ultra-2.webp", soldCount: 35 },
    { id: "app-w-2", name: "Apple Watch Series 10 (46mm)", image: "/images/products/smartwatches/apple-watch-series-10-46mm.webp", soldCount: 52 },
    { id: "app-w-3", name: "Apple Watch Series 9 (45mm)", image: "/images/products/smartwatches/apple-watch-series-9-45mm.webp", soldCount: 70 },
  ],
  "smartwatch_samsung": [
    { id: "sam-w-1", name: "Samsung Galaxy Watch Ultra (47mm)", image: "/images/products/smartwatches/samsung-galaxy-watch-ultra-47mm.webp", soldCount: 28 },
    { id: "sam-w-2", name: "Samsung Galaxy Watch 7 (44mm)", image: "/images/products/smartwatches/samsung-galaxy-watch-7-44mm.webp", soldCount: 46 },
  ],
  "smartwatch_google": [
    { id: "goo-w-1", name: "Google Pixel Watch 3 (45mm)", image: "/images/products/smartwatches/google-pixel-watch-3-45mm.webp", soldCount: 22 },
    { id: "goo-w-2", name: "Google Pixel Watch 2 (41mm)", image: "/images/products/smartwatches/google-pixel-watch-2-41mm.webp", soldCount: 38 },
  ],
};

export function getFallbackModels(brand = "Apple", category = "mobile") {
  const cat = String(category).toLowerCase();
  const b = String(brand).toLowerCase().trim();
  const key = `${cat}_${b}`;
  if (FALLBACK_MODELS[key]) return FALLBACK_MODELS[key];

  // If specific brand list doesn't exist, create realistic models based on brand
  const bName = brand.charAt(0).toUpperCase() + brand.slice(1);
  return [
    { id: `${b}-fb-1`, name: `${bName} Pro 5G`, image: `/images/brands/${bName}.png`, soldCount: 24 },
    { id: `${b}-fb-2`, name: `${bName} Ultra`, image: `/images/brands/${bName}.png`, soldCount: 32 },
    { id: `${b}-fb-3`, name: `${bName} Standard`, image: `/images/brands/${bName}.png`, soldCount: 45 },
  ];
}

export function getFallbackVariants(modelId = "default") {
  return [
    {
      id: `${modelId}-v1`,
      label: "8 GB RAM / 128 GB Storage",
      specs: { ram: "8 GB", storage: "128 GB" },
      basePrice: 18000,
    },
    {
      id: `${modelId}-v2`,
      label: "8 GB RAM / 256 GB Storage",
      specs: { ram: "8 GB", storage: "256 GB" },
      basePrice: 22000,
    },
    {
      id: `${modelId}-v3`,
      label: "12 GB RAM / 512 GB Storage",
      specs: { ram: "12 GB", storage: "512 GB" },
      basePrice: 28000,
    },
  ];
}

export const FALLBACK_EVALUATION_CONFIGS = {
  mobile: {
    category: "mobile",
    processingFee: 199,
    questions: [
      { key: "device_turns_on", label: "Does the mobile turn on and work normally?", order: 1, deductionOnNo: 60 },
      { key: "touch_working", label: "Is the touchscreen responsive across the entire surface?", order: 2, deductionOnNo: 30 },
      { key: "can_make_calls", label: "Can the phone make/receive calls with functional mic & speaker?", order: 3, deductionOnNo: 25 },
      { key: "camera_working", label: "Are both front and rear cameras operational?", order: 4, deductionOnNo: 20 },
      { key: "biometrics", label: "Does Face ID or Fingerprint unlock work properly?", order: 5, deductionOnNo: 10 },
    ],
    defects: [
      {
        key: "screen_damage", label: "Display / Screen Condition", order: 1, deduction: 0,
        children: [
          { key: "screen_cracked", label: "Cracked or shattered front glass", deduction: 40 },
          { key: "dead_pixels", label: "Dead pixels, spots, or colored vertical lines", deduction: 25 },
          { key: "minor_scratches", label: "Minor visible micro-scratches on glass", deduction: 8 },
        ]
      },
      {
        key: "body_damage", label: "Chassis & Back Panel", order: 2, deduction: 0,
        children: [
          { key: "back_cracked", label: "Back glass or panel cracked", deduction: 15 },
          { key: "body_dents", label: "Dents or deep nicks along metallic edges", deduction: 10 },
          { key: "bent_frame", label: "Chassis visibly bent or warped", deduction: 30 },
        ]
      },
      {
        key: "hardware_issues", label: "Internal Hardware & Battery", order: 3, deduction: 0,
        children: [
          { key: "battery_weak", label: "Battery drains very fast (health under 80%)", deduction: 18 },
          { key: "charging_port", label: "Charging port loose or only charges at angles", deduction: 12 },
          { key: "speaker_mic", label: "Muffled speaker or faulty microphone", deduction: 10 },
        ]
      }
    ],
    accessories: [
      { key: "original_box", label: "Original Brand Box included", order: 1, addition: 3 },
      { key: "original_charger", label: "Original Fast Charger / Cable", order: 2, addition: 4 },
      { key: "valid_bill", label: "Original purchase tax invoice", order: 3, addition: 3 },
    ]
  },
  laptop: {
    category: "laptop",
    processingFee: 399,
    questions: [
      { key: "powers_on", label: "Does the laptop turn on and boot to OS normally?", order: 1, deductionOnNo: 65 },
      { key: "screen_working", label: "Is the screen working with no flickering or lines?", order: 2, deductionOnNo: 35 },
      { key: "keyboard_trackpad", label: "Are all keyboard keys and trackpad working?", order: 3, deductionOnNo: 20 },
      { key: "battery_holds_charge", label: "Does the laptop battery charge and hold power unplugged?", order: 4, deductionOnNo: 20 },
      { key: "wifi_ports", label: "Are WiFi, Bluetooth, and USB/Type-C ports working?", order: 5, deductionOnNo: 15 },
    ],
    defects: [
      {
        key: "screen_condition", label: "Screen & Hinge Condition", order: 1, deduction: 0,
        children: [
          { key: "broken_screen", label: "Cracked screen or broken display glass", deduction: 45 },
          { key: "loose_hinges", label: "Loose or cracked hinge mechanism", deduction: 20 },
          { key: "screen_spots", label: "White pressure spots or dead pixels", deduction: 15 },
        ]
      },
      {
        key: "body_condition", label: "Chassis & Palmrest", order: 2, deduction: 0,
        children: [
          { key: "heavy_dents", label: "Heavy dents or chassis cracks", deduction: 18 },
          { key: "broken_ports", label: "Physical damage to charging port or HDMI", deduction: 15 },
        ]
      }
    ],
    accessories: [
      { key: "original_charger", label: "Original OEM Power Brick & Cable", order: 1, addition: 5 },
      { key: "original_box", label: "Original Packaging Box", order: 2, addition: 3 },
      { key: "valid_bill", label: "Original Purchase Bill", order: 3, addition: 2 },
    ]
  },
  tablet: {
    category: "tablet",
    processingFee: 249,
    questions: [
      { key: "powers_on", label: "Does the tablet power on and work smoothly?", order: 1, deductionOnNo: 60 },
      { key: "touch_working", label: "Does touchscreen respond accurately to all finger touches?", order: 2, deductionOnNo: 30 },
      { key: "cameras_working", label: "Are front and rear cameras working?", order: 3, deductionOnNo: 15 },
      { key: "speakers_working", label: "Do speakers and volume controls function?", order: 4, deductionOnNo: 15 },
    ],
    defects: [
      {
        key: "display_damage", label: "Screen & Glass", order: 1, deduction: 0,
        children: [
          { key: "cracked_glass", label: "Cracked or shattered glass", deduction: 40 },
          { key: "minor_scratches", label: "Micro-scratches on display", deduction: 8 },
        ]
      }
    ],
    accessories: [
      { key: "original_stylus", label: "Original Stylus / Apple Pencil", order: 1, addition: 6 },
      { key: "original_charger", label: "Original Charger / Cable", order: 2, addition: 4 },
      { key: "original_box", label: "Original Box", order: 3, addition: 2 },
    ]
  },
  smartwatch: {
    category: "smartwatch",
    processingFee: 149,
    questions: [
      { key: "powers_on", label: "Does the smartwatch power on and pair with phone?", order: 1, deductionOnNo: 65 },
      { key: "touch_working", label: "Is the touch display fully responsive?", order: 2, deductionOnNo: 30 },
      { key: "sensors_working", label: "Do heart-rate and step tracking sensors work?", order: 3, deductionOnNo: 20 },
    ],
    defects: [
      {
        key: "screen_damage", label: "Screen & Case Condition", order: 1, deduction: 0,
        children: [
          { key: "cracked_screen", label: "Cracked or scratched display glass", deduction: 45 },
          { key: "case_dents", label: "Dents or deep scratches on bezel/case", deduction: 15 },
        ]
      }
    ],
    accessories: [
      { key: "original_charger", label: "Original Magnetic Charging Dock/Cable", order: 1, addition: 6 },
      { key: "original_box", label: "Original Watch Box", order: 2, addition: 3 },
      { key: "extra_strap", label: "Original Extra Band/Strap", order: 3, addition: 3 },
    ]
  }
};

export function getFallbackEvaluationConfig(category = "mobile") {
  const cat = String(category).toLowerCase();
  return FALLBACK_EVALUATION_CONFIGS[cat] || FALLBACK_EVALUATION_CONFIGS.mobile;
}

export function calculateLocalPrice({
  basePrice = 20000,
  answers = {},
  defectKeys = [],
  accessoryKeys = [],
  category = "mobile",
  modelName = "Device",
  variantLabel = "Standard Variant",
  modelImage = null,
} = {}) {
  const cfg = FALLBACK_EVALUATION_CONFIGS[category] || FALLBACK_EVALUATION_CONFIGS.mobile;
  let totalDeductionPercent = 0;
  const deductionBreakdown = [];

  if (Array.isArray(cfg.questions)) {
    for (const q of cfg.questions) {
      if (answers[q.key] === false && q.deductionOnNo) {
        totalDeductionPercent += q.deductionOnNo;
        deductionBreakdown.push({ reason: q.label, deduction: q.deductionOnNo });
      }
    }
  }

  if (Array.isArray(cfg.defects)) {
    for (const group of cfg.defects) {
      if (Array.isArray(group.children)) {
        for (const child of group.children) {
          if (defectKeys.includes(child.key) && child.deduction) {
            totalDeductionPercent += child.deduction;
            deductionBreakdown.push({ reason: child.label, deduction: child.deduction });
          }
        }
      }
    }
  }

  const cappedDeductionPercent = Math.min(totalDeductionPercent, 100);

  let totalAdditionPercent = 0;
  const additionBreakdown = [];
  if (Array.isArray(cfg.accessories)) {
    for (const acc of cfg.accessories) {
      if (accessoryKeys.includes(acc.key) && acc.addition) {
        totalAdditionPercent += acc.addition;
        additionBreakdown.push({ reason: acc.label, addition: acc.addition });
      }
    }
  }

  const deductionAmount = parseFloat(((basePrice * cappedDeductionPercent) / 100).toFixed(2));
  const additionAmount = parseFloat(((basePrice * totalAdditionPercent) / 100).toFixed(2));
  const processingFee = cfg.processingFee || 199;
  const afterDeductions = basePrice - deductionAmount + additionAmount;
  const finalPrice = Math.max(0, Math.round(afterDeductions - processingFee));

  return {
    device: {
      model: modelName,
      variant: variantLabel,
      image: modelImage,
      category,
    },
    pricing: {
      basePrice,
      deductionPercent: cappedDeductionPercent,
      rawDeductionPercent: totalDeductionPercent,
      deductionAmount,
      additionAmount,
      processingFee,
      finalPrice,
    },
    breakdown: {
      deductions: deductionBreakdown,
      additions: additionBreakdown,
    },
  };
}
