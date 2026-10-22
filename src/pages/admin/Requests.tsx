import { useState } from "react";
import Pagination from "rc-pagination";
import { usegetallpendingproperties } from "../../hooks/useProp";
import AvailabilityProp from "./VerifyProp";
import { usegetpendingagent } from "../../hooks/useadmin";
import VerifyUnverifyAgent from "./VerifyUnverifyAgent";
import { paginationClass } from "./adminBrand";

const ITEMS_PER_PAGE = 6;

const Requests = () => {
  const [activeTab, setActiveTab] = useState<"properties" | "agents">(
    "properties"
  );

  // حالة الترقيم لكل تبويب
  const [propsPage, setPropsPage] = useState(1);
  const [agentsPage, setAgentsPage] = useState(1);

  // Pending Properties Data
  const {
    data: pendingProperties,
    isLoading: isPropsLoading,
    isError: isPropsError,
  } = usegetallpendingproperties();

  // Pending Agents Data
  const {
    data: pendingAgents,
    isLoading: isAgentsLoading,
    isError: isAgentsError,
  } = usegetpendingagent();

  const properties = pendingProperties ?? [];
  const agents = pendingAgents?.data ?? [];

  // اقتطاع البيانات بناءً على الصفحة الحالية (Client-side pagination)
  const currentProperties = properties.slice(
    (propsPage - 1) * ITEMS_PER_PAGE,
    propsPage * ITEMS_PER_PAGE
  );

  const currentAgents = agents.slice(
    (agentsPage - 1) * ITEMS_PER_PAGE,
    agentsPage * ITEMS_PER_PAGE
  );

  const tabClass = (active: boolean) =>
    `eyebrow -mb-px border-b-2 px-4 pb-3 font-semibold transition-colors ${
      active
        ? "border-[#B8863B] text-[#B8863B]"
        : "border-transparent text-[#14213D]/55 hover:text-[#14213D]"
    }`;

  const stateBox = "border border-[#E4DFD3] bg-[#FFFDF9] p-10 text-center text-xs text-[#4A5568]";

  return (
    <div className="mx-auto max-w-7xl">
      <div className="mb-8">
        <p className="eyebrow text-[#B8863B]">Approval Queue</p>

        <h1 className="font-heading mt-2 text-3xl font-semibold text-[#14213D] sm:text-4xl">
          Admin Requests
        </h1>

        <p className="mt-2 text-xs text-[#14213D]/60">
          Review and approve pending properties and agent verification requests
        </p>

        <div className="mt-4 h-px w-16 bg-[#B8863B]" />
      </div>

      {/* Navigation Tabs */}
      <div className="mb-8 flex border-b border-[#E4DFD3]">
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
            <div className="p-6 text-xs text-[#14213D]/60">
              Loading properties...
            </div>
          ) : isPropsError ? (
            <div className="p-6 text-xs text-[#B8452E]">
              Failed to load properties.
            </div>
          ) : properties.length === 0 ? (
            <div className={stateBox}>No pending property requests.</div>
          ) : (
            <>
              <div className="grid grid-cols-1 gap-5 lg:grid-cols-2 xl:grid-cols-3">
                {currentProperties.map((property: any) => (
                  <div
                    key={property.id}
                    className="group border border-[#14213D]/15 bg-white p-6 transition hover:-translate-y-1 hover:border-[#B8863B] hover:shadow-[0_12px_30px_-12px_rgba(20,33,61,0.25)]"
                  >
                    <h2 className="font-heading mb-3 text-xl font-semibold text-[#14213D]">
                      {property.title}
                    </h2>
                    <p className="mb-1 text-xs text-[#4A5568]">
                      {property.address}
                    </p>
                    <p className="mb-5 text-xs text-[#4A5568]">
                      {property.bedrooms} Bedrooms · {property.bathrooms}{" "}
                      Bathrooms
                    </p>
                    <div className="flex items-center justify-between gap-3 border-t border-[#E4DFD3] pt-4">
                      <span className="text-sm font-semibold text-[#B8863B]">
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

              {/* Pagination control for properties */}
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
            <div className="p-6 text-xs text-[#14213D]/60">
              Loading pending agents...
            </div>
          ) : isAgentsError ? (
            <div className="p-6 text-xs text-[#B8452E]">
              Failed to load agents.
            </div>
          ) : agents.length === 0 ? (
            <div className={stateBox}>
              No pending agent verification requests.
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 gap-5 lg:grid-cols-2 xl:grid-cols-3">
                {currentAgents.map((agent: any) => (
                  <div
                    key={agent.id}
                    className="border border-[#14213D]/15 bg-white p-6 transition hover:-translate-y-1 hover:border-[#B8863B] hover:shadow-[0_12px_30px_-12px_rgba(20,33,61,0.25)]"
                  >
                    <h2 className="font-heading text-xl font-semibold text-[#14213D]">
                      {agent.name ?? agent.fullName}
                    </h2>
                    <p className="mt-1 text-xs text-[#4A5568]">{agent.email}</p>
                    <p className="eyebrow mt-3 text-[#14213D]/40">
                      User ID: {agent.id}
                    </p>

                    <div className="mt-5 flex gap-2 border-t border-[#E4DFD3] pt-4">
                      <VerifyUnverifyAgent id={agent.id} />
                    </div>
                  </div>
                ))}
              </div>

              {/* Pagination control for agents */}
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
    </div>
  );
};

export default Requests;
