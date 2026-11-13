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

export function getDeviceImage(device) {
  if (!device) return "/products/fallback-mobile.png";

  const img = device.images?.[0] || device.image;
  // If a valid product photo exists (and is not the brand logo)
  if (img && typeof img === "string" && !img.includes("logo.png") && !img.includes("device-placeholder") && !img.includes("placehold.co")) {
    // If it's the legacy phone.png, verify whether it's the old logo or new phone
    if (!img.endsWith("/phone.png") && img !== "phone.png") {
      return img;
    }
  }

  // Model-level matching for known catalog devices
  const title = String(device.title || device.name || device.model || "").toLowerCase();
  const brand = String(device.brand || "").toLowerCase();
  const cat = String(device.category || "").toLowerCase();

  // iPhones
  if (title.includes("iphone 15 pro") || title.includes("15 pro max") || title.includes("15 pro")) {
    return "/products/iphone-15-pro-max.png";
  }
  if (title.includes("iphone 13") || (brand.includes("apple") && title.includes("13"))) {
    return "/products/iphone-13.png";
  }
  if (brand.includes("apple") && (title.includes("iphone") || cat === "mobile")) {
    return "/products/iphone-15-pro-max.png";
  }

  // Samsung
  if (title.includes("s24 ultra") || title.includes("galaxy s24") || (brand.includes("samsung") && title.includes("ultra"))) {
    return "/products/samsung-s24-ultra.png";
  }
  if (brand.includes("samsung") && cat === "mobile") {
    return "/products/samsung-s24-ultra.png";
  }

  // OnePlus
  if (title.includes("oneplus 12") || (brand.includes("oneplus") && title.includes("12"))) {
    return "/products/oneplus-12.png";
  }
  if (brand.includes("oneplus") && cat === "mobile") {
    return "/products/oneplus-12.png";
  }

  // Laptops
  if (title.includes("macbook") || (brand.includes("apple") && cat === "laptop")) {
    return "/products/macbook-air-m2.png";
  }
  if (title.includes("xps") || title.includes("dell") || (brand.includes("dell") && cat === "laptop")) {
    return "/products/dell-xps-15.png";
  }

  // Smartwatches
  if (title.includes("watch") || cat === "smartwatch") {
    return "/products/apple-watch-ultra-2.png";
  }

  // Tablets
  if (title.includes("ipad") || title.includes("tab") || cat === "tablet") {
    return "/products/ipad-air-m2.png";
  }

  // Headphones
  if (title.includes("sony") || title.includes("wh-1000") || title.includes("headphone") || cat === "audio") {
    return "/products/sony-wh1000xm5.png";
  }

  // Fallback by category
  return getDeviceFallback(cat);
}
