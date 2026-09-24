import { FaArrowRight, FaLeaf, FaStar, FaCheckCircle } from "react-icons/fa";
import {
  GiWheat,
  GiTomato,
  GiCarrot,
  GiAppleSeeds,
  GiMilkCarton,
  GiHoneycomb,
} from "react-icons/gi";
import Button from "../common/Button.jsx";

const heroProducts = [
  { icon: GiWheat, label: "Grains", color: "bg-amber-100 text-amber-700" },
  { icon: GiTomato, label: "Tomatoes", color: "bg-red-100 text-red-600" },
  { icon: GiCarrot, label: "Carrots", color: "bg-orange-100 text-orange-700" },
  { icon: GiAppleSeeds, label: "Apples", color: "bg-green-100 text-green-700" },
  { icon: GiMilkCarton, label: "Dairy", color: "bg-sky-100 text-sky-700" },
  { icon: GiHoneycomb, label: "Honey", color: "bg-yellow-100 text-yellow-700" },
];

const stats = [
  { value: "1,200+", label: "Farmers" },
  { value: "8,500+", label: "Products" },
  { value: "60+", label: "Regions" },
];

const Hero = () => {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-brand-50 via-cream to-white">
      <div className="mx-auto grid max-w-7xl items-center gap-12 px-4 py-16 sm:px-6 lg:grid-cols-2 lg:px-8 lg:py-24">
        <div>
          <span className="inline-flex items-center gap-2 rounded-full border border-brand-200 bg-white px-4 py-1.5 text-xs font-semibold text-brand-700">
            <FaLeaf className="h-3.5 w-3.5 text-brand-600" />
            Farm-Fresh Marketplace
          </span>
          <h1 className="mt-6 font-display text-4xl font-semibold leading-tight tracking-tight text-stone-900 sm:text-5xl lg:text-6xl">
            Connecting Farmers with{" "}
            <span className="bg-gradient-to-r from-brand-600 to-brand-400 bg-clip-text text-transparent">
              Customers
            </span>
          </h1>
          <p className="mt-6 max-w-xl text-lg leading-relaxed text-stone-600">
            MarketLink brings local farmers and customers together on one
            trusted platform — discover fresh harvests, support local growers,
            and buy quality produce directly from the source.
          </p>

          <div className="mt-8 flex flex-wrap gap-4">
            <Button
              to="/signup/farmer"
              variant="primary"
              size="lg"
            >
              Join as a Farmer
            </Button>
            <Button to="/marketplace" variant="outline" size="lg">
              Explore as a Customer
            </Button>
          </div>

          <div className="mt-12 grid max-w-md grid-cols-3 gap-6">
            {stats.map((stat) => (
              <div key={stat.label}>
                <p className="font-display text-2xl font-semibold text-brand-700 sm:text-3xl">
                  {stat.value}
                </p>
                <p className="mt-1 text-sm text-stone-500">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="relative">
          <div className="absolute inset-0 -z-10 rounded-3xl bg-gradient-to-br from-brand-100 to-emerald-50 blur-2xl" />
          <div className="rounded-3xl border border-brand-100 bg-white p-6 shadow-xl shadow-brand-100/40">
            <div className="flex items-center justify-between rounded-2xl bg-gradient-to-r from-brand-800 to-brand-600 px-5 py-4 text-white">
              <div>
                <p className="text-xs text-brand-100">Marketplace Highlight</p>
                <p className="mt-0.5 font-display text-lg font-semibold">
                  Fresh Harvest Collection
                </p>
              </div>
              <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/15">
                <FaLeaf className="h-5 w-5" />
              </span>
            </div>

            <div className="mt-5 grid grid-cols-3 gap-3">
              {heroProducts.map(({ icon: Icon, label, color }) => (
                <div
                  key={label}
                  className="rounded-2xl border border-stone-100 bg-stone-50/80 p-4 text-center transition-transform duration-200 hover:-translate-y-0.5 hover:shadow-md"
                >
                  <span
                    className={`mx-auto flex h-12 w-12 items-center justify-center rounded-xl ${color}`}
                  >
                    <Icon className="h-6 w-6" />
                  </span>
                  <p className="mt-2 text-sm font-semibold text-stone-700">
                    {label}
                  </p>
                </div>
              ))}
            </div>

            <div className="mt-5 flex items-center justify-between rounded-2xl border border-brand-100 bg-brand-50/60 px-5 py-3">
              <div className="flex items-center gap-2">
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-brand-700 text-white">
                  <FaCheckCircle className="h-4 w-4" />
                </span>
                <p className="text-sm font-medium text-brand-800">
                  Sourced directly from local farms
                </p>
              </div>
              <div className="flex items-center gap-1 text-amber-500">
                {[...Array(5)].map((_, i) => (
                  <FaStar key={i} className="h-3.5 w-3.5" />
                ))}
              </div>
            </div>
          </div>

          <a
            href="/#marketplace"
            className="absolute -bottom-6 -left-4 hidden items-center gap-2 rounded-2xl border border-stone-100 bg-white px-5 py-4 shadow-lg transition-transform hover:-translate-y-1 sm:flex"
          >
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-100 text-brand-700">
              <GiAppleSeeds className="h-5 w-5" />
            </span>
            <div>
              <p className="text-sm font-semibold text-stone-800">
                View Marketplace
              </p>
              <p className="text-xs text-stone-500">Browse the harvest</p>
            </div>
            <FaArrowRight className="h-4 w-4 text-brand-600" />
          </a>
        </div>
      </div>
    </section>
  );
};

export default Hero;