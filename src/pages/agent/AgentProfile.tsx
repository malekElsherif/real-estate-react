import { usegetme } from "../../hooks/useUsers";

const AgentProfile = () => {
  const { data, isLoading, isError, error } = usegetme();
  const user = data?.data || data;

  if (isLoading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center rounded-2xl border border-stone-100 bg-white shadow-sm">
        <div className="text-center">
          <div className="mx-auto h-8 w-8 animate-spin rounded-full border-2 border-stone-200 border-t-amber-800" />
          <p className="mt-3 text-xs uppercase tracking-wider text-stone-500">
            Retrieving Agent Profile...
          </p>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center rounded-2xl border border-rose-200 bg-white p-6 text-center shadow-sm">
        <div>
          <span className="text-2xl">⚠️</span>
          <h2 className="mt-2 text-lg font-bold text-rose-600">
            Unable to Load Profile
          </h2>
          <p className="mt-1 text-xs text-stone-500">
            {error?.message || "An error occurred while loading your profile details."}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl space-y-8 text-stone-900">
      {/* Header Section */}
      <div className="flex flex-col gap-4 border-b border-stone-200 pb-6 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <span className="text-xs font-semibold uppercase tracking-wider text-amber-800">
            Account Dossier
          </span>
          <h1 className="text-3xl font-bold tracking-tight">
            Agent Profile
          </h1>
          <p className="mt-1 text-xs text-stone-500">
            Manage your credentials and view professional estate account parameters.
          </p>
        </div>

        <div className="rounded-xl border border-stone-200 bg-stone-50 px-4 py-2.5 text-left sm:text-right">
          <span className="text-[10px] font-semibold uppercase tracking-wider text-stone-500">
            Role Designation
          </span>
          <p className="text-base font-bold uppercase text-amber-800">
            {user?.role || "AGENT"}
          </p>
        </div>
      </div>

      {/* Main Profile Card */}
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        {/* Identity Sidebar */}
        <div className="rounded-2xl border border-stone-100 bg-white p-6 text-center shadow-sm space-y-4">
          <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-2xl bg-stone-900 text-3xl font-bold text-white">
            {user?.name?.charAt(0).toUpperCase() || user?.username?.charAt(0).toUpperCase() || "A"}
          </div>

          <div>
            <h2 className="text-xl font-bold tracking-tight">
              {user?.name || user?.username || "Estate Agent"}
            </h2>
            <p className="mt-1 text-xs font-semibold uppercase tracking-wider text-amber-800">
              Licensed Agent
            </p>
          </div>

          <div className="border-t border-stone-100 pt-4">
            <span className="inline-block rounded-full bg-amber-50 border border-amber-200 px-3 py-1 text-[10px] font-semibold uppercase tracking-wider text-amber-800">
              Verified Personnel
            </span>
          </div>
        </div>

        {/* Credentials Details */}
        <div className="rounded-2xl border border-stone-100 bg-white p-6 shadow-sm space-y-6 lg:col-span-2">
          <div className="border-b border-stone-100 pb-3">
            <span className="text-xs font-semibold uppercase tracking-wider text-amber-800">
              Official Records
            </span>
            <h3 className="text-lg font-bold tracking-tight">
              Personal Credentials
            </h3>
          </div>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <div className="rounded-xl border border-stone-200 bg-stone-50 p-4">
              <span className="text-[10px] font-semibold uppercase tracking-wider text-stone-500">
                Full Name
              </span>
              <p className="mt-1 text-base font-medium text-stone-900">
                {user?.name || "Not specified"}
              </p>
            </div>

            <div className="rounded-xl border border-stone-200 bg-stone-50 p-4">
              <span className="text-[10px] font-semibold uppercase tracking-wider text-stone-500">
                Username
              </span>
              <p className="mt-1 text-sm font-medium text-stone-900">
                @{user?.username || "n/a"}
              </p>
            </div>

            <div className="rounded-xl border border-stone-200 bg-stone-50 p-4">
              <span className="text-[10px] font-semibold uppercase tracking-wider text-stone-500">
                Email Address
              </span>
              <p className="mt-1 truncate text-xs font-medium text-stone-900">
                {user?.email || "Not specified"}
              </p>
            </div>

            <div className="rounded-xl border border-stone-200 bg-stone-50 p-4">
              <span className="text-[10px] font-semibold uppercase tracking-wider text-stone-500">
                Phone Contact
              </span>
              <p className="mt-1 text-xs font-medium text-stone-900">
                {user?.phone || user?.phoneNumber || "Not registered"}
              </p>
            </div>
          </div>

          {/* Additional Account Metadata */}
          <div className="border-t border-stone-100 pt-4 space-y-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-stone-500">
              System Identification
            </span>
            <div className="flex items-center justify-between rounded-xl border border-stone-200 bg-stone-50 p-3">
              <span className="text-xs text-stone-500">Account Reference Code</span>
              <span className="text-xs font-bold text-stone-900">#AG-{user?.id || "000"}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AgentProfile;
