import { FaArrowRight } from "react-icons/fa";
import Button from "./Button.jsx";

const DashboardPlaceholder = ({ role, icon: Icon, description }) => {
  return (
    <div className="flex min-h-[60vh] items-center justify-center px-4">
      <div className="mx-auto max-w-md text-center">
        <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-brand-100 text-brand-700">
          <Icon className="h-8 w-8" />
        </span>
        <h1 className="mt-6 font-display text-3xl font-semibold text-stone-900">
          {role} Dashboard
        </h1>
        <p className="mt-3 text-stone-600">{description}</p>
        <p className="mt-2 rounded-lg bg-brand-50 px-4 py-3 text-sm text-brand-700">
          This area is currently being prepared. It will become available after
          the next development phase.
        </p>
        <div className="mt-8">
          <Button to="/" variant="primary">
            Back to Home <FaArrowRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default DashboardPlaceholder;