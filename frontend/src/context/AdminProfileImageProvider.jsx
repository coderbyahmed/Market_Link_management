import { useCallback, useState } from "react";
import { AdminProfileImageContext } from "./adminProfileImageContext.js";

const STORAGE_KEY = "marketlink_admin_avatar";

export const AdminProfileImageProvider = ({ children }) => {
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
    <AdminProfileImageContext.Provider
      value={{ savedProfileImage, updateSavedImage, clearSavedImage }}
    >
      {children}
    </AdminProfileImageContext.Provider>
  );
};