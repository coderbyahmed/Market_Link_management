import { Input } from "antd";
import { FaSearch } from "react-icons/fa";

const UserSearch = ({
  value,
  onChange,
  placeholder = "Search by name, email or phone",
}) => {
  return (
    <Input
      value={value}
      onChange={(event) => onChange(event.target.value)}
      prefix={<FaSearch className="text-stone-400" />}
      placeholder={placeholder}
      allowClear
      className="w-full sm:max-w-xs"
    />
  );
};

export default UserSearch;