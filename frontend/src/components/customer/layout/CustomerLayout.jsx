import { Outlet } from "react-router-dom";
import CustomerNavbar from "./CustomerNavbar.jsx";
import CustomerFooter from "./CustomerFooter.jsx";
import { useSessionGuard } from "../../../hooks/useSessionGuard.js";

const CustomerLayout = () => {
  // Session guard: destroys session on browser back/forward
  useSessionGuard({ loginPath: "/login/customer" });
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