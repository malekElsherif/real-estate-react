import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  usegetallusers,
  usegetpendingagent,
} from "../../hooks/useadmin";
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

  const {
    data: usersResponse,
    isLoading: usersLoading,
    isError: usersError,
    refetch: refetchUsers,
  } = usegetallusers();

  const {
    data: propertiesResponse,
    isLoading: propertiesLoading,
    isError: propertiesError,
    refetch: refetchProps,
  } = usegetallprop();

  const {
    data: pendingAgentsResponse,
    isLoading: pendingAgentsLoading,
  } = usegetpendingagent();

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

    const availableProperties = properties.filter(
      (p) => p.status?.toUpperCase() === "AVAILABLE"
    ).length;

    const closedProperties = properties.filter((p) =>
      ["RENTED", "SOLD"].includes(p.status?.toUpperCase() || "")
    ).length;

    return {
      users,
      pendingAgents,
      totalUsers,
      activeUsers,
      inactiveUsers: totalUsers - activeUsers,
      activeRate: totalUsers
        ? Math.round((activeUsers / totalUsers) * 100)
        : 0,

      customers,
      agents,
      admins,

      customersPct: totalUsers
        ? Math.round((customers / totalUsers) * 100)
        : 0,

      agentsPct: totalUsers
        ? Math.round((agents / totalUsers) * 100)
        : 0,

      adminsPct: totalUsers
        ? Math.round((admins / totalUsers) * 100)
        : 0,

      totalProperties,
      availableProperties,
      closedProperties,

      recentUsers: [...users].slice(-5).reverse(),
    };
  }, [
    usersResponse,
    propertiesResponse,
    pendingAgentsResponse,
  ]);

  if (
    usersLoading ||
    propertiesLoading ||
    pendingAgentsLoading
  ) {
    return (
      <div className="flex min-h-[600px] items-center justify-center">
        <div className="text-center">
          <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-slate-200 border-t-blue-600" />
          <p className="mt-4 text-sm font-semibold text-slate-700">
            Loading dashboard...
          </p>
        </div>
      </div>
    );
  }

  if (usersError || propertiesError) {
    return (
      <div className="flex min-h-[500px] items-center justify-center p-6">
        <div className="w-full max-w-md rounded-2xl bg-white p-8 text-center shadow-lg">
          <div className="text-4xl">⚠️</div>

          <h2 className="mt-4 text-lg font-bold text-slate-900">
            Failed to load dashboard
          </h2>

          <p className="mt-2 text-sm text-slate-500">
            Please check your connection and try again.
          </p>

          <button
            onClick={() => {
              refetchUsers();
              refetchProps();
            }}
            className="mt-6 w-full rounded-xl bg-slate-900 py-3 text-sm font-semibold text-white hover:bg-slate-800"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  const adminName = meData?.data?.name;

  return (
    <div className="min-h-screen bg-slate-50 pb-12">
      <header className="border-b bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-6 sm:px-6 lg:px-8">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">
              Dashboard Overview
            </h1>

            <p className="mt-1 text-sm text-slate-500">
              Welcome back{adminName ? `, ${adminName}` : ""}
            </p>
          </div>

          <div className="flex gap-2">
            <button
              onClick={() =>
                navigate("/admin/dashboard/users/manage")
              }
              className="rounded-xl bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700"
            >
              Manage Users
            </button>

            <button
              onClick={() =>
                navigate("/admin/dashboard/agents/pending")
              }
              className="rounded-xl border bg-white px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
            >
              Pending Agents
              {metrics.pendingAgents.length > 0 && (
                <span className="ml-2 rounded-full bg-amber-500 px-2 py-0.5 text-xs text-white">
                  {metrics.pendingAgents.length}
                </span>
              )}
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 pt-8 sm:px-6 lg:px-8">

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">

          {[
            {
              title: "Total Accounts",
              value: metrics.totalUsers,
              info: `${metrics.customers} Customers · ${metrics.agents} Agents`,
              path: "/admin/dashboard/users/manage",
            },
            {
              title: "Active Users",
              value: metrics.activeUsers,
              info: `${metrics.activeRate}% active`,
              path: "/admin/dashboard/users/manage",
            },
            {
              title: "Pending Agents",
              value: metrics.pendingAgents.length,
              info:
                metrics.pendingAgents.length > 0
                  ? "Requires review"
                  : "All agents verified",
              path: "/admin/dashboard/agents/pending",
            },
            {
              title: "Properties",
              value: metrics.totalProperties,
              info: `${metrics.availableProperties} Available`,
              path: "/dashboard/properties",
            },
          ].map((card) => (
            <div
              key={card.title}
              onClick={() => navigate(card.path)}
              className="cursor-pointer rounded-2xl border bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
            >
              <p className="text-sm font-semibold text-slate-500">
                {card.title}
              </p>

              <p className="mt-3 text-3xl font-bold text-slate-900">
                {card.value}
              </p>

              <p className="mt-3 text-xs text-slate-500">
                {card.info}
              </p>
            </div>
          ))}

        </div>

        <div className="mt-8 grid gap-6 lg:grid-cols-2">

          <div className="rounded-2xl border bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="font-bold text-slate-900">
                  User Composition
                </h2>

                <p className="text-xs text-slate-400">
                  Account roles breakdown
                </p>
              </div>

              <span className="rounded-lg bg-slate-100 px-3 py-1 text-xs">
                {metrics.totalUsers} Total
              </span>
            </div>

            <div className="mt-6 space-y-5">

              {[
                {
                  name: "Customers",
                  count: metrics.customers,
                  percent: metrics.customersPct,
                },
                {
                  name: "Agents",
                  count: metrics.agents,
                  percent: metrics.agentsPct,
                },
                {
                  name: "Admins",
                  count: metrics.admins,
                  percent: metrics.adminsPct,
                },
              ].map((item) => (
                <div key={item.name}>
                  <div className="flex justify-between text-xs font-semibold">
                    <span>{item.name}</span>
                    <span>
                      {item.count} ({item.percent}%)
                    </span>
                  </div>

                  <div className="mt-2 h-2 overflow-hidden rounded-full bg-slate-100">
                    <div
                      className="h-full rounded-full bg-blue-500"
                      style={{ width: `${item.percent}%` }}
                    />
                  </div>
                </div>
              ))}

            </div>

            <div className="mt-6 grid grid-cols-2 gap-3">
              <div className="rounded-xl bg-emerald-50 p-4 text-center">
                <p className="text-xs text-slate-500">
                  Active
                </p>

                <p className="mt-1 text-xl font-bold text-emerald-600">
                  {metrics.activeUsers}
                </p>
              </div>

              <div className="rounded-xl bg-slate-50 p-4 text-center">
                <p className="text-xs text-slate-500">
                  Inactive
                </p>

                <p className="mt-1 text-xl font-bold text-slate-600">
                  {metrics.inactiveUsers}
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="font-bold text-slate-900">
                  Property Portfolio
                </h2>

                <p className="text-xs text-slate-400">
                  Inventory status
                </p>
              </div>

              <span className="rounded-lg bg-purple-50 px-3 py-1 text-xs font-semibold text-purple-700">
                {metrics.totalProperties} Listings
              </span>
            </div>

            <div className="mt-6 grid grid-cols-3 gap-3">

              <div className="rounded-xl bg-slate-50 p-4 text-center">
                <p className="text-xs text-slate-400">
                  Total
                </p>

                <p className="mt-1 text-xl font-bold">
                  {metrics.totalProperties}
                </p>
              </div>

              <div className="rounded-xl bg-emerald-50 p-4 text-center">
                <p className="text-xs text-emerald-600">
                  Available
                </p>

                <p className="mt-1 text-xl font-bold text-emerald-600">
                  {metrics.availableProperties}
                </p>
              </div>

              <div className="rounded-xl bg-blue-50 p-4 text-center">
                <p className="text-xs text-blue-600">
                  Closed
                </p>

                <p className="mt-1 text-xl font-bold text-blue-600">
                  {metrics.closedProperties}
                </p>
              </div>

            </div>

            <button
              onClick={() =>
                navigate("/dashboard/properties")
              }
              className="mt-6 w-full rounded-xl bg-slate-900 py-3 text-sm font-semibold text-white hover:bg-slate-800"
            >
              View Properties →
            </button>
          </div>

        </div>

        <div className="mt-8 grid gap-6 lg:grid-cols-3">

          <div className="rounded-2xl border bg-white shadow-sm lg:col-span-2">

            <div className="flex items-center justify-between border-b p-5">
              <div>
                <h2 className="font-bold text-slate-900">
                  Recent Registrations
                </h2>

                <p className="text-xs text-slate-400">
                  New users
                </p>
              </div>

              <button
                onClick={() =>
                  navigate("/admin/dashboard/users/manage")
                }
                className="text-xs font-semibold text-blue-600"
              >
                View All →
              </button>
            </div>

            {metrics.recentUsers.length === 0 ? (
              <p className="p-8 text-center text-sm text-slate-400">
                No users found.
              </p>
            ) : (
              <div className="divide-y">
                {metrics.recentUsers.map((user) => (
                  <div
                    key={user.id}
                    className="flex items-center justify-between p-4 hover:bg-slate-50"
                  >
                    <div>
                      <p className="text-sm font-semibold text-slate-900">
                        {user.name || "Unknown User"}
                      </p>

                      <p className="text-xs text-slate-400">
                        {user.email}
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="rounded-md bg-slate-100 px-2 py-1 text-xs">
                        {user.role}
                      </span>

                      <button
                        onClick={() =>
                          setActivityUserId(user.id)
                        }
                        className="rounded-lg border px-3 py-1 text-xs font-semibold hover:bg-slate-50"
                      >
                        Activity
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

          </div>

          <div className="space-y-4">

            {metrics.pendingAgents.length > 0 && (
              <div className="rounded-2xl border border-amber-200 bg-amber-50 p-5">
                <h3 className="font-bold text-slate-900">
                  Pending Approvals
                </h3>

                <p className="mt-1 text-xs text-amber-700">
                  {metrics.pendingAgents.length} agents waiting
                </p>

                <button
                  onClick={() =>
                    navigate("/admin/dashboard/agents/pending")
                  }
                  className="mt-4 w-full rounded-xl bg-amber-600 py-2 text-sm font-semibold text-white hover:bg-amber-700"
                >
                  Review Approvals →
                </button>
              </div>
            )}

            <div className="rounded-2xl border bg-white p-5 shadow-sm">
              <h3 className="font-bold text-slate-900">
                Quick Shortcuts
              </h3>

              <div className="mt-3 space-y-2">

                <button
                  onClick={() =>
                    navigate("/admin/dashboard/users/manage")
                  }
                  className="w-full rounded-xl bg-slate-50 p-3 text-left text-sm hover:bg-slate-100"
                >
                  👥 Manage Users →
                </button>

                <button
                  onClick={() =>
                    navigate("/admin/dashboard/agents/pending")
                  }
                  className="flex w-full justify-between rounded-xl bg-slate-50 p-3 text-sm hover:bg-slate-100"
                >
                  <span>⏳ Agent Requests</span>
                  <span>{metrics.pendingAgents.length}</span>
                </button>

                <button
                  onClick={() =>
                    navigate("/dashboard/properties")
                  }
                  className="w-full rounded-xl bg-slate-50 p-3 text-left text-sm hover:bg-slate-100"
                >
                  🏢 Property Inventory →
                </button>

              </div>
            </div>

          </div>

        </div>

      </main>

      {activityUserId !== null && (
        <Useractivityreport
          id={activityUserId}
          open
          onClose={() => setActivityUserId(null)}
        />
      )}
    </div>
  );
};

export default MainAdminDash;
