import Header from "../components/common/Header.jsx";
import Footer from "../components/common/Footer.jsx";
import Hero from "../components/landing/Hero.jsx";
import Features from "../components/landing/Features.jsx";
import HowItWorks from "../components/landing/HowItWorks.jsx";
import RoleSelection from "../components/landing/RoleSelection.jsx";
import MarketplacePreview from "../components/landing/MarketplacePreview.jsx";
import CtaSection from "../components/landing/CtaSection.jsx";

const Landing = () => {
  return (
    <div className="min-h-screen">
      <Header />
      <main>
        <Hero />
        <Features />
        <HowItWorks />
        <RoleSelection />
        <MarketplacePreview />
        <CtaSection />
      </main>
      <Footer />
    </div>
  );
};

export default Landing;