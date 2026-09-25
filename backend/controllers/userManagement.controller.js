import {
    getAllUsers,
    getFarmers,
    getUserById,
    approveFarmer,
    deactivateUserAccount,
    activateUserAccount,
} from "../services/userManagement.service.js";

const getAllUsersList = async (req, res) => {
    const data = await getAllUsers();

    return res.status(200).json({
        success: true,
        message: "Users fetched successfully",
        data,
    });
};

const getFarmersList = async (req, res) => {
    const data = await getFarmers();

    return res.status(200).json({
        success: true,
        message: "Farmers fetched successfully",
        data,
    });
};

const getUserDetails = async (req, res) => {
    const data = await getUserById(req.params.id);

    return res.status(200).json({
        success: true,
        message: "User details fetched successfully",
        data,
    });
};

const approveFarmerProfile = async (req, res) => {
    const { user, emailSent } = await approveFarmer(req.params.userId);

    return res.status(200).json({
        success: true,
        message: emailSent
            ? "Farmer account approved successfully"
            : "Farmer account approved, but the approval email could not be sent",
        data: { user, emailSent },
    });
};

const deactivateAccount = async (req, res) => {
    const user = await deactivateUserAccount(req.params.userId);

    return res.status(200).json({
        success: true,
        message: "Farmer account deactivated successfully",
        data: { user },
    });
};

const activateAccount = async (req, res) => {
    const user = await activateUserAccount(req.params.userId);

    return res.status(200).json({
        success: true,
        message: "Farmer account activated successfully",
        data: { user },
    });
};

export {
    getAllUsersList,
    getFarmersList,
    getUserDetails,
    approveFarmerProfile,
    deactivateAccount,
    activateAccount,
};