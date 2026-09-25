import { useState } from "react";

const ProductImage = ({ src, name, className = "" }) => {
  const [failed, setFailed] = useState(false);

  const classes = `shrink-0 rounded-xl object-cover ${className}`;

  if (!src || failed) {
    return (
      <span
        role="img"
        aria-label={name}
        className={`flex items-center justify-center overflow-hidden bg-brand-100 font-semibold text-brand-700 dark:bg-brand-900/40 dark:text-brand-300 ${className}`}
      >
        {(name || "?").slice(0, 1).toUpperCase()}
      </span>
    );
  }

  return (
    <img
      src={src}
      alt={name}
      loading="lazy"
      onError={() => setFailed(true)}
      className={classes}
    />
  );
};

export default ProductImage;
