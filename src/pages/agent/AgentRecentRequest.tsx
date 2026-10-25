import { Link } from "react-router-dom";
import { usegetPendingpurchaseRequests } from "../../hooks/usepurchase-requests";
import { usegetrentalrequestsformyproperties } from "../../hooks/userental-requests";

const AgentRecentRequests = () => {
  const { data: pendingRequest, isLoading: purchaseLoading, isError: purchaseError } = usegetPendingpurchaseRequests();
  const { data: rentalRequest, isLoading: rentalLoading, isError: rentalError } = usegetrentalrequestsformyproperties();

  // Safe Data Extraction & Normalization
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

  // Helpers
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
    <section className="rounded-2xl border border-stone-100 bg-white shadow-sm overflow-hidden text-stone-900">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-stone-100 bg-stone-50/50 p-5 sm:p-6">
        <div>
          <span className="text-[10px] font-semibold uppercase tracking-wider text-amber-800">
            Overview
          </span>
          <h2 className="text-lg font-bold tracking-tight text-stone-900">
            Recent Requests
          </h2>
          <p className="mt-0.5 text-xs text-stone-500">
            Latest customer requests
          </p>
        </div>

        <span className="rounded-full border border-amber-200 bg-amber-50 px-3 py-1 text-[10px] font-semibold uppercase tracking-wider text-amber-800">
          {isLoading
            ? "..."
            : `${totalCount} Pending`}
        </span>
      </div>

      {/* Content */}
      <div className="divide-y divide-stone-100">
        {/* Loading */}
        {isLoading && (
          <div className="p-8 text-center">
            <div className="mx-auto h-7 w-7 animate-spin rounded-full border-2 border-stone-200 border-t-amber-800" />
            <p className="mt-3 text-xs uppercase tracking-wider text-stone-500">
              Loading requests...
            </p>
          </div>
        )}

        {/* Error */}
        {isError && (
          <div className="bg-white p-8 text-center">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl border border-rose-200 text-xl text-rose-600">
              ⚠️
            </div>
            <h3 className="mt-3 font-semibold text-rose-600">
              Failed to load requests
            </h3>
            <p className="mt-1 text-xs text-stone-500">
              Something went wrong while loading requests.
            </p>
          </div>
        )}

        {/* Empty */}
        {!isLoading &&
          !isError &&
          recentRequests.length === 0 && (
            <div className="p-8 text-center">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl border border-stone-200 bg-stone-50 text-xl">
                📋
              </div>
              <h3 className="mt-3 font-semibold text-stone-900">
                No pending requests
              </h3>
              <p className="mt-1 text-xs text-stone-500">
                Customer requests for your properties will appear here.
              </p>
            </div>
          )}

        {/* Requests List */}
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
                className="p-5 transition hover:bg-stone-50"
              >
                <div className="flex items-start gap-3">
                  {/* Customer Avatar */}
                  {customerId ? (
                    <Link
                      to={`/agent/customer-profile/${customerId}`}
                      className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-stone-900 font-bold text-white no-underline transition hover:bg-amber-800"
                      title="View Customer Profile"
                    >
                      {customerName.charAt(0).toUpperCase()}
                    </Link>
                  ) : (
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-stone-900 font-bold text-white">
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
                            className="block truncate font-semibold text-stone-900 no-underline transition hover:text-amber-800"
                          >
                            {customerName}
                          </Link>
                        ) : (
                          <p className="truncate font-semibold text-stone-900">
                            {customerName}
                          </p>
                        )}
                        <p className="mt-0.5 text-[11px] text-stone-500">
                          {request.requestType}
                        </p>
                      </div>

                      <span className="shrink-0 rounded-full border border-amber-200 bg-amber-50 px-2.5 py-0.5 text-[9px] font-semibold uppercase tracking-wider text-amber-800">
                        {status}
                      </span>
                    </div>

                    {/* Property Card */}
                    <div className="mt-3 rounded-xl border border-stone-200 bg-stone-50 p-3">
                      <p className="text-[9px] font-semibold uppercase tracking-wider text-stone-400">
                        Property
                      </p>
                      <p className="mt-0.5 truncate text-sm font-bold text-stone-900">
                        {request.property?.title ||
                          request.propertyTitle ||
                          "Untitled Property"}
                      </p>
                      {request.property?.address && (
                        <p className="mt-1 truncate text-xs text-stone-500">
                          📍 {request.property.address}
                        </p>
                      )}
                    </div>

                    {/* Date */}
                    {request.createdAt && (
                      <p className="mt-2 text-[10px] text-stone-400">
                        {formatDate(request.createdAt)}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
      </div>

      {/* Footer */}
      <div className="border-t border-stone-100 bg-stone-50/50 p-4">
        <Link
          to="/agent/requests"
          className="flex w-full items-center justify-center rounded-xl bg-stone-900 py-2.5 text-xs font-semibold uppercase tracking-wider text-white no-underline transition hover:bg-amber-800"
        >
          View All Requests →
        </Link>
      </div>
    </section>
  );
};

export default AgentRecentRequests;
