import { useNavigate } from "react-router-dom";
import { FaHeart } from "react-icons/fa";
import ProductCard from "../../components/customer/common/ProductCard.jsx";
import EmptyState from "../../components/farmer/common/EmptyState.jsx";
import Button from "../../components/common/Button.jsx";
import useWishlistStore from "../../hooks/useWishlistStore.js";
import useCustomerProducts from "../../hooks/useCustomerProducts.js";

const Wishlist = () => {
  const navigate = useNavigate();
  const wishlist = useWishlistStore();
  const { products } = useCustomerProducts();

  const wishlistIds = new Set(wishlist.items.map((product) => product.id));
  const liveItems = products.filter((product) => wishlistIds.has(product.id));

  return (
    <div className="bg-cream/40">
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="flex items-center gap-3 font-display text-3xl font-semibold tracking-tight text-stone-900">
              <FaHeart className="h-6 w-6 text-red-500" />
              My Wishlist
            </h1>
            <p className="mt-2 text-sm text-stone-500">
              Products you've saved for later.
            </p>
          </div>
          {liveItems.length > 0 && (
            <Button to="/customer/products" variant="outline" size="sm">
              Explore More
            </Button>
          )}
        </div>

        {wishlist.items.length === 0 ? (
          <div className="pt-4">
            <EmptyState
              icon={<FaHeart className="h-10 w-10 text-red-300" />}
              title="Your wishlist is empty"
              description="Tap the heart on any product to save it here for later."
              actionLabel="Browse Marketplace"
              onAction={() => navigate("/customer/products")}
            />
          </div>
        ) : (
          <>
            {wishlist.items.some(
              (item) => !products.some((product) => product.id === item.id)
            ) && (
              <p className="mb-6 rounded-xl bg-amber-50 p-3 text-xs text-amber-800">
                Some saved products are no longer in the marketplace and have
                been hidden below.
              </p>
            )}
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
              {liveItems.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  inWishlist={wishlistIds.has(product.id)}
                />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Wishlist;