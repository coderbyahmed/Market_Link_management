import { useState } from "react";
import { Form, Input, InputNumber, Select, Upload } from "antd";
import { FaCloudUploadAlt, FaTrashAlt } from "react-icons/fa";
import { showError } from "../../common/feedback/MessageProvider.jsx";
import { CATEGORIES, UNITS, AVAILABILITY_OPTIONS } from "./data/productOptions.js";

const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp"];
const MAX_SIZE_MB = 5;

const ProductForm = ({
  form,
  initialValues = {},
  onSubmit,
  submitting = false,
  actions = null,
}) => {
  const [image, setImage] = useState(initialValues.image || "");
  const [imageError, setImageError] = useState("");

  const handleFinish = (values) => {
    if (!image) {
      setImageError("Please select a product image");
      return;
    }

    setImageError("");
    onSubmit({ ...values, image });
  };

  const handleFile = (file) => {
    if (!ALLOWED_TYPES.includes(file.type)) {
      showError("Only JPG, PNG and WEBP images are allowed.");
      return Upload.LIST_IGNORE;
    }

    if (file.size > MAX_SIZE_MB * 1024 * 1024) {
      showError("Image must be smaller than 5MB.");
      return Upload.LIST_IGNORE;
    }

    const reader = new FileReader();
    reader.onload = () => {
      setImage(reader.result);
      setImageError("");
    };
    reader.readAsDataURL(file);

    return false;
  };

  return (
    <Form
      form={form}
      layout="vertical"
      initialValues={initialValues}
      onFinish={handleFinish}
      scrollToFirstError
    >
      <Form.Item
        label="Product Image"
        validateStatus={imageError ? "error" : ""}
        help={imageError || undefined}
        required
      >
        {image ? (
          <div className="flex flex-wrap items-center gap-4 rounded-xl border border-stone-200 p-3 dark:border-stone-800">
            <img
              src={image}
              alt="Product preview"
              className="h-20 w-20 shrink-0 rounded-xl object-cover"
            />
            <div className="min-w-0">
              <p className="text-sm font-medium text-stone-700 dark:text-stone-300">
                Image selected
              </p>
              <p className="text-xs text-stone-500 dark:text-stone-400">
                JPG / PNG / WEBP up to 5MB
              </p>
            </div>
            <button
              type="button"
              onClick={() => setImage("")}
              disabled={submitting}
              className="ml-auto inline-flex items-center gap-1.5 rounded-lg border border-red-300 px-3 py-1.5 text-xs font-semibold text-red-600 transition-colors hover:bg-red-50 disabled:opacity-60 dark:border-red-900 dark:hover:bg-red-950"
            >
              <FaTrashAlt className="h-3 w-3" /> Remove
            </button>
          </div>
        ) : (
          <Upload
            accept="image/jpeg,image/png,image/webp"
            multiple={false}
            showUploadList={false}
            beforeUpload={handleFile}
          >
            <div className="flex w-full cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-stone-300 bg-stone-50 px-6 py-8 text-center transition-colors hover:border-brand-400 hover:bg-brand-50 dark:border-stone-700 dark:bg-stone-800/60 dark:hover:border-brand-500">
              <FaCloudUploadAlt className="h-8 w-8 text-brand-500" />
              <p className="mt-2 text-sm font-medium text-stone-700 dark:text-stone-300">
                Click or drag an image here
              </p>
              <p className="mt-1 text-xs text-stone-500 dark:text-stone-400">
                JPG / JPEG / PNG / WEBP
              </p>
            </div>
          </Upload>
        )}
      </Form.Item>

      <Form.Item
        label="Product Name"
        name="name"
        rules={[
          { required: true, whitespace: true, message: "Please enter the product name" },
          { min: 2, max: 80, message: "Product name must be between 2 and 80 characters" },
        ]}
      >
        <Input placeholder="e.g. Fresh Organic Tomatoes" />
      </Form.Item>

      <div className="grid gap-4 sm:grid-cols-2">
        <Form.Item
          label="Category"
          name="category"
          rules={[{ required: true, message: "Please select a category" }]}
        >
          <Select
            placeholder="Select category"
            options={CATEGORIES}
            showSearch
            optionFilterProp="label"
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
            step={1}
            precision={2}
            placeholder="e.g. 250"
            style={{ width: "100%" }}
            addonAfter="Rs."
          />
        </Form.Item>

        <Form.Item
          label="Available Quantity"
          name="quantity"
          rules={[
            { required: true, message: "Please enter the available quantity" },
            {
              type: "number",
              min: 0,
              message: "Quantity cannot be negative",
            },
          ]}
        >
          <InputNumber
            min={0}
            step={1}
            precision={0}
            placeholder="e.g. 45"
            style={{ width: "100%" }}
          />
        </Form.Item>

        <Form.Item
          label="Availability"
          name="availability"
          rules={[{ required: true, message: "Please select availability" }]}
          className="sm:col-span-2"
        >
          <Select placeholder="Select availability" options={AVAILABILITY_OPTIONS} />
        </Form.Item>
      </div>

      <Form.Item
        label="Description"
        name="description"
        rules={[
          { required: true, whitespace: true, message: "Please enter a description" },
          { min: 10, message: "Description must be at least 10 characters" },
        ]}
      >
        <Input.TextArea
          rows={4}
          maxLength={500}
          showCount
          placeholder="Describe quality, origin, packing and delivery details..."
        />
      </Form.Item>

      {actions && <div className="flex flex-wrap justify-end gap-3 pt-1">{actions}</div>}
    </Form>
  );
};

export default ProductForm;
