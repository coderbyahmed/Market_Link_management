import { Table, Tag } from "antd";
import Button from "../../common/Button.jsx";
import AvailabilityBadge from "../products/AvailabilityBadge.jsx";

const formatMoney = (value) => `Rs. ${Number(value || 0).toLocaleString()}`;

const CropListingTable = ({
  listings,
  loading = false,
  onView,
  onToggleVisibility,
  onAvailabilityChange,
  emptyTitle = "No crop listings found",
  emptyDescription = "Try changing your search or filters.",
}) => {
  const columns = [
    {
      title: "Crop",
      key: "crop",
      width: 220,
      render: (_, listing) => (
        <div className="flex items-center gap-3">
          <img
            src={listing.image}
            alt={listing.name}
            className="h-10 w-10 rounded-lg object-cover border border-stone-200 dark:border-stone-700"
          />
          <div className="min-w-0">
            <p className="truncate font-medium text-stone-800 dark:text-stone-200">
              {listing.name}
            </p>
            <p className="mt-0.5 text-xs text-stone-500 dark:text-stone-400">
              {listing.category}
            </p>
          </div>
        </div>
      ),
    },
    {
      title: "Category",
      key: "category",
      width: 120,
      render: (_, listing) => (
        <Tag className="!m-0 !rounded-full">{listing.category}</Tag>
      ),
    },
    {
      title: "Price",
      key: "price",
      width: 130,
      render: (_, listing) => (
        <span className="whitespace-nowrap font-medium text-stone-700 dark:text-stone-300">
          {formatMoney(listing.price)}
          <span className="text-xs font-normal text-stone-500">
            {" "}
            / {listing.unit}
          </span>
        </span>
      ),
    },
    {
      title: "Stock",
      key: "stock",
      width: 110,
      render: (_, listing) => (
        <span
          className={
            listing.quantity > 0
              ? "font-medium text-stone-700 dark:text-stone-300"
              : "font-semibold text-red-600 dark:text-red-400"
          }
        >
          {listing.quantity} {listing.unit}
        </span>
      ),
    },
    {
      title: "Availability",
      key: "availability",
      width: 180,
      render: (_, listing) => (
        <AvailabilityBadge
          availability={listing.availability}
          onChange={(value) => onAvailabilityChange(listing, value)}
        />
      ),
    },
    {
      title: "Market",
      key: "market",
      width: 150,
      render: (_, listing) => (
        <span className="text-sm text-stone-700 dark:text-stone-300">
          {listing.market}
        </span>
      ),
    },
    {
      title: "Days",
      key: "days",
      width: 150,
      render: (_, listing) => (
        <div className="flex flex-wrap gap-1">
          {listing.days.map((day) => (
            <span
              key={day}
              className="inline-flex items-center rounded-md bg-brand-50 px-2 py-0.5 text-xs font-medium text-brand-700 dark:bg-brand-950 dark:text-brand-400"
            >
              {day.slice(0, 3)}
            </span>
          ))}
        </div>
      ),
    },
    {
      title: "Visibility",
      key: "visibility",
      width: 130,
      render: (_, listing) => (
        <Tag
          className="!m-0 !rounded-full"
          color={listing.visibility === "published" ? "green" : "default"}
        >
          {listing.visibility === "published" ? "Published" : "Unpublished"}
        </Tag>
      ),
    },
    {
      title: "Updated",
      key: "updatedAt",
      width: 120,
      render: (_, listing) => (
        <span className="whitespace-nowrap text-sm text-stone-500 dark:text-stone-400">
          {listing.updatedAt}
        </span>
      ),
    },
    {
      title: "Actions",
      key: "actions",
      align: "right",
      width: 200,
      render: (_, listing) => (
        <div className="flex flex-wrap items-center justify-end gap-2">
          <Button size="sm" variant="outline" onClick={() => onView(listing)}>
            View
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={() => onToggleVisibility(listing)}
          >
            {listing.visibility === "published" ? "Unpublish" : "Publish"}
          </Button>
        </div>
      ),
    },
  ];

  const emptyNode = (
    <div className="flex flex-col items-center justify-center px-4 py-14 text-center">
      <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-stone-100 text-stone-400 dark:bg-stone-800 dark:text-stone-500">
        <svg className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
          />
        </svg>
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
        rowKey="productId"
        dataSource={listings}
        columns={columns}
        loading={loading}
        locale={{ emptyText: emptyNode }}
        scroll={{ x: 1300 }}
        pagination={{ pageSize: 8, showSizeChanger: false }}
      />
    </div>
  );
};

export default CropListingTable;