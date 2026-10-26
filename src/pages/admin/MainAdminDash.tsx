import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { usegetallusers, usegetpendingagent } from "../../hooks/useadmin";
import { usegetallprop } from "../../hooks/useProp";
import { usegetme } from "../../hooks/useUsers";
import Useractivityreport from "./Useractivityreport";

interface User {
  id: number;
  name?: string;
  email?: string;
  role?: string;
  isActive?: boolean;
}

interface Property {
  id: number;
  status?: string;
}

export const MainAdminDash = () => {
  const navigate = useNavigate();
  const [activityUserId, setActivityUserId] = useState<number | null>(null);

  const { data: meData } = usegetme();
  const { data: usersResponse, isLoading: usersErrorLoading, isError: usersError, refetch: refetchUsers } = usegetallusers();
  const { data: propertiesResponse, isLoading: propertiesLoading, isError: propertiesError, refetch: refetchProps } = usegetallprop();
  const { data: pendingAgentsResponse, isLoading: pendingAgentsLoading } = usegetpendingagent();

  const metrics = useMemo(() => {
    const users: User[] = usersResponse?.data ?? [];
    const properties: Property[] = propertiesResponse?.data ?? [];
    const pendingAgents: User[] = pendingAgentsResponse?.data ?? [];

    const totalUsers = users.length;
    const activeUsers = users.filter((u) => u.isActive).length;

    const customers = users.filter((u) => u.role === "USER").length;
    const agents = users.filter((u) => u.role === "AGENT").length;
    const admins = users.filter((u) => u.role === "ADMIN").length;

    const totalProperties = properties.length;
    const availableProperties = properties.filter((p) => p.status?.toUpperCase() === "AVAILABLE").length;
    const closedProperties = properties.filter((p) => ["RENTED", "SOLD"].includes(p.status?.toUpperCase() || "")).length;

    return {
      users,
      pendingAgents,
      totalUsers,
      activeUsers,
      inactiveUsers: totalUsers - activeUsers,
      activeRate: totalUsers ? Math.round((activeUsers / totalUsers) * 100) : 0,
      customers,
      agents,
      admins,
      customersPct: totalUsers ? Math.round((customers / totalUsers) * 100) : 0,
      agentsPct: totalUsers ? Math.round((agents / totalUsers) * 100) : 0,
      adminsPct: totalUsers ? Math.round((admins / totalUsers) * 100) : 0,
      totalProperties,
      availableProperties,
      closedProperties,
      recentUsers: [...users].slice(-5).reverse(),
    };
  }, [usersResponse, propertiesResponse, pendingAgentsResponse]);

  if (usersErrorLoading || propertiesLoading || pendingAgentsLoading) {
    return (
      <div className="flex min-h-[600px] items-center justify-center bg-stone-50">
        <div className="text-center">
          <div className="mx-auto h-8 w-8 animate-spin rounded-full border-2 border-stone-300 border-t-amber-800" />
          <p className="mt-4 text-xs uppercase tracking-widest text-stone-500 font-medium">Loading dashboard</p>
        </div>
      </div>
    );
  }

  if (usersError || propertiesError) {
    return (
      <div className="flex min-h-[500px] items-center justify-center bg-stone-50 p-6">
        <div className="w-full max-w-md rounded-2xl border border-stone-200 bg-white p-8 text-center shadow-sm">
          <h2 className="text-xl font-bold text-stone-900">Failed to load dashboard</h2>
          <p className="mt-2 text-xs text-stone-500">Please check your connection and try again.</p>
          <button
            onClick={() => { refetchUsers(); refetchProps(); }}
            className="mt-6 w-full rounded-xl bg-amber-800 py-2.5 text-xs font-semibold text-white hover:bg-amber-900 transition"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  const adminName = meData?.data?.name;

  const statCards = [
    { title: "Total Accounts", value: metrics.totalUsers, info: `${metrics.customers} Customers · ${metrics.agents} Agents`, path: "/admin/dashboard/users/manage" },
    { title: "Active Users", value: metrics.activeUsers, info: `${metrics.activeRate}% active`, path: "/admin/dashboard/users/manage" },
    { title: "Pending Agents", value: metrics.pendingAgents.length, info: metrics.pendingAgents.length > 0 ? "Requires review" : "All agents verified", path: "/admin/dashboard/agents/pending" },
    { title: "Properties", value: metrics.totalProperties, info: `${metrics.availableProperties} Available`, path: "/dashboard/properties" },
  ];

  return (
    <div className="min-h-screen bg-stone-50 pb-16 text-stone-900">
      <header className="bg-stone-900 text-stone-50">
        <div className="mx-auto flex max-w-7xl flex-col gap-5 px-4 py-8 sm:px-6 md:flex-row md:items-end md:justify-between lg:px-8">
          <div>
            <p className="text-xs uppercase tracking-widest text-amber-600 font-medium">Admin Console</p>
            <h1 className="mt-2 text-3xl font-bold sm:text-4xl">Dashboard Overview</h1>
            <p className="mt-2 text-xs text-stone-400">Welcome back{adminName ? `, ${adminName}` : ""}</p>
          </div>

          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => navigate("/admin/dashboard/users/manage")}
              className="rounded-xl bg-amber-800 px-5 py-2.5 text-xs font-semibold text-white hover:bg-amber-900 transition"
            >
              Manage Users
            </button>
            <button
              onClick={() => navigate("/admin/dashboard/agents/pending")}
              className="inline-flex items-center gap-2 rounded-xl border border-stone-700 px-5 py-2.5 text-xs font-semibold text-stone-50 hover:border-amber-600 hover:text-amber-500 transition"
            >
              Pending Agents
              {metrics.pendingAgents.length > 0 && (
                <span className="rounded-md bg-amber-600 px-1.5 py-0.5 text-[10px] text-white">
                  {metrics.pendingAgents.length}
                </span>
              )}
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 pt-10 sm:px-6 lg:px-8">
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {statCards.map((card) => (
            <div
              key={card.title}
              onClick={() => navigate(card.path)}
              className="group cursor-pointer rounded-2xl border border-stone-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:border-amber-600 hover:shadow-md"
            >
              <p className="text-[10px] uppercase tracking-wider text-stone-500 font-semibold">{card.title}</p>
              <p className="mt-4 text-4xl font-bold text-stone-900">{card.value}</p>
              <div className="mt-5 h-0.5 w-8 bg-amber-600 transition-all group-hover:w-16" />
              <p className="mt-3 text-xs text-stone-500">{card.info}</p>
            </div>
          ))}
        </div>

        <div className="mt-10 grid gap-6 lg:grid-cols-2">
          <section className="rounded-2xl border border-stone-200 bg-white p-7 shadow-sm">
            <div className="flex items-start justify-between">
              <div>
                <h2 className="text-xl font-bold text-stone-900">User Composition</h2>
                <p className="mt-1 text-[10px] uppercase tracking-wider text-stone-500">Account roles breakdown</p>
              </div>
              <span className="rounded-lg border border-amber-500/40 bg-amber-50 px-3 py-1 text-[10px] font-semibold uppercase tracking-wider text-amber-700">
                {metrics.totalUsers} Total
              </span>
            </div>

            <div className="mt-8 space-y-6">
              {[
                { name: "Customers", count: metrics.customers, percent: metrics.customersPct },
                { name: "Agents", count: metrics.agents, percent: metrics.agentsPct },
                { name: "Admins", count: metrics.admins, percent: metrics.adminsPct },
              ].map((item) => (
                <div key={item.name}>
                  <div className="flex justify-between text-xs font-semibold">
                    <span>{item.name}</span>
                    <span className="text-stone-500">{item.count} ({item.percent}%)</span>
                  </div>
                  <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-stone-100">
                    <div className="h-full rounded-full bg-amber-600" style={{ width: `${item.percent}%` }} />
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-8 grid grid-cols-2 gap-3">
              <div className="rounded-xl bg-stone-900 p-4 text-center text-stone-50">
                <p className="text-[10px] uppercase tracking-wider text-stone-400">Active</p>
                <p className="mt-2 text-2xl font-bold text-amber-500">{metrics.activeUsers}</p>
              </div>
              <div className="rounded-xl border border-stone-200 bg-stone-50 p-4 text-center text-stone-900">
                <p className="text-[10px] uppercase tracking-wider text-stone-500">Inactive</p>
                <p className="mt-2 text-2xl font-bold">{metrics.inactiveUsers}</p>
              </div>
            </div>
          </section>

          <section className="flex flex-col rounded-2xl border border-stone-200 bg-white p-7 shadow-sm">
            <div className="flex items-start justify-between">
              <div>
                <h2 className="text-xl font-bold text-stone-900">Property Portfolio</h2>
                <p className="mt-1 text-[10px] uppercase tracking-wider text-stone-500">Inventory status</p>
              </div>
              <span className="rounded-lg border border-amber-500/40 bg-amber-50 px-3 py-1 text-[10px] font-semibold uppercase tracking-wider text-amber-700">
                {metrics.totalProperties} Listings
              </span>
            </div>

            <div className="mt-8 grid grid-cols-3 gap-3">
              <div className="rounded-xl border border-stone-200 bg-stone-50 p-4 text-center">
                <p className="text-[10px] uppercase tracking-wider text-stone-500">Total</p>
                <p className="mt-2 text-2xl font-bold text-stone-900">{metrics.totalProperties}</p>
              </div>
              <div className="rounded-xl border border-amber-500/40 bg-amber-50 p-4 text-center">
                <p className="text-[10px] uppercase tracking-wider text-amber-700 font-semibold">Available</p>
                <p className="mt-2 text-2xl font-bold text-amber-800">{metrics.availableProperties}</p>
              </div>
              <div className="rounded-xl bg-stone-900 p-4 text-center text-stone-50">
                <p className="text-[10px] uppercase tracking-wider text-stone-400">Closed</p>
                <p className="mt-2 text-2xl font-bold">{metrics.closedProperties}</p>
              </div>
            </div>

            <button
              onClick={() => navigate("/dashboard/properties")}
              className="mt-auto rounded-xl bg-stone-900 py-3.5 text-xs font-semibold uppercase tracking-wider text-stone-50 hover:bg-amber-800 transition text-center"
            >
              View Properties →
            </button>
          </section>
        </div>

        <div className="mt-10 grid gap-6 lg:grid-cols-3">
          <section className="rounded-2xl border border-stone-200 bg-white shadow-sm lg:col-span-2 overflow-hidden">
            <div className="flex items-center justify-between border-b border-stone-200 p-6">
              <div>
                <h2 className="text-xl font-bold text-stone-900">Recent Registrations</h2>
                <p className="mt-1 text-[10px] uppercase tracking-wider text-stone-500">New users</p>
              </div>
              <button
                onClick={() => navigate("/admin/dashboard/users/manage")}
                className="text-xs font-semibold text-amber-800 hover:text-stone-900 transition"
              >
                View All →
              </button>
            </div>

            {metrics.recentUsers.length === 0 ? (
              <p className="p-10 text-center text-xs text-stone-500">No users found.</p>
            ) : (
              <div className="divide-y divide-stone-100">
                {metrics.recentUsers.map((user) => (
                  <div key={user.id} className="flex items-center justify-between gap-3 p-5 transition hover:bg-stone-50">
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-stone-900 truncate">{user.name || "Unknown User"}</p>
                      <p className="text-xs text-stone-500 truncate">{user.email}</p>
                    </div>

                    <div className="flex shrink-0 items-center gap-3">
                      <span className="rounded-md bg-stone-100 px-2 py-1 text-[10px] font-semibold uppercase text-stone-700">
                        {user.role}
                      </span>
                      <button
                        onClick={() => setActivityUserId(user.id)}
                        className="rounded-xl border border-stone-300 px-3 py-1.5 text-[10px] font-semibold text-stone-900 hover:border-stone-900 transition"
                      >
                        Activity
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>

          <div className="space-y-5">
            {metrics.pendingAgents.length > 0 && (
              <div className="rounded-2xl border border-amber-500/40 bg-amber-50/50 p-6 shadow-sm">
                <p className="text-[10px] uppercase tracking-wider text-amber-700 font-semibold">Action needed</p>
                <h3 className="mt-2 text-xl font-bold text-stone-900">Pending Approvals</h3>
                <p className="mt-1 text-xs text-stone-600">{metrics.pendingAgents.length} agents waiting</p>
                <button
                  onClick={() => navigate("/admin/dashboard/agents/pending")}
                  className="mt-5 w-full rounded-xl bg-amber-800 py-3 text-xs font-semibold uppercase tracking-wider text-white hover:bg-amber-900 transition"
                >
                  Review Approvals →
                </button>
              </div>
            )}

            <div className="rounded-2xl border border-stone-200 bg-white p-6 shadow-sm">
              <h3 className="text-xl font-bold text-stone-900">Quick Shortcuts</h3>
              <div className="mt-4 space-y-2 text-xs">
                <button
                  onClick={() => navigate("/admin/dashboard/users/manage")}
                  className="w-full rounded-xl border border-stone-200 bg-stone-50 p-3 text-left font-semibold text-stone-900 transition hover:border-stone-900"
                >
                  Manage Users →
                </button>
                <button
                  onClick={() => navigate("/admin/dashboard/agents/pending")}
                  className="flex w-full items-center justify-between rounded-xl border border-stone-200 bg-stone-50 p-3 font-semibold text-stone-900 transition hover:border-stone-900"
                >
                  <span>Agent Requests</span>
                  <span className="rounded-md bg-amber-600 px-1.5 py-0.5 text-[10px] text-white">
                    {metrics.pendingAgents.length}
                  </span>
                </button>
                <button
                  onClick={() => navigate("/dashboard/properties")}
                  className="w-full rounded-xl border border-stone-200 bg-stone-50 p-3 text-left font-semibold text-stone-900 transition hover:border-stone-900"
                >
                  Property Inventory →
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>

      {activityUserId !== null && (
        <Useractivityreport id={activityUserId} open onClose={() => setActivityUserId(null)} />
      )}
    </div>
  );
};

export default MainAdminDash;
