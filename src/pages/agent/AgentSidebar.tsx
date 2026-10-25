import { useLocation, useNavigate } from "react-router-dom";

interface AgentSidebarProps {
  isCollapsed: boolean;
  setIsCollapsed: (value: boolean) => void;
  isMobileOpen?: boolean;
  setIsMobileOpen?: (value: boolean) => void;
}

const AgentSidebar = ({
  isCollapsed,
  setIsCollapsed,
  isMobileOpen = false,
  setIsMobileOpen,
}: AgentSidebarProps) => {
  const navigate = useNavigate();
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  const handleNavigation = (path: string) => {
    navigate(path);
    if (setIsMobileOpen) {
      setIsMobileOpen(false);
    }
  };

  const menuItems = [
    { label: "Dashboard", path: "/agent/dashboard", icon: "🏠" },
    { label: "My Properties", path: "/agent/my-properties", icon: "🏢" },
    { label: "Requests", path: "/agent/requests", icon: "📩" },
    { label: "Request History", path: "/agent/request-history", icon: "📋" },
    { label: "Add Property", path: "/agent/add-property", icon: "➕" },
    { label: "Profile", path: "/agent/profile", icon: "👤" },
  ];

  return (
    <>
      {/* Mobile Overlay */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-stone-900/40 backdrop-blur-xs lg:hidden"
          onClick={() => setIsMobileOpen && setIsMobileOpen(false)}
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed left-0 top-0 z-50 flex h-screen flex-col border-r border-stone-200 bg-white transition-all duration-300 ${
          isMobileOpen
            ? "translate-x-0 w-64"
            : "-translate-x-full lg:translate-x-0"
        } ${isCollapsed ? "lg:w-20" : "lg:w-64"}`}
      >
        {/* Sidebar Header Container */}
        <div className="flex h-20 shrink-0 items-center justify-between border-b border-stone-100 px-4 pt-4 pb-3">
          {(!isCollapsed || isMobileOpen) && (
            <div className="truncate">
              <h1 className="text-lg font-bold leading-none tracking-tight text-stone-900">
                ESTATE<span className="text-amber-800">.</span>
              </h1>
              <p className="mt-1 text-[9px] font-semibold uppercase tracking-widest text-stone-400">
                Agent Portal
              </p>
            </div>
          )}

          {/* Desktop Toggle Button */}
          <button
            type="button"
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="hidden h-7 w-7 items-center justify-center rounded-xl border border-stone-200 bg-stone-50 text-stone-700 transition hover:bg-stone-900 hover:text-white lg:flex cursor-pointer"
            title={isCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
          >
            <svg
              className={`h-3.5 w-3.5 transition-transform duration-300 ${
                isCollapsed ? "rotate-180" : ""
              }`}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
            </svg>
          </button>

          {/* Mobile Close Button */}
          {setIsMobileOpen && (
            <button
              type="button"
              onClick={() => setIsMobileOpen(false)}
              className="flex h-7 w-7 items-center justify-center rounded-xl border border-stone-200 bg-stone-50 text-stone-700 lg:hidden cursor-pointer"
            >
              ✕
            </button>
          )}
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 space-y-1.5 overflow-y-auto p-3">
          {menuItems.map((item) => {
            const active = isActive(item.path);

            return (
              <button
                key={item.path}
                type="button"
                onClick={() => handleNavigation(item.path)}
                title={isCollapsed ? item.label : undefined}
                className={`flex w-full items-center gap-3.5 rounded-xl py-2.5 transition-all duration-200 cursor-pointer ${
                  isCollapsed ? "lg:justify-center lg:px-0 px-3.5" : "px-3.5 text-left"
                } ${
                  active
                    ? "bg-stone-900 text-white shadow-xs font-semibold"
                    : "text-stone-700 hover:bg-stone-100 hover:text-amber-800"
                }`}
              >
                <span className="text-base shrink-0">{item.icon}</span>
                {(!isCollapsed || isMobileOpen) && (
                  <span className="truncate text-xs font-semibold uppercase tracking-wider">
                    {item.label}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Bottom Action */}
        <div className="shrink-0 border-t border-stone-100 p-3">
          <button
            type="button"
            onClick={() => handleNavigation("/")}
            title={isCollapsed ? "Back to Website" : undefined}
            className={`flex w-full items-center gap-3.5 rounded-xl py-2.5 text-stone-700 transition hover:bg-stone-100 hover:text-amber-800 cursor-pointer ${
              isCollapsed ? "lg:justify-center lg:px-0 px-3.5" : "px-3.5"
            }`}
          >
            <span className="text-base shrink-0">↩</span>
            {(!isCollapsed || isMobileOpen) && (
              <span className="truncate text-xs font-semibold uppercase tracking-wider">
                Back to Website
              </span>
            )}
          </button>
        </div>
      </aside>
    </>
  );
};

export default AgentSidebar;
