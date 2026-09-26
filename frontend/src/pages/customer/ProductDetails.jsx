import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Breadcrumb, Skeleton, Tag } from "antd";
import { FaHeart, FaRegHeart, FaStar, FaTruck, FaCheckCircle, FaShoppingCart } from "react-icons/fa";
import { getProduct } from "../../services/customerProduct.service.js";
import { addToCart } from "../../services/cart.service.js";
import { toggleWishlist } from "../../services/wishlist.service.js";
import { getCategoryById } from "../../components/customer/data/categories.js";
import { getAvailabilityMeta, formatPrice } from "../../components/customer/data/productMeta.js";
import RatingStars from "../../components/customer/common/RatingStars.jsx";
import QuantityStepper from "../../components/customer/common/QuantityStepper.jsx";
import ProductCard from "../../components/customer/common/ProductCard.jsx";
import ProductReviews from "../../components/customer/products/ProductReviews.jsx";
import ReviewModal from "../../components/customer/reviews/ReviewModal.jsx";
import EmptyState from "../../components/farmer/common/EmptyState.jsx";
import useCustomerProducts from "../../hooks/useCustomerProducts.js";
import useWishlistStore from "../../hooks/useWishlistStore.js";
import { showSuccess, showError } from "../../components/common/feedback/MessageProvider.jsx";

const ProductDetails = () => {
  const { productId } = useParams();
  const navigate = useNavigate();
  const wishlist = useWishlistStore();
  const { products } = useCustomerProducts();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [adding, setAdding] = useState(false);
  const [reviewOpen, setReviewOpen] = useState(false);

  useEffect(() => {
    getProduct(productId)
      .then((found) => {
        if (!found) {
          setError("Product not found");
          return;
        }
        setProduct(found);
        setError("");
      })
      .catch((loadError) => {
        setError(loadError.message || "Unable to load product");
      })
      .finally(() => setLoading(false));
  }, [productId]);

  const related = useMemo(
    () =>
      product
        ? products
            .filter(
              (item) =>
                item.id !== product.id &&
                item.category === product.category &&
                item.availability === "available"
            )
            .slice(0, 4)
        : [],
    [products, product]
  );

  if (loading) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <Skeleton active paragraph={{ rows: 10 }} />
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <EmptyState
          title="Product not found"
          description={error || "This product may have been removed from the marketplace."}
          actionLabel="Back to Marketplace"
          onAction={() => navigate("/customer/products")}
        />
      </div>
    );
  }

  const category = getCategoryById(product.category);
  const availability = getAvailabilityMeta(product.availability);
  const inStock = product.availability === "available" && product.stock > 0;
  const inWishlist = wishlist.items.some((item) => item.id === product.id);

  const handleAddToCart = async (goToCart = false) => {
    if (adding) return;
    setAdding(true);

    try {
      await addToCart(product, quantity);
      showSuccess(`${product.name} added to cart`);
      if (goToCart) {
        navigate("/customer/cart");
      }
    } catch (addError) {
      showError(addError.message || "Unable to add product to cart");
    } finally {
      setAdding(false);
    }
  };

  const handleToggleWishlist = async () => {
    try {
      const { added } = await toggleWishlist(product);
      showSuccess(added ? "Saved to wishlist" : "Removed from wishlist");
    } catch (toggleError) {
      showError(toggleError.message || "Unable to update wishlist");
    }
  };

  return (
    <div className="bg-white">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <Breadcrumb
          items={[
            { title: <Link to="/customer">Home</Link> },
            { title: <Link to="/customer/products">Marketplace</Link> },
            { title: product.name },
          ]}
          className="mb-6"
        />

        <div className="grid gap-10 lg:grid-cols-2">
          <div className="relative overflow-hidden rounded-3xl border border-stone-200/80 bg-stone-100">
            <img
              src={product.image}
              alt={product.name}
              className="h-96 w-full object-cover lg:h-[480px]"
            />
            <span
              className={`absolute left-4 top-4 rounded-full px-3 py-1.5 text-sm font-semibold ${availability.badge}`}
            >
              {availability.label}
            </span>
          </div>

          <div>
            <div className="flex flex-wrap items-center gap-3">
              <span className="rounded-full bg-brand-50 px-3 py-1 text-sm font-medium capitalize text-brand-700">
                {category?.name || product.category}
              </span>
              {product.featured && (
                <Tag color="gold" className="!rounded-full">
                  Featured
                </Tag>
              )}
            </div>

            <h1 className="mt-4 font-display text-3xl font-semibold tracking-tight text-stone-900 sm:text-4xl">
              {product.name}
            </h1>

            <div className="mt-3 flex items-center gap-2 text-sm text-stone-600">
              <RatingStars rating={product.rating} />
              <span className="font-semibold text-stone-900">{product.rating}</span>
              <span className="text-stone-400">({product.reviewCount} reviews)</span>
            </div>

            <p className="mt-4 text-stone-600">
              by{" "}
              <span className="font-semibold text-brand-700">
                {product.farmer?.name || "Local Farmer"}
              </span>
              {product.farmer?.location && ` • ${product.farmer.location}`}
            </p>

            <div className="mt-6 flex items-baseline gap-3 border-y border-stone-200/80 py-5">
              <span className="font-display text-4xl font-semibold text-brand-700">
                {formatPrice(product.price)}
              </span>
              <span className="text-sm text-stone-500">per {product.unit}</span>
            </div>

            <p className="mt-5 leading-relaxed text-stone-600">{product.description}</p>

            {product.tags && (
              <div className="mt-4 flex flex-wrap gap-2">
                {product.tags.map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full bg-stone-100 px-3 py-1 text-xs font-medium text-stone-600"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}

            {inStock ? (
              <div className="mt-7">
                <div className="flex items-center gap-4">
                  <div>
                    <p className="mb-1.5 text-sm font-medium text-stone-600">Quantity</p>
                    <QuantityStepper
                      quantity={quantity}
                      onChange={setQuantity}
                      max={Math.min(product.stock, 99)}
                    />
                  </div>
                  <p className="mt-5 text-xs text-stone-400">
                    {product.stock} available
                  </p>
                </div>

                <div className="mt-6 flex flex-wrap gap-3">
                  <button
                    type="button"
                    onClick={() => handleAddToCart(false)}
                    disabled={adding}
                    className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl border-2 border-brand-700 bg-white px-6 py-3 text-sm font-semibold text-brand-700 transition-colors hover:bg-brand-50 disabled:opacity-50"
                  >
                    <FaShoppingCart className="h-4 w-4" />
                    {adding ? "Adding..." : "Add to Cart"}
                  </button>
                  <button
                    type="button"
                    onClick={() => handleAddToCart(true)}
                    disabled={adding}
                    className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl bg-brand-700 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-brand-800 disabled:opacity-50"
                  >
                    Buy Now
                  </button>
                  <button
                    type="button"
                    onClick={handleToggleWishlist}
                    aria-label="Toggle wishlist"
                    className={`inline-flex h-12 w-12 items-center justify-center rounded-xl border-2 transition-colors ${
                      inWishlist
                        ? "border-red-200 bg-red-50 text-red-500"
                        : "border-stone-200 text-stone-500 hover:border-red-200 hover:text-red-500"
                    }`}
                  >
                    {inWishlist ? <FaHeart className="h-5 w-5" /> : <FaRegHeart className="h-5 w-5" />}
                  </button>
                </div>
              </div>
            ) : (
              <div className="mt-7 rounded-2xl bg-stone-50 p-5 text-sm text-stone-500">
                This product is currently {availability.label.toLowerCase()}. Check back soon or
                browse similar items below.
              </div>
            )}

            <div className="mt-7 grid gap-3 sm:grid-cols-2">
              <div className="flex items-center gap-3 rounded-xl border border-stone-200/80 p-4 text-sm text-stone-600">
                <FaTruck className="h-5 w-5 shrink-0 text-brand-700" />
                Free delivery on orders over Rs 2,000
              </div>
              <div className="flex items-center gap-3 rounded-xl border border-stone-200/80 p-4 text-sm text-stone-600">
                <FaCheckCircle className="h-5 w-5 shrink-0 text-brand-700" />
                Cash on delivery available
              </div>
            </div>
          </div>
        </div>

        <div className="mt-16 border-t border-stone-200/80 pt-10">
          <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
            <div>
              <h2 className="font-display text-2xl font-semibold text-stone-900">
                Ratings & Reviews
              </h2>
              <p className="mt-1 text-sm text-stone-500">
                See what customers say about this product.
              </p>
            </div>
            <button
              type="button"
              onClick={() => setReviewOpen(true)}
              className="inline-flex items-center gap-2 rounded-xl border-2 border-brand-700 bg-white px-4 py-2 text-sm font-semibold text-brand-700 transition-colors hover:bg-brand-50"
            >
              <FaStar className="h-4 w-4" />
              Write a Review
            </button>
          </div>
          <ProductReviews product={product} />
        </div>

        {related.length > 0 && (
          <div className="mt-16 border-t border-stone-200/80 pt-10">
            <h2 className="font-display text-2xl font-semibold text-stone-900">
              You may also like
            </h2>
            <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {related.map((item) => (
                <ProductCard
                  key={item.id}
                  product={item}
                  inWishlist={wishlist.items.some((w) => w.id === item.id)}
                />
              ))}
            </div>
          </div>
        )}
      </div>

      <ReviewModal
        open={reviewOpen}
        onClose={() => setReviewOpen(false)}
        product={product}
      />
    </div>
  );
};

export default ProductDetails;