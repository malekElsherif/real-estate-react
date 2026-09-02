import { useLocation, useNavigate } from "react-router-dom";

interface AgentSidebarProps {
  isCollapsed: boolean;
  setIsCollapsed: (value: boolean) => void;
  isMobileOpen?: boolean;
  setIsMobileOpen?: (value: boolean) => void;
}

const serif = "[font-family:'Fraunces',serif]";
const mono = "[font-family:'IBM_Plex_Mono',monospace]";

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
          className="fixed inset-0 z-40 bg-[#14213D]/40 backdrop-blur-sm lg:hidden"
          onClick={() => setIsMobileOpen && setIsMobileOpen(false)}
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed left-0 top-0 z-50 flex h-screen flex-col border-r border-[#14213D] bg-[#FFFDF9] transition-all duration-300 ${
          isMobileOpen
            ? "translate-x-0 w-64"
            : "-translate-x-full lg:translate-x-0"
        } ${isCollapsed ? "lg:w-20" : "lg:w-64"}`}
      >
        {/* Registration mark */}
        <span className="pointer-events-none absolute -right-px -top-px h-2.5 w-2.5 border-r-[1.5px] border-t-[1.5px] border-[#14213D]" />

        {/* Sidebar Header Container - تم تعديل الـ Padding ليظهر الشعار بالكامل داخل الإطار */}
        <div className="flex h-20 shrink-0 items-center justify-between border-b border-[#14213D] px-4 pt-4 pb-3">
          {(!isCollapsed || isMobileOpen) && (
            <div className="truncate">
              <h1 className={`${serif} text-lg font-bold leading-none text-[#14213D]`}>
                ESTATE<span className="text-[#B8863B]">.</span>
              </h1>
              <p className={`${mono} mt-1 text-[9px] uppercase tracking-widest text-[#4A5568]`}>
                Agent Portal
              </p>
            </div>
          )}

          {/* Desktop Toggle Button */}
          <button
            type="button"
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="hidden h-7 w-7 items-center justify-center border border-[#14213D] bg-[#F7F5EF] text-[#14213D] transition hover:bg-[#14213D] hover:text-[#F7F5EF] lg:flex"
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
              className="flex h-7 w-7 items-center justify-center border border-[#14213D] bg-[#F7F5EF] text-[#14213D] lg:hidden"
            >
              ✕
            </button>
          )}
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 space-y-2 overflow-y-auto p-3">
          {menuItems.map((item) => {
            const active = isActive(item.path);

            return (
              <button
                key={item.path}
                type="button"
                onClick={() => handleNavigation(item.path)}
                title={isCollapsed ? item.label : undefined}
                className={`flex w-full items-center gap-3.5 border py-2.5 transition-all duration-200 ${
                  isCollapsed ? "lg:justify-center lg:px-0 px-3.5" : "px-3.5 text-left"
                } ${
                  active
                    ? "border-[#14213D] bg-[#14213D] text-[#F7F5EF]"
                    : "border-transparent text-[#14213D] hover:border-[#E4DFD3] hover:bg-[#F7F5EF]"
                }`}
              >
                <span className="text-base">{item.icon}</span>
                {(!isCollapsed || isMobileOpen) && (
                  <span className={`${mono} truncate text-xs font-medium uppercase tracking-wider`}>
                    {item.label}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Bottom Action */}
        <div className="shrink-0 border-t border-[#14213D] p-3">
          <button
            type="button"
            onClick={() => handleNavigation("/")}
            title={isCollapsed ? "Back to Website" : undefined}
            className={`flex w-full items-center gap-3.5 border border-transparent py-2.5 text-[#14213D] transition hover:border-[#14213D] hover:bg-[#F7F5EF] ${
              isCollapsed ? "lg:justify-center lg:px-0 px-3.5" : "px-3.5"
            }`}
          >
            <span className="text-base">↩</span>
            {(!isCollapsed || isMobileOpen) && (
              <span className={`${mono} truncate text-xs font-medium uppercase tracking-wider`}>
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
