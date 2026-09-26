import { Outlet } from "react-router-dom";
import CustomerNavbar from "./CustomerNavbar.jsx";
import CustomerFooter from "./CustomerFooter.jsx";

const CustomerLayout = () => {
  return (
    <div className="min-h-screen bg-white">
      <CustomerNavbar />
      <main className="min-h-[60vh]">
        <Outlet />
      </main>
      <CustomerFooter />
    </div>
  );
};

export default CustomerLayout;