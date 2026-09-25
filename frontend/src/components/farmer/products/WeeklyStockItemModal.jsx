import { Modal, Form, Select, InputNumber } from "antd";
import Button from "../../common/Button.jsx";
import {
  WEEK_DAYS,
  UNITS,
  AVAILABILITY_OPTIONS,
} from "./data/productOptions.js";

const WeeklyStockItemModal = ({
  open,
  item,
  defaultDay = "Monday",
  products = [],
  saving = false,
  onClose,
  onSubmit,
}) => {
  const [form] = Form.useForm();

  if (!open) return null;

  const handleFinish = (values) => {
    const product = products.find(
      (entry) => entry.id === values.productId
    );

    onSubmit({
      ...values,
      productName: product ? product.name : values.productName,
    });
  };

  const handleProductChange = (productId) => {
    const product = products.find((entry) => entry.id === productId);

    if (product) {
      form.setFieldsValue({ price: product.price, unit: product.unit });
    }
  };

  return (
    <Modal
      open={open}
      title={item ? "Edit Stock Item" : "Add Product to Day"}
      onCancel={onClose}
      footer={null}
      centered
      destroyOnHidden
    >
      <div className="mt-2">
        <Form
          key={item ? item.id : `new-${defaultDay}`}
          form={form}
          layout="vertical"
          initialValues={{
            day: item?.day || defaultDay,
            productId: item?.productId,
            quantity: item?.quantity,
            unit: item?.unit || "kg",
            price: item?.price,
            availability: item?.availability || "available",
          }}
          onFinish={handleFinish}
          scrollToFirstError
        >
          <Form.Item
            label="Day"
            name="day"
            rules={[{ required: true, message: "Please select a day" }]}
          >
            <Select
              options={WEEK_DAYS.map((day) => ({ value: day, label: day }))}
              placeholder="Select day"
            />
          </Form.Item>

          <Form.Item
            label="Product"
            name="productId"
            rules={[{ required: true, message: "Please select a product" }]}
          >
            <Select
              showSearch
              optionFilterProp="label"
              placeholder="Select product"
              options={products.map((product) => ({
                value: product.id,
                label: product.name,
              }))}
              onChange={handleProductChange}
            />
          </Form.Item>

          <div className="grid gap-4 sm:grid-cols-2">
            <Form.Item
              label="Quantity"
              name="quantity"
              rules={[
                { required: true, message: "Please enter the quantity" },
                { type: "number", min: 0, message: "Quantity cannot be negative" },
              ]}
            >
              <InputNumber
                min={0}
                precision={0}
                placeholder="e.g. 30"
                style={{ width: "100%" }}
              />
            </Form.Item>

            <Form.Item
              label="Unit"
              name="unit"
              rules={[{ required: true, message: "Please select a unit" }]}
            >
              <Select placeholder="Select unit" options={UNITS} />
            </Form.Item>

            <Form.Item
              label="Price"
              name="price"
              rules={[
                { required: true, message: "Please enter the price" },
                {
                  type: "number",
                  min: 0.01,
                  message: "Price must be greater than 0",
                },
              ]}
            >
              <InputNumber
                min={0.01}
                precision={2}
                placeholder="e.g. 250"
                style={{ width: "100%" }}
                addonAfter="Rs."
              />
            </Form.Item>

            <Form.Item
              label="Availability"
              name="availability"
              rules={[
                { required: true, message: "Please select availability" },
              ]}
            >
              <Select
                placeholder="Select availability"
                options={AVAILABILITY_OPTIONS}
              />
            </Form.Item>
          </div>

          <div className="flex flex-wrap justify-end gap-3 pt-1">
            <Button variant="outline" onClick={onClose} disabled={saving}>
              Cancel
            </Button>
            <Button type="submit" loading={saving}>
              {item ? "Save Changes" : "Add Stock Item"}
            </Button>
          </div>
        </Form>
      </div>
    </Modal>
  );
};

export default WeeklyStockItemModal;
