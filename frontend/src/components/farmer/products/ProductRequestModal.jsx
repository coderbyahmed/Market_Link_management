import { Modal, Descriptions } from "antd";
import ProductImage from "./ProductImage.jsx";
import StatusBadge from "./StatusBadge.jsx";
import Button from "../../common/Button.jsx";
import { formatJoinedDate } from "../../../utils/date.js";
import {
  categoryLabel,
  unitLabel,
  statusLabel,
} from "./data/productOptions.js";

const ProductRequestModal = ({
  request,
  open,
  onClose,
  onResubmit,
  resubmitting = false,
}) => {
  if (!request) return null;

  const isRejected = request.status === "rejected";

  return (
    <Modal
      open={open}
      title="Request Details"
      onCancel={onClose}
      footer={
        <div className="flex flex-wrap items-center justify-end gap-2">
          <Button variant="outline" onClick={onClose} disabled={resubmitting}>
            Close
          </Button>
          {isRejected && (
            <Button onClick={() => onResubmit(request)} loading={resubmitting}>
              Resubmit Request
            </Button>
          )}
        </div>
      }
      centered
      destroyOnHidden
    >
      <div className="mt-4">
        <div className="flex flex-col gap-4 sm:flex-row">
          <ProductImage
            src={request.image || ""}
            name={request.productName}
            className="h-32 w-full sm:h-28 sm:w-40"
          />
          <div className="min-w-0 flex-1">
            <h3 className="font-display text-xl font-semibold tracking-tight text-stone-900 dark:text-white">
              {request.productName}
            </h3>
            <div className="mt-2 flex flex-wrap items-center gap-2">
              <StatusBadge status={request.status} />
              <span className="text-xs font-medium uppercase tracking-wide text-stone-500 dark:text-stone-400">
                {request.type}
              </span>
            </div>
            {request.description && (
              <p className="mt-3 text-sm leading-relaxed text-stone-600 dark:text-stone-300">
                {request.description}
              </p>
            )}
          </div>
        </div>

        <Descriptions
          className="mt-5"
          column={1}
          bordered
          size="small"
          items={[
            {
              key: "category",
              label: "Category",
              children: categoryLabel(request.category),
            },
            {
              key: "price",
              label: "Price",
              children: `Rs. ${Number(request.price).toLocaleString()} / ${unitLabel(request.unit)}`,
            },
            {
              key: "submitted",
              label: "Submitted Date",
              children: formatJoinedDate(request.submittedAt),
            },
            {
              key: "type",
              label: "Request Type",
              children: request.type,
            },
            {
              key: "status",
              label: "Current Status",
              children: statusLabel(request.status),
            },
            {
              key: "remark",
              label: "Admin Remark",
              children: request.remark ? (
                <span
                  className={
                    isRejected
                      ? "text-red-600 dark:text-red-400"
                      : "text-stone-600 dark:text-stone-300"
                  }
                >
                  {request.remark}
                </span>
              ) : (
                "—"
              ),
            },
          ]}
        />

        {isRejected && (
          <p className="mt-4 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700 dark:bg-red-950/50 dark:text-red-300">
            This request was rejected. Update the product information and
            resubmit it for review.
          </p>
        )}
      </div>
    </Modal>
  );
};

export default ProductRequestModal;
