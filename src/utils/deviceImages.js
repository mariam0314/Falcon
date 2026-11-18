/**
 * deviceImages.js
 * Centralized, reliable resolution for real electronic device photographs.
 * Ensures the FALCON logo or generic placeholders are NEVER displayed as product photos.
 * All product photos are professionally categorized under /images/products/<category>/
 */

export function getDeviceFallback(category = "mobile") {
  const cat = String(category).toLowerCase();
  if (cat.includes("laptop")) return "/images/placeholders/fallback-laptop.png";
  if (cat.includes("smartwatch") || cat.includes("watch")) return "/images/placeholders/fallback-smartwatch.png";
  if (cat.includes("tablet") || cat.includes("ipad")) return "/images/placeholders/fallback-tablet.png";
  if (cat.includes("audio") || cat.includes("headphone") || cat.includes("earphone")) return "/images/placeholders/fallback-audio.png";
  return "/images/placeholders/fallback-mobile.png";
}

// Normalized lookup map for verified product image names (.webp format)
const EXACT_MODEL_MAP = {
  // Apple Mobiles
  "iphone 17 pro max": "/images/products/smartphones/apple/apple-iphone-17-pro-max.webp",
  "iphone 17 pro": "/images/products/smartphones/apple/apple-iphone-17-pro.webp",
  "iphone 17": "/images/products/smartphones/apple/apple-iphone-17.webp",
  "iphone 16 pro max": "/images/products/smartphones/apple/apple-iphone-16-pro-max.webp",
  "iphone 16 pro": "/images/products/smartphones/apple/apple-iphone-16-pro.webp",
  "iphone 16 plus": "/images/products/smartphones/apple/apple-iphone-16-plus.webp",
  "iphone 16": "/images/products/smartphones/apple/apple-iphone-16.webp",
  "iphone 15 pro max": "/images/products/smartphones/apple/apple-iphone-15-pro-max.webp",
  "iphone 15 pro": "/images/products/smartphones/apple/apple-iphone-15-pro.webp",
  "iphone 15 plus": "/images/products/smartphones/apple/apple-iphone-15-plus.webp",
  "iphone 15": "/images/products/smartphones/apple/apple-iphone-15.webp",
  "iphone 14 pro max": "/images/products/smartphones/apple/apple-iphone-14-pro-max.webp",
  "iphone 14 pro": "/images/products/smartphones/apple/apple-iphone-14-pro.webp",
  "iphone 14 plus": "/images/products/smartphones/apple/apple-iphone-14-plus.webp",
  "iphone 14": "/images/products/smartphones/apple/apple-iphone-14.webp",
  "iphone 13 pro max": "/images/products/smartphones/apple/apple-iphone-13-pro-max.webp",
  "iphone 13 pro": "/images/products/smartphones/apple/apple-iphone-13-pro.webp",
  "iphone 13 mini": "/images/products/smartphones/apple/apple-iphone-13-mini.webp",
  "iphone 13": "/images/products/smartphones/apple/apple-iphone-13.webp",
  "iphone 12 pro max": "/images/products/smartphones/apple/apple-iphone-12-pro-max.webp",
  "iphone 12": "/images/products/smartphones/apple/apple-iphone-12.webp",
  "iphone 11": "/images/products/smartphones/apple/apple-iphone-11.webp",

  // Samsung Mobiles
  "galaxy s26 ultra 5g": "/images/products/smartphones/samsung/samsung-galaxy-s26-ultra-5g.webp",
  "galaxy s26 5g": "/images/products/smartphones/samsung/samsung-galaxy-s26-5g.webp",
  "galaxy s25 ultra 5g": "/images/products/smartphones/samsung/samsung-galaxy-s25-ultra-5g.webp",
  "galaxy s25 ultra": "/images/products/smartphones/samsung/samsung-galaxy-s25-ultra-5g.webp",
  "galaxy s25+ 5g": "/images/products/smartphones/samsung/samsung-galaxy-s25-plus-5g.webp",
  "galaxy s25 plus 5g": "/images/products/smartphones/samsung/samsung-galaxy-s25-plus-5g.webp",
  "galaxy s25 5g": "/images/products/smartphones/samsung/samsung-galaxy-s25-5g.webp",
  "galaxy s24 ultra 5g": "/images/products/smartphones/samsung/samsung-galaxy-s24-ultra-5g.webp",
  "galaxy s24 ultra": "/images/products/smartphones/samsung/samsung-galaxy-s24-ultra-5g.webp",
  "galaxy s24 5g": "/images/products/smartphones/samsung/samsung-galaxy-s24-5g.webp",
  "galaxy s23 ultra 5g": "/images/products/smartphones/samsung/samsung-galaxy-s23-ultra-5g.webp",
  "galaxy s22 ultra 5g": "/images/products/smartphones/samsung/samsung-galaxy-s22-ultra-5g.webp",
  "galaxy s21 ultra 5g": "/images/products/smartphones/samsung/samsung-galaxy-s21-ultra-5g.webp",
  "galaxy z fold 6": "/images/products/smartphones/samsung/samsung-galaxy-z-fold6-5g.webp",
  "galaxy z flip 6": "/images/products/smartphones/samsung/samsung-galaxy-z-flip6-5g.webp",
  "galaxy z fold 5": "/images/products/smartphones/samsung/samsung-galaxy-z-fold5.webp",
  "galaxy z fold 3": "/images/products/smartphones/samsung/samsung-galaxy-z-fold3-5g.webp",
  "galaxy a56": "/images/products/smartphones/samsung/samsung-galaxy-a56.webp",
  "galaxy a36": "/images/products/smartphones/samsung/samsung-galaxy-a36.webp",

  // OnePlus Mobiles
  "oneplus 13": "/images/products/smartphones/oneplus/oneplus-13.webp",
  "oneplus 13r": "/images/products/smartphones/oneplus/oneplus-13r.webp",
  "oneplus 12": "/images/products/smartphones/oneplus/oneplus-12.webp",
  "oneplus 11": "/images/products/smartphones/oneplus/oneplus-11.webp",
  "oneplus 10 pro": "/images/products/smartphones/oneplus/oneplus-10-pro.webp",
  "oneplus 9 pro": "/images/products/smartphones/oneplus/oneplus-9-pro-5g.webp",
  "oneplus nord 4": "/images/products/smartphones/oneplus/oneplus-nord-4-5g.webp",
  "oneplus nord 5": "/images/products/smartphones/oneplus/oneplus-nord-5.webp",
  "oneplus nord ce": "/images/products/smartphones/oneplus/oneplus-nord-ce.webp",

  // Google Mobiles
  "pixel 10 pro xl": "/images/products/smartphones/google/google-pixel-10-pro-xl.webp",
  "pixel 10 pro": "/images/products/smartphones/google/google-pixel-10-pro.webp",
  "pixel 10": "/images/products/smartphones/google/google-pixel-10.webp",
  "pixel 9 pro xl": "/images/products/smartphones/google/google-pixel-9-pro-xl.webp",
  "pixel 9 pro": "/images/products/smartphones/google/google-pixel-9-pro.webp",
  "pixel 9a": "/images/products/smartphones/google/google-pixel-9a.webp",
  "pixel 9": "/images/products/smartphones/google/google-pixel-9.webp",
  "pixel 8 pro": "/images/products/smartphones/google/google-pixel-8-pro.webp",
  "pixel 8": "/images/products/smartphones/google/google-pixel-8.webp",
  "pixel 7 pro": "/images/products/smartphones/google/google-pixel-7-pro.webp",
  "pixel 7": "/images/products/smartphones/google/google-pixel-7.webp",
  "pixel 6a": "/images/products/smartphones/google/google-pixel-6a.webp",

  // Other Brand Mobiles
  "xiaomi 15 ultra": "/images/products/smartphones/xiaomi/xiaomi-15-ultra.webp",
  "redmi note 14 pro+": "/images/products/smartphones/xiaomi/xiaomi-redmi-note-14-pro-plus-5g.webp",
  "redmi note 14 pro plus": "/images/products/smartphones/xiaomi/xiaomi-redmi-note-14-pro-plus-5g.webp",
  "poco f7 5g": "/images/products/smartphones/poco/poco-f7-5g.webp",
  "poco x7 pro": "/images/products/smartphones/poco/poco-x7-pro.webp",
  "poco f5 5g": "/images/products/smartphones/poco/poco-f5-5g.webp",
  "nothing phone (3)": "/images/products/smartphones/nothing/nothing-phone-3.webp",
  "nothing phone 3": "/images/products/smartphones/nothing/nothing-phone-3.webp",
  "nothing phone (3a)": "/images/products/smartphones/nothing/nothing-phone-3a.webp",
  "nothing phone 3a": "/images/products/smartphones/nothing/nothing-phone-3a.webp",
  "nothing phone 2": "/images/products/smartphones/nothing/nothing-phone-2.webp",
  "nothing phone 1": "/images/products/smartphones/nothing/nothing-phone-1.webp",
  "vivo x200 pro": "/images/products/smartphones/vivo/vivo-x200-pro.webp",
  "vivo v50": "/images/products/smartphones/vivo/vivo-v50.webp",
  "vivo v40": "/images/products/smartphones/vivo/vivo-v40.webp",
  "vivo v30": "/images/products/smartphones/vivo/vivo-v30.webp",
  "oppo find x8 pro": "/images/products/smartphones/oppo/oppo-find-x8-pro-5g.webp",
  "oppo find x2": "/images/products/smartphones/oppo/oppo-find-x2.webp",
  "oppo reno 13 pro": "/images/products/smartphones/oppo/oppo-reno-13-pro.webp",
  "realme gt 7 pro": "/images/products/smartphones/realme/realme-gt-7-pro.webp",
  "realme gt 8 pro 5g": "/images/products/smartphones/realme/realme-gt-8-pro-5g.webp",
  "motorola edge 60 pro": "/images/products/smartphones/motorola/motorola-edge-60-pro.webp",
  "nokia g20": "/images/products/smartphones/nokia/nokia-g20.webp",
  "nokia g21": "/images/products/smartphones/nokia/nokia-g21.webp",
  "nokia 5.4": "/images/products/smartphones/nokia/nokia-5-4.webp",

  // Apple Laptops
  "macbook pro 16-inch (m4 max)": "/images/products/laptops/apple-macbook-pro-16-inch-m4-max.webp",
  "macbook pro 14-inch (m4 pro)": "/images/products/laptops/apple-macbook-pro-14-inch-m4-pro.webp",
  "macbook pro 14-inch (m4)": "/images/products/laptops/apple-macbook-pro-14-inch-m4.webp",
  "macbook air 15-inch (m4)": "/images/products/laptops/apple-macbook-air-15-inch-m4.webp",
  "macbook air 13-inch (m3)": "/images/products/laptops/apple-macbook-air-13-inch-m3.webp",
  "macbook air 13-inch (m2)": "/images/products/laptops/apple-macbook-air-13-inch-m2.webp",
  "macbook air 13-inch (m1)": "/images/products/laptops/apple-macbook-air-13-inch-m1.webp",

  // Dell Laptops
  "dell xps 16 (9640)": "/images/products/laptops/dell-xps-16-9640.webp",
  "dell xps 14 (9440)": "/images/products/laptops/dell-xps-14-9440.webp",
  "dell xps 13 (9340)": "/images/products/laptops/dell-xps-13-9340.webp",
  "dell inspiron 15 (3530)": "/images/products/laptops/dell-inspiron-15-3530.webp",
  "dell inspiron 14 2-in-1 (7440)": "/images/products/laptops/dell-inspiron-14-2-in-1-7440.webp",
  "dell g15 gaming (5530)": "/images/products/laptops/dell-g15-gaming-5530.webp",

  // HP Laptops
  "hp spectre x360 14 (2024)": "/images/products/laptops/hp-spectre-x360-14-2024.webp",
  "hp envy x360 14 (2024)": "/images/products/laptops/hp-envy-x360-14-2024.webp",
  "hp pavilion plus 14 (2024)": "/images/products/laptops/hp-pavilion-plus-14-2024.webp",
  "hp pavilion 15 (eg3000)": "/images/products/laptops/hp-pavilion-15-eg3000.webp",
  "hp omen 16 (2024)": "/images/products/laptops/hp-omen-16-2024.webp",
  "hp victus 16 (2024)": "/images/products/laptops/hp-victus-16-2024.webp",

  // Lenovo Laptops
  "lenovo thinkpad x1 carbon gen 12": "/images/products/laptops/lenovo-thinkpad-x1-carbon-gen-12.webp",
  "lenovo yoga 9i dual-gen 9": "/images/products/laptops/lenovo-yoga-9i-dual-gen-9.webp",
  "lenovo yoga 7 2-in-1 (gen 9)": "/images/products/laptops/lenovo-yoga-7-2-in-1-gen-9.webp",
  "lenovo ideapad slim 5 (gen 9)": "/images/products/laptops/lenovo-ideapad-slim-5-gen-9.webp",
  "lenovo legion pro 7i gen 9": "/images/products/laptops/lenovo-legion-pro-7i-gen-9.webp",
  "lenovo loq 15 (2024)": "/images/products/laptops/lenovo-loq-15-2024.webp",

  // ASUS Laptops
  "asus zenbook 14 oled (ux3405)": "/images/products/laptops/asus-zenbook-14-oled-ux3405.webp",
  "asus rog strix g16 (2024)": "/images/products/laptops/asus-rog-strix-g16-2024.webp",
  "asus tuf gaming a15 (fa507)": "/images/products/laptops/asus-tuf-gaming-a15-fa507.webp",
  "asus vivobook s 14 oled (s5406)": "/images/products/laptops/asus-vivobook-s-14-oled-s5406.webp",

  // Tablets
  "ipad pro 13-inch (m4)": "/images/products/tablets/apple-ipad-pro-13-inch-m4.webp",
  "ipad pro 11-inch (m4)": "/images/products/tablets/apple-ipad-pro-11-inch-m4.webp",
  "ipad air 13-inch (m2)": "/images/products/tablets/apple-ipad-air-13-inch-m2.webp",
  "ipad air 11-inch (m2)": "/images/products/tablets/apple-ipad-air-11-inch-m2.webp",
  "ipad (10th generation)": "/images/products/tablets/apple-ipad-10th-generation.webp",
  "ipad mini (6th generation)": "/images/products/tablets/apple-ipad-mini-6th-generation.webp",
  "galaxy tab s10 ultra": "/images/products/tablets/samsung-galaxy-tab-s10-ultra.webp",
  "galaxy tab s10+": "/images/products/tablets/samsung-galaxy-tab-s10-plus.webp",
  "galaxy tab s9 ultra": "/images/products/tablets/samsung-galaxy-tab-s9-ultra.webp",
  "galaxy tab s9+": "/images/products/tablets/samsung-galaxy-tab-s9-plus.webp",
  "oneplus pad 2": "/images/products/tablets/oneplus-pad-2.webp",
  "xiaomi pad 6": "/images/products/tablets/xiaomi-pad-6.webp",
  "lenovo tab p12": "/images/products/tablets/lenovo-tab-p12.webp",

  // Smartwatches
  "apple watch ultra 2": "/images/products/smartwatches/apple-watch-ultra-2.webp",
  "apple watch series 10": "/images/products/smartwatches/apple-watch-series-10.webp",
  "apple watch series 9": "/images/products/smartwatches/apple-watch-series-9.webp",
  "apple watch se (2nd gen)": "/images/products/smartwatches/apple-watch-se-2nd-gen.webp",
  "galaxy watch ultra": "/images/products/smartwatches/samsung-galaxy-watch-ultra.webp",
  "galaxy watch 7": "/images/products/smartwatches/samsung-galaxy-watch-7.webp",
  "galaxy watch 6 classic": "/images/products/smartwatches/samsung-galaxy-watch-6-classic.webp",
  "pixel watch 3": "/images/products/smartwatches/google-pixel-watch-3.webp",
  "pixel watch 2": "/images/products/smartwatches/google-pixel-watch-2.webp",
  "garmin forerunner 965": "/images/products/smartwatches/garmin-forerunner-965.webp",
  "garmin forerunner 265": "/images/products/smartwatches/garmin-forerunner-265.webp",
  "amazfit balance": "/images/products/smartwatches/amazfit-balance.webp",
  "noise colorfit pro 5": "/images/products/smartwatches/noise-colorfit-pro-5.webp",
  "oneplus watch 2": "/images/products/smartwatches/oneplus-watch-2.webp"
};

export function getDeviceImage(device) {
  if (!device) return getDeviceFallback("mobile");

  const rawImg = device.images?.[0] || device.image;
  // If a valid product photo exists (and is not placeholder / logo)
  if (
    rawImg &&
    typeof rawImg === "string" &&
    !rawImg.includes("logo.png") &&
    !rawImg.includes("device-placeholder") &&
    !rawImg.includes("placehold.co") &&
    !rawImg.endsWith("/phone.png") &&
    rawImg !== "phone.png"
  ) {
    return rawImg;
  }

  // Model-level matching for known catalog devices
  const title = String(device.title || device.name || device.model || "").trim().toLowerCase();
  const cat = String(device.category || "").toLowerCase();
  const brand = String(device.brand || "").trim().toLowerCase();

  if (EXACT_MODEL_MAP[title]) {
    return EXACT_MODEL_MAP[title];
  }

  // Substring match in map keys
  for (const [key, imgPath] of Object.entries(EXACT_MODEL_MAP)) {
    if (title.includes(key) || key.includes(title)) {
      return imgPath;
    }
  }

  // Dynamic slug resolution
  if (brand && title) {
    let clean = title.replace(new RegExp(`^${brand}\\s+`, "i"), "");
    const slug = `${brand}-${clean}`
      .toLowerCase()
      .replace(/\+/g, "-plus")
      .replace(/&/g, "-and-")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");
    
    if (cat.includes("laptop")) return `/images/products/laptops/${slug}.webp`;
    if (cat.includes("smartwatch") || cat.includes("watch")) return `/images/products/smartwatches/${slug}.webp`;
    if (cat.includes("tablet") || cat.includes("ipad")) return `/images/products/tablets/${slug}.webp`;
    return `/images/products/smartphones/${brand}/${slug}.webp`;
  }

  // Fallback by category
  return getDeviceFallback(cat);
}
