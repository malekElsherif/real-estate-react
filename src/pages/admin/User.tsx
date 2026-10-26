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
import {
  activePill,
  inactivePill,
  roleAvatarClass,
  roleBadgeClass,
} from "./adminBrand";

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
      <div className="flex min-h-[500px] items-center justify-center bg-stone-50">
        <div className="flex flex-col items-center gap-4">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-stone-300 border-t-amber-800" />
          <p className="text-xs uppercase tracking-widest text-stone-500 font-medium">Loading user</p>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex min-h-[500px] items-center justify-center bg-stone-50 px-4">
        <div className="w-full max-w-md rounded-2xl border border-stone-200 bg-white p-8 text-center shadow-sm">
          <h2 className="text-xl font-bold text-stone-900">Failed to load user</h2>
          <p className="mt-2 text-xs text-stone-500 leading-relaxed">
            {error instanceof Error ? error.message : "Failed to fetch user information."}
          </p>
          <button
            onClick={() => navigate("/admin/dashboard/users/manage")}
            className="mt-6 w-full rounded-xl bg-stone-900 py-2.5 text-xs font-semibold text-stone-50 hover:bg-amber-800 transition"
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
      <div className="flex min-h-[500px] items-center justify-center bg-stone-50">
        <div className="text-center">
          <h2 className="text-xl font-bold text-stone-900">User not found</h2>
          <button
            onClick={() => navigate("/admin/dashboard/users/manage")}
            className="mt-4 rounded-xl bg-stone-900 px-4 py-2.5 text-xs font-semibold text-stone-50 hover:bg-amber-800 transition"
          >
            Back to Users
          </button>
        </div>
      </div>
    );
  }

  const isAdmin = user.role === "ADMIN";
  const isAgent = user.role === "AGENT";
  const initials = user.name?.trim()?.charAt(0)?.toUpperCase() || "U";

  const handleVerifyAgent = () => {
    verifyAgent(undefined, {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["getuserbyid", userId] });
        queryClient.invalidateQueries({ queryKey: ["getallusers"] });
      },
    });
  };

  const handleRejectAgent = () => {
    rejectAgent(undefined, {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["getuserbyid", userId] });
        queryClient.invalidateQueries({ queryKey: ["getallusers"] });
      },
    });
  };

  const infoFields = [
    { label: "Full Name", value: user.name || "Not provided" },
    { label: "Email Address", value: user.email || "Not provided", breakAll: true },
    { label: "Account Role", value: user.role },
    { label: "User ID", value: `#${user.id}` },
  ];

  const tileBase =
    "group flex items-center justify-between rounded-2xl border border-stone-200 bg-white p-5 text-left transition hover:-translate-y-0.5 hover:border-amber-600 hover:shadow-md disabled:cursor-not-allowed disabled:opacity-60";

  const tileIcon =
    "flex h-11 w-11 items-center justify-center rounded-xl border text-base font-bold";

  return (
    <div className="min-h-screen bg-stone-50 pb-16 text-stone-900">
      {/* Header */}
      <header className="bg-stone-900 text-stone-50">
        <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
          <button
            onClick={() => navigate("/admin/dashboard/users/manage")}
            className="mb-6 inline-flex items-center gap-2 text-xs uppercase tracking-wider text-stone-400 hover:text-amber-500 transition font-semibold"
          >
            ← Back to Users
          </button>

          <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
            <div className="flex items-center gap-5">
              <div
                className={`flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl border border-amber-600 text-3xl font-bold ${roleAvatarClass(
                  user.role
                )}`}
              >
                {initials}
              </div>

              <div>
                <div className="flex flex-wrap items-center gap-3">
                  <h1 className="text-3xl font-bold text-stone-50">
                    {user.name || "Unknown User"}
                  </h1>

                  <span
                    className={`rounded-lg border px-2.5 py-1 text-[10px] font-semibold uppercase ${
                      isAdmin
                        ? "border-stone-700 bg-stone-800 text-stone-50"
                        : roleBadgeClass(user.role)
                    }`}
                  >
                    {user.role}
                  </span>
                </div>

                <p className="mt-2 text-[10px] uppercase tracking-wider text-stone-400 font-mono">
                  User ID #{user.id}
                </p>
              </div>
            </div>

            <div>
              {user.isActive ? (
                <span className={activePill}>
                  <span className="h-2 w-2 rounded-full bg-green-600" />
                  Active Account
                </span>
              ) : (
                <span className={inactivePill}>
                  <span className="h-2 w-2 rounded-full bg-red-600" />
                  Inactive Account
                </span>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Main */}
      <main className="mx-auto max-w-6xl px-4 pt-10 sm:px-6 lg:px-8">
        <div className="grid gap-6 lg:grid-cols-3">
          {/* User Information */}
          <section className="rounded-2xl border border-stone-200 bg-white p-7 shadow-sm lg:col-span-2">
            <div className="border-b border-stone-200 pb-5">
              <h2 className="text-xl font-bold text-stone-900">User Information</h2>
              <p className="mt-1 text-[10px] uppercase tracking-wider text-stone-500 font-semibold">
                Account details and current status
              </p>
            </div>

            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              {infoFields.map((field) => (
                <div key={field.label} className="rounded-xl border border-stone-200 bg-stone-50 p-5">
                  <p className="text-[10px] uppercase tracking-wider text-stone-500 font-semibold">{field.label}</p>
                  <p className={`mt-2 text-sm font-bold text-stone-900 ${field.breakAll ? "break-all" : ""}`}>
                    {field.value}
                  </p>
                </div>
              ))}
            </div>
          </section>

          {/* Account Status */}
          <section className="rounded-2xl border border-stone-200 bg-white p-7 shadow-sm">
            <h2 className="text-xl font-bold text-stone-900">Account Status</h2>
            <p className="mt-1 text-[10px] uppercase tracking-wider text-stone-500 font-semibold">
              Current account state
            </p>

            <div
              className={`mt-6 rounded-xl border p-5 ${
                user.isActive
                  ? "border-green-600/40 bg-green-50/50"
                  : "border-red-600/40 bg-red-50/50"
              }`}
            >
              <div className="flex items-center gap-3">
                <span
                  className={`h-3 w-3 shrink-0 rounded-full ${
                    user.isActive ? "bg-green-600" : "bg-red-600"
                  }`}
                />
                <div>
                  <p className="text-sm font-bold text-stone-900">
                    {user.isActive ? "Active" : "Inactive"}
                  </p>
                  <p className="text-xs text-stone-600 mt-0.5">
                    {user.isActive ? "User can access the platform." : "User access is currently disabled."}
                  </p>
                </div>
              </div>
            </div>

            {!isAdmin && (
              <div className="mt-5">
                <ActiveDeactiveUser id={user.id} isActive={user.isActive} />
              </div>
            )}
          </section>

          {/* Admin Actions */}
          <section className="rounded-2xl border border-stone-200 bg-white p-7 shadow-sm lg:col-span-3">
            <div className="border-b border-stone-200 pb-5">
              <h2 className="text-xl font-bold text-stone-900">User Administration</h2>
              <p className="mt-1 text-[10px] uppercase tracking-wider text-stone-500 font-semibold">
                Manage account activity and administrative actions
              </p>
            </div>

            <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {isAgent && (
                <>
                  <button
                    onClick={handleVerifyAgent}
                    disabled={isVerifyingAgent || isRejectingAgent}
                    className={`${tileBase} border-green-600/30 hover:border-green-600`}
                  >
                    <div className="flex items-center gap-4">
                      <div className={`${tileIcon} border-green-600/30 bg-green-50 text-green-700`}>
                        {isVerifyingAgent ? "…" : "✓"}
                      </div>
                      <div>
                        <p className="text-sm font-bold text-green-700">
                          {isVerifyingAgent ? "Verifying..." : "Verify Agent"}
                        </p>
                        <p className="mt-0.5 text-xs text-stone-500">Approve this agent account</p>
                      </div>
                    </div>
                    <span className="text-green-700">→</span>
                  </button>

                  <button
                    onClick={handleRejectAgent}
                    disabled={isVerifyingAgent || isRejectingAgent}
                    className={`${tileBase} border-amber-600/30 hover:border-amber-600`}
                  >
                    <div className="flex items-center gap-4">
                      <div className={`${tileIcon} border-amber-600/30 bg-amber-50 text-amber-700`}>
                        {isRejectingAgent ? "…" : "✕"}
                      </div>
                      <div>
                        <p className="text-sm font-bold text-amber-800">
                          {isRejectingAgent ? "Rejecting..." : "Reject Agent"}
                        </p>
                        <p className="mt-0.5 text-xs text-stone-500">Reject this agent account</p>
                      </div>
                    </div>
                    <span className="text-amber-700">→</span>
                  </button>
                </>
              )}

              {/* Activity */}
              <button
                onClick={() => setActivityOpen(true)}
                className={tileBase}
              >
                <div className="flex items-center gap-4">
                  <div className={`${tileIcon} border-stone-300 bg-stone-100 text-stone-900`}>
                    ≡
                  </div>
                  <div>
                    <p className="text-sm font-bold text-stone-900">Activity Report</p>
                    <p className="mt-0.5 text-xs text-stone-500">Review user activity</p>
                  </div>
                </div>
                <span className="text-stone-400 group-hover:text-amber-600 transition">→</span>
              </button>

              {/* Delete */}
              {!isAdmin && (
                <button
                  onClick={() => setDeleteOpen(true)}
                  className={`${tileBase} border-red-600/30 hover:border-red-600`}
                >
                  <div className="flex items-center gap-4">
                    <div className={`${tileIcon} border-red-600/30 bg-red-50 text-red-600`}>
                      ✕
                    </div>
                    <div>
                      <p className="text-sm font-bold text-red-600">Delete User</p>
                      <p className="mt-0.5 text-xs text-stone-500">Permanently remove account</p>
                    </div>
                  </div>
                  <span className="text-red-600">→</span>
                </button>
              )}
            </div>
          </section>

          {/* Admin Protection */}
          {isAdmin && (
            <section className="rounded-2xl border border-amber-500/40 bg-amber-50/50 p-6 shadow-sm lg:col-span-3">
              <div className="flex items-start gap-4">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-amber-600 text-lg font-bold text-amber-700 bg-white">
                  !
                </div>
                <div>
                  <h3 className="text-xl font-bold text-stone-900">Administrator Account</h3>
                  <p className="mt-1 text-xs leading-relaxed text-stone-600">
                    Administrative accounts cannot be deactivated or deleted from this interface.
                  </p>
                </div>
              </div>
            </section>
          )}
        </div>
      </main>

      {/* Activity Dialog */}
      {activityOpen && (
        <Useractivityreport id={user.id} open onClose={() => setActivityOpen(false)} />
      )}

      {/* Delete Dialog */}
      {deleteOpen && (
        <DeleteUser id={user.id} open onClose={() => setDeleteOpen(false)} />
      )}
    </div>
  );
};

export default UserAdmin;
