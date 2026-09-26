import { Input, Select } from "antd";
import { FaSearch, FaUndo } from "react-icons/fa";
import Button from "../../common/Button.jsx";

const AdminProductFilters = ({
  fields = [],
  values = {},
  onChange,
  onReset,
  searchValue,
  onSearchChange,
  searchPlaceholder = "Search products...",
  hasActiveFilters = false,
}) => {
  return (
    <div className="rounded-2xl border border-stone-200/70 bg-white p-4 shadow-sm dark:border-stone-800 dark:bg-stone-900">
      <div className="flex items-center gap-3">
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
            size="sm"
            variant="outline"
            className="shrink-0 !px-3"
            onClick={onReset}
          >
            <FaUndo className="h-3 w-3" /> Reset
          </Button>
        )}
      </div>

      <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2">
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

export default AdminProductFilters;