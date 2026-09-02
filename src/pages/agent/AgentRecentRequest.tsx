import { Link } from "react-router-dom";
import { usegetPendingpurchaseRequests } from "../../hooks/usepurchase-requests";
import { usegetrentalrequestsformyproperties } from "../../hooks/userental-requests";

const serif = "[font-family:'Fraunces',serif]";
const mono = "[font-family:'IBM_Plex_Mono',monospace]";

const AgentRecentRequests = () => {
  const { data: pendingRequest, isLoading: purchaseLoading, isError: purchaseError } = usegetPendingpurchaseRequests();
  const { data: rentalRequest, isLoading: rentalLoading, isError: rentalError } = usegetrentalrequestsformyproperties();

  // =========================
  // Safe Data Extraction & Normalization
  // =========================
  const pendingPurchases: any[] = (pendingRequest?.data ?? []).map((item: any) => ({
    ...item,
    requestType: "Purchase request",
    typeKey: "sale",
  }));

  const pendingRentals: any[] = (rentalRequest?.data ?? []).map((item: any) => ({
    ...item,
    requestType: "Rental request",
    typeKey: "rent",
  }));

  // دمج طلبات الشراء والإيجار معاً
  const allRequests = [...pendingPurchases, ...pendingRentals];

  // فرز الطلبات من الأحدث للأقدم حسب تاريخ الإنشاء وجلب أول 3 فقط
  const recentRequests = allRequests
    .sort((a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime())
    .slice(0, 3);

  const totalCount = allRequests.length;
  const isLoading = purchaseLoading || rentalLoading;
  const isError = purchaseError || rentalError;

  // =========================
  // Helpers
  // =========================
  const formatDate = (date: string) => {
    if (!date) return "";

    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const getCustomerName = (request: any) => {
    return (
      request.user?.name ||
      request.user?.username ||
      "Customer"
    );
  };

  return (
    <section className="border border-[#14213D] bg-[#FFFDF9]">
      {/* =========================
          Header
      ========================= */}
      <div className="flex items-center justify-between border-b border-[#14213D] bg-[#F7F5EF] p-5 sm:p-6">
        <div>
          <span className={`${mono} text-[10px] uppercase tracking-[0.2em] text-[#B8863B]`}>
            Overview
          </span>
          <h2 className={`${serif} text-lg font-bold text-[#14213D]`}>
            Recent Requests
          </h2>
          <p className={`${mono} mt-0.5 text-xs text-[#4A5568]`}>
            Latest customer requests
          </p>
        </div>

        <span className={`${mono} border border-[#B8863B] bg-[#FFFDF9] px-3 py-1 text-[10px] font-semibold uppercase tracking-wider text-[#B8863B]`}>
          {isLoading
            ? "..."
            : `${totalCount} Pending`}
        </span>
      </div>

      {/* =========================
          Content
      ========================= */}
      <div className="divide-y divide-[#E4DFD3]">
        {/* =========================
            Loading
        ========================= */}
        {isLoading && (
          <div className="p-8 text-center">
            <div className="mx-auto h-7 w-7 animate-spin rounded-full border-2 border-[#E4DFD3] border-t-[#14213D]" />
            <p className={`${mono} mt-3 text-xs uppercase tracking-widest text-[#4A5568]`}>
              Loading requests...
            </p>
          </div>
        )}

        {/* =========================
            Error
        ========================= */}
        {isError && (
          <div className="bg-[#FFFDF9] p-8 text-center">
            <div className="mx-auto flex h-12 w-12 items-center justify-center border border-[#B8452E] text-xl text-[#B8452E]">
              ⚠️
            </div>
            <h3 className={`${serif} mt-3 font-semibold text-[#B8452E]`}>
              Failed to load requests
            </h3>
            <p className={`${mono} mt-1 text-xs text-[#4A5568]`}>
              Something went wrong while loading requests.
            </p>
          </div>
        )}

        {/* =========================
            Empty
        ========================= */}
        {!isLoading &&
          !isError &&
          recentRequests.length === 0 && (
            <div className="p-8 text-center">
              <div className="mx-auto flex h-12 w-12 items-center justify-center border border-[#14213D] text-xl">
                📋
              </div>
              <h3 className={`${serif} mt-3 font-semibold text-[#14213D]`}>
                No pending requests
              </h3>
              <p className={`${mono} mt-1 text-xs text-[#4A5568]`}>
                Customer requests for your properties will appear here.
              </p>
            </div>
          )}

        {/* =========================
            Requests List
        ========================= */}
        {!isLoading &&
          !isError &&
          recentRequests.map((request: any) => {
            const customerName = getCustomerName(request);
            const status = request.status || "PENDING";
            const customerId =
              request.user?.id ||
              request.user?.userId;

            return (
              <div
                key={`${request.typeKey}-${request.id}`}
                className="p-5 transition hover:bg-[#F7F5EF]"
              >
                <div className="flex items-start gap-3">
                  {/* Customer Avatar */}
                  {customerId ? (
                    <Link
                      to={`/agent/customer-profile/${customerId}`}
                      className={`${mono} flex h-10 w-10 shrink-0 items-center justify-center border border-[#14213D] bg-[#14213D] font-bold text-[#F7F5EF] transition hover:border-[#B8863B] hover:bg-[#B8863B]`}
                      title="View Customer Profile"
                    >
                      {customerName.charAt(0).toUpperCase()}
                    </Link>
                  ) : (
                    <div className={`${mono} flex h-10 w-10 shrink-0 items-center justify-center border border-[#14213D] bg-[#14213D] font-bold text-[#F7F5EF]`}>
                      {customerName.charAt(0).toUpperCase()}
                    </div>
                  )}

                  <div className="min-w-0 flex-1">
                    {/* Customer Header */}
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        {customerId ? (
                          <Link
                            to={`/agent/customer-profile/${customerId}`}
                            className={`${serif} block truncate font-semibold text-[#14213D] transition hover:text-[#B8863B]`}
                          >
                            {customerName}
                          </Link>
                        ) : (
                          <p className={`${serif} truncate font-semibold text-[#14213D]`}>
                            {customerName}
                          </p>
                        )}
                        <p className={`${mono} mt-0.5 text-[11px] text-[#4A5568]`}>
                          {request.requestType}
                        </p>
                      </div>

                      <span className={`${mono} shrink-0 border border-dashed border-[#B8863B] px-2 py-0.5 text-[9px] uppercase tracking-wider text-[#B8863B]`}>
                        {status}
                      </span>
                    </div>

                    {/* Property Card */}
                    <div className="mt-3 border border-[#E4DFD3] bg-[#F7F5EF]/60 p-3">
                      <p className={`${mono} text-[9px] font-medium uppercase tracking-wider text-[#4A5568]`}>
                        Property
                      </p>
                      <p className={`${serif} mt-0.5 truncate text-sm font-semibold text-[#14213D]`}>
                        {request.property?.title ||
                          request.propertyTitle ||
                          "Untitled Property"}
                      </p>
                      {request.property?.address && (
                        <p className={`${mono} mt-1 truncate text-xs text-[#4A5568]`}>
                          📍 {request.property.address}
                        </p>
                      )}
                    </div>

                    {/* Date */}
                    {request.createdAt && (
                      <p className={`${mono} mt-2 text-[10px] text-[#4A5568]`}>
                        {formatDate(request.createdAt)}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
      </div>

      {/* =========================
          Footer
      ========================= */}
      <div className="border-t border-[#14213D] bg-[#F7F5EF] p-4">
        <Link
          to="/agent/requests"
          className={`${mono} flex w-full items-center justify-center border border-[#14213D] bg-[#14213D] py-2.5 text-xs font-semibold uppercase tracking-wider text-[#F7F5EF] transition hover:border-[#B8863B] hover:bg-[#B8863B]`}
        >
          View All Requests →
        </Link>
      </div>
    </section>
  );
};

export default AgentRecentRequests;
