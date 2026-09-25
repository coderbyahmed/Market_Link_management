import { useEffect, useState } from "react";
import { Tabs } from "antd";
import { FaSyncAlt } from "react-icons/fa";
import PageHeader from "../common/PageHeader.jsx";
import Button from "../../common/Button.jsx";
import ReportSummary from "./ReportSummary.jsx";
import ReportRange from "./ReportRange.jsx";
import MiniBarChart from "./MiniBarChart.jsx";
import StackedBarChart from "./StackedBarChart.jsx";
import TopSellingProducts from "./TopSellingProducts.jsx";
import SalesHistory from "./SalesHistory.jsx";
import ProductPerformance from "./ProductPerformance.jsx";
import { showError } from "../../common/feedback/MessageProvider.jsx";
import { getReportData, formatMoney } from "../../../services/report.service.js";

const ReportsContent = () => {
  const [reportData, setReportData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [range, setRange] = useState("30d");
  const [customFrom, setCustomFrom] = useState("");
  const [customTo, setCustomTo] = useState("");

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const data = await getReportData(range, customFrom, customTo);
        setReportData(data);
      } catch (error) {
        showError(error.message || "Unable to load report");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [range, customFrom, customTo]);

  const handleRangeChange = (newRange, from = "", to = "") => {
    setRange(newRange);
    setCustomFrom(from);
    setCustomTo(to);
  };

  const handleRefresh = async () => {
    if (loading) return;
    setLoading(true);
    try {
      const data = await getReportData(range, customFrom, customTo);
      setReportData(data);
    } catch (error) {
      showError(error.message || "Unable to load report");
    } finally {
      setLoading(false);
    }
  };

  if (!reportData) return null;

  return (
    <div className="space-y-6">
      <PageHeader
        title="Reports"
        description="Analyze your sales performance and business insights."
        actions={
          <Button
            variant="outline"
            onClick={handleRefresh}
            disabled={loading}
            aria-label="Refresh report"
          >
            <FaSyncAlt className={loading ? "animate-spin" : ""} /> Refresh
          </Button>
        }
      />

      <ReportSummary summary={reportData.summary} />

      <ReportRange
        value={range}
        onChange={handleRangeChange}
        reportData={reportData}
      />

      <Tabs
        defaultActiveKey="overview"
        items={[
          {
            key: "overview",
            label: "Overview",
            children: (
              <div className="space-y-6">
                <div className="rounded-2xl border border-stone-200/70 bg-white p-5 shadow-sm dark:border-stone-800 dark:bg-stone-900">
                  <h3 className="font-display text-base font-semibold text-stone-900 dark:text-white">
                    Revenue Overview
                  </h3>
                  <MiniBarChart
                    data={reportData.revenueSeries}
                    color="hsl(145, 65%, 42%)"
                    height={200}
                    labelFormatter={formatMoney}
                  />
                  <p className="mt-3 text-sm text-stone-600 dark:text-stone-400">
                    Total Revenue: <span className="font-semibold text-stone-900 dark:text-white">{formatMoney(reportData.summary.revenue)}</span>
                  </p>
                </div>

                <div className="rounded-2xl border border-stone-200/70 bg-white p-5 shadow-sm dark:border-stone-800 dark:bg-stone-900">
                  <h3 className="font-display text-base font-semibold text-stone-900 dark:text-white">
                    Order Trends
                  </h3>
                  <StackedBarChart data={reportData.orderTrends} height={220} />
                </div>
              </div>
            ),
          },
          {
            key: "products",
            label: "Products",
            children: (
              <div className="space-y-6">
                <TopSellingProducts products={reportData.topProducts} />
                <ProductPerformance products={reportData.productPerformance} />
              </div>
            ),
          },
          {
            key: "history",
            label: "Sales History",
            children: (
              <SalesHistory history={reportData.salesHistory} />
            ),
          },
        ]}
      />
    </div>
  );
};

export default ReportsContent;