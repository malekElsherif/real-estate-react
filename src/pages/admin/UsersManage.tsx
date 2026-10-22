import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { usegetallusers } from "../../hooks/useadmin";
import ActiveDeactiveUser from "./ActiveDeactiveUser";
import Useractivityreport from "./Useractivityreport";
import DeleteUser from "./DeleteUser";
import {
  activePill,
  btnDangerSolid,
  btnDark,
  btnOutline,
  btnPad,
  btnPadSm,
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

  // =========================
  // Loading
  // =========================

  if (isLoading) {
    return (
      <div className="flex min-h-[500px] items-center justify-center bg-[#FFFDF9]">
        <div className="flex flex-col items-center gap-4">
          <div className="h-10 w-10 animate-spin rounded-full border-2 border-[#14213D]/15 border-t-[#B8863B]" />
          <p className="eyebrow text-[#14213D]/70">Loading users</p>
        </div>
      </div>
    );
  }

  // =========================
  // Error
  // =========================

  if (isError) {
    return (
      <div className="flex min-h-[500px] items-center justify-center bg-[#FFFDF9] px-4">
        <div className="w-full max-w-md border border-[#14213D]/15 bg-white p-8 text-center">
          <div className="mx-auto h-px w-10 bg-[#B8863B]" />

          <h2 className="font-heading mt-5 text-2xl font-semibold text-[#14213D]">
            Failed to load users
          </h2>

          <p className="mt-2 text-xs leading-relaxed text-[#14213D]/60">
            {error instanceof Error
              ? error.message
              : "Something went wrong while loading users."}
          </p>

          <button
            onClick={() => refetch()}
            className={`eyebrow mt-6 w-full bg-[#B8863B] ${btnPad} font-semibold text-white transition hover:bg-[#a37632]`}
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

  const agents = users.filter((user: any) => user.role === "AGENT").length;
  const customers = users.filter((user: any) => user.role === "USER").length;
  const admins = users.filter((user: any) => user.role === "ADMIN").length;

  const activeUsers = users.filter((user: any) => user.isActive === true).length;
  const inactiveUsers = users.filter((user: any) => user.isActive === false).length;

  const activeRate =
    totalUsers > 0 ? Math.round((activeUsers / totalUsers) * 100) : 0;

  // =========================
  // Filtering
  // =========================

  const filteredUsers = users.filter((user: any) => {
    const matchesRole =
      selectedRole === "ALL" ? true : user.role === selectedRole;

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

  // Stat cards: each one either filters by role or by status
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

  // =========================
  // UI
  // =========================

  return (
    <div className="min-h-screen bg-[#FFFDF9] pb-16 text-[#14213D]">
      {/* Header */}
      <header className="bg-[#14213D]">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="eyebrow text-[#B8863B]">Admin Console</p>

              <div className="mt-2 flex flex-wrap items-center gap-3">
                <h1 className="font-heading text-3xl font-semibold text-[#FFFDF9] sm:text-4xl">
                  User Management
                </h1>

                <span className="eyebrow border border-[#B8863B]/50 px-2.5 py-1 text-[#B8863B]">
                  {totalUsers} Accounts
                </span>
              </div>

              <p className="mt-2 max-w-xl text-xs leading-relaxed text-[#FFFDF9]/60">
                Manage all registered users, monitor active sessions, update
                account status, and review user activity reports.
              </p>
            </div>

            {/* Quick Summary */}
            <div className="flex flex-wrap items-center gap-3">
              <div className="border border-[#FFFDF9]/20 px-5 py-3">
                <p className="eyebrow text-[#FFFDF9]/55">Active Rate</p>
                <p className="font-heading mt-1 text-2xl font-semibold text-[#B8863B]">
                  {activeRate}%{" "}
                  <span className="font-data text-xs font-normal text-[#FFFDF9]/50">
                    ({activeUsers}/{totalUsers})
                  </span>
                </p>
              </div>

              <div className="bg-[#B8863B] px-5 py-3 text-white">
                <p className="eyebrow text-white/80">Total Accounts</p>
                <p className="font-heading mt-1 text-2xl font-semibold">
                  {totalUsers}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="h-px bg-gradient-to-r from-transparent via-[#B8863B] to-transparent" />
      </header>

      {/* Main */}
      <main className="mx-auto max-w-7xl px-4 pt-10 sm:px-6 lg:px-8">
        {/* Statistics */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {statCards.map((card) => (
            <div
              key={card.title}
              onClick={card.onClick}
              className={`group cursor-pointer border bg-white p-5 transition hover:-translate-y-1 hover:shadow-[0_12px_30px_-12px_rgba(20,33,61,0.25)] ${
                card.selected
                  ? "border-[#B8863B] shadow-[inset_0_-3px_0_#B8863B]"
                  : "border-[#14213D]/15 hover:border-[#B8863B]"
              }`}
            >
              <p className="eyebrow text-[#14213D]/55">{card.title}</p>

              <p className="font-heading mt-3 text-4xl font-semibold text-[#14213D]">
                {card.value}
              </p>

              <div className="mt-4 h-px w-8 bg-[#B8863B] transition-all group-hover:w-14" />

              <p className="mt-2 text-[11px] text-[#14213D]/55">{card.info}</p>
            </div>
          ))}
        </div>

        {/* Table */}
        <section className="mt-10 overflow-hidden border border-[#14213D] bg-[#FFFDF9]">
          {/* Controls */}
          <div className="border-b border-[#E4DFD3] p-6">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <h2 className="font-heading text-2xl font-semibold text-[#14213D]">
                  {selectedRole === "ALL"
                    ? "All Users"
                    : selectedRole === "USER"
                    ? "Customers"
                    : selectedRole === "AGENT"
                    ? "Agents"
                    : "Admins"}

                  {selectedStatus !== "ALL" && (
                    <span className="font-data ml-2 text-xs font-normal text-[#B8863B]">
                      (
                      {selectedStatus === "ACTIVE"
                        ? "Active only"
                        : "Inactive only"}
                      )
                    </span>
                  )}
                </h2>

                <p className="eyebrow mt-1 text-[#14213D]/45">
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
                      className="absolute right-3 top-2.5 flex h-5 w-5 items-center justify-center text-[10px] text-[#14213D]/60 hover:text-[#B8863B]"
                    >
                      ✕
                    </button>
                  )}
                </div>

                {isFiltered && (
                  <button
                    onClick={resetFilters}
                    className={`shrink-0 ${btnPad} ${btnOutline}`}
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
              </div>

              <div className="flex items-center border border-[#E4DFD3]">
                {statusTabs.map((status) => (
                  <button
                    key={status.id}
                    onClick={() => setSelectedStatus(status.id)}
                    className={`eyebrow px-3 py-2 font-semibold transition ${
                      selectedStatus === status.id
                        ? "bg-[#B8863B] text-white"
                        : "text-[#14213D]/60 hover:text-[#14213D]"
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
              <div className="mx-auto h-px w-10 bg-[#B8863B]" />

              <h3 className="font-heading mt-5 text-2xl font-semibold text-[#14213D]">
                No users found
              </h3>

              <p className="mx-auto mt-2 max-w-sm text-xs leading-relaxed text-[#4A5568]">
                {isFiltered
                  ? "No accounts match your current filter and search criteria."
                  : "There are no registered users on the platform yet."}
              </p>

              {isFiltered && (
                <button
                  onClick={resetFilters}
                  className={`mt-5 ${btnPad} ${btnOutline}`}
                >
                  Clear All Filters
                </button>
              )}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[1000px] border-collapse">
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
                        onClick={() => handleUserClick(user.id)}
                        className="group cursor-pointer transition-colors hover:bg-[#EFEAE0]/30"
                      >
                        {/* User */}
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
                          {user.isActive ? (
                            <span className={activePill}>
                              <span className="relative flex h-2 w-2">
                                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#5B7B65] opacity-60" />
                                <span className="relative inline-flex h-2 w-2 rounded-full bg-[#5B7B65]" />
                              </span>
                              Active
                            </span>
                          ) : (
                            <span className={inactivePill}>
                              <span className="h-2 w-2 rounded-full bg-[#B8452E]" />
                              Inactive
                            </span>
                          )}
                        </td>

                        {/* ID */}
                        <td className="px-6 py-4">
                          <span className="bg-[#14213D]/10 px-2.5 py-1 text-[10px] font-semibold text-[#14213D]/70">
                            #{user.id}
                          </span>
                        </td>

                        {/* Actions */}
                        <td
                          className="px-6 py-4"
                          onClick={(e) => e.stopPropagation()}
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
                              onClick={() => setActivityUserId(user.id)}
                              className={`${btnPadSm} ${btnDark}`}
                            >
                              Activity
                            </button>

                            {/* Delete */}
                            {!isUserAdmin && (
                              <button
                                onClick={() => setOpendeluser(user.id)}
                                className={`${btnPadSm} ${btnDangerSolid}`}
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
