import { useState } from "react";
import Pagination from "rc-pagination";
import { usegetallpendingproperties } from "../../hooks/useProp";
import AvailabilityProp from "./VerifyProp";
import { usegetpendingagent } from "../../hooks/useadmin";
import VerifyUnverifyAgent from "./VerifyUnverifyAgent";
import { paginationClass } from "./adminBrand";

const ITEMS_PER_PAGE = 6;

const Requests = () => {
  const [activeTab, setActiveTab] = useState<"properties" | "agents">("properties");

  const [propsPage, setPropsPage] = useState(1);
  const [agentsPage, setAgentsPage] = useState(1);

  const {
    data: pendingProperties,
    isLoading: isPropsLoading,
    isError: isPropsError,
  } = usegetallpendingproperties();

  const {
    data: pendingAgents,
    isLoading: isAgentsLoading,
    isError: isAgentsError,
  } = usegetpendingagent();

  const properties = pendingProperties ?? [];
  const agents = pendingAgents?.data ?? [];

  const currentProperties = properties.slice(
    (propsPage - 1) * ITEMS_PER_PAGE,
    propsPage * ITEMS_PER_PAGE
  );

  const currentAgents = agents.slice(
    (agentsPage - 1) * ITEMS_PER_PAGE,
    agentsPage * ITEMS_PER_PAGE
  );

  const tabClass = (active: boolean) =>
    `text-xs font-semibold uppercase tracking-wider pb-3 border-b-2 transition-colors ${
      active
        ? "border-amber-600 text-amber-700"
        : "border-transparent text-stone-500 hover:text-stone-900"
    }`;

  const stateBox = "rounded-2xl border border-stone-200 bg-white p-10 text-center text-xs text-stone-500 shadow-sm";

  return (
    <div className="min-h-screen bg-stone-50 pb-16 text-stone-900">
      <header className="bg-stone-900 text-stone-50">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <p className="text-xs uppercase tracking-widest text-amber-600 font-medium">Approval Queue</p>
          <h1 className="mt-2 text-3xl font-bold sm:text-4xl">Admin Requests</h1>
          <p className="mt-2 text-xs text-stone-400">Review and approve pending properties and agent verification requests</p>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 pt-10 sm:px-6 lg:px-8">
        {/* Navigation Tabs */}
        <div className="mb-8 flex border-b border-stone-200 gap-6">
          <button
            onClick={() => setActiveTab("properties")}
            className={tabClass(activeTab === "properties")}
          >
            Property Requests ({properties.length})
          </button>
          <button
            onClick={() => setActiveTab("agents")}
            className={tabClass(activeTab === "agents")}
          >
            Agent Verifications ({agents.length})
          </button>
        </div>

        {/* Tab Content: Property Requests */}
        {activeTab === "properties" && (
          <>
            {isPropsLoading ? (
              <div className="p-6 text-xs text-stone-500">Loading properties...</div>
            ) : isPropsError ? (
              <div className="p-6 text-xs text-red-600">Failed to load properties.</div>
            ) : properties.length === 0 ? (
              <div className={stateBox}>No pending property requests.</div>
            ) : (
              <>
                <div className="grid grid-cols-1 gap-5 lg:grid-cols-2 xl:grid-cols-3">
                  {currentProperties.map((property: any) => (
                    <div
                      key={property.id}
                      className="group rounded-2xl border border-stone-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:border-amber-600 hover:shadow-md flex flex-col justify-between"
                    >
                      <div>
                        <h2 className="mb-2 text-xl font-bold text-stone-900">
                          {property.title}
                        </h2>
                        <p className="mb-1 text-xs text-stone-600">
                          {property.address}
                        </p>
                        <p className="mb-5 text-xs text-stone-500">
                          {property.bedrooms} Bedrooms · {property.bathrooms} Bathrooms
                        </p>
                      </div>

                      <div className="flex items-center justify-between gap-3 border-t border-stone-100 pt-4">
                        <span className="text-sm font-semibold text-amber-800 font-mono">
                          {property.price} EGP
                        </span>
                        <AvailabilityProp
                          id={property.id}
                          status={property.status}
                          queryKey={["properties", "pending"]}
                        />
                      </div>
                    </div>
                  ))}
                </div>

                {properties.length > ITEMS_PER_PAGE && (
                  <div className="mt-10 flex justify-center">
                    <Pagination
                      current={propsPage}
                      pageSize={ITEMS_PER_PAGE}
                      total={properties.length}
                      onChange={(page) => setPropsPage(page)}
                      className={paginationClass}
                    />
                  </div>
                )}
              </>
            )}
          </>
        )}

        {/* Tab Content: Agent Verifications */}
        {activeTab === "agents" && (
          <>
            {isAgentsLoading ? (
              <div className="p-6 text-xs text-stone-500">Loading pending agents...</div>
            ) : isAgentsError ? (
              <div className="p-6 text-xs text-red-600">Failed to load agents.</div>
            ) : agents.length === 0 ? (
              <div className={stateBox}>No pending agent verification requests.</div>
            ) : (
              <>
                <div className="grid grid-cols-1 gap-5 lg:grid-cols-2 xl:grid-cols-3">
                  {currentAgents.map((agent: any) => (
                    <div
                      key={agent.id}
                      className="rounded-2xl border border-stone-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:border-amber-600 hover:shadow-md flex flex-col justify-between"
                    >
                      <div>
                        <h2 className="text-xl font-bold text-stone-900">
                          {agent.name ?? agent.fullName}
                        </h2>
                        <p className="mt-1 text-xs text-stone-600">{agent.email}</p>
                        <p className="mt-3 text-[10px] font-mono uppercase tracking-wider text-stone-400">
                          User ID: {agent.id}
                        </p>
                      </div>

                      <div className="mt-5 flex gap-2 border-t border-stone-100 pt-4">
                        <VerifyUnverifyAgent id={agent.id} />
                      </div>
                    </div>
                  ))}
                </div>

                {agents.length > ITEMS_PER_PAGE && (
                  <div className="mt-10 flex justify-center">
                    <Pagination
                      current={agentsPage}
                      pageSize={ITEMS_PER_PAGE}
                      total={agents.length}
                      onChange={(page) => setAgentsPage(page)}
                      className={paginationClass}
                    />
                  </div>
                )}
              </>
            )}
          </>
        )}
      </main>
    </div>
  );
};

export default Requests;
