import { useEffect, useMemo, useState } from "react";
import { Modal, Spin } from "antd";
import AdminProductTable from "./AdminProductTable.jsx";
import AdminProductFilters from "./AdminProductFilters.jsx";
import AdminProductDetailsModal from "./AdminProductDetailsModal.jsx";
import AdminProductRejectModal from "./AdminProductRejectModal.jsx";
import ConfirmModalContent from "./AdminProductConfirmContent.jsx";
import AlertMessage from "../../common/feedback/AlertMessage.jsx";
import {
  showSuccess,
  showError,
} from "../../common/feedback/MessageProvider.jsx";
import {
  approveProduct,
  rejectProduct,
} from "../../../services/adminProduct.service.js";
import { CATEGORIES, AVAILABILITY_OPTIONS } from "./data/productMeta.js";

const FILTER_PRESETS = {
  all: [
    {
      key: "category",
      label: "Category",
      options: [
        { value: "all", label: "All Categories" },
        ...CATEGORIES,
      ],
    },
    { key: "availability", label: "Availability", options: AVAILABILITY_OPTIONS },
    {
      key: "status",
      label: "Status",
      options: [
        { value: "all", label: "All Statuses" },
        { value: "pending", label: "Pending" },
        { value: "approved", label: "Approved" },
        { value: "rejected", label: "Rejected" },
      ],
    },
  ],
  pending: [
    {
      key: "category",
      label: "Category",
      options: [
        { value: "all", label: "All Categories" },
        ...CATEGORIES,
      ],
    },
    { key: "availability", label: "Availability", options: AVAILABILITY_OPTIONS },
  ],
  approved: [
    {
      key: "category",
      label: "Category",
      options: [
        { value: "all", label: "All Categories" },
        ...CATEGORIES,
      ],
    },
    { key: "availability", label: "Availability", options: AVAILABILITY_OPTIONS },
  ],
};

const DEFAULT_FILTERS = {
  category: "all",
  availability: "all",
  status: "all",
};

const META = {
  all: { title: "All Products", description: "Every product submitted by farmers" },
  pending: {
    title: "Pending Products",
    description: "Review and approve or reject products awaiting a decision",
  },
  approved: {
    title: "Approved Products",
    description: "Products that have been approved and are live",
  },
};

const AdminProductsContent = ({ variant = "all", fetchList }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [search, setSearch] = useState("");
  const [filters, setFilters] = useState(DEFAULT_FILTERS);
  const [detailsProduct, setDetailsProduct] = useState(null);
  const [approveTarget, setApproveTarget] = useState(null);
  const [approving, setApproving] = useState(false);
  const [rejectTarget, setRejectTarget] = useState(null);
  const [rejecting, setRejecting] = useState(false);

  const load = async ({ showLoading = true } = {}) => {
    if (showLoading) setLoading(true);

    try {
      const list = await fetchList();
      setProducts(list);
      setLoadError("");
    } catch (error) {
      setLoadError(error.message || "Unable to load products");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Data fetching happens asynchronously after an await; this rule can't
    // statically prove that, so it is disabled for this standard fetch effect.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    load({ showLoading: false });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [variant]);

  const setFilter = (key, value) =>
    setFilters((prev) => ({ ...prev, [key]: value }));

  const resetFilters = () => {
    setFilters(DEFAULT_FILTERS);
    setSearch("");
  };

  const hasActiveFilters =
    Boolean(search.trim()) ||
    filters.category !== "all" ||
    filters.availability !== "all" ||
    filters.status !== "all";

  const visibleProducts = useMemo(() => {
    const term = search.trim().toLowerCase();

    return products.filter((product) => {
      if (
        term &&
        !(
          product.name.toLowerCase().includes(term) ||
          (product.description || "").toLowerCase().includes(term) ||
          product.farmerName.toLowerCase().includes(term) ||
          product.category.toLowerCase().includes(term)
        )
      ) {
        return false;
      }

      if (filters.category !== "all" && product.category !== filters.category)
        return false;

      if (
        filters.availability !== "all" &&
        product.availability !== filters.availability
      )
        return false;

      if (filters.status !== "all" && product.status !== filters.status)
        return false;

      return true;
    });
  }, [products, search, filters]);

  const counts = useMemo(() => {
    const result = {
      total: products.length,
      pending: products.filter((p) => p.status === "pending").length,
      approved: products.filter((p) => p.status === "approved").length,
      rejected: products.filter((p) => p.status === "rejected").length,
    };

    return result;
  }, [products]);

  const handleApprove = async () => {
    if (!approveTarget || approving) return;

    setApproving(true);

    try {
      await approveProduct(approveTarget.id);
      setApproveTarget(null);
      showSuccess("Product approved successfully.");
      await load();
    } catch (error) {
      showError(error.message || "Unable to approve the product");
    } finally {
      setApproving(false);
    }
  };

  const handleReject = async (reason) => {
    if (!rejectTarget || rejecting) return;

    setRejecting(true);

    try {
      await rejectProduct(rejectTarget.id, reason);
      setRejectTarget(null);
      showSuccess("Product rejected and farmer notified.");
      await load();
    } catch (error) {
      showError(error.message || "Unable to reject the product");
    } finally {
      setRejecting(false);
    }
  };

  const meta = META[variant];

  const summaryChips =
    variant === "all"
      ? [
          { label: "Total", value: counts.total },
          { label: "Pending", value: counts.pending },
          { label: "Approved", value: counts.approved },
          { label: "Rejected", value: counts.rejected },
        ]
      : [{ label: meta.title, value: products.length }];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-semibold tracking-tight text-stone-900 dark:text-white">
          {meta.title}
        </h1>
        <p className="mt-1 text-sm text-stone-500 dark:text-stone-400">
          {meta.description}
        </p>
      </div>

      <div className="flex flex-wrap gap-2 text-xs font-semibold">
        {summaryChips.map((chip) => (
          <span
            key={chip.label}
            className="rounded-full bg-stone-100 px-3 py-1.5 text-stone-600 dark:bg-stone-800 dark:text-stone-300"
          >
            {chip.label}: {chip.value}
          </span>
        ))}
      </div>

      <AdminProductFilters
        fields={FILTER_PRESETS[variant]}
        values={filters}
        onChange={setFilter}
        onReset={resetFilters}
        searchValue={search}
        onSearchChange={setSearch}
        hasActiveFilters={hasActiveFilters}
        searchPlaceholder="Search by product, farmer, category..."
      />

      {loadError && <AlertMessage type="error" message={loadError} />}

      {loading ? (
        <div className="flex min-h-[35vh] items-center justify-center rounded-2xl border border-stone-200/70 bg-white shadow-sm dark:border-stone-800 dark:bg-stone-900">
          <Spin size="large" />
        </div>
      ) : (
        <AdminProductTable
          variant={variant}
          products={visibleProducts}
          loading={loading}
          onView={setDetailsProduct}
          onApprove={setApproveTarget}
          onReject={setRejectTarget}
        />
      )}

      <AdminProductDetailsModal
        product={detailsProduct}
        open={Boolean(detailsProduct)}
        onClose={() => setDetailsProduct(null)}
      />

      <Modal
        open={Boolean(approveTarget)}
        title="Approve Product?"
        onCancel={() => setApproveTarget(null)}
        footer={null}
        centered
        destroyOnHidden
      >
        <ConfirmModalContent
          product={approveTarget}
          tone="success"
          title="Approve this product?"
          message="Once approved, this product becomes live and the farmer will be notified."
          confirmText="Approve Product"
          loading={approving}
          onCancel={() => setApproveTarget(null)}
          onConfirm={handleApprove}
        />
      </Modal>

      <AdminProductRejectModal
        product={rejectTarget}
        open={Boolean(rejectTarget)}
        saving={rejecting}
        onCancel={() => setRejectTarget(null)}
        onConfirm={handleReject}
      />
    </div>
  );
};

export default AdminProductsContent;