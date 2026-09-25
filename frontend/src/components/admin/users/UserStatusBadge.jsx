import { Tag } from "antd";

const STATUS_META = {
  pending: { label: "Pending Approval", color: "gold" },
  approved: { label: "Approved", color: "blue" },
  active: { label: "Active", color: "green" },
  inactive: { label: "Inactive", color: "red" },
};

const UserStatusBadge = ({ status }) => {
  const meta = STATUS_META[status] || { label: status, color: "default" };

  return (
    <Tag color={meta.color} className="!m-0 !rounded-full">
      {meta.label}
    </Tag>
  );
};

export default UserStatusBadge;