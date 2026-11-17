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

// Normalized lookup map for verified product image names
const EXACT_MODEL_MAP = {
  // Apple Mobiles
  "iphone 17 pro max": "/images/products/smartphones/iphone-17-pro-max.png",
  "iphone 17 pro": "/images/products/smartphones/iphone-17-pro.png",
  "iphone 17": "/images/products/smartphones/iphone-17.png",
  "iphone 16 pro max": "/images/products/smartphones/iphone-16-pro-max.png",
  "iphone 16 pro": "/images/products/smartphones/iphone-16-pro.png",
  "iphone 16": "/images/products/smartphones/iphone-16.png",
  "iphone 15 pro max": "/images/products/smartphones/iphone-15-pro-max.png",
  "iphone 15": "/images/products/smartphones/iphone-15.png",
  "iphone 14": "/images/products/smartphones/iphone-14.png",
  "iphone 13": "/images/products/smartphones/iphone-13.png",

  // Samsung Mobiles
  "galaxy s25 ultra": "/images/products/smartphones/galaxy-s25-ultra.png",
  "galaxy s25+": "/images/products/smartphones/galaxy-s25-plus.png",
  "galaxy s25 plus": "/images/products/smartphones/galaxy-s25-plus.png",
  "galaxy s25": "/images/products/smartphones/galaxy-s25.png",
  "galaxy s24 ultra": "/images/products/smartphones/galaxy-s24-ultra.png",
  "galaxy z fold": "/images/products/smartphones/galaxy-z-fold.png",
  "galaxy z flip": "/images/products/smartphones/galaxy-z-flip.png",
  "galaxy a56": "/images/products/smartphones/galaxy-a56.png",
  "galaxy a36": "/images/products/smartphones/galaxy-a36.png",

  // OnePlus Mobiles
  "oneplus 13": "/images/products/smartphones/oneplus-13.png",
  "oneplus 13r": "/images/products/smartphones/oneplus-13r.png",
  "oneplus 12": "/images/products/smartphones/oneplus-12.png",
  "oneplus nord 5": "/images/products/smartphones/oneplus-nord-5.png",
  "oneplus nord ce": "/images/products/smartphones/oneplus-nord-ce.png",

  // Google Mobiles
  "pixel 10 pro xl": "/images/products/smartphones/pixel-10-pro-xl.png",
  "pixel 10 pro": "/images/products/smartphones/pixel-10-pro.png",
  "pixel 9 pro": "/images/products/smartphones/pixel-9-pro.png",
  "pixel 9a": "/images/products/smartphones/pixel-9a.png",

  // Other Brand Mobiles
  "xiaomi 15 ultra": "/images/products/smartphones/xiaomi-15-ultra.png",
  "redmi note 14 pro+": "/images/products/smartphones/redmi-note-14-pro-plus.png",
  "redmi note 14 pro plus": "/images/products/smartphones/redmi-note-14-pro-plus.png",
  "poco x7 pro": "/images/products/smartphones/poco-x7-pro.png",
  "nothing phone (3)": "/images/products/smartphones/nothing-phone-3.png",
  "nothing phone 3": "/images/products/smartphones/nothing-phone-3.png",
  "nothing phone (3a)": "/images/products/smartphones/nothing-phone-3a.png",
  "nothing phone 3a": "/images/products/smartphones/nothing-phone-3a.png",
  "vivo x200 pro": "/images/products/smartphones/vivo-x200-pro.png",
  "vivo v50": "/images/products/smartphones/vivo-v50.png",
  "oppo find x8 pro": "/images/products/smartphones/oppo-find-x8-pro.png",
  "oppo reno 13 pro": "/images/products/smartphones/oppo-reno-13-pro.png",
  "realme gt 7 pro": "/images/products/smartphones/realme-gt-7-pro.png",
  "motorola edge 60 pro": "/images/products/smartphones/motorola-edge-60-pro.png",

  // Apple Laptops
  "macbook air m4 13-inch": "/images/products/laptops/macbook-air-m4-13.png",
  "macbook air m4 13": "/images/products/laptops/macbook-air-m4-13.png",
  "macbook air m4 15-inch": "/images/products/laptops/macbook-air-m4-15.png",
  "macbook air m4 15": "/images/products/laptops/macbook-air-m4-15.png",
  "macbook pro m4 14-inch": "/images/products/laptops/macbook-pro-m4-14.png",
  "macbook pro m4 14": "/images/products/laptops/macbook-pro-m4-14.png",
  "macbook pro m4 pro": "/images/products/laptops/macbook-pro-m4-pro.png",
  "macbook pro m4 max": "/images/products/laptops/macbook-pro-m4-max.png",

  // HP Laptops
  "hp pavilion 15": "/images/products/laptops/hp-pavilion-15.png",
  "hp pavilion plus": "/images/products/laptops/hp-pavilion-plus.png",
  "hp envy x360": "/images/products/laptops/hp-envy-x360.png",
  "hp spectre x360": "/images/products/laptops/hp-spectre-x360.png",
  "hp victus": "/images/products/laptops/hp-victus.png",
  "hp omen": "/images/products/laptops/hp-omen.png",

  // Dell Laptops
  "dell inspiron 15": "/images/products/laptops/dell-inspiron-15.png",
  "dell inspiron 14": "/images/products/laptops/dell-inspiron-14.png",
  "dell xps 13": "/images/products/laptops/dell-xps-13.png",
  "dell xps 15": "/images/products/laptops/dell-xps-15.png",
  "dell g15": "/images/products/laptops/dell-g15.png",

  // Lenovo Laptops
  "lenovo ideapad slim 5": "/images/products/laptops/lenovo-ideapad-slim-5.png",
  "lenovo yoga 7": "/images/products/laptops/lenovo-yoga-7.png",
  "lenovo thinkpad e14": "/images/products/laptops/lenovo-thinkpad-e14.png",
  "lenovo legion 5": "/images/products/laptops/lenovo-legion-5.png",
  "lenovo loq": "/images/products/laptops/lenovo-loq.png",

  // ASUS Laptops
  "asus vivobook 15": "/images/products/laptops/asus-vivobook-15.png",
  "asus vivobook s 14": "/images/products/laptops/asus-vivobook-s14.png",
  "asus zenbook 14": "/images/products/laptops/asus-zenbook-14.png",
  "asus rog strix g16": "/images/products/laptops/asus-rog-strix-g16.png",
  "asus tuf gaming a15": "/images/products/laptops/asus-tuf-gaming-a15.png",

  // Acer & MSI Laptops
  "acer aspire 7": "/images/products/laptops/acer-aspire-7.png",
  "acer swift go 14": "/images/products/laptops/acer-swift-go-14.png",
  "acer nitro v 15": "/images/products/laptops/acer-nitro-v15.png",
  "acer predator helios neo": "/images/products/laptops/acer-predator-helios-neo.png",
  "msi thin 15": "/images/products/laptops/msi-thin-15.png",
  "msi katana 15": "/images/products/laptops/msi-katana-15.png",

  // Tablets
  "ipad pro m4": "/images/products/tablets/ipad-pro-m4.png",
  "ipad pro": "/images/products/tablets/ipad-pro-m4.png",
  "ipad air m2": "/images/products/tablets/ipad-air-m2.png",
  "ipad air": "/images/products/tablets/ipad-air-m2.png",
  "ipad 10th gen": "/images/products/tablets/ipad-10th-gen.png",
  "ipad (10th gen)": "/images/products/tablets/ipad-10th-gen.png",
  "galaxy tab s9 ultra": "/images/products/tablets/galaxy-tab-s9-ultra.png",
  "galaxy tab s9": "/images/products/tablets/galaxy-tab-s9-ultra.png",
  "galaxy tab s10+": "/images/products/tablets/galaxy-tab-s10-plus.png",
  "galaxy tab s10 plus": "/images/products/tablets/galaxy-tab-s10-plus.png",
  "galaxy tab": "/images/products/tablets/galaxy-tab-s9-ultra.png",
  "lenovo tab p12": "/images/products/tablets/lenovo-tab-p12.png",
  "lenovo tab": "/images/products/tablets/lenovo-tab-p12.png",
  "xiaomi pad 6": "/images/products/tablets/xiaomi-pad-6.png",
  "xiaomi pad 7": "/images/products/tablets/xiaomi-pad-6.png",
  "xiaomi pad": "/images/products/tablets/xiaomi-pad-6.png",

  // Smartwatches
  "apple watch ultra 2": "/images/products/smartwatches/apple-watch-ultra-2.png",
  "apple watch ultra": "/images/products/smartwatches/apple-watch-ultra-2.png",
  "apple watch series 10": "/images/products/smartwatches/apple-watch-series-10.png",
  "apple watch series 9": "/images/products/smartwatches/apple-watch-series-9.png",
  "apple watch": "/images/products/smartwatches/apple-watch-series-10.png",
  "galaxy watch 7": "/images/products/smartwatches/galaxy-watch-7.png",
  "galaxy watch ultra": "/images/products/smartwatches/galaxy-watch-ultra.png",
  "galaxy watch": "/images/products/smartwatches/galaxy-watch-7.png",
  "pixel watch 3": "/images/products/smartwatches/pixel-watch-3.png",
  "pixel watch 2": "/images/products/smartwatches/pixel-watch-3.png",
  "pixel watch": "/images/products/smartwatches/pixel-watch-3.png",
  "garmin forerunner 265": "/images/products/smartwatches/garmin-forerunner-265.png",
  "garmin": "/images/products/smartwatches/garmin-forerunner-265.png",
  "amazfit balance": "/images/products/smartwatches/amazfit-balance.png",
  "amazfit": "/images/products/smartwatches/amazfit-balance.png",
  "noise colorfit pro 5": "/images/products/smartwatches/noise-colorfit-pro-5.png",
  "noise colorfit": "/images/products/smartwatches/noise-colorfit-pro-5.png",
  "noise": "/images/products/smartwatches/noise-colorfit-pro-5.png",
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

  if (EXACT_MODEL_MAP[title]) {
    return EXACT_MODEL_MAP[title];
  }

  // Substring match in map keys
  for (const [key, imgPath] of Object.entries(EXACT_MODEL_MAP)) {
    if (title.includes(key) || key.includes(title)) {
      return imgPath;
    }
  }

  // Fallback by category
  return getDeviceFallback(cat);
}
