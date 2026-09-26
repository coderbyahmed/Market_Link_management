import { useEffect, useState } from "react";
import { Modal, Form, Rate, Input, Button } from "antd";
import { FaLeaf } from "react-icons/fa";
import { showSuccess, showError } from "../../common/feedback/MessageProvider.jsx";
import { addOrUpdateReview } from "../../../services/customerReview.service.js";

const ReviewModal = ({ open, onClose, product, existingReview }) => {
  const [form] = Form.useForm();
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (open) {
      form.setFieldsValue({
        rating: existingReview?.rating || 5,
        comment: existingReview?.text || "",
      });
    }
  }, [open, existingReview, form]);

  const handleSubmit = async (values) => {
    setSaving(true);

    try {
      await addOrUpdateReview({
        productId: product.id,
        rating: values.rating,
        text: values.comment,
      });
      showSuccess(
        existingReview
          ? "Your review has been updated"
          : "Thanks! Your review has been posted"
      );
      onClose(true);
    } catch (submitError) {
      showError(submitError.message || "Unable to save your review");
    } finally {
      setSaving(false);
    }
  };

  return (
    <Modal
      open={open}
      title={existingReview ? "Edit Your Review" : "Write a Review"}
      onCancel={() => onClose(false)}
      footer={null}
      destroyOnHidden
      width={480}
    >
      <div className="mb-5 flex items-center gap-3 rounded-xl bg-brand-50 p-3">
        <img
          src={product.image}
          alt={product.name}
          className="h-14 w-14 rounded-xl object-cover"
        />
        <div>
          <p className="font-semibold text-stone-900">{product.name}</p>
          <p className="text-xs text-stone-500">
            {product.unit} • {product.farmer?.name || "Local Farmer"}
          </p>
        </div>
      </div>

      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
        initialValues={{ rating: 5, comment: "" }}
        requiredMark={false}
      >
        <Form.Item
          label="Your rating"
          name="rating"
          rules={[{ required: true, message: "Please select a rating" }]}
        >
          <Rate className="custom-rate" />
        </Form.Item>

        <Form.Item
          label="Your review"
          name="comment"
          rules={[
            { required: true, message: "Please write a short review" },
            { min: 10, message: "Review should be at least 10 characters" },
            { max: 500, message: "Review cannot exceed 500 characters" },
          ]}
        >
          <Input.TextArea
            rows={4}
            maxLength={500}
            placeholder="Share what you liked about this product..."
            showCount
          />
        </Form.Item>

        <div className="mt-2 flex items-center justify-between">
          <p className="flex items-center gap-1.5 text-xs text-stone-500">
            <FaLeaf className="h-3 w-3 text-brand-600" />
            Reviews help farmers keep growing better produce.
          </p>
          <div className="flex gap-3">
            <Button onClick={() => onClose(false)}>Cancel</Button>
            <Button type="primary" htmlType="submit" loading={saving} className="!bg-brand-700">
              {existingReview ? "Update Review" : "Post Review"}
            </Button>
          </div>
        </div>
      </Form>
    </Modal>
  );
};

export default ReviewModal;