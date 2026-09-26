import { FaBoxOpen } from "react-icons/fa";

const AdminProductImage = ({ src, name, className = "h-12 w-12" }) => {
  if (src) {
    return (
      <img
        src={src}
        alt={name || "Product"}
        className={`${className} shrink-0 rounded-xl object-cover`}
      />
    );
  }

  return (
    <span
      className={`${className} flex shrink-0 items-center justify-center rounded-xl bg-stone-100 text-stone-400 dark:bg-stone-800 dark:text-stone-500`}
    >
      <FaBoxOpen className="h-5 w-5" />
    </span>
  );
};

export default AdminProductImage;