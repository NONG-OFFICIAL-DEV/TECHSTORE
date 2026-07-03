export interface NavLink {
  label: string;
  href: string;
}

export const NAV_LINKS: NavLink[] = [
  { label: "Home", href: "/" },
  { label: "Products", href: "/products" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
];

export const CATEGORIES = [
  { id: "audio", name: "Audio", slug: "audio", description: "Headphones, earbuds, speakers", icon: "Headphones" },
  { id: "wearables", name: "Wearables", slug: "wearables", description: "Watches, rings, trackers", icon: "Watch" },
  { id: "computing", name: "Computing", slug: "computing", description: "Keyboards, mice, hubs", icon: "Keyboard" },
  { id: "power", name: "Power", slug: "power", description: "Chargers, banks, cables", icon: "BatteryCharging" },
] as const;