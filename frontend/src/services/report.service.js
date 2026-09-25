import { mockReportOrders } from "../components/farmer/reports/data/mockReportOrders.js";
import mockProducts from "../components/farmer/products/data/mockProducts.js";

const LATENCY_MS = 150;
const wait = (ms = LATENCY_MS) => new Promise((resolve) => setTimeout(resolve, ms));

const parseDate = (str) => new Date(str + "T00:00:00");

const getDateRange = (range) => {
  const now = new Date();
  now.setHours(0, 0, 0, 0);

  let from, to = new Date(now);

  switch (range) {
    case "today":
      from = new Date(now);
      break;
    case "7d":
      from = new Date(now);
      from.setDate(now.getDate() - 6);
      break;
    case "30d":
      from = new Date(now);
      from.setDate(now.getDate() - 29);
      break;
    case "this_month":
      from = new Date(now.getFullYear(), now.getMonth(), 1);
      break;
    case "last_month":
      from = new Date(now.getFullYear(), now.getMonth() - 1, 1);
      to = new Date(now.getFullYear(), now.getMonth(), 0);
      break;
    case "custom":
      return null;
    default:
      from = new Date(0);
  }

  return { from, to };
};

const formatMoney = (value) => `Rs. ${Number(value || 0).toLocaleString()}`;

const groupByDay = (orders) => {
  const map = new Map();
  orders.forEach((order) => {
    const day = order.date;
    if (!map.has(day)) {
      map.set(day, { date: day, orders: 0, itemsSold: 0, revenue: 0, completed: 0, pending: 0, cancelled: 0 });
    }
    const entry = map.get(day);
    entry.orders += 1;
    entry.itemsSold += order.items.reduce((s, i) => s + i.qty, 0);
    entry.revenue += order.status === "completed" ? order.total : 0;
    if (order.status === "completed") entry.completed += 1;
    else if (order.status === "pending") entry.pending += 1;
    else if (order.status === "cancelled" || order.status === "declined") entry.cancelled += 1;
  });
  return Array.from(map.values()).sort((a, b) => a.date.localeCompare(b.date));
};

const groupByWeek = (orders) => {
  const map = new Map();
  orders.forEach((order) => {
    const date = parseDate(order.date);
    const weekStart = new Date(date);
    weekStart.setDate(date.getDate() - date.getDay());
    const key = weekStart.toISOString().split("T")[0];
    if (!map.has(key)) {
      map.set(key, { weekStart: key, orders: 0, itemsSold: 0, revenue: 0, completed: 0, pending: 0, cancelled: 0 });
    }
    const entry = map.get(key);
    entry.orders += 1;
    entry.itemsSold += order.items.reduce((s, i) => s + i.qty, 0);
    entry.revenue += order.status === "completed" ? order.total : 0;
    if (order.status === "completed") entry.completed += 1;
    else if (order.status === "pending") entry.pending += 1;
    else if (order.status === "cancelled" || order.status === "declined") entry.cancelled += 1;
  });
  return Array.from(map.values()).sort((a, b) => a.weekStart.localeCompare(b.weekStart));
};

const getTopProducts = (orders) => {
  const map = new Map();
  orders
    .filter((o) => o.status === "completed")
    .forEach((order) => {
      order.items.forEach((item) => {
        const key = item.name;
        if (!map.has(key)) {
          map.set(key, { product: item.name, unitsSold: 0, orders: 0, revenue: 0 });
        }
        const entry = map.get(key);
        entry.unitsSold += item.qty;
        entry.orders += 1;
        entry.revenue += item.qty * item.price;
      });
    });
  return Array.from(map.values())
    .sort((a, b) => b.unitsSold - a.unitsSold)
    .slice(0, 10);
};

const getProductPerformance = (orders) => {
  const map = new Map();
  orders
    .filter((o) => o.status === "completed")
    .forEach((order) => {
      order.items.forEach((item) => {
        const key = item.name;
        if (!map.has(key)) {
          map.set(key, { product: item.name, unitsSold: 0, orders: 0, revenue: 0, category: "" });
        }
        const entry = map.get(key);
        entry.unitsSold += item.qty;
        entry.orders += 1;
        entry.revenue += item.qty * item.price;
        const product = mockProducts.find((p) => p.name === item.name);
        if (product) entry.category = product.category;
      });
    });
  const totalUnits = Array.from(map.values()).reduce((s, e) => s + e.unitsSold, 0);
  return Array.from(map.values()).map((e) => ({
    ...e,
    share: totalUnits > 0 ? ((e.unitsSold / totalUnits) * 100).toFixed(1) : "0.0",
  }));
};

const getReportData = async (range, customFrom, customTo) => {
  await wait();

  let filtered = mockReportOrders;

  if (range === "custom" && customFrom && customTo) {
    const from = parseDate(customFrom);
    const to = parseDate(customTo);
    filtered = mockReportOrders.filter((o) => {
      const d = parseDate(o.date);
      return d >= from && d <= to;
    });
  } else if (range !== "custom") {
    const { from, to } = getDateRange(range);
    filtered = mockReportOrders.filter((o) => {
      const d = parseDate(o.date);
      return d >= from && d <= to;
    });
  }

  const spanDays = range === "custom" && customFrom && customTo
    ? Math.ceil((parseDate(customTo) - parseDate(customFrom)) / 86400000)
    : range === "30d" || range === "last_month" ? 30 : range === "7d" ? 7 : 1;

  const dailyData = groupByDay(filtered);
  const weeklyData = groupByWeek(filtered);
  const chartData = spanDays > 31 ? weeklyData : dailyData;

  const completedOrders = filtered.filter((o) => o.status === "completed");
  const pendingOrders = filtered.filter((o) => o.status === "pending");

  const revenue = completedOrders.reduce((s, o) => s + o.total, 0);
  const unitsSold = completedOrders.reduce((s, o) => s + o.items.reduce((sum, i) => sum + i.qty, 0), 0);
  const avgOrderValue = completedOrders.length > 0 ? revenue / completedOrders.length : 0;

  return {
    range,
    rangeLabel: range === "custom" ? "Custom Range" : range.replace("_", " ").replace(/\b\w/g, (l) => l.toUpperCase()),
    summary: {
      totalOrders: filtered.length,
      pendingOrders: pendingOrders.length,
      completedOrders: completedOrders.length,
      revenue,
      avgOrderValue,
      unitsSold,
    },
    revenueSeries: chartData.map((d) => ({ label: d.date || d.weekStart, value: d.revenue })),
    orderTrends: chartData.map((d) => ({
      label: d.date || d.weekStart,
      completed: d.completed,
      pending: d.pending,
      cancelled: d.cancelled,
    })),
    topProducts: getTopProducts(filtered),
    salesHistory: dailyData,
    productPerformance: getProductPerformance(filtered),
  };
};

export { getReportData, formatMoney };