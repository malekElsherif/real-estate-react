import React from "react";
import { useNavigate } from "react-router-dom";
import { usegetme } from "../../hooks/useUsers";

const AgentVerify = () => {
  const { data, isLoading, isError } = usegetme();
  const navigate = useNavigate();

  const agent = data?.data;

  if (isLoading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <p className="text-sm text-slate-500">
          Loading...
        </p>
      </div>
    );
  }

  if (isError || !agent) {
    return (
      <div className="flex min-h-[400px] items-center justify-center p-6">
        <div className="rounded-2xl border border-red-200 bg-white p-8 text-center shadow-sm">
          <p className="text-sm font-medium text-red-500">
            Failed to load your account information.
          </p>

          <button
            onClick={() => navigate("/")}
            className="mt-5 rounded-xl bg-slate-900 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-800"
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
      <div className="flex min-h-[500px] items-center justify-center p-6">
        <div className="w-full max-w-lg rounded-2xl border border-emerald-200 bg-white p-8 text-center shadow-sm">

          {/* Icon */}
          <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-emerald-50">
            <svg
              className="h-10 w-10 text-emerald-500"
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
          <h1 className="text-2xl font-bold text-slate-800">
            Account Verified
          </h1>

          <p className="mt-3 text-sm leading-6 text-slate-500">
            Your agent account has been verified successfully.
            You can now access all agent features.
          </p>

          {/* Status */}
          <div className="mt-6 inline-flex items-center gap-2 rounded-full bg-emerald-50 px-4 py-2 text-sm font-semibold text-emerald-600">
            <span className="h-2 w-2 rounded-full bg-emerald-500" />
            Verified
          </div>

          {/* Browse Properties */}
          <div className="mt-8">
            <button
              onClick={() => navigate("/properties")}
              className="w-full rounded-xl bg-blue-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-blue-700"
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
    <div className="flex min-h-[500px] items-center justify-center p-6">
      <div className="w-full max-w-lg rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm">

        {/* Icon */}
        <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-amber-50">
          <svg
            className="h-10 w-10 text-amber-500"
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
        <h1 className="text-2xl font-bold text-slate-800">
          Verification Pending
        </h1>

        <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-slate-500">
          Hi {agent.name}, your agent verification request has
          been submitted successfully.
        </p>

        <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
          Our administration team is currently reviewing your
          account. You will be able to access agent features
          once your account has been approved.
        </p>

        {/* Status */}
        <div className="mt-6 inline-flex items-center gap-2 rounded-full bg-amber-50 px-4 py-2 text-sm font-semibold text-amber-600">
          <span className="h-2 w-2 rounded-full bg-amber-500" />
          Waiting for approval
        </div>

        {/* Info */}
        <div className="mt-8 rounded-xl bg-slate-50 p-4 text-left">
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
            What happens next?
          </p>

          <p className="mt-2 text-sm leading-6 text-slate-600">
            An administrator will review your account and verify
            your agent status. Once approved, all agent features
            will become available automatically.
          </p>
        </div>

        {/* Browse Properties */}
        <div className="mt-6 border-t border-slate-100 pt-6">
          <p className="mb-3 text-sm text-slate-500">
            While you wait, you can explore available properties.
          </p>

          <button
            onClick={() => navigate("/properties")}
            className="w-full rounded-xl bg-blue-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-blue-700"
          >
            Browse Properties
          </button>
        </div>
      </div>
    </div>
  );
};

export default AgentVerify;
