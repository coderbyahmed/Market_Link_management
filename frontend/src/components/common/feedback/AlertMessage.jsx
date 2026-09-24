import { Alert } from "antd";

const AlertMessage = ({ type = "info", message, description, ...rest }) => {
  return (
    <Alert type={type} message={message} description={description} showIcon {...rest} />
  );
};

export default AlertMessage;