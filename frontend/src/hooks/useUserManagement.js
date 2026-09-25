import { useEffect, useMemo, useState } from "react";
import {
  getAllUsers,
  approveFarmer,
  deactivateUser,
  activateUser,
} from "../services/adminUser.service.js";
import { formatJoinedDate } from "../utils/date.js";

const mapUser = (user) => ({
  ...user,
  id: user.id || user._id,
  accountStatus: user.isActive ? "active" : "inactive",
  approvalStatus:
    user.role === "farmer" ? (user.isApproved ? "approved" : "pending") : null,
  joinedDate: formatJoinedDate(user.createdAt),
});

const useUserManagement = ({ fetchUsers = getAllUsers, roleFilter = "all" } = {}) => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [search, setSearch] = useState("");
  const [filters, setFilters] = useState({
    role: "all",
    status: "all",
    approval: "all",
    account: "all",
  });
  const [detailsUser, setDetailsUser] = useState(null);
  const [confirm, setConfirm] = useState(null);
  const [pendingAction, setPendingAction] = useState(null);

  useEffect(() => {
    let mounted = true;

    fetchUsers()
      .then((data) => {
        if (!mounted) return;

        const raw = Array.isArray(data) ? data : [];

        setUsers(
          raw
            .map(mapUser)
            .filter((user) => roleFilter === "all" || user.role === roleFilter)
        );
        setLoadError("");
      })
      .catch((error) => {
        if (!mounted) return;
        setLoadError(error?.message || "Unable to load users. Please try again.");
        setUsers([]);
      })
      .finally(() => {
        if (mounted) setLoading(false);
      });

    return () => {
      mounted = false;
    };
  }, [fetchUsers, roleFilter]);

  const filteredUsers = useMemo(() => {
    const query = search.trim().toLowerCase();

    return users.filter((user) => {
      if (
        query &&
        ![user.name, user.email, user.phone].some((value) =>
          value.toLowerCase().includes(query)
        )
      ) {
        return false;
      }

      if (filters.role !== "all" && user.role !== filters.role) return false;

      if (filters.approval !== "all" && user.approvalStatus !== filters.approval) {
        return false;
      }

      if (filters.account !== "all" && user.accountStatus !== filters.account) {
        return false;
      }

      if (filters.status !== "all") {
        if (filters.status === "pending") {
          if (!(user.role === "farmer" && user.approvalStatus === "pending")) {
            return false;
          }
        } else if (filters.status === "approved") {
          if (!(user.role === "farmer" && user.approvalStatus === "approved")) {
            return false;
          }
        } else if (user.accountStatus !== filters.status) {
          return false;
        }
      }

      return true;
    });
  }, [users, search, filters]);

  const counts = useMemo(() => {
    const farmers = users.filter((user) => user.role === "farmer");
    const customers = users.filter((user) => user.role === "customer");

    return {
      total: users.length,
      farmers: farmers.length,
      customers: customers.length,
      active: users.filter((user) => user.accountStatus === "active").length,
      inactive: users.filter((user) => user.accountStatus === "inactive").length,
      pending: farmers.filter((user) => user.approvalStatus === "pending").length,
      approved: farmers.filter((user) => user.approvalStatus === "approved").length,
    };
  }, [users]);

  const setFilter = (key, value) =>
    setFilters((prev) => ({ ...prev, [key]: value }));

  const openDetails = (user) => setDetailsUser(user);

  const askApprove = (user) => setConfirm({ type: "approve", user });
  const askActivate = (user) => setConfirm({ type: "activate", user });
  const askDeactivate = (user) => setConfirm({ type: "deactivate", user });

  const runUserAction = async (user, type) => {
    setPendingAction({ type, userId: user.id });

    try {
      if (type === "approve") {
        const result = await approveFarmer(user.id);

        setUsers((list) =>
          list.map((item) =>
            item.id === user.id
              ? { ...item, approvalStatus: "approved", isApproved: true }
              : item
          )
        );

        return { emailSent: Boolean(result?.emailSent) };
      }

      if (type === "deactivate") {
        await deactivateUser(user.id);

        setUsers((list) =>
          list.map((item) =>
            item.id === user.id
              ? { ...item, isActive: false, accountStatus: "inactive" }
              : item
          )
        );

        return {};
      }

      await activateUser(user.id);

      setUsers((list) =>
        list.map((item) =>
          item.id === user.id
            ? { ...item, isActive: true, accountStatus: "active" }
            : item
        )
      );

      return {};
    } finally {
      setPendingAction(null);
    }
  };

  return {
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
  };
};

export default useUserManagement;