import { FaHome, FaArrowRight } from "react-icons/fa";
import { GiHelp } from "react-icons/gi";
import Button from "../components/common/Button.jsx";

const NotFound = () => {
  return (
    <div className="flex min-h-screen items-center justify-center bg-cream px-4">
      <div className="mx-auto max-w-md text-center">
        <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-brand-100 text-brand-700">
          <GiHelp className="h-8 w-8" />
        </span>
        <h1 className="mt-6 font-display text-5xl font-semibold text-stone-900">
          404
        </h1>
        <p className="mt-3 text-lg font-semibold text-stone-800">
          Page not found
        </p>
        <p className="mt-2 text-sm text-stone-600">
          Sorry, the page you're looking for doesn't exist or is not available
          for this account.
        </p>
        <div className="mt-8 flex justify-center gap-3">
          <Button to="/" variant="primary">
            <FaHome className="h-4 w-4" /> Back to Home
          </Button>
          <Button to="/signup/customer" variant="outline">
            Get Started <FaArrowRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default NotFound;