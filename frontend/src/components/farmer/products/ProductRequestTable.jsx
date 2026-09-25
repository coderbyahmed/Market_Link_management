import { Table, Tag } from "antd";
import { FaInbox } from "react-icons/fa";
import StatusBadge from "./StatusBadge.jsx";
import Button from "../../common/Button.jsx";
import { formatShortDate } from "../../../utils/date.js";
import { categoryLabel, unitLabel } from "./data/productOptions.js";

const ProductRequestTable = ({
  requests,
  loading = false,
  onView,
  emptyTitle = "No product requests found",
  emptyDescription = "Requests you submit for review will appear here.",
}) => {
  const columns = [
    {
      title: "Product",
      key: "product",
      width: 240,
      render: (_, request) => (
        <div className="min-w-0">
          <p className="truncate font-medium text-stone-800 dark:text-stone-200">
            {request.productName}
          </p>
          <p className="mt-0.5 text-xs text-stone-500 dark:text-stone-400">
            {request.type}
          </p>
        </div>
      ),
    },
    {
      title: "Category",
      key: "category",
      width: 130,
      render: (_, request) => (
        <Tag className="!m-0 !rounded-full">
          {categoryLabel(request.category)}
        </Tag>
      ),
    },
    {
      title: "Price",
      key: "price",
      width: 130,
      render: (_, request) => (
        <span className="whitespace-nowrap font-medium text-stone-700 dark:text-stone-300">
          Rs. {Number(request.price).toLocaleString()}
          <span className="text-xs font-normal text-stone-500">
            {" "}
            / {unitLabel(request.unit)}
          </span>
        </span>
      ),
    },
    {
      title: "Submitted",
      key: "submittedAt",
      width: 130,
      render: (_, request) => (
        <span className="whitespace-nowrap text-sm text-stone-500 dark:text-stone-400">
          {formatShortDate(request.submittedAt)}
        </span>
      ),
    },
    {
      title: "Status",
      key: "status",
      width: 120,
      render: (_, request) => <StatusBadge status={request.status} />,
    },
    {
      title: "Admin Remark",
      key: "remark",
      width: 260,
      render: (_, request) =>
        request.remark ? (
          <span
            className={
              request.status === "rejected"
                ? "line-clamp-2 text-sm text-red-600 dark:text-red-400"
                : "line-clamp-2 text-sm text-stone-500 dark:text-stone-400"
            }
          >
            {request.remark}
          </span>
        ) : (
          <span className="text-sm text-stone-500 dark:text-stone-400">—</span>
        ),
    },
    {
      title: "Actions",
      key: "actions",
      align: "right",
      width: 120,
      render: (_, request) => (
        <Button size="sm" variant="outline" onClick={() => onView(request)}>
          View
        </Button>
      ),
    },
  ];

  const emptyNode = (
    <div className="flex flex-col items-center justify-center px-4 py-14 text-center">
      <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-stone-100 text-stone-400 dark:bg-stone-800 dark:text-stone-500">
        <FaInbox className="h-7 w-7" />
      </span>
      <p className="mt-4 text-sm font-semibold text-stone-700 dark:text-stone-300">
        {emptyTitle}
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
        dataSource={requests}
        columns={columns}
        loading={loading}
        locale={{ emptyText: emptyNode }}
        scroll={{ x: 1120 }}
        pagination={{ pageSize: 8, showSizeChanger: false }}
      />
    </div>
  );
};

export default ProductRequestTable;
