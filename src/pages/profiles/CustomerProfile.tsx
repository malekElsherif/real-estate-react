import { useParams, useNavigate } from "react-router-dom";
import { usegetuserbyid } from "../../hooks/useUsers";

const btnPrimary = "no-underline rounded-xl bg-amber-800 px-5 py-2.5 text-xs font-medium text-white transition hover:bg-amber-900";

const CustomerProfile = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const userId = Number(id);

  const {
    data,
    isLoading,
    isError,
  } = usegetuserbyid(userId);

  const user = data?.data;

  if (isLoading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center rounded-2xl border border-stone-100 bg-white">
        <div className="text-center">
          <div className="mx-auto h-8 w-8 animate-spin rounded-full border-2 border-stone-200 border-t-amber-800" />
          <p className="mt-3 text-xs text-stone-500">
            Loading customer profile...
          </p>
        </div>
      </div>
    );
  }

  if (isError || !user) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center rounded-2xl border border-rose-100 bg-white p-6 text-center shadow-sm">
        <div>
          <span className="text-3xl">👤</span>
          <h2 className="mt-2 text-lg font-semibold text-rose-600">
            Customer Not Found
          </h2>
          <p className="mt-1 text-xs text-stone-500">
            We couldn't load this customer's profile.
          </p>
          <button
            type="button"
            onClick={() => navigate(-1)}
            className={`mt-5 ${btnPrimary} cursor-pointer`}
          >
            ← Go Back
          </button>
        </div>
      </div>
    );
  }

  const name = user.name || user.username || "Customer";
  const firstLetter = name.charAt(0).toUpperCase();

  const personalInfo = [
    { label: "Full Name", value: user.name || user.username || "Not provided" },
    { label: "Username", value: user.username || "Not provided" },
    { label: "Email Address", value: user.email || "Not provided", truncate: true },
  ];

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 border-b border-stone-200 pb-5 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <span className="text-xs font-medium uppercase tracking-wider text-amber-800">
            Customer Directory
          </span>
          <h1 className="text-2xl font-bold tracking-tight text-stone-900">
            Customer Profile
          </h1>
          <p className="mt-1 text-xs text-stone-500">
            View customer details and manage communication.
          </p>
        </div>

        {/* Action Button */}
        <button
          type="button"
          onClick={() => navigate(`/chat/${user.userId || user.id}`)}
          className={`flex items-center justify-center gap-2 cursor-pointer ${btnPrimary}`}
        >
          <span>💬</span>
          <span>Chat with Customer</span>
        </button>
      </div>

      {/* Main Profile Header Card */}
      <div className="overflow-hidden rounded-2xl border border-stone-100 bg-white shadow-sm">
        <div className="relative h-28 bg-stone-900 sm:h-32">
          <div className="absolute -bottom-6 left-6 sm:left-8">
            <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-amber-800 text-2xl font-bold text-white shadow-md">
              {firstLetter}
            </div>
          </div>
        </div>

        <div className="px-6 pb-6 pt-10 sm:px-8">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-2xl font-bold text-stone-900">
                {name}
              </h2>
              <p className="mt-0.5 text-xs text-stone-500">
                {user.email || "No email provided"}
              </p>
            </div>

            <div className="flex items-center gap-2">
              <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-700">
                ● Active Customer
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Details Sections Grid */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Personal Information */}
        <section className="space-y-4 rounded-2xl border border-stone-100 bg-white p-6 shadow-sm">
          <div className="flex items-center gap-3 border-b border-stone-100 pb-3">
            <span className="text-lg">👤</span>
            <div>
              <h2 className="font-semibold text-stone-900">
                Personal Information
              </h2>
              <p className="text-xs text-stone-500">
                Contact and identification details
              </p>
            </div>
          </div>

          <div className="space-y-3 text-xs">
            {personalInfo.map((info, idx) => (
              <div key={idx} className="rounded-xl border border-stone-100 bg-stone-50 p-3.5">
                <p className="text-[10px] font-medium uppercase tracking-wider text-stone-400">
                  {info.label}
                </p>
                <p className={`mt-1 font-semibold text-stone-900 ${info.truncate ? "break-all" : ""}`}>
                  {info.value}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Account Information */}
        <section className="space-y-4 rounded-2xl border border-stone-100 bg-white p-6 shadow-sm">
          <div className="flex items-center gap-3 border-b border-stone-100 pb-3">
            <span className="text-lg">🛡️</span>
            <div>
              <h2 className="font-semibold text-stone-900">
                Account Information
              </h2>
              <p className="text-xs text-stone-500">
                Platform status & permission scope
              </p>
            </div>
          </div>

          <div className="space-y-3 text-xs">
            <div className="flex items-center justify-between rounded-xl border border-stone-100 bg-stone-50 p-3.5">
              <div>
                <p className="text-[10px] font-medium uppercase tracking-wider text-stone-400">
                  Account Status
                </p>
                <p className="mt-1 font-semibold text-stone-900">Active</p>
              </div>
              <span className="rounded-full bg-emerald-100 px-2.5 py-1 text-[10px] font-medium uppercase text-emerald-800">
                Verified
              </span>
            </div>

            <div className="rounded-xl border border-stone-100 bg-stone-50 p-3.5">
              <p className="text-[10px] font-medium uppercase tracking-wider text-stone-400">
                Role
              </p>
              <p className="mt-1 font-semibold capitalize text-amber-800">
                {user.role || "Customer"}
              </p>
            </div>
          </div>
        </section>
      </div>

      {/* Footer Contact Banner */}
      <section className="rounded-3xl border border-stone-100 bg-white p-6 shadow-sm sm:p-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <span className="text-xs font-medium uppercase tracking-wider text-amber-800">
              Direct Communication
            </span>
            <h2 className="text-lg font-bold text-stone-900">
              Need to discuss property requests?
            </h2>
            <p className="mt-0.5 text-xs text-stone-500">
              Open a direct conversation channel with {name}.
            </p>
          </div>

          <button
            type="button"
            onClick={() => navigate(`/chat/${user.userId || user.id}`)}
            className={`flex items-center justify-center gap-2 cursor-pointer ${btnPrimary}`}
          >
            <span>💬</span>
            <span>Open Chat Workspace</span>
          </button>
        </div>
      </section>
    </div>
  );
};

export default CustomerProfile;
