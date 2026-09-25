import { useContext } from "react";
import { FarmerProfileImageContext } from "./farmerProfileImageContext.js";

export const useFarmerProfileImage = () => {
  const context = useContext(FarmerProfileImageContext);
  if (!context) {
    throw new Error("useFarmerProfileImage must be used within a FarmerProfileImageProvider");
  }
  return context;
};