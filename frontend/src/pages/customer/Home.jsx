import { Skeleton } from "antd";
import HomeHero from "../../components/customer/home/HomeHero.jsx";
import HomeCategories from "../../components/customer/home/HomeCategories.jsx";
import HomeProducts from "../../components/customer/home/HomeProducts.jsx";
import HomeHowItWorks from "../../components/customer/home/HomeHowItWorks.jsx";
import HomeCta from "../../components/customer/home/HomeCta.jsx";
import EmptyState from "../../components/farmer/common/EmptyState.jsx";
import useCustomerProducts from "../../hooks/useCustomerProducts.js";

const Home = () => {
  const { products, loading, error } = useCustomerProducts();

  return (
    <div>
      <HomeHero />

      {loading || error ? (
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          {error ? (
            <EmptyState
              title="Could not load products"
              description={error}
              actionLabel="Try Again"
            />
          ) : (
            <Skeleton active paragraph={{ rows: 6 }} />
          )}
        </div>
      ) : (
        <>
          <HomeProducts
            accent="bg-cream/60"
            eyebrow="Featured This Week"
            title="Farmer picks, you’ll love"
            description="Hand-selected seasonal favourites our customers can’t stop ordering."
            products={products.filter((product) => product.featured).slice(0, 8)}
            viewAllTo="/customer/products"
          />
          <HomeCategories />
          <HomeProducts
            eyebrow="Freshly Harvested"
            title="New from the farm"
            description="Just arrived at the marketplace — get them while they’re at their best."
            products={products.slice(0, 8)}
            viewAllTo="/customer/products"
          />
          <HomeHowItWorks />
          <HomeCta />
        </>
      )}
    </div>
  );
};

export default Home;