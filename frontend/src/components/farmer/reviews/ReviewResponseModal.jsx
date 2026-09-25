import { useState } from "react";
import { Modal, Input } from "antd";
import { showError } from "../../common/feedback/MessageProvider.jsx";

const ReviewResponseModal = ({
  review,
  open,
  onClose,
  onSubmit,
}) => {
  const [response, setResponse] = useState(review?.response?.text || "");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!response.trim()) {
      showError("Please enter a response.");
      return;
    }

    setSubmitting(true);
    try {
      await onSubmit(review.id, response.trim());
      setResponse("");
      onClose();
    } catch (error) {
      showError(error.message || "Unable to submit response");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal
      open={open}
      title={
        review
          ? `Respond to ${review.customer.name}'s review`
          : "Respond to Review"
      }
      onCancel={onClose}
      onOk={handleSubmit}
      okText={review?.response ? "Update Response" : "Post Response"}
      cancelText="Cancel"
      confirmLoading={submitting}
      width={520}
      centered
      destroyOnHidden
    >
      <div className="space-y-4 py-2">
        <div className="rounded-xl border border-stone-200/70 bg-stone-50 p-4 dark:border-stone-800 dark:bg-stone-950">
          <p className="text-xs font-semibold uppercase tracking-wide text-stone-500 dark:text-stone-400">
            Customer Review
          </p>
          <p className="mt-2 whitespace-pre-wrap text-stone-700 dark:text-stone-300">
            {review?.comment}
          </p>
          <p className="mt-2 text-xs text-stone-500 dark:text-stone-400">
            {review?.customer.name} • {review?.productName} •{" "}
            {review?.rating}★
          </p>
        </div>

        <div>
          <label
            htmlFor="response-text"
            className="mb-1.5 block text-sm font-medium text-stone-600 dark:text-stone-400"
          >
            Your Response
          </label>
          <Input.TextArea
            id="response-text"
            value={response}
            onChange={(e) => setResponse(e.target.value)}
            rows={4}
            placeholder="Write your response to the customer..."
            className="w-full"
          />
          <p className="mt-1 text-xs text-stone-500 dark:text-stone-400">
            Be professional and helpful. Your response will be visible to customers.
          </p>
        </div>
      </div>
    </Modal>
  );
};

export default ReviewResponseModal;