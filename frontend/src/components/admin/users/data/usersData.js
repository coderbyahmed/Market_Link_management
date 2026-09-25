export const getUserCombinedStatus = (user) => {
  if (user.role === "farmer" && user.approvalStatus === "pending") {
    return "pending";
  }
  return user.accountStatus;
};

export const CONFIRM_META = {
  approve: {
    title: "Approve Farmer?",
    message:
      "Are you sure you want to approve this farmer account? Once approved, the farmer will be allowed to log in.",
    confirmText: "Approve",
    danger: false,
  },
  activate: {
    title: "Activate Farmer Account?",
    message: "This will allow the farmer to log in again.",
    confirmText: "Activate Account",
    danger: false,
  },
  deactivate: {
    title: "Deactivate Farmer Account?",
    message:
      "This will prevent the farmer from logging in until the account is activated again.",
    confirmText: "Deactivate Account",
    danger: true,
  },
};

export const CONFIRM_SUCCESS_MESSAGES = {
  activate: "Farmer account activated successfully.",
  deactivate: "Farmer account deactivated successfully.",
};