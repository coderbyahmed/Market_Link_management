import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaHeart, FaRegHeart, FaCartPlus } from "react-icons/fa";
import { getCategoryById } from "../data/categories.js";
import { getAvailabilityMeta, formatPrice } from "../data/productMeta.js";
import RatingStars from "./RatingStars.jsx";
import { addToCart } from "../../../services/cart.service.js";
import { toggleWishlist } from "../../../services/wishlist.service.js";
import {
  showSuccess,
  showError,
} from "../../common/feedback/MessageProvider.jsx";

const ProductCard = ({ product, inWishlist }) => {
  const navigate = useNavigate();
  const [adding, setAdding] = useState(false);

  const category = getCategoryById(product.category);
  const availability = getAvailabilityMeta(product.availability);
  const inStock = product.availability === "available" && product.stock > 0;

  const goToDetails = () =>
    navigate(`/customer/products/${product.id}`);

  const handleAddToCart = async (e) => {
    e.stopPropagation();

    if (adding) return;

    setAdding(true);

    try {
      await addToCart(product, 1);
      showSuccess(`${product.name} added to cart`);
    } catch (error) {
      showError(error.message || "Unable to add product to cart");
    } finally {
      setAdding(false);
    }
  };

  const handleToggleWishlist = async (e) => {
    e.stopPropagation();

    try {
      const { added } = await toggleWishlist(product);
      showSuccess(
        added
          ? `${product.name} saved to wishlist`
          : `${product.name} removed from wishlist`
      );
    } catch (error) {
      showError(error.message || "Unable to update wishlist");
    }
  };

  return (
    <article
      onClick={goToDetails}
      className="group flex cursor-pointer flex-col overflow-hidden rounded-2xl border border-stone-200/80 bg-white shadow-sm transition-all duration-200 hover:-translate-y-1 hover:border-brand-300 hover:shadow-lg"
    >
      <div className="relative overflow-hidden bg-stone-100">
        <img
          src={product.image}
          alt={product.name}
          loading="lazy"
          className="h-48 w-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
        <span
          className={`absolute left-3 top-3 rounded-full px-2.5 py-1 text-xs font-semibold ${availability.badge}`}
        >
          {availability.label}
        </span>
        <button
          type="button"
          onClick={handleToggleWishlist}
          aria-label="Toggle wishlist"
          className="absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full bg-white/90 text-stone-500 shadow-sm transition-colors hover:text-red-500"
        >
          {inWishlist ? (
            <FaHeart className="h-4 w-4 text-red-500" />
          ) : (
            <FaRegHeart className="h-4 w-4" />
          )}
        </button>
      </div>

      <div className="flex flex-1 flex-col p-4">
        <div className="flex items-center justify-between gap-2">
          <span className="rounded-full bg-brand-50 px-2.5 py-0.5 text-xs font-medium capitalize text-brand-700">
            {category?.name || product.category}
          </span>
          <span className="flex items-center gap-1 text-xs font-semibold text-stone-600">
            <RatingStars rating={product.rating} size="text-[10px]" />
            <span className="ml-0.5 text-stone-400">
              ({product.rating})
            </span>
          </span>
        </div>

        <Link
          to={`/customer/products/${product.id}`}
          onClick={(e) => e.stopPropagation()}
          className="mt-2 line-clamp-1 font-display text-base font-semibold text-stone-900 transition-colors hover:text-brand-700"
        >
          {product.name}
        </Link>

        <p className="mt-1 truncate text-sm text-stone-500">
          by {product.farmer?.name || "Local Farmer"}
        </p>

        <div className="mt-3 flex items-baseline gap-1.5">
          <span className="text-lg font-bold text-brand-700">
            {formatPrice(product.price)}
          </span>
          <span className="text-xs text-stone-400">/ {product.unit}</span>
        </div>

        <div className="mt-4 flex items-center gap-2 border-t border-stone-100 pt-3">
          <button
            type="button"
            onClick={handleAddToCart}
            disabled={!inStock || adding}
            className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-xl bg-brand-700 px-3 py-2 text-sm font-semibold text-white transition-colors hover:bg-brand-800 disabled:cursor-not-allowed disabled:opacity-40"
          >
            <FaCartPlus className="h-3.5 w-3.5" />
            {adding ? "Adding..." : "Add to Cart"}
          </button>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              goToDetails();
            }}
            className="rounded-xl border border-stone-200 px-3 py-2 text-sm font-medium text-stone-600 transition-colors hover:border-brand-400 hover:text-brand-700"
          >
            View
          </button>
        </div>
      </div>
    </article>
  );
};

export default ProductCard;