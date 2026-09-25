import { useCallback, useState } from "react";
import { FarmerProfileImageContext } from "./farmerProfileImageContext.js";

const STORAGE_KEY = "marketlink_farmer_avatar";

export const FarmerProfileImageProvider = ({ children }) => {
  const [savedProfileImage, setSavedProfileImage] = useState(
    () => localStorage.getItem(STORAGE_KEY) || null
  );

  const updateSavedImage = useCallback((dataUrl) => {
    setSavedProfileImage(dataUrl);
    localStorage.setItem(STORAGE_KEY, dataUrl);
  }, []);

  const clearSavedImage = useCallback(() => {
    setSavedProfileImage(null);
    localStorage.removeItem(STORAGE_KEY);
  }, []);

  return (
    <FarmerProfileImageContext.Provider
      value={{ savedProfileImage, updateSavedImage, clearSavedImage }}
    >
      {children}
    </FarmerProfileImageContext.Provider>
  );
};
