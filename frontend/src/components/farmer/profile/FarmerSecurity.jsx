import { FaKey, FaEnvelopeOpenText } from "react-icons/fa";
import Button from "../../common/Button.jsx";

const FarmerSecurity = () => {
  return (
    <div className="rounded-2xl border border-stone-200/70 bg-white p-6 shadow-sm dark:border-stone-800 dark:bg-stone-900">
      <h2 className="font-display text-lg font-semibold tracking-tight text-stone-900 dark:text-white">
        Account Security
      </h2>

      <div className="mt-5 flex flex-wrap items-center justify-between gap-4 rounded-xl border border-stone-200 p-4 dark:border-stone-800">
        <div className="flex min-w-0 items-center gap-4">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-stone-100 text-stone-500 dark:bg-stone-800 dark:text-stone-400">
            <FaKey className="h-4 w-4" />
          </span>
          <div>
            <p className="text-sm font-semibold text-stone-800 dark:text-stone-200">
              Password
            </p>
            <p className="mt-0.5 text-sm tracking-widest text-stone-400 dark:text-stone-500">
              ••••••••
            </p>
          </div>
        </div>
        <Button to="/forgot-password/farmer" variant="outline" size="sm">
          <FaEnvelopeOpenText className="h-3.5 w-3.5" /> Reset via Email
        </Button>
      </div>

      <p className="mt-4 text-sm leading-relaxed text-stone-500 dark:text-stone-400">
        For your security, farmer passwords are changed through a verification
        code sent to your registered email address. We&apos;ll email you a reset
        link to complete the change.
      </p>
    </div>
  );
};

export default FarmerSecurity;
