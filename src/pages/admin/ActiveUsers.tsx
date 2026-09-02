import { useState } from "react";
import { usegetallusers } from "../../hooks/useadmin";
import ActiveDeactiveUser from "./ActiveDeactiveUser";
import Useractivityreport from "./Useractivityreport";

const ActiveUsers = () => {
  const { data, isLoading, isError, error, refetch, isFetching } =
    usegetallusers();

  const [selectedRole, setSelectedRole] = useState<string>("ALL");
  const [searchQuery, setSearchQuery] = useState<string>("" );
  const [activityUserId, setActivityUserId] = useState<number | null>(null);

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50">
        <div className="flex flex-col items-center gap-4">
          <div className="relative flex h-12 w-12 items-center justify-center">
            <div className="absolute h-full w-full animate-ping rounded-full bg-emerald-400 opacity-25" />
            <div className="h-10 w-10 animate-spin rounded-full border-4 border-slate-200 border-t-emerald-600" />
          </div>
          <p className="text-sm font-semibold text-slate-600">
            Loading active accounts...
          </p>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4">
        <div className="w-full max-w-md rounded-3xl border border-red-100 bg-white p-8 text-center shadow-lg shadow-red-500/5">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-red-50 text-2xl text-red-600">
            ⚠️
          </div>

          <h2 className="mt-5 text-xl font-black text-slate-900">
            Failed to load active users
          </h2>

          <p className="mt-2 text-sm leading-6 text-slate-500">
            {error instanceof Error
              ? error.message
              : "Something went wrong while loading active users."}
          </p>

          <button
            onClick={() => refetch()}
            className="mt-6 inline-flex items-center gap-2 rounded-xl bg-slate-900 px-5 py-2.5 text-xs font-bold text-white transition hover:bg-emerald-600 active:scale-95"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  const allUsers = data?.data ?? [];

  // Filter to all active users
  const allActiveUsers = allUsers.filter(
    (user: any) => user.isActive === true
  );

  const activeCustomers = allActiveUsers.filter(
    (user: any) => user.role === "USER"
  );
  const activeAgents = allActiveUsers.filter(
    (user: any) => user.role === "AGENT"
  );
  const activeAdmins = allActiveUsers.filter(
    (user: any) => user.role === "ADMIN"
  );

  // Filtered by role tab and search query
  const filteredUsers = allActiveUsers.filter((user: any) => {
    const matchesRole =
      selectedRole === "ALL" ? true : user.role === selectedRole;
    const matchesSearch =
      searchQuery.trim() === ""
        ? true
        : user.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          user.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          String(user.id).includes(searchQuery.trim());
    return matchesRole && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-slate-50/60 pb-16">
      {/* Header */}
      <header className="border-b border-slate-200/80 bg-white">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
            {/* Title & Badge */}
            <div>
              <div className="flex items-center gap-3">
                <h1 className="text-2xl font-black tracking-tight text-slate-900 sm:text-3xl">
                  Active Users
                </h1>
                <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-700 ring-1 ring-inset ring-emerald-600/20">
                  <span className="relative flex h-2 w-2">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                    <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
                  </span>
                  Live Monitor
                </span>
              </div>

              <p className="mt-2 text-sm text-slate-500">
                View, monitor, and inspect all currently enabled accounts
                across the platform.
              </p>
            </div>

            {/* Quick summary stats in Header */}
            <div className="flex flex-wrap items-center gap-3">
              <div className="flex items-center gap-3 rounded-2xl border border-slate-200/80 bg-slate-50/80 px-4 py-3 shadow-sm">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-100 text-emerald-700 font-bold text-sm">
                  🟢
                </div>
                <div>
                  <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                    Active Rate
                  </p>
                  <p className="text-base font-black text-slate-900">
                    {allUsers.length > 0
                      ? Math.round(
                          (allActiveUsers.length / allUsers.length) * 100
                        )
                      : 0}
                    %
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 rounded-2xl bg-slate-900 px-5 py-3 text-white shadow-sm">
                <div>
                  <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                    Total Active
                  </p>
                  <p className="text-lg font-black text-white">
                    {allActiveUsers.length}{" "}
                    <span className="text-xs font-medium text-slate-400">
                      / {allUsers.length}
                    </span>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="mx-auto max-w-7xl px-4 pt-8 sm:px-6 lg:px-8">
        {/* Metric Cards */}
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {/* Total Active Card */}
          <div
            onClick={() => setSelectedRole("ALL")}
            className={`group cursor-pointer rounded-2xl border p-6 shadow-sm transition-all duration-200 hover:-translate-y-1 hover:shadow-md ${
              selectedRole === "ALL"
                ? "border-emerald-500 bg-white ring-2 ring-emerald-500/20"
                : "border-slate-200/80 bg-white hover:border-slate-300"
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                All Active
              </span>
              <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-emerald-50 text-sm">
                👥
              </span>
            </div>

            <p className="mt-4 text-3xl font-black text-slate-900">
              {allActiveUsers.length}
            </p>

            <div className="mt-2 flex items-center gap-2 text-xs font-medium text-slate-500">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
              <span>All active accounts</span>
            </div>
          </div>

          {/* Active Customers Card */}
          <div
            onClick={() => setSelectedRole("USER")}
            className={`group cursor-pointer rounded-2xl border p-6 shadow-sm transition-all duration-200 hover:-translate-y-1 hover:shadow-md ${
              selectedRole === "USER"
                ? "border-blue-500 bg-white ring-2 ring-blue-500/20"
                : "border-slate-200/80 bg-white hover:border-slate-300"
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Active Customers
              </span>
              <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-blue-50 text-sm">
                👤
              </span>
            </div>

            <p className="mt-4 text-3xl font-black text-slate-900">
              {activeCustomers.length}
            </p>

            <div className="mt-2 flex items-center gap-2 text-xs font-medium text-slate-500">
              <span className="h-1.5 w-1.5 rounded-full bg-blue-500" />
              <span>Regular buyers & renters</span>
            </div>
          </div>

          {/* Active Agents Card */}
          <div
            onClick={() => setSelectedRole("AGENT")}
            className={`group cursor-pointer rounded-2xl border p-6 shadow-sm transition-all duration-200 hover:-translate-y-1 hover:shadow-md ${
              selectedRole === "AGENT"
                ? "border-purple-500 bg-white ring-2 ring-purple-500/20"
                : "border-slate-200/80 bg-white hover:border-slate-300"
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Active Agents
              </span>
              <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-purple-50 text-sm">
                🏢
              </span>
            </div>

            <p className="mt-4 text-3xl font-black text-slate-900">
              {activeAgents.length}
            </p>

            <div className="mt-2 flex items-center gap-2 text-xs font-medium text-slate-500">
              <span className="h-1.5 w-1.5 rounded-full bg-purple-500" />
              <span>Property managers</span>
            </div>
          </div>

          {/* Active Admins Card */}
          <div
            onClick={() => setSelectedRole("ADMIN")}
            className={`group cursor-pointer rounded-2xl border p-6 shadow-sm transition-all duration-200 hover:-translate-y-1 hover:shadow-md ${
              selectedRole === "ADMIN"
                ? "border-red-500 bg-white ring-2 ring-red-500/20"
                : "border-slate-200/80 bg-white hover:border-slate-300"
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Active Admins
              </span>
              <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-red-50 text-sm">
                🛡️
              </span>
            </div>

            <p className="mt-4 text-3xl font-black text-slate-900">
              {activeAdmins.length}
            </p>

            <div className="mt-2 flex items-center gap-2 text-xs font-medium text-slate-500">
              <span className="h-1.5 w-1.5 rounded-full bg-red-500" />
              <span>System administrators</span>
            </div>
          </div>
        </div>

        {/* Users Section */}
        <section className="mt-8 overflow-hidden rounded-3xl border border-slate-200/80 bg-white shadow-sm">
          {/* Controls Bar: Search & Filter Tabs */}
          <div className="border-b border-slate-100 p-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="text-xl font-black text-slate-900">
                  {selectedRole === "ALL"
                    ? "All Active Users"
                    : selectedRole === "USER"
                    ? "Active Customers"
                    : selectedRole === "AGENT"
                    ? "Active Agents"
                    : "Active Admins"}
                </h2>
                <p className="mt-1 text-xs text-slate-500 font-medium">
                  Showing {filteredUsers.length} of {allActiveUsers.length}{" "}
                  active users
                </p>
              </div>

              {/* Search Box */}
              <div className="relative w-full sm:w-80">
                <input
                  type="text"
                  placeholder="Search name, email, ID..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50/70 px-4 py-2.5 pl-10 text-sm text-slate-900 placeholder:text-slate-400 focus:border-emerald-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 transition"
                />
                <span className="pointer-events-none absolute left-3.5 top-3 text-sm text-slate-400">
                  🔍
                </span>
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery("")}
                    className="absolute right-3 top-2.5 flex h-5 w-5 items-center justify-center rounded-full bg-slate-200 text-[10px] text-slate-600 hover:bg-slate-300"
                  >
                    ✕
                  </button>
                )}
              </div>
            </div>

            {/* Filter Tabs */}
            <div className="mt-6 flex flex-wrap items-center gap-2">
              {[
                {
                  id: "ALL",
                  label: "All Active",
                  count: allActiveUsers.length,
                },
                {
                  id: "USER",
                  label: "Customers",
                  count: activeCustomers.length,
                },
                {
                  id: "AGENT",
                  label: "Agents",
                  count: activeAgents.length,
                },
                {
                  id: "ADMIN",
                  label: "Admins",
                  count: activeAdmins.length,
                },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setSelectedRole(tab.id)}
                  className={`flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-bold transition duration-150 ${
                    selectedRole === tab.id
                      ? "bg-slate-900 text-white shadow-sm"
                      : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                  }`}
                >
                  <span>{tab.label}</span>
                  <span
                    className={`rounded-full px-2 py-0.5 text-[10px] font-black ${
                      selectedRole === tab.id
                        ? "bg-white/20 text-white"
                        : "bg-slate-200 text-slate-700"
                    }`}
                  >
                    {tab.count}
                  </span>
                </button>
              ))}

              {isFetching && (
                <span className="ml-auto text-xs font-medium text-slate-400 animate-pulse">
                  Syncing live data...
                </span>
              )}
            </div>
          </div>

          {/* Table or Empty State */}
          {filteredUsers.length === 0 ? (
            <div className="px-6 py-20 text-center">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-3xl bg-slate-100 text-3xl">
                👥
              </div>

              <h3 className="mt-5 text-lg font-bold text-slate-900">
                No active users found
              </h3>

              <p className="mt-2 text-sm text-slate-500 max-w-sm mx-auto">
                {searchQuery
                  ? "No active user matches your search query. Try typing a different keyword."
                  : "There are currently no active users under this role category."}
              </p>

              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="mt-5 rounded-xl border border-slate-200 bg-white px-4 py-2 text-xs font-bold text-slate-700 shadow-sm hover:bg-slate-50"
                >
                  Clear Search
                </button>
              )}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[950px] border-collapse">
                <thead>
                  <tr className="border-b border-slate-100 bg-slate-50/60 text-[11px] font-black uppercase tracking-wider text-slate-400">
                    <th className="px-6 py-4 text-left">User</th>
                    <th className="px-6 py-4 text-left">Email Address</th>
                    <th className="px-6 py-4 text-left">Role</th>
                    <th className="px-6 py-4 text-left">Status</th>
                    <th className="px-6 py-4 text-left">User ID</th>
                    <th className="px-6 py-4 text-left">Actions</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-slate-100 text-sm">
                  {filteredUsers.map((user: any) => {
                    const initials =
                      user.name?.trim()?.charAt(0)?.toUpperCase() || "U";
                    const isUserAdmin = user.role === "ADMIN";

                    return (
                      <tr
                        key={user.id}
                        className="group transition-colors hover:bg-slate-50/80"
                      >
                        {/* User info */}
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div
                              className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl font-black text-sm shadow-sm ${
                                user.role === "AGENT"
                                  ? "bg-purple-100 text-purple-700 ring-4 ring-purple-50"
                                  : user.role === "ADMIN"
                                  ? "bg-red-100 text-red-700 ring-4 ring-red-50"
                                  : "bg-emerald-100 text-emerald-700 ring-4 ring-emerald-50"
                              }`}
                            >
                              {initials}
                            </div>

                            <div>
                              <p className="font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                                {user.name || "Unknown User"}
                              </p>
                              <p className="text-xs text-slate-400">
                                {user.role === "AGENT"
                                  ? "Estate Agent"
                                  : user.role === "ADMIN"
                                  ? "Platform Admin"
                                  : "Registered Client"}
                              </p>
                            </div>
                          </div>
                        </td>

                        {/* Email */}
                        <td className="px-6 py-4">
                          <span className="font-medium text-slate-600">
                            {user.email}
                          </span>
                        </td>

                        {/* Role */}
                        <td className="px-6 py-4">
                          <span
                            className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-bold ${
                              user.role === "AGENT"
                                ? "bg-purple-50 text-purple-700 ring-1 ring-inset ring-purple-600/20"
                                : user.role === "ADMIN"
                                ? "bg-red-50 text-red-700 ring-1 ring-inset ring-red-600/20"
                                : "bg-blue-50 text-blue-700 ring-1 ring-inset ring-blue-600/20"
                            }`}
                          >
                            <span>
                              {user.role === "AGENT"
                                ? "🏢"
                                : user.role === "ADMIN"
                                ? "🛡️"
                                : "👤"}
                            </span>
                            {user.role}
                          </span>
                        </td>

                        {/* Status */}
                        <td className="px-6 py-4">
                          <span className="inline-flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-700 ring-1 ring-inset ring-emerald-600/20">
                            <span className="relative flex h-2 w-2">
                              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                              <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
                            </span>
                            Active
                          </span>
                        </td>

                        {/* ID */}
                        <td className="px-6 py-4">
                          <span className="rounded-lg bg-slate-100 px-2.5 py-1 text-xs font-mono font-bold text-slate-500">
                            #{user.id}
                          </span>
                        </td>

                        {/* Actions */}
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            {/* Activity Modal */}
                            <button
                              onClick={() => setActivityUserId(user.id)}
                              className="inline-flex items-center gap-1.5 rounded-xl bg-slate-900 px-3 py-2 text-xs font-bold text-white transition hover:bg-blue-600 active:scale-95 shadow-sm"
                            >
                              <span>📊</span>
                              Activity
                            </button>

                            {/* Deactivate Button (Guard for Admins) */}
                            {!isUserAdmin && (
                              <ActiveDeactiveUser
                                id={user.id}
                                isActive={user.isActive}
                              />
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </main>

      {/* Activity Report Modal */}
      {activityUserId !== null && (
        <Useractivityreport
          id={activityUserId}
          open={true}
          onClose={() => setActivityUserId(null)}
        />
      )}
    </div>
  );
};

export default ActiveUsers;