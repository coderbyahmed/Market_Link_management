import { Select, Button } from "antd";
import { FaUndo } from "react-icons/fa";

const FilterBar = ({
  fields,
  values,
  onChange,
  onReset,
  hasActiveFilters = false,
}) => {
  return (
    <div className="flex flex-wrap items-center gap-x-5 gap-y-3">
      {fields.map(({ key, label, options }) => (
        <div key={key} className="flex w-full items-center gap-2 sm:w-auto">
          <span className="whitespace-nowrap text-sm font-medium text-stone-600 dark:text-stone-400">
            {label}
          </span>
          <Select
            value={values[key] || "all"}
            onChange={(value) => onChange(key, value)}
            options={options}
            aria-label={label}
            className="min-w-0 flex-1 sm:w-44 sm:flex-none"
          />
        </div>
      ))}

      {onReset && hasActiveFilters && (
        <Button type="text" icon={<FaUndo className="text-xs" />} onClick={onReset}>
          Reset
        </Button>
      )}
    </div>
  );
};

export default FilterBar;
