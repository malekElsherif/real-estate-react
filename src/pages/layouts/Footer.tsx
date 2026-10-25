import { Link } from "react-router-dom";

const links = [
  ["/", "Home"],
  ["/properties", "Properties"],
  ["/about", "About us"],
  ["/contact", "Contact"],
];

const Footer = () => (
  <footer className="border-t border-stone-200 bg-stone-100">
    <div className="mx-auto grid max-w-7xl gap-10 px-6 py-14 sm:grid-cols-2 lg:grid-cols-12 lg:px-8">
      <div className="lg:col-span-5">
        <Link to="/" className="text-xl font-bold tracking-tight text-stone-900 no-underline">
          Estate<span className="text-amber-800">.</span>
        </Link>
        <p className="mt-3 max-w-sm text-sm leading-relaxed text-stone-500">
          A simple real estate platform for discovering, renting and managing properties across Egypt.
        </p>
      </div>

      <div className="lg:col-span-3">
        <h4 className="text-sm font-semibold text-stone-900">Navigation</h4>
        <ul className="mt-4 space-y-2.5 text-sm">
          {links.map(([to, label]) => (
            <li key={to}>
              <Link to={to} className="text-stone-500 no-underline transition hover:text-amber-800">{label}</Link>
            </li>
          ))}
        </ul>
      </div>

      <div className="lg:col-span-4">
        <h4 className="text-sm font-semibold text-stone-900">Contact</h4>
        <div className="mt-4 space-y-2.5 text-sm text-stone-500">
          <p>Tanta, El-Gharbiya, Egypt</p>
          <p>Mon – Fri, 09:00 – 18:00</p>
          <p className="text-amber-800">support@estate.com</p>
        </div>
      </div>
    </div>

    <div className="border-t border-stone-200 px-6 py-5 text-center text-xs text-stone-400">
      © {new Date().getFullYear()} Estate. All rights reserved.
    </div>
  </footer>
);

export default Footer;
