import { Modal, Descriptions, Tag } from "antd";
import AdminProductImage from "./AdminProductImage.jsx";
import { AvailabilityBadge, StatusBadge } from "./AdminProductBadges.jsx";
import {
  categoryLabel,
  unitLabel,
  formatDate,
} from "./data/productMeta.js";

const AdminProductDetailsModal = ({ product, open, onClose }) => {
  if (!product) return null;

  return (
    <Modal
      open={open}
      title="Product Details"
      onCancel={onClose}
      footer={null}
      centered
      destroyOnHidden
      width={640}
    >
      <div className="mt-4 flex flex-col gap-4 sm:flex-row">
        <AdminProductImage
          src={product.image}
          name={product.name}
          className="h-36 w-full sm:h-32 sm:w-44"
        />
        <div className="min-w-0 flex-1">
          <h3 className="font-display text-xl font-semibold tracking-tight text-stone-900 dark:text-white">
            {product.name}
          </h3>
          <div className="mt-2 flex flex-wrap items-center gap-2">
            <StatusBadge status={product.status} />
            <AvailabilityBadge availability={product.availability} />
            <Tag className="!m-0 !rounded-full">{categoryLabel(product.category)}</Tag>
          </div>
          {product.description ? (
            <p className="mt-3 text-sm leading-relaxed text-stone-600 dark:text-stone-300">
              {product.description}
            </p>
          ) : (
            <p className="mt-3 text-sm italic text-stone-400 dark:text-stone-500">
              No description provided
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
            key: "farmer",
            label: "Farmer",
            children: (
              <div>
                <p className="text-stone-800 dark:text-stone-200">
                  {product.farmerName || "—"}
                </p>
                <p className="text-xs text-stone-500 dark:text-stone-400">
                  {product.farmerEmail}
                </p>
              </div>
            ),
          },
          {
            key: "category",
            label: "Category",
            children: categoryLabel(product.category),
          },
          {
            key: "price",
            label: "Price",
            children: `Rs. ${Number(product.price).toLocaleString()} / ${unitLabel(
              product.unit
            )}`,
          },
          {
            key: "stock",
            label: "Stock",
            children: `${product.quantity} ${unitLabel(product.unit)}`,
          },
          {
            key: "availability",
            label: "Availability",
            children: (
              <AvailabilityBadge availability={product.availability} />
            ),
          },
          {
            key: "status",
            label: "Status",
            children: <StatusBadge status={product.status} />,
          },
          ...(product.adminRemark
            ? [
                {
                  key: "adminRemark",
                  label: "Admin Remark",
                  children: (
                    <span className="text-red-600 dark:text-red-400">
                      {product.adminRemark}
                    </span>
                  ),
                },
              ]
            : []),
          {
            key: "submitted",
            label: "Submitted Date",
            children: formatDate(product.createdAt),
          },
          {
            key: "approvedAt",
            label: "Approved Date",
            children: formatDate(product.approvedAt),
          },
          {
            key: "rejectedAt",
            label: "Rejected Date",
            children: formatDate(product.rejectedAt),
          },
        ]}
      />
    </Modal>
  );
};

export default AdminProductDetailsModal;