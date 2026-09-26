import { Table, Tag } from "antd";
import { FaBoxOpen } from "react-icons/fa";
import ProductImage from "./ProductImage.jsx";
import AvailabilityBadge from "./AvailabilityBadge.jsx";
import StatusBadge from "./StatusBadge.jsx";
import Button from "../../common/Button.jsx";
import { categoryLabel, unitLabel } from "./data/productOptions.js";

const ProductTable = ({
  products,
  loading = false,
  onView,
  onEdit,
  onDelete,
  onAvailabilityChange,
  emptyTitle = "No products found",
  emptyDescription = "Try changing your search or filters.",
  emptyAction = null,
}) => {
  const columns = [
    {
      title: "Product",
      key: "product",
      width: 220,
      render: (_, product) => (
        <div className="flex items-center gap-3">
          <ProductImage
            src={product.image}
            name={product.name}
            className="h-11 w-11"
          />
          <div className="min-w-0">
            <p className="truncate font-medium text-stone-800 dark:text-stone-200">
              {product.name}
            </p>
            <p className="mt-0.5 line-clamp-1 text-xs text-stone-500 dark:text-stone-400">
              {product.description}
            </p>
          </div>
        </div>
      ),
    },
    {
      title: "Category",
      key: "category",
      width: 110,
      responsive: ["md"],
      render: (_, product) => (
        <Tag className="!m-0 !rounded-full">{categoryLabel(product.category)}</Tag>
      ),
    },
    {
      title: "Price",
      key: "price",
      width: 105,
      render: (_, product) => (
        <span className="whitespace-nowrap font-medium text-stone-700 dark:text-stone-300">
          Rs. {Number(product.price).toLocaleString()}
          <span className="text-xs font-normal text-stone-500">
            {" "}
            / {unitLabel(product.unit)}
          </span>
        </span>
      ),
    },
    {
      title: "Stock",
      key: "stock",
      width: 100,
      render: (_, product) => (
        <span
          className={
            product.quantity > 0
              ? "font-medium text-stone-700 dark:text-stone-300"
              : "font-semibold text-red-600 dark:text-red-400"
          }
        >
          {product.quantity} {unitLabel(product.unit)}
        </span>
      ),
    },
    {
      title: "Availability",
      key: "availability",
      width: 175,
      render: (_, product) => (
        <AvailabilityBadge
          availability={product.availability}
          onChange={(value) => onAvailabilityChange(product, value)}
        />
      ),
    },
    {
      title: "Status",
      key: "status",
      width: 100,
      responsive: ["sm"],
      render: (_, product) => <StatusBadge status={product.status} />,
    },
    {
      title: "Actions",
      key: "actions",
      width: 170,
      align: "right",
      render: (_, product) => (
        <div className="flex justify-end gap-2">
          <Button size="sm" variant="outline" onClick={() => onView(product)}>
            View
          </Button>
          <Button size="sm" variant="outline" onClick={() => onEdit(product)}>
            Edit
          </Button>
          <Button
            size="sm"
            variant="outline"
            className="!border-red-300 !text-red-600 hover:!bg-red-50"
            onClick={() => onDelete(product)}
          >
            Delete
          </Button>
        </div>
      ),
    },
  ];

  const emptyNode = (
    <div className="flex flex-col items-center justify-center px-4 py-14 text-center">
      <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-stone-100 text-stone-400 dark:bg-stone-800 dark:text-stone-500">
        <FaBoxOpen className="h-7 w-7" />
      </span>
      <p className="mt-4 text-sm font-semibold text-stone-700 dark:text-stone-300">
        {emptyTitle}
      </p>
      <p className="mt-1 text-sm text-stone-500 dark:text-stone-400">
        {emptyDescription}
      </p>
      {emptyAction && <div className="mt-4">{emptyAction}</div>}
    </div>
  );

  return (
    <div className="overflow-hidden rounded-2xl border border-stone-200/70 bg-white shadow-sm dark:border-stone-800 dark:bg-stone-900">
      <Table
        rowKey="id"
        dataSource={products}
        columns={columns}
        loading={loading}
        locale={{ emptyText: emptyNode }}
        scroll={{ x: 760 }}
        pagination={{ pageSize: 8, showSizeChanger: false }}
      />
    </div>
  );
};

export default ProductTable;