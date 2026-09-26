import { Link } from "react-router-dom";
import { FaArrowRight } from "react-icons/fa";
import SectionHeading from "../../common/SectionHeading.jsx";
import ProductCard from "../common/ProductCard.jsx";
import useWishlistStore from "../../../hooks/useWishlistStore.js";

const HomeProducts = ({ eyebrow, title, description, products, viewAllTo, accent }) => {
  const wishlist = useWishlistStore();
  const wishlistIds = new Set(wishlist.items.map((product) => product.id));

  return (
    <section className={`py-16 lg:py-20 ${accent || "bg-white"}`}>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <SectionHeading eyebrow={eyebrow} title={title} description={description} align="left" />
          {viewAllTo && (
            <Link
              to={viewAllTo}
              className="inline-flex items-center gap-2 rounded-xl border border-stone-200 bg-white px-4 py-2.5 text-sm font-semibold text-brand-700 transition-colors hover:border-brand-400"
            >
              View All
              <FaArrowRight className="h-3.5 w-3.5" />
            </Link>
          )}
        </div>

        <div className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {products.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              inWishlist={wishlistIds.has(product.id)}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default HomeProducts;