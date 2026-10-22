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

  // Users page also owns the user detail route: /admin/dashboard/users/:id
  const isUsersArea = location.pathname.startsWith("/admin/dashboard/users");

  let counter = 0;

  return (
    <aside className="adm-side">
      {/* Brand */}
      <div className="adm-side-brand">
        <div className="adm-side-mark">A</div>

        <div>
          <p className="adm-side-title">Admin Console</p>
          <p className="adm-side-sub">Estate · Control Room</p>
        </div>
      </div>

      {/* Navigation */}
      <nav className="adm-side-nav">
        {sections.map((section) => (
          <div key={section.title}>
            <p className="adm-side-group">{section.title}</p>

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
                  className={`adm-link ${active ? "adm-link-active" : ""}`}
                >
                  <span className="adm-link-no">
                    {String(counter).padStart(2, "0")}
                  </span>
                  {item.label}
                </button>
              );
            })}
          </div>
        ))}
      </nav>

      {/* Footer */}
      <div className="adm-side-foot">
        <div className="adm-chip">
          <div className="adm-chip-avatar">
            {adminName.trim().charAt(0).toUpperCase()}
          </div>

          <div style={{ minWidth: 0 }}>
            <p className="adm-chip-name">{adminName}</p>
            <p className="adm-chip-role">Administrator</p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => navigate("/")}
          className="adm-back"
        >
          ← Back to website
        </button>
      </div>
    </aside>
  );
};

export default AdminSidebar;
