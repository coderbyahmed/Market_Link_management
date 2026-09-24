import { FaCheckCircle } from "react-icons/fa";
import {
  GiBasket,
  GiFarmTractor,
  GiWheat,
  GiSunflower,
} from "react-icons/gi";
import Logo from "../common/Logo.jsx";

const highlights = [
  {
    icon: GiFarmTractor,
    title: "Direct Farmer Connections",
    text: "Buy straight from the people who grow.",
  },
  {
    icon: GiBasket,
    title: "Harvest-Fresh Produce",
    text: "Farm-fresh quality, delivered your way.",
  },
  {
    icon: GiSunflower,
    title: "Community Marketplace",
    text: "A trusted space built for local trade.",
  },
];

const AuthLayout = ({ title, subtitle, children }) => {
  return (
    <div className="flex min-h-screen bg-white">
      <div className="hidden w-1/2 flex-col justify-between overflow-hidden bg-gradient-to-br from-brand-900 via-brand-800 to-brand-600 p-10 lg:flex lg:w-[44%]">
        <Logo light />

        <div>
          <span className="mb-5 inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-1.5 text-xs font-medium text-brand-100">
            <GiWheat className="h-4 w-4" />
            Fresh from farm to table
          </span>
          <h2 className="max-w-md font-display text-4xl font-semibold leading-tight text-white">
            {title}
          </h2>
          <p className="mt-3 max-w-md text-brand-100/85">{subtitle}</p>

          <ul className="mt-8 space-y-4">
            {highlights.map(({ icon: Icon, title: t, text }) => (
              <li key={t} className="flex items-start gap-3">
                <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white/10 text-white">
                  <Icon className="h-4 w-4" />
                </span>
                <div>
                  <p className="text-sm font-semibold text-white">{t}</p>
                  <p className="text-sm text-brand-100/75">{text}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>

        <div className="flex items-center gap-2 text-sm text-brand-100/70">
          <FaCheckCircle className="h-4 w-4 text-brand-300" />
          Trusted by farmers and customers across the region
        </div>
      </div>

      <div className="flex w-full flex-col justify-center px-5 py-10 sm:px-10 lg:w-[56%] lg:px-16">
        <div className="mb-8 lg:hidden">
          <Logo />
        </div>
        <div className="mx-auto w-full max-w-md">{children}</div>
      </div>
    </div>
  );
};

export default AuthLayout;