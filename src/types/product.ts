export interface Product {
  id: string;
  slug: string;
  name: string;
  brand: string;
  category: string;
  price: number;
  compareAtPrice?: number;
  currency: string;
  rating: number;
  reviewCount: number;
  images: string[];
  thumbnail: string;
  description: string;
  shortDescription: string;
  specs: Record<string, string>;
  features: string[];
  colors?: { name: string; hex: string }[];
  inStock: boolean;
  stockCount?: number;
  isNew?: boolean;
  isFeatured?: boolean;
  discountPercent?: number;
  tags: string[];
}

export interface Category {
  id: string;
  slug: string;
  name: string;
  nameKey: string;
  description: string;
  icon: string;
  productCount: number;
  image: string;
}

export type SortOption =
  | "featured"
  | "price-asc"
  | "price-desc"
  | "newest"
  | "rating";

export interface ProductFilters {
  category?: string;
  search?: string;
  sort?: SortOption;
  page?: number;
  minPrice?: number;
  maxPrice?: number;
}