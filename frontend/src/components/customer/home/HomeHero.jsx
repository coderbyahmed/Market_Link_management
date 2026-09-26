import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaSearch, FaArrowRight, FaLeaf, FaTruck } from "react-icons/fa";
import { GiBasket, GiFruitBowl } from "react-icons/gi";
import Button from "../../common/Button.jsx";
import heroImage from "../data/heroImage.js";

const HomeHero = () => {
  const navigate = useNavigate();
  const [query, setQuery] = useState("");

  const handleSearch = (e) => {
    e.preventDefault();
    const term = query.trim();
    navigate(
      term ? `/customer/products?q=${encodeURIComponent(term)}` : "/customer/products"
    );
  };

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-brand-50 via-cream to-white">
      <div className="mx-auto grid max-w-7xl items-center gap-12 px-4 py-14 sm:px-6 lg:grid-cols-2 lg:px-8 lg:py-20">
        <div>
          <span className="inline-flex items-center gap-2 rounded-full border border-brand-200 bg-white px-4 py-1.5 text-xs font-semibold text-brand-700">
            <FaLeaf className="h-3.5 w-3.5 text-brand-600" />
            Fresh From Local Farmers
          </span>
          <h1 className="mt-6 font-display text-4xl font-semibold leading-tight tracking-tight text-stone-900 sm:text-5xl">
            Delivered To{" "}
            <span className="bg-gradient-to-r from-brand-600 to-brand-400 bg-clip-text text-transparent">
              Your Door
            </span>
          </h1>
          <p className="mt-5 max-w-xl text-lg leading-relaxed text-stone-600">
            Shop the season’s freshest vegetables, fruits, dairy and grains
            directly from trusted local farmers — harvested to order and
            delivered with care.
          </p>

          <form
            onSubmit={handleSearch}
            className="mt-8 flex max-w-lg items-center gap-2 rounded-2xl border border-stone-200 bg-white p-1.5 shadow-sm"
          >
            <label className="relative flex-1">
              <FaSearch className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-stone-400" />
              <input
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search for tomatoes, milk, honey..."
                className="w-full rounded-xl py-2.5 pl-10 pr-3 text-sm text-stone-700 outline-none placeholder:text-stone-400"
              />
            </label>
            <button
              type="submit"
              className="inline-flex items-center gap-2 rounded-xl bg-brand-700 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-brand-800"
            >
              <FaSearch className="h-3.5 w-3.5" />
              Search
            </button>
          </form>

          <div className="mt-7 flex flex-wrap gap-3">
            <Button to="/customer/products" size="lg">
              Browse Marketplace
              <FaArrowRight className="h-4 w-4" />
            </Button>
            <Button to="/customer/categories" variant="outline" size="lg">
              <GiFruitBowl className="h-5 w-5" />
              Shop by Category
            </Button>
          </div>

          <div className="mt-9 flex flex-wrap items-center gap-6 text-sm text-stone-600">
            <span className="inline-flex items-center gap-2">
              <FaLeaf className="h-4 w-4 text-brand-600" />
              Farm-fresh produce
            </span>
            <span className="inline-flex items-center gap-2">
              <FaTruck className="h-4 w-4 text-brand-600" />
              Fast local delivery
            </span>
            <span className="inline-flex items-center gap-2">
              <GiBasket className="h-4 w-4 text-brand-600" />
              Cash on delivery
            </span>
          </div>
        </div>

        <div className="relative">
          <div className="absolute inset-0 -z-10 rounded-3xl bg-gradient-to-br from-brand-100 to-amber-50 blur-2xl" />
          <div className="overflow-hidden rounded-3xl border border-brand-100 bg-white shadow-xl shadow-brand-100/40">
            <img
              src={heroImage("🧺", "From our farms to your table")}
              alt="Fresh produce from local farms"
              loading="eager"
              className="h-72 w-full object-cover sm:h-80"
            />
            <div className="flex items-center justify-between gap-4 px-6 py-5">
              <div>
                <p className="text-sm font-semibold text-brand-800">
                  Today’s Farm Fresh Pick
                </p>
                <p className="text-xs text-stone-500">
                  Hand-picked in the last 24 hours
                </p>
              </div>
              <Button to="/customer/products" size="sm" variant="secondary">
                Shop Now
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HomeHero;