import { Link } from "react-router-dom";
import {
  FaFacebookF,
  FaInstagram,
  FaTwitter,
  FaLinkedinIn,
} from "react-icons/fa";
import Logo from "./Logo.jsx";

const quickLinks = [
  { label: "Home", to: "/" },
  { label: "Features", to: "/#features" },
  { label: "How It Works", to: "/#how-it-works" },
  { label: "Marketplace", to: "/#marketplace" },
];

const farmerLinks = [
  { label: "Farmer Login", to: "/login/farmer" },
  { label: "Create Farmer Account", to: "/signup/farmer" },
  { label: "For Farmers", to: "/#how-it-works" },
];

const customerLinks = [
  { label: "Customer Login", to: "/login/customer" },
  { label: "Create Customer Account", to: "/signup/customer" },
  { label: "Browse Marketplace", to: "/#marketplace" },
];

const socials = [
  { icon: FaFacebookF, label: "Facebook", href: "https://facebook.com" },
  { icon: FaInstagram, label: "Instagram", href: "https://instagram.com" },
  { icon: FaTwitter, label: "Twitter", href: "https://twitter.com" },
  { icon: FaLinkedinIn, label: "LinkedIn", href: "https://linkedin.com" },
];

const Footer = () => {
  return (
    <footer id="contact" className="bg-brand-950 text-brand-100">
      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="grid gap-10 lg:grid-cols-5">
          <div className="lg:col-span-2">
            <Logo light />
            <p className="mt-4 max-w-sm text-sm leading-relaxed text-brand-200/80">
              MarketLink connects local farmers directly with customers — fresh
              produce, fair prices, and a trusted agricultural marketplace for
              every community.
            </p>
            <div className="mt-6 flex gap-3">
              {socials.map(({ icon: Icon, label, href }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={label}
                  className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand-900 text-brand-200 transition-colors hover:bg-brand-700 hover:text-white"
                >
                  <Icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>

          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider text-white">
              Quick Links
            </h4>
            <ul className="mt-4 space-y-2.5 text-sm">
              {quickLinks.map((link) => (
                <li key={link.label}>
                  <Link
                    to={link.to}
                    className="text-brand-200/80 transition-colors hover:text-white"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider text-white">
              For Farmers
            </h4>
            <ul className="mt-4 space-y-2.5 text-sm">
              {farmerLinks.map((link) => (
                <li key={link.label}>
                  <Link
                    to={link.to}
                    className="text-brand-200/80 transition-colors hover:text-white"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider text-white">
              For Customers
            </h4>
            <ul className="mt-4 space-y-2.5 text-sm">
              {customerLinks.map((link) => (
                <li key={link.label}>
                  <Link
                    to={link.to}
                    className="text-brand-200/80 transition-colors hover:text-white"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-12 border-t border-brand-900 pt-6 text-sm text-brand-300/60">
          <p>© {new Date().getFullYear()} MarketLink. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;