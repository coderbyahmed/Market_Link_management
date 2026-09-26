import { Link } from "react-router-dom";
import { categories } from "../data/categories.js";
import SectionHeading from "../../common/SectionHeading.jsx";

const HomeCategories = () => {
  return (
    <section className="bg-white py-16 lg:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="Shop by Category"
          title="Fresh categories, every season"
          description="Browse the freshest produce, sorted by what grows best in every season."
        />

        <div className="mt-12 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {categories.map((category) => (
            <Link
              key={category.id}
              to={`/customer/products?category=${encodeURIComponent(category.id)}`}
              className="group rounded-2xl border border-stone-200/80 bg-white p-5 text-center transition-all duration-200 hover:-translate-y-1 hover:border-brand-300 hover:shadow-lg"
            >
              <span
                className={`mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br ${category.from} ${category.to}`}
              >
                <span className="text-3xl">{category.emoji}</span>
              </span>
              <p className={`mt-4 text-sm font-semibold ${category.text}`}>
                {category.name}
              </p>
              <p className="mt-0.5 text-xs text-stone-500">{category.tagline}</p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HomeCategories;