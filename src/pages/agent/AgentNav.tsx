import React from "react";
import { Link, useLocation } from "react-router-dom";

interface AgentNavProps {
  setIsMobileOpen?: React.Dispatch<React.SetStateAction<boolean>>;
  isCollapsed?: boolean;
}

const serif = "[font-family:'Fraunces',serif]";
const mono = "[font-family:'IBM_Plex_Mono',monospace]";

const AgentNav = ({ setIsMobileOpen, isCollapsed = false }: AgentNavProps) => {
  const location = useLocation();

  const navLinks = [
    { name: "Dashboard", path: "/agent/dashboard" },
    { name: "My Properties", path: "/agent/my-properties" },
    { name: "Requests", path: "/agent/requests" },
    { name: "Profile", path: "/agent/profile" },
  ];

  return (
    <nav
      className={`fixed top-0 right-0 z-40 border-b border-[#14213D] bg-[#FFFDF9] transition-all duration-300 left-0 ${
        isCollapsed ? "lg:left-20" : "lg:left-64"
      }`}
    >
      <div className="mx-auto flex h-16 items-center justify-between px-4 sm:px-6">
        {/* Mobile Toggle Button */}
        <div className="flex items-center gap-3">
          {setIsMobileOpen && (
            <button
              type="button"
              onClick={() => setIsMobileOpen((prev) => !prev)}
              className="flex h-9 w-9 items-center justify-center border border-[#14213D] bg-[#F7F5EF] text-[#14213D] lg:hidden"
            >
              ☰
            </button>
          )}

          <Link
            to="/agent"
            className={`${serif} text-xl font-bold text-[#14213D] lg:hidden`}
          >
            RealEstate<span className="text-[#B8863B]">.</span>
          </Link>
        </div>

        {/* Desktop Links */}
        <div className="hidden items-center gap-6 md:flex">
          {navLinks.map((link) => {
            const isActive = location.pathname === link.path;
            return (
              <Link
                key={link.path}
                to={link.path}
                className={`${mono} text-xs font-semibold uppercase tracking-wider transition ${
                  isActive
                    ? "border-b-2 border-[#B8863B] text-[#B8863B]"
                    : "text-[#14213D] hover:text-[#B8863B]"
                }`}
              >
                {link.name}
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
};

export default AgentNav;
