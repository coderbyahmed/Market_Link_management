import { FaArrowRight, FaShoppingBasket } from "react-icons/fa";
import { GiFarmTractor } from "react-icons/gi";
import SectionHeading from "../common/SectionHeading.jsx";
import Button from "../common/Button.jsx";

const roles = [
  {
    role: "Farmer",
    description: "Create your farm profile and connect with customers.",
    buttonLabel: "Continue as Farmer",
    to: "/login/farmer",
    icon: GiFarmTractor,
    accent: "bg-brand-100 text-brand-700",
    badge: "bg-brand-700 text-white",
    hover: "hover:border-brand-400",
  },
  {
    role: "Customer",
    description: "Discover fresh products and connect with local farmers.",
    buttonLabel: "Continue as Customer",
    to: "/login/customer",
    icon: FaShoppingBasket,
    accent: "bg-amber-100 text-amber-700",
    badge: "bg-amber-600 text-white",
    hover: "hover:border-amber-400",
  },
];

const RoleSelection = () => {
  return (
    <section className="bg-white py-20 lg:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="Pick Your Path"
          title="Choose Your MarketLink Experience"
          description="Whether you grow the harvest or enjoy fresh food — there's a place for you."
        />

        <div className="mx-auto mt-14 grid max-w-4xl gap-6 md:grid-cols-2">
          {roles.map(({ role, description, buttonLabel, to, icon: Icon, accent, badge, hover }) => (
            <div
              key={role}
              className={`group flex flex-col rounded-2xl border border-stone-200/70 bg-white p-7 transition-all duration-200 hover:-translate-y-1.5 hover:shadow-xl hover:shadow-stone-200/60 ${hover}`}
            >
              <div className="flex items-center justify-between">
                <span className={`flex h-14 w-14 items-center justify-center rounded-2xl ${accent}`}>
                  <Icon className="h-7 w-7" />
                </span>
                <span className="rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-wide text-white">
                  <span className={`rounded-full px-3 py-1 ${badge}`}>
                    {role}
                  </span>
                </span>
              </div>
              <h3 className="mt-6 font-display text-2xl font-semibold text-stone-900">
                {role}
              </h3>
              <p className="mt-2 flex-1 text-sm leading-relaxed text-stone-600">
                {description}
              </p>
              <Button
                to={to}
                variant="outline"
                className="mt-6 w-full hover:bg-transparent"
              >
                {buttonLabel}
                <FaArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default RoleSelection;