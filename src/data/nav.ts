export interface NavLink {
  label: string;
  labelKey: string;
  href: string;
}

export const NAV_LINKS: NavLink[] = [
  { label: "Home", labelKey: "nav.home", href: "/" },
  { label: "Products", labelKey: "nav.products", href: "/products" },
  { label: "About", labelKey: "nav.about", href: "/about" },
  { label: "Contact", labelKey: "nav.contact", href: "/contact" },
];

export const CATEGORIES = [
  { id: "audio", name: "Audio", nameKey: "categories.audio", slug: "audio", description: "Headphones, earbuds, speakers", icon: "Headphones" },
  { id: "wearables", name: "Wearables", nameKey: "categories.wearables", slug: "wearables", description: "Watches, rings, trackers", icon: "Watch" },
  { id: "computing", name: "Computing", nameKey: "categories.computing", slug: "computing", description: "Keyboards, mice, hubs", icon: "Keyboard" },
  { id: "power", name: "Power", nameKey: "categories.power", slug: "power", description: "Chargers, banks, cables", icon: "BatteryCharging" },
] as const;