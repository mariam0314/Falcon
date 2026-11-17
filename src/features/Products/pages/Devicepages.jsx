import Filter from "../components/Filter";
import { useSearchParams } from "react-router-dom";

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

const RELEASE_YEAR_FILTER = {
  key:     "releaseYear",
  label:   "Release Year",
  type:    "checkbox",
  options: ["2026", "2025", "2024", "2023", "2022", "2021"],
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
  RELEASE_YEAR_FILTER,
  {
    key:     "brand",
    label:   "Brand",
    type:    "checkbox",
    options: [
      "Apple", "Samsung", "OnePlus", "Google", "Xiaomi", "Redmi", "POCO",
      "Vivo", "iQOO", "Oppo", "Realme", "Motorola", "Nothing",
      "Sony", "Asus", "Honor", "Huawei", "Tecno", "Infinix", "Lava"
    ],
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
  RELEASE_YEAR_FILTER,
  {
    key:     "brand",
    label:   "Brand",
    type:    "checkbox",
    options: [
      "Apple", "HP", "Dell", "Lenovo", "Asus", "Acer", "MSI",
      "Microsoft", "Samsung", "LG", "Razer", "Gigabyte", "Framework", "Huawei", "Honor"
    ],
  },
  {
    key:     "specs.laptopType",
    label:   "Laptop Type",
    type:    "pill",
    options: ["Ultrabook", "Gaming", "Everyday", "2-in-1 Convertible", "Business", "Creator"],
  },
  {
    key:     "specs.processor",
    label:   "Processor",
    type:    "checkbox",
    options: [
      "Apple M4", "Apple M3", "Apple M2", "Apple M1",
      "Intel Core Ultra 9", "Intel Core Ultra 7", "Intel Core i9", "Intel Core i7", "Intel Core i5",
      "AMD Ryzen 9", "AMD Ryzen 7", "AMD Ryzen 5", "Snapdragon X Elite"
    ],
  },
  {
    key:     "specs.ram",
    label:   "RAM",
    type:    "pill",
    options: ["8 GB", "16 GB", "24 GB", "32 GB", "36 GB", "64 GB"],
  },
  {
    key:     "storage",
    label:   "Storage",
    type:    "pill",
    options: ["256GB", "512GB", "1TB", "2TB"],
  },
  {
    key:     "specs.graphics",
    label:   "Graphics",
    type:    "checkbox",
    options: [
      "Apple Integrated", "Intel Iris Xe", "Intel Arc Graphics", "AMD Radeon Graphics",
      "NVIDIA RTX 4090", "NVIDIA RTX 4080", "NVIDIA RTX 4070", "NVIDIA RTX 4060",
      "NVIDIA RTX 4050", "NVIDIA RTX 3060", "NVIDIA RTX 3050", "NVIDIA RTX 2050"
    ],
  },
  {
    key:     "specs.display",
    label:   "Display Size",
    type:    "pill",
    options: ["13.3", "13.4", "13.6", "14.0", "14.2", "15.3", "15.6", "16.0", "16.1", "16.2", "17.3", "18.0"],        
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
  RELEASE_YEAR_FILTER,
  {
    key:     "brand",
    label:   "Brand",
    type:    "checkbox",
    options: ["Apple", "Samsung", "Lenovo", "Xiaomi", "Redmi", "OnePlus", "OPPO", "Google", "Microsoft", "Realme", "Honor", "Huawei", "Amazon"],
  },
  {
    key:     "specs.ram",
    label:   "RAM",
    type:    "pill",
    options: ["4 GB", "6 GB", "8 GB", "12 GB", "16 GB"],
  },
  {
    key:     "specs.display",
    label:   "Screen Size",
    type:    "pill",
    options: ["8.3", "8.7", "10.2", "10.6", "10.9", "11.0", "12.1", "12.4", "12.7", "13.0", "14.6"],
  },
  {
    key:     "specs.dispType",
    label:   "Display Type",
    type:    "pill",
    options: ["Tandem OLED", "Dynamic AMOLED 2X", "Liquid Retina", "OLED", "IPS LCD", "2.8K LCD", "3K LTPS"],
  },
  {
    key:     "storage",
    label:   "Storage",
    type:    "pill",
    options: ["64GB", "128GB", "256GB", "512GB", "1TB", "2TB"],
  },
  {
    key:     "specs.battery",
    label:   "Battery",
    type:    "checkbox",
    options: ["5000 mAh", "7000 mAh", "8000 mAh", "10000 mAh", "11200 mAh"],
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
  RELEASE_YEAR_FILTER,
  {
    key:     "brand",
    label:   "Brand",
    type:    "checkbox",
    options: [
      "Apple", "Samsung", "Google", "Garmin", "Amazfit", "OnePlus", "Huawei",
      "Fitbit", "Noise", "boAt", "Fire-Boltt", "Fastrack", "Titan", "Suunto", "Polar", "Withings"
    ],
  },
  {
    key:     "specs.dispType",
    label:   "Display Type",
    type:    "pill",
    options: ["AMOLED", "Always-On Retina OLED", "Super AMOLED", "MIP Transflective", "HD LCD"],
  },
  {
    key:     "specs.display",
    label:   "Case / Screen Size",
    type:    "pill",
    options: ["40mm", "41mm", "42mm", "44mm", "45mm", "46mm", "47mm", "49mm"],
  },
  {
    key:     "specs.battery",
    label:   "Battery Life",
    type:    "checkbox",
    options: ["1-2 Days", "3-5 Days", "7 Days", "14 Days", "30+ Days"],
  },
  {
    key:     "color",
    label:   "Color / Case Finish",
    type:    "pill",
    options: ["Black", "Titanium", "Silver", "Midnight", "Starlight", "Rose Gold", "Green", "Blue"],
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


// ─── GENERAL / ALL REFURBISHED ────────────────────────────────────────────────
const allRefurbishedFilterConfig = [
  DEVICE_TYPE_FILTER,
  CONDITION_FILTER,
  RELEASE_YEAR_FILTER,
  {
    key: "brand",
    label: "Brand",
    type: "checkbox",
    options: [
      "Apple",
      "Samsung",
      "OnePlus",
      "Google",
      "Dell",
      "HP",
      "Lenovo",
      "Asus",
      "Acer",
      "MSI",
      "Xiaomi",
      "Garmin",
      "Noise",
      "boAt",
      "Sony",
    ],
  },
  {
    key: "storage",
    label: "Storage",
    type: "pill",
    options: ["128GB", "256GB", "512GB", "1TB"],
  },
  {
    key: "specs.ram",
    label: "RAM",
    type: "pill",
    options: ["6 GB", "8 GB", "16 GB", "32 GB"],
  },
  AVAILABILITY_FILTER,
];

export function getFilterConfigForCategory(category) {
  switch (category?.toLowerCase()) {
    case "mobile":
      return phonesFilterConfig;
    case "laptop":
      return laptopsFilterConfig;
    case "tablet":
      return tabletsFilterConfig;
    case "smartwatch":
      return smartwatchFilterConfig;
    default:
      return allRefurbishedFilterConfig;
  }
}

export function RefurbishedPage() {
  const [searchParams] = useSearchParams();
  const currentCategory = searchParams.get("category")?.toLowerCase() || "all";
  const filterConfig = getFilterConfigForCategory(currentCategory);

  const getTitle = () => {
    switch (currentCategory) {
      case "mobile":
        return "Refurbished Mobile Phones";
      case "laptop":
        return "Refurbished Laptops";
      case "tablet":
        return "Refurbished Tablets";
      case "smartwatch":
        return "Refurbished Smartwatches";
      default:
        return "Refurbished Devices";
    }
  };

  return (
    <Filter
      data={{
        pageTitle: getTitle(),
        filterConfig,
      }}
      showCategoryTabs={true}
    />
  );
}

export function ProductsPage() {
  const [searchParams] = useSearchParams();
  const deviceType = searchParams.get("deviceType")?.toLowerCase();
  const currentCategory = searchParams.get("category")?.toLowerCase() || "all";
  const filterConfig = getFilterConfigForCategory(currentCategory);

  if (deviceType === "refurbished") {
    return <RefurbishedPage />;
  }

  const getTitle = () => {
    const prefix = deviceType ? `${deviceType.charAt(0).toUpperCase() + deviceType.slice(1)} ` : "";
    switch (currentCategory) {
      case "mobile":
        return `${prefix}Mobile Phones`;
      case "laptop":
        return `${prefix}Laptops`;
      case "tablet":
        return `${prefix}Tablets`;
      case "smartwatch":
        return `${prefix}Smartwatches`;
      default:
        return `${prefix}Devices`;
    }
  };

  return (
    <Filter
      data={{
        pageTitle: getTitle(),
        filterConfig,
      }}
      showCategoryTabs={true}
    />
  );
}
