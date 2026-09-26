import { FaArrowRight, FaStar } from "react-icons/fa";
import {
  GiCarrot,
  GiAppleSeeds,
  GiWheat,
  GiMilkCarton,
  GiCow,
  GiSunflower,
} from "react-icons/gi";
import SectionHeading from "../common/SectionHeading.jsx";
import Button from "../common/Button.jsx";
import { getUser } from "../../utils/auth.js";

const customerMarketTarget = () =>
  getUser() ? "/customer" : "/login/customer";

const categories = [
  { icon: GiCarrot, label: "Vegetables", color: "bg-green-100 text-green-700", count: "320+ listings" },
  { icon: GiAppleSeeds, label: "Fruits", color: "bg-red-100 text-red-600", count: "240+ listings" },
  { icon: GiWheat, label: "Grains", color: "bg-amber-100 text-amber-700", count: "150+ listings" },
  { icon: GiMilkCarton, label: "Dairy", color: "bg-sky-100 text-sky-700", count: "90+ listings" },
  { icon: GiCow, label: "Livestock", color: "bg-orange-100 text-orange-700", count: "120+ listings" },
  { icon: GiSunflower, label: "Organic Products", color: "bg-lime-100 text-lime-700", count: "180+ listings" },
];

const products = [
  {
    icon: GiCarrot,
    name: "Organic Carrots",
    farm: "Green Valley Farm",
    price: "$4.50 / kg",
    rating: 4.9,
    color: "bg-orange-100 text-orange-700",
  },
  {
    icon: GiWheat,
    name: "Fresh Wheat Grains",
    farm: "Sunrise Fields",
    price: "$6.20 / kg",
    rating: 4.8,
    color: "bg-amber-100 text-amber-700",
  },
  {
    icon: GiMilkCarton,
    name: "Farm Dairy Milk",
    farm: "Meadow Ranch",
    price: "$3.20 / L",
    rating: 5.0,
    color: "bg-sky-100 text-sky-700",
  },
  {
    icon: GiAppleSeeds,
    name: "Red Apples",
    farm: "Apple Orchard Co.",
    price: "$5.75 / kg",
    rating: 4.7,
    color: "bg-red-100 text-red-600",
  },
];

const MarketplacePreview = () => {
  return (
    <section id="marketplace" className="bg-gradient-to-b from-white to-cream py-20 lg:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="Explore the Marketplace"
          title="Fresh categories, every season"
          description="A snapshot of the marketplace — vegetables, fruits, dairy and more from local farms near you."
        />

        <div className="mt-14 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
          {categories.map(({ icon: Icon, label, color, count }) => (
            <div
              key={label}
              className="group rounded-2xl border border-stone-200/70 bg-white p-5 text-center transition-all duration-200 hover:-translate-y-1 hover:border-brand-300 hover:shadow-lg"
            >
              <span
                className={`mx-auto flex h-14 w-14 items-center justify-center rounded-2xl ${color}`}
              >
                <Icon className="h-7 w-7" />
              </span>
              <p className="mt-4 text-sm font-semibold text-stone-800">
                {label}
              </p>
              <p className="mt-0.5 text-xs text-stone-500">{count}</p>
            </div>
          ))}
        </div>

        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {products.map(({ icon: Icon, name, farm, price, rating, color }) => (
            <div
              key={name}
              className="group rounded-2xl border border-stone-200/70 bg-white p-5 transition-all duration-200 hover:-translate-y-1 hover:shadow-lg"
            >
              <div className="flex items-center justify-between">
                <span
                  className={`flex h-12 w-12 items-center justify-center rounded-xl ${color}`}
                >
                  <Icon className="h-6 w-6" />
                </span>
                <span className="flex items-center gap-1 rounded-full bg-amber-50 px-2.5 py-1 text-xs font-semibold text-amber-700">
                  <FaStar className="h-3 w-3" />
                  {rating}
                </span>
              </div>
              <div className="mt-4">
                <p className="font-semibold text-stone-900">{name}</p>
                <p className="text-sm text-stone-500">by {farm}</p>
              </div>
              <div className="mt-4 flex items-center justify-between border-t border-stone-100 pt-3">
                <span className="text-sm font-bold text-brand-700">{price}</span>
                <span className="text-xs font-medium text-brand-600 opacity-0 transition-opacity group-hover:opacity-100">
                  View → 
                </span>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-12 text-center">
          <Button to={customerMarketTarget()} variant="primary" size="lg">
            Explore the Marketplace
            <FaArrowRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </section>
  );
};

export default MarketplacePreview;