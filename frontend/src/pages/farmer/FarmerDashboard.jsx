import { GiFarmTractor } from "react-icons/gi";
import DashboardPlaceholder from "../../components/common/DashboardPlaceholder.jsx";

const FarmerDashboard = () => {
  return (
    <DashboardPlaceholder
      role="Farmer"
      icon={GiFarmTractor}
      description="Manage your farm profile, list products, and connect with local customers."
    />
  );
};

export default FarmerDashboard;