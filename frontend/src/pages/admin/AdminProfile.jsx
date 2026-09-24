import { useState } from "react";
import { FaSignOutAlt } from "react-icons/fa";
import AdminLayout from "../../components/admin/layout/AdminLayout.jsx";
import AdminProfileHeader from "../../components/admin/profile/AdminProfileHeader.jsx";
import AdminProfileOverview from "../../components/admin/profile/AdminProfileOverview.jsx";
import AdminProfileInfo from "../../components/admin/profile/AdminProfileInfo.jsx";
import AdminProfileImage from "../../components/admin/profile/AdminProfileImage.jsx";
import AdminSecurity from "../../components/admin/profile/AdminSecurity.jsx";
import AdminActivity from "../../components/admin/profile/AdminActivity.jsx";
import Button from "../../components/common/Button.jsx";
import useLogout from "../../hooks/useLogout.js";
import { showSuccess } from "../../components/common/feedback/MessageProvider.jsx";
import { useAdminProfileImage } from "../../hooks/useAdminProfileImage.js";

const adminProfile = {
  name: "Muhammad Ahmed",
  email: "admin@marketlink.com",
  phone: "+92 300 1234567",
  role: "Administrator",
  status: "Active",
  accountCreated: "September 20, 2026",
  lastLogin: "Today, 08:15 PM",
  lastPasswordChange: "September 20, 2026",
};

const AdminProfile = () => {
  const { savedProfileImage, updateSavedImage, clearSavedImage } =
    useAdminProfileImage();
  const [pendingProfileImage, setPendingProfileImage] = useState(null);
  const [savingImage, setSavingImage] = useState(false);
  const [profile, setProfile] = useState(adminProfile);
  const [editOpen, setEditOpen] = useState(false);
  const logout = useLogout();

  const openEdit = () => setEditOpen(true);
  const closeEdit = () => setEditOpen(false);

  const handleSaveProfile = (next) => setProfile(next);

  const handleSavePicture = () => {
    if (!pendingProfileImage || savingImage) return;

    setSavingImage(true);

    setTimeout(() => {
      updateSavedImage(pendingProfileImage);
      setPendingProfileImage(null);
      setSavingImage(false);
      showSuccess("Profile Picture Saved Successfully");
    }, 900);
  };

  const handleRemovePicture = () => {
    if (pendingProfileImage) {
      setPendingProfileImage(null);
    } else if (savedProfileImage) {
      clearSavedImage();
    }
  };

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
            onSelect={setPendingProfileImage}
            onSave={handleSavePicture}
            onRemove={handleRemovePicture}
            saving={savingImage}
          />
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <AdminSecurity />
          <AdminActivity />
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