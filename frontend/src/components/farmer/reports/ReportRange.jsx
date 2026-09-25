import { useState } from "react";
import { Button, Select } from "antd";
import { FaDownload } from "react-icons/fa";
import { formatShortDate } from "../../../utils/date.js";
import { showSuccess } from "../../common/feedback/MessageProvider.jsx";

const RANGE_OPTIONS = [
  { value: "today", label: "Today" },
  { value: "7d", label: "Last 7 Days" },
  { value: "30d", label: "Last 30 Days" },
  { value: "this_month", label: "This Month" },
  { value: "last_month", label: "Last Month" },
  { value: "custom", label: "Custom Range" },
];

const ReportRange = ({ value, onChange, reportData }) => {
  const [customFrom, setCustomFrom] = useState("");
  const [customTo, setCustomTo] = useState("");

  const handleRangeChange = (newRange) => {
    onChange(newRange);
    if (newRange !== "custom") {
      setCustomFrom("");
      setCustomTo("");
    }
  };

  const handleExport = () => {
    if (!reportData) return;

    const csv = [
      ["Metric", "Value"],
      ["Total Orders", reportData.summary.totalOrders],
      ["Pending Orders", reportData.summary.pendingOrders],
      ["Completed Orders", reportData.summary.completedOrders],
      ["Revenue", reportData.summary.revenue],
      ["Avg Order Value", reportData.summary.avgOrderValue],
      ["Units Sold", reportData.summary.unitsSold],
      [],
      ["Date", "Orders", "Items Sold", "Revenue"],
      ...reportData.salesHistory.map((d) => [
        d.date,
        d.orders,
        d.itemsSold,
        d.revenue,
      ]),
      [],
      ["Product", "Units Sold", "Orders", "Revenue"],
      ...reportData.topProducts.map((p) => [
        p.product,
        p.unitsSold,
        p.orders,
        p.revenue,
      ]),
    ]
      .map((row) => row.map((cell) => `"${cell}"`).join(","))
      .join("\n");

    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `marketlink-report-${formatShortDate(new Date())}.csv`;
    link.click();
    URL.revokeObjectURL(link.href);

    showSuccess("Report exported as CSV");
  };

  return (
    <div className="flex flex-wrap items-end gap-3">
      <div className="flex items-center gap-2">
        <Select
          value={value}
          onChange={handleRangeChange}
          options={RANGE_OPTIONS}
          style={{ width: 160 }}
          aria-label="Date range"
        />
        {value === "custom" && (
          <>
            <input
              type="date"
              value={customFrom}
              onChange={(e) => setCustomFrom(e.target.value)}
              className="w-36 rounded-xl border border-stone-300 px-3 py-2 text-sm"
              aria-label="From date"
            />
            <span className="text-stone-400">to</span>
            <input
              type="date"
              value={customTo}
              onChange={(e) => setCustomTo(e.target.value)}
              className="w-36 rounded-xl border border-stone-300 px-3 py-2 text-sm"
              aria-label="To date"
            />
            <Button
              size="sm"
              onClick={() => onChange("custom", customFrom, customTo)}
              disabled={!customFrom || !customTo}
            >
              Apply
            </Button>
          </>
        )}
      </div>

      <Button icon={<FaDownload className="h-3.5 w-3.5" />} onClick={handleExport}>
        Export CSV
      </Button>
    </div>
  );
};

export default ReportRange;