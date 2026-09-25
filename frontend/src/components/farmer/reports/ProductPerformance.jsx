import { Table, Progress } from "antd";

const ProductPerformance = ({ products }) => {
  const columns = [
    {
      title: "Product",
      dataIndex: "product",
      key: "product",
      width: 200,
      render: (v, record) => (
        <div>
          <p className="font-medium text-stone-800 dark:text-stone-200">{v}</p>
          <p className="text-xs text-stone-500 dark:text-stone-400">{record.category}</p>
        </div>
      ),
    },
    {
      title: "Units Sold",
      dataIndex: "unitsSold",
      key: "unitsSold",
      width: 120,
    },
    {
      title: "Revenue",
      dataIndex: "revenue",
      key: "revenue",
      width: 140,
      render: (v) => <span className="font-semibold text-stone-800 dark:text-stone-200">{v}</span>,
    },
    {
      title: "Orders",
      dataIndex: "orders",
      key: "orders",
      width: 100,
    },
    {
      title: "Share",
      dataIndex: "share",
      key: "share",
      width: 180,
      render: (v) => (
        <div className="w-full">
          <Progress percent={parseFloat(v)} strokeWidth={8} showInfo={false} size="small" />
          <p className="text-xs text-stone-500 dark:text-stone-400 mt-0.5">{v}%</p>
        </div>
      ),
    },
  ];

  return (
    <div className="rounded-2xl border border-stone-200/70 bg-white shadow-sm dark:border-stone-800 dark:bg-stone-900">
      <div className="p-4 border-b border-stone-200/70 dark:border-stone-800">
        <h3 className="font-display text-base font-semibold text-stone-900 dark:text-white">
          Product Performance
        </h3>
      </div>
      <Table
        rowKey="product"
        dataSource={products}
        columns={columns}
        pagination={{ pageSize: 10, showSizeChanger: false }}
        locale={{ emptyText: "No product performance data for this period" }}
      />
    </div>
  );
};

export default ProductPerformance;