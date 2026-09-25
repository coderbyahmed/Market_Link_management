import { Modal, Form } from "antd";
import ProductForm from "./ProductForm.jsx";
import Button from "../../common/Button.jsx";

const ProductFormModal = ({
  product,
  open,
  submitting = false,
  onClose,
  onSubmit,
}) => {
  const [form] = Form.useForm();

  if (!product) return null;

  return (
    <Modal
      open={open}
      title="Edit Product"
      onCancel={onClose}
      footer={null}
      width={720}
      centered
      destroyOnHidden
    >
      <div className="mt-2 max-h-[70vh] overflow-y-auto pr-1">
        <ProductForm
          key={product.id}
          form={form}
          initialValues={{
            name: product.name,
            category: product.category,
            unit: product.unit,
            price: product.price,
            quantity: product.quantity,
            availability: product.availability,
            description: product.description,
            image: product.image,
          }}
          submitting={submitting}
          onSubmit={(values) => onSubmit(values)}
          actions={
            <>
              <Button variant="outline" onClick={onClose} disabled={submitting}>
                Cancel
              </Button>
              <Button type="submit" loading={submitting}>
                Save Changes
              </Button>
            </>
          }
        />
      </div>
    </Modal>
  );
};

export default ProductFormModal;
