import  { useState } from "react";
import { Link } from "react-router-dom";
import { usegetpurchaseRequestsformyProperties } from "../../hooks/usepurchase-requests";
import { usegetrentalrequestsformyproperties } from "../../hooks/userental-requests";

const serif = "[font-family:'Fraunces',serif]";
const mono = "[font-family:'IBM_Plex_Mono',monospace]";

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
      <div className="flex min-h-[40vh] items-center justify-center border border-[#14213D] bg-[#FFFDF9]">
        <div className="text-center">
          <div className="mx-auto h-7 w-7 animate-spin rounded-full border-2 border-[#E4DFD3] border-t-[#14213D]" />

          <p
            className={`${mono} mt-3 text-xs uppercase tracking-widest text-[#4A5568]`}
          >
            Loading request archive...
          </p>
        </div>
      </div>
    );
  }

  // Error
  if (isError) {
    return (
      <div className="border border-[#B8452E] bg-[#FFFDF9] p-8 text-center">
        <div className="mx-auto flex h-12 w-12 items-center justify-center border border-[#B8452E] text-xl text-[#B8452E]">
          ⚠️
        </div>

        <h3
          className={`${serif} mt-3 text-lg font-semibold text-[#B8452E]`}
        >
          Failed to load request history
        </h3>

        <p className={`${mono} mt-1 text-xs text-[#4A5568]`}>
          {error?.message ||
            "An error occurred while fetching archival requests."}
        </p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl space-y-6 p-4">
      {/* Header */}
      <div className="flex flex-col gap-4 border-b border-[#14213D] pb-6 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <span
            className={`${mono} text-[10px] uppercase tracking-[0.2em] text-[#B8863B]`}
          >
            Archival Log
          </span>

          <h1
            className={`${serif} text-2xl font-semibold text-[#14213D] md:text-3xl`}
          >
            Request History
          </h1>

          <p className={`${mono} mt-1 text-xs text-[#4A5568]`}>
            Processed estate purchase and rental transactions (Latest first).
          </p>
        </div>

        {/* Filters */}
        <div className="flex items-center gap-3">
          <div className="flex border border-[#14213D] bg-[#F7F5EF] p-1">
            {/* ALL */}
            <button
              type="button"
              onClick={() => setFilterStatus("ALL")}
              className={`${mono} px-3 py-1 text-[10px] font-semibold uppercase tracking-wider transition ${
                filterStatus === "ALL"
                  ? "bg-[#14213D] text-[#F7F5EF]"
                  : "text-[#14213D] hover:bg-[#E4DFD3]"
              }`}
            >
              All ({historyRequests.length})
            </button>

            {/* APPROVED */}
            <button
              type="button"
              onClick={() => setFilterStatus("APPROVED")}
              className={`${mono} px-3 py-1 text-[10px] font-semibold uppercase tracking-wider transition ${
                filterStatus === "APPROVED"
                  ? "bg-[#2D6A4F] text-[#F7F5EF]"
                  : "text-[#2D6A4F] hover:bg-[#E4DFD3]"
              }`}
            >
              Approved
            </button>

            {/* REJECTED */}
            <button
              type="button"
              onClick={() => setFilterStatus("REJECTED")}
              className={`${mono} px-3 py-1 text-[10px] font-semibold uppercase tracking-wider transition ${
                filterStatus === "REJECTED"
                  ? "bg-[#B8452E] text-[#F7F5EF]"
                  : "text-[#B8452E] hover:bg-[#E4DFD3]"
              }`}
            >
              Rejected
            </button>
          </div>
        </div>
      </div>

      {/* Empty */}
      {filteredRequests.length === 0 ? (
        <div className="flex min-h-[250px] items-center justify-center border border-dashed border-[#14213D] bg-[#FFFDF9] p-8 text-center">
          <div>
            <span className="text-3xl">📜</span>

            <h2
              className={`${serif} mt-3 text-lg font-medium text-[#14213D]`}
            >
              No Archived Requests Found
            </h2>

            <p className={`${mono} mt-1 text-xs text-[#4A5568]`}>
              No requests match the selected filter criteria.
            </p>
          </div>
        </div>
      ) : (
        /* Requests */
        <div className="border border-[#14213D] bg-[#FFFDF9]">
          <div className="divide-y divide-[#E4DFD3]">
            {filteredRequests.map((request) => {
              const statusUpper = request.status
                ?.trim()
                .toUpperCase();

              const isApproved =
                statusUpper === "APPROVED" ||
                statusUpper === "ACCEPTED";

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
                  className="flex flex-col gap-4 p-5 transition hover:bg-[#F7F5EF] sm:flex-row sm:items-center sm:justify-between"
                >
                  {/* Customer + Property */}
                  <div className="flex min-w-0 items-start gap-4">
                    {/* Avatar */}
                    <div
                      className={`${mono} flex h-10 w-10 shrink-0 items-center justify-center border border-[#14213D] bg-[#14213D] text-xs font-bold text-[#F7F5EF]`}
                    >
                      {customerName.charAt(0).toUpperCase()}
                    </div>

                    <div className="min-w-0 space-y-1">
                      {/* Customer */}
                      <div className="flex flex-wrap items-center gap-2">
                        {customerId ? (
                          <Link
                            to={`/agent/customer-profile/${customerId}`}
                            className={`${serif} font-semibold text-[#14213D] transition hover:text-[#B8863B]`}
                          >
                            {customerName}
                          </Link>
                        ) : (
                          <span
                            className={`${serif} font-semibold text-[#14213D]`}
                          >
                            {customerName}
                          </span>
                        )}

                        <span
                          className={`${mono} text-[10px] text-[#4A5568]`}
                        >
                          ({request.user?.email || "No email"})
                        </span>
                      </div>

                      {/* Property */}
                      <p
                        className={`${mono} text-xs text-[#14213D]`}
                      >
                        Property:{" "}
                        <span className="font-semibold">
                          {request.property?.title ||
                            request.propertyTitle ||
                            "Untitled Estate"}
                        </span>
                      </p>

                      {/* Request Type + Date */}
                      <div className="flex flex-wrap items-center gap-3">
                        <span
                          className={`${mono} text-[10px] font-semibold uppercase text-[#B8863B]`}
                        >
                          {request.requestType}
                        </span>

                        <span
                          className={`${mono} text-[10px] text-[#4A5568]`}
                        >
                          • Processed Date:{" "}
                          {formatDate(
                            request.updatedAt ||
                              request.createdAt
                          )}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center justify-between gap-3 sm:justify-end">
                    {/* Status */}
                    <span
                      className={`${mono} border px-3 py-1 text-[10px] font-semibold uppercase tracking-wider ${
                        isApproved
                          ? "border-[#2D6A4F] bg-[#E8F5E9] text-[#2D6A4F]"
                          : "border-[#B8452E] bg-[#FFEBEE] text-[#B8452E]"
                      }`}
                    >
                      {request.status}
                    </span>

                    {/* Chat */}
                    {customerId && (
                      <Link
                        to={`/agent/chat/${customerId}`}
                        className={`${mono} inline-flex items-center gap-2 border border-[#14213D] bg-[#14213D] px-4 py-2 text-[10px] font-semibold uppercase tracking-wider text-[#F7F5EF] transition hover:border-[#B8863B] hover:bg-[#B8863B]`}
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
