import {
    getAdminProfile,
    updateAdminProfile,
    changeAdminPassword,
    uploadAdminProfileImage,
    removeAdminProfileImage,
} from "../services/adminProfile.service.js";

const getProfile = async (req, res) => {
    const data = await getAdminProfile(req.user.id);

    return res.status(200).json({
        success: true,
        message: "Admin profile fetched successfully",
        data,
    });
};

const updateProfile = async (req, res) => {
    const data = await updateAdminProfile(req.user.id, req.body);

    return res.status(200).json({
        success: true,
        message: "Admin profile updated successfully",
        data,
    });
};

const uploadImage = async (req, res) => {
    const data = await uploadAdminProfileImage(req.user.id, req.file);

    return res.status(200).json({
        success: true,
        message: "Profile picture uploaded successfully",
        data,
    });
};

const removeImage = async (req, res) => {
    await removeAdminProfileImage(req.user.id);

    return res.status(200).json({
        success: true,
        message: "Profile picture removed successfully",
    });
};

const updatePassword = async (req, res) => {
    await changeAdminPassword(req.user.id, req.body);

    return res.status(200).json({
        success: true,
        message: "Password updated successfully",
    });
};

export {
    getProfile,
    updateProfile,
    uploadImage,
    removeImage,
    updatePassword,
};