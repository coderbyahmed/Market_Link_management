import api, { getApiErrorMessage } from "./api.js";

const getAdminProfile = async () => {
  try {
    const response = await api.get("/api/admin/profile");
    return response.data?.data ?? null;
  } catch (error) {
    throw new Error(getApiErrorMessage(error), { cause: error });
  }
};

const updateAdminProfile = async ({ name, email, phone }) => {
  try {
    const response = await api.put("/api/admin/profile", {
      name,
      email,
      phone,
    });
    return response.data?.data ?? null;
  } catch (error) {
    throw new Error(getApiErrorMessage(error), { cause: error });
  }
};

const uploadAdminProfileImage = async (file) => {
  try {
    const formData = new FormData();
    formData.append("image", file);

    const response = await api.post("/api/admin/profile/image", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data?.data ?? null;
  } catch (error) {
    throw new Error(getApiErrorMessage(error), { cause: error });
  }
};

const removeAdminProfileImage = async () => {
  try {
    await api.delete("/api/admin/profile/image");
  } catch (error) {
    throw new Error(getApiErrorMessage(error), { cause: error });
  }
};

const changeAdminPassword = async ({
  currentPassword,
  newPassword,
  confirmPassword,
}) => {
  try {
    await api.put("/api/admin/profile/password", {
      currentPassword,
      newPassword,
      confirmPassword,
    });
  } catch (error) {
    throw new Error(getApiErrorMessage(error), { cause: error });
  }
};

export {
  getAdminProfile,
  updateAdminProfile,
  uploadAdminProfileImage,
  removeAdminProfileImage,
  changeAdminPassword,
};