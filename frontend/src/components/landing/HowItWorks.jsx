import { FaUserPlus, FaListAlt, FaSearch, FaShoppingCart } from "react-icons/fa";
import SectionHeading from "../common/SectionHeading.jsx";

const steps = [
  {
    icon: FaUserPlus,
    title: "Farmers Join",
    text: "Farmers create a free profile and tell the community what they grow.",
  },
  {
    icon: FaListAlt,
    title: "Farmers List Products",
    text: "List fresh harvests, prices, and availability for customers to browse.",
  },
  {
    icon: FaSearch,
    title: "Customers Discover",
    text: "Customers explore products from nearby farms and compare offers.",
  },
  {
    icon: FaShoppingCart,
    title: "Customers Connect & Buy",
    text: "Connect with the farmer directly and purchase straight from the source.",
  },
];

const HowItWorks = () => {
  return (
    <section
      id="how-it-works"
      className="bg-gradient-to-b from-cream to-white py-20 lg:py-24"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="How MarketLink Works"
          title="From farm to table in four simple steps"
          description="A seamless flow that keeps farmers selling and customers buying — with no middlemen in the way."
        />

        <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {steps.map(({ icon: Icon, title, text }, index) => (
            <div key={title} className="relative">
              <div className="relative h-full rounded-2xl border border-stone-200/70 bg-white p-6 transition-transform duration-200 hover:-translate-y-1 hover:shadow-lg">
                <span className="absolute right-5 top-5 font-display text-sm font-semibold text-brand-200">
                  0{index + 1}
                </span>
                <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-brand-700 text-white">
                  <Icon className="h-6 w-6" />
                </span>
                <h3 className="mt-5 text-lg font-semibold text-stone-900">
                  {title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-stone-600">
                  {text}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;