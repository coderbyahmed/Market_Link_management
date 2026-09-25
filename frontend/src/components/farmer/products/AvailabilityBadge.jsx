import { Dropdown, Tag } from "antd";
import { FaChevronDown } from "react-icons/fa";
import { AVAILABILITY_META, AVAILABILITY_OPTIONS } from "./data/productOptions.js";

const AvailabilityBadge = ({ availability, onChange }) => {
  const meta = AVAILABILITY_META[availability] || {
    label: availability,
    tagColor: "default",
  };

  if (!onChange) {
    return (
      <Tag color={meta.tagColor} className="!m-0 !rounded-full">
        {meta.label}
      </Tag>
    );
  }

  const menuItems = AVAILABILITY_OPTIONS.map((option) => ({
    key: option.value,
    label: option.label,
    disabled: option.value === availability,
  }));

  return (
    <Dropdown
      trigger={["click"]}
      placement="bottomLeft"
      menu={{
        items: menuItems,
        onClick: ({ key }) => {
          if (key !== availability) onChange(key);
        },
      }}
    >
      <button
        type="button"
        aria-label={`Change availability. Current: ${meta.label}`}
        className="inline-flex items-center gap-1.5 rounded-full border-0 px-0 font-medium transition-opacity hover:opacity-80"
      >
        <Tag color={meta.tagColor} className="!m-0 !rounded-full">
          {meta.label}
        </Tag>
        <FaChevronDown className="-ml-2 h-2.5 w-2.5 text-stone-400" />
      </button>
    </Dropdown>
  );
};

export default AvailabilityBadge;
