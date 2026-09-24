import { FaUserShield, FaShoppingBasket } from "react-icons/fa";
import { GiFarmTractor } from "react-icons/gi";
import Header from "../../components/common/Header.jsx";
import Footer from "../../components/common/Footer.jsx";
import RoleCards from "../../components/auth/RoleCards.jsx";

const options = [
  {
    role: "Admin",
    description: "Manage and monitor the MarketLink platform.",
    actionLabel: "Continue as Admin",
    to: "/login/admin",
    icon: FaUserShield,
    accent: "bg-stone-100 text-stone-700",
    badge: "bg-stone-900 text-white",
    hover: "hover:border-stone-400",
  },
  {
    role: "Farmer",
    description: "Create your farm profile and connect with customers.",
    actionLabel: "Continue as Farmer",
    to: "/login/farmer",
    icon: GiFarmTractor,
    accent: "bg-brand-100 text-brand-700",
    badge: "bg-brand-700 text-white",
    hover: "hover:border-brand-400",
  },
  {
    role: "Customer",
    description: "Discover fresh products and connect with local farmers.",
    actionLabel: "Continue as Customer",
    to: "/login/customer",
    icon: FaShoppingBasket,
    accent: "bg-amber-100 text-amber-700",
    badge: "bg-amber-600 text-white",
    hover: "hover:border-amber-400",
  },
];

const LoginSelect = () => {
  return (
    <div className="min-h-screen">
      <Header />
      <main>
        <RoleCards
          eyebrow="Login"
          title="Who's logging in?"
          description="Choose your role to continue to your dashboard."
          options={options}
        />
      </main>
      <Footer />
    </div>
  );
};

export default LoginSelect;