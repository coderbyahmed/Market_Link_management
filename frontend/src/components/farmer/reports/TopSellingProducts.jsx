import { Table } from "antd";
import { formatMoney } from "./data/mockReportOrders.js";

const TopSellingProducts = ({ products }) => {
  const columns = [
    {
      title: "Product",
      dataIndex: "product",
      key: "product",
      width: 200,
    },
    {
      title: "Units Sold",
      dataIndex: "unitsSold",
      key: "unitsSold",
      width: 120,
      render: (v) => <span className="font-medium">{v}</span>,
    },
    {
      title: "Orders",
      dataIndex: "orders",
      key: "orders",
      width: 100,
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
          Top Selling Products
        </h3>
      </div>
      <Table
        rowKey="product"
        dataSource={products}
        columns={columns}
        pagination={{ pageSize: 8, showSizeChanger: false }}
        locale={{ emptyText: "No sales data for this period" }}
      />
    </div>
  );
};

export default TopSellingProducts;