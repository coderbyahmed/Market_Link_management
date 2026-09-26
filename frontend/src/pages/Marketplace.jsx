import { Navigate } from "react-router-dom";
import { getUser } from "../utils/auth.js";

/**
 * The old "Marketplace Coming Soon" placeholder. The customer marketplace is
 * now live at /customer, so this route simply forwards customers onward
 * (asking them to log in first when needed).
 */
const Marketplace = () => {
  const target = getUser() ? "/customer" : "/login/customer";
  return <Navigate to={target} replace />;
};

export default Marketplace;