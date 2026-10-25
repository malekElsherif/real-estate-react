import { useNavigate } from "react-router-dom";
import { usegetme } from "../../hooks/useUsers";

const AgentVerify = () => {
  const { data, isLoading, isError } = usegetme();
  const navigate = useNavigate();

  const agent = data?.data;

  if (isLoading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <p className="text-xs uppercase tracking-wider text-stone-500">
          Loading...
        </p>
      </div>
    );
  }

  if (isError || !agent) {
    return (
      <div className="flex min-h-[400px] items-center justify-center p-6 text-stone-900">
        <div className="w-full max-w-md rounded-2xl border border-rose-200 bg-white p-8 text-center shadow-sm space-y-4">
          <p className="text-sm font-semibold text-rose-600">
            Failed to load your account information.
          </p>

          <button
            type="button"
            onClick={() => navigate("/")}
            className="w-full rounded-xl bg-stone-900 px-5 py-3 text-xs font-semibold uppercase tracking-wider text-white transition hover:bg-amber-800 cursor-pointer"
          >
            Go Home
          </button>
        </div>
      </div>
    );
  }

  {/* ================= VERIFIED ================= */}

  if (agent.isVerified) {
    return (
      <div className="flex min-h-[500px] items-center justify-center p-6 text-stone-900">
        <div className="w-full max-w-lg rounded-2xl border border-stone-100 bg-white p-8 text-center shadow-sm space-y-6">
          {/* Icon */}
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-2xl bg-emerald-50 border border-emerald-100">
            <svg
              className="h-10 w-10 text-emerald-600"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>

          {/* Title */}
          <div className="space-y-2">
            <h1 className="text-2xl font-bold tracking-tight text-stone-900">
              Account Verified
            </h1>
            <p className="text-sm leading-relaxed text-stone-500">
              Your agent account has been verified successfully.
              You can now access all agent features.
            </p>
          </div>

          {/* Status */}
          <div>
            <span className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-emerald-700">
              <span className="h-2 w-2 rounded-full bg-emerald-500" />
              Verified
            </span>
          </div>

          {/* Browse Properties */}
          <div className="pt-2">
            <button
              type="button"
              onClick={() => navigate("/properties")}
              className="w-full rounded-xl bg-stone-900 px-6 py-3 text-xs font-semibold uppercase tracking-wider text-white transition hover:bg-amber-800 cursor-pointer"
            >
              Browse Properties
            </button>
          </div>
        </div>
      </div>
    );
  }

  {/* ================= PENDING ================= */}

  return (
    <div className="flex min-h-[500px] items-center justify-center p-6 text-stone-900">
      <div className="w-full max-w-lg rounded-2xl border border-stone-100 bg-white p-8 text-center shadow-sm space-y-6">
        {/* Icon */}
        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-2xl bg-amber-50 border border-amber-200">
          <svg
            className="h-10 w-10 text-amber-800"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 8v4l2.5 2.5"
            />
            <circle
              cx="12"
              cy="12"
              r="9"
            />
          </svg>
        </div>

        {/* Title */}
        <div className="space-y-2">
          <h1 className="text-2xl font-bold tracking-tight text-stone-900">
            Verification Pending
          </h1>
          <p className="mx-auto max-w-md text-sm leading-relaxed text-stone-500">
            Hi <span className="font-semibold text-stone-900">{agent.name}</span>, your agent verification request has been submitted successfully.
          </p>
          <p className="mx-auto max-w-md text-sm leading-relaxed text-stone-500">
            Our administration team is currently reviewing your account. You will be able to access agent features once approved.
          </p>
        </div>

        {/* Status */}
        <div>
          <span className="inline-flex items-center gap-2 rounded-full border border-amber-200 bg-amber-50 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-amber-800">
            <span className="h-2 w-2 rounded-full bg-amber-500" />
            Waiting for approval
          </span>
        </div>

        {/* Info */}
        <div className="rounded-xl border border-stone-200 bg-stone-50 p-4 text-left space-y-1">
          <p className="text-[10px] font-semibold uppercase tracking-wider text-stone-400">
            What happens next?
          </p>
          <p className="text-xs leading-relaxed text-stone-600">
            An administrator will review your account and verify your agent status. Once approved, all agent features will become available automatically.
          </p>
        </div>

        {/* Browse Properties */}
        <div className="border-t border-stone-100 pt-6 space-y-3">
          <p className="text-xs text-stone-500">
            While you wait, you can explore available properties.
          </p>

          <button
            type="button"
            onClick={() => navigate("/properties")}
            className="w-full rounded-xl bg-stone-900 px-6 py-3 text-xs font-semibold uppercase tracking-wider text-white transition hover:bg-amber-800 cursor-pointer"
          >
            Browse Properties
          </button>
        </div>
      </div>
    </div>
  );
};

export default AgentVerify;
