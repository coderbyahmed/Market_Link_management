import { useEffect, useState } from "react";
import { Spin } from "antd";
import { FaSignOutAlt } from "react-icons/fa";
import FarmerProfileHeader from "./FarmerProfileHeader.jsx";
import FarmerProfileOverview from "./FarmerProfileOverview.jsx";
import FarmerProfileInfo from "./FarmerProfileInfo.jsx";
import FarmerProfileImage from "./FarmerProfileImage.jsx";
import FarmerSecurity from "./FarmerSecurity.jsx";
import FarmerActivity from "./FarmerActivity.jsx";
import Button from "../../common/Button.jsx";
import useLogout from "../../../hooks/useLogout.js";
import {
  showSuccess,
  showError,
} from "../../common/feedback/MessageProvider.jsx";
import { useFarmerProfileImage } from "../../../hooks/useFarmerProfileImage.js";
import { getFarmerProfile, updateFarmerProfile } from "../../../services/farmerProfile.service.js";

const mapProfile = (data) => ({
  name: data?.name || "",
  email: data?.email || "",
  phone: data?.phone || "",
  farmSpecialization: data?.farmSpecialization || "—",
  role: data?.role || "Farmer",
  status: data?.isActive === false ? "Inactive" : "Active",
  createdAt: data?.createdAt || "",
  updatedAt: data?.updatedAt || "",
});

const FarmerProfileContent = () => {
  const { savedProfileImage, updateSavedImage, clearSavedImage } =
    useFarmerProfileImage();
  const [loadingProfile, setLoadingProfile] = useState(true);
  const [pendingProfileImage, setPendingProfileImage] = useState(null);
  const [pendingProfileFile, setPendingProfileFile] = useState(null);
  const [savingImage, setSavingImage] = useState(false);
  const [removingImage, setRemovingImage] = useState(false);
  const [profile, setProfile] = useState(mapProfile(null));
  const [editOpen, setEditOpen] = useState(false);
  const logout = useLogout("farmer");

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const data = await getFarmerProfile();
        setProfile(mapProfile(data));
      } catch {
        showError("Unable to load your farmer profile. Please try again.");
      } finally {
        setLoadingProfile(false);
      }
    };

    loadProfile();
  }, []);

  const openEdit = () => setEditOpen(true);
  const closeEdit = () => setEditOpen(false);

  const handleSaveProfile = async ({ name, email, phone }) => {
    const data = await updateFarmerProfile({ name, email, phone });
    setProfile(mapProfile(data));
  };

  const handleSelectImage = (previewUrl, file) => {
    setPendingProfileImage(previewUrl);
    setPendingProfileFile(file);
  };

  const handleSavePicture = async () => {
    if (!pendingProfileFile || savingImage) return;

    setSavingImage(true);

    try {
      updateSavedImage(pendingProfileImage);
      setPendingProfileImage(null);
      setPendingProfileFile(null);
      showSuccess("Profile Picture Saved Successfully");
    } catch (error) {
      showError(error.message);
    } finally {
      setSavingImage(false);
    }
  };

  const handleRemovePicture = async () => {
    if (pendingProfileImage) {
      setPendingProfileImage(null);
      setPendingProfileFile(null);
      return;
    }

    if (!savedProfileImage || removingImage) return;

    setRemovingImage(true);

    try {
      clearSavedImage();
      showSuccess("Profile Picture Removed Successfully");
    } catch (error) {
      showError(error.message);
    } finally {
      setRemovingImage(false);
    }
  };

  if (loadingProfile) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <FarmerProfileHeader />

      <FarmerProfileOverview
        profile={profile}
        imageUrl={savedProfileImage}
        onEdit={openEdit}
      />

      <div className="grid gap-6 lg:grid-cols-2">
        <FarmerProfileInfo
          profile={profile}
          open={editOpen}
          onOpen={openEdit}
          onClose={closeEdit}
          onSave={handleSaveProfile}
        />
        <FarmerProfileImage
          savedProfileImage={savedProfileImage}
          pendingProfileImage={pendingProfileImage}
          onSelect={handleSelectImage}
          onSave={handleSavePicture}
          onRemove={handleRemovePicture}
          saving={savingImage}
          removing={removingImage}
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <FarmerSecurity />
        <FarmerActivity profile={profile} />
      </div>

      <div className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-stone-200/70 bg-white p-6 shadow-sm dark:border-stone-800 dark:bg-stone-900">
        <div>
          <h2 className="font-display text-lg font-semibold tracking-tight text-stone-900 dark:text-white">
            Account Actions
          </h2>
          <p className="mt-0.5 text-sm text-stone-500 dark:text-stone-400">
            Log out of your farmer session.
          </p>
        </div>
        <Button
          variant="outline"
          className="shrink-0 !border-red-300 !text-red-600 hover:!bg-red-50"
          onClick={logout}
        >
          <FaSignOutAlt className="h-4 w-4" /> Logout
        </Button>
      </div>
    </div>
  );
};

export default FarmerProfileContent;
