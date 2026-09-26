import { useCallback, useEffect, useState } from "react";
import { getProducts } from "../services/customerProduct.service.js";

const useCustomerProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const load = useCallback(() => {
    getProducts()
      .then((list) => {
        setProducts(list);
        setError("");
      })
      .catch((loadFailure) => {
        setError(loadFailure.message || "Unable to load products");
      })
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  return { products, loading, error, reload: load };
};

export default useCustomerProducts;