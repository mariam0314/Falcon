import Filter from "../components/Filter";

const DEVICE_TYPE_FILTER = {
  key:     "deviceType",
  label:   "Device Type",
  type:    "pill",
  options: ["New", "Refurbished", "Old"],       
};

const CONDITION_FILTER = {
  key:     "condition",
  label:   "Condition",
  type:    "pill",
  options: ["Fair", "Good", "Superb"],         
};

const AVAILABILITY_FILTER = {
  key:     "availability",
  label:   "Availability",
  type:    "checkbox",
  options: ["In Stock", "Out of Stock"],         
};

// PHONES
const phonesFilterConfig = [
  DEVICE_TYPE_FILTER,
  CONDITION_FILTER,
  {
    key:     "brand",
    label:   "Brand",
    type:    "checkbox",
    options: ["Apple", "Samsung", "OnePlus", "Google", "Xiaomi", "POCO", "Nothing", "Vivo", "Oppo", "Realme", "Motorola"],
  },
  {
    key:     "specs.os",
    label:   "Operating System",
    type:    "pill",
    options: ["iOS", "Android"],
  },
  {
    key:     "specs.ram",
    label:   "RAM",
    type:    "pill",
    options: ["6 GB", "8 GB", "12 GB", "16 GB"],  
  },
  {
    key:     "storage",
    label:   "Storage",
    type:    "pill",
    options: ["128GB", "256GB", "512GB", "1TB"],
  },
  {
    key:     "specs.camera",
    label:   "Rear Camera",
    type:    "pill",
    options: ["12 MP", "48 MP", "50 MP", "64 MP", "200 MP"],
  },
  {
    key:     "specs.battery",
    label:   "Battery",
    type:    "checkbox",
    options: ["3000 mAh", "4000 mAh", "5000 mAh", "6000 mAh"],
  },
  {
    key:     "specs.refresh",
    label:   "Refresh Rate",
    type:    "pill",
    options: ["60 Hz", "120 Hz", "144 Hz"],
  },
  AVAILABILITY_FILTER,
];

export function PhonesPage() {
  return (
    <Filter
      data={{ filterConfig: phonesFilterConfig }}
      category="mobile"
    />
  );
}

// LAPTOPS
const laptopsFilterConfig = [
  DEVICE_TYPE_FILTER,
  CONDITION_FILTER,
  {
    key:     "brand",
    label:   "Brand",
    type:    "checkbox",
    options: ["Apple", "HP", "Dell", "Lenovo", "Asus", "Acer", "MSI"],
  },
  {
    key:     "specs.laptopType",
    label:   "Laptop Type",
    type:    "pill",
    options: ["Ultrabook", "Gaming", "Everyday", "2-in-1 Convertible", "Business"],
  },
  {
    key:     "specs.processor",
    label:   "Processor",
    type:    "checkbox",
    options: ["Apple M4", "Intel Core i5", "Intel Core i7", "Intel Core Ultra 7", "AMD Ryzen 5", "AMD Ryzen 7"],
  },
  {
    key:     "specs.ram",
    label:   "RAM",
    type:    "pill",
    options: ["8 GB", "16 GB", "24 GB", "32 GB", "36 GB"],
  },
  {
    key:     "storage",
    label:   "Storage",
    type:    "pill",
    options: ["512GB", "1TB"],
  },
  {
    key:     "specs.graphics",
    label:   "Graphics",
    type:    "checkbox",
    options: ["Apple Integrated", "Intel Iris Xe", "Intel Arc Graphics", "AMD Radeon Graphics", "NVIDIA RTX 2050", "NVIDIA RTX 3050", "NVIDIA RTX 4050", "NVIDIA RTX 4060"],
  },
  {
    key:     "specs.display",
    label:   "Display Size",
    type:    "pill",
    options: ["13.4", "13.6", "14.0", "14.2", "15.3", "15.6", "16.0", "16.1", "16.2"],        
  },
  AVAILABILITY_FILTER,
];

export function LaptopsPage() {
  return (
    <Filter
      data={{ filterConfig: laptopsFilterConfig }}
      category="laptop"
    />
  );
}

// TABLETS
const tabletsFilterConfig = [
  DEVICE_TYPE_FILTER,
  CONDITION_FILTER,
  {
    key:     "brand",
    label:   "Brand",
    type:    "checkbox",
    options: ["Apple", "Samsung", "Lenovo", "Xiaomi", "Realme", "OnePlus", "Honor"],
  },
  {
    key:     "specs.ram",
    label:   "RAM",
    type:    "pill",
    options: ["4 GB", "6 GB", "8 GB", "12 GB"],
  },
  {
    key:     "specs.display",
    label:   "Screen Size",
    type:    "pill",
    options: ["8", "10", "10.9", "11", "12.4", "12.9"],
  },
  {
    key:     "specs.dispType",
    label:   "Display Type",
    type:    "pill",
    options: ["LCD", "AMOLED", "IPS", "OLED", "Retina"],
  },
  {
    key:     "storage",
    label:   "Storage",
    type:    "pill",
    options: ["64GB", "128GB", "256GB", "512GB"],
  },
  {
    key:     "specs.battery",
    label:   "Battery",
    type:    "checkbox",
    options: ["5000 mAh", "7000 mAh", "8000 mAh", "10000 mAh", "11000 mAh"],
  },
  AVAILABILITY_FILTER,
];

export function TabletsPage() {
  return (
    <Filter
      data={{ filterConfig: tabletsFilterConfig }}
      category="tablet"
    />
  );
}

// SMARTWATCHES
const smartwatchFilterConfig = [
  DEVICE_TYPE_FILTER,
  CONDITION_FILTER,
  {
    key:     "brand",
    label:   "Brand",
    type:    "checkbox",
    options: ["Apple", "Samsung", "Noise", "Boat", "Fire-Boltt", "Garmin", "Fitbit", "Amazfit", "OnePlus"],
  },
  {
    key:     "specs.dispType",
    label:   "Display Type",
    type:    "pill",
    options: ["AMOLED", "LCD", "OLED", "MIP", "E-Ink"],
  },
  {
    key:     "specs.display",
    label:   "Screen Size",
    type:    "pill",
    options: ["1.2", "1.4", "1.6", "1.8", "2.0"],         // inches
  },
  {
    key:     "specs.battery",
    label:   "Battery Life",
    type:    "checkbox",
    options: ["1 Day", "2 Days", "5 Days", "7 Days", "14 Days", "30+ Days"],
  },
  {
    key:     "color",
    label:   "Color / Strap",
    type:    "pill",
    options: ["Black", "White", "Silver", "Rose Gold", "Blue", "Green", "Red"],
  },
  AVAILABILITY_FILTER,
];

export function SmartwatchPage() {
  return (
    <Filter
      data={{ filterConfig: smartwatchFilterConfig }}
      category="smartwatch"
    />
  );
}


// TELEVISIONS
const tvFilterConfig = [
  DEVICE_TYPE_FILTER,
  CONDITION_FILTER,
  {
    key:     "brand",
    label:   "Brand",
    type:    "checkbox",
    options: ["Sony", "Samsung", "LG", "Xiaomi", "OnePlus", "TCL", "Hisense", "Vu", "iFFALCON"],
  },
  {
    key:     "specs.display",
    label:   "Screen Size (inches)",
    type:    "pill",
    options: ["32", "40", "43", "50", "55", "65", "75", "85"],
  },
  {
    key:     "specs.dispType",
    label:   "Panel Type",
    type:    "pill",
    options: ["LED", "QLED", "OLED", "QNED", "Mini-LED", "Neo QLED"],
  },
  {
    key:     "specs.resolution",
    label:   "Resolution",
    type:    "pill",
    options: ["HD", "Full HD", "4K UHD", "8K UHD"],          
  },
  {
    key:     "specs.refresh",
    label:   "Refresh Rate",
    type:    "pill",
    options: ["60 Hz", "120 Hz", "144 Hz"],
  },
  AVAILABILITY_FILTER,
];

export function TVPage() {
  return (
    <Filter
      data={{ filterConfig: tvFilterConfig }}
      // ⚠️ "tv" not in schema enum yet — use "other" until you add it
      category="television"
    />
  );
}