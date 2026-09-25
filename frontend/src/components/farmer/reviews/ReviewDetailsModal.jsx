import { Modal, Rate, Descriptions } from "antd";
import Button from "../../common/Button.jsx";
import { formatShortDate } from "../../../utils/date.js";

const ReviewDetailsModal = ({ review, open, onClose }) => {
  return (
    <Modal
      title={
        review ? (
          <span className="flex items-center gap-2">
            {review.productName}
            <Rate disabled defaultValue={review.rating} className="text-amber-500" size={18} />
          </span>
        ) : (
          "Review Details"
        )
      }
      open={open}
      onClose={onClose}
      width={520}
      className="max-w-full"
      footer={
        <div className="flex items-center justify-end gap-2">
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
        </div>
      }
    >
      {review && (
        <div className="space-y-5">
          <section className="rounded-2xl border border-stone-200/70 p-4 dark:border-stone-800">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-100 text-brand-700 dark:bg-brand-950 dark:text-brand-400">
                {review.customer.name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")
                  .toUpperCase()
                  .slice(0, 2)}
              </div>
              <div>
                <p className="font-medium text-stone-800 dark:text-stone-200">
                  {review.customer.name}
                </p>
                <p className="text-sm text-stone-500 dark:text-stone-400">
                  {formatShortDate(review.createdAt)}
                </p>
              </div>
            </div>
          </section>

          <section>
            <p className="text-xs font-semibold uppercase tracking-wide text-stone-500 dark:text-stone-400">
              Review
            </p>
            <p className="mt-2 whitespace-pre-wrap text-stone-700 dark:text-stone-300">
              {review.comment}
            </p>
          </section>

          {review.response && (
            <section className="rounded-2xl border border-emerald-200/70 bg-emerald-50 p-4 dark:border-emerald-900/30 dark:bg-emerald-950">
              <p className="text-xs font-semibold uppercase tracking-wide text-emerald-700 dark:text-emerald-400">
                Your Response
              </p>
              <p className="mt-2 whitespace-pre-wrap text-stone-700 dark:text-stone-300">
                {review.response.text}
              </p>
              <p className="mt-2 text-xs text-emerald-600 dark:text-emerald-400">
                Responded on {formatShortDate(review.response.createdAt)}
              </p>
            </section>
          )}

          <Descriptions
            column={1}
            size="small"
            labelStyle={{ color: "inherit" }}
            items={[
              {
                key: "product",
                label: "Product",
                children: review.productName,
              },
            ]}
          />
        </div>
      )}
    </Modal>
  );
};

export default ReviewDetailsModal;