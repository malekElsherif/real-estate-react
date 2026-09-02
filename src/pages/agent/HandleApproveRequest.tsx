import React from "react";
import {
  useapprovePurchaseRequestformyProperties,
  useRejectpurchaseRequestsformyProperties,
} from "../../hooks/usepurchase-requests";
import {
  useapproverequestformyproperty,
  userejectrequestformyproperty,
} from "../../hooks/userental-requests";
import { useQueryClient } from "@tanstack/react-query";

const mono = "[font-family:'IBM_Plex_Mono',monospace]";

interface HandleRequestProps {
  id: number;
  type?: "SALE" | "RENT"; // لتحديد نوع الطلب (بيع أو إيجار)
}

const HandleApproveRequest: React.FC<HandleRequestProps> = ({ id, type }) => {
  const queryclient = useQueryClient();

  // هوكس الشراء
  const { mutate: approvePurchase, isPending: isApprovingPurchase } =
    useapprovePurchaseRequestformyProperties(id);
  const { mutate: rejectPurchase, isPending: isRejectingPurchase } =
    useRejectpurchaseRequestsformyProperties(id);

  // هوكس الإيجار
  const { mutate: approveRental, isPending: isApprovingRental } =
    useapproverequestformyproperty(id);
  const { mutate: rejectRental, isPending: isRejectingRental } =
    userejectrequestformyproperty(id);

  // تحديد حالات التحميل بناءً على نوع الطلب (SALE أو RENT)
  const isApproving = type === "SALE" ? isApprovingPurchase : isApprovingRental;
  const isRejecting = type === "SALE" ? isRejectingPurchase : isRejectingRental;

  const handleApprove = () => {
    const action = type === "SALE" ? approvePurchase : approveRental;

    action(undefined, {
      onSuccess: () => {
        queryclient.invalidateQueries({
          queryKey: [
            type === "SALE"
              ? "getmyrentalrequestsformyproperties"
              : "getmyrentalrequestsformyproperties",
          ],
        });
      },
    });
  };

  const handleReject = () => {
    const action = type === "SALE" ? rejectPurchase : rejectRental;

    action(undefined, {
      onSuccess: () => {
        queryclient.invalidateQueries({
          queryKey: [
            type === "SALE"
              ? "getPendingpurchaseRequests"
              : "getRentalRequestsForMyProperties",
          ],
        });
      },
    });
  };

  return (
    <div className="flex items-center gap-2">
      {/* زر الموافقة */}
      <button
        type="button"
        disabled={isApproving || isRejecting}
        onClick={handleApprove}
        className={`${mono} flex items-center justify-center gap-1.5 border border-[#14213D] bg-[#14213D] px-3 py-1.5 text-xs font-semibold uppercase tracking-wider text-[#F7F5EF] transition hover:bg-[#B8863B] hover:border-[#B8863B] disabled:opacity-50`}
      >
        {isApproving ? (
          <>
            <div className="h-3 w-3 animate-spin rounded-full border border-[#F7F5EF] border-t-transparent" />
            <span>Approving...</span>
          </>
        ) : (
          <>
            <span>✓</span>
            <span>Approve</span>
          </>
        )}
      </button>

      {/* زر الرفض */}
      <button
        type="button"
        disabled={isApproving || isRejecting}
        onClick={handleReject}
        className={`${mono} flex items-center justify-center gap-1.5 border border-[#B8452E] bg-transparent px-3 py-1.5 text-xs font-semibold uppercase tracking-wider text-[#B8452E] transition hover:bg-[#B8452E] hover:text-[#F7F5EF] disabled:opacity-50`}
      >
        {isRejecting ? (
          <>
            <div className="h-3 w-3 animate-spin rounded-full border border-[#B8452E] border-t-transparent" />
            <span>Rejecting...</span>
          </>
        ) : (
          <>
            <span>✕</span>
            <span>Reject</span>
          </>
        )}
      </button>
    </div>
  );
};

export default HandleApproveRequest;
