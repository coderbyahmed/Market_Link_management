import { Table } from "antd";
import { formatMoney } from "./data/mockReportOrders.js";

const SalesHistory = ({ history }) => {
  const columns = [
    {
      title: "Date",
      dataIndex: "date",
      key: "date",
      width: 130,
    },
    {
      title: "Orders",
      dataIndex: "orders",
      key: "orders",
      width: 100,
    },
    {
      title: "Items Sold",
      dataIndex: "itemsSold",
      key: "itemsSold",
      width: 120,
    },
    {
      title: "Revenue",
      dataIndex: "revenue",
      key: "revenue",
      width: 140,
      render: (v) => <span className="font-semibold text-stone-800 dark:text-stone-200">{formatMoney(v)}</span>,
    },
  ];

  return (
    <div className="rounded-2xl border border-stone-200/70 bg-white shadow-sm dark:border-stone-800 dark:bg-stone-900">
      <div className="p-4 border-b border-stone-200/70 dark:border-stone-800">
        <h3 className="font-display text-base font-semibold text-stone-900 dark:text-white">
          Sales History
        </h3>
      </div>
      <Table
        rowKey="date"
        dataSource={history}
        columns={columns}
        pagination={{ pageSize: 10, showSizeChanger: false }}
        locale={{ emptyText: "No sales history for this period" }}
      />
    </div>
  );
};

export default SalesHistory;