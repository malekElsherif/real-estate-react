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
  btnDark,
  btnPad,
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
      <div className="flex min-h-[500px] items-center justify-center bg-[#FFFDF9]">
        <div className="flex flex-col items-center gap-4">
          <div className="h-10 w-10 animate-spin rounded-full border-2 border-[#14213D]/15 border-t-[#B8863B]" />

          <p className="eyebrow text-[#14213D]/70">Loading user</p>
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
            Failed to load user
          </h2>

          <p className="mt-2 text-xs leading-relaxed text-[#14213D]/60">
            {error instanceof Error
              ? error.message
              : "Failed to fetch user information."}
          </p>

          <button
            onClick={() => navigate("/admin/dashboard/users/manage")}
            className={`mt-6 ${btnPad} ${btnDark}`}
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
      <div className="flex min-h-[500px] items-center justify-center bg-[#FFFDF9]">
        <div className="text-center">
          <p className="font-heading text-2xl font-semibold text-[#14213D]">
            User not found
          </p>

          <button
            onClick={() => navigate("/admin/dashboard/users/manage")}
            className={`mt-4 ${btnPad} ${btnDark}`}
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

  const infoFields = [
    { label: "Full Name", value: user.name || "Not provided" },
    { label: "Email Address", value: user.email || "Not provided", breakAll: true },
    { label: "Account Role", value: user.role },
    { label: "User ID", value: `#${user.id}` },
  ];

  // Shared look for the admin action tiles
  const tileBase =
    "group flex items-center justify-between border bg-white p-5 text-left transition hover:-translate-y-0.5 hover:shadow-[0_12px_30px_-12px_rgba(20,33,61,0.25)] disabled:cursor-not-allowed disabled:opacity-60";

  const tileIcon =
    "font-heading flex h-11 w-11 items-center justify-center border text-lg";

  return (
    <div className="min-h-screen bg-[#FFFDF9] pb-16 text-[#14213D]">
      {/* Header */}
      <header className="bg-[#14213D]">
        <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
          <button
            onClick={() => navigate("/admin/dashboard/users/manage")}
            className="eyebrow mb-6 inline-flex items-center gap-2 text-[#FFFDF9]/60 transition hover:text-[#B8863B]"
          >
            ← Back to Users
          </button>

          <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
            <div className="flex items-center gap-5">
              {/* Avatar */}
              <div
                className={`font-heading flex h-16 w-16 shrink-0 items-center justify-center border border-[#B8863B] text-3xl font-semibold ${roleAvatarClass(
                  user.role
                )}`}
              >
                {initials}
              </div>

              <div>
                <div className="flex flex-wrap items-center gap-3">
                  <h1 className="font-heading text-3xl font-semibold text-[#FFFDF9]">
                    {user.name || "Unknown User"}
                  </h1>

                  <span
                    className={`eyebrow border px-2.5 py-1 font-semibold ${
                      isAdmin
                        ? "border-[#FFFDF9]/40 text-[#FFFDF9]"
                        : roleBadgeClass(user.role)
                    }`}
                  >
                    {user.role}
                  </span>
                </div>

                <p className="eyebrow mt-2 text-[#FFFDF9]/50">
                  User ID #{user.id}
                </p>
              </div>
            </div>

            {/* Status */}
            <div>
              {user.isActive ? (
                <span className={activePill}>
                  <span className="h-2 w-2 rounded-full bg-[#5B7B65]" />
                  Active Account
                </span>
              ) : (
                <span className={inactivePill}>
                  <span className="h-2 w-2 rounded-full bg-[#B8452E]" />
                  Inactive Account
                </span>
              )}
            </div>
          </div>
        </div>

        <div className="h-px bg-gradient-to-r from-transparent via-[#B8863B] to-transparent" />
      </header>

      {/* Main */}
      <main className="mx-auto max-w-6xl px-4 pt-10 sm:px-6 lg:px-8">
        <div className="grid gap-6 lg:grid-cols-3">
          {/* User Information */}
          <section className="border border-[#14213D]/15 bg-white p-7 lg:col-span-2">
            <div className="border-b border-[#E4DFD3] pb-5">
              <h2 className="font-heading text-2xl font-semibold">
                User Information
              </h2>

              <p className="eyebrow mt-1 text-[#14213D]/45">
                Account details and current status
              </p>
            </div>

            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              {infoFields.map((field) => (
                <div
                  key={field.label}
                  className="border border-[#E4DFD3] bg-[#FFFDF9] p-5"
                >
                  <p className="eyebrow text-[#14213D]/50">{field.label}</p>

                  <p
                    className={`mt-2 text-sm font-semibold text-[#14213D] ${
                      field.breakAll ? "break-all" : ""
                    }`}
                  >
                    {field.value}
                  </p>
                </div>
              ))}
            </div>
          </section>

          {/* Account Status */}
          <section className="border border-[#14213D]/15 bg-white p-7">
            <h2 className="font-heading text-2xl font-semibold">
              Account Status
            </h2>

            <p className="eyebrow mt-1 text-[#14213D]/45">
              Current account state
            </p>

            <div
              className={`mt-6 border p-5 ${
                user.isActive
                  ? "border-[#5B7B65]/50 bg-[#5B7B65]/10"
                  : "border-[#B8452E]/50 bg-[#B8452E]/10"
              }`}
            >
              <div className="flex items-center gap-3">
                <span
                  className={`h-3 w-3 shrink-0 rounded-full ${
                    user.isActive ? "bg-[#5B7B65]" : "bg-[#B8452E]"
                  }`}
                />

                <div>
                  <p className="font-heading text-lg font-semibold">
                    {user.isActive ? "Active" : "Inactive"}
                  </p>

                  <p className="text-xs text-[#4A5568]">
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
          <section className="border border-[#14213D]/15 bg-white p-7 lg:col-span-3">
            <div className="border-b border-[#E4DFD3] pb-5">
              <h2 className="font-heading text-2xl font-semibold">
                User Administration
              </h2>

              <p className="eyebrow mt-1 text-[#14213D]/45">
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
                    className={`${tileBase} border-[#5B7B65]/40 hover:border-[#5B7B65]`}
                  >
                    <div className="flex items-center gap-4">
                      <div
                        className={`${tileIcon} border-[#5B7B65]/40 bg-[#5B7B65]/10 text-[#5B7B65]`}
                      >
                        {isVerifyingAgent ? "…" : "✓"}
                      </div>

                      <div>
                        <p className="text-sm font-semibold text-[#5B7B65]">
                          {isVerifyingAgent ? "Verifying..." : "Verify Agent"}
                        </p>

                        <p className="mt-1 text-[11px] text-[#4A5568]">
                          Approve this agent account
                        </p>
                      </div>
                    </div>

                    <span className="text-[#5B7B65]">→</span>
                  </button>

                  <button
                    onClick={handleRejectAgent}
                    disabled={isVerifyingAgent || isRejectingAgent}
                    className={`${tileBase} border-[#B8863B]/40 hover:border-[#B8863B]`}
                  >
                    <div className="flex items-center gap-4">
                      <div
                        className={`${tileIcon} border-[#B8863B]/40 bg-[#B8863B]/10 text-[#B8863B]`}
                      >
                        {isRejectingAgent ? "…" : "✕"}
                      </div>

                      <div>
                        <p className="text-sm font-semibold text-[#B8863B]">
                          {isRejectingAgent ? "Rejecting..." : "Reject Agent"}
                        </p>

                        <p className="mt-1 text-[11px] text-[#4A5568]">
                          Reject this agent account
                        </p>
                      </div>
                    </div>

                    <span className="text-[#B8863B]">→</span>
                  </button>
                </>
              )}

              {/* Activity */}
              <button
                onClick={() => setActivityOpen(true)}
                className={`${tileBase} border-[#14213D]/20 hover:border-[#B8863B]`}
              >
                <div className="flex items-center gap-4">
                  <div
                    className={`${tileIcon} border-[#14213D]/20 bg-[#14213D] text-[#B8863B]`}
                  >
                    ≡
                  </div>

                  <div>
                    <p className="text-sm font-semibold text-[#14213D]">
                      Activity Report
                    </p>

                    <p className="mt-1 text-[11px] text-[#4A5568]">
                      Review user activity
                    </p>
                  </div>
                </div>

                <span className="text-[#14213D]/50 transition group-hover:text-[#B8863B]">
                  →
                </span>
              </button>

              {/* Delete */}
              {!isAdmin && (
                <button
                  onClick={() => setDeleteOpen(true)}
                  className={`${tileBase} border-[#B8452E]/40 hover:border-[#B8452E]`}
                >
                  <div className="flex items-center gap-4">
                    <div
                      className={`${tileIcon} border-[#B8452E]/40 bg-[#B8452E]/10 text-[#B8452E]`}
                    >
                      ✕
                    </div>

                    <div>
                      <p className="text-sm font-semibold text-[#B8452E]">
                        Delete User
                      </p>

                      <p className="mt-1 text-[11px] text-[#4A5568]">
                        Permanently remove account
                      </p>
                    </div>
                  </div>

                  <span className="text-[#B8452E]">→</span>
                </button>
              )}
            </div>
          </section>

          {/* Admin Protection */}
          {isAdmin && (
            <section className="border border-[#B8863B]/50 bg-[#B8863B]/10 p-6 lg:col-span-3">
              <div className="flex items-start gap-4">
                <div className="font-heading flex h-11 w-11 shrink-0 items-center justify-center border border-[#B8863B] text-lg text-[#B8863B]">
                  !
                </div>

                <div>
                  <h3 className="font-heading text-xl font-semibold">
                    Administrator Account
                  </h3>

                  <p className="mt-1 text-xs leading-relaxed text-[#4A5568]">
                    Administrative accounts cannot be deactivated or deleted
                    from this interface.
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
