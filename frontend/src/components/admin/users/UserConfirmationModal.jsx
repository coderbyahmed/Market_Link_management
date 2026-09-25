import { Modal } from "antd";

const UserConfirmationModal = ({
  open,
  title,
  message,
  confirmText = "Confirm",
  danger = false,
  confirmLoading = false,
  onCancel,
  onConfirm,
}) => {
  return (
    <Modal
      open={open}
      title={title}
      onCancel={onCancel}
      onOk={onConfirm}
      okText={confirmText}
      cancelText="Cancel"
      okButtonProps={{ danger }}
      confirmLoading={confirmLoading}
      centered
      destroyOnHidden
    >
      <p className="py-2 text-stone-600 dark:text-stone-300">{message}</p>
    </Modal>
  );
};

export default UserConfirmationModal;