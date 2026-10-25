import { usegetme } from "../../hooks/useUsers";
import { usegetpurchaseRequestsformyProperties } from "../../hooks/usepurchase-requests";

import AgentHandleerrors from "./AgentHandleerrors";
import AgentRecentProperties from "./AgentRecentProperties";
import AgentRecentRequests from "./AgentRecentRequest";

export const AgentDashboard = () => {
  const { isError: meError } = usegetme();
  const { isError: requestsError } = usegetpurchaseRequestsformyProperties();

  if (meError || requestsError) {
    return <AgentHandleerrors />;
  }

  return (
    <div className="min-h-screen bg-stone-50 py-8 text-stone-900 antialiased">
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 space-y-8">

        {/* Header Section */}
        <div className="border-b border-stone-200 pb-6">
          <span className="text-xs font-semibold uppercase tracking-wider text-amber-800">
            Agent Portal
          </span>
          <h1 className="mt-1 text-3xl font-bold tracking-tight sm:text-4xl">
            Dashboard Overview
          </h1>
          <p className="mt-1 text-sm text-stone-500">
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
