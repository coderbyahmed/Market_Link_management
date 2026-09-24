import { useContext } from "react";
import { AdminProfileImageContext } from "../context/adminProfileImageContext.js";

export const useAdminProfileImage = () => {
  const context = useContext(AdminProfileImageContext);
  if (!context) {
    throw new Error(
      "useAdminProfileImage must be used within AdminProfileImageProvider"
    );
  }
  return context;
};