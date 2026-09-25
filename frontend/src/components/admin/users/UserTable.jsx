import { Avatar, Table, Tag } from "antd";
import UserStatusBadge from "./UserStatusBadge.jsx";
import UserActionMenu from "./UserActionMenu.jsx";
import { getUserCombinedStatus } from "./data/usersData.js";

const getInitials = (name) =>
  name
    .split(" ")
    .map((part) => part[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

const UserCell = ({ user }) => {
  return (
    <div className="flex items-center gap-3">
      {user.profileImage ? (
        <Avatar src={user.profileImage} className="!bg-brand-700" />
      ) : (
        <Avatar className="!bg-brand-700">{getInitials(user.name)}</Avatar>
      )}
      <span className="font-medium text-stone-800 dark:text-stone-200">
        {user.name}
      </span>
    </div>
  );
};

const RoleTag = ({ user }) => (
  <Tag color={user.role === "farmer" ? "blue" : "green"} className="!rounded-full !m-0">
    {user.role === "farmer" ? "Farmer" : "Customer"}
  </Tag>
);

const buildColumns = ({
  type,
  pendingAction,
  onView,
  onApprove,
  onActivate,
  onDeactivate,
}) => {
  const userColumn = {
    title: type === "farmers" ? "Farmer" : type === "customers" ? "Customer" : "User",
    key: "user",
    render: (_, user) => <UserCell user={user} />,
  };

  const columns = [
    userColumn,
    { title: "Email", dataIndex: "email" },
    { title: "Phone", dataIndex: "phone" },
  ];

  if (type === "all") {
    columns.push(
      { title: "Role", key: "role", render: (_, user) => <RoleTag user={user} /> },
      {
        title: "Status",
        key: "status",
        render: (_, user) => <UserStatusBadge status={getUserCombinedStatus(user)} />,
      }
    );
  }

  if (type === "farmers") {
    columns.push(
      {
        title: "Approval Status",
        key: "approval",
        render: (_, user) => <UserStatusBadge status={user.approvalStatus} />,
      },
      {
        title: "Account Status",
        key: "account",
        render: (_, user) => <UserStatusBadge status={user.accountStatus} />,
      }
    );
  }

  if (type === "customers") {
    columns.push({
      title: "Account Status",
      key: "account",
      render: (_, user) => <UserStatusBadge status={user.accountStatus} />,
    });
  }

  columns.push(
    { title: "Joined Date", dataIndex: "joinedDate" },
    {
      title: "Actions",
      key: "actions",
      align: "right",
      render: (_, user) => (
        <UserActionMenu
          user={user}
          pendingAction={pendingAction}
          onView={onView}
          onApprove={onApprove}
          onActivate={onActivate}
          onDeactivate={onDeactivate}
        />
      ),
    }
  );

  return columns;
};

const EMPTY_TEXT = {
  all: "No users found",
  farmers: "No farmers found",
  customers: "No customers found",
};

const UserTable = ({
  users,
  type = "all",
  loading = false,
  pendingAction = null,
  onView,
  onApprove,
  onActivate,
  onDeactivate,
}) => {
  return (
    <div className="overflow-hidden rounded-2xl border border-stone-200/70 bg-white shadow-sm dark:border-stone-800 dark:bg-stone-900">
      <Table
        rowKey="id"
        dataSource={users}
        columns={buildColumns({ type, pendingAction, onView, onApprove, onActivate, onDeactivate })}
        loading={loading}
        locale={{ emptyText: EMPTY_TEXT[type] }}
        scroll={{ x: 860 }}
        pagination={{ pageSize: 8, showSizeChanger: false }}
      />
    </div>
  );
};

export default UserTable;