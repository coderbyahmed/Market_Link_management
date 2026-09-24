import { Link } from "react-router-dom";
import { Spin } from "antd";

const base =
  "inline-flex items-center justify-center gap-2 rounded-xl font-semibold transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-400 focus-visible:ring-offset-2 disabled:opacity-60";

const sizes = {
  sm: "px-4 py-2 text-sm",
  md: "px-5 py-2.5 text-sm",
  lg: "px-6 py-3 text-base",
};

const variants = {
  primary:
    "bg-brand-700 text-white shadow-sm hover:bg-brand-800 active:bg-brand-900",
  secondary:
    "bg-brand-50 text-brand-800 border border-brand-200 hover:bg-brand-100",
  outline:
    "border border-stone-300 bg-white text-stone-700 hover:border-brand-400 hover:text-brand-700",
  ghost: "text-brand-800 hover:bg-brand-50",
};

const Button = ({
  to,
  children,
  variant = "primary",
  size = "md",
  className = "",
  loading = false,
  ...rest
}) => {
  const classes = `${base} ${sizes[size]} ${variants[variant]} ${className}`;

  const content = loading ? (
    <>
      <Spin size="small" /> {children}
    </>
  ) : (
    children
  );

  if (to) {
    return (
      <Link to={to} className={classes} aria-busy={loading} {...rest}>
        {content}
      </Link>
    );
  }

  return (
    <button type="button" className={classes} disabled={loading} aria-busy={loading} {...rest}>
      {content}
    </button>
  );
};

export default Button;