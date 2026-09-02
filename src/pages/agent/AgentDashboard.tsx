import { usegetme } from "../../hooks/useUsers";
import { usegetpurchaseRequestsformyProperties } from "../../hooks/usepurchase-requests";

import AgentHandleerrors from "./AgentHandleerrors";
import AgentRecentProperties from "./AgentRecentProperties";
import AgentRecentRequests from "./AgentRecentRequest";

// Font Imports matching the classic estate theme
const FontImports = () => (
  <style>{`@import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,400;9..144,500;9..144,600;9..144,700&family=Inter:wght@400;500;600&family=IBM+Plex+Mono:wght@400;500&display=swap');`}</style>
);

const serif = "[font-family:'Fraunces',serif]";
const mono = "[font-family:'IBM_Plex_Mono',monospace]";

export const AgentDashboard = () => {
  const { isError: meError } = usegetme();

  const {
    isError: requestsError,
  } = usegetpurchaseRequestsformyProperties();

  if (meError || requestsError) {
    return <AgentHandleerrors />;
  }

  return (
    <div className="min-h-screen bg-[#FFFDF9] py-8 text-[#14213D] antialiased">
      <FontImports />

      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">

        {/* Header Section */}
        <div className="mb-8 border-b border-[#14213D] pb-6">
          <span className={`${mono} text-xs uppercase tracking-[0.25em] text-[#B8863B]`}>
            Agent Portal
          </span>
          <h1 className={`${serif} mt-1 text-3xl font-semibold text-[#14213D] sm:text-4xl`}>
            Dashboard Overview
          </h1>
          <p className="mt-1 text-sm text-[#4A5568]">
            Manage your recent property listings and buyer requests.
          </p>
        </div>

        {/* Dashboard Grid */}
        <div className="grid grid-cols-1 gap-8 xl:grid-cols-3">

          {/* Recent Properties */}
          <section className="min-w-0 xl:col-span-2">
            <AgentRecentProperties />
          </section>

          {/* Recent Requests */}
          <section className="min-w-0">
            <AgentRecentRequests />
          </section>

        </div>
      </div>
    </div>
  );
};

export default AgentDashboard;
