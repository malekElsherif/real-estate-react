import { useParams, useNavigate } from "react-router-dom";
import { usegetuserbyid } from "../../hooks/useUsers";

const serif = "[font-family:'Fraunces',serif]";
const mono = "[font-family:'IBM_Plex_Mono',monospace]";

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
      <div className="flex min-h-[60vh] items-center justify-center border border-[#14213D] bg-[#FFFDF9]">
        <div className="text-center">
          <div className="mx-auto h-8 w-8 animate-spin rounded-full border-2 border-[#E4DFD3] border-t-[#14213D]" />
          <p className={`${mono} mt-3 text-xs uppercase tracking-widest text-[#4A5568]`}>
            Loading customer profile...
          </p>
        </div>
      </div>
    );
  }

  if (isError || !user) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center border border-[#B8452E] bg-[#FFFDF9] p-6 text-center">
        <div>
          <span className="text-2xl">👤</span>
          <h2 className={`${serif} mt-2 text-lg font-semibold text-[#B8452E]`}>
            Customer Not Found
          </h2>
          <p className={`${mono} mt-1 text-xs text-[#4A5568]`}>
            We couldn't load this customer's profile.
          </p>
          <button
            type="button"
            onClick={() => navigate(-1)}
            className={`${mono} mt-5 border border-[#14213D] bg-[#14213D] px-5 py-2 text-xs font-semibold uppercase tracking-wider text-[#F7F5EF] transition hover:bg-[#B8863B] hover:border-[#B8863B]`}
          >
            ← Go Back
          </button>
        </div>
      </div>
    );
  }

  const name = user.name || user.username || "Customer";
  const firstLetter = name.charAt(0).toUpperCase();

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 border-b border-[#14213D] pb-5 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <span className={`${mono} text-[10px] uppercase tracking-[0.2em] text-[#B8863B]`}>
            Customer Directory
          </span>
          <h1 className={`${serif} text-2xl font-semibold text-[#14213D]`}>
            Customer Profile
          </h1>
          <p className={`${mono} mt-1 text-xs text-[#4A5568]`}>
            View customer details and manage communication.
          </p>
        </div>

        {/* Action Button */}
        <button
          type="button"
          onClick={() => navigate(`/chat/${user.userId || user.id}`)}
          className={`${mono} flex items-center justify-center gap-2 border border-[#14213D] bg-[#14213D] px-5 py-2.5 text-xs font-semibold uppercase tracking-wider text-[#F7F5EF] transition hover:bg-[#B8863B] hover:border-[#B8863B]`}
        >
          <span>💬</span>
          <span>Chat with Customer</span>
        </button>
      </div>

      {/* Main Profile Header Card */}
      <div className="border border-[#14213D] bg-[#FFFDF9]">
        <div className="relative h-28 bg-[#14213D] sm:h-32">
          <div className="absolute -bottom-6 left-6 sm:left-8">
            <div className={`${serif} flex h-20 w-20 items-center justify-center border border-[#14213D] bg-[#B8863B] text-2xl font-bold text-[#F7F5EF]`}>
              {firstLetter}
            </div>
          </div>
        </div>

        <div className="px-6 pb-6 pt-10 sm:px-8">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className={`${serif} text-2xl font-semibold text-[#14213D]`}>
                {name}
              </h2>
              <p className={`${mono} mt-0.5 text-xs text-[#4A5568]`}>
                {user.email || "No email provided"}
              </p>
            </div>

            <div className="flex items-center gap-2">
              <span className={`${mono} border border-dashed border-[#B8863B] bg-[#F7F5EF] px-2.5 py-1 text-[10px] uppercase tracking-wider text-[#B8863B]`}>
                ● Active Customer
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Details Sections Grid */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Personal Information */}
        <section className="border border-[#14213D] bg-[#FFFDF9] p-6 space-y-4">
          <div className="flex items-center gap-3 border-b border-[#14213D]/10 pb-3">
            <span className="text-lg">👤</span>
            <div>
              <h2 className={`${serif} font-semibold text-[#14213D]`}>
                Personal Information
              </h2>
              <p className={`${mono} text-[10px] text-[#4A5568]`}>
                Contact and identification details
              </p>
            </div>
          </div>

          <div className={`${mono} space-y-2 text-xs`}>
            <div className="border border-[#E4DFD3] bg-[#F7F5EF]/50 p-3">
              <p className="text-[9px] uppercase tracking-wider text-[#4A5568]">
                Full Name
              </p>
              <p className="mt-1 font-semibold text-[#14213D]">
                {user.name || user.username || "Not provided"}
              </p>
            </div>

            <div className="border border-[#E4DFD3] bg-[#F7F5EF]/50 p-3">
              <p className="text-[9px] uppercase tracking-wider text-[#4A5568]">
                Username
              </p>
              <p className="mt-1 font-semibold text-[#14213D]">
                {user.username || "Not provided"}
              </p>
            </div>

            <div className="border border-[#E4DFD3] bg-[#F7F5EF]/50 p-3">
              <p className="text-[9px] uppercase tracking-wider text-[#4A5568]">
                Email Address
              </p>
              <p className="mt-1 break-all font-semibold text-[#14213D]">
                {user.email || "Not provided"}
              </p>
            </div>
          </div>
        </section>

        {/* Account Information */}
        <section className="border border-[#14213D] bg-[#FFFDF9] p-6 space-y-4">
          <div className="flex items-center gap-3 border-b border-[#14213D]/10 pb-3">
            <span className="text-lg">🛡️</span>
            <div>
              <h2 className={`${serif} font-semibold text-[#14213D]`}>
                Account Information
              </h2>
              <p className={`${mono} text-[10px] text-[#4A5568]`}>
                Platform status & permission scope
              </p>
            </div>
          </div>

          <div className={`${mono} space-y-2 text-xs`}>
            <div className="flex items-center justify-between border border-[#E4DFD3] bg-[#F7F5EF]/50 p-3">
              <div>
                <p className="text-[9px] uppercase tracking-wider text-[#4A5568]">
                  Account Status
                </p>
                <p className="mt-1 font-semibold text-[#14213D]">Active</p>
              </div>
              <span className="border border-[#14213D] bg-[#14213D] px-2 py-0.5 text-[9px] uppercase text-[#F7F5EF]">
                Verified
              </span>
            </div>

            <div className="border border-[#E4DFD3] bg-[#F7F5EF]/50 p-3">
              <p className="text-[9px] uppercase tracking-wider text-[#4A5568]">
                Role
              </p>
              <p className="mt-1 font-semibold capitalize text-[#B8863B]">
                {user.role || "Customer"}
              </p>
            </div>
          </div>
        </section>
      </div>

      {/* Footer Contact Banner */}
      <section className="border border-[#14213D] bg-[#F7F5EF] p-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <span className={`${mono} text-[9px] uppercase tracking-widest text-[#B8863B]`}>
              Direct Communication
            </span>
            <h2 className={`${serif} text-lg font-semibold text-[#14213D]`}>
              Need to discuss property requests?
            </h2>
            <p className={`${mono} mt-0.5 text-xs text-[#4A5568]`}>
              Open a direct conversation channel with {name}.
            </p>
          </div>

          <button
            type="button"
            onClick={() => navigate(`/chat/${user.userId || user.id}`)}
            className={`${mono} flex items-center justify-center gap-2 border border-[#14213D] bg-[#14213D] px-5 py-2.5 text-xs font-semibold uppercase tracking-wider text-[#F7F5EF] transition hover:bg-[#B8863B] hover:border-[#B8863B]`}
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
