import { useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";

const AuthInput = ({
  label,
  type = "text",
  icon: Icon,
  error,
  showPasswordToggle = false,
  className = "",
  ...rest
}) => {
  const [visible, setVisible] = useState(false);

  const isPassword = showPasswordToggle || type === "password";
  const resolvedType = showPasswordToggle && visible ? "text" : type;

  return (
    <div className={className}>
      <label className="mb-1.5 block text-sm font-medium text-stone-700">
        {label}
      </label>
      <div className="relative">
        {Icon && (
          <span className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400">
            <Icon className="h-4.5 w-4.5" />
          </span>
        )}
        <input
          type={resolvedType}
          className={`w-full rounded-xl border bg-white px-4 py-2.5 text-sm text-stone-800 outline-none transition-colors ${
            Icon ? "pl-10" : ""
          } ${showPasswordToggle ? "pr-11" : "pr-4"} ${
            error
              ? "border-red-400 focus:border-red-500"
              : "border-stone-300 focus:border-brand-500"
          } placeholder:text-stone-400`}
          {...rest}
        />
        {isPassword && showPasswordToggle && (
          <button
            type="button"
            onClick={() => setVisible((prev) => !prev)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 transition-colors hover:text-stone-600"
            aria-label={visible ? "Hide password" : "Show password"}
          >
            {visible ? <FaEyeSlash className="h-4 w-4" /> : <FaEye className="h-4 w-4" />}
          </button>
        )}
      </div>
      {error && <p className="mt-1.5 text-xs text-red-500">{error}</p>}
    </div>
  );
};

export default AuthInput;