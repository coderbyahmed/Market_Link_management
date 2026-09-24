import { useState } from "react";
import { FaBars, FaTimes } from "react-icons/fa";
import Logo from "./Logo.jsx";
import Button from "./Button.jsx";

const navLinks = [
  { label: "Home", to: "/" },
  { label: "Features", to: "/#features" },
  { label: "How It Works", to: "/#how-it-works" },
  { label: "Marketplace", to: "/#marketplace" },
  { label: "Contact", to: "/#contact" },
];

const Header = () => {
  const [open, setOpen] = useState(false);

  const handleNavClick = () => setOpen(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-stone-200/70 bg-white/85 backdrop-blur-md">
      <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        <Logo />

        <div className="hidden items-center gap-7 md:flex">
          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.to}
              className="text-sm font-medium text-stone-600 transition-colors hover:text-brand-700"
            >
              {link.label}
            </a>
          ))}
        </div>

        <div className="hidden items-center gap-3 md:flex">
          <Button to="/login" variant="ghost" size="sm">
            Login
          </Button>
          <Button to="/get-started" size="sm">
            Get Started
          </Button>
        </div>

        <button
          type="button"
          onClick={() => setOpen((prev) => !prev)}
          className="flex h-10 w-10 items-center justify-center rounded-lg text-stone-600 hover:bg-stone-100 md:hidden"
          aria-label="Toggle menu"
        >
          {open ? <FaTimes className="h-5 w-5" /> : <FaBars className="h-5 w-5" />}
        </button>
      </nav>

      {open && (
        <div className="border-t border-stone-200 bg-white px-4 pb-5 pt-2 md:hidden">
          <div className="flex flex-col gap-1">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.to}
                onClick={handleNavClick}
                className="rounded-lg px-3 py-2.5 text-sm font-medium text-stone-700 hover:bg-brand-50 hover:text-brand-700"
              >
                {link.label}
              </a>
            ))}
          </div>
          <div className="mt-4 grid grid-cols-2 gap-3">
            <Button to="/login" variant="outline" size="sm">
              Login
            </Button>
            <Button to="/get-started" size="sm">
              Get Started
            </Button>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;