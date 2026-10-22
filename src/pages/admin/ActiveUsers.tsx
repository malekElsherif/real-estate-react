import { useState } from "react";
import { usegetallusers } from "../../hooks/useadmin";
import ActiveDeactiveUser from "./ActiveDeactiveUser";
import Useractivityreport from "./Useractivityreport";
import {
  activePill,
  btnDark,
  btnOutline,
  btnPad,
  btnPadSm,
  inputClass,
  roleAvatarClass,
  roleBadgeClass,
  roleLabel,
} from "./adminBrand";

const ActiveUsers = () => {
  const { data, isLoading, isError, error, refetch, isFetching } =
    usegetallusers();

  const [selectedRole, setSelectedRole] = useState<string>("ALL");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [activityUserId, setActivityUserId] = useState<number | null>(null);

  if (isLoading) {
    return (
      <div className="flex min-h-[500px] items-center justify-center bg-[#FFFDF9]">
        <div className="flex flex-col items-center gap-4">
          <div className="h-10 w-10 animate-spin rounded-full border-2 border-[#14213D]/15 border-t-[#B8863B]" />
          <p className="eyebrow text-[#14213D]/70">Loading active accounts</p>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex min-h-[500px] items-center justify-center bg-[#FFFDF9] px-4">
        <div className="w-full max-w-md border border-[#14213D]/15 bg-white p-8 text-center">
          <div className="mx-auto h-px w-10 bg-[#B8863B]" />

          <h2 className="font-heading mt-5 text-2xl font-semibold text-[#14213D]">
            Failed to load active users
          </h2>

          <p className="mt-2 text-xs leading-relaxed text-[#14213D]/60">
            {error instanceof Error
              ? error.message
              : "Something went wrong while loading active users."}
          </p>

          <button
            onClick={() => refetch()}
            className={`mt-6 w-full ${btnPad} bg-[#B8863B] text-white hover:bg-[#a37632] eyebrow font-semibold transition`}
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

  const metricCards = [
    {
      id: "ALL",
      title: "All Active",
      value: allActiveUsers.length,
      info: "All active accounts",
    },
    {
      id: "USER",
      title: "Active Customers",
      value: activeCustomers.length,
      info: "Regular buyers & renters",
    },
    {
      id: "AGENT",
      title: "Active Agents",
      value: activeAgents.length,
      info: "Property managers",
    },
    {
      id: "ADMIN",
      title: "Active Admins",
      value: activeAdmins.length,
      info: "System administrators",
    },
  ];

  const filterTabs = [
    { id: "ALL", label: "All Active", count: allActiveUsers.length },
    { id: "USER", label: "Customers", count: activeCustomers.length },
    { id: "AGENT", label: "Agents", count: activeAgents.length },
    { id: "ADMIN", label: "Admins", count: activeAdmins.length },
  ];

  const activeRate =
    allUsers.length > 0
      ? Math.round((allActiveUsers.length / allUsers.length) * 100)
      : 0;

  return (
    <div className="min-h-screen bg-[#FFFDF9] pb-16 text-[#14213D]">
      {/* Header */}
      <header className="bg-[#14213D]">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
            <div>
              <div className="flex flex-wrap items-center gap-3">
                <p className="eyebrow text-[#B8863B]">Admin Console</p>
                <span className="eyebrow inline-flex items-center gap-2 border border-[#B8863B]/50 px-2.5 py-1 text-[#B8863B]">
                  <span className="h-1.5 w-1.5 animate-pulse bg-[#B8863B]" />
                  Live Monitor
                </span>
              </div>

              <h1 className="font-heading mt-2 text-3xl font-semibold text-[#FFFDF9] sm:text-4xl">
                Active Users
              </h1>

              <p className="mt-2 max-w-xl text-xs leading-relaxed text-[#FFFDF9]/60">
                View, monitor, and inspect all currently enabled accounts
                across the platform.
              </p>
            </div>

            {/* Quick summary stats in Header */}
            <div className="flex flex-wrap items-center gap-3">
              <div className="border border-[#FFFDF9]/20 px-5 py-3">
                <p className="eyebrow text-[#FFFDF9]/55">Active Rate</p>
                <p className="font-heading mt-1 text-2xl font-semibold text-[#B8863B]">
                  {activeRate}%
                </p>
              </div>

              <div className="bg-[#B8863B] px-5 py-3 text-white">
                <p className="eyebrow text-white/80">Total Active</p>
                <p className="font-heading mt-1 text-2xl font-semibold">
                  {allActiveUsers.length}{" "}
                  <span className="font-data text-xs font-normal text-white/70">
                    / {allUsers.length}
                  </span>
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="h-px bg-gradient-to-r from-transparent via-[#B8863B] to-transparent" />
      </header>

      {/* Main Content */}
      <main className="mx-auto max-w-7xl px-4 pt-10 sm:px-6 lg:px-8">
        {/* Metric Cards */}
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {metricCards.map((card) => (
            <div
              key={card.id}
              onClick={() => setSelectedRole(card.id)}
              className={`group cursor-pointer border bg-white p-6 transition hover:-translate-y-1 hover:shadow-[0_12px_30px_-12px_rgba(20,33,61,0.25)] ${
                selectedRole === card.id
                  ? "border-[#B8863B] shadow-[inset_0_-3px_0_#B8863B]"
                  : "border-[#14213D]/15 hover:border-[#B8863B]"
              }`}
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

        {/* Users Section */}
        <section className="mt-10 overflow-hidden border border-[#14213D] bg-[#FFFDF9]">
          {/* Controls Bar: Search & Filter Tabs */}
          <div className="border-b border-[#E4DFD3] p-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="font-heading text-2xl font-semibold text-[#14213D]">
                  {selectedRole === "ALL"
                    ? "All Active Users"
                    : selectedRole === "USER"
                    ? "Active Customers"
                    : selectedRole === "AGENT"
                    ? "Active Agents"
                    : "Active Admins"}
                </h2>
                <p className="eyebrow mt-1 text-[#14213D]/45">
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
                  className={inputClass}
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery("")}
                    className="absolute right-3 top-2.5 flex h-5 w-5 items-center justify-center text-[10px] text-[#14213D]/60 hover:text-[#B8863B]"
                  >
                    ✕
                  </button>
                )}
              </div>
            </div>

            {/* Filter Tabs */}
            <div className="mt-6 flex flex-wrap items-center gap-2">
              {filterTabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setSelectedRole(tab.id)}
                  className={`eyebrow flex items-center gap-2 border px-4 py-2 font-semibold transition ${
                    selectedRole === tab.id
                      ? "border-[#14213D] bg-[#14213D] text-[#FFFDF9]"
                      : "border-[#E4DFD3] bg-[#FFFDF9] text-[#14213D] hover:border-[#14213D]"
                  }`}
                >
                  <span>{tab.label}</span>
                  <span
                    className={`px-1.5 py-0.5 text-[10px] ${
                      selectedRole === tab.id
                        ? "bg-[#B8863B] text-white"
                        : "bg-[#14213D]/10 text-[#14213D]"
                    }`}
                  >
                    {tab.count}
                  </span>
                </button>
              ))}

              {isFetching && (
                <span className="eyebrow ml-auto animate-pulse text-[#B8863B]">
                  Syncing live data...
                </span>
              )}
            </div>
          </div>

          {/* Table or Empty State */}
          {filteredUsers.length === 0 ? (
            <div className="px-6 py-20 text-center">
              <div className="mx-auto h-px w-10 bg-[#B8863B]" />

              <h3 className="font-heading mt-5 text-2xl font-semibold text-[#14213D]">
                No active users found
              </h3>

              <p className="mx-auto mt-2 max-w-sm text-xs leading-relaxed text-[#4A5568]">
                {searchQuery
                  ? "No active user matches your search query. Try typing a different keyword."
                  : "There are currently no active users under this role category."}
              </p>

              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className={`mt-5 ${btnPad} ${btnOutline}`}
                >
                  Clear Search
                </button>
              )}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[950px] border-collapse">
                <thead>
                  <tr className="eyebrow bg-[#14213D] text-[#FFFDF9]">
                    <th className="px-6 py-4 text-left font-semibold">User</th>
                    <th className="px-6 py-4 text-left font-semibold">Email Address</th>
                    <th className="px-6 py-4 text-left font-semibold">Role</th>
                    <th className="px-6 py-4 text-left font-semibold">Status</th>
                    <th className="px-6 py-4 text-left font-semibold">User ID</th>
                    <th className="px-6 py-4 text-left font-semibold">Actions</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-[#E4DFD3] text-xs">
                  {filteredUsers.map((user: any) => {
                    const initials =
                      user.name?.trim()?.charAt(0)?.toUpperCase() || "U";
                    const isUserAdmin = user.role === "ADMIN";

                    return (
                      <tr
                        key={user.id}
                        className="group transition-colors hover:bg-[#EFEAE0]/30"
                      >
                        {/* User info */}
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div
                              className={`font-heading flex h-11 w-11 shrink-0 items-center justify-center text-lg font-semibold ${roleAvatarClass(
                                user.role
                              )}`}
                            >
                              {initials}
                            </div>

                            <div>
                              <p className="text-sm font-semibold text-[#14213D] transition-colors group-hover:text-[#B8863B]">
                                {user.name || "Unknown User"}
                              </p>
                              <p className="text-[10px] text-[#4A5568]">
                                {roleLabel(user.role)}
                              </p>
                            </div>
                          </div>
                        </td>

                        {/* Email */}
                        <td className="px-6 py-4">
                          <span className="text-[#4A5568]">{user.email}</span>
                        </td>

                        {/* Role */}
                        <td className="px-6 py-4">
                          <span
                            className={`eyebrow inline-block border px-2.5 py-1 font-semibold ${roleBadgeClass(
                              user.role
                            )}`}
                          >
                            {user.role}
                          </span>
                        </td>

                        {/* Status */}
                        <td className="px-6 py-4">
                          <span className={activePill}>
                            <span className="relative flex h-2 w-2">
                              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#5B7B65] opacity-60" />
                              <span className="relative inline-flex h-2 w-2 rounded-full bg-[#5B7B65]" />
                            </span>
                            Active
                          </span>
                        </td>

                        {/* ID */}
                        <td className="px-6 py-4">
                          <span className="bg-[#14213D]/10 px-2.5 py-1 text-[10px] font-semibold text-[#14213D]/70">
                            #{user.id}
                          </span>
                        </td>

                        {/* Actions */}
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            {/* Activity Modal */}
                            <button
                              onClick={() => setActivityUserId(user.id)}
                              className={`${btnPadSm} ${btnDark}`}
                            >
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
