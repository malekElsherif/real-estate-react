import { usegetuseractivityreport } from "../../hooks/useadmin";
import { roleBadgeClass } from "./adminBrand";

type UserActivityReportProps = {
  id: number;
  open: boolean;
  onClose: () => void;
};

const UserActivityReportDialog = ({ id, open, onClose }: UserActivityReportProps) => {
  const { data, isLoading, isError, error } = usegetuseractivityreport(id);
  const report = data?.data;
  const user = report?.user;

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-stone-950/60 backdrop-blur-sm p-4">
      <div className="w-full max-w-3xl rounded-2xl border border-stone-200 bg-white shadow-xl overflow-hidden flex flex-col max-h-[85vh]">

        {/* Header */}
        <div className="flex items-center justify-between bg-stone-900 px-6 py-4 text-stone-50">
          <div>
            <p className="text-[10px] uppercase tracking-widest text-amber-500 font-semibold">Report</p>
            <h3 className="text-xl font-bold mt-0.5">User Activity Report</h3>
            <p className="text-xs text-stone-400 font-mono mt-0.5">Activity report for user #{id}</p>
          </div>
          <button
            onClick={onClose}
            aria-label="close"
            className="text-stone-400 hover:text-amber-500 transition text-sm font-bold p-1"
          >
            ✕
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 bg-stone-50 min-h-[300px]">
          {isLoading && (
            <div className="flex min-h-[250px] items-center justify-center">
              <div className="h-8 w-8 animate-spin rounded-full border-2 border-stone-300 border-t-amber-800" />
            </div>
          )}

          {isError && (
            <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-xs font-mono text-red-700">
              {error instanceof Error ? error.message : "Failed to load activity report. Please try again."}
            </div>
          )}

          {!isLoading && !isError && report && user && (
            <div className="space-y-6">
              {/* User Profile Card */}
              <div className="rounded-2xl border border-stone-200 bg-white p-6 shadow-sm">
                <div className="grid grid-cols-1 items-center gap-6 md:grid-cols-3">
                  <div className="flex items-center gap-4 md:col-span-2">
                    <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-xl bg-stone-900 text-amber-500 text-2xl font-bold">
                      {user.name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <h4 className="text-xl font-bold text-stone-900">{user.name}</h4>
                      <p className="text-xs text-stone-500 mt-0.5 mb-3">{user.email}</p>
                      <div className="flex flex-wrap items-center gap-2">
                        <span className={`rounded-lg border px-2 py-0.5 text-[10px] font-semibold uppercase ${roleBadgeClass(user.role)}`}>
                          {user.role}
                        </span>
                        <span className={`rounded-lg border px-2 py-0.5 text-[10px] font-semibold uppercase ${
                          user.isActive ? "border-green-600 bg-green-50 text-green-700" : "border-stone-300 text-stone-500"
                        }`}>
                          {user.isActive ? "Active" : "Inactive"}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Verification Box */}
                  <div className="rounded-xl border border-stone-200 bg-stone-50 p-4">
                    <div className="mb-2 flex items-center gap-2">
                      <span className={`text-sm ${user.isVerified ? "text-green-600" : "text-stone-400"}`}>✓</span>
                      <span className="text-[10px] font-semibold uppercase tracking-wider text-stone-900">Verification</span>
                    </div>
                    <p className="text-xs capitalize text-stone-600 font-mono">
                      {user.isVerified ? "Fully Verified" : "Not Verified"} • {user.verificationStatus}
                    </p>
                  </div>
                </div>
              </div>

              {/* Activity Stats Summary */}
              <div>
                <h4 className="text-lg font-bold text-stone-900 mb-4">Activity Summary</h4>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                  {[
                    { label: "Properties", value: report.properties, icon: "🏠" },
                    { label: "Purchase Requests", value: report.purchaseRequests, icon: "🛒" },
                    { label: "Rental Requests", value: report.rentalRequests, icon: "📅" },
                  ].map((stat, index) => (
                    <div
                      key={index}
                      className="rounded-2xl border border-stone-200 bg-white p-5 shadow-sm transition hover:border-amber-600"
                    >
                      <div className="text-[10px] font-semibold uppercase tracking-wider text-stone-500 mb-3 flex items-center gap-2">
                        <span>{stat.icon}</span>
                        <span>{stat.label}</span>
                      </div>
                      <div className="text-3xl font-bold text-stone-900 font-mono">
                        {stat.value}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end border-t border-stone-200 bg-white px-6 py-4">
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl border border-stone-300 bg-white px-4 py-2 text-xs font-semibold text-stone-700 hover:border-stone-900 transition"
          >
            Close
          </button>
        </div>

      </div>
    </div>
  );
};

export default UserActivityReportDialog;
