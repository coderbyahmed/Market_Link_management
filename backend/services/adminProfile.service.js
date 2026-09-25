import User from "../models/User.model.js";
import cloudinary from "../config/Cloudinary.js";
import ApiError from "../utils/ApiError.js";

const PROFILE_IMAGE_FOLDER = "Market Link Management/admin profile image";
const ALLOWED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp"];
const MAX_IMAGE_SIZE_BYTES = 5 * 1024 * 1024;

const serializeProfile = (user) => ({
    id: user._id,
    name: user.name,
    email: user.email,
    phone: user.phone || "",
    role: user.role,
    isActive: user.isActive,
    isEmailVerified: user.isEmailVerified,
    profileImage: user.profileImage || "",
    profileImagePublicId: user.profileImagePublicId || "",
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
});

const getAdminProfile = async (userId) => {
    const user = await User.findById(userId);

    if (!user || user.role !== "admin") {
        throw new ApiError(404, "Admin profile not found");
    }

    return serializeProfile(user);
};

const updateAdminProfile = async (userId, { name, email, phone }) => {
    const user = await User.findById(userId);

    if (!user || user.role !== "admin") {
        throw new ApiError(404, "Admin profile not found");
    }

    const trimmedName = name.trim();
    const normalizedEmail = email.trim().toLowerCase();
    const normalizedPhone = typeof phone === "string" ? phone.trim() : "";

    if (!trimmedName) {
        throw new ApiError(400, "Full name cannot be empty");
    }

    if (!normalizedEmail) {
        throw new ApiError(400, "Email address is required");
    }

    const duplicate = await User.findOne({
        email: normalizedEmail,
        _id: { $ne: userId },
    });

    if (duplicate) {
        throw new ApiError(
            409,
            "This email address is already in use by another account"
        );
    }

    user.name = trimmedName;
    user.email = normalizedEmail;
    user.phone = normalizedPhone;

    await user.save();

    return serializeProfile(user);
};

const changeAdminPassword = async (
    userId,
    { currentPassword, newPassword }
) => {
    const user = await User.findById(userId).select("+password");

    if (!user || user.role !== "admin") {
        throw new ApiError(404, "Admin profile not found");
    }

    const isCurrentPasswordValid = await user.comparePassword(currentPassword);

    if (!isCurrentPasswordValid) {
        throw new ApiError(400, "Current password is incorrect");
    }

    user.password = newPassword;

    await user.save();

    return null;
};

const uploadAdminProfileImage = async (userId, file) => {
    const user = await User.findById(userId);

    if (!user || user.role !== "admin") {
        throw new ApiError(404, "Admin profile not found");
    }

    if (!file || !file.buffer) {
        throw new ApiError(400, "No image file was provided");
    }

    if (!ALLOWED_IMAGE_TYPES.includes(file.mimetype)) {
        throw new ApiError(
            400,
            "Unsupported image type. Only JPG, PNG and WEBP images are allowed"
        );
    }

    if (file.size > MAX_IMAGE_SIZE_BYTES) {
        throw new ApiError(400, "Image must be smaller than 5MB");
    }

    const oldPublicId = user.profileImagePublicId;

    let uploadResult;

    try {
        const dataUri = `data:${file.mimetype};base64,${file.buffer.toString(
            "base64"
        )}`;

        uploadResult = await cloudinary.uploader.upload(dataUri, {
            folder: PROFILE_IMAGE_FOLDER,
            resource_type: "image",
        });
    } catch (uploadError) {
        console.error("Cloudinary upload failed:", uploadError.message);
        throw new ApiError(
            500,
            "Unable to upload profile picture. Please try again"
        );
    }

    user.profileImage = uploadResult.secure_url;
    user.profileImagePublicId = uploadResult.public_id;

    await user.save();

    if (oldPublicId && oldPublicId !== uploadResult.public_id) {
        try {
            await cloudinary.uploader.destroy(oldPublicId, {
                resource_type: "image",
            });
        } catch (deletionError) {
            console.error(
                "Cloudinary old image deletion failed:",
                deletionError.message
            );
        }
    }

    return {
        profileImage: user.profileImage,
        profileImagePublicId: user.profileImagePublicId,
    };
};

const removeAdminProfileImage = async (userId) => {
    const user = await User.findById(userId);

    if (!user || user.role !== "admin") {
        throw new ApiError(404, "Admin profile not found");
    }

    const storedPublicId = user.profileImagePublicId;

    if (storedPublicId) {
        try {
            await cloudinary.uploader.destroy(storedPublicId, {
                resource_type: "image",
            });
        } catch (deletionError) {
            console.error(
                "Cloudinary image deletion failed:",
                deletionError.message
            );
        }
    }

    user.profileImage = "";
    user.profileImagePublicId = "";

    await user.save();

    return null;
};

export {
    getAdminProfile,
    updateAdminProfile,
    changeAdminPassword,
    uploadAdminProfileImage,
    removeAdminProfileImage,
};