import { useEffect, useMemo, useState } from "react";
import PageHeader from "../common/PageHeader.jsx";
import SearchInput from "../common/SearchInput.jsx";
import FilterBar from "../common/FilterBar.jsx";
import ProductRequestTable from "./ProductRequestTable.jsx";
import ProductRequestModal from "./ProductRequestModal.jsx";
import ConfirmModal from "../common/ConfirmModal.jsx";
import {
  showSuccess,
  showError,
} from "../../common/feedback/MessageProvider.jsx";
import {
  getProductRequests,
  resubmitRequest,
} from "../../../services/product.service.js";
import {
  CATEGORIES,
  STATUS_OPTIONS,
  filterOptions,
} from "./data/productOptions.js";

const DEFAULT_FILTERS = {
  status: "all",
  category: "all",
  sort: "newest",
};

const FILTER_FIELDS = [
  { key: "status", label: "Status", options: STATUS_OPTIONS },
  {
    key: "category",
    label: "Category",
    options: filterOptions(CATEGORIES, "All Categories"),
  },
  {
    key: "sort",
    label: "Sort",
    options: [
      { value: "newest", label: "Newest First" },
      { value: "oldest", label: "Oldest First" },
    ],
  },
];

const ProductRequestsContent = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filters, setFilters] = useState(DEFAULT_FILTERS);
  const [selected, setSelected] = useState(null);
  const [confirmResubmit, setConfirmResubmit] = useState(null);
  const [resubmitting, setResubmitting] = useState(false);

  useEffect(() => {
    const load = async () => {
      try {
        const requestList = await getProductRequests();
        setRequests(requestList);
      } catch (error) {
        showError(error.message || "Unable to load product requests");
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  const setFilter = (key, value) =>
    setFilters((prev) => ({ ...prev, [key]: value }));

  const resetFilters = () => {
    setSearch("");
    setFilters(DEFAULT_FILTERS);
  };

  const visibleRequests = useMemo(() => {
    const query = search.trim().toLowerCase();

    const filtered = requests.filter((request) => {
      const matchesSearch =
        !query ||
        request.productName.toLowerCase().includes(query) ||
        request.category.toLowerCase().includes(query);

      const matchesStatus =
        filters.status === "all" || request.status === filters.status;

      const matchesCategory =
        filters.category === "all" || request.category === filters.category;

      return matchesSearch && matchesStatus && matchesCategory;
    });

    return [...filtered].sort((a, b) =>
      filters.sort === "oldest"
        ? new Date(a.submittedAt) - new Date(b.submittedAt)
        : new Date(b.submittedAt) - new Date(a.submittedAt)
    );
  }, [requests, search, filters]);

  const hasActiveFilters =
    Boolean(search.trim()) ||
    filters.status !== "all" ||
    filters.category !== "all" ||
    filters.sort !== "newest";

  const handleResubmit = async () => {
    if (!confirmResubmit || resubmitting) return;

    setResubmitting(true);

    try {
      const updated = await resubmitRequest(confirmResubmit.productId);

      setRequests((prev) => {
        const findExisting = (list) =>
          list.map((item) =>
            item.id === updated.id
              ? {
                  ...item,
                  status: updated.status,
                  remark: "",
                  updatedAt: new Date().toISOString(),
                }
              : item
          );

        const next = findExisting(prev);

        const stillPresent = next.some((item) => item.id === updated.id);

        return stillPresent ? next : [updated, ...next];
      });

      setSelected((prev) =>
        prev && prev.id === updated.id
          ? {
              ...prev,
              status: updated.status,
              remark: "",
            }
          : prev
      );
      setConfirmResubmit(null);
      showSuccess("Product resubmitted for review successfully.");
    } catch (error) {
      showError(error.message || "Unable to resubmit the request");
    } finally {
      setResubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Product Requests"
        description="Track the review status of your product listings and admin remarks."
      />

      <div className="flex flex-col gap-3 xl:flex-row xl:items-center xl:justify-between">
        <SearchInput
          value={search}
          onChange={setSearch}
          placeholder="Search requests..."
        />
        <FilterBar
          fields={FILTER_FIELDS}
          values={filters}
          onChange={setFilter}
          onReset={resetFilters}
          hasActiveFilters={hasActiveFilters}
        />
      </div>

      <ProductRequestTable
        requests={visibleRequests}
        loading={loading}
        onView={setSelected}
        emptyDescription={
          requests.length === 0
            ? "Requests you submit for review will appear here."
            : "Try changing your search or filters."
        }
      />

      <ProductRequestModal
        request={selected}
        open={Boolean(selected)}
        resubmitting={resubmitting}
        onClose={() => setSelected(null)}
        onResubmit={(request) => setConfirmResubmit(request)}
      />

      <ConfirmModal
        open={Boolean(confirmResubmit)}
        title="Resubmit Request?"
        message={`Are you sure you want to resubmit "${confirmResubmit?.productName || ""}" for admin review?`}
        confirmText="Resubmit"
        confirmLoading={resubmitting}
        onCancel={() => setConfirmResubmit(null)}
        onConfirm={handleResubmit}
      />
    </div>
  );
};

export default ProductRequestsContent;
