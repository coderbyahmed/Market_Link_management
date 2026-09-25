import { useEffect, useState } from "react";
import { Spin } from "antd";
import { FaSignOutAlt } from "react-icons/fa";
import AdminLayout from "../../../components/admin/layout/AdminLayout.jsx";
import AdminProfileHeader from "../../../components/admin/profile/AdminProfileHeader.jsx";
import AdminProfileOverview from "../../../components/admin/profile/AdminProfileOverview.jsx";
import AdminProfileInfo from "../../../components/admin/profile/AdminProfileInfo.jsx";
import AdminProfileImage from "../../../components/admin/profile/AdminProfileImage.jsx";
import AdminSecurity from "../../../components/admin/profile/AdminSecurity.jsx";
import AdminActivity from "../../../components/admin/profile/AdminActivity.jsx";
import Button from "../../../components/common/Button.jsx";
import useLogout from "../../../hooks/useLogout.js";
import { showSuccess, showError } from "../../../components/common/feedback/MessageProvider.jsx";
import { useAdminProfileImage } from "../../../hooks/useAdminProfileImage.js";
import {
  getAdminProfile,
  updateAdminProfile,
  uploadAdminProfileImage,
  removeAdminProfileImage,
} from "../../../services/adminProfile.service.js";
import { updateStoredUser } from "../../../utils/auth.js";

const mapProfile = (data) => ({
  name: data?.name || "",
  email: data?.email || "",
  phone: data?.phone || "",
  role: data?.role === "admin" ? "Administrator" : data?.role || "",
  status: data?.isActive ? "Active" : "Inactive",
  createdAt: data?.createdAt || "",
  updatedAt: data?.updatedAt || "",
});

const AdminProfile = () => {
  const { savedProfileImage, updateSavedImage, clearSavedImage } =
    useAdminProfileImage();
  const [loadingProfile, setLoadingProfile] = useState(true);
  const [pendingProfileImage, setPendingProfileImage] = useState(null);
  const [pendingProfileFile, setPendingProfileFile] = useState(null);
  const [savingImage, setSavingImage] = useState(false);
  const [removingImage, setRemovingImage] = useState(false);
  const [profile, setProfile] = useState(mapProfile(null));
  const [editOpen, setEditOpen] = useState(false);
  const logout = useLogout();

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const data = await getAdminProfile();

        setProfile(mapProfile(data));

        if (data?.profileImage) {
          updateSavedImage(data.profileImage);
        } else {
          clearSavedImage();
        }
      } catch {
        showError("Unable to load your admin profile. Please try again.");
      } finally {
        setLoadingProfile(false);
      }
    };

    loadProfile();
  }, [clearSavedImage, updateSavedImage]);

  const openEdit = () => setEditOpen(true);
  const closeEdit = () => setEditOpen(false);

  const handleSaveProfile = async ({ name, email, phone }) => {
    const data = await updateAdminProfile({ name, email, phone });

    setProfile(mapProfile(data));
    updateStoredUser({ name: data.name, email: data.email });
  };

  const handleSelectImage = (previewUrl, file) => {
    setPendingProfileImage(previewUrl);
    setPendingProfileFile(file);
  };

  const handleSavePicture = async () => {
    if (!pendingProfileFile || savingImage) return;

    setSavingImage(true);

    try {
      const data = await uploadAdminProfileImage(pendingProfileFile);

      updateSavedImage(data.profileImage);
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
      await removeAdminProfileImage();

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
      <AdminLayout>
        <div className="flex min-h-[50vh] items-center justify-center">
          <Spin size="large" />
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        <AdminProfileHeader />

        <AdminProfileOverview
          profile={profile}
          imageUrl={savedProfileImage}
          onEdit={openEdit}
        />

        <div className="grid gap-6 lg:grid-cols-2">
          <AdminProfileInfo
            profile={profile}
            open={editOpen}
            onOpen={openEdit}
            onClose={closeEdit}
            onSave={handleSaveProfile}
          />
          <AdminProfileImage
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
          <AdminSecurity />
          <AdminActivity profile={profile} />
        </div>

        <div className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-stone-200/70 bg-white p-6 shadow-sm dark:border-stone-800 dark:bg-stone-900">
          <div>
            <h2 className="font-display text-lg font-semibold tracking-tight text-stone-900 dark:text-white">
              Account Actions
            </h2>
            <p className="mt-0.5 text-sm text-stone-500 dark:text-stone-400">
              Log out of your admin session.
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
    </AdminLayout>
  );
};

export default AdminProfile;