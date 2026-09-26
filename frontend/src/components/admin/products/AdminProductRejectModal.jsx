import { Modal, Form, Input } from "antd";
import Button from "../../common/Button.jsx";
import AdminProductImage from "./AdminProductImage.jsx";

const AdminProductRejectModal = ({
  product,
  open,
  saving = false,
  onCancel,
  onConfirm,
}) => {
  const [form] = Form.useForm();

  if (!product) return null;

  const handleFinish = (values) => {
    onConfirm(values.reason);
  };

  return (
    <Modal
      open={open}
      title="Reject Product"
      onCancel={onCancel}
      footer={null}
      centered
      destroyOnHidden
    >
      <div className="mt-3 flex items-center gap-4 rounded-xl border border-stone-200 bg-stone-50 p-3 dark:border-stone-800 dark:bg-stone-800/60">
        <AdminProductImage src={product.image} name={product.name} className="h-14 w-14" />
        <div className="min-w-0">
          <p className="truncate font-medium text-stone-800 dark:text-stone-200">
            {product.name}
          </p>
          <p className="truncate text-xs text-stone-500 dark:text-stone-400">
            {product.farmerName || "—"}
          </p>
        </div>
      </div>

      <Form form={form} layout="vertical" onFinish={handleFinish} className="mt-4">
        <Form.Item
          label="Rejection Reason"
          name="reason"
          rules={[
            {
              required: true,
              whitespace: true,
              message: "Rejection reason is required",
            },
            {
              min: 10,
              message: "Please provide a descriptive reason (at least 10 characters)",
            },
          ]}
        >
          <Input.TextArea
            rows={4}
            maxLength={500}
            showCount
            placeholder="e.g. Product information is incomplete. Please provide clearer product details."
          />
        </Form.Item>

        <div className="flex flex-wrap justify-end gap-3 pt-1">
          <Button variant="outline" onClick={onCancel} disabled={saving}>
            Cancel
          </Button>
          <Button
            type="submit"
            className="!border-red-300 !bg-red-600 hover:!bg-red-700"
            loading={saving}
          >
            Reject Product
          </Button>
        </div>
      </Form>
    </Modal>
  );
};

export default AdminProductRejectModal;