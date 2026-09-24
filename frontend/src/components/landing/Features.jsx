import { FaLeaf, FaHandshake, FaShieldAlt, FaShoppingBasket } from "react-icons/fa";
import SectionHeading from "../common/SectionHeading.jsx";

const features = [
  {
    icon: FaLeaf,
    title: "Fresh Farm Products",
    text: "Access a daily harvest of vegetables, fruits, dairy, grains and more — sourced straight from local farms.",
    accent: "bg-brand-100 text-brand-700",
  },
  {
    icon: FaHandshake,
    title: "Direct Farmer Connection",
    text: "Buy directly from growers, know where your food comes from, and build lasting relationships with local farmers.",
    accent: "bg-emerald-100 text-emerald-700",
  },
  {
    icon: FaShieldAlt,
    title: "Trusted Marketplace",
    text: "A transparent, secure platform that connects verified farmers with customers for honest, fair trade.",
    accent: "bg-lime-100 text-lime-700",
  },
  {
    icon: FaShoppingBasket,
    title: "Easy Buying Experience",
    text: "Discover products, compare options, and connect with farmers — all in one simple, modern marketplace.",
    accent: "bg-amber-100 text-amber-700",
  },
];

const Features = () => {
  return (
    <section id="features" className="bg-white py-20 lg:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="Why MarketLink"
          title="A marketplace built for fresh food"
          description="Everything farmers and customers need to connect, trade, and grow together — in one modern platform."
        />
        <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {features.map(({ icon: Icon, title, text, accent }) => (
            <div
              key={title}
              className="group rounded-2xl border border-stone-200/70 bg-white p-6 transition-all duration-200 hover:-translate-y-1 hover:border-brand-300 hover:shadow-lg hover:shadow-brand-100/50"
            >
              <span
                className={`flex h-12 w-12 items-center justify-center rounded-xl ${accent}`}
              >
                <Icon className="h-6 w-6" />
              </span>
              <h3 className="mt-5 text-lg font-semibold text-stone-900">
                {title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-stone-600">
                {text}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;