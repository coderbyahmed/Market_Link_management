import { useCallback, useEffect, useMemo, useState } from "react";
import { FaSyncAlt } from "react-icons/fa";
import PageHeader from "../common/PageHeader.jsx";
import Button from "../../common/Button.jsx";
import SearchInput from "../common/SearchInput.jsx";
import FilterBar from "../common/FilterBar.jsx";
import CropListingStats from "./CropListingStats.jsx";
import CropListingTable from "./CropListingTable.jsx";
import CropListingDetailsDrawer from "./CropListingDetailsDrawer.jsx";
import ConfirmModal from "../common/ConfirmModal.jsx";
import { showSuccess, showError } from "../../common/feedback/MessageProvider.jsx";
import { getCropListings, setVisibility } from "../../../services/cropListing.service.js";
import { updateAvailability } from "../../../services/product.service.js";

const CATEGORIES = [
  { value: "vegetables", label: "Vegetables" },
  { value: "fruits", label: "Fruits" },
  { value: "herbs", label: "Herbs" },
  { value: "grains", label: "Grains" },
  { value: "dairy", label: "Dairy" },
  { value: "other", label: "Other" },
];

const AVAILABILITY_OPTIONS = [
  { value: "all", label: "All" },
  { value: "available", label: "Available" },
  { value: "sold_out", label: "Sold Out" },
  { value: "unavailable", label: "Temporarily Unavailable" },
];

const VISIBILITY_OPTIONS = [
  { value: "all", label: "All" },
  { value: "published", label: "Published" },
  { value: "unpublished", label: "Unpublished" },
];

const DEFAULT_FILTERS = {
  category: "all",
  availability: "all",
  visibility: "all",
  market: "all",
  day: "all",
  sort: "newest",
};

const SORT_OPTIONS = [
  { value: "newest", label: "Newest First" },
  { value: "oldest", label: "Oldest First" },
  { value: "name_asc", label: "Name A-Z" },
  { value: "name_desc", label: "Name Z-A" },
  { value: "price_desc", label: "Price High-Low" },
  { value: "price_asc", label: "Price Low-High" },
];

const CropListingsContent = () => {
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filters, setFilters] = useState(DEFAULT_FILTERS);
  const [detailsListing, setDetailsListing] = useState(null);
  const [pendingVisibility, setPendingVisibility] = useState(null);
  const [acting, setActing] = useState(false);

  useEffect(() => {
    const load = async () => {
      try {
        const list = await getCropListings();
        setListings(list);
      } catch (error) {
        showError(error.message || "Unable to load crop listings");
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
      const list = await getCropListings();
      setListings(list);
    } catch (error) {
      showError(error.message || "Unable to load crop listings");
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

  const uniqueMarkets = useMemo(
    () => [...new Set(listings.map((l) => l.market))].sort(),
    [listings]
  );
  const uniqueDays = useMemo(
    () => [...new Set(listings.flatMap((l) => l.days))].sort(),
    [listings]
  );

  const matchSearch = useCallback(
    (listing) => {
      const query = search.trim().toLowerCase();
      if (!query) return true;
      return (
        listing.name.toLowerCase().includes(query) ||
        listing.category.toLowerCase().includes(query) ||
        listing.market.toLowerCase().includes(query)
      );
    },
    [search]
  );

  const SORTERS = useMemo(
    () => ({
      newest: (a, b) => new Date(b.updatedAt) - new Date(a.updatedAt),
      oldest: (a, b) => new Date(a.updatedAt) - new Date(b.updatedAt),
      name_asc: (a, b) => a.name.localeCompare(b.name),
      name_desc: (a, b) => b.name.localeCompare(a.name),
      price_desc: (a, b) => b.price - a.price,
      price_asc: (a, b) => a.price - b.price,
    }),
    []
  );

  const FILTER_FIELDS = useMemo(
    () => [
      {
        key: "category",
        label: "Category",
        options: [{ value: "all", label: "All Categories" }, ...CATEGORIES],
      },
      {
        key: "availability",
        label: "Availability",
        options: AVAILABILITY_OPTIONS,
      },
      {
        key: "visibility",
        label: "Visibility",
        options: VISIBILITY_OPTIONS,
      },
      {
        key: "market",
        label: "Market",
        options: [{ value: "all", label: "All Markets" }, ...uniqueMarkets.map((m) => ({ value: m, label: m }))],
      },
      {
        key: "day",
        label: "Day",
        options: [{ value: "all", label: "All Days" }, ...uniqueDays.map((d) => ({ value: d, label: d }))],
      },
      { key: "sort", label: "Sort", options: SORT_OPTIONS },
    ],
    [uniqueMarkets, uniqueDays]
  );

  const hasActiveFilters =
    Boolean(search.trim()) ||
    filters.category !== "all" ||
    filters.availability !== "all" ||
    filters.visibility !== "all" ||
    filters.market !== "all" ||
    filters.day !== "all" ||
    filters.sort !== "newest";

  

  const visibleListings = useMemo(() => {
    const filtered = listings.filter((listing) => {
      const matchesCategory =
        filters.category === "all" || listing.category === filters.category;
      const matchesAvailability =
        filters.availability === "all" ||
        listing.availability === filters.availability;
      const matchesVisibility =
        filters.visibility === "all" ||
        listing.visibility === filters.visibility;
      const matchesMarket =
        filters.market === "all" || listing.market === filters.market;
      const matchesDay =
        filters.day === "all" || listing.days.includes(filters.day);

      return (
        matchSearch(listing) &&
        matchesCategory &&
        matchesAvailability &&
        matchesVisibility &&
        matchesMarket &&
        matchesDay
      );
    });

    return [...filtered].sort(SORTERS[filters.sort] || SORTERS.newest);
  }, [listings, filters, matchSearch, SORTERS]);

  const handleToggleVisibility = (listing) => {
    setPendingVisibility({ listing, next: listing.visibility === "published" ? "unpublished" : "published" });
  };

  const handleConfirmVisibility = async () => {
    if (!pendingVisibility || acting) return;
    setActing(true);
    try {
      await setVisibility(pendingVisibility.listing.productId, pendingVisibility.next);
      setListings((prev) =>
        prev.map((l) =>
          l.productId === pendingVisibility.listing.productId
            ? { ...l, visibility: pendingVisibility.next }
            : l
        )
      );
      setPendingVisibility(null);
      showSuccess(
        `Listing ${pendingVisibility.next === "published" ? "published" : "unpublished"}.`
      );
    } catch (error) {
      showError(error.message || "Unable to update visibility");
    } finally {
      setActing(false);
    }
  };

  const handleAvailabilityChange = async (listing, availability) => {
    try {
      const updated = await updateAvailability(listing.productId, availability);
      setListings((prev) =>
        prev.map((l) => (l.productId === updated.id ? { ...l, ...updated } : l))
      );
      showSuccess("Availability updated");
    } catch (error) {
      showError(error.message || "Unable to update availability");
    }
  };

  const isEmpty = listings.length === 0;
  const noMatches = !isEmpty && visibleListings.length === 0;

  return (
    <div className="space-y-6">
      <PageHeader
        title="Crop Listings"
        description="Manage your customer-facing crop visibility and availability."
        actions={
          <Button
            variant="outline"
            onClick={handleRefresh}
            disabled={loading}
            aria-label="Refresh listings"
          >
            <FaSyncAlt className={loading ? "animate-spin" : ""} /> Refresh
          </Button>
        }
      />

      <CropListingStats listings={listings} />

      <div className="flex flex-col gap-3 xl:flex-row xl:items-center xl:justify-between">
        <SearchInput
          value={search}
          onChange={setSearch}
          placeholder="Search by crop name, category, market..."
        />
        <FilterBar
          fields={FILTER_FIELDS}
          values={filters}
          onChange={setFilter}
          onReset={resetFilters}
          hasActiveFilters={hasActiveFilters}
        />
      </div>

      <CropListingTable
        listings={visibleListings}
        loading={loading}
        onView={setDetailsListing}
        onToggleVisibility={handleToggleVisibility}
        onAvailabilityChange={handleAvailabilityChange}
        emptyTitle={isEmpty ? "No crop listings yet" : "No listings found"}
        emptyDescription={
          isEmpty
            ? "Your approved products will appear here as crop listings."
            : "Try changing your search or filters."
        }
      />

      {noMatches && !hasActiveFilters && (
        <p className="text-center text-sm text-stone-500 dark:text-stone-400">
          All your crop listings are up to date.
        </p>
      )}

      <CropListingDetailsDrawer
        listing={detailsListing}
        open={Boolean(detailsListing)}
        onClose={() => setDetailsListing(null)}
      />

      <ConfirmModal
        open={Boolean(pendingVisibility)}
        title={pendingVisibility?.next === "published" ? "Publish Listing?" : "Unpublish Listing?"}
        message={
          pendingVisibility
            ? `Are you sure you want to ${
                pendingVisibility.next === "published" ? "publish" : "unpublish"
              } "${pendingVisibility.listing.name}"? ${
                pendingVisibility.next === "published"
                  ? "It will become visible to customers."
                  : "It will be hidden from the marketplace."
              }`
            : ""
        }
        confirmText={
          pendingVisibility?.next === "published" ? "Publish" : "Unpublish"
        }
        danger={pendingVisibility?.next === "unpublished"}
        confirmLoading={acting}
        onCancel={() => setPendingVisibility(null)}
        onConfirm={handleConfirmVisibility}
      />
    </div>
  );
};

export default CropListingsContent;