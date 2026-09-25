import { Avatar, Dropdown } from "antd";
import { useNavigate } from "react-router-dom";
import { FaUserShield, FaCaretDown } from "react-icons/fa";
import useLogout from "../../../hooks/useLogout.js";
import { useAdminProfileImage } from "../../../hooks/useAdminProfileImage.js";
import { getUser } from "../../../utils/auth.js";

const menuItems = [
  { key: "profile", label: "Profile" },
  { key: "settings", label: "Settings" },
  { type: "divider" },
  { key: "logout", label: "Logout", danger: true },
];

const AdminProfileMenu = () => {
  const navigate = useNavigate();
  const logout = useLogout();
  const { savedProfileImage } = useAdminProfileImage();
  const storedUser = getUser();

  const userName = storedUser?.name || "Admin";
  const userEmail = storedUser?.email || "admin@marketlink.com";

  const handleMenuClick = ({ key }) => {
    if (key === "profile") {
      navigate("/admin/profile");
    } else if (key === "logout") {
      logout();
    }
  };

  return (
    <Dropdown
      menu={{ items: menuItems, onClick: handleMenuClick }}
      trigger={["click"]}
      placement="bottomRight"
    >
      <button
        type="button"
        className="flex items-center gap-2.5 rounded-xl px-2 py-1.5 transition-colors hover:bg-stone-100 dark:hover:bg-stone-800"
      >
        {savedProfileImage ? (
          <Avatar size={36} src={savedProfileImage} className="!rounded-full" />
        ) : (
          <Avatar size={36} className="!bg-brand-700" icon={<FaUserShield />} />
        )}
        <span className="hidden text-left sm:block">
          <span className="block text-sm font-semibold text-stone-800 dark:text-white">
            {userName}
          </span>
          <span className="block text-xs text-stone-400 dark:text-stone-500">
            {userEmail}
          </span>
        </span>
        <FaCaretDown className="hidden h-3 w-3 text-stone-400 sm:block" />
      </button>
    </Dropdown>
  );
};

export default AdminProfileMenu;