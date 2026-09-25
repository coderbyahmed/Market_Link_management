import { Modal, Descriptions } from "antd";
import ProductImage from "./ProductImage.jsx";
import AvailabilityBadge from "./AvailabilityBadge.jsx";
import StatusBadge from "./StatusBadge.jsx";
import Button from "../../common/Button.jsx";
import { formatJoinedDate } from "../../../utils/date.js";
import { categoryLabel, unitLabel } from "./data/productOptions.js";

const ProductDetailsModal = ({ product, open, onClose, onEdit }) => {
  if (!product) return null;

  const hasRemark = Boolean(product.adminRemark);

  return (
    <Modal
      open={open}
      title="Product Details"
      onCancel={onClose}
      footer={
        <div className="flex flex-wrap items-center justify-end gap-2">
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
          <Button onClick={() => onEdit(product)}>Edit Product</Button>
        </div>
      }
      centered
      destroyOnHidden
    >
      <div className="mt-4">
        <div className="flex flex-col gap-4 sm:flex-row">
          <ProductImage
            src={product.image}
            name={product.name}
            className="h-36 w-full sm:h-32 sm:w-44"
          />
          <div className="min-w-0 flex-1">
            <h3 className="font-display text-xl font-semibold tracking-tight text-stone-900 dark:text-white">
              {product.name}
            </h3>
            <div className="mt-2 flex flex-wrap items-center gap-2">
              <AvailabilityBadge availability={product.availability} />
              <StatusBadge status={product.status} />
            </div>
            <p className="mt-3 text-sm leading-relaxed text-stone-600 dark:text-stone-300">
              {product.description}
            </p>
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
              children: categoryLabel(product.category),
            },
            {
              key: "price",
              label: "Price",
              children: `Rs. ${Number(product.price).toLocaleString()} / ${unitLabel(product.unit)}`,
            },
            {
              key: "quantity",
              label: "Available Quantity",
              children: `${product.quantity} ${unitLabel(product.unit)}`,
            },
            {
              key: "availability",
              label: "Availability",
              children: <AvailabilityBadge availability={product.availability} />,
            },
            {
              key: "status",
              label: "Status",
              children: <StatusBadge status={product.status} />,
            },
            ...(hasRemark
              ? [
                  {
                    key: "remark",
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
              key: "created",
              label: "Created",
              children: formatJoinedDate(product.createdAt),
            },
            {
              key: "updated",
              label: "Last Updated",
              children: formatJoinedDate(product.updatedAt),
            },
          ]}
        />
      </div>
    </Modal>
  );
};

export default ProductDetailsModal;
