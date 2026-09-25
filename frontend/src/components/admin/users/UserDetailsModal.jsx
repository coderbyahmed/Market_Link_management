import { Modal, Avatar, Descriptions, Tag } from "antd";
import UserStatusBadge from "./UserStatusBadge.jsx";

const getInitials = (name) =>
  name
    .split(" ")
    .map((part) => part[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

const UserDetailsModal = ({ user, open, onClose }) => {
  if (!user) return null;

  const isFarmer = user.role === "farmer";

  return (
    <Modal
      open={open}
      title="User Details"
      onCancel={onClose}
      footer={null}
      centered
      destroyOnHidden
    >
      <div className="mt-4 flex flex-col items-center gap-3 text-center sm:flex-row sm:text-left">
        {user.profileImage ? (
          <Avatar size={64} src={user.profileImage} className="!rounded-2xl" />
        ) : (
          <Avatar size={64} className="!bg-brand-700">
            {getInitials(user.name)}
          </Avatar>
        )}
        <div>
          <h3 className="font-display text-lg font-semibold tracking-tight text-stone-900 dark:text-white">
            {user.name}
          </h3>
          <div className="mt-1">
            <Tag color={isFarmer ? "blue" : "green"} className="!rounded-full">
              {isFarmer ? "Farmer" : "Customer"}
            </Tag>
          </div>
        </div>
      </div>

      <Descriptions
        className="mt-5"
        column={1}
        bordered
        size="small"
        items={[
          { key: "name", label: "Full Name", children: user.name },
          { key: "email", label: "Email", children: user.email },
          { key: "phone", label: "Phone", children: user.phone },
          {
            key: "role",
            label: "Role",
            children: isFarmer ? "Farmer" : "Customer",
          },
          ...(isFarmer
            ? [
                {
                  key: "approval",
                  label: "Approval Status",
                  children: <UserStatusBadge status={user.approvalStatus} />,
                },
              ]
            : []),
          {
            key: "account",
            label: "Account Status",
            children: <UserStatusBadge status={user.accountStatus} />,
          },
          { key: "joined", label: "Joined Date", children: user.joinedDate },
        ]}
      />
    </Modal>
  );
};

export default UserDetailsModal;