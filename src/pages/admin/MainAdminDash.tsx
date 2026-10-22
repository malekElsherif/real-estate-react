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

/**
 * Brand tokens
 * navy  #14213D  -> primary / dark base
 * cream #FFFDF9  -> background
 * gold  #B8863B  -> accent / CTA
 */
const BrandStyles = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,400;9..144,600;9..144,700&family=IBM+Plex+Mono:wght@400;500;600&display=swap');

    .brand-root { font-family: 'IBM Plex Mono', ui-monospace, monospace; }
    .font-heading { font-family: 'Fraunces', Georgia, serif; letter-spacing: -0.01em; }
    .font-data { font-family: 'IBM Plex Mono', ui-monospace, monospace; }
    .eyebrow {
      font-family: 'IBM Plex Mono', ui-monospace, monospace;
      font-size: 0.65rem;
      letter-spacing: 0.16em;
      text-transform: uppercase;
    }
  `}</style>
);

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

  if (usersLoading || propertiesLoading || pendingAgentsLoading) {
    return (
      <div className="brand-root flex min-h-[600px] items-center justify-center bg-[#FFFDF9]">
        <BrandStyles />
        <div className="text-center">
          <div className="mx-auto h-10 w-10 animate-spin rounded-full border-2 border-[#14213D]/15 border-t-[#B8863B]" />
          <p className="eyebrow mt-5 text-[#14213D]/70">
            Loading dashboard
          </p>
        </div>
      </div>
    );
  }

  if (usersError || propertiesError) {
    return (
      <div className="brand-root flex min-h-[500px] items-center justify-center bg-[#FFFDF9] p-6">
        <BrandStyles />
        <div className="w-full max-w-md border border-[#14213D]/15 bg-white p-8 text-center">
          <div className="mx-auto h-px w-10 bg-[#B8863B]" />

          <h2 className="font-heading mt-5 text-2xl font-semibold text-[#14213D]">
            Failed to load dashboard
          </h2>

          <p className="mt-2 text-xs leading-relaxed text-[#14213D]/60">
            Please check your connection and try again.
          </p>

          <button
            onClick={() => {
              refetchUsers();
              refetchProps();
            }}
            className="eyebrow mt-6 w-full bg-[#B8863B] py-3 font-semibold text-white transition hover:bg-[#a37632]"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  const adminName = meData?.data?.name;

  const statCards = [
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
  ];

  return (
    <div className="brand-root min-h-screen bg-[#FFFDF9] pb-16 text-[#14213D]">
      <BrandStyles />

      {/* Header */}
      <header className="bg-[#14213D]">
        <div className="mx-auto flex max-w-7xl flex-col gap-5 px-4 py-8 sm:px-6 md:flex-row md:items-end md:justify-between lg:px-8">
          <div>
            <p className="eyebrow text-[#B8863B]">Admin Console</p>

            <h1 className="font-heading mt-2 text-3xl font-semibold text-[#FFFDF9] sm:text-4xl">
              Dashboard Overview
            </h1>

            <p className="mt-2 text-xs text-[#FFFDF9]/60">
              Welcome back{adminName ? `, ${adminName}` : ""}
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => navigate("/admin/dashboard/users/manage")}
              className="eyebrow bg-[#B8863B] px-5 py-3 font-semibold text-white transition hover:bg-[#a37632]"
            >
              Manage Users
            </button>

            <button
              onClick={() => navigate("/admin/dashboard/agents/pending")}
              className="eyebrow border border-[#FFFDF9]/30 px-5 py-3 font-semibold text-[#FFFDF9] transition hover:border-[#B8863B] hover:text-[#B8863B]"
            >
              Pending Agents
              {metrics.pendingAgents.length > 0 && (
                <span className="ml-2 bg-[#B8863B] px-1.5 py-0.5 text-[0.65rem] text-white">
                  {metrics.pendingAgents.length}
                </span>
              )}
            </button>
          </div>
        </div>

        <div className="h-px bg-gradient-to-r from-transparent via-[#B8863B] to-transparent" />
      </header>

      <main className="mx-auto max-w-7xl px-4 pt-10 sm:px-6 lg:px-8">
        {/* Stat cards */}
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {statCards.map((card) => (
            <div
              key={card.title}
              onClick={() => navigate(card.path)}
              className="group cursor-pointer border border-[#14213D]/10 bg-white p-6 transition hover:-translate-y-1 hover:border-[#B8863B] hover:shadow-[0_12px_30px_-12px_rgba(20,33,61,0.25)]"
            >
              <p className="eyebrow text-[#14213D]/55">{card.title}</p>

              <p className="font-heading mt-4 text-5xl font-semibold text-[#14213D]">
                {card.value}
              </p>

              <div className="mt-5 h-px w-8 bg-[#B8863B] transition-all group-hover:w-16" />

              <p className="mt-3 text-xs text-[#14213D]/60">{card.info}</p>
            </div>
          ))}
        </div>

        {/* Composition + Portfolio */}
        <div className="mt-10 grid gap-6 lg:grid-cols-2">
          {/* User composition */}
          <section className="border border-[#14213D]/10 bg-white p-7">
            <div className="flex items-start justify-between">
              <div>
                <h2 className="font-heading text-2xl font-semibold">
                  User Composition
                </h2>
                <p className="eyebrow mt-1 text-[#14213D]/45">
                  Account roles breakdown
                </p>
              </div>

              <span className="eyebrow border border-[#B8863B]/50 px-3 py-1 text-[#B8863B]">
                {metrics.totalUsers} Total
              </span>
            </div>

            <div className="mt-8 space-y-6">
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
                  <div className="flex justify-between text-xs font-medium">
                    <span>{item.name}</span>
                    <span className="text-[#14213D]/60">
                      {item.count} ({item.percent}%)
                    </span>
                  </div>

                  <div className="mt-2 h-1.5 overflow-hidden bg-[#14213D]/10">
                    <div
                      className="h-full bg-[#B8863B]"
                      style={{ width: `${item.percent}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-8 grid grid-cols-2 gap-3">
              <div className="bg-[#14213D] p-4 text-center">
                <p className="eyebrow text-[#FFFDF9]/60">Active</p>
                <p className="font-heading mt-2 text-3xl font-semibold text-[#B8863B]">
                  {metrics.activeUsers}
                </p>
              </div>

              <div className="border border-[#14213D]/15 bg-[#FFFDF9] p-4 text-center">
                <p className="eyebrow text-[#14213D]/55">Inactive</p>
                <p className="font-heading mt-2 text-3xl font-semibold text-[#14213D]">
                  {metrics.inactiveUsers}
                </p>
              </div>
            </div>
          </section>

          {/* Property portfolio */}
          <section className="flex flex-col border border-[#14213D]/10 bg-white p-7">
            <div className="flex items-start justify-between">
              <div>
                <h2 className="font-heading text-2xl font-semibold">
                  Property Portfolio
                </h2>
                <p className="eyebrow mt-1 text-[#14213D]/45">
                  Inventory status
                </p>
              </div>

              <span className="eyebrow border border-[#B8863B]/50 px-3 py-1 text-[#B8863B]">
                {metrics.totalProperties} Listings
              </span>
            </div>

            <div className="mt-8 grid grid-cols-3 gap-3">
              <div className="border border-[#14213D]/15 bg-[#FFFDF9] p-4 text-center">
                <p className="eyebrow text-[#14213D]/55">Total</p>
                <p className="font-heading mt-2 text-3xl font-semibold">
                  {metrics.totalProperties}
                </p>
              </div>

              <div className="border border-[#B8863B]/40 bg-[#B8863B]/10 p-4 text-center">
                <p className="eyebrow text-[#B8863B]">Available</p>
                <p className="font-heading mt-2 text-3xl font-semibold text-[#B8863B]">
                  {metrics.availableProperties}
                </p>
              </div>

              <div className="bg-[#14213D] p-4 text-center">
                <p className="eyebrow text-[#FFFDF9]/60">Closed</p>
                <p className="font-heading mt-2 text-3xl font-semibold text-[#FFFDF9]">
                  {metrics.closedProperties}
                </p>
              </div>
            </div>

            <button
              onClick={() => navigate("/dashboard/properties")}
              className="eyebrow mt-auto w-full bg-[#14213D] py-4 font-semibold text-[#FFFDF9] transition hover:bg-[#B8863B]"
            >
              View Properties →
            </button>
          </section>
        </div>

        {/* Recent + side column */}
        <div className="mt-10 grid gap-6 lg:grid-cols-3">
          <section className="border border-[#14213D]/10 bg-white lg:col-span-2">
            <div className="flex items-center justify-between border-b border-[#14213D]/10 p-6">
              <div>
                <h2 className="font-heading text-2xl font-semibold">
                  Recent Registrations
                </h2>
                <p className="eyebrow mt-1 text-[#14213D]/45">New users</p>
              </div>

              <button
                onClick={() => navigate("/admin/dashboard/users/manage")}
                className="eyebrow font-semibold text-[#B8863B] transition hover:text-[#14213D]"
              >
                View All →
              </button>
            </div>

            {metrics.recentUsers.length === 0 ? (
              <p className="p-10 text-center text-xs text-[#14213D]/45">
                No users found.
              </p>
            ) : (
              <div className="divide-y divide-[#14213D]/10">
                {metrics.recentUsers.map((user) => (
                  <div
                    key={user.id}
                    className="flex items-center justify-between gap-3 p-5 transition hover:bg-[#FFFDF9]"
                  >
                    <div className="min-w-0">
                      <p className="truncate text-sm font-semibold">
                        {user.name || "Unknown User"}
                      </p>
                      <p className="truncate text-xs text-[#14213D]/50">
                        {user.email}
                      </p>
                    </div>

                    <div className="flex shrink-0 items-center gap-3">
                      <span className="eyebrow bg-[#14213D]/5 px-2 py-1 text-[#14213D]">
                        {user.role}
                      </span>

                      <button
                        onClick={() => setActivityUserId(user.id)}
                        className="eyebrow border border-[#B8863B] px-3 py-1.5 font-semibold text-[#B8863B] transition hover:bg-[#B8863B] hover:text-white"
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
              <div className="border border-[#B8863B]/50 bg-[#B8863B]/10 p-6">
                <p className="eyebrow text-[#B8863B]">Action needed</p>

                <h3 className="font-heading mt-2 text-2xl font-semibold">
                  Pending Approvals
                </h3>

                <p className="mt-1 text-xs text-[#14213D]/65">
                  {metrics.pendingAgents.length} agents waiting
                </p>

                <button
                  onClick={() => navigate("/admin/dashboard/agents/pending")}
                  className="eyebrow mt-5 w-full bg-[#B8863B] py-3 font-semibold text-white transition hover:bg-[#a37632]"
                >
                  Review Approvals →
                </button>
              </div>
            )}

            <div className="border border-[#14213D]/10 bg-white p-6">
              <h3 className="font-heading text-2xl font-semibold">
                Quick Shortcuts
              </h3>

              <div className="mt-4 space-y-2">
                <button
                  onClick={() => navigate("/admin/dashboard/users/manage")}
                  className="w-full border border-[#14213D]/10 p-3 text-left text-xs transition hover:border-[#B8863B] hover:bg-[#FFFDF9]"
                >
                  Manage Users →
                </button>

                <button
                  onClick={() => navigate("/admin/dashboard/agents/pending")}
                  className="flex w-full justify-between border border-[#14213D]/10 p-3 text-xs transition hover:border-[#B8863B] hover:bg-[#FFFDF9]"
                >
                  <span>Agent Requests</span>
                  <span className="font-semibold text-[#B8863B]">
                    {metrics.pendingAgents.length}
                  </span>
                </button>

                <button
                  onClick={() => navigate("/dashboard/properties")}
                  className="w-full border border-[#14213D]/10 p-3 text-left text-xs transition hover:border-[#B8863B] hover:bg-[#FFFDF9]"
                >
                  Property Inventory →
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
