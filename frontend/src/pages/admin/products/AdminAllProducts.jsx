import AdminLayout from "../../../components/admin/layout/AdminLayout.jsx";
import AdminProductsContent from "../../../components/admin/products/AdminProductsContent.jsx";
import { getAllProducts } from "../../../services/adminProduct.service.js";

const AdminAllProducts = () => {
  return (
    <AdminLayout>
      <AdminProductsContent variant="all" fetchList={getAllProducts} />
    </AdminLayout>
  );
};

export default AdminAllProducts;