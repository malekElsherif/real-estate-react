import React, { useState } from "react";
import { usegetallpendingproperties } from "../../hooks/useProp";
import AvailabilityProp from "./VerifyProp";
import {
  usegetpendingagent,
  useverifyagent,
  userejectagent,
} from "../../hooks/useadmin";
import VerifyUnverifyAgent from "./VerifyUnverifyAgent";

const Requests = () => {
  const [activeTab, setActiveTab] = useState<"properties" | "agents">(
    "properties"
  );

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

  // Agent Verification Mutations


  const properties = pendingProperties ?? [];
  const agents = pendingAgents?.data ?? [];
  console.log(agents);

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-800">Admin Requests</h1>
        <p className="mt-1 text-sm text-slate-500">
          Review and approve pending properties and agent verification requests
        </p>
      </div>

      {/* Navigation Tabs */}
      <div className="mb-6 flex border-b border-slate-200">
        <button
          onClick={() => setActiveTab("properties")}
          className={`pb-3 px-4 font-medium text-sm border-b-2 transition-colors ${
            activeTab === "properties"
              ? "border-blue-600 text-blue-600"
              : "border-transparent text-slate-500 hover:text-slate-700"
          }`}
        >
          Property Requests ({properties.length})
        </button>
        <button
          onClick={() => setActiveTab("agents")}
          className={`pb-3 px-4 font-medium text-sm border-b-2 transition-colors ${
            activeTab === "agents"
              ? "border-blue-600 text-blue-600"
              : "border-transparent text-slate-500 hover:text-slate-700"
          }`}
        >
          Agent Verifications ({agents.length})
        </button>
      </div>

      {/* Tab Content: Property Requests */}
      {activeTab === "properties" && (
        <>
          {isPropsLoading ? (
            <div className="p-6 text-slate-500">Loading properties...</div>
          ) : isPropsError ? (
            <div className="p-6 text-red-500">Failed to load properties.</div>
          ) : properties.length === 0 ? (
            <div className="rounded-xl border border-slate-200 bg-white p-10 text-center text-slate-500">
              No pending property requests.
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-5 lg:grid-cols-2 xl:grid-cols-3">
              {properties.map((property: any) => (
                <div
                  key={property.id}
                  className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm"
                >
                  <h2 className="mb-2 text-lg font-semibold text-slate-800">
                    {property.title}
                  </h2>
                  <p className="mb-1 text-sm text-slate-500">
                    📍 {property.address}
                  </p>
                  <p className="mb-4 text-sm text-slate-500">
                    {property.bedrooms} Bedrooms · {property.bathrooms} Bathrooms
                  </p>
                  <div className="flex items-center justify-between border-t border-slate-100 pt-4">
                    <span className="font-semibold text-slate-800">
                      {property.price} EGP
                    </span>
                    <AvailabilityProp
                      id={property.id}
                      status={property.status}
                      queryKey="getallpendingproperties"
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}

      {/* Tab Content: Agent Verifications */}
      {activeTab === "agents" && (
        <>
          {isAgentsLoading ? (
            <div className="p-6 text-slate-500">Loading pending agents...</div>
          ) : isAgentsError ? (
            <div className="p-6 text-red-500">Failed to load agents.</div>
          ) : agents.length === 0 ? (
            <div className="rounded-xl border border-slate-200 bg-white p-10 text-center text-slate-500">
              No pending agent verification requests.
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-5 lg:grid-cols-2 xl:grid-cols-3">
              {agents.map((agent: any) => (
                <div
                  key={agent.id}
                  className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm"
                >
                  <h2 className="text-lg font-semibold text-slate-800">
                    {agent.name ?? agent.fullName}
                  </h2>
                  <p className="text-sm text-slate-500">{agent.email}</p>
                  <p className="mt-2 text-xs text-slate-400">
                    User ID: {agent.id}
                  </p>

                  <div className="mt-4 flex gap-2 border-t border-slate-100 pt-4">
                    <VerifyUnverifyAgent id={agent.id} />
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Requests;
