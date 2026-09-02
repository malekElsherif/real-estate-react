import React from "react";
import { usegetme } from "../../hooks/useUsers";

const serif = "[font-family:'Fraunces',serif]";
const mono = "[font-family:'IBM_Plex_Mono',monospace]";

const AgentProfile = () => {
  const { data, isLoading, isError, error } = usegetme();

  const user = data?.data || data;

  if (isLoading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center border border-[#14213D] bg-[#FFFDF9]">
        <div className="text-center">
          <div className="mx-auto h-8 w-8 animate-spin rounded-full border-2 border-[#E4DFD3] border-t-[#14213D]" />
          <p className={`${mono} mt-3 text-xs uppercase tracking-widest text-[#4A5568]`}>
            Retrieving Agent Profile...
          </p>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center border border-[#B8452E] bg-[#FFFDF9] p-6 text-center">
        <div>
          <span className="text-2xl">⚠️</span>
          <h2 className={`${serif} mt-2 text-lg font-semibold text-[#B8452E]`}>
            Unable to Load Profile
          </h2>
          <p className={`${mono} mt-1 text-xs text-[#4A5568]`}>
            {error?.message || "An error occurred while loading your profile details."}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl space-y-8">
      {/* =========================
          Header Section
      ========================= */}
      <div className="flex flex-col gap-4 border-b border-[#14213D] pb-6 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <span className={`${mono} text-[10px] uppercase tracking-[0.2em] text-[#B8863B]`}>
            Account Dossier
          </span>
          <h1 className={`${serif} text-3xl font-semibold text-[#14213D]`}>
            Agent Profile
          </h1>
          <p className={`${mono} mt-1 text-xs text-[#4A5568]`}>
            Manage your credentials and view professional estate account parameters.
          </p>
        </div>

        <div className="border border-[#14213D] bg-[#F7F5EF] px-4 py-2 text-left sm:text-right">
          <span className={`${mono} text-[10px] uppercase tracking-widest text-[#4A5568]`}>
            Role Designation
          </span>
          <p className={`${serif} text-lg font-bold uppercase text-[#14213D]`}>
            {user?.role || "AGENT"}
          </p>
        </div>
      </div>

      {/* =========================
          Main Profile Card
      ========================= */}
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        {/* Identity Sidebar */}
        <div className="border border-[#14213D] bg-[#FFFDF9] p-6 text-center space-y-4">
          <div className="mx-auto flex h-24 w-24 items-center justify-center border border-[#14213D] bg-[#14213D]">
            <span className={`${serif} text-3xl font-bold text-[#F7F5EF]`}>
              {user?.name?.charAt(0).toUpperCase() || user?.username?.charAt(0).toUpperCase() || "A"}
            </span>
          </div>

          <div>
            <h2 className={`${serif} text-xl font-semibold text-[#14213D]`}>
              {user?.name || user?.username || "Estate Agent"}
            </h2>
            <p className={`${mono} mt-1 text-xs text-[#B8863B] uppercase tracking-wider`}>
              Licensed Agent
            </p>
          </div>

          <div className="border-t border-dotted border-[#E4DFD3] pt-4">
            <span className={`${mono} inline-block border border-[#B8863B] bg-[#F7F5EF] px-3 py-1 text-[10px] font-semibold uppercase tracking-widest text-[#B8863B]`}>
              Verified Personnel
            </span>
          </div>
        </div>

        {/* Credentials Details */}
        <div className="border border-[#14213D] bg-[#FFFDF9] p-6 space-y-6 lg:col-span-2">
          <div className="border-b border-[#14213D] pb-3">
            <span className={`${mono} text-[10px] uppercase tracking-widest text-[#B8863B]`}>
              Official Records
            </span>
            <h3 className={`${serif} text-lg font-semibold text-[#14213D]`}>
              Personal Credentials
            </h3>
          </div>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <div className="border border-[#E4DFD3] bg-[#F7F5EF] p-4">
              <span className={`${mono} text-[9px] uppercase tracking-wider text-[#4A5568]`}>
                Full Name
              </span>
              <p className={`${serif} mt-1 text-base font-medium text-[#14213D]`}>
                {user?.name || "Not specified"}
              </p>
            </div>

            <div className="border border-[#E4DFD3] bg-[#F7F5EF] p-4">
              <span className={`${mono} text-[9px] uppercase tracking-wider text-[#4A5568]`}>
                Username
              </span>
              <p className={`${mono} mt-1 text-sm font-medium text-[#14213D]`}>
                @{user?.username || "n/a"}
              </p>
            </div>

            <div className="border border-[#E4DFD3] bg-[#F7F5EF] p-4">
              <span className={`${mono} text-[9px] uppercase tracking-wider text-[#4A5568]`}>
                Email Address
              </span>
              <p className={`${mono} mt-1 text-xs font-medium text-[#14213D] truncate`}>
                {user?.email || "Not specified"}
              </p>
            </div>

            <div className="border border-[#E4DFD3] bg-[#F7F5EF] p-4">
              <span className={`${mono} text-[9px] uppercase tracking-wider text-[#4A5568]`}>
                Phone Contact
              </span>
              <p className={`${mono} mt-1 text-xs font-medium text-[#14213D]`}>
                {user?.phone || user?.phoneNumber || "Not registered"}
              </p>
            </div>
          </div>

          {/* Additional Account Metadata */}
          <div className="border-t border-[#14213D] pt-4 space-y-2">
            <span className={`${mono} text-[10px] uppercase tracking-widest text-[#4A5568]`}>
              System Identification
            </span>
            <div className="flex items-center justify-between bg-[#F7F5EF] p-3 border border-[#E4DFD3]">
              <span className={`${mono} text-xs text-[#4A5568]`}>Account Reference Code</span>
              <span className={`${mono} text-xs font-bold text-[#14213D]`}>#AG-{user?.id || "000"}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AgentProfile;
