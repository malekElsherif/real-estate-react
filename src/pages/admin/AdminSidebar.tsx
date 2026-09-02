import { useLocation, useNavigate } from "react-router-dom";

const AdminSidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <aside className="fixed left-0 top-0 z-40 flex h-screen w-72 flex-col border-r border-slate-200 bg-white">

      {/* Logo */}
      <div className="flex h-20 items-center border-b border-slate-200 px-6">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-600 font-black text-white">
            A
          </div>

          <div className="whitespace-nowrap">
            <p className="font-black text-slate-900">
              Admin Panel
            </p>

            <p className="text-xs text-slate-400">
              Estate Management
            </p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto px-3 py-6">

        {/* Overview */}
        <p className="mb-3 px-3 text-[10px] font-black uppercase tracking-wider text-slate-400">
          Overview
        </p>

        {/* Dashboard */}
        <button
          onClick={() => navigate("/admin/dashboard")}
          className={`mb-2 flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-bold transition ${
            isActive("/admin/dashboard")
              ? "bg-blue-50 text-blue-600"
              : "text-slate-600 hover:bg-slate-50 hover:text-blue-600"
          }`}
        >
          <span>📊</span>
          Dashboard
        </button>

        {/* User Management */}
        <p className="mb-3 mt-7 px-3 text-[10px] font-black uppercase tracking-wider text-slate-400">
          User Management
        </p>

        {/* Manage Users */}
        <button
          onClick={() =>
            navigate("/admin/dashboard/users/manage")
          }
          className={`mb-1 flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold transition ${
            isActive("/admin/dashboard/users/manage")
              ? "bg-blue-50 text-blue-600"
              : "text-slate-600 hover:bg-slate-50 hover:text-blue-600"
          }`}
        >
          <span>👥</span>
          Manage Users
        </button>

        {/* Management */}
        <p className="mb-3 mt-7 px-3 text-[10px] font-black uppercase tracking-wider text-slate-400">
          Management
        </p>

        {/* Properties */}
        <button
          onClick={() =>
            navigate("/admin/dashboard/properties")
          }
          className={`mb-1 flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold transition ${
            isActive("/admin/dashboard/properties")
              ? "bg-blue-50 text-blue-600"
              : "text-slate-600 hover:bg-slate-50 hover:text-blue-600"
          }`}
        >
          <span>🏢</span>
          Properties
        </button>

        {/* Requests */}
        <button
          onClick={() =>
            navigate("/admin/dashboard/requests")
          }
          className={`mb-1 flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold transition ${
            isActive("/admin/dashboard/requests")
              ? "bg-blue-50 text-blue-600"
              : "text-slate-600 hover:bg-slate-50 hover:text-blue-600"
          }`}
        >
          <span>📋</span>
          Requests
        </button>

        {/* System */}
        <p className="mb-3 mt-7 px-3 text-[10px] font-black uppercase tracking-wider text-slate-400">
          System
        </p>

        {/* Settings */}
        <button
          onClick={() =>
            navigate("/admin/dashboard/settings")
          }
          className={`mb-1 flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold transition ${
            isActive("/admin/dashboard/settings")
              ? "bg-blue-50 text-blue-600"
              : "text-slate-600 hover:bg-slate-50 hover:text-blue-600"
          }`}
        >
          <span>⚙️</span>
          Settings
        </button>
      </nav>

      {/* Footer */}
      <div className="border-t border-slate-200 p-3">
        <button
          onClick={() => navigate("/")}
          className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold text-slate-600 transition hover:bg-slate-50 hover:text-blue-600"
        >
          <span>🏠</span>
          Back to Website
        </button>
      </div>
    </aside>
  );
};

export default AdminSidebar;
