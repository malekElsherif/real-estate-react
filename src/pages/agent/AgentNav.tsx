import { Link, useLocation } from "react-router-dom";
import { usegetme } from "../../hooks/useUsers";

interface AgentNavProps {
  setIsMobileOpen?: React.Dispatch<React.SetStateAction<boolean>>;
  isCollapsed?: boolean;
}

const btn = "no-underline rounded-xl px-4 py-2 text-xs font-semibold uppercase tracking-wider transition";

const AgentNav = ({ setIsMobileOpen, isCollapsed = false }: AgentNavProps) => {
  const location = useLocation();
  const { data: meData } = usegetme();
  const agent = meData?.data;
  const agentName = agent?.name || agent?.username || "Agent";

  const navLinks = [
    { name: "Dashboard", path: "/agent/dashboard" },
    { name: "My Properties", path: "/agent/my-properties" },
    { name: "Requests", path: "/agent/requests" },
    { name: "Profile", path: "/agent/profile" },
  ];

  return (
    <nav
      className={`fixed top-0 right-0 z-40 border-b border-stone-200 bg-white transition-all duration-300 left-0 ${
        isCollapsed ? "lg:left-20" : "lg:left-64"
      }`}
    >
      <div className="mx-auto flex h-16 w-full items-center justify-between px-6 sm:px-8">
        {/* Mobile Toggle & Brand */}
        <div className="flex items-center gap-3">
          {setIsMobileOpen && (
            <button
              type="button"
              onClick={() => setIsMobileOpen((prev) => !prev)}
              className="flex h-9 w-9 items-center justify-center rounded-xl border border-stone-200 bg-stone-50 text-stone-900 transition hover:bg-stone-100 lg:hidden cursor-pointer"
            >
              ☰
            </button>
          )}

          <Link
            to="/agent"
            className="text-xl font-bold tracking-tight text-stone-900 no-underline lg:hidden"
          >
            RealEstate<span className="text-amber-800">.</span>
          </Link>
        </div>

        {/* Desktop Links - متمركزة بمسافات متوازنة */}
        <div className="hidden items-center gap-8 md:flex">
          {navLinks.map((link) => {
            const isActive = location.pathname === link.path;
            return (
              <Link
                key={link.path}
                to={link.path}
                className={`text-xs font-semibold uppercase tracking-wider no-underline transition py-2 ${
                  isActive
                    ? "border-b-2 border-amber-800 text-amber-800"
                    : "text-stone-700 hover:text-amber-800"
                }`}
              >
                {link.name}
              </Link>
            );
          })}
        </div>

        {/* Right Actions: Agent Profile Name Button & Back to Website */}
        <div className="flex items-center gap-2">
          <Link
            to="/agent/profile"
            className={`${btn} text-stone-700 hover:bg-stone-100 font-bold`}
          >
            {agentName}
          </Link>

          <Link
            to="/"
            className={`${btn} border border-stone-200 bg-stone-50 text-stone-700 hover:bg-stone-900 hover:text-white`}
            title="Back to Website"
          >
            Website ↩
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default AgentNav;
