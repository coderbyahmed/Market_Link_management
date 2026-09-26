import Button from "../../common/Button.jsx";
import AdminProductImage from "./AdminProductImage.jsx";

const AdminProductConfirmContent = ({
  product,
  message,
  confirmText = "Confirm",
  tone = "default",
  loading = false,
  onCancel,
  onConfirm,
}) => {
  if (!product) return null;

  const confirmClass =
    tone === "danger"
      ? "!border-red-300 !bg-red-600 hover:!bg-red-700"
      : undefined;

  return (
    <div className="mt-3">
      <div className="flex items-center gap-4 rounded-xl border border-stone-200 bg-stone-50 p-3 dark:border-stone-800 dark:bg-stone-800/60">
        <AdminProductImage
          src={product.image}
          name={product.name}
          className="h-14 w-14"
        />
        <div className="min-w-0">
          <p className="truncate font-medium text-stone-800 dark:text-stone-200">
            {product.name}
          </p>
          <p className="truncate text-xs text-stone-500 dark:text-stone-400">
            {product.farmerName || "—"}
          </p>
        </div>
      </div>

      <p className="mt-4 text-sm text-stone-600 dark:text-stone-300">{message}</p>

      <div className="mt-5 flex flex-wrap justify-end gap-3">
        <Button variant="outline" onClick={onCancel} disabled={loading}>
          Cancel
        </Button>
        <Button onClick={onConfirm} loading={loading} className={confirmClass}>
          {confirmText}
        </Button>
      </div>
    </div>
  );
};

export default AdminProductConfirmContent;