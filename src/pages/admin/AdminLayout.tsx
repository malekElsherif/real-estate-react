import { useState } from "react";
import { Outlet, useLocation, Link } from "react-router-dom";
import AdminSidebar from "./AdminSidebar";

export const AdminLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const location = useLocation();

  const pathSegments = location.pathname.split("/").filter(Boolean);

  const currentPathName =
    pathSegments[pathSegments.length - 1] || "dashboard";

  const formattedTitle = currentPathName
    .replace(/-/g, " ")
    .replace(/\b\w/g, (char) => char.toUpperCase());

  return (
    <div className="min-h-screen bg-slate-50/60 font-sans antialiased">

      {/* Overlay - Mobile */}
      {sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 z-40 bg-slate-900/40 backdrop-blur-xs lg:hidden"
          aria-hidden="true"
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed inset-y-0 left-0 z-50
          w-72 bg-white
          transition-transform duration-300 ease-in-out
          ${
            sidebarOpen
              ? "translate-x-0"
              : "-translate-x-full"
          }
        `}
      >
        <AdminSidebar />
      </aside>

      {/* Main Wrapper */}
      <div
        className={`
          min-h-screen
          transition-all duration-300 ease-in-out
          ${
            sidebarOpen
              ? "lg:ml-72"
              : "lg:ml-0"
          }
        `}
      >

        {/* Header */}
        <header
          className="
            sticky top-0 z-30
            flex h-16 items-center justify-between
            border-b border-slate-200/80
            bg-white/80
            px-4 sm:px-6 lg:px-8
            backdrop-blur-md
          "
        >

          {/* Left Side */}
          <div className="flex items-center gap-4">

            {/* Sidebar Toggle */}
            <button
              onClick={() => setSidebarOpen((prev) => !prev)}
              type="button"
              className="
                inline-flex h-9 w-9
                items-center justify-center
                rounded-xl
                border border-slate-200
                bg-white
                text-slate-600
                shadow-sm
                transition
                hover:bg-slate-50
                hover:text-slate-900
                active:scale-95
              "
              aria-label="Toggle navigation menu"
            >
              {sidebarOpen ? (
                /* Close Icon */
                <svg
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              ) : (
                /* Menu Icon */
                <svg
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
              )}
            </button>

            {/* Breadcrumb */}
            <nav className="hidden items-center gap-2 text-xs font-medium text-slate-500 sm:flex">
              <Link
                to="/admin/dashboard"
                className="transition hover:text-slate-900"
              >
                Admin
              </Link>

              <span>/</span>

              <span className="font-semibold text-slate-900">
                {formattedTitle}
              </span>
            </nav>
          </div>

          {/* Right Side */}
          <div className="flex items-center gap-3">

            {/* Status */}
            <span
              className="
                hidden sm:inline-flex
                items-center gap-1.5
                rounded-full
                bg-emerald-50
                px-2.5 py-1
                text-xs font-semibold
                text-emerald-700
              "
            >
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-500" />
              Admin Portal
            </span>

            {/* Live Site */}
            <Link
              to="/"
              className="
                inline-flex items-center gap-1.5
                rounded-xl
                border border-slate-200
                bg-white
                px-3 py-1.5
                text-xs font-semibold
                text-slate-700
                shadow-sm
                transition
                hover:bg-slate-50
                active:scale-95
              "
            >
              <svg
                className="h-4 w-4 text-slate-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                />
              </svg>

              <span className="hidden sm:inline">
                Live Site
              </span>
            </Link>
          </div>
        </header>

        {/* Content */}
        <main className="min-h-[calc(100vh-4rem)] p-4 sm:p-6 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
