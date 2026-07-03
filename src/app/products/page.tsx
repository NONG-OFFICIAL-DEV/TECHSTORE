"use client";

import { useState, useMemo } from "react";
import { useSearchParams } from "next/navigation";
import { products, categories } from "@/data/products";
import { SortOption } from "@/types/product";
import { ProductGrid } from "@/components/product/product-grid";
import { SearchBar } from "@/components/product/search-bar";
import { CategoryFilter } from "@/components/product/category-filter";
import { SortDropdown } from "@/components/product/sort-dropdown";
import { Pagination } from "@/components/shared/pagination";
import { Breadcrumb } from "@/components/shared/breadcrumb";

const PAGE_SIZE = 8;

export default function ProductsPage() {
  const searchParams = useSearchParams();
  const initialCategory = searchParams.get("category") ?? undefined;

  const [search, setSearch] = useState("");
  const [category, setCategory] = useState<string | undefined>(
    initialCategory
  );
  const [sort, setSort] = useState<SortOption>("featured");
  const [page, setPage] = useState(1);

  const filtered = useMemo(() => {
    let result = [...products];

    if (category) {
      result = result.filter((p) => p.category === category);
    }

    if (search.trim()) {
      const query = search.toLowerCase();
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(query) ||
          p.brand.toLowerCase().includes(query) ||
          p.tags.some((tag) => tag.toLowerCase().includes(query))
      );
    }

    switch (sort) {
      case "price-asc":
        result.sort((a, b) => a.price - b.price);
        break;
      case "price-desc":
        result.sort((a, b) => b.price - a.price);
        break;
      case "rating":
        result.sort((a, b) => b.rating - a.rating);
        break;
      case "newest":
        result.sort((a, b) => Number(b.isNew) - Number(a.isNew));
        break;
      default:
        result.sort((a, b) => Number(b.isFeatured) - Number(a.isFeatured));
    }

    return result;
  }, [search, category, sort]);

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const paginated = filtered.slice(
    (page - 1) * PAGE_SIZE,
    page * PAGE_SIZE
  );

  const handleFilterChange = (fn: () => void) => {
    fn();
    setPage(1);
  };

  const handleClearFilters = () => {
    setSearch("");
    setCategory(undefined);
    setPage(1);
  };

  return (
    <div className="mx-auto max-w-7xl px-6 md:px-8 py-10">
      <Breadcrumb items={[{ label: "Products" }]} className="mb-8" />

      <div className="mb-8">
        <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-foreground">
          All Products
        </h1>
        <p className="mt-2 text-muted-foreground">
          {filtered.length} product{filtered.length !== 1 ? "s" : ""} found
        </p>
      </div>

      <CategoryFilter
        categories={categories}
        selected={category}
        onSelect={(value) => handleFilterChange(() => setCategory(value))}
        className="mb-6"
      />

      <div className="flex flex-col sm:flex-row gap-3 mb-8">
        <SearchBar
          value={search}
          onChange={(value) => handleFilterChange(() => setSearch(value))}
          className="flex-1"
        />
        <SortDropdown value={sort} onChange={setSort} />
      </div>

      <ProductGrid
        products={paginated}
        onClearFilters={
          search || category ? handleClearFilters : undefined
        }
      />

      {totalPages > 1 && (
        <Pagination
          currentPage={page}
          totalPages={totalPages}
          onPageChange={setPage}
          className="mt-12"
        />
      )}
    </div>
  );
}