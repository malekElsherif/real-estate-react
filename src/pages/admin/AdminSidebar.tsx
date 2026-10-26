import { useLocation, useNavigate } from "react-router-dom";
import { usegetme } from "../../hooks/useUsers";

const sections = [
  {
    title: "Overview",
    items: [{ label: "Dashboard", path: "/admin/dashboard", exact: true }],
  },
  {
    title: "People",
    items: [{ label: "Users", path: "/admin/dashboard/users/manage" }],
  },
  {
    title: "Operations",
    items: [
      { label: "Properties", path: "/admin/dashboard/properties" },
      { label: "Requests", path: "/admin/dashboard/requests" },
    ],
  },
  {
    title: "System",
    items: [{ label: "Settings", path: "/admin/dashboard/settings" }],
  },
];

const AdminSidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { data: meData } = usegetme();

  const me = meData?.data ?? meData;
  const adminName: string = me?.name || "Administrator";

  const isActive = (path: string, exact?: boolean) =>
    exact
      ? location.pathname === path
      : location.pathname === path || location.pathname.startsWith(`${path}/`);

  const isUsersArea = location.pathname.startsWith("/admin/dashboard/users");

  let counter = 0;

  return (
    <aside className="flex h-full w-full flex-col bg-stone-900 text-stone-300 font-sans border-r border-amber-600/30">
      {/* Brand */}
      <div className="flex items-center gap-3 border-b border-stone-800 p-6">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-amber-700 text-stone-900 font-bold text-lg">
          A
        </div>
        <div>
          <p className="text-base font-bold text-stone-50 leading-tight">Admin Console</p>
          <p className="mt-1 text-[10px] font-semibold uppercase tracking-widest text-amber-500">Estate · Control Room</p>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto p-4 space-y-6">
        {sections.map((section) => (
          <div key={section.title}>
            <p className="px-3 text-[10px] font-semibold uppercase tracking-widest text-amber-500 mb-2">
              {section.title}
            </p>

            <div className="space-y-1">
              {section.items.map((item) => {
                counter += 1;
                const active =
                  item.path === "/admin/dashboard/users/manage"
                    ? isUsersArea
                    : isActive(item.path, (item as any).exact);

                return (
                  <button
                    key={item.path}
                    type="button"
                    onClick={() => navigate(item.path)}
                    className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-xs font-semibold uppercase tracking-wider transition-all text-left ${
                      active
                        ? "bg-amber-600/20 text-amber-400 border-l-4 border-amber-500"
                        : "text-stone-400 hover:bg-stone-800/60 hover:text-stone-100 border-l-4 border-transparent"
                    }`}
                  >
                    <span className={`w-5 text-[10px] font-mono ${active ? "text-amber-500" : "text-stone-500"}`}>
                      {String(counter).padStart(2, "0")}
                    </span>
                    {item.label}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      {/* Footer */}
      <div className="border-t border-stone-800 p-4 space-y-3">
        <div className="flex items-center gap-3 rounded-xl bg-stone-800/50 p-3 border border-stone-800">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-amber-600/50 text-amber-500 font-bold text-sm">
            {adminName.trim().charAt(0).toUpperCase()}
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-xs font-bold text-stone-100 truncate">{adminName}</p>
            <p className="text-[9px] uppercase tracking-widest text-amber-500 font-semibold">Administrator</p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => navigate("/")}
          className="w-full rounded-xl border border-stone-700 bg-transparent px-4 py-2.5 text-[10px] font-semibold uppercase tracking-widest text-stone-300 transition hover:border-amber-500 hover:text-amber-400 text-center"
        >
          ← Back to website
        </button>
      </div>
    </aside>
  );
};

export default AdminSidebar;
