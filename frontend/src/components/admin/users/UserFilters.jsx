import { Select } from "antd";

const UserFilters = ({ fields, values, onChange }) => {
  return (
    <div className="flex flex-wrap items-center gap-x-5 gap-y-3">
      {fields.map(({ key, label, options }) => (
        <div key={key} className="flex items-center gap-2">
          <span className="whitespace-nowrap text-sm font-medium text-stone-500 dark:text-stone-400">
            {label}
          </span>
          <Select
            value={values[key] || "all"}
            onChange={(value) => onChange(key, value)}
            options={options}
            className="w-40 min-w-0"
          />
        </div>
      ))}
    </div>
  );
};

export default UserFilters;