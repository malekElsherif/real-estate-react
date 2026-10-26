import { useState } from "react";
import { Outlet, useLocation, Link } from "react-router-dom";
import AdminSidebar from "./AdminSidebar";
import { BrandStyles, useAdminPrefs, useApplyAdminAppearance } from "./adminBrand";

export const AdminLayout = () => {
  const [prefs] = useAdminPrefs();
  useApplyAdminAppearance(prefs);

  const [sidebarOpen, setSidebarOpen] = useState(
    () => prefs.sidebarOpen && (typeof window === "undefined" || window.innerWidth >= 1024)
  );
  const location = useLocation();

  const pathSegments = location.pathname.split("/").filter(Boolean);
  const currentPathName = pathSegments[pathSegments.length - 1] || "dashboard";
  const formattedTitle = currentPathName
    .replace(/-/g, " ")
    .replace(/\b\w/g, (char) => char.toUpperCase());

  return (
    <div className={`min-h-screen bg-stone-50 text-stone-900 antialiased ${prefs.compact ? "admin-compact" : ""}`}>
      <BrandStyles />

      {sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 z-40 bg-stone-950/60 backdrop-blur-sm lg:hidden"
          aria-hidden="true"
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-50 w-72 bg-stone-900 transition-transform duration-300 ease-in-out ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <AdminSidebar />
      </aside>

      <div className={`min-h-screen transition-all duration-300 ease-in-out ${sidebarOpen ? "lg:ml-72" : "lg:ml-0"}`}>
        <div className="sticky top-0 z-30">
          <header className="flex h-14 items-center justify-between border-b border-stone-200 bg-white px-4 sm:px-6 lg:px-8 shadow-xs">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setSidebarOpen((prev) => !prev)}
                type="button"
                className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-stone-200 bg-stone-50 text-stone-900 transition hover:border-amber-600 hover:text-amber-700 active:scale-95"
                aria-label="Toggle navigation menu"
              >
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="1.6"
                    d={sidebarOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"}
                  />
                </svg>
              </button>

              <nav className="hidden items-center gap-2 text-[10px] uppercase tracking-wider text-stone-500 font-semibold sm:flex">
                <Link to="/admin/dashboard" className="transition hover:text-amber-700 no-underline">Admin</Link>
                <span className="text-amber-600">/</span>
                <span className="text-stone-900">{formattedTitle}</span>
              </nav>
            </div>

            <div className="flex items-center gap-3">
              <Link
                to="/admin/dashboard/settings"
                className="inline-flex items-center gap-2 rounded-xl border border-stone-200 px-3 py-2 text-[10px] font-semibold uppercase tracking-wider text-stone-900 transition hover:border-amber-600 hover:text-amber-700 no-underline"
              >
                Settings
              </Link>

              <Link
                to="/"
                className="inline-flex items-center gap-2 rounded-xl bg-stone-900 px-3 py-2 text-[10px] font-semibold uppercase tracking-wider text-stone-50 transition hover:bg-amber-800 active:scale-95 no-underline"
              >
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.6" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
                <span className="hidden sm:inline">Live Site</span>
              </Link>
            </div>
          </header>
        </div>

        <main className="min-h-[calc(100vh-3.5rem)] p-4 sm:p-6 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
