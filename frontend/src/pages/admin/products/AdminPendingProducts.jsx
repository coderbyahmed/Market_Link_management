import AdminLayout from "../../../components/admin/layout/AdminLayout.jsx";
import AdminProductsContent from "../../../components/admin/products/AdminProductsContent.jsx";
import { getPendingProducts } from "../../../services/adminProduct.service.js";

const AdminPendingProducts = () => {
  return (
    <AdminLayout>
      <AdminProductsContent variant="pending" fetchList={getPendingProducts} />
    </AdminLayout>
  );
};

export default AdminPendingProducts;