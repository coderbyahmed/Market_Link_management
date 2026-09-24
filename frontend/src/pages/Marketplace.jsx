import { FaArrowLeft } from "react-icons/fa";
import { GiBasket } from "react-icons/gi";
import Header from "../components/common/Header.jsx";
import Footer from "../components/common/Footer.jsx";
import Button from "../components/common/Button.jsx";

const Marketplace = () => {
  return (
    <div className="min-h-screen">
      <Header />
      <main className="bg-gradient-to-b from-brand-50 to-white px-4 py-20 sm:px-6 lg:py-24">
        <div className="mx-auto max-w-2xl rounded-3xl border border-stone-200/70 bg-white px-6 py-14 text-center shadow-sm sm:px-12">
          <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-brand-100 text-brand-700">
            <GiBasket className="h-8 w-8" />
          </span>
          <h1 className="mt-6 font-display text-3xl font-semibold tracking-tight text-stone-900 sm:text-4xl">
            Marketplace Coming Soon
          </h1>
          <p className="mx-auto mt-4 max-w-lg text-base leading-relaxed text-stone-600">
            The Marketplace is under development. Soon you'll be able to browse
            fresh harvests from local farmers, join as a farmer to list your
            produce, or shop as a customer — all in one place.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <Button to="/" variant="outline">
              <FaArrowLeft className="h-4 w-4" />
              Back to Home
            </Button>
            <Button to="/get-started" variant="primary">
              Get Started
            </Button>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Marketplace;