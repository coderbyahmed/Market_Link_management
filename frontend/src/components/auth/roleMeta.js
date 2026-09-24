import { FaUserShield, FaShoppingBasket } from "react-icons/fa";
import { GiFarmTractor } from "react-icons/gi";

export const ROLES = ["admin", "farmer", "customer"];
export const SIGNUP_ROLES = ["farmer", "customer"];

export const roleMeta = {
  admin: {
    label: "Admin",
    capitalized: "Admin",
    icon: FaUserShield,
    tagline: "Monitor and manage the MarketLink platform.",
  },
  farmer: {
    label: "farmer",
    capitalized: "Farmer",
    icon: GiFarmTractor,
    tagline: "Grow your business and connect with customers.",
  },
  customer: {
    label: "customer",
    capitalized: "Customer",
    icon: FaShoppingBasket,
    tagline: "Discover fresh produce from local farmers.",
  },
};