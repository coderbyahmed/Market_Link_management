import { Dropdown, Button } from "antd";
import {
  FaEye,
  FaCheckCircle,
  FaPlay,
  FaBan,
  FaEllipsisV,
} from "react-icons/fa";

const buildItems = (user, actionsDisabled) => {
  const items = [{ key: "view", label: "View Details", icon: <FaEye /> }];

  if (user.role !== "farmer") return items;

  if (user.approvalStatus === "pending") {
    items.push({
      key: "approve",
      label: actionsDisabled ? "Approving..." : "Approve",
      icon: <FaCheckCircle />,
      disabled: actionsDisabled,
    });
  } else if (user.accountStatus === "inactive") {
    items.push({
      key: "activate",
      label: actionsDisabled ? "Reactivating..." : "Activate",
      icon: <FaPlay />,
      disabled: actionsDisabled,
    });
  } else {
    items.push({
      key: "deactivate",
      label: actionsDisabled ? "Deactivating..." : "Deactivate",
      icon: <FaBan />,
      danger: true,
      disabled: actionsDisabled,
    });
  }

  return items;
};

const UserActionMenu = ({
  user,
  pendingAction = null,
  onView,
  onApprove,
  onActivate,
  onDeactivate,
}) => {
  const actionsDisabled = Boolean(
    pendingAction && pendingAction.userId === user.id
  );

  const handleClick = ({ key }) => {
    if (key === "view") {
      onView(user);
      return;
    }

    if (user.role !== "farmer") return;

    if (key === "approve") onApprove(user);
    else if (key === "activate") onActivate(user);
    else if (key === "deactivate") onDeactivate(user);
  };

  return (
    <Dropdown menu={{ items: buildItems(user, actionsDisabled), onClick: handleClick }}
      trigger={["click"]}
      placement="bottomRight"
    >
      <Button
        type="text"
        icon={<FaEllipsisV className="h-4 w-4 text-stone-500" />}
        aria-label="User actions"
        className="!inline-flex !items-center !justify-center"
      />
    </Dropdown>
  );
};

export default UserActionMenu;