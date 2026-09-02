import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { usegetallusers } from "../../hooks/useadmin";
import ActiveDeactiveUser from "./ActiveDeactiveUser";
import Useractivityreport from "./Useractivityreport";
import DeleteUser from "./DeleteUser";

const UsersManage = () => {
  const navigate = useNavigate();

  const {
    data,
    isLoading,
    isError,
    error,
    refetch,
    isFetching,
  } = usegetallusers();

  const [activityUserId, setActivityUserId] = useState<number | null>(null);
  const [opendeluser, setOpendeluser] = useState<number | null>(null);

  const [selectedRole, setSelectedRole] = useState<string>("ALL");
  const [selectedStatus, setSelectedStatus] = useState<string>("ALL");
  const [searchQuery, setSearchQuery] = useState<string>("");

  // =========================
  // Loading
  // =========================

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50">
        <div className="flex flex-col items-center gap-4">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-slate-200 border-t-blue-600" />

          <p className="text-sm font-semibold text-slate-500">
            Loading users...
          </p>
        </div>
      </div>
    );
  }

  // =========================
  // Error
  // =========================

  if (isError) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4">
        <div className="w-full max-w-md rounded-3xl border border-red-100 bg-white p-8 text-center shadow-lg shadow-red-500/5">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-red-50 text-2xl text-red-600">
            ⚠️
          </div>

          <h2 className="mt-5 text-xl font-bold text-slate-900">
            Failed to load users
          </h2>

          <p className="mt-2 text-sm leading-6 text-slate-500">
            {error instanceof Error
              ? error.message
              : "Something went wrong while loading users."}
          </p>

          <button
            onClick={() => refetch()}
            className="mt-6 inline-flex items-center gap-2 rounded-xl bg-slate-900 px-5 py-2.5 text-xs font-bold text-white transition hover:bg-blue-600 active:scale-95"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  // =========================
  // Data
  // =========================

  const users = data?.data ?? [];

  const totalUsers = users.length;

  const agents = users.filter(
    (user: any) => user.role === "AGENT"
  ).length;

  const customers = users.filter(
    (user: any) => user.role === "USER"
  ).length;

  const admins = users.filter(
    (user: any) => user.role === "ADMIN"
  ).length;

  const activeUsers = users.filter(
    (user: any) => user.isActive === true
  ).length;

  const inactiveUsers = users.filter(
    (user: any) => user.isActive === false
  ).length;

  const activeRate =
    totalUsers > 0
      ? Math.round((activeUsers / totalUsers) * 100)
      : 0;

  // =========================
  // Filtering
  // =========================

  const filteredUsers = users.filter((user: any) => {
    const matchesRole =
      selectedRole === "ALL"
        ? true
        : user.role === selectedRole;

    const matchesStatus =
      selectedStatus === "ALL"
        ? true
        : selectedStatus === "ACTIVE"
        ? user.isActive === true
        : user.isActive === false;

    const matchesSearch =
      searchQuery.trim() === ""
        ? true
        : user.name
            ?.toLowerCase()
            .includes(searchQuery.toLowerCase()) ||
          user.email
            ?.toLowerCase()
            .includes(searchQuery.toLowerCase()) ||
          String(user.id).includes(searchQuery.trim());

    return matchesRole && matchesStatus && matchesSearch;
  });

  // =========================
  // Reset Filters
  // =========================

  const resetFilters = () => {
    setSelectedRole("ALL");
    setSelectedStatus("ALL");
    setSearchQuery("");
  };

  const isFiltered =
    selectedRole !== "ALL" ||
    selectedStatus !== "ALL" ||
    searchQuery !== "";

  // =========================
  // Navigate User
  // =========================

  const handleUserClick = (id: number) => {
    navigate(`/admin/dashboard/users/${id}`);
  };

  // =========================
  // UI
  // =========================

  return (
    <div className="min-h-screen bg-slate-50/60 pb-16">

      {/* Header */}

      <header className="border-b border-slate-200/80 bg-white">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">

          <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">

            <div>
              <div className="flex items-center gap-3">

                <h1 className="text-2xl font-black tracking-tight text-slate-900 sm:text-3xl">
                  User Management
                </h1>

                <span className="inline-flex items-center gap-1 rounded-full bg-blue-50 px-3 py-1 text-xs font-bold text-blue-700 ring-1 ring-inset ring-blue-600/20">
                  {totalUsers} Accounts
                </span>

              </div>

              <p className="mt-2 text-sm text-slate-500">
                Manage all registered users, monitor active sessions,
                update account status, and review user activity reports.
              </p>
            </div>

            {/* Quick Summary */}

            <div className="flex flex-wrap items-center gap-3">

              <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">

                <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-emerald-100 text-xs font-bold text-emerald-700">
                  🟢
                </div>

                <div>
                  <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    Active Rate
                  </p>

                  <p className="text-sm font-black text-slate-900">
                    {activeRate}% ({activeUsers}/{totalUsers})
                  </p>
                </div>

              </div>

              <div className="rounded-2xl bg-blue-600 px-5 py-3 text-white shadow-sm">

                <p className="text-[10px] font-bold uppercase tracking-wider text-blue-100">
                  Total Accounts
                </p>

                <p className="text-lg font-black text-white">
                  {totalUsers}
                </p>

              </div>

            </div>

          </div>

        </div>
      </header>

      {/* Main */}

      <main className="mx-auto max-w-7xl px-4 pt-8 sm:px-6 lg:px-8">

        {/* Statistics */}

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">

          {/* Total */}

          <div
            onClick={() => {
              setSelectedRole("ALL");
              setSelectedStatus("ALL");
            }}
            className={`group cursor-pointer rounded-2xl border p-5 shadow-sm transition-all duration-200 hover:-translate-y-1 hover:shadow-md ${
              selectedRole === "ALL" &&
              selectedStatus === "ALL"
                ? "border-blue-500 bg-white ring-2 ring-blue-500/20"
                : "border-slate-200/80 bg-white hover:border-slate-300"
            }`}
          >
            <div className="flex items-center justify-between">

              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Total Users
              </span>

              <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-blue-50 text-xs">
                👥
              </span>

            </div>

            <p className="mt-3 text-2xl font-black text-slate-900">
              {totalUsers}
            </p>

            <p className="mt-1 text-[11px] font-medium text-slate-400">
              All accounts
            </p>
          </div>

          {/* Active */}

          <div
            onClick={() => setSelectedStatus("ACTIVE")}
            className={`group cursor-pointer rounded-2xl border p-5 shadow-sm transition-all duration-200 hover:-translate-y-1 hover:shadow-md ${
              selectedStatus === "ACTIVE"
                ? "border-emerald-500 bg-white ring-2 ring-emerald-500/20"
                : "border-slate-200/80 bg-white hover:border-slate-300"
            }`}
          >
            <div className="flex items-center justify-between">

              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Active
              </span>

              <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-50 text-xs">
                🟢
              </span>

            </div>

            <p className="mt-3 text-2xl font-black text-slate-900">
              {activeUsers}
            </p>

            <p className="mt-1 text-[11px] font-medium text-slate-400">
              Enabled accounts
            </p>
          </div>

          {/* Inactive */}

          <div
            onClick={() => setSelectedStatus("INACTIVE")}
            className={`group cursor-pointer rounded-2xl border p-5 shadow-sm transition-all duration-200 hover:-translate-y-1 hover:shadow-md ${
              selectedStatus === "INACTIVE"
                ? "border-amber-500 bg-white ring-2 ring-amber-500/20"
                : "border-slate-200/80 bg-white hover:border-slate-300"
            }`}
          >
            <div className="flex items-center justify-between">

              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Inactive
              </span>

              <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-amber-50 text-xs">
                ⏸️
              </span>

            </div>

            <p className="mt-3 text-2xl font-black text-slate-900">
              {inactiveUsers}
            </p>

            <p className="mt-1 text-[11px] font-medium text-slate-400">
              Disabled accounts
            </p>
          </div>

          {/* Customers */}

          <div
            onClick={() => setSelectedRole("USER")}
            className={`group cursor-pointer rounded-2xl border p-5 shadow-sm transition-all duration-200 hover:-translate-y-1 hover:shadow-md ${
              selectedRole === "USER"
                ? "border-blue-500 bg-white ring-2 ring-blue-500/20"
                : "border-slate-200/80 bg-white hover:border-slate-300"
            }`}
          >
            <div className="flex items-center justify-between">

              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Customers
              </span>

              <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-blue-50 text-xs">
                👤
              </span>

            </div>

            <p className="mt-3 text-2xl font-black text-slate-900">
              {customers}
            </p>

            <p className="mt-1 text-[11px] font-medium text-slate-400">
              Regular users
            </p>
          </div>

          {/* Agents */}

          <div
            onClick={() => setSelectedRole("AGENT")}
            className={`group cursor-pointer rounded-2xl border p-5 shadow-sm transition-all duration-200 hover:-translate-y-1 hover:shadow-md ${
              selectedRole === "AGENT"
                ? "border-purple-500 bg-white ring-2 ring-purple-500/20"
                : "border-slate-200/80 bg-white hover:border-slate-300"
            }`}
          >
            <div className="flex items-center justify-between">

              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Agents
              </span>

              <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-purple-50 text-xs">
                🏢
              </span>

            </div>

            <p className="mt-3 text-2xl font-black text-slate-900">
              {agents}
            </p>

            <p className="mt-1 text-[11px] font-medium text-slate-400">
              Property agents
            </p>
          </div>

        </div>

        {/* Table */}

        <section className="mt-8 overflow-hidden rounded-3xl border border-slate-200/80 bg-white shadow-sm">

          {/* Controls */}

          <div className="border-b border-slate-100 p-6">

            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">

              <div>

                <h2 className="text-xl font-black text-slate-900">

                  {selectedRole === "ALL"
                    ? "All Users"
                    : selectedRole === "USER"
                    ? "Customers"
                    : selectedRole === "AGENT"
                    ? "Agents"
                    : "Admins"}

                  {selectedStatus !== "ALL" && (
                    <span className="ml-2 text-sm font-semibold text-slate-500">
                      (
                      {selectedStatus === "ACTIVE"
                        ? "Active only"
                        : "Inactive only"}
                      )
                    </span>
                  )}

                </h2>

                <p className="mt-1 text-xs font-medium text-slate-500">
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
                    onChange={(e) =>
                      setSearchQuery(e.target.value)
                    }
                    className="w-full rounded-2xl border border-slate-200 bg-slate-50/70 px-4 py-2.5 pl-10 text-sm text-slate-900 placeholder:text-slate-400 focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition"
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

                {isFiltered && (
                  <button
                    onClick={resetFilters}
                    className="shrink-0 rounded-2xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-xs font-bold text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition"
                  >
                    Reset Filters
                  </button>
                )}

              </div>

            </div>

            {/* Filters */}

            <div className="mt-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">

              <div className="flex flex-wrap items-center gap-2">

                {[
                  {
                    id: "ALL",
                    label: "All Roles",
                    count: totalUsers,
                  },
                  {
                    id: "USER",
                    label: "Customers",
                    count: customers,
                  },
                  {
                    id: "AGENT",
                    label: "Agents",
                    count: agents,
                  },
                  {
                    id: "ADMIN",
                    label: "Admins",
                    count: admins,
                  },
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() =>
                      setSelectedRole(tab.id)
                    }
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

              </div>

              <div className="flex items-center gap-1.5 rounded-2xl border border-slate-200 bg-slate-50/70 p-1">

                {[
                  {
                    id: "ALL",
                    label: "All Status",
                  },
                  {
                    id: "ACTIVE",
                    label: "🟢 Active",
                  },
                  {
                    id: "INACTIVE",
                    label: "🔴 Inactive",
                  },
                ].map((status) => (
                  <button
                    key={status.id}
                    onClick={() =>
                      setSelectedStatus(status.id)
                    }
                    className={`rounded-xl px-3 py-1.5 text-xs font-bold transition ${
                      selectedStatus === status.id
                        ? "bg-white text-slate-900 shadow-sm"
                        : "text-slate-500 hover:text-slate-900"
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

              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-3xl bg-slate-100 text-3xl">
                👥
              </div>

              <h3 className="mt-5 text-lg font-bold text-slate-900">
                No users found
              </h3>

              <p className="mx-auto mt-2 max-w-sm text-sm text-slate-500">
                {isFiltered
                  ? "No accounts match your current filter and search criteria."
                  : "There are no registered users on the platform yet."}
              </p>

              {isFiltered && (
                <button
                  onClick={resetFilters}
                  className="mt-5 rounded-xl border border-slate-200 bg-white px-4 py-2 text-xs font-bold text-slate-700 shadow-sm hover:bg-slate-50"
                >
                  Clear All Filters
                </button>
              )}

            </div>

          ) : (

            <div className="overflow-x-auto">

              <table className="w-full min-w-[1000px] border-collapse">

                <thead>
                  <tr className="border-b border-slate-100 bg-slate-50/60 text-[11px] font-black uppercase tracking-wider text-slate-400">

                    <th className="px-6 py-4 text-left">
                      User
                    </th>

                    <th className="px-6 py-4 text-left">
                      Email Address
                    </th>

                    <th className="px-6 py-4 text-left">
                      Role
                    </th>

                    <th className="px-6 py-4 text-left">
                      Status
                    </th>

                    <th className="px-6 py-4 text-left">
                      User ID
                    </th>

                    <th className="px-6 py-4 text-left">
                      Actions
                    </th>

                  </tr>
                </thead>

                <tbody className="divide-y divide-slate-100 text-sm">

                  {filteredUsers.map((user: any) => {

                    const initials =
                      user.name
                        ?.trim()
                        ?.charAt(0)
                        ?.toUpperCase() || "U";

                    const isUserAdmin =
                      user.role === "ADMIN";

                    return (

                      <tr
                        key={user.id}
                        onClick={() =>
                          handleUserClick(user.id)
                        }
                        className="group cursor-pointer transition-colors hover:bg-blue-50/40"
                      >

                        {/* User */}

                        <td className="px-6 py-4">

                          <div className="flex items-center gap-3">

                            <div
                              className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl font-black text-sm shadow-sm ${
                                user.role === "AGENT"
                                  ? "bg-purple-100 text-purple-700 ring-4 ring-purple-50"
                                  : user.role === "ADMIN"
                                  ? "bg-red-100 text-red-700 ring-4 ring-red-50"
                                  : "bg-blue-100 text-blue-700 ring-4 ring-blue-50"
                              }`}
                            >
                              {initials}
                            </div>

                            <div>

                              <p className="font-bold text-slate-900 transition-colors group-hover:text-blue-600">
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

                          {user.isActive ? (

                            <span className="inline-flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-700 ring-1 ring-inset ring-emerald-600/20">

                              <span className="relative flex h-2 w-2">

                                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />

                                <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />

                              </span>

                              Active

                            </span>

                          ) : (

                            <span className="inline-flex items-center gap-1.5 rounded-full bg-red-50 px-3 py-1 text-xs font-bold text-red-700 ring-1 ring-inset ring-red-600/20">

                              <span className="h-2 w-2 rounded-full bg-red-500" />

                              Inactive

                            </span>

                          )}

                        </td>

                        {/* ID */}

                        <td className="px-6 py-4">

                          <span className="rounded-lg bg-slate-100 px-2.5 py-1 text-xs font-mono font-bold text-slate-500">
                            #{user.id}
                          </span>

                        </td>

                        {/* Actions */}

                        <td
                          className="px-6 py-4"
                          onClick={(e) =>
                            e.stopPropagation()
                          }
                        >

                          <div className="flex items-center gap-2">

                            {/* Activate / Deactivate */}

                            {!isUserAdmin && (
                              <ActiveDeactiveUser
                                id={user.id}
                                isActive={user.isActive}
                              />
                            )}

                            {/* Activity */}

                            <button
                              onClick={() =>
                                setActivityUserId(user.id)
                              }
                              className="inline-flex items-center gap-1.5 rounded-xl bg-slate-900 px-3 py-2 text-xs font-bold text-white shadow-sm transition hover:bg-blue-600 active:scale-95"
                            >
                              <span>📊</span>
                              Activity
                            </button>

                            {/* Delete */}

                            {!isUserAdmin && (
                              <button
                                onClick={() =>
                                  setOpendeluser(user.id)
                                }
                                className="inline-flex items-center gap-1.5 rounded-xl bg-red-600 px-3 py-2 text-xs font-bold text-white shadow-sm transition hover:bg-red-700 active:scale-95"
                              >
                                <span>🗑️</span>
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
          onClose={() =>
            setActivityUserId(null)
          }
        />
      )}

      {/* Delete Dialog */}

      {opendeluser !== null && (
        <DeleteUser
          id={opendeluser}
          open={true}
          onClose={() =>
            setOpendeluser(null)
          }
        />
      )}

    </div>
  );
};

export default UsersManage;