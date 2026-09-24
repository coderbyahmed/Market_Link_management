import { FaArrowRight } from "react-icons/fa";
import SectionHeading from "../common/SectionHeading.jsx";
import Button from "../common/Button.jsx";

const RoleCards = ({ eyebrow, title, description, options }) => {
  return (
    <section className="bg-white py-20 lg:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading eyebrow={eyebrow} title={title} description={description} />

        <div className="mt-14 grid gap-6 md:grid-cols-3">
          {options.map(
            ({ role, description: cardDescription, actionLabel, to, icon: Icon, accent, badge, hover }) => (
              <div
                key={role}
                className={`group flex flex-col rounded-2xl border border-stone-200/70 bg-white p-7 transition-all duration-200 hover:-translate-y-1.5 hover:shadow-xl hover:shadow-stone-200/60 ${hover}`}
              >
                <div className="flex items-center justify-between">
                  <span className={`flex h-14 w-14 items-center justify-center rounded-2xl ${accent}`}>
                    <Icon className="h-7 w-7" />
                  </span>
                  <span className="rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-wide text-white">
                    <span className={`rounded-full px-3 py-1 ${badge}`}>{role}</span>
                  </span>
                </div>
                <h3 className="mt-6 font-display text-2xl font-semibold text-stone-900">{role}</h3>
                <p className="mt-2 flex-1 text-sm leading-relaxed text-stone-600">{cardDescription}</p>
                <Button to={to} variant="outline" className="mt-6 w-full hover:bg-transparent">
                  {actionLabel}
                  <FaArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Button>
              </div>
            )
          )}
        </div>
      </div>
    </section>
  );
};

export default RoleCards;