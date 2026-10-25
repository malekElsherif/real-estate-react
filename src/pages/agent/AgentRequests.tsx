import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { usegetPendingpurchaseRequests } from "../../hooks/usepurchase-requests";
import HandlePurchaseRequest from "./HandleApproveRequest";
import { usegetrentalrequestsformyproperties } from "../../hooks/userental-requests";

const AgentRequest = () => {
  const {
    data: purchaseData,
    isLoading: purchaseLoading,
    isError: purchaseError,
    refetch: refetchPurchase,
  } = usegetPendingpurchaseRequests();

  const {
    data: rentalData,
    isLoading: rentalLoading,
    isError: rentalError,
    refetch: refetchRental,
  } = usegetrentalrequestsformyproperties();

  const [activeTab, setActiveTab] = useState<"sale" | "rent">("sale");
  const [openItems, setOpenItems] = useState<Record<string, boolean>>({});
  const navigate = useNavigate();

  const saleRequests = purchaseData?.data ?? [];
  const rentRequests = rentalData?.data?.filter(
    (rental: any) => rental?.status?.toUpperCase() === "PENDING"
  ) ?? [];

  const currentRequests = activeTab === "sale" ? saleRequests : rentRequests;
  const isLoading = activeTab === "sale" ? purchaseLoading : rentalLoading;
  const isError = activeTab === "sale" ? purchaseError : rentalError;

  const handleRefetch = () => {
    if (activeTab === "sale") {
      refetchPurchase();
    } else {
      refetchRental();
    }
  };

  const toggleItem = (id: string) => {
    setOpenItems((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  if (isLoading) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center rounded-2xl border border-stone-100 bg-white shadow-sm">
        <div className="text-center">
          <div className="mx-auto h-7 w-7 animate-spin rounded-full border-2 border-stone-200 border-t-amber-800" />
          <p className="mt-3 text-xs uppercase tracking-wider text-stone-500">
            Loading {activeTab} requests...
          </p>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="rounded-2xl border border-rose-200 bg-white p-8 text-center shadow-sm">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl border border-rose-200 text-xl text-rose-600">
          ⚠️
        </div>
        <h3 className="mt-3 text-lg font-bold text-rose-600">
          Failed to load {activeTab} requests.
        </h3>
        <button
          type="button"
          onClick={handleRefetch}
          className="mt-4 rounded-xl bg-amber-800 px-5 py-2.5 text-xs font-semibold uppercase tracking-wider text-white transition hover:bg-amber-950 cursor-pointer"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-4 max-w-7xl mx-auto text-stone-900">
      <h1 className="text-2xl font-bold tracking-tight md:text-3xl">Requests</h1>

      {/* Tabs (Sale / Rent) */}
      <div className="flex gap-2 border-b border-stone-200 pb-3">
        <button
          type="button"
          onClick={() => setActiveTab("sale")}
          className={`rounded-xl px-4 py-2 text-xs font-semibold uppercase tracking-wider transition cursor-pointer ${
            activeTab === "sale"
              ? "bg-stone-900 text-white shadow-sm"
              : "border border-stone-200 bg-white text-stone-700 hover:bg-stone-50"
          }`}
        >
          Sale ({saleRequests.length})
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("rent")}
          className={`rounded-xl px-4 py-2 text-xs font-semibold uppercase tracking-wider transition cursor-pointer ${
            activeTab === "rent"
              ? "bg-stone-900 text-white shadow-sm"
              : "border border-stone-200 bg-white text-stone-700 hover:bg-stone-50"
          }`}
        >
          Rent ({rentRequests.length})
        </button>
      </div>

      {/* Requests List */}
      {currentRequests.length === 0 ? (
        <div className="flex min-h-[250px] items-center justify-center rounded-2xl border border-dashed border-stone-300 bg-white p-8 text-center shadow-sm">
          <div>
            <span className="text-3xl">📋</span>
            <h2 className="mt-3 text-lg font-semibold text-stone-900">
              No pending {activeTab} requests.
            </h2>
            <p className="mt-1 text-xs text-stone-500">
              New customer requests will appear here when submitted.
            </p>
          </div>
        </div>
      ) : (
        <div className="grid gap-4">
          {currentRequests.map((request: any) => {
            const userId = request.user?.id || request.userId;
            const isOpen = !!openItems[request.id];
            const property = request.property || {};

            return (
              <div
                key={request.id}
                className="rounded-2xl border border-stone-100 bg-white shadow-sm overflow-hidden transition-all"
              >
                {/* Main Card Header */}
                <div className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between">
                  <div className="space-y-1.5 min-w-0">
                    <button
                      type="button"
                      onClick={() => userId && navigate(`/agent/customer-profile/${userId}`)}
                      className="font-bold text-stone-900 text-left truncate transition hover:text-amber-800 hover:underline cursor-pointer bg-transparent border-none p-0"
                      title="View Customer Profile"
                    >
                      {request.user?.name || request.user?.username || "Unknown User"}
                    </button>

                    <p className="text-xs text-stone-600 truncate">
                      Property: <span className="font-semibold text-stone-900">{property.title || "Untitled Property"}</span>
                    </p>
                    <p className="text-xs font-bold text-amber-800">
                      {activeTab === "sale" ? "Offer:" : "Rent Price:"}{" "}
                      {request.offerPrice
                        ? `${Number(request.offerPrice).toLocaleString()} EGP`
                        : property.price
                        ? `${Number(property.price).toLocaleString()} EGP`
                        : "N/A"}
                    </p>
                    {request.user?.email && (
                      <p className="text-xs text-stone-500 truncate">
                        Email: {request.user.email}
                      </p>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-3 pt-2 sm:pt-0 shrink-0">
                    <button
                      type="button"
                      onClick={() => toggleItem(request.id)}
                      className="flex items-center gap-1.5 rounded-xl border border-stone-200 bg-stone-50 px-4 py-2 text-xs font-semibold text-stone-700 transition hover:bg-stone-900 hover:text-white cursor-pointer"
                    >
                      <span>{isOpen ? "Hide Property" : "View Property"}</span>
                      <span className={`transform transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}>
                        ▼
                      </span>
                    </button>

                    <div className="shrink-0">
                      <HandlePurchaseRequest id={request.id} type={property.type || (activeTab === "sale" ? "SALE" : "RENT")} />
                    </div>
                  </div>
                </div>

                {/* Collapsible Details */}
                {isOpen && (
                  <div className="border-t border-stone-100 bg-stone-50/60 p-5 space-y-4 animate-fadeIn">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-amber-800 border-b border-stone-200 pb-1.5">
                      Property Details
                    </h3>

                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 text-xs">
                      <div className="rounded-xl border border-stone-200 bg-white p-3">
                        <span className="text-[10px] uppercase font-semibold text-stone-400 block">Price</span>
                        <span className="font-bold text-stone-900 mt-0.5 block">
                          {property.price ? `${Number(property.price).toLocaleString()} EGP` : "N/A"}
                        </span>
                      </div>

                      <div className="rounded-xl border border-stone-200 bg-white p-3">
                        <span className="text-[10px] uppercase font-semibold text-stone-400 block">Type</span>
                        <span className="font-bold text-stone-900 uppercase mt-0.5 block">
                          {property.type || "N/A"}
                        </span>
                      </div>

                      <div className="rounded-xl border border-stone-200 bg-white p-3">
                        <span className="text-[10px] uppercase font-semibold text-stone-400 block">Location / Address</span>
                        <span className="font-bold text-stone-900 mt-0.5 block truncate">
                          {property.address || property.location || "N/A"}
                        </span>
                      </div>

                      {property.area && (
                        <div className="rounded-xl border border-stone-200 bg-white p-3">
                          <span className="text-[10px] uppercase font-semibold text-stone-400 block">Area</span>
                          <span className="font-bold text-stone-900 mt-0.5 block">
                            {property.area} m²
                          </span>
                        </div>
                      )}

                      {property.bedrooms && (
                        <div className="rounded-xl border border-stone-200 bg-white p-3">
                          <span className="text-[10px] uppercase font-semibold text-stone-400 block">Bedrooms</span>
                          <span className="font-bold text-stone-900 mt-0.5 block">
                            {property.bedrooms}
                          </span>
                        </div>
                      )}

                      {property.bathrooms && (
                        <div className="rounded-xl border border-stone-200 bg-white p-3">
                          <span className="text-[10px] uppercase font-semibold text-stone-400 block">Bathrooms</span>
                          <span className="font-bold text-stone-900 mt-0.5 block">
                            {property.bathrooms}
                          </span>
                        </div>
                      )}
                    </div>

                    {property.description && (
                      <div className="pt-1">
                        <span className="text-xs font-semibold uppercase tracking-wider text-stone-500 block mb-1.5">Description:</span>
                        <p className="text-xs text-stone-700 leading-relaxed bg-white p-3.5 rounded-xl border border-stone-200 shadow-xs">
                          {property.description}
                        </p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default AgentRequest;
