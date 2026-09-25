import { Input } from "antd";
import { FaSearch } from "react-icons/fa";

const SearchInput = ({ value, onChange, placeholder = "Search..." }) => {
  return (
    <Input
      value={value}
      onChange={(event) => onChange(event.target.value)}
      prefix={<FaSearch className="text-stone-400" />}
      placeholder={placeholder}
      allowClear
      aria-label={placeholder}
      className="w-full sm:max-w-xs"
    />
  );
};

export default SearchInput;
