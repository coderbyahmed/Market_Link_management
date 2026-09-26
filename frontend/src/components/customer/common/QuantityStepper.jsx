import { FaMinus, FaPlus } from "react-icons/fa";

const QuantityStepper = ({
  quantity,
  onChange,
  min = 1,
  max = 99,
  disabled = false,
  compact = false,
}) => {
  const clampedMin = Math.max(1, min);
  const clampedMax = Math.max(clampedMin, max);

  const handleChange = (next) => {
    if (next < clampedMin) return;
    if (next > clampedMax) return;
    onChange(next);
  };

  const buttonClass = `flex items-center justify-center rounded-lg border border-stone-200 bg-white text-stone-600 transition-colors hover:border-brand-400 hover:text-brand-700 disabled:cursor-not-allowed disabled:opacity-40 ${
    compact ? "h-7 w-7" : "h-9 w-9"
  }`;

  return (
    <div className="inline-flex items-center gap-1">
      <button
        type="button"
        onClick={() => handleChange(quantity - 1)}
        disabled={disabled || quantity <= clampedMin}
        aria-label="Decrease quantity"
        className={buttonClass}
      >
        <FaMinus className={compact ? "h-3 w-3" : "h-3.5 w-3.5"} />
      </button>
      <span
        className={`min-w-10 text-center font-semibold text-stone-800 ${
          compact ? "text-sm" : "text-base"
        }`}
      >
        {quantity}
      </span>
      <button
        type="button"
        onClick={() => handleChange(quantity + 1)}
        disabled={disabled || quantity >= clampedMax}
        aria-label="Increase quantity"
        className={buttonClass}
      >
        <FaPlus className={compact ? "h-3 w-3" : "h-3.5 w-3.5"} />
      </button>
    </div>
  );
};

export default QuantityStepper;