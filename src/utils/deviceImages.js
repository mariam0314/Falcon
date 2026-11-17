/**
 * deviceImages.js
 * Centralized, reliable resolution for real electronic device photographs.
 * Ensures the FALCON logo or generic placeholders are NEVER displayed as product photos.
 */

export function getDeviceFallback(category = "mobile") {
  const cat = String(category).toLowerCase();
  if (cat.includes("laptop")) return "/products/fallback-laptop.png";
  if (cat.includes("smartwatch") || cat.includes("watch")) return "/products/fallback-smartwatch.png";
  if (cat.includes("tablet") || cat.includes("ipad")) return "/products/fallback-tablet.png";
  if (cat.includes("audio") || cat.includes("headphone") || cat.includes("earphone")) return "/products/fallback-audio.png";
  return "/products/fallback-mobile.png";
}

// Normalized lookup map for verified product image names
const EXACT_MODEL_MAP = {
  // Apple Mobiles
  "iphone 17 pro max": "/products/iphone-17-pro-max.png",
  "iphone 17 pro": "/products/iphone-17-pro.png",
  "iphone 17": "/products/iphone-17.png",
  "iphone 16 pro max": "/products/iphone-16-pro-max.png",
  "iphone 16 pro": "/products/iphone-16-pro.png",
  "iphone 16": "/products/iphone-16.png",
  "iphone 15 pro max": "/products/iphone-15-pro-max.png",
  "iphone 15": "/products/iphone-15.png",
  "iphone 14": "/products/iphone-14.png",
  "iphone 13": "/products/iphone-13.png",

  // Samsung Mobiles
  "galaxy s25 ultra": "/products/galaxy-s25-ultra.png",
  "galaxy s25+": "/products/galaxy-s25-plus.png",
  "galaxy s25 plus": "/products/galaxy-s25-plus.png",
  "galaxy s25": "/products/galaxy-s25.png",
  "galaxy s24 ultra": "/products/galaxy-s24-ultra.png",
  "galaxy z fold": "/products/galaxy-z-fold.png",
  "galaxy z flip": "/products/galaxy-z-flip.png",
  "galaxy a56": "/products/galaxy-a56.png",
  "galaxy a36": "/products/galaxy-a36.png",

  // OnePlus Mobiles
  "oneplus 13": "/products/oneplus-13.png",
  "oneplus 13r": "/products/oneplus-13r.png",
  "oneplus 12": "/products/oneplus-12.png",
  "oneplus nord 5": "/products/oneplus-nord-5.png",
  "oneplus nord ce": "/products/oneplus-nord-ce.png",

  // Google Mobiles
  "pixel 10 pro xl": "/products/pixel-10-pro-xl.png",
  "pixel 10 pro": "/products/pixel-10-pro.png",
  "pixel 9 pro": "/products/pixel-9-pro.png",
  "pixel 9a": "/products/pixel-9a.png",

  // Other Brand Mobiles
  "xiaomi 15 ultra": "/products/xiaomi-15-ultra.png",
  "redmi note 14 pro+": "/products/redmi-note-14-pro-plus.png",
  "redmi note 14 pro plus": "/products/redmi-note-14-pro-plus.png",
  "poco x7 pro": "/products/poco-x7-pro.png",
  "nothing phone (3)": "/products/nothing-phone-3.png",
  "nothing phone 3": "/products/nothing-phone-3.png",
  "nothing phone (3a)": "/products/nothing-phone-3a.png",
  "nothing phone 3a": "/products/nothing-phone-3a.png",
  "vivo x200 pro": "/products/vivo-x200-pro.png",
  "vivo v50": "/products/vivo-v50.png",
  "oppo find x8 pro": "/products/oppo-find-x8-pro.png",
  "oppo reno 13 pro": "/products/oppo-reno-13-pro.png",
  "realme gt 7 pro": "/products/realme-gt-7-pro.png",
  "motorola edge 60 pro": "/products/motorola-edge-60-pro.png",

  // Apple Laptops
  "macbook air m4 13-inch": "/products/macbook-air-m4-13.png",
  "macbook air m4 13": "/products/macbook-air-m4-13.png",
  "macbook air m4 15-inch": "/products/macbook-air-m4-15.png",
  "macbook air m4 15": "/products/macbook-air-m4-15.png",
  "macbook pro m4 14-inch": "/products/macbook-pro-m4-14.png",
  "macbook pro m4 14": "/products/macbook-pro-m4-14.png",
  "macbook pro m4 pro": "/products/macbook-pro-m4-pro.png",
  "macbook pro m4 max": "/products/macbook-pro-m4-max.png",

  // HP Laptops
  "hp pavilion 15": "/products/hp-pavilion-15.png",
  "hp pavilion plus": "/products/hp-pavilion-plus.png",
  "hp envy x360": "/products/hp-envy-x360.png",
  "hp spectre x360": "/products/hp-spectre-x360.png",
  "hp victus": "/products/hp-victus.png",
  "hp omen": "/products/hp-omen.png",

  // Dell Laptops
  "dell inspiron 15": "/products/dell-inspiron-15.png",
  "dell inspiron 14": "/products/dell-inspiron-14.png",
  "dell xps 13": "/products/dell-xps-13.png",
  "dell xps 15": "/products/dell-xps-15.png",
  "dell g15": "/products/dell-g15.png",

  // Lenovo Laptops
  "lenovo ideapad slim 5": "/products/lenovo-ideapad-slim-5.png",
  "lenovo yoga 7": "/products/lenovo-yoga-7.png",
  "lenovo thinkpad e14": "/products/lenovo-thinkpad-e14.png",
  "lenovo legion 5": "/products/lenovo-legion-5.png",
  "lenovo loq": "/products/lenovo-loq.png",

  // ASUS Laptops
  "asus vivobook 15": "/products/asus-vivobook-15.png",
  "asus vivobook s 14": "/products/asus-vivobook-s14.png",
  "asus zenbook 14": "/products/asus-zenbook-14.png",
  "asus rog strix g16": "/products/asus-rog-strix-g16.png",
  "asus tuf gaming a15": "/products/asus-tuf-gaming-a15.png",

  // Acer & MSI Laptops
  "acer aspire 7": "/products/acer-aspire-7.png",
  "acer swift go 14": "/products/acer-swift-go-14.png",
  "acer nitro v 15": "/products/acer-nitro-v15.png",
  "acer predator helios neo": "/products/acer-predator-helios-neo.png",
  "msi thin 15": "/products/msi-thin-15.png",
  "msi katana 15": "/products/msi-katana-15.png",

  // Tablets
  "ipad pro m4": "/products/ipad-pro-m4.png",
  "ipad pro": "/products/ipad-pro-m4.png",
  "ipad air m2": "/products/ipad-air-m2.png",
  "ipad air": "/products/ipad-air-m2.png",
  "ipad 10th gen": "/products/ipad-10th-gen.png",
  "ipad (10th gen)": "/products/ipad-10th-gen.png",
  "galaxy tab s9 ultra": "/products/galaxy-tab-s9-ultra.png",
  "galaxy tab s9": "/products/galaxy-tab-s9-ultra.png",
  "galaxy tab s10+": "/products/galaxy-tab-s10-plus.png",
  "galaxy tab s10 plus": "/products/galaxy-tab-s10-plus.png",
  "galaxy tab": "/products/galaxy-tab-s9-ultra.png",
  "lenovo tab p12": "/products/lenovo-tab-p12.png",
  "lenovo tab": "/products/lenovo-tab-p12.png",
  "xiaomi pad 6": "/products/xiaomi-pad-6.png",
  "xiaomi pad 7": "/products/xiaomi-pad-6.png",
  "xiaomi pad": "/products/xiaomi-pad-6.png",

  // Smartwatches
  "apple watch ultra 2": "/products/apple-watch-ultra-2.png",
  "apple watch ultra": "/products/apple-watch-ultra-2.png",
  "apple watch series 10": "/products/apple-watch-series-10.png",
  "apple watch series 9": "/products/apple-watch-series-9.png",
  "apple watch": "/products/apple-watch-series-10.png",
  "galaxy watch 7": "/products/galaxy-watch-7.png",
  "galaxy watch ultra": "/products/galaxy-watch-ultra.png",
  "galaxy watch": "/products/galaxy-watch-7.png",
  "pixel watch 3": "/products/pixel-watch-3.png",
  "pixel watch 2": "/products/pixel-watch-3.png",
  "pixel watch": "/products/pixel-watch-3.png",
  "garmin forerunner 265": "/products/garmin-forerunner-265.png",
  "garmin": "/products/garmin-forerunner-265.png",
  "amazfit balance": "/products/amazfit-balance.png",
  "amazfit": "/products/amazfit-balance.png",
  "noise colorfit pro 5": "/products/noise-colorfit-pro-5.png",
  "noise colorfit": "/products/noise-colorfit-pro-5.png",
  "noise": "/products/noise-colorfit-pro-5.png",
};

export function getDeviceImage(device) {
  if (!device) return "/products/fallback-mobile.png";

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
