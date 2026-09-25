import { getUser, updateStoredUser } from "../utils/auth.js";

const getFarmerProfile = async () => {
  const user = getUser();

  if (!user) {
    throw new Error("No farmer session found. Please log in again.");
  }

  return {
    name: user.name || "",
    email: user.email || "",
    phone: user.phone || "",
    role: user.role === "farmer" ? "Farmer" : user.role || "Farmer",
    isActive: user.isActive ?? true,
    farmSpecialization: user.farmSpecialization || "",
    createdAt: user.createdAt || "",
    updatedAt: user.updatedAt || "",
  };
};

const updateFarmerProfile = async ({ name, email, phone }) => {
  const user = getUser();

  if (!user) {
    throw new Error("No farmer session found. Please log in again.");
  }

  updateStoredUser({ name, email, phone });

  return getFarmerProfile();
};

export { getFarmerProfile, updateFarmerProfile };
