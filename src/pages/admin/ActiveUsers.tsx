import { useState } from "react";
import { usegetallusers } from "../../hooks/useadmin";
import ActiveDeactiveUser from "./ActiveDeactiveUser";
import Useractivityreport from "./Useractivityreport";

export const ActiveUsers = () => {
  const { data, isLoading, isError, error, refetch, isFetching } = usegetallusers();
  const [selectedRole, setSelectedRole] = useState<string>("ALL");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [activityUserId, setActivityUserId] = useState<number | null>(null);

  if (isLoading) {
    return (
      <div className="flex min-h-[500px] items-center justify-center bg-stone-50">
        <div className="flex flex-col items-center gap-4">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-stone-300 border-t-amber-800" />
          <p className="text-xs uppercase tracking-widest text-stone-500 font-medium">Loading active accounts</p>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex min-h-[500px] items-center justify-center bg-stone-50 px-4">
        <div className="w-full max-w-md rounded-2xl border border-stone-200 bg-white p-8 text-center shadow-sm">
          <h2 className="text-xl font-bold text-stone-900">Failed to load active users</h2>
          <p className="mt-2 text-xs text-stone-500 leading-relaxed">
            {error instanceof Error ? error.message : "Something went wrong while loading active users."}
          </p>
          <button
            onClick={() => refetch()}
            className="mt-6 w-full rounded-xl bg-amber-800 py-2.5 text-xs font-semibold text-white hover:bg-amber-900 transition"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  const allUsers = data?.data ?? [];
  const allActiveUsers = allUsers.filter((user: any) => user.isActive === true);

  const activeCustomers = allActiveUsers.filter((user: any) => user.role === "USER");
  const activeAgents = allActiveUsers.filter((user: any) => user.role === "AGENT");
  const activeAdmins = allActiveUsers.filter((user: any) => user.role === "ADMIN");

  const filteredUsers = allActiveUsers.filter((user: any) => {
    const matchesRole = selectedRole === "ALL" || user.role === selectedRole;
    const matchesSearch =
      !searchQuery.trim() ||
      user.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      String(user.id).includes(searchQuery.trim());
    return matchesRole && matchesSearch;
  });

  const metricCards = [
    { id: "ALL", title: "All Active", value: allActiveUsers.length, info: "All active accounts" },
    { id: "USER", title: "Active Customers", value: activeCustomers.length, info: "Regular buyers & renters" },
    { id: "AGENT", title: "Active Agents", value: activeAgents.length, info: "Property managers" },
    { id: "ADMIN", title: "Active Admins", value: activeAdmins.length, info: "System administrators" },
  ];

  const filterTabs = [
    { id: "ALL", label: "All Active", count: allActiveUsers.length },
    { id: "USER", label: "Customers", count: activeCustomers.length },
    { id: "AGENT", label: "Agents", count: activeAgents.length },
    { id: "ADMIN", label: "Admins", count: activeAdmins.length },
  ];

  const activeRate = allUsers.length > 0 ? Math.round((allActiveUsers.length / allUsers.length) * 100) : 0;

  return (
    <div className="min-h-screen bg-stone-50 pb-16 text-stone-900">
      <header className="bg-stone-900 text-stone-50">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
            <div>
              <div className="flex flex-wrap items-center gap-3">
                <p className="text-xs uppercase tracking-widest text-amber-600 font-medium">Admin Console</p>
                <span className="inline-flex items-center gap-2 rounded-lg border border-amber-500/40 bg-amber-500/10 px-2.5 py-1 text-[10px] uppercase tracking-wider text-amber-400 font-semibold">
                  <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-amber-400" />
                  Live Monitor
                </span>
              </div>
              <h1 className="mt-2 text-3xl font-bold sm:text-4xl">Active Users</h1>
              <p className="mt-2 max-w-xl text-xs text-stone-400 leading-relaxed">
                View, monitor, and inspect all currently enabled accounts across the platform.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <div className="rounded-xl border border-stone-800 bg-stone-800/50 px-5 py-3">
                <p className="text-[10px] uppercase tracking-wider text-stone-400">Active Rate</p>
                <p className="mt-1 text-2xl font-bold text-amber-500">{activeRate}%</p>
              </div>
              <div className="rounded-xl bg-amber-800 px-5 py-3 text-white">
                <p className="text-[10px] uppercase tracking-wider text-amber-200">Total Active</p>
                <p className="mt-1 text-2xl font-bold">
                  {allActiveUsers.length} <span className="text-xs font-normal text-amber-100">/ {allUsers.length}</span>
                </p>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 pt-10 sm:px-6 lg:px-8">
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {metricCards.map((card) => (
            <div
              key={card.id}
              onClick={() => setSelectedRole(card.id)}
              className={`group cursor-pointer rounded-2xl border bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md ${
                selectedRole === card.id ? "border-amber-600 ring-1 ring-amber-600" : "border-stone-200 hover:border-amber-600"
              }`}
            >
              <p className="text-[10px] uppercase tracking-wider text-stone-500 font-semibold">{card.title}</p>
              <p className="mt-4 text-4xl font-bold text-stone-900">{card.value}</p>
              <div className="mt-5 h-0.5 w-8 bg-amber-600 transition-all group-hover:w-16" />
              <p className="mt-3 text-xs text-stone-500">{card.info}</p>
            </div>
          ))}
        </div>

        <section className="mt-10 overflow-hidden rounded-2xl border border-stone-200 bg-white shadow-sm">
          <div className="border-b border-stone-200 p-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="text-xl font-bold text-stone-900">
                  {selectedRole === "ALL" && "All Active Users"}
                  {selectedRole === "USER" && "Active Customers"}
                  {selectedRole === "AGENT" && "Active Agents"}
                  {selectedRole === "ADMIN" && "Active Admins"}
                </h2>
                <p className="mt-1 text-[10px] uppercase tracking-wider text-stone-500">
                  Showing {filteredUsers.length} of {allActiveUsers.length} active users
                </p>
              </div>

              <div className="relative w-full sm:w-80">
                <input
                  type="text"
                  placeholder="Search name, email, ID..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full rounded-xl border border-stone-200 bg-stone-50 px-4 py-2.5 text-xs text-stone-900 placeholder-stone-400 outline-none focus:border-stone-900"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery("")}
                    className="absolute right-3 top-2.5 flex h-5 w-5 items-center justify-center text-[10px] text-stone-400 hover:text-stone-700"
                  >
                    ✕
                  </button>
                )}
              </div>
            </div>

            <div className="mt-6 flex flex-wrap items-center gap-2">
              {filterTabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setSelectedRole(tab.id)}
                  className={`inline-flex items-center gap-2 rounded-xl border px-4 py-2 text-xs font-semibold transition ${
                    selectedRole === tab.id
                      ? "border-stone-900 bg-stone-900 text-stone-50"
                      : "border-stone-200 bg-white text-stone-900 hover:border-stone-900"
                  }`}
                >
                  <span>{tab.label}</span>
                  <span className={`rounded-md px-1.5 py-0.5 text-[10px] ${selectedRole === tab.id ? "bg-amber-600 text-white" : "bg-stone-100 text-stone-700"}`}>
                    {tab.count}
                  </span>
                </button>
              ))}

              {isFetching && (
                <span className="ml-auto text-xs uppercase tracking-wider text-amber-600 animate-pulse font-semibold">
                  Syncing live data...
                </span>
              )}
            </div>
          </div>

          {filteredUsers.length === 0 ? (
            <div className="px-6 py-20 text-center">
              <h3 className="text-xl font-bold text-stone-900">No active users found</h3>
              <p className="mx-auto mt-2 max-w-sm text-xs text-stone-500 leading-relaxed">
                {searchQuery ? "No active user matches your search query. Try typing a different keyword." : "There are currently no active users under this role category."}
              </p>
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="mt-5 rounded-xl border border-stone-300 px-4 py-2 text-xs font-semibold text-stone-900 hover:border-stone-900 transition"
                >
                  Clear Search
                </button>
              )}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[950px] border-collapse text-left text-xs">
                <thead>
                  <tr className="border-b border-stone-200 bg-stone-50 text-stone-500 uppercase tracking-wider text-[10px]">
                    <th className="px-6 py-4 font-semibold">User</th>
                    <th className="px-6 py-4 font-semibold">Email Address</th>
                    <th className="px-6 py-4 font-semibold">Role</th>
                    <th className="px-6 py-4 font-semibold">Status</th>
                    <th className="px-6 py-4 font-semibold">User ID</th>
                    <th className="px-6 py-4 font-semibold">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100">
                  {filteredUsers.map((user: any) => {
                    const initials = user.name?.trim()?.charAt(0)?.toUpperCase() || "U";
                    const isUserAdmin = user.role === "ADMIN";

                    return (
                      <tr key={user.id} className="transition-colors hover:bg-stone-50">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-amber-100 text-amber-800 text-base font-bold">
                              {initials}
                            </div>
                            <div>
                              <p className="text-sm font-semibold text-stone-900">{user.name || "Unknown User"}</p>
                              <p className="text-[10px] text-stone-500">
                                {user.role === "AGENT" ? "Estate Agent" : user.role === "ADMIN" ? "Platform Admin" : "Registered Client"}
                              </p>
                            </div>
                          </div>
                        </td>

                        <td className="px-6 py-4 text-stone-600">{user.email}</td>

                        <td className="px-6 py-4">
                          <span className={`inline-block rounded-lg border px-2.5 py-1 text-[10px] font-semibold uppercase ${
                            user.role === "ADMIN" ? "border-stone-900 bg-stone-900 text-stone-50" : user.role === "AGENT" ? "border-amber-500 bg-amber-50 text-amber-700" : "border-stone-300 text-stone-700"
                          }`}>
                            {user.role}
                          </span>
                        </td>

                        <td className="px-6 py-4">
                          <span className="inline-flex items-center gap-2 rounded-lg border border-green-600 bg-green-50 px-2.5 py-1 font-semibold text-green-700 text-[10px]">
                            <span className="relative flex h-2 w-2">
                              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-500 opacity-60" />
                              <span className="relative inline-flex h-2 w-2 rounded-full bg-green-600" />
                            </span>
                            Active
                          </span>
                        </td>

                        <td className="px-6 py-4">
                          <span className="rounded-md bg-stone-100 px-2 py-1 font-mono text-[10px] font-semibold text-stone-700">
                            #{user.id}
                          </span>
                        </td>

                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => setActivityUserId(user.id)}
                              className="rounded-xl border border-stone-300 px-3 py-2 text-[10px] font-semibold text-stone-900 hover:border-stone-900 transition"
                            >
                              Activity
                            </button>

                            {!isUserAdmin && <ActiveDeactiveUser id={user.id} isActive={user.isActive} />}
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

      {activityUserId !== null && (
        <Useractivityreport id={activityUserId} open={true} onClose={() => setActivityUserId(null)} />
      )}
    </div>
  );
};

export default ActiveUsers;
