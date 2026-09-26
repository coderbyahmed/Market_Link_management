import { Table, Tag } from "antd";
import { FaBoxOpen } from "react-icons/fa";
import AdminProductImage from "./AdminProductImage.jsx";
import { AvailabilityBadge, StatusBadge } from "./AdminProductBadges.jsx";
import Button from "../../common/Button.jsx";
import {
  categoryLabel,
  unitLabel,
  formatDate,
} from "./data/productMeta.js";

const CategoryTag = ({ category }) => (
  <Tag className="!m-0 !rounded-full">{categoryLabel(category)}</Tag>
);

const buildColumns = ({ variant, onView, onApprove, onReject }) => {
  const columns = [
    {
      title: "Product",
      key: "product",
      width: 230,
      render: (_, product) => (
        <div className="flex items-center gap-3">
          <AdminProductImage src={product.image} name={product.name} />
          <div className="min-w-0">
            <p className="truncate font-medium text-stone-800 dark:text-stone-200">
              {product.name}
            </p>
            <p className="line-clamp-1 text-xs text-stone-500 dark:text-stone-400">
              {product.description || "No description provided"}
            </p>
          </div>
        </div>
      ),
    },
    {
      title: "Farmer",
      key: "farmer",
      width: 190,
      render: (_, product) => (
        <div className="min-w-0">
          <p className="truncate font-medium text-stone-800 dark:text-stone-200">
            {product.farmerName || "—"}
          </p>
          <p className="truncate text-xs text-stone-500 dark:text-stone-400">
            {product.farmerEmail}
          </p>
        </div>
      ),
    },
    {
      title: "Category",
      key: "category",
      width: 105,
      responsive: ["md"],
      render: (_, product) => <CategoryTag category={product.category} />,
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
      width: 95,
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
      width: 150,
      render: (_, product) => (
        <AvailabilityBadge availability={product.availability} />
      ),
    },
  ];

  if (variant === "all") {
    columns.push({
      title: "Status",
      key: "status",
      width: 100,
      responsive: ["sm"],
      render: (_, product) => <StatusBadge status={product.status} />,
    });
  }

  columns.push({
    title: "Created",
    key: "createdAt",
    width: 115,
    responsive: ["lg"],
    render: (_, product) => formatDate(product.createdAt),
  });

  columns.push({
    title: "Actions",
    key: "actions",
    width: variant === "pending" ? 250 : 120,
    align: "right",
    render: (_, product) => (
      <div className="flex justify-end gap-2">
        <Button size="sm" variant="outline" onClick={() => onView(product)}>
          View
        </Button>
        {variant === "pending" && onApprove && (
          <Button size="sm" variant="secondary" onClick={() => onApprove(product)}>
            Approve
          </Button>
        )}
        {variant === "pending" && onReject && (
          <Button
            size="sm"
            variant="outline"
            className="!border-red-300 !text-red-600 hover:!bg-red-50"
            onClick={() => onReject(product)}
          >
            Reject
          </Button>
        )}
      </div>
    ),
  });

  return columns;
};

const EMPTY_TEXT = {
  all: "No products found",
  pending: "No pending products",
  approved: "No approved products",
};

const AdminProductTable = ({
  variant = "all",
  products = [],
  loading = false,
  onView,
  onApprove,
  onReject,
  emptyDescription = "Try changing your search or filters.",
}) => {
  const emptyNode = (
    <div className="flex flex-col items-center justify-center px-4 py-14 text-center">
      <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-stone-100 text-stone-400 dark:bg-stone-800 dark:text-stone-500">
        <FaBoxOpen className="h-7 w-7" />
      </span>
      <p className="mt-4 text-sm font-semibold text-stone-700 dark:text-stone-300">
        {EMPTY_TEXT[variant]}
      </p>
      <p className="mt-1 text-sm text-stone-500 dark:text-stone-400">
        {emptyDescription}
      </p>
    </div>
  );

  return (
    <div className="overflow-hidden rounded-2xl border border-stone-200/70 bg-white shadow-sm dark:border-stone-800 dark:bg-stone-900">
      <Table
        rowKey="id"
        dataSource={products}
        columns={buildColumns({ variant, onView, onApprove, onReject })}
        loading={loading}
        locale={{ emptyText: emptyNode }}
        scroll={{ x: 820 }}
        pagination={{ pageSize: 8, showSizeChanger: false }}
      />
    </div>
  );
};

export default AdminProductTable;