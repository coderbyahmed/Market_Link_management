import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Form } from "antd";
import { FaArrowLeft } from "react-icons/fa";
import PageHeader from "../common/PageHeader.jsx";
import ProductForm from "./ProductForm.jsx";
import Button from "../../common/Button.jsx";
import {
  showSuccess,
  showError,
} from "../../common/feedback/MessageProvider.jsx";
import {
  createProduct,
  uploadProductImage,
} from "../../../services/product.service.js";

const AddProductContent = () => {
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (values) => {
    if (submitting) return;

    setSubmitting(true);

    try {
      const { imageFile, ...rest } = values;

      const imagePayload = imageFile
        ? await uploadProductImage(imageFile)
        : { image: rest.image || "", imagePublicId: rest.imagePublicId || "" };

      await createProduct({ ...rest, ...imagePayload });

      showSuccess(
        "Product added successfully. It is now pending admin review."
      );
      navigate("/farmer/products");
    } catch (error) {
      showError(error.message || "Unable to add the product");
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Add Product"
        description="Create a new listing with pricing, stock and availability details."
        actions={
          <Button
            variant="outline"
            onClick={() => navigate("/farmer/products")}
            disabled={submitting}
          >
            <FaArrowLeft className="h-3.5 w-3.5" /> All Products
          </Button>
        }
      />

      <div className="rounded-2xl border border-stone-200/70 bg-white p-6 shadow-sm dark:border-stone-800 dark:bg-stone-900 sm:p-8">
        <div className="mx-auto max-w-3xl">
          <ProductForm
            form={form}
            initialValues={{ availability: "available", unit: "kg" }}
            submitting={submitting}
            onSubmit={handleSubmit}
            actions={
              <>
                <Button
                  variant="outline"
                  onClick={() => navigate("/farmer/products")}
                  disabled={submitting}
                >
                  Cancel
                </Button>
                <Button type="submit" loading={submitting}>
                  Add Product
                </Button>
              </>
            }
          />
        </div>
      </div>
    </div>
  );
};

export default AddProductContent;
