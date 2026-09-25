import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Tabs } from "antd";
import { FaUser, FaBuilding, FaGlobe, FaBell, FaShieldAlt } from "react-icons/fa";
import Button from "../../common/Button.jsx";
import PageHeader from "../common/PageHeader.jsx";
import ProfileSettings from "./ProfileSettings.jsx";
import BusinessSettings from "./BusinessSettings.jsx";
import MarketPickupSettings from "./MarketPickupSettings.jsx";
import NotificationsSettings from "./NotificationsSettings.jsx";
import SecuritySettings from "./SecuritySettings.jsx";
import { showSuccess } from "../../common/feedback/MessageProvider.jsx";

const tabItems = [
  {
    key: "profile",
    label: "Profile",
    icon: <FaUser className="h-4 w-4" />,
    children: <ProfileSettings />,
  },
  {
    key: "business",
    label: "Business Information",
    icon: <FaBuilding className="h-4 w-4" />,
    children: <BusinessSettings />,
  },
  {
    key: "market",
    label: "Market & Pickup",
    icon: <FaGlobe className="h-4 w-4" />,
    children: <MarketPickupSettings />,
  },
  {
    key: "notifications",
    label: "Notifications",
    icon: <FaBell className="h-4 w-4" />,
    children: <NotificationsSettings />,
  },
  {
    key: "security",
    label: "Security",
    icon: <FaShieldAlt className="h-4 w-4" />,
    children: <SecuritySettings />,
  },
];

const SettingsContent = () => {
  const [searchParams] = useSearchParams();
  const initialTab = searchParams.get("tab") || "profile";
  const [activeKey, setActiveKey] = useState(initialTab);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Settings"
        description="Manage your profile, business information, markets, notifications and security."
      />

      <Tabs
        activeKey={activeKey}
        onChange={setActiveKey}
        items={tabItems}
        tabBarExtraContent={
          <Button
            size="sm"
            onClick={() => showSuccess("All settings saved (demo).")}
            disabled={activeKey === "market"} // market has its own saves
          >
            Save All
          </Button>
        }
      />
    </div>
  );
};

export default SettingsContent;