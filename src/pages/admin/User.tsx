import { useParams, useNavigate } from "react-router-dom";
import { useState } from "react";
import { usegetuserbyid } from "../../hooks/useUsers";
import ActiveDeactiveUser from "./ActiveDeactiveUser";
import Useractivityreport from "./Useractivityreport";
import DeleteUser from "./DeleteUser";
import {
   
  userejectagent,
  useverifyagent,
} from "../../hooks/useadmin";
import { useQueryClient } from "@tanstack/react-query";

const UserAdmin = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [activityOpen, setActivityOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);

  const userId = Number(id);

  const {
    data,
    isLoading,
    isError,
    error,
  } = usegetuserbyid(userId);

  const {
    mutate: verifyAgent,
    isPending: isVerifyingAgent,
  } = useverifyagent(userId);

  const {
    mutate: rejectAgent,
    isPending: isRejectingAgent,
  } = userejectagent(userId);


  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50">
        <div className="flex flex-col items-center gap-4">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-slate-200 border-t-blue-600" />

          <p className="text-sm font-semibold text-slate-500">
            Loading user...
          </p>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4">
        <div className="w-full max-w-md rounded-3xl border border-red-100 bg-white p-8 text-center shadow-lg">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-red-50 text-2xl">
            ⚠️
          </div>

          <h2 className="mt-5 text-xl font-black text-slate-900">
            Failed to load user
          </h2>

          <p className="mt-2 text-sm text-slate-500">
            {error instanceof Error
              ? error.message
              : "Failed to fetch user information."}
          </p>

          <button
            onClick={() =>
              navigate("/admin/dashboard/users/manage")
            }
            className="mt-6 rounded-xl bg-slate-900 px-5 py-2.5 text-xs font-bold text-white transition hover:bg-blue-600"
          >
            Back to Users
          </button>
        </div>
      </div>
    );
  }

  const user = data?.data ?? data;

  if (!user) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50">
        <div className="text-center">
          <p className="text-lg font-bold text-slate-900">
            User not found
          </p>

          <button
            onClick={() =>
              navigate("/admin/dashboard/users/manage")
            }
            className="mt-4 rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-bold text-white"
          >
            Back to Users
          </button>
        </div>
      </div>
    );
  }

  const isAdmin = user.role === "ADMIN";
  const isAgent = user.role === "AGENT";

  const initials =
    user.name?.trim()?.charAt(0)?.toUpperCase() || "U";

  const handleVerifyAgent = () => {
    verifyAgent(undefined, {
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: ["getuserbyid", userId],
        });

        queryClient.invalidateQueries({
          queryKey: ["getallusers"],
        });
      },
    });
  };

  const handleRejectAgent = () => {
    rejectAgent(undefined, {
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: ["getuserbyid", userId],
        });

        queryClient.invalidateQueries({
          queryKey: ["getallusers"],
        });
      },
    });
  };

  return (
    <div className="min-h-screen bg-slate-50/60 pb-16">

      {/* Header */}
      <header className="border-b border-slate-200/80 bg-white">
        <div className="mx-auto max-w-6xl px-4 py-6 sm:px-6 lg:px-8">

          <button
            onClick={() =>
              navigate("/admin/dashboard/users/manage")
            }
            className="mb-5 inline-flex items-center gap-2 text-sm font-bold text-slate-500 transition hover:text-blue-600"
          >
            ← Back to Users
          </button>

          <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">

            <div className="flex items-center gap-4">

              {/* Avatar */}
              <div
                className={`flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl text-xl font-black shadow-sm ${
                  isAgent
                    ? "bg-purple-100 text-purple-700 ring-4 ring-purple-50"
                    : isAdmin
                    ? "bg-red-100 text-red-700 ring-4 ring-red-50"
                    : "bg-blue-100 text-blue-700 ring-4 ring-blue-50"
                }`}
              >
                {initials}
              </div>

              <div>
                <div className="flex flex-wrap items-center gap-2">

                  <h1 className="text-2xl font-black tracking-tight text-slate-900">
                    {user.name || "Unknown User"}
                  </h1>

                  <span
                    className={`rounded-full px-3 py-1 text-[11px] font-bold ${
                      isAgent
                        ? "bg-purple-50 text-purple-700"
                        : isAdmin
                        ? "bg-red-50 text-red-700"
                        : "bg-blue-50 text-blue-700"
                    }`}
                  >
                    {user.role}
                  </span>

                </div>

                <p className="mt-1 text-sm text-slate-500">
                  User ID #{user.id}
                </p>
              </div>

            </div>

            {/* Status */}
            <div>
              {user.isActive ? (
                <span className="inline-flex items-center gap-2 rounded-full bg-emerald-50 px-4 py-2 text-xs font-bold text-emerald-700 ring-1 ring-inset ring-emerald-600/20">
                  <span className="h-2 w-2 rounded-full bg-emerald-500" />
                  Active Account
                </span>
              ) : (
                <span className="inline-flex items-center gap-2 rounded-full bg-red-50 px-4 py-2 text-xs font-bold text-red-700 ring-1 ring-inset ring-red-600/20">
                  <span className="h-2 w-2 rounded-full bg-red-500" />
                  Inactive Account
                </span>
              )}
            </div>

          </div>
        </div>
      </header>

      {/* Main */}
      <main className="mx-auto max-w-6xl px-4 pt-8 sm:px-6 lg:px-8">

        <div className="grid gap-6 lg:grid-cols-3">

          {/* User Information */}
          <section className="rounded-3xl border border-slate-200/80 bg-white p-6 shadow-sm lg:col-span-2">

            <div className="border-b border-slate-100 pb-5">

              <h2 className="text-lg font-black text-slate-900">
                User Information
              </h2>

              <p className="mt-1 text-xs font-medium text-slate-400">
                Account details and current status
              </p>

            </div>

            <div className="mt-6 grid gap-5 sm:grid-cols-2">

              {/* Name */}
              <div className="rounded-2xl border border-slate-100 bg-slate-50/60 p-5">
                <p className="text-[10px] font-black uppercase tracking-wider text-slate-400">
                  Full Name
                </p>

                <p className="mt-2 text-sm font-bold text-slate-900">
                  {user.name || "Not provided"}
                </p>
              </div>

              {/* Email */}
              <div className="rounded-2xl border border-slate-100 bg-slate-50/60 p-5">
                <p className="text-[10px] font-black uppercase tracking-wider text-slate-400">
                  Email Address
                </p>

                <p className="mt-2 break-all text-sm font-bold text-slate-900">
                  {user.email || "Not provided"}
                </p>
              </div>

              {/* Role */}
              <div className="rounded-2xl border border-slate-100 bg-slate-50/60 p-5">
                <p className="text-[10px] font-black uppercase tracking-wider text-slate-400">
                  Account Role
                </p>

                <p className="mt-2 text-sm font-bold text-slate-900">
                  {user.role}
                </p>
              </div>

              {/* ID */}
              <div className="rounded-2xl border border-slate-100 bg-slate-50/60 p-5">
                <p className="text-[10px] font-black uppercase tracking-wider text-slate-400">
                  User ID
                </p>

                <p className="mt-2 font-mono text-sm font-bold text-slate-900">
                  #{user.id}
                </p>
              </div>

            </div>
          </section>

          {/* Account Status */}
          <section className="rounded-3xl border border-slate-200/80 bg-white p-6 shadow-sm">

            <h2 className="text-lg font-black text-slate-900">
              Account Status
            </h2>

            <p className="mt-1 text-xs font-medium text-slate-400">
              Current account state
            </p>

            <div
              className={`mt-6 rounded-2xl p-5 ${
                user.isActive
                  ? "bg-emerald-50"
                  : "bg-red-50"
              }`}
            >
              <div className="flex items-center gap-3">

                <div
                  className={`flex h-10 w-10 items-center justify-center rounded-xl ${
                    user.isActive
                      ? "bg-emerald-100"
                      : "bg-red-100"
                  }`}
                >
                  {user.isActive ? "🟢" : "🔴"}
                </div>

                <div>

                  <p className="text-sm font-black text-slate-900">
                    {user.isActive ? "Active" : "Inactive"}
                  </p>

                  <p className="text-xs text-slate-500">
                    {user.isActive
                      ? "User can access the platform."
                      : "User access is currently disabled."}
                  </p>

                </div>

              </div>
            </div>

            {!isAdmin && (
              <div className="mt-5">
                <ActiveDeactiveUser
                  id={user.id}
                  isActive={user.isActive}
                />
              </div>
            )}

          </section>

          {/* Admin Actions */}
          <section className="rounded-3xl border border-slate-200/80 bg-white p-6 shadow-sm lg:col-span-3">

            <div className="border-b border-slate-100 pb-5">

              <h2 className="text-lg font-black text-slate-900">
                User Administration
              </h2>

              <p className="mt-1 text-xs font-medium text-slate-400">
                Manage account activity and administrative actions
              </p>

            </div>

            <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">

              {/* Verify / Reject Agent */}
              {isAgent && (
                <>
                  <button
                    onClick={handleVerifyAgent}
                    disabled={isVerifyingAgent || isRejectingAgent}
                    className="group flex items-center justify-between rounded-2xl border border-purple-100 bg-purple-50/40 p-5 text-left transition hover:-translate-y-0.5 hover:border-purple-300 hover:bg-purple-50 hover:shadow-sm disabled:cursor-not-allowed disabled:opacity-60"
                  >

                    <div className="flex items-center gap-4">

                      <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-purple-100 text-lg">
                        {isVerifyingAgent ? "⏳" : "✓"}
                      </div>

                      <div>

                        <p className="text-sm font-black text-purple-700">
                          {isVerifyingAgent
                            ? "Verifying..."
                            : "Verify Agent"}
                        </p>

                        <p className="mt-1 text-xs text-purple-400">
                          Approve this agent account
                        </p>

                      </div>

                    </div>

                    <span className="text-purple-400">
                      →
                    </span>

                  </button>

                  <button
                    onClick={handleRejectAgent}
                    disabled={isVerifyingAgent || isRejectingAgent}
                    className="group flex items-center justify-between rounded-2xl border border-orange-100 bg-orange-50/40 p-5 text-left transition hover:-translate-y-0.5 hover:border-orange-300 hover:bg-orange-50 hover:shadow-sm disabled:cursor-not-allowed disabled:opacity-60"
                  >

                    <div className="flex items-center gap-4">

                      <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-orange-100 text-lg">
                        {isRejectingAgent ? "⏳" : "✕"}
                      </div>

                      <div>

                        <p className="text-sm font-black text-orange-700">
                          {isRejectingAgent
                            ? "Rejecting..."
                            : "Reject Agent"}
                        </p>

                        <p className="mt-1 text-xs text-orange-400">
                          Reject this agent account
                        </p>

                      </div>

                    </div>

                    <span className="text-orange-400">
                      →
                    </span>

                  </button>
                </>
              )}

              {/* Activity */}
              <button
                onClick={() => setActivityOpen(true)}
                className="group flex items-center justify-between rounded-2xl border border-slate-200 bg-white p-5 text-left transition hover:-translate-y-0.5 hover:border-blue-300 hover:bg-blue-50/40 hover:shadow-sm"
              >

                <div className="flex items-center gap-4">

                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-slate-100 text-lg transition group-hover:bg-blue-100">
                    📊
                  </div>

                  <div>

                    <p className="text-sm font-black text-slate-900">
                      Activity Report
                    </p>

                    <p className="mt-1 text-xs text-slate-400">
                      Review user activity
                    </p>

                  </div>

                </div>

                <span className="text-slate-400">
                  →
                </span>

              </button>

              {/* Delete */}
              {!isAdmin && (
                <button
                  onClick={() => setDeleteOpen(true)}
                  className="group flex items-center justify-between rounded-2xl border border-red-100 bg-red-50/40 p-5 text-left transition hover:-translate-y-0.5 hover:border-red-300 hover:bg-red-50 hover:shadow-sm"
                >

                  <div className="flex items-center gap-4">

                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-red-100 text-lg">
                      🗑️
                    </div>

                    <div>

                      <p className="text-sm font-black text-red-700">
                        Delete User
                      </p>

                      <p className="mt-1 text-xs text-red-400">
                        Permanently remove account
                      </p>

                    </div>

                  </div>

                  <span className="text-red-400">
                    →
                  </span>

                </button>
              )}

            </div>
          </section>

          {/* Admin Protection */}
          {isAdmin && (
            <section className="rounded-3xl border border-red-100 bg-red-50/50 p-6 lg:col-span-3">

              <div className="flex items-start gap-4">

                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-red-100">
                  🛡️
                </div>

                <div>

                  <h3 className="text-sm font-black text-slate-900">
                    Administrator Account
                  </h3>

                  <p className="mt-1 text-xs leading-5 text-slate-500">
                    Administrative accounts cannot be deactivated or
                    deleted from this interface.
                  </p>

                </div>

              </div>

            </section>
          )}

        </div>
      </main>

      {/* Activity Dialog */}
      {activityOpen && (
        <Useractivityreport
          id={user.id}
          open={true}
          onClose={() => setActivityOpen(false)}
        />
      )}

      {/* Delete Dialog */}
      {deleteOpen && (
        <DeleteUser
          id={user.id}
          open={true}
          onClose={() => setDeleteOpen(false)}
        />
      )}

    </div>
  );
};

export default UserAdmin;