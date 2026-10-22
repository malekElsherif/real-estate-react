import { useState } from "react";
import { Outlet, useLocation, Link } from "react-router-dom";
import AdminSidebar from "./AdminSidebar";
import {
  BrandStyles,
  useAdminPrefs,
  useApplyAdminAppearance,
} from "./adminBrand";

export const AdminLayout = () => {
  const [prefs] = useAdminPrefs();
  useApplyAdminAppearance(prefs);

  // Desktop honours the saved preference; phones/tablets always start closed
  const [sidebarOpen, setSidebarOpen] = useState(
    () =>
      prefs.sidebarOpen &&
      (typeof window === "undefined" || window.innerWidth >= 1024)
  );
  const location = useLocation();

  const pathSegments = location.pathname.split("/").filter(Boolean);

  const currentPathName =
    pathSegments[pathSegments.length - 1] || "dashboard";

  const formattedTitle = currentPathName
    .replace(/-/g, " ")
    .replace(/\b\w/g, (char) => char.toUpperCase());

  return (
    <div
      className={`admin-shell brand-root min-h-screen text-[#14213D] antialiased ${
        prefs.compact ? "admin-compact" : ""
      }`}
    >
      {/* Fonts + shared classes for the whole admin area */}
      <BrandStyles />

      {/* Overlay - Mobile */}
      {sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 z-40 backdrop-blur-sm lg:hidden"
          style={{ background: "rgba(11,20,38,0.6)" }}
          aria-hidden="true"
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed inset-y-0 left-0 z-50 w-72
          transition-transform duration-300 ease-in-out
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
        `}
        style={{ background: "#0B1426" }}
      >
        <AdminSidebar />
      </aside>

      {/* Main Wrapper */}
      <div
        className={`
          min-h-screen
          transition-all duration-300 ease-in-out
          ${sidebarOpen ? "lg:ml-72" : "lg:ml-0"}
        `}
      >
        {/* Top strip + header (sticky together) */}
        <div className="sticky top-0 z-30">
          <header className="adm-topbar flex h-14 items-center justify-between px-4 sm:px-6 lg:px-8">
            {/* Left Side */}
            <div className="flex items-center gap-4">
              {/* Sidebar Toggle */}
              <button
                onClick={() => setSidebarOpen((prev) => !prev)}
                type="button"
                className="inline-flex h-9 w-9 items-center justify-center border border-[#14213D]/20 bg-white text-[#14213D] transition hover:border-[#B8863B] hover:text-[#B8863B] active:scale-95"
                aria-label="Toggle navigation menu"
              >
                {sidebarOpen ? (
                  <svg
                    className="h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="1.6"
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                ) : (
                  <svg
                    className="h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="1.6"
                      d="M4 6h16M4 12h16M4 18h16"
                    />
                  </svg>
                )}
              </button>

              {/* Breadcrumb */}
              <nav className="eyebrow hidden items-center gap-2 text-[#14213D]/55 sm:flex">
                <Link
                  to="/admin/dashboard"
                  className="transition hover:text-[#B8863B]"
                >
                  Admin
                </Link>

                <span className="text-[#B8863B]">/</span>

                <span className="font-semibold text-[#14213D]">
                  {formattedTitle}
                </span>
              </nav>
            </div>

            {/* Right Side */}
            <div className="flex items-center gap-3">
              <Link
                to="/admin/dashboard/settings"
                className="eyebrow inline-flex items-center gap-2 border border-[#14213D]/25 px-3 py-2 font-semibold text-[#14213D] transition hover:border-[#B8863B] hover:text-[#B8863B]"
              >
                Settings
              </Link>

              <Link
                to="/"
                className="eyebrow inline-flex items-center gap-2 bg-[#14213D] px-3 py-2 font-semibold text-[#FFFDF9] transition active:scale-95"
              >
                <svg
                  className="h-4 w-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="1.6"
                    d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                  />
                </svg>

                <span className="hidden sm:inline">Live Site</span>
              </Link>
            </div>
          </header>
        </div>

        {/* Content */}
        <main className="min-h-[calc(100vh-3.5rem)] p-4 sm:p-6 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
