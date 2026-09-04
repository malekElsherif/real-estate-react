import { useState } from "react";
import { Dialog, DialogContent, IconButton } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { usegetmypurchaseRequests } from "../../hooks/usepurchase-requests";

const FontImports = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,400;9..144,500;9..144,600;9..144,700&family=Inter:wght@400;500;600&family=IBM+Plex+Mono:wght@400;500;600&display=swap');
  `}</style>
);

const serif = "[font-family:'Fraunces',serif]";
const mono = "[font-family:'IBM_Plex_Mono',monospace]";

type FilterTab = "ALL" | "APPROVED" | "PENDING" | "CANCELLED";

const UserRequestHistory = () => {
  const { data, isLoading, error } = usegetmypurchaseRequests();

  const [selectedRequest, setSelectedRequest] = useState<any>(null);
  const [open, setOpen] = useState(false);
  const [activeTab, setActiveTab] =
    useState<FilterTab>("ALL");

  const requests: any[] = data?.data ?? [];

  const handleOpen = (request: any) => {
    setSelectedRequest(request);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedRequest(null);
  };

  // تجميع الطلبات حسب الحالة
  const approvedRequests = requests.filter(
    (r) => r.status?.toLowerCase() === "approved"
  );

  const pendingRequests = requests.filter(
    (r) =>
      !r.status ||
      r.status?.toLowerCase() === "pending"
  );

  const cancelledOrRejectedRequests = requests.filter(
    (r) => {
      const s = r.status?.toLowerCase();

      return (
        s === "cancelled" ||
        s === "rejected"
      );
    }
  );

  if (isLoading) {
    return (
      <div className="flex justify-center py-16">
        <div className="h-8 w-8 animate-spin border-2 border-[#14213D] border-t-[#B8863B]" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="border border-[#14213D] bg-[#FFFDF9] p-8 text-center text-[#14213D]">
        <p
          className={`${serif} text-lg font-semibold`}
        >
          Failed to load your purchase requests
        </p>

        <p
          className={`${mono} mt-2 text-xs uppercase tracking-wider text-[#4A5568]`}
        >
          Please refresh or try again later.
        </p>
      </div>
    );
  }

  if (requests.length === 0) {
    return (
      <div className="relative border border-[#14213D] bg-[#FFFDF9] p-12 text-center text-[#14213D]">
        <span className="pointer-events-none absolute -left-px -top-px h-3 w-3 border-l-2 border-t-2 border-[#14213D]" />

        <span className="pointer-events-none absolute -right-px -top-px h-3 w-3 border-r-2 border-t-2 border-[#14213D]" />

        <div
          className={`${mono} mx-auto flex h-12 w-12 items-center justify-center border border-[#14213D] bg-[#EFEAE0] text-sm font-semibold`}
        >
          00
        </div>

        <h3
          className={`${serif} mt-4 text-xl font-semibold`}
        >
          No Requests Recorded
        </h3>

        <p
          className={`${mono} mt-2 text-xs uppercase tracking-wider text-[#4A5568]`}
        >
          You haven't submitted any property purchase requests
          yet.
        </p>
      </div>
    );
  }

  // مكون فرعي لرسم كارت الطلب
  const RequestCard = ({
    request,
  }: {
    request: any;
  }) => {
    const property =
      request.property ?? request;

    const status =
      request.status?.toLowerCase() ??
      "pending";

    return (
      <button
        type="button"
        onClick={() => handleOpen(request)}
        className="group relative block w-full border border-[#14213D] bg-[#FFFDF9] p-5 text-left transition hover:border-[#B8863B] hover:bg-[#F7F5EF]"
      >
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="min-w-0">
            <h3
              className={`${serif} truncate text-lg font-semibold text-[#14213D] transition-colors group-hover:text-[#B8863B]`}
            >
              {property.title ||
                "Untitled Property"}
            </h3>

            <p
              className={`${mono} mt-1 text-xs text-[#4A5568]`}
            >
              LOC:{" "}
              {property.city ||
                property.address ||
                "Location Unspecified"}
            </p>

            {property.price && (
              <p
                className={`${mono} mt-2 text-xs font-semibold tracking-wider text-[#14213D]`}
              >
                VALUATION:{" "}
                {Number(
                  property.price
                ).toLocaleString()}{" "}
                EGP
              </p>
            )}

            {request.createdAt && (
              <p
                className={`${mono} mt-1 text-[11px] uppercase tracking-wider text-[#4A5568]/80`}
              >
                SUBMITTED:{" "}
                {new Date(
                  request.createdAt
                ).toLocaleDateString()}
              </p>
            )}
          </div>

          <div className="shrink-0">
            <span
              className={`${mono} inline-block border px-3 py-1 text-[11px] font-semibold uppercase tracking-widest ${
                status === "approved"
                  ? "border-[#14213D] bg-[#14213D] text-[#FFFDF9]"
                  : status === "rejected"
                    ? "border-red-800 bg-red-100 text-red-900"
                    : status === "cancelled"
                      ? "border-slate-300 bg-slate-100 text-slate-600"
                      : "border-[#B8863B] bg-[#B8863B]/10 text-[#B8863B]"
              }`}
            >
              {status}
            </span>
          </div>
        </div>
      </button>
    );
  };

  const tabs: {
    id: FilterTab;
    label: string;
    count: number;
  }[] = [
    {
      id: "ALL",
      label: "All Logs",
      count: requests.length,
    },
    {
      id: "APPROVED",
      label: "Approved",
      count: approvedRequests.length,
    },
    {
      id: "PENDING",
      label: "Pending",
      count: pendingRequests.length,
    },
    {
      id: "CANCELLED",
      label: "Cancelled & Rejected",
      count: cancelledOrRejectedRequests.length,
    },
  ];

  return (
    <>
      <FontImports />

      {/* ================= REQUEST HISTORY CONTAINER ================= */}
      <div className="relative border border-[#14213D] bg-[#FFFDF9] p-6 md:p-8">
        <span className="pointer-events-none absolute -left-px -top-px h-3 w-3 border-l-2 border-t-2 border-[#14213D]" />

        <span className="pointer-events-none absolute -right-px -top-px h-3 w-3 border-r-2 border-t-2 border-[#14213D]" />

        {/* Header */}
        <div className="flex flex-col gap-4 border-b border-[#14213D] pb-6 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <span
              className={`${mono} text-xs font-semibold uppercase tracking-[0.2em] text-[#B8863B]`}
            >
              Portfolio Activity
            </span>

            <h2
              className={`${serif} mt-1 text-2xl font-semibold text-[#14213D]`}
            >
              Purchase Requests
            </h2>
          </div>

          <span
            className={`${mono} inline-flex items-center border border-[#14213D] bg-[#EFEAE0] px-3 py-1 text-xs font-semibold uppercase tracking-wider text-[#14213D]`}
          >
            {requests.length} Total Logs
          </span>
        </div>

        {/* Navigation / Filter Tabs */}
        <div className="mt-6 flex flex-wrap gap-2 border-b border-[#14213D]/20 pb-4">
          {tabs.map((tab) => {
            const isActive =
              activeTab === tab.id;

            return (
              <button
                key={tab.id}
                type="button"
                onClick={() =>
                  setActiveTab(tab.id)
                }
                className={`${mono} flex items-center gap-2 border px-4 py-2 text-xs font-semibold uppercase tracking-wider transition-all ${
                  isActive
                    ? "border-[#14213D] bg-[#14213D] text-[#FFFDF9]"
                    : "border-[#14213D]/30 bg-[#FFFDF9] text-[#14213D] hover:border-[#14213D] hover:bg-[#EFEAE0]"
                }`}
              >
                <span>{tab.label}</span>

                <span
                  className={`inline-block border px-1.5 py-0.5 text-[10px] ${
                    isActive
                      ? "border-[#B8863B] bg-[#B8863B] text-[#14213D]"
                      : "border-[#14213D]/20 bg-[#EFEAE0] text-[#14213D]"
                  }`}
                >
                  {tab.count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Tab Content Rendering */}
        <div className="mt-6 space-y-8">
          {/* ALL TABS VIEW */}
          {activeTab === "ALL" && (
            <div className="space-y-10">
              {approvedRequests.length > 0 && (
                <div className="space-y-4">
                  <div className="flex items-center gap-3 border-b border-[#14213D]/20 pb-2">
                    <span className="h-2 w-2 bg-[#14213D]" />

                    <h3
                      className={`${mono} text-xs font-semibold uppercase tracking-widest text-[#14213D]`}
                    >
                      Approved Requests (
                      {approvedRequests.length})
                    </h3>
                  </div>

                  <div className="space-y-3">
                    {approvedRequests.map(
                      (req) => (
                        <RequestCard
                          key={req.id}
                          request={req}
                        />
                      )
                    )}
                  </div>
                </div>
              )}

              {pendingRequests.length > 0 && (
                <div className="space-y-4">
                  <div className="flex items-center gap-3 border-b border-[#14213D]/20 pb-2">
                    <span className="h-2 w-2 bg-[#B8863B]" />

                    <h3
                      className={`${mono} text-xs font-semibold uppercase tracking-widest text-[#B8863B]`}
                    >
                      Pending Requests (
                      {pendingRequests.length})
                    </h3>
                  </div>

                  <div className="space-y-3">
                    {pendingRequests.map(
                      (req) => (
                        <RequestCard
                          key={req.id}
                          request={req}
                        />
                      )
                    )}
                  </div>
                </div>
              )}

              {cancelledOrRejectedRequests.length >
                0 && (
                <div className="space-y-4">
                  <div className="flex items-center gap-3 border-b border-[#14213D]/20 pb-2">
                    <span className="h-2 w-2 bg-red-800" />

                    <h3
                      className={`${mono} text-xs font-semibold uppercase tracking-widest text-red-900`}
                    >
                      Cancelled & Rejected (
                      {
                        cancelledOrRejectedRequests.length
                      }
                      )
                    </h3>
                  </div>

                  <div className="space-y-3">
                    {cancelledOrRejectedRequests.map(
                      (req) => (
                        <RequestCard
                          key={req.id}
                          request={req}
                        />
                      )
                    )}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* APPROVED SINGLE VIEW */}
          {activeTab === "APPROVED" && (
            <div className="space-y-3">
              {approvedRequests.length ===
              0 ? (
                <p
                  className={`${mono} py-8 text-center text-xs uppercase text-[#4A5568]`}
                >
                  No approved requests
                  found.
                </p>
              ) : (
                approvedRequests.map(
                  (req) => (
                    <RequestCard
                      key={req.id}
                      request={req}
                    />
                  )
                )
              )}
            </div>
          )}

          {/* PENDING SINGLE VIEW */}
          {activeTab === "PENDING" && (
            <div className="space-y-3">
              {pendingRequests.length === 0 ? (
                <p
                  className={`${mono} py-8 text-center text-xs uppercase text-[#4A5568]`}
                >
                  No pending requests
                  found.
                </p>
              ) : (
                pendingRequests.map(
                  (req) => (
                    <RequestCard
                      key={req.id}
                      request={req}
                    />
                  )
                )
              )}
            </div>
          )}

          {/* CANCELLED & REJECTED SINGLE VIEW */}
          {activeTab === "CANCELLED" && (
            <div className="space-y-3">
              {cancelledOrRejectedRequests.length ===
              0 ? (
                <p
                  className={`${mono} py-8 text-center text-xs uppercase text-[#4A5568]`}
                >
                  No cancelled or
                  rejected requests
                  found.
                </p>
              ) : (
                cancelledOrRejectedRequests.map(
                  (req) => (
                    <RequestCard
                      key={req.id}
                      request={req}
                    />
                  )
                )
              )}
            </div>
          )}
        </div>
      </div>

      {/* ================= REQUEST DETAILS DIALOG ================= */}
      <Dialog
        open={open}
        onClose={handleClose}
        fullWidth
        maxWidth="sm"
        slotProps={{
          paper: {
            sx: {
              borderRadius: 0,
              border: "1px solid #14213D",
              backgroundColor: "#FFFDF9",
              boxShadow: "none",
            },
          },
        }}
      >
        <DialogContent className="!p-0">
          {selectedRequest &&
            (() => {
              const property =
                selectedRequest.property ??
                selectedRequest;

              const status =
                selectedRequest.status?.toLowerCase() ??
                "pending";

              return (
                <div className="relative text-[#14213D]">
                  <IconButton
                    onClick={handleClose}
                    className="!absolute !right-4 !top-4 !z-10 !rounded-none !border !border-[#14213D] !bg-[#FFFDF9] !p-1.5 hover:!bg-[#EFEAE0]"
                  >
                    <CloseIcon className="!text-sm !text-[#14213D]" />
                  </IconButton>

                  <div className="border-b border-[#14213D] bg-[#14213D] px-8 py-6 text-[#F7F5EF]">
                    <span
                      className={`${mono} text-xs uppercase tracking-widest text-[#B8863B]`}
                    >
                      Request Reference #
                      {selectedRequest.id}
                    </span>

                    <h2
                      className={`${serif} mt-2 pr-8 text-2xl font-semibold`}
                    >
                      {property.title ||
                        "Property Details"}
                    </h2>

                    <p
                      className={`${mono} mt-1 text-xs text-[#EFEAE0]`}
                    >
                      LOC:{" "}
                      {property.city ||
                        property.address ||
                        "Location Unspecified"}
                    </p>
                  </div>

                  <div className="space-y-6 p-8">
                    <div className="border border-[#14213D] bg-[#F7F5EF] p-4">
                      <p
                        className={`${mono} text-[11px] font-semibold uppercase tracking-widest text-[#4A5568]`}
                      >
                        Current Processing
                        Status
                      </p>

                      <span
                        className={`${mono} mt-2 inline-block border px-3 py-1 text-xs font-semibold uppercase tracking-widest ${
                          status ===
                          "approved"
                            ? "border-[#14213D] bg-[#14213D] text-[#FFFDF9]"
                            : status ===
                                "rejected"
                              ? "border-red-800 bg-red-100 text-red-900"
                              : status ===
                                  "cancelled"
                                ? "border-slate-300 bg-slate-100 text-slate-600"
                                : "border-[#B8863B] bg-[#B8863B]/20 text-[#B8863B]"
                        }`}
                      >
                        {status}
                      </span>
                    </div>

                    <div className="grid gap-4 sm:grid-cols-2">
                      {property.price && (
                        <div className="border border-[#14213D]/20 p-4">
                          <p
                            className={`${mono} text-[11px] font-semibold uppercase tracking-widest text-[#4A5568]`}
                          >
                            Listed Valuation
                          </p>

                          <p
                            className={`${serif} mt-1 text-lg font-semibold text-[#14213D]`}
                          >
                            {Number(
                              property.price
                            ).toLocaleString()}{" "}
                            EGP
                          </p>
                        </div>
                      )}

                      <div className="border border-[#14213D]/20 p-4">
                        <p
                          className={`${mono} text-[11px] font-semibold uppercase tracking-widest text-[#4A5568]`}
                        >
                          Location Address
                        </p>

                        <p className="mt-1 text-xs font-medium text-[#14213D]">
                          {property.address ||
                            property.city ||
                            "Not available"}
                        </p>
                      </div>

                      {selectedRequest.createdAt && (
                        <div className="border border-[#14213D]/20 p-4 sm:col-span-2">
                          <p
                            className={`${mono} text-[11px] font-semibold uppercase tracking-widest text-[#4A5568]`}
                          >
                            Timestamp
                          </p>

                          <p
                            className={`${mono} mt-1 text-xs text-[#14213D]`}
                          >
                            {new Date(
                              selectedRequest.createdAt
                            ).toLocaleString()}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex justify-end border-t border-[#14213D] bg-[#F7F5EF] px-8 py-4">
                    <button
                      type="button"
                      onClick={handleClose}
                      className={`${mono} border border-[#14213D] bg-[#14213D] px-6 py-2.5 text-xs font-semibold uppercase tracking-wider text-[#FFFDF9] transition hover:border-[#B8863B] hover:bg-[#B8863B]`}
                    >
                      Close Log
                    </button>
                  </div>
                </div>
              );
            })()}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default UserRequestHistory;
