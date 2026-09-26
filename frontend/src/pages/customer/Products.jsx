import { useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Select, Pagination, Checkbox, Drawer, Skeleton } from "antd";
import { FaSearch, FaSlidersH, FaFilter } from "react-icons/fa";
import { categories } from "../../components/customer/data/categories.js";
import ProductCard from "../../components/customer/common/ProductCard.jsx";
import EmptyState from "../../components/farmer/common/EmptyState.jsx";
import useCustomerProducts from "../../hooks/useCustomerProducts.js";
import useWishlistStore from "../../hooks/useWishlistStore.js";

const PER_PAGE = 12;

const sortOptions = [
  { value: "recommended", label: "Recommended" },
  { value: "price-asc", label: "Price: Low to High" },
  { value: "price-desc", label: "Price: High to Low" },
  { value: "rating", label: "Top Rated" },
  { value: "newest", label: "Newest First" },
];

const priceOptions = [
  { value: "", label: "All Prices" },
  { value: "500", label: "Under Rs 500" },
  { value: "1000", label: "Under Rs 1,000" },
  { value: "2000", label: "Under Rs 2,000" },
];

const Products = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { products, loading, error, reload } = useCustomerProducts();
  const wishlist = useWishlistStore();
  const wishlistIds = useMemo(
    () => new Set(wishlist.items.map((product) => product.id)),
    [wishlist.items]
  );

  const [search, setSearch] = useState(searchParams.get("q") || "");
  const [selectedCategory, setSelectedCategory] = useState(
    searchParams.get("category") || ""
  );
  const [excludeUnavailable, setExcludeUnavailable] = useState(true);
  const [maxPrice, setMaxPrice] = useState("");
  const [sort, setSort] = useState("recommended");
  const [page, setPage] = useState(1);
  const [filtersOpen, setFiltersOpen] = useState(false);

  const applyUrlParams = () => {
    const next = new URLSearchParams(searchParams);
    if (search.trim()) {
      next.set("q", search.trim());
    } else {
      next.delete("q");
    }
    setSearchParams(next);
    setPage(1);
  };

  const handleReset = () => {
    setSearch("");
    setSelectedCategory("");
    setExcludeUnavailable(true);
    setMaxPrice("");
    setSort("recommended");
    setPage(1);
    setSearchParams(new URLSearchParams());
  };

  const filtered = useMemo(() => {
    let list = [...products];
    const term = search.trim().toLowerCase();
    const categoryFilter = selectedCategory;
    const priceCap = Number(maxPrice);

    if (term) {
      list = list.filter(
        (product) =>
          product.name.toLowerCase().includes(term) ||
          product.farmer?.name?.toLowerCase().includes(term) ||
          product.tags?.some((tag) => tag.toLowerCase().includes(term))
      );
    }

    if (categoryFilter) {
      list = list.filter(
        (product) => product.category === categoryFilter
      );
    }

    if (excludeUnavailable) {
      list = list.filter(
        (product) =>
          product.availability === "available" && product.stock > 0
      );
    }

    if (priceCap) {
      list = list.filter((product) => product.price <= priceCap);
    }

    switch (sort) {
      case "price-asc":
        list.sort((a, b) => a.price - b.price);
        break;
      case "price-desc":
        list.sort((a, b) => b.price - a.price);
        break;
      case "rating":
        list.sort((a, b) => b.rating - a.rating || b.reviews - a.reviews);
        break;
      case "newest":
        list.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        break;
      default:
        list.sort((a, b) => Number(b.featured) - Number(a.featured));
    }

    return list;
  }, [products, search, selectedCategory, excludeUnavailable, maxPrice, sort]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PER_PAGE));
  const safePage = Math.min(page, totalPages);
  const pageProducts = filtered.slice(
    (safePage - 1) * PER_PAGE,
    safePage * PER_PAGE
  );

  const handleCategoryChange = (value) => {
    setSelectedCategory(value);
    setPage(1);
  };

  const filterPanel = (
    <div className="space-y-7">
      <div>
        <h4 className="mb-3 flex items-center gap-2 text-sm font-semibold uppercase tracking-wide text-stone-700">
          <FaFilter className="h-3.5 w-3.5 text-brand-700" />
          Category
        </h4>
        <div className="space-y-2">
          <label
            className={`flex cursor-pointer items-center justify-between rounded-lg px-3 py-2 text-sm transition-colors ${
              selectedCategory === ""
                ? "bg-brand-50 font-semibold text-brand-800"
                : "text-stone-600 hover:bg-stone-50"
            }`}
          >
            <span>All Categories</span>
            <input
              type="radio"
              name="category"
              checked={selectedCategory === ""}
              onChange={() => handleCategoryChange("")}
              className="accent-brand-700"
            />
          </label>
          {categories.map((category) => (
            <label
              key={category.id}
              className={`flex cursor-pointer items-center justify-between rounded-lg px-3 py-2 text-sm transition-colors ${
                selectedCategory === category.id
                  ? "bg-brand-50 font-semibold text-brand-800"
                  : "text-stone-600 hover:bg-stone-50"
              }`}
            >
              <span className="flex items-center gap-2">
                <span>{category.emoji}</span>
                {category.name}
              </span>
              <input
                type="radio"
                name="category"
                checked={selectedCategory === category.id}
                onChange={() => handleCategoryChange(category.id)}
                className="accent-brand-700"
              />
            </label>
          ))}
        </div>
      </div>

      <div>
        <h4 className="mb-3 text-sm font-semibold uppercase tracking-wide text-stone-700">
          Price
        </h4>
        <Select
          value={maxPrice}
          onChange={(value) => {
            setMaxPrice(value);
            setPage(1);
          }}
          options={priceOptions}
          className="w-full"
          size="middle"
        />
      </div>

      <div>
        <h4 className="mb-3 text-sm font-semibold uppercase tracking-wide text-stone-700">
          Availability
        </h4>
        <Checkbox
          checked={excludeUnavailable}
          onChange={(e) => {
            setExcludeUnavailable(e.target.checked);
            setPage(1);
          }}
          className="text-sm !text-stone-600"
        >
          In stock only
        </Checkbox>
      </div>

      <button
        type="button"
        onClick={handleReset}
        className="w-full rounded-xl border border-stone-200 py-2.5 text-sm font-semibold text-stone-600 transition-colors hover:border-brand-400 hover:text-brand-700"
      >
        Reset Filters
      </button>
    </div>
  );

  return (
    <div className="bg-white">
      <div className="border-b border-stone-200/80 bg-cream/50">
        <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
          <h1 className="font-display text-3xl font-semibold tracking-tight text-stone-900 sm:text-4xl">
            Marketplace
          </h1>
          <p className="mt-2 max-w-2xl text-stone-600">
            Browse fresh produce, dairy and pantry staples from verified local
            farmers — available when they’re at their best.
          </p>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              applyUrlParams();
            }}
            className="mt-6 flex max-w-xl items-center gap-2"
          >
            <label className="relative flex-1">
              <FaSearch className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-stone-400" />
              <input
                type="search"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search the marketplace..."
                className="w-full rounded-xl border border-stone-200 bg-white py-2.5 pl-10 pr-3 text-sm text-stone-700 shadow-sm outline-none transition-colors focus:border-brand-400"
              />
            </label>
            <button
              type="submit"
              className="inline-flex items-center gap-2 rounded-xl bg-brand-700 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-brand-800"
            >
              Search
            </button>
          </form>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        {loading ? (
          <Skeleton active paragraph={{ rows: 8 }} />
        ) : error ? (
          <EmptyState
            title="Could not load the marketplace"
            description={error}
            actionLabel="Try Again"
            onAction={reload}
          />
        ) : (
          <div className="flex gap-8">
            <aside className="hidden w-60 shrink-0 lg:block">{filterPanel}</aside>

            <div className="min-w-0 flex-1">
              <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
                <p className="text-sm text-stone-600">
                  <span className="font-semibold text-stone-900">
                    {filtered.length}
                  </span>{" "}
                  {filtered.length === 1 ? "product" : "products"} found
                </p>
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => setFiltersOpen(true)}
                    className="inline-flex items-center gap-2 rounded-xl border border-stone-200 bg-white px-4 py-2 text-sm font-semibold text-stone-600 transition-colors hover:border-brand-400 lg:hidden"
                  >
                    <FaSlidersH className="h-3.5 w-3.5" />
                    Filters
                  </button>
                  <Select
                    value={sort}
                    onChange={setSort}
                    options={sortOptions}
                    className="w-48"
                    size="middle"
                  />
                </div>
              </div>

              {pageProducts.length === 0 ? (
                <EmptyState
                  title="No products match your filters"
                  description="Try adjusting your search or reset the filters to see more produce."
                  actionLabel="Reset Filters"
                  onAction={handleReset}
                />
              ) : (
                <>
                  <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
                    {pageProducts.map((product) => (
                      <ProductCard
                        key={product.id}
                        product={product}
                        inWishlist={wishlistIds.has(product.id)}
                      />
                    ))}
                  </div>

                  {totalPages > 1 && (
                    <div className="mt-10 flex justify-center">
                      <Pagination
                        current={safePage}
                        total={filtered.length}
                        pageSize={PER_PAGE}
                        showSizeChanger={false}
                        onChange={setPage}
                      />
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        )}
      </div>

      <Drawer
        title="Filters"
        placement="right"
        open={filtersOpen}
        onClose={() => setFiltersOpen(false)}
        width={320}
      >
        {filterPanel}
      </Drawer>
    </div>
  );
};

export default Products;