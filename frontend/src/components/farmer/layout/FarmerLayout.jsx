import { useEffect, useState } from "react";
import { Drawer } from "antd";
import FarmerSidebar from "./FarmerSidebar.jsx";
import FarmerHeader from "./FarmerHeader.jsx";

const FarmerLayout = ({ children }) => {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [theme, setTheme] = useState(
    () => localStorage.getItem("ml-farmer-theme") || "light"
  );

  useEffect(() => {
    localStorage.setItem("ml-farmer-theme", theme);
  }, [theme]);

  const toggleTheme = () =>
    setTheme((prev) => (prev === "light" ? "dark" : "light"));

  return (
    <div
      className={`min-h-screen ${theme === "dark" ? "dark" : ""} bg-stone-100 dark:bg-stone-950 lg:flex`}
    >
      <aside className="hidden lg:sticky lg:top-0 lg:block lg:h-screen lg:shrink-0">
        <div
          className={`flex h-full flex-col border-r border-stone-200 bg-white transition-all duration-200 dark:border-stone-800 dark:bg-stone-900 ${
            collapsed ? "w-20" : "w-64"
          }`}
        >
          <FarmerSidebar
            variant="desktop"
            collapsed={collapsed}
            onToggle={() => setCollapsed((prev) => !prev)}
          />
        </div>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <FarmerHeader
          onToggleSidebar={() => setMobileOpen(true)}
          theme={theme}
          onToggleTheme={toggleTheme}
        />
        <main className="flex-1 px-4 py-6 sm:px-6 lg:px-8">{children}</main>
      </div>

      <Drawer
        placement="left"
        open={mobileOpen}
        onClose={() => setMobileOpen(false)}
        size={272}
        styles={{ body: { padding: 0 } }}
      >
        <FarmerSidebar
          variant="mobile"
          onNavigate={() => setMobileOpen(false)}
        />
      </Drawer>
    </div>
  );
};

export default FarmerLayout;
