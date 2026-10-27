import { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";
import { usegetme } from "../../hooks/useUsers";
import Myfav from "../properties/Myfavourites";

const btn = "no-underline rounded-xl px-4 py-2 text-sm font-medium transition";

const Navbar = () => {
  const { data } = usegetme();
  const navigate = useNavigate();
  const qc = useQueryClient();
  const [openFav, setOpenFav] = useState(false);
  const [menu, setMenu] = useState(false);

  const user = data?.data;
  const role = user?.role?.toUpperCase();

  const links = [
    ["/", "Home"],
    ["/properties", "Properties"],
    ["/about", "About"],
    // ["/contact", "Contact"],
    ...(user && role === "USER" ? [["/myrequests", "My Requests"]] : []),
  ];

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    qc.removeQueries({ queryKey: ["me"] });
    setMenu(false);
    navigate("/login");
  };

  const linkClass = ({ isActive }: { isActive: boolean }) =>
    `text-sm font-medium no-underline transition ${isActive ? "text-amber-800" : "text-stone-500 hover:text-stone-900"}`;

  // Account actions, shared by desktop and mobile
  const actions = user ? (
    <>
      {role === "AGENT" && (
        <Link to="/agent/dashboard" onClick={() => setMenu(false)} className={`${btn} bg-amber-50 text-amber-900 hover:bg-amber-100`}>
          Dashboard
        </Link>
      )}
      <Link to="/profile" onClick={() => setMenu(false)} className={`${btn} text-stone-700 hover:bg-stone-100`}>
        {user.name}
      </Link>
      <button onClick={logout} className={`${btn} text-rose-600 hover:bg-rose-50`}>Logout</button>
    </>
  ) : (
    <>
      <Link to="/login" onClick={() => setMenu(false)} className={`${btn} text-stone-700 hover:bg-stone-100`}>Login</Link>
      <Link to="/register" onClick={() => setMenu(false)} className={`${btn} bg-amber-800 text-white hover:bg-amber-900`}>Get started</Link>
    </>
  );

  const favBtn = user && (
    <button
      onClick={() => setOpenFav(true)}
      title="Favorites"
      className="grid h-10 w-10 place-items-center rounded-xl text-lg text-stone-500 transition hover:bg-rose-50 hover:text-rose-500"
    >
      ♡
    </button>
  );

  return (
    <>
      <nav className="sticky top-0 z-40 border-b border-stone-100 bg-stone-50/95 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
          <Link to="/" className="text-xl font-bold tracking-tight text-stone-900 no-underline">
            Estate<span className="text-amber-800">.</span>
          </Link>

          {/* Desktop */}
          <div className="hidden items-center gap-8 md:flex">
            {links.map(([to, label]) => (
              <NavLink key={to} to={to} end={to === "/"} className={linkClass}>{label}</NavLink>
            ))}
          </div>
          <div className="hidden items-center gap-1 md:flex">{favBtn}{actions}</div>

          {/* Mobile toggle */}
          <div className="flex items-center gap-1 md:hidden">
            {favBtn}
            <button onClick={() => setMenu(!menu)} aria-label="Toggle menu" className="grid h-10 w-10 place-items-center rounded-xl text-xl text-stone-700 hover:bg-stone-100">
              {menu ? "✕" : "☰"}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {menu && (
          <div className="space-y-1 border-t border-stone-100 bg-white px-4 py-4 md:hidden">
            {links.map(([to, label]) => (
              <NavLink key={to} to={to} end={to === "/"} onClick={() => setMenu(false)} className={(s) => `block rounded-xl px-3 py-2.5 ${linkClass(s)}`}>
                {label}
              </NavLink>
            ))}
            <div className="flex flex-col gap-2 border-t border-stone-100 pt-3 [&>*]:text-center">{actions}</div>
          </div>
        )}
      </nav>

      {user && <Myfav open={openFav} onClose={() => setOpenFav(false)} />}
    </>
  );
};

export default Navbar;
