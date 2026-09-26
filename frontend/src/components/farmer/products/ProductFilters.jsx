import { Input, Select, Button } from "antd";
import { FaSearch, FaUndo } from "react-icons/fa";

const ProductFilters = ({
  fields,
  values,
  onChange,
  onReset,
  searchValue,
  onSearchChange,
  searchPlaceholder = "Search products...",
  hasActiveFilters = false,
}) => {
  return (
    <div className="rounded-2xl border border-stone-200/70 bg-white p-4 shadow-sm dark:border-stone-800 dark:bg-stone-900">
      <div className="grid gap-3 md:grid-cols-[1fr_auto]">
        <Input
          value={searchValue}
          onChange={(event) => onSearchChange(event.target.value)}
          prefix={<FaSearch className="text-stone-400" />}
          placeholder={searchPlaceholder}
          allowClear
          aria-label={searchPlaceholder}
        />
        {onReset && hasActiveFilters && (
          <Button
            className="md:self-start"
            icon={<FaUndo className="text-xs" />}
            onClick={onReset}
          >
            Reset
          </Button>
        )}
      </div>

      <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {fields.map(({ key, label, options }) => (
          <div key={key} className="flex items-center gap-2">
            <label className="whitespace-nowrap text-sm font-medium text-stone-600 dark:text-stone-400">
              {label}
            </label>
            <Select
              value={values[key] || "all"}
              onChange={(value) => onChange(key, value)}
              options={options}
              aria-label={label}
              className="flex-1"
              size="large"
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductFilters;