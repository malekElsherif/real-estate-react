import {
  useapprovePurchaseRequestformyProperties,
  useRejectpurchaseRequestsformyProperties,
} from "../../hooks/usepurchase-requests";
import {
  useapproverequestformyproperty,
  userejectrequestformyproperty,
} from "../../hooks/userental-requests";
import { useQueryClient } from "@tanstack/react-query";

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
        className="flex items-center justify-center gap-1.5 rounded-xl bg-stone-900 px-3 py-1.5 text-xs font-semibold uppercase tracking-wider text-white transition hover:bg-amber-800 disabled:opacity-50 cursor-pointer"
      >
        {isApproving ? (
          <>
            <div className="h-3 w-3 animate-spin rounded-full border-2 border-white border-t-transparent" />
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
        className="flex items-center justify-center gap-1.5 rounded-xl border border-rose-200 bg-rose-50 px-3 py-1.5 text-xs font-semibold uppercase tracking-wider text-rose-600 transition hover:bg-rose-100 disabled:opacity-50 cursor-pointer"
      >
        {isRejecting ? (
          <>
            <div className="h-3 w-3 animate-spin rounded-full border-2 border-rose-600 border-t-transparent" />
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
