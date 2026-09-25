import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaPlus, FaSyncAlt } from "react-icons/fa";
import PageHeader from "../common/PageHeader.jsx";
import ProductStats from "./ProductStats.jsx";
import SearchInput from "../common/SearchInput.jsx";
import FilterBar from "../common/FilterBar.jsx";
import ProductTable from "./ProductTable.jsx";
import ProductDetailsModal from "./ProductDetailsModal.jsx";
import ProductFormModal from "./ProductFormModal.jsx";
import ConfirmModal from "../common/ConfirmModal.jsx";
import Button from "../../common/Button.jsx";
import {
  showSuccess,
  showError,
} from "../../common/feedback/MessageProvider.jsx";
import {
  getProducts,
  updateProduct,
  deleteProduct,
  updateAvailability,
} from "../../../services/product.service.js";
import {
  CATEGORIES,
  AVAILABILITY_OPTIONS,
  STATUS_OPTIONS,
  SORT_OPTIONS,
  categoryLabel,
  filterOptions,
} from "./data/productOptions.js";

const DEFAULT_FILTERS = {
  category: "all",
  availability: "all",
  status: "all",
  sort: "newest",
};

const FILTER_FIELDS = [
  {
    key: "category",
    label: "Category",
    options: filterOptions(CATEGORIES, "All Categories"),
  },
  {
    key: "availability",
    label: "Availability",
    options: filterOptions(AVAILABILITY_OPTIONS, "All"),
  },
  { key: "status", label: "Status", options: STATUS_OPTIONS },
  { key: "sort", label: "Sort", options: SORT_OPTIONS },
];

const SORTERS = {
  newest: (a, b) => new Date(b.createdAt) - new Date(a.createdAt),
  oldest: (a, b) => new Date(a.createdAt) - new Date(b.createdAt),
  price_asc: (a, b) => a.price - b.price,
  price_desc: (a, b) => b.price - a.price,
  name_asc: (a, b) => a.name.localeCompare(b.name),
  name_desc: (a, b) => b.name.localeCompare(a.name),
  stock_asc: (a, b) => a.quantity - b.quantity,
  stock_desc: (a, b) => b.quantity - a.quantity,
};

const AllProductsContent = () => {
  const navigate = useNavigate();

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filters, setFilters] = useState(DEFAULT_FILTERS);
  const [detailsProduct, setDetailsProduct] = useState(null);
  const [editProduct, setEditProduct] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const load = async () => {
      try {
        const list = await getProducts();
        setProducts(list);
      } catch (error) {
        showError(error.message || "Unable to load products");
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  const handleRefresh = async () => {
    if (loading) return;

    setLoading(true);

    try {
      const list = await getProducts();
      setProducts(list);
    } catch (error) {
      showError(error.message || "Unable to load products");
    } finally {
      setLoading(false);
    }
  };

  const setFilter = (key, value) =>
    setFilters((prev) => ({ ...prev, [key]: value }));

  const resetFilters = () => {
    setSearch("");
    setFilters(DEFAULT_FILTERS);
  };

  const visibleProducts = useMemo(() => {
    const query = search.trim().toLowerCase();

    const filtered = products.filter((product) => {
      const matchesSearch =
        !query ||
        product.name.toLowerCase().includes(query) ||
        categoryLabel(product.category).toLowerCase().includes(query) ||
        product.description.toLowerCase().includes(query);

      const matchesCategory =
        filters.category === "all" || product.category === filters.category;

      const matchesAvailability =
        filters.availability === "all" ||
        product.availability === filters.availability;

      const matchesStatus =
        filters.status === "all" || product.status === filters.status;

      return (
        matchesSearch &&
        matchesCategory &&
        matchesAvailability &&
        matchesStatus
      );
    });

    const sorter = SORTERS[filters.sort] || SORTERS.newest;
    return [...filtered].sort(sorter);
  }, [products, search, filters]);

  const pendingRequests = useMemo(
    () => products.filter((product) => product.status === "pending").length,
    [products]
  );

  const hasActiveFilters =
    Boolean(search.trim()) ||
    filters.category !== "all" ||
    filters.availability !== "all" ||
    filters.status !== "all" ||
    filters.sort !== "newest";

  const handleAvailabilityChange = async (product, availability) => {
    try {
      const updated = await updateAvailability(product.id, availability);
      setProducts((prev) =>
        prev.map((item) => (item.id === updated.id ? updated : item))
      );
      showSuccess("Availability updated");
    } catch (error) {
      showError(error.message || "Unable to update availability");
    }
  };

  const handleUpdateProduct = async (values) => {
    if (!editProduct || saving) return;

    setSaving(true);

    try {
      const updated = await updateProduct(editProduct.id, values);
      setProducts((prev) =>
        prev.map((item) => (item.id === updated.id ? updated : item))
      );
      setEditProduct(null);
      setDetailsProduct(null);
      showSuccess("Product updated successfully.");
    } catch (error) {
      showError(error.message || "Unable to update the product");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget || deleting) return;

    setDeleting(true);

    try {
      await deleteProduct(deleteTarget.id);
      setProducts((prev) => prev.filter((item) => item.id !== deleteTarget.id));
      setDeleteTarget(null);
      setDetailsProduct(null);
      showSuccess("Product deleted successfully.");
    } catch (error) {
      showError(error.message || "Unable to delete the product");
    } finally {
      setDeleting(false);
    }
  };

  const addProductButton = (
    <Button onClick={() => navigate("/farmer/products/add")}>
      <FaPlus className="h-3.5 w-3.5" /> Add Product
    </Button>
  );

  const isEmpty = products.length === 0;
  const noMatches = !isEmpty && visibleProducts.length === 0;

  return (
    <div className="space-y-6">
      <PageHeader
        title="All Products"
        description="Manage your products, pricing, stock and availability."
        actions={
          <>
            <Button
              variant="outline"
              onClick={handleRefresh}
              disabled={loading}
              aria-label="Refresh products"
            >
              <FaSyncAlt className={loading ? "animate-spin" : ""} /> Refresh
            </Button>
            {addProductButton}
          </>
        }
      />

      <ProductStats
        products={products}
        pendingRequests={pendingRequests}
      />

      <div className="flex flex-col gap-3 xl:flex-row xl:items-center xl:justify-between">
        <SearchInput value={search} onChange={setSearch} />
        <FilterBar
          fields={FILTER_FIELDS}
          values={filters}
          onChange={setFilter}
          onReset={resetFilters}
          hasActiveFilters={hasActiveFilters}
        />
      </div>

      <ProductTable
        products={visibleProducts}
        loading={loading}
        onView={setDetailsProduct}
        onEdit={setEditProduct}
        onDelete={setDeleteTarget}
        onAvailabilityChange={handleAvailabilityChange}
        emptyTitle={isEmpty ? "No products yet" : "No products found"}
        emptyDescription={
          isEmpty
            ? "Start adding your products to manage your weekly inventory."
            : "Try changing your search or filters."
        }
        emptyAction={isEmpty ? addProductButton : null}
      />

      {noMatches && !hasActiveFilters && (
        <p className="text-center text-sm text-stone-500 dark:text-stone-400">
          Your inventory is up to date.
        </p>
      )}

      <ProductDetailsModal
        product={detailsProduct}
        open={Boolean(detailsProduct)}
        onClose={() => setDetailsProduct(null)}
        onEdit={(product) => {
          setDetailsProduct(null);
          setEditProduct(product);
        }}
      />

      <ProductFormModal
        product={editProduct}
        open={Boolean(editProduct)}
        submitting={saving}
        onClose={() => setEditProduct(null)}
        onSubmit={handleUpdateProduct}
      />

      <ConfirmModal
        open={Boolean(deleteTarget)}
        title="Delete Product?"
        message={`Are you sure you want to delete "${deleteTarget?.name || ""}"? This action cannot be undone.`}
        confirmText="Delete Product"
        danger
        confirmLoading={deleting}
        onCancel={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
      />
    </div>
  );
};

export default AllProductsContent;
