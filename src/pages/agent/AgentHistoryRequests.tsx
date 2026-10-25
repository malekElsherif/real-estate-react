import { useState } from "react";
import { Link } from "react-router-dom";
import { usegetpurchaseRequestsformyProperties } from "../../hooks/usepurchase-requests";
import { usegetrentalrequestsformyproperties } from "../../hooks/userental-requests";

const AgentHistoryRequests = () => {
  const {
    data: purchaseData,
    isLoading: purchaseLoading,
    isError: purchaseError,
    error: purchaseErrorObj,
  } = usegetpurchaseRequestsformyProperties();

  const {
    data: rentalData,
    isLoading: rentalLoading,
    isError: rentalError,
    error: rentalErrorObj,
  } = usegetrentalrequestsformyproperties();

  const [filterStatus, setFilterStatus] = useState<string>("ALL");

  const isLoading = purchaseLoading || rentalLoading;
  const isError = purchaseError || rentalError;
  const error = purchaseErrorObj || rentalErrorObj;

  // Purchase Requests
  const purchaseRequests: any[] = (purchaseData?.data ?? []).map(
    (item: any) => ({
      ...item,
      requestType: "Purchase request",
    })
  );

  // Rental Requests
  const rawRentals = Array.isArray(rentalData)
    ? rentalData
    : rentalData?.data ?? [];

  const rentalRequests: any[] = rawRentals.map((item: any) => ({
    ...item,
    requestType: "Rental request",
  }));

  // Merge requests
  const allRequests = [...purchaseRequests, ...rentalRequests];

  // History only (Exclude PENDING and CANCELLED)
  const historyRequests = allRequests
    .filter((req) => {
      const status = req.status?.trim().toUpperCase();
      return status !== "PENDING" && status !== "CANCELLED";
    })
    .sort((a, b) => {
      const dateA = new Date(
        a.updatedAt || a.createdAt || 0
      ).getTime();

      const dateB = new Date(
        b.updatedAt || b.createdAt || 0
      ).getTime();

      return dateB - dateA;
    });

  // Fixed Filter Logic
  const filteredRequests = historyRequests.filter((req) => {
    if (filterStatus === "ALL") return true;
    const currentStatus = req.status?.trim().toUpperCase();

    // Normalize ACCEPTED to APPROVED if backend uses mixed terms
    const normalizedStatus = currentStatus === "ACCEPTED" ? "APPROVED" : currentStatus;

    return normalizedStatus === filterStatus;
  });

  const formatDate = (date: string) => {
    if (!date) return "N/A";

    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  // Loading
  if (isLoading) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center rounded-2xl border border-stone-100 bg-white shadow-sm">
        <div className="text-center">
          <div className="mx-auto h-7 w-7 animate-spin rounded-full border-2 border-stone-200 border-t-amber-800" />
          <p className="mt-3 text-xs uppercase tracking-wider text-stone-500">
            Loading request archive...
          </p>
        </div>
      </div>
    );
  }

  // Error
  if (isError) {
    return (
      <div className="rounded-2xl border border-rose-200 bg-white p-8 text-center shadow-sm">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl border border-rose-200 text-xl text-rose-600">
          ⚠️
        </div>
        <h3 className="mt-3 text-lg font-bold text-rose-600">
          Failed to load request history
        </h3>
        <p className="mt-1 text-xs text-stone-500">
          {error?.message || "An error occurred while fetching archival requests."}
        </p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl space-y-6 p-4 text-stone-900">
      {/* Header */}
      <div className="flex flex-col gap-4 border-b border-stone-200 pb-6 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <span className="text-xs font-semibold uppercase tracking-wider text-amber-800">
            Archival Log
          </span>
          <h1 className="text-2xl font-bold tracking-tight md:text-3xl">
            Request History
          </h1>
          <p className="mt-1 text-xs text-stone-500">
            Processed estate purchase and rental transactions (Latest first).
          </p>
        </div>

        {/* Filters */}
        <div className="flex items-center gap-3">
          <div className="flex rounded-xl border border-stone-200 bg-stone-50 p-1">
            {/* ALL */}
            <button
              type="button"
              onClick={() => setFilterStatus("ALL")}
              className={`rounded-lg px-3 py-1.5 text-xs font-semibold uppercase tracking-wider transition cursor-pointer ${
                filterStatus === "ALL"
                  ? "bg-stone-900 text-white shadow-sm"
                  : "text-stone-700 hover:bg-stone-200/60"
              }`}
            >
              All ({historyRequests.length})
            </button>

            {/* APPROVED */}
            <button
              type="button"
              onClick={() => setFilterStatus("APPROVED")}
              className={`rounded-lg px-3 py-1.5 text-xs font-semibold uppercase tracking-wider transition cursor-pointer ${
                filterStatus === "APPROVED"
                  ? "bg-emerald-700 text-white shadow-sm"
                  : "text-emerald-700 hover:bg-stone-200/60"
              }`}
            >
              Approved
            </button>

            {/* REJECTED */}
            <button
              type="button"
              onClick={() => setFilterStatus("REJECTED")}
              className={`rounded-lg px-3 py-1.5 text-xs font-semibold uppercase tracking-wider transition cursor-pointer ${
                filterStatus === "REJECTED"
                  ? "bg-rose-600 text-white shadow-sm"
                  : "text-rose-600 hover:bg-stone-200/60"
              }`}
            >
              Rejected
            </button>
          </div>
        </div>
      </div>

      {/* Empty */}
      {filteredRequests.length === 0 ? (
        <div className="flex min-h-[250px] items-center justify-center rounded-2xl border border-dashed border-stone-300 bg-white p-8 text-center shadow-sm">
          <div>
            <span className="text-3xl">📜</span>
            <h2 className="mt-3 text-lg font-semibold text-stone-900">
              No Archived Requests Found
            </h2>
            <p className="mt-1 text-xs text-stone-500">
              No requests match the selected filter criteria.
            </p>
          </div>
        </div>
      ) : (
        /* Requests */
        <div className="rounded-2xl border border-stone-100 bg-white shadow-sm overflow-hidden">
          <div className="divide-y divide-stone-100">
            {filteredRequests.map((request) => {
              const statusUpper = request.status?.trim().toUpperCase();
              const isApproved =
                statusUpper === "APPROVED" || statusUpper === "ACCEPTED";

              const customerName =
                request.user?.name ||
                request.user?.username ||
                "Customer";

              const customerId =
                request.user?.id ||
                request.user?.userId;

              return (
                <div
                  key={`${request.requestType}-${request.id}`}
                  className="flex flex-col gap-4 p-5 transition hover:bg-stone-50 sm:flex-row sm:items-center sm:justify-between"
                >
                  {/* Customer + Property */}
                  <div className="flex min-w-0 items-start gap-4">
                    {/* Avatar */}
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-stone-900 text-xs font-bold text-white">
                      {customerName.charAt(0).toUpperCase()}
                    </div>

                    <div className="min-w-0 space-y-1">
                      {/* Customer */}
                      <div className="flex flex-wrap items-center gap-2">
                        {customerId ? (
                          <Link
                            to={`/agent/customer-profile/${customerId}`}
                            className="font-semibold text-stone-900 no-underline transition hover:text-amber-800"
                          >
                            {customerName}
                          </Link>
                        ) : (
                          <span className="font-semibold text-stone-900">
                            {customerName}
                          </span>
                        )}

                        <span className="text-xs text-stone-500">
                          ({request.user?.email || "No email"})
                        </span>
                      </div>

                      {/* Property */}
                      <p className="text-xs text-stone-700">
                        Property:{" "}
                        <span className="font-semibold text-stone-900">
                          {request.property?.title ||
                            request.propertyTitle ||
                            "Untitled Estate"}
                        </span>
                      </p>

                      {/* Request Type + Date */}
                      <div className="flex flex-wrap items-center gap-3">
                        <span className="text-xs font-semibold uppercase text-amber-800">
                          {request.requestType}
                        </span>
                        <span className="text-xs text-stone-500">
                          • Processed Date:{" "}
                          {formatDate(request.updatedAt || request.createdAt)}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center justify-between gap-3 sm:justify-end">
                    {/* Status */}
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-wider ${
                        isApproved
                          ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                          : "bg-rose-50 text-rose-600 border border-rose-200"
                      }`}
                    >
                      {request.status}
                    </span>

                    {/* Chat */}
                    {customerId && (
                      <Link
                        to={`/chat/${customerId}`}
                        className="inline-flex items-center gap-2 rounded-xl bg-stone-900 px-4 py-2 text-xs font-semibold uppercase tracking-wider text-white no-underline transition hover:bg-amber-800"
                      >
                        <span>💬</span>
                        Chat
                      </Link>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default AgentHistoryRequests;
