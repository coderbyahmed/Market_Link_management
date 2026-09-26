import AdminLayout from "../../../components/admin/layout/AdminLayout.jsx";
import AdminProductsContent from "../../../components/admin/products/AdminProductsContent.jsx";
import { getApprovedProducts } from "../../../services/adminProduct.service.js";

const AdminApprovedProducts = () => {
  return (
    <AdminLayout>
      <AdminProductsContent variant="approved" fetchList={getApprovedProducts} />
    </AdminLayout>
  );
};

export default AdminApprovedProducts;