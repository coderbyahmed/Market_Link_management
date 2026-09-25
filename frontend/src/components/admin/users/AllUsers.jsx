import { FaUsers, FaTractor, FaUserFriends, FaUserCheck } from "react-icons/fa";
import StatCard from "../dashboard/StatCard.jsx";
import UserSearch from "./UserSearch.jsx";
import UserFilters from "./UserFilters.jsx";
import UserTable from "./UserTable.jsx";
import UserDetailsModal from "./UserDetailsModal.jsx";
import UserConfirmationModal from "./UserConfirmationModal.jsx";
import useUserManagement from "../../../hooks/useUserManagement.js";
import { getAllUsers } from "../../../services/adminUser.service.js";
import {
  CONFIRM_META,
  CONFIRM_SUCCESS_MESSAGES,
} from "./data/usersData.js";
import AlertMessage from "../../common/feedback/AlertMessage.jsx";
import { showSuccess, showError } from "../../common/feedback/MessageProvider.jsx";

const FILTER_FIELDS = [
  {
    key: "role",
    label: "Role",
    options: [
      { value: "all", label: "All" },
      { value: "farmer", label: "Farmer" },
      { value: "customer", label: "Customer" },
    ],
  },
  {
    key: "status",
    label: "Status",
    options: [
      { value: "all", label: "All" },
      { value: "active", label: "Active" },
      { value: "inactive", label: "Inactive" },
      { value: "pending", label: "Pending Approval" },
      { value: "approved", label: "Approved" },
    ],
  },
];

const AllUsers = () => {
  const {
    filteredUsers,
    counts,
    loading,
    loadError,
    search,
    setSearch,
    filters,
    setFilter,
    detailsUser,
    setDetailsUser,
    openDetails,
    confirm,
    setConfirm,
    pendingAction,
    askApprove,
    askActivate,
    askDeactivate,
    runUserAction,
  } = useUserManagement({ fetchUsers: getAllUsers });

  const stats = [
    { title: "Total Users", value: counts.total, icon: FaUsers },
    {
      title: "Total Farmers",
      value: counts.farmers,
      icon: FaTractor,
      accent: "bg-emerald-100 text-emerald-700",
    },
    {
      title: "Total Customers",
      value: counts.customers,
      icon: FaUserFriends,
      accent: "bg-sky-100 text-sky-700",
    },
    {
      title: "Active Users",
      value: counts.active,
      icon: FaUserCheck,
      accent: "bg-amber-100 text-amber-700",
    },
  ];

  const confirmMeta = confirm ? CONFIRM_META[confirm.type] : null;

  const handleConfirm = async () => {
    if (!confirm) return;

    try {
      const result = await runUserAction(confirm.user, confirm.type);
      setConfirm(null);
      if (confirm.type === "approve") {
        showSuccess(
          result?.emailSent
            ? "Farmer account approved successfully."
            : "Farmer account approved, but the approval email could not be sent."
        );
      } else {
        showSuccess(CONFIRM_SUCCESS_MESSAGES[confirm.type]);
      }
    } catch (error) {
      setConfirm(null);
      showError(
        error?.message || "Unable to complete this action. Please try again."
      );
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-semibold tracking-tight text-stone-900 dark:text-white">
          Users
        </h1>
        <p className="mt-1 text-sm text-stone-500 dark:text-stone-400">
          Manage all farmers and customers
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map(({ title, value, icon, accent }) => (
          <StatCard
            key={title}
            title={title}
            value={value}
            icon={icon}
            accent={accent}
          />
        ))}
      </div>

      <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
        <UserSearch value={search} onChange={setSearch} />
        <UserFilters fields={FILTER_FIELDS} values={filters} onChange={setFilter} />
      </div>

      {loadError && <AlertMessage type="error" message={loadError} />}

      <UserTable
        type="all"
        users={filteredUsers}
        loading={loading}
        pendingAction={pendingAction}
        onView={openDetails}
        onApprove={askApprove}
        onActivate={askActivate}
        onDeactivate={askDeactivate}
      />

      <UserDetailsModal
        user={detailsUser}
        open={Boolean(detailsUser)}
        onClose={() => setDetailsUser(null)}
      />

      <UserConfirmationModal
        open={Boolean(confirm)}
        title={confirmMeta?.title}
        message={confirmMeta?.message}
        confirmText={confirmMeta?.confirmText}
        danger={confirmMeta?.danger}
        confirmLoading={Boolean(confirm && pendingAction?.userId === confirm?.user?.id)}
        onCancel={() => setConfirm(null)}
        onConfirm={handleConfirm}
      />
    </div>
  );
};

export default AllUsers;