import { useEffect, useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { Badge, Avatar, Dropdown, Drawer } from "antd";
import {
  FaSearch,
  FaBars,
  FaShoppingCart,
  FaHeart,
  FaUser,
  FaClipboardList,
  FaStar,
  FaSignOutAlt,
} from "react-icons/fa";
import { HiOutlineHome } from "react-icons/hi";
import { GiBasket } from "react-icons/gi";
import Logo from "../../common/Logo.jsx";
import Button from "../../common/Button.jsx";
import useCartStore from "../../../hooks/useCartStore.js";
import useWishlistStore from "../../../hooks/useWishlistStore.js";
import useLogout from "../../../hooks/useLogout.js";
import { getProfile } from "../../../services/customer.service.js";

const navLinks = [
  { label: "Home", to: "/customer", icon: HiOutlineHome },
  { label: "Marketplace", to: "/customer/products", icon: GiBasket },
  { label: "Categories", to: "/customer/categories", icon: GiBasket },
  { label: "Orders", to: "/customer/orders", icon: FaClipboardList },
];

const profileMenuItems = [
  { key: "profile", label: "My Profile", icon: <FaUser /> },
  { key: "reviews", label: "My Reviews", icon: <FaStar /> },
  { key: "orders", label: "My Orders", icon: <FaClipboardList /> },
  { type: "divider" },
  { key: "logout", label: "Logout", icon: <FaSignOutAlt /> },
];

const CustomerNavbar = () => {
  const navigate = useNavigate();
  const cart = useCartStore();
  const wishlist = useWishlistStore();
  const logout = useLogout("customer");

  const [search, setSearch] = useState("");
  const [mobileOpen, setMobileOpen] = useState(false);
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    getProfile()
      .then(setProfile)
      .catch(() => {});
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    const term = search.trim();
    setMobileOpen(false);
    navigate(term ? `/customer/products?q=${encodeURIComponent(term)}` : "/customer/products");
  };

  const handleProfileMenu = ({ key }) => {
    setMobileOpen(false);

    if (key === "logout") {
      logout();
      return;
    }

    const paths = {
      profile: "/customer/profile",
      reviews: "/customer/reviews",
      orders: "/customer/orders",
    };

    navigate(paths[key]);
  };

  const navLinkClass = ({ isActive }) =>
    `rounded-lg px-3 py-2 text-sm font-semibold transition-colors ${
      isActive
        ? "bg-brand-50 text-brand-700"
        : "text-stone-600 hover:bg-stone-50 hover:text-brand-700"
    }`;

  const avatarInitial = (profile?.name || "C").charAt(0).toUpperCase();

  return (
    <header className="sticky top-0 z-40 border-b border-stone-200/80 bg-white/90 backdrop-blur-md">
      <nav className="mx-auto flex h-16 max-w-7xl items-center gap-3 px-4 sm:px-6 lg:px-8">
        <button
          type="button"
          onClick={() => setMobileOpen(true)}
          aria-label="Open menu"
          className="flex h-10 w-10 items-center justify-center rounded-lg text-stone-600 hover:bg-stone-100 lg:hidden"
        >
          <FaBars className="h-5 w-5" />
        </button>

        <Logo to="/customer" />

        <div className="ml-4 hidden items-center gap-1 lg:flex">
          {navLinks.map((link) => (
            <NavLink key={link.to} to={link.to} className={navLinkClass} end={link.to === "/customer"}>
              {link.label}
            </NavLink>
          ))}
        </div>

        <form onSubmit={handleSearch} className="ml-auto hidden max-w-xs flex-1 items-center md:flex">
          <label className="relative block w-full">
            <FaSearch className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-stone-400" />
            <input
              type="search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search products, farmers..."
              className="w-full rounded-full border border-stone-200 bg-stone-50 py-2 pl-9 pr-4 text-sm text-stone-700 outline-none transition-colors focus:border-brand-400 focus:bg-white"
            />
          </label>
        </form>

        <div className="ml-auto flex items-center gap-1.5 md:ml-2">
          <Link
            to="/customer/wishlist"
            aria-label="Wishlist"
            className="relative flex h-10 w-10 items-center justify-center rounded-lg text-stone-600 transition-colors hover:bg-stone-100 hover:text-red-500"
          >
            <Badge count={wishlist.items.length} size="small" offset={[2, -2]}>
              <FaHeart className="h-4.5 w-4.5" />
            </Badge>
          </Link>

          <Link
            to="/customer/cart"
            aria-label="Cart"
            className="relative flex h-10 w-10 items-center justify-center rounded-lg text-stone-600 transition-colors hover:bg-stone-100 hover:text-brand-700"
          >
            <Badge count={cart.count} size="small" offset={[2, -2]}>
              <FaShoppingCart className="h-4.5 w-4.5" />
            </Badge>
          </Link>

          <Dropdown
            menu={{ items: profileMenuItems, onClick: handleProfileMenu }}
            trigger={["click"]}
            placement="bottomRight"
          >
            <button
              type="button"
              aria-label="Profile menu"
              className="ml-1 flex items-center gap-2 rounded-full p-1 transition-colors hover:bg-stone-100"
            >
              <Avatar size={36} src={profile?.image || undefined} className="!bg-brand-700">
                {avatarInitial}
              </Avatar>
            </button>
          </Dropdown>
        </div>
      </nav>

      <Drawer
        placement="left"
        open={mobileOpen}
        onClose={() => setMobileOpen(false)}
        width={300}
        styles={{ body: { padding: 0 } }}
      >
        <div className="flex h-full flex-col">
          <div className="flex items-center justify-between border-b border-stone-200 px-5 py-4">
            <Logo to="/customer" />
          </div>

          <form onSubmit={handleSearch} className="border-b border-stone-100 px-4 py-4">
            <label className="relative block w-full">
              <FaSearch className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-stone-400" />
              <input
                type="search"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search products..."
                className="w-full rounded-full border border-stone-200 bg-stone-50 py-2 pl-9 pr-4 text-sm text-stone-700 outline-none focus:border-brand-400 focus:bg-white"
              />
            </label>
          </form>

          <nav className="flex flex-col gap-1 px-4 py-4">
            {navLinks.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                end={link.to === "/customer"}
                onClick={() => setMobileOpen(false)}
                className={navLinkClass}
              >
                {link.label}
              </NavLink>
            ))}
            <NavLink
              to="/customer/wishlist"
              onClick={() => setMobileOpen(false)}
              className={navLinkClass}
            >
              Wishlist
            </NavLink>
            <NavLink
              to="/customer/reviews"
              onClick={() => setMobileOpen(false)}
              className={navLinkClass}
            >
              My Reviews
            </NavLink>
          </nav>

          <div className="mt-auto border-t border-stone-100 px-4 py-4">
            <div className="mb-4 flex items-center gap-3">
              <Avatar size={40} src={profile?.image || undefined} className="!bg-brand-700">
                {avatarInitial}
              </Avatar>
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold text-stone-800">
                  {profile?.name || "Customer"}
                </p>
                <p className="truncate text-xs text-stone-500">{profile?.email || "—"}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <Button to="/customer/profile" variant="outline" size="sm" onClick={() => setMobileOpen(false)}>
                Profile
              </Button>
              <Button variant="outline" size="sm" onClick={() => logout()}>
                Logout
              </Button>
            </div>
          </div>
        </div>
      </Drawer>
    </header>
  );
};

export default CustomerNavbar;
