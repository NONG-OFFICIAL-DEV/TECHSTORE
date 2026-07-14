"use client";

import { useState, useMemo } from "react";
import { useSearchParams } from "next/navigation";
import { products } from "@/data/products";
import { Category, SortOption } from "@/types/product";
import { ProductGrid } from "@/components/product/product-grid";
import { SearchBar } from "@/components/product/search-bar";
import { CategoryFilter } from "@/components/product/category-filter";
import { SortDropdown } from "@/components/product/sort-dropdown";
import { Pagination } from "@/components/shared/pagination";
import { Breadcrumb } from "@/components/shared/breadcrumb";
import { SectionHeading } from "@/components/shared/section-heading";
import { useLanguage } from "@/providers/language-provider";

const PAGE_SIZE = 8;

export function ProductsContent({ categories }: { categories: Category[] }) {
  const { t } = useLanguage();
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

  // A narrower filter/sort/page result can leave the user scrolled past
  // where the (now much shorter) list actually renders — bring them back
  // to the top so the new results are what they actually see.
  const scrollToResults = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleFilterChange = (fn: () => void) => {
    fn();
    setPage(1);
    scrollToResults();
  };

  const handleSortChange = (value: SortOption) => {
    setSort(value);
    setPage(1);
    scrollToResults();
  };

  const handlePageChange = (nextPage: number) => {
    setPage(nextPage);
    scrollToResults();
  };

  const handleClearFilters = () => {
    setSearch("");
    setCategory(undefined);
    setPage(1);
    scrollToResults();
  };

  return (
    <div className="mx-auto max-w-7xl px-6 md:px-8 py-5">
      <Breadcrumb items={[{ label: t("nav.products") }]} className="mb-8" />
      <SectionHeading
        title={t("products.title")}
        description={t(
          filtered.length === 1 ? "products.countFoundOne" : "products.countFoundOther",
          { count: filtered.length }
        )}
      />

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
        <SortDropdown value={sort} onChange={handleSortChange} />
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
          onPageChange={handlePageChange}
          className="mt-12"
        />
      )}
    </div>
  );
}
