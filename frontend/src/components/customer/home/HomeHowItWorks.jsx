import {
  FaSearch,
  FaHandPointer,
  FaShoppingCart,
  FaTruck,
} from "react-icons/fa";
import SectionHeading from "../../common/SectionHeading.jsx";

const steps = [
  {
    icon: FaSearch,
    title: "Browse",
    description: "Explore fresh products from local farms and filter by category, price or availability.",
  },
  {
    icon: FaHandPointer,
    title: "Choose",
    description: "Pick the produce you love, set the quantity you need and add it to your cart.",
  },
  {
    icon: FaShoppingCart,
    title: "Order",
    description: "Check out in minutes with a simple order form and pay cash on delivery.",
  },
  {
    icon: FaTruck,
    title: "Receive",
    description: "Get your order delivered right to your doorstep — fresh and on time.",
  },
];

const HomeHowItWorks = () => {
  return (
    <section id="how-it-works" className="bg-gradient-to-b from-white to-cream py-16 lg:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="How It Works"
          title="From farm to doorstep in four simple steps"
          description="A marketplace built for real people — browse, order and receive your harvest with ease."
        />

        <div className="mx-auto mt-12 grid max-w-5xl gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {steps.map((step, index) => (
            <div
              key={step.title}
              className="relative rounded-2xl border border-stone-200/80 bg-white p-6 text-center shadow-sm"
            >
              <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-brand-700 px-3 py-0.5 text-xs font-bold text-white">
                {index + 1}
              </span>
              <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-100 text-brand-700">
                <step.icon className="h-7 w-7" />
              </span>
              <h3 className="mt-4 font-display text-lg font-semibold text-stone-900">
                {step.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-stone-600">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HomeHowItWorks;