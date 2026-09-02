import { useState } from "react";
import { usegetPendingpurchaseRequests } from "../../hooks/usepurchase-requests";
import ApprovePurchaseRequest from "./ApprovePurchaseRequest";

const serif = "[font-family:'Fraunces',serif]";
const mono = "[font-family:'IBM_Plex_Mono',monospace]";

const AgentRequest = () => {
  const { data, isLoading, isError, refetch } = usegetPendingpurchaseRequests();
  const [activeTab, setActiveTab] = useState<"sale" | "rent">("sale");

  const requests = data?.data ?? [];

  // تقسيم الطلبات إلى بيع وإيجار
  const saleRequests = requests.filter(
    (req: any) => req.property?.type?.toString().toUpperCase() === "SALE"
  );
  const rentRequests = requests.filter(
    (req: any) => req.property?.type?.toString().toUpperCase() === "RENT"
  );

  const currentRequests = activeTab === "sale" ? saleRequests : rentRequests;

  if (isLoading) {
    return <p className={`${mono} p-6 text-center text-sm`}>Loading requests...</p>;
  }

  if (isError) {
    return (
      <div className="p-6 text-center">
        <p className={`${mono} text-sm text-red-600`}>Failed to load requests.</p>
        <button
          type="button"
          onClick={() => refetch()}
          className={`${mono} mt-2 border border-[#14213D] px-3 py-1 text-xs`}
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-4 p-4">
      <h1 className={`${serif} text-2xl font-bold text-[#14213D]`}>Requests</h1>

      {/* أزرار التقسيم (بيع / إيجار) */}
      <div className="flex gap-2 border-b border-[#14213D] pb-2">
        <button
          type="button"
          onClick={() => setActiveTab("sale")}
          className={`${mono} px-4 py-2 text-xs font-semibold uppercase transition ${
            activeTab === "sale"
              ? "bg-[#14213D] text-[#F7F5EF]"
              : "border border-[#14213D] bg-[#FFFDF9] text-[#14213D]"
          }`}
        >
          Sale ({saleRequests.length})
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("rent")}
          className={`${mono} px-4 py-2 text-xs font-semibold uppercase transition ${
            activeTab === "rent"
              ? "bg-[#14213D] text-[#F7F5EF]"
              : "border border-[#14213D] bg-[#FFFDF9] text-[#14213D]"
          }`}
        >
          Rent ({rentRequests.length})
        </button>
      </div>

      {/* عرض القائمة الحالية */}
      {currentRequests.length === 0 ? (
        <p className={`${mono} py-6 text-center text-sm text-[#4A5568]`}>
          No pending {activeTab} requests.
        </p>
      ) : (
        <div className="grid gap-4">
          {currentRequests.map((request: any) => (
            <div
              key={request.id}
              className="flex flex-col gap-3 border border-[#14213D] bg-[#FFFDF9] p-4 sm:flex-row sm:items-center sm:justify-between"
            >
              {/* تفاصيل الطلب */}
              <div className="space-y-1">
                <p className={`${serif} font-semibold text-[#14213D]`}>
                  {request.user?.name || request.user?.username || "Unknown User"}
                </p>
                <p className={`${mono} text-xs text-[#4A5568]`}>
                  Property: {request.property?.title || "Untitled Property"}
                </p>
                <p className={`${mono} text-xs text-[#B8863B]`}>
                  Offer: {request.offerPrice ? `${Number(request.offerPrice).toLocaleString()} EGP` : "N/A"}
                </p>
                {request.user?.email && (
                  <p className={`${mono} text-xs text-[#4A5568]`}>
                    Email: {request.user.email}
                  </p>
                )}
              </div>

              {/* زر الأبروف */}
              <div className="shrink-0 pt-2 sm:pt-0">
                <ApprovePurchaseRequest id={request.id} />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AgentRequest;
