import { message } from "antd";

export const showSuccess = (content) => message.success(content);
export const showError = (content) => message.error(content);
export const showWarning = (content) => message.warning(content);
export const showInfo = (content) => message.info(content);

export default {
  showSuccess,
  showError,
  showWarning,
  showInfo,
};