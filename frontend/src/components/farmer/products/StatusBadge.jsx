import { Tag } from "antd";
import { STATUS_META } from "./data/productOptions.js";

const StatusBadge = ({ status }) => {
  const meta = STATUS_META[status] || { label: status, tagColor: "default" };

  return (
    <Tag color={meta.tagColor} className="!m-0 !rounded-full">
      {meta.label}
    </Tag>
  );
};

export default StatusBadge;
