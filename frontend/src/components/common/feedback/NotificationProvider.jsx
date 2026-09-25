import { notification } from "antd";

const NOTIFICATION_PLACEMENT = "topRight";

const notify = (type, { message: title, description }) =>
  notification[type]({
    title,
    description,
    placement: NOTIFICATION_PLACEMENT,
  });

export const notifySuccess = (options) => notify("success", options);
export const notifyError = (options) => notify("error", options);
export const notifyWarning = (options) => notify("warning", options);
export const notifyInfo = (options) => notify("info", options);

export { NOTIFICATION_PLACEMENT };

export default {
  success: notifySuccess,
  error: notifyError,
  warning: notifyWarning,
  info: notifyInfo,
};