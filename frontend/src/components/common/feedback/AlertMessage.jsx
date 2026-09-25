import { Alert } from "antd";

const AlertMessage = ({ type = "info", message, description, ...rest }) => {
  return (
    <Alert type={type} title={message} description={description} showIcon {...rest} />
  );
};

export default AlertMessage;