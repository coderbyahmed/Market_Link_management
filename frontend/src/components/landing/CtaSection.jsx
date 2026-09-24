import { FaArrowRight, FaLeaf } from "react-icons/fa";
import { GiBasket } from "react-icons/gi";
import Button from "../common/Button.jsx";

const CtaSection = () => {
  return (
    <section className="bg-white py-20 lg:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-brand-900 via-brand-800 to-brand-600 px-6 py-14 text-center sm:px-12 lg:py-20">
          <GiBasket className="pointer-events-none absolute -left-6 top-8 h-40 w-40 rotate-12 text-white/5" />
          <GiBasket className="pointer-events-none absolute -right-6 bottom-8 h-40 w-40 -rotate-12 text-white/5" />

          <div className="relative mx-auto max-w-2xl">
            <span className="mx-auto mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-white/10 text-white">
              <FaLeaf className="h-6 w-6" />
            </span>
            <h2 className="font-display text-3xl font-semibold tracking-tight text-white sm:text-4xl lg:text-5xl">
              Grow Better. Buy Fresher. Connect Directly.
            </h2>
            <p className="mt-4 text-base leading-relaxed text-brand-100/90 sm:text-lg">
              Join MarketLink today and become part of a community that's
              reimagining how local food is grown, sold, and enjoyed.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-4">
              <Button
                to="/get-started"
                variant="primary"
                size="lg"
                className="!bg-white !text-brand-800 hover:!bg-brand-50"
              >
                Get Started
                <FaArrowRight className="h-4 w-4" />
              </Button>
              <Button
                to="/login/farmer"
                variant="outline"
                size="lg"
                className="!border-white/30 !bg-transparent !text-white hover:!bg-white/10"
              >
                For Farmers
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CtaSection;