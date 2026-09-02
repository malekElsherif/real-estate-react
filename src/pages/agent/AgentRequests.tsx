import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { usegetPendingpurchaseRequests } from "../../hooks/usepurchase-requests";
import HandlePurchaseRequest from "./HandleApproveRequest";
import { usegetrentalrequestsformyproperties } from "../../hooks/userental-requests";
// إذا كان لديك مكون خاص بإدارة طلبات الإيجار يمكنك استيراده هنا، أو استخدام المكون المشترك
// import HandleRentalRequest from "./HandleRentalRequest";

const serif = "[font-family:'Fraunces',serif]";
const mono = "[font-family:'IBM_Plex_Mono',monospace]";

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

  // حالة لتخزين الـ IDs الخاصة بالطلبات المفتوحة (Collapsible)
  const [openItems, setOpenItems] = useState<Record<string, boolean>>({});

  const navigate = useNavigate();

  const saleRequests = purchaseData?.data ?? [];

  // التصحيح الهام هنا: استخدام filter بدلاً dari find لضمان جلب جميع الطلبات المعلقة
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

  // دالة لتبديل حالة الفتح والإغلاق لكل طلب على حدة
  const toggleItem = (id: string) => {
    setOpenItems((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  if (isLoading) {
    return <p className={`${mono} p-6 text-center text-sm`}>Loading {activeTab} requests...</p>;
  }

  if (isError) {
    return (
      <div className="p-6 text-center">
        <p className={`${mono} text-sm text-red-600`}>Failed to load {activeTab} requests.</p>
        <button
          type="button"
          onClick={handleRefetch}
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
          {currentRequests.map((request: any) => {
            const userId = request.user?.id || request.userId;
            const isOpen = !!openItems[request.id];
            const property = request.property || {};

            return (
              <div
                key={request.id}
                className="border border-[#14213D] bg-[#FFFDF9] transition-all"
              >
                {/* الجزء الرئيسي للكرت */}
                <div className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between">
                  {/* تفاصيل الطلب */}
                  <div className="space-y-1">
                    <button
                      type="button"
                      onClick={() => userId && navigate(`/agent/customer-profile/${userId}`)}
                      className={`${serif} font-semibold text-[#14213D] text-left transition hover:text-[#B8863B] hover:underline cursor-pointer`}
                      title="View Customer Profile"
                    >
                      {request.user?.name || request.user?.username || "Unknown User"}
                    </button>

                    <p className={`${mono} text-xs text-[#4A5568]`}>
                      Property: {property.title || "Untitled Property"}
                    </p>
                    <p className={`${mono} text-xs text-[#B8863B]`}>
                      {activeTab === "sale" ? "Offer:" : "Rent Price:"}{" "}
                      {request.offerPrice ? `${Number(request.offerPrice).toLocaleString()} EGP` : property.price ? `${Number(property.price).toLocaleString()} EGP` : "N/A"}
                    </p>
                    {request.user?.email && (
                      <p className={`${mono} text-xs text-[#4A5568]`}>
                        Email: {request.user.email}
                      </p>
                    )}
                  </div>

                  {/* الأزرار (فتح التفاصيل + زر الإدارة/الموافقة) */}
                  <div className="flex items-center gap-3 pt-2 sm:pt-0">
                    <button
                      type="button"
                      onClick={() => toggleItem(request.id)}
                      className={`${mono} flex items-center gap-1.5 border border-[#14213D] bg-[#F7F5EF] px-3 py-2 text-xs font-semibold text-[#14213D] transition hover:bg-[#14213D] hover:text-[#F7F5EF]`}
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

                {/* قسم تفاصيل العقار المنسدل (Collapsible Details) */}
                {isOpen && (
                  <div className="border-t border-[#14213D] bg-[#F7F5EF]/50 p-4 space-y-3 animate-fadeIn">
                    <h3 className={`${serif} text-sm font-bold text-[#14213D] border-b border-[#E4DFD3] pb-1`}>
                      Property Details
                    </h3>

                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 text-xs">
                      <div>
                        <span className={`${mono} text-[#4A5568] block`}>Price:</span>
                        <span className={`${mono} font-semibold text-[#14213D]`}>
                          {property.price ? `${Number(property.price).toLocaleString()} EGP` : "N/A"}
                        </span>
                      </div>

                      <div>
                        <span className={`${mono} text-[#4A5568] block`}>Type:</span>
                        <span className={`${mono} font-semibold text-[#14213D] uppercase`}>
                          {property.type || "N/A"}
                        </span>
                      </div>

                      <div>
                        <span className={`${mono} text-[#4A5568] block`}>Location / Address:</span>
                        <span className={`${mono} font-semibold text-[#14213D]`}>
                          {property.address || property.location || "N/A"}
                        </span>
                      </div>

                      {property.area && (
                        <div>
                          <span className={`${mono} text-[#4A5568] block`}>Area:</span>
                          <span className={`${mono} font-semibold text-[#14213D]`}>
                            {property.area} m²
                          </span>
                        </div>
                      )}

                      {property.bedrooms && (
                        <div>
                          <span className={`${mono} text-[#4A5568] block`}>Bedrooms:</span>
                          <span className={`${mono} font-semibold text-[#14213D]`}>
                            {property.bedrooms}
                          </span>
                        </div>
                      )}

                      {property.bathrooms && (
                        <div>
                          <span className={`${mono} text-[#4A5568] block`}>Bathrooms:</span>
                          <span className={`${mono} font-semibold text-[#14213D]`}>
                            {property.bathrooms}
                          </span>
                        </div>
                      )}
                    </div>

                    {property.description && (
                      <div className="pt-1">
                        <span className={`${mono} text-[#4A5568] block mb-1`}>Description:</span>
                        <p className={`${mono} text-xs text-[#14213D] leading-relaxed bg-[#FFFDF9] p-2.5 border border-[#E4DFD3]`}>
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
