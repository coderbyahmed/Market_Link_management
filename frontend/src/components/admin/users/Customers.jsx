import { FaUserFriends, FaUserCheck, FaUserTimes } from "react-icons/fa";
import StatCard from "../dashboard/StatCard.jsx";
import UserSearch from "./UserSearch.jsx";
import UserFilters from "./UserFilters.jsx";
import UserTable from "./UserTable.jsx";
import UserDetailsModal from "./UserDetailsModal.jsx";
import useUserManagement from "../../../hooks/useUserManagement.js";
import { getAllUsers } from "../../../services/adminUser.service.js";
import AlertMessage from "../../common/feedback/AlertMessage.jsx";

const FILTER_FIELDS = [
  {
    key: "account",
    label: "Account Status",
    options: [
      { value: "all", label: "All" },
      { value: "active", label: "Active" },
      { value: "inactive", label: "Inactive" },
    ],
  },
];

const Customers = () => {
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
  } = useUserManagement({ fetchUsers: getAllUsers, roleFilter: "customer" });

  const stats = [
    { title: "Total Customers", value: counts.total, icon: FaUserFriends },
    {
      title: "Active Customers",
      value: counts.active,
      icon: FaUserCheck,
      accent: "bg-emerald-100 text-emerald-700",
    },
    {
      title: "Inactive Customers",
      value: counts.inactive,
      icon: FaUserTimes,
      accent: "bg-red-100 text-red-700",
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-semibold tracking-tight text-stone-900 dark:text-white">
          Customers
        </h1>
        <p className="mt-1 text-sm text-stone-500 dark:text-stone-400">
          Manage customer accounts
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
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
        type="customers"
        users={filteredUsers}
        loading={loading}
        onView={openDetails}
      />

      <UserDetailsModal
        user={detailsUser}
        open={Boolean(detailsUser)}
        onClose={() => setDetailsUser(null)}
      />
    </div>
  );
};

export default Customers;