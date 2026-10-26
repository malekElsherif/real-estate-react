import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { usegetallusers } from "../../hooks/useadmin";
import ActiveDeactiveUser from "./ActiveDeactiveUser";
import Useractivityreport from "./Useractivityreport";
import DeleteUser from "./DeleteUser";
import {
  activePill,
  inactivePill,
  inputClass,
  roleAvatarClass,
  roleBadgeClass,
  roleLabel,
} from "./adminBrand";

const UsersManage = () => {
  const navigate = useNavigate();

  const {
    data,
    isLoading,
    isError,
    error,
    refetch,
  } = usegetallusers();

  const [activityUserId, setActivityUserId] = useState<number | null>(null);
  const [opendeluser, setOpendeluser] = useState<number | null>(null);

  const [selectedRole, setSelectedRole] = useState<string>("ALL");
  const [selectedStatus, setSelectedStatus] = useState<string>("ALL");
  const [searchQuery, setSearchQuery] = useState<string>("");

  if (isLoading) {
    return (
      <div className="flex min-h-[500px] items-center justify-center bg-stone-50">
        <div className="flex flex-col items-center gap-4">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-stone-300 border-t-amber-800" />
          <p className="text-xs uppercase tracking-widest text-stone-500 font-medium">Loading users</p>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex min-h-[500px] items-center justify-center bg-stone-50 px-4">
        <div className="w-full max-w-md rounded-2xl border border-stone-200 bg-white p-8 text-center shadow-sm">
          <h2 className="text-xl font-bold text-stone-900">Failed to load users</h2>
          <p className="mt-2 text-xs text-stone-500 leading-relaxed">
            {error instanceof Error ? error.message : "Something went wrong while loading users."}
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

  const users = data?.data ?? [];
  const totalUsers = users.length;

  const agents = users.filter((user: any) => user.role === "AGENT").length;
  const customers = users.filter((user: any) => user.role === "USER").length;
  const admins = users.filter((user: any) => user.role === "ADMIN").length;

  const activeUsers = users.filter((user: any) => user.isActive === true).length;
  const inactiveUsers = users.filter((user: any) => user.isActive === false).length;

  const activeRate = totalUsers > 0 ? Math.round((activeUsers / totalUsers) * 100) : 0;

  const filteredUsers = users.filter((user: any) => {
    const matchesRole = selectedRole === "ALL" ? true : user.role === selectedRole;
    const matchesStatus =
      selectedStatus === "ALL"
        ? true
        : selectedStatus === "ACTIVE"
        ? user.isActive === true
        : user.isActive === false;

    const matchesSearch =
      searchQuery.trim() === ""
        ? true
        : user.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          user.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          String(user.id).includes(searchQuery.trim());

    return matchesRole && matchesStatus && matchesSearch;
  });

  const resetFilters = () => {
    setSelectedRole("ALL");
    setSelectedStatus("ALL");
    setSearchQuery("");
  };

  const isFiltered = selectedRole !== "ALL" || selectedStatus !== "ALL" || searchQuery !== "";

  const handleUserClick = (id: number) => {
    navigate(`/admin/dashboard/users/${id}`);
  };

  const statCards = [
    {
      title: "Total Users",
      value: totalUsers,
      info: "All accounts",
      selected: selectedRole === "ALL" && selectedStatus === "ALL",
      onClick: () => {
        setSelectedRole("ALL");
        setSelectedStatus("ALL");
      },
    },
    {
      title: "Active",
      value: activeUsers,
      info: "Enabled accounts",
      selected: selectedStatus === "ACTIVE",
      onClick: () => setSelectedStatus("ACTIVE"),
    },
    {
      title: "Inactive",
      value: inactiveUsers,
      info: "Disabled accounts",
      selected: selectedStatus === "INACTIVE",
      onClick: () => setSelectedStatus("INACTIVE"),
    },
    {
      title: "Customers",
      value: customers,
      info: "Regular users",
      selected: selectedRole === "USER",
      onClick: () => setSelectedRole("USER"),
    },
    {
      title: "Agents",
      value: agents,
      info: "Property agents",
      selected: selectedRole === "AGENT",
      onClick: () => setSelectedRole("AGENT"),
    },
  ];

  const roleTabs = [
    { id: "ALL", label: "All Roles", count: totalUsers },
    { id: "USER", label: "Customers", count: customers },
    { id: "AGENT", label: "Agents", count: agents },
    { id: "ADMIN", label: "Admins", count: admins },
  ];

  const statusTabs = [
    { id: "ALL", label: "All Status" },
    { id: "ACTIVE", label: "Active" },
    { id: "INACTIVE", label: "Inactive" },
  ];

  return (
    <div className="min-h-screen bg-stone-50 pb-16 text-stone-900">
      {/* Header */}
      <header className="bg-stone-900 text-stone-50">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="text-xs uppercase tracking-widest text-amber-600 font-medium">Admin Console</p>

              <div className="mt-2 flex flex-wrap items-center gap-3">
                <h1 className="text-3xl font-bold sm:text-4xl">User Management</h1>
                <span className="rounded-lg border border-amber-500/40 bg-amber-500/10 px-2.5 py-1 text-[10px] uppercase tracking-wider text-amber-400 font-semibold">
                  {totalUsers} Accounts
                </span>
              </div>

              <p className="mt-2 max-w-xl text-xs leading-relaxed text-stone-400">
                Manage all registered users, monitor active sessions, update account status, and review user activity reports.
              </p>
            </div>

            {/* Quick Summary */}
            <div className="flex flex-wrap items-center gap-3">
              <div className="rounded-xl border border-stone-800 bg-stone-800/50 px-5 py-3">
                <p className="text-[10px] uppercase tracking-wider text-stone-400">Active Rate</p>
                <p className="mt-1 text-2xl font-bold text-amber-500">
                  {activeRate}%{" "}
                  <span className="text-xs font-normal text-stone-400 font-mono">
                    ({activeUsers}/{totalUsers})
                  </span>
                </p>
              </div>

              <div className="rounded-xl bg-amber-800 px-5 py-3 text-white">
                <p className="text-[10px] uppercase tracking-wider text-amber-200">Total Accounts</p>
                <p className="mt-1 text-2xl font-bold">{totalUsers}</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main */}
      <main className="mx-auto max-w-7xl px-4 pt-10 sm:px-6 lg:px-8">
        {/* Statistics */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {statCards.map((card) => (
            <div
              key={card.title}
              onClick={card.onClick}
              className={`group cursor-pointer rounded-2xl border bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-md ${
                card.selected
                  ? "border-amber-600 ring-1 ring-amber-600"
                  : "border-stone-200 hover:border-amber-600"
              }`}
            >
              <p className="text-[10px] uppercase tracking-wider text-stone-500 font-semibold">{card.title}</p>
              <p className="mt-3 text-4xl font-bold text-stone-900">{card.value}</p>
              <div className="mt-4 h-0.5 w-8 bg-amber-600 transition-all group-hover:w-14" />
              <p className="mt-2 text-[11px] text-stone-500">{card.info}</p>
            </div>
          ))}
        </div>

        {/* Table */}
        <section className="mt-10 overflow-hidden rounded-2xl border border-stone-200 bg-white shadow-sm">
          {/* Controls */}
          <div className="border-b border-stone-200 p-6">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <h2 className="text-xl font-bold text-stone-900">
                  {selectedRole === "ALL"
                    ? "All Users"
                    : selectedRole === "USER"
                    ? "Customers"
                    : selectedRole === "AGENT"
                    ? "Agents"
                    : "Admins"}

                  {selectedStatus !== "ALL" && (
                    <span className="ml-2 text-xs font-normal text-amber-700 font-mono">
                      ({selectedStatus === "ACTIVE" ? "Active only" : "Inactive only"})
                    </span>
                  )}
                </h2>

                <p className="mt-1 text-[10px] uppercase tracking-wider text-stone-500">
                  Showing {filteredUsers.length} of {totalUsers} accounts
                </p>
              </div>

              {/* Search */}
              <div className="flex items-center gap-3">
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
                      className="absolute right-3 top-2.5 flex h-5 w-5 items-center justify-center text-[10px] text-stone-400 hover:text-stone-700"
                    >
                      ✕
                    </button>
                  )}
                </div>

                {isFiltered && (
                  <button
                    onClick={resetFilters}
                    className="shrink-0 rounded-xl border border-stone-300 bg-white px-4 py-2.5 text-xs font-semibold text-stone-700 hover:border-stone-900 transition"
                  >
                    Reset Filters
                  </button>
                )}
              </div>
            </div>

            {/* Filters */}
            <div className="mt-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div className="flex flex-wrap items-center gap-2">
                {roleTabs.map((tab) => (
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
                    <span
                      className={`rounded-md px-1.5 py-0.5 text-[10px] ${
                        selectedRole === tab.id
                          ? "bg-amber-600 text-white"
                          : "bg-stone-100 text-stone-700"
                      }`}
                    >
                      {tab.count}
                    </span>
                  </button>
                ))}
              </div>

              <div className="flex items-center rounded-xl border border-stone-200 overflow-hidden bg-stone-50 p-1">
                {statusTabs.map((status) => (
                  <button
                    key={status.id}
                    onClick={() => setSelectedStatus(status.id)}
                    className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition ${
                      selectedStatus === status.id
                        ? "bg-amber-600 text-white shadow-xs"
                        : "text-stone-600 hover:text-stone-900"
                    }`}
                  >
                    {status.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Table / Empty */}
          {filteredUsers.length === 0 ? (
            <div className="px-6 py-20 text-center">
              <h3 className="text-xl font-bold text-stone-900">No users found</h3>
              <p className="mx-auto mt-2 max-w-sm text-xs leading-relaxed text-stone-500">
                {isFiltered
                  ? "No accounts match your current filter and search criteria."
                  : "There are no registered users on the platform yet."}
              </p>

              {isFiltered && (
                <button
                  onClick={resetFilters}
                  className="mt-5 rounded-xl border border-stone-300 bg-white px-4 py-2.5 text-xs font-semibold text-stone-700 hover:border-stone-900 transition"
                >
                  Clear All Filters
                </button>
              )}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[1000px] border-collapse text-xs">
                <thead>
                  <tr className="border-b border-stone-200 bg-stone-50 text-stone-500 uppercase tracking-wider text-[10px]">
                    <th className="px-6 py-4 text-left font-semibold">User</th>
                    <th className="px-6 py-4 text-left font-semibold">Email Address</th>
                    <th className="px-6 py-4 text-left font-semibold">Role</th>
                    <th className="px-6 py-4 text-left font-semibold">Status</th>
                    <th className="px-6 py-4 text-left font-semibold">User ID</th>
                    <th className="px-6 py-4 text-left font-semibold">Actions</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-stone-100">
                  {filteredUsers.map((user: any) => {
                    const initials = user.name?.trim()?.charAt(0)?.toUpperCase() || "U";
                    const isUserAdmin = user.role === "ADMIN";

                    return (
                      <tr
                        key={user.id}
                        onClick={() => handleUserClick(user.id)}
                        className="group cursor-pointer transition-colors hover:bg-stone-50"
                      >
                        {/* User */}
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div
                              className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl text-base font-bold ${roleAvatarClass(
                                user.role
                              )}`}
                            >
                              {initials}
                            </div>

                            <div>
                              <p className="text-sm font-semibold text-stone-900 transition-colors group-hover:text-amber-700">
                                {user.name || "Unknown User"}
                              </p>
                              <p className="text-[10px] uppercase tracking-wider text-stone-500 font-semibold">
                                {roleLabel(user.role)}
                              </p>
                            </div>
                          </div>
                        </td>

                        {/* Email */}
                        <td className="px-6 py-4 text-stone-600">{user.email}</td>

                        {/* Role */}
                        <td className="px-6 py-4">
                          <span
                            className={`inline-block rounded-lg border px-2.5 py-1 text-[10px] font-semibold uppercase ${roleBadgeClass(
                              user.role
                            )}`}
                          >
                            {user.role}
                          </span>
                        </td>

                        {/* Status */}
                        <td className="px-6 py-4">
                          {user.isActive ? (
                            <span className={activePill}>
                              <span className="relative flex h-2 w-2">
                                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-500 opacity-60" />
                                <span className="relative inline-flex h-2 w-2 rounded-full bg-green-600" />
                              </span>
                              Active
                            </span>
                          ) : (
                            <span className={inactivePill}>
                              <span className="h-2 w-2 rounded-full bg-red-600" />
                              Inactive
                            </span>
                          )}
                        </td>

                        {/* ID */}
                        <td className="px-6 py-4">
                          <span className="rounded-md bg-stone-100 px-2 py-1 font-mono text-[10px] font-semibold text-stone-700">
                            #{user.id}
                          </span>
                        </td>

                        {/* Actions */}
                        <td
                          className="px-6 py-4"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <div className="flex items-center gap-2">
                            {!isUserAdmin && (
                              <ActiveDeactiveUser
                                id={user.id}
                                isActive={user.isActive}
                              />
                            )}

                            <button
                              onClick={() => setActivityUserId(user.id)}
                              className="rounded-xl border border-stone-300 bg-white px-3 py-2 text-[10px] font-semibold text-stone-900 hover:border-stone-900 transition"
                            >
                              Activity
                            </button>

                            {!isUserAdmin && (
                              <button
                                onClick={() => setOpendeluser(user.id)}
                                className="rounded-xl bg-red-600 px-3 py-2 text-[10px] font-semibold text-white hover:bg-red-700 transition"
                              >
                                Delete
                              </button>
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

      {/* Activity Dialog */}
      {activityUserId !== null && (
        <Useractivityreport
          id={activityUserId}
          open={true}
          onClose={() => setActivityUserId(null)}
        />
      )}

      {/* Delete Dialog */}
      {opendeluser !== null && (
        <DeleteUser
          id={opendeluser}
          open={true}
          onClose={() => setOpendeluser(null)}
        />
      )}
    </div>
  );
};

export default UsersManage;
