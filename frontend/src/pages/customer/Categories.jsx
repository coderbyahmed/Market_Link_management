import { Link } from "react-router-dom";
import { FaArrowRight, FaThLarge } from "react-icons/fa";
import { Skeleton } from "antd";
import { categories } from "../../components/customer/data/categories.js";
import EmptyState from "../../components/farmer/common/EmptyState.jsx";
import useCustomerProducts from "../../hooks/useCustomerProducts.js";

const Categories = () => {
  const { products, loading, error, reload } = useCustomerProducts();

  const countFor = (categoryId) =>
    products.filter(
      (product) => product.category === categoryId && product.availability === "available"
    ).length;

  const inStockCount = products.filter((product) => product.availability === "available").length;

  return (
    <div className="bg-white">
      <div className="border-b border-stone-200/80 bg-cream/50">
        <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
          <h1 className="font-display text-3xl font-semibold tracking-tight text-stone-900 sm:text-4xl">
            Browse Categories
          </h1>
          <p className="mt-2 max-w-2xl text-stone-600">
            Find exactly what you need — from crisp vegetables to fresh dairy.
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        {loading ? (
          <Skeleton active paragraph={{ rows: 8 }} />
        ) : error ? (
          <EmptyState
            title="Could not load categories"
            description={error}
            actionLabel="Try Again"
            onAction={reload}
          />
        ) : (
          <>
            <div className="mb-8 flex items-center gap-2 rounded-2xl border border-brand-100 bg-brand-50 px-5 py-4 text-sm text-brand-800">
              <FaThLarge className="h-4 w-4 shrink-0" />
              <span>
                <strong>{inStockCount}</strong> products currently in stock across{" "}
                <strong>{categories.length}</strong> categories.
              </span>
            </div>

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {categories.map((category) => {
                const count = countFor(category.id);
                return (
                  <Link
                    key={category.id}
                    to={`/customer/products?category=${encodeURIComponent(category.id)}`}
                    className="group flex items-center gap-5 rounded-2xl border border-stone-200/80 bg-white p-6 transition-all duration-200 hover:-translate-y-1 hover:border-brand-300 hover:shadow-lg"
                  >
                    <span
                      className={`flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br text-4xl ${category.from} ${category.to}`}
                    >
                      {category.emoji}
                    </span>
                    <div className="min-w-0 flex-1">
                      <h3 className={`font-display text-lg font-semibold ${category.text}`}>
                        {category.name}
                      </h3>
                      <p className="mt-0.5 truncate text-sm text-stone-500">{category.tagline}</p>
                      <p className="mt-2 text-xs font-medium text-brand-700">
                        {count} {count === 1 ? "product" : "products"} available
                      </p>
                    </div>
                    <FaArrowRight className="h-4 w-4 shrink-0 text-stone-300 transition-all group-hover:translate-x-1 group-hover:text-brand-700" />
                  </Link>
                );
              })}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Categories;
