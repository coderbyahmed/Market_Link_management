import { FaShoppingBasket } from "react-icons/fa";
import { GiFarmTractor } from "react-icons/gi";
import Header from "../../components/common/Header.jsx";
import Footer from "../../components/common/Footer.jsx";
import RoleCards from "../../components/auth/RoleCards.jsx";

const options = [
  {
    role: "Farmer",
    description: "Create your farm profile and connect with customers.",
    actionLabel: "Join as Farmer",
    to: "/signup/farmer",
    icon: GiFarmTractor,
    accent: "bg-brand-100 text-brand-700",
    badge: "bg-brand-700 text-white",
    hover: "hover:border-brand-400",
  },
  {
    role: "Customer",
    description: "Discover fresh products and connect with local farmers.",
    actionLabel: "Join as Customer",
    to: "/signup/customer",
    icon: FaShoppingBasket,
    accent: "bg-amber-100 text-amber-700",
    badge: "bg-amber-600 text-white",
    hover: "hover:border-amber-400",
  },
];

const GetStarted = () => {
  return (
    <div className="min-h-screen">
      <Header />
      <main>
        <RoleCards
          eyebrow="Get Started"
          title="Join MarketLink"
          description="Pick your role to join MarketLink. Already registered? Log in to continue."
          options={options}
        />
      </main>
      <Footer />
    </div>
  );
};

export default GetStarted;