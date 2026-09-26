import { Tag } from "antd";
import {
  AVAILABILITY_META,
  STATUS_META,
  availabilityLabel,
  statusLabel,
} from "./data/productMeta.js";

const AvailabilityBadge = ({ availability }) => {
  const meta = AVAILABILITY_META[availability] || {};

  return (
    <Tag color={meta.tagColor} className="!m-0 !rounded-full">
      {availabilityLabel(availability)}
    </Tag>
  );
};

const StatusBadge = ({ status }) => {
  const meta = STATUS_META[status] || {};

  return (
    <Tag color={meta.tagColor} className="!m-0 !rounded-full">
      {statusLabel(status)}
    </Tag>
  );
};

export { AvailabilityBadge, StatusBadge };