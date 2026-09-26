import { Link } from "react-router-dom";
import { FaLeaf } from "react-icons/fa";
import Logo from "../../common/Logo.jsx";

const shopLinks = [
  { label: "Home", to: "/customer" },
  { label: "Marketplace", to: "/customer/products" },
  { label: "Categories", to: "/customer/categories" },
  { label: "Fresh Deals", to: "/customer/products?fresh=1" },
];

const accountLinks = [
  { label: "My Orders", to: "/customer/orders" },
  { label: "Cart", to: "/customer/cart" },
  { label: "Wishlist", to: "/customer/wishlist" },
  { label: "My Reviews", to: "/customer/reviews" },
  { label: "Profile", to: "/customer/profile" },
];

const helpLinks = [
  { label: "How It Works", to: "/customer#how-it-works" },
  { label: "Cash on Delivery", to: "/customer/checkout" },
  { label: "Back to Home", to: "/" },
  { label: "Login", to: "/login/customer" },
];

const CustomerFooter = () => {
  return (
    <footer className="bg-brand-950 text-brand-100">
      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-4">
          <div>
            <Logo light to="/customer" />
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-brand-200/80">
              Fresh produce straight from local farms, delivered to your door.
              Shop with MarketLink and support the growers in your community.
            </p>
            <div className="mt-5 flex items-center gap-2 rounded-xl bg-brand-900/60 px-4 py-3 text-sm text-brand-100">
              <FaLeaf className="h-4 w-4 shrink-0 text-brand-400" />
              Farm-fresh • Fair prices • Local growers
            </div>
          </div>

          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider text-white">
              Shop
            </h4>
            <ul className="mt-4 space-y-2.5 text-sm">
              {shopLinks.map((link) => (
                <li key={link.label}>
                  <Link
                    to={link.to}
                    className="text-brand-200/80 transition-colors hover:text-white"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider text-white">
              My Account
            </h4>
            <ul className="mt-4 space-y-2.5 text-sm">
              {accountLinks.map((link) => (
                <li key={link.label}>
                  <Link
                    to={link.to}
                    className="text-brand-200/80 transition-colors hover:text-white"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider text-white">
              Help
            </h4>
            <ul className="mt-4 space-y-2.5 text-sm">
              {helpLinks.map((link) => (
                <li key={link.label}>
                  <Link
                    to={link.to}
                    className="text-brand-200/80 transition-colors hover:text-white"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-12 border-t border-brand-900 pt-6 text-sm text-brand-300/60">
          <p>© {new Date().getFullYear()} MarketLink. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default CustomerFooter;