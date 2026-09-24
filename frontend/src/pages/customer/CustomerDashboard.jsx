import { FaShoppingBasket } from "react-icons/fa";
import DashboardPlaceholder from "../../components/common/DashboardPlaceholder.jsx";

const CustomerDashboard = () => {
  return (
    <DashboardPlaceholder
      role="Customer"
      icon={FaShoppingBasket}
      description="Browse fresh products, follow your favorite farms, and order locally grown food."
    />
  );
};

export default CustomerDashboard;