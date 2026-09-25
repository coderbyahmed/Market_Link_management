import { Avatar } from "antd";
import { useNavigate } from "react-router-dom";
import { GiFarmTractor } from "react-icons/gi";
import { useFarmerProfileImage } from "../../../hooks/useFarmerProfileImage.js";

const FarmerProfileMenu = () => {
  const navigate = useNavigate();
  const { savedProfileImage } = useFarmerProfileImage();

  const handleClick = () => {
    navigate("/farmer/settings?tab=profile");
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      aria-label="Go to profile settings"
      className="flex items-center justify-center h-9 w-9 rounded-xl transition-colors hover:bg-stone-100 dark:hover:bg-stone-800"
    >
      {savedProfileImage ? (
        <Avatar size={36} src={savedProfileImage} className="!rounded-full" />
      ) : (
        <Avatar size={36} className="!bg-brand-700" icon={<GiFarmTractor />} />
      )}
    </button>
  );
};

export default FarmerProfileMenu;