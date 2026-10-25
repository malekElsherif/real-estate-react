import { useQueryClient } from "@tanstack/react-query";
import {
  useCanclePurchaseRequest,
  usegetmypurchaseRequests,
  useMakePurchaseRequests,
} from "../../hooks/usepurchase-requests";
import { usegetme } from "../../hooks/useUsers";
import {
  usecanclemyrenaltrequest,
  usecreaterentalrequests,
  usegetmyrentalrequests,
} from "../../hooks/userental-requests";

type Props = { id: number; type: "SALE" | "RENT"; isAvailable?: boolean };

const pill = "inline-block rounded-full px-3 py-1.5 text-xs font-medium";

const RequestCancle = ({ id, type, isAvailable }: Props) => {
  const { data: userData, isLoading: userLoading } = usegetme();
  const qc = useQueryClient();

  const role = userData?.data?.role;
  const isSale = type === "SALE";

  const { data: purchaseData } = usegetmypurchaseRequests({ enabled: Boolean(isAvailable) && isSale });
  const { data: rentalData } = usegetmyrentalrequests({ enabled: Boolean(isAvailable) && !isSale });

  const list = (isSale ? purchaseData : rentalData)?.data;
  const current = (Array.isArray(list) ? list : []).find(
    (r: any) => Number(r?.property?.id) === Number(id) && r?.status?.toString().toUpperCase() === "PENDING"
  );
  const hasRequest = Boolean(current);
  const requestId = current?.id;

  const { mutate: makePurchase, isPending: makingP } = useMakePurchaseRequests(id);
  const { mutate: makeRental, isPending: makingR } = usecreaterentalrequests(id);
  const { mutate: cancelPurchase, isPending: cancellingP } = useCanclePurchaseRequest(requestId!);
  const { mutate: cancelRental, isPending: cancellingR } = usecanclemyrenaltrequest(requestId!);

  if (userLoading) return <span className="text-xs text-stone-400">Loading…</span>;

  if (role === "AGENT" || role === "ADMIN") {
    return (
      <span className={`${pill} bg-amber-50 text-amber-900`}>
        {role === "ADMIN" ? "Admin view" : "Agent view"}
      </span>
    );
  }

  if (!isAvailable && !hasRequest) {
    return <span className={`${pill} bg-stone-100 text-stone-500`}>{isSale ? "Sold out" : "Rented / unavailable"}</span>;
  }

  const making = makingP || makingR;
  const cancelling = cancellingP || cancellingR;

  const opts = {
    onSuccess: () => qc.invalidateQueries({ queryKey: [isSale ? "getmypurchaseRequests" : "getmyrentalrequests"] }),
  };

  const handleClick = () => {
    if (hasRequest) return isSale ? cancelPurchase(undefined, opts) : cancelRental(undefined, opts);
    if (!isAvailable) return;
    return isSale ? makePurchase(undefined, opts) : makeRental(undefined, opts);
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={making || cancelling}
      className={`w-full rounded-xl px-4 py-2.5 text-sm font-medium transition disabled:opacity-50 ${
        hasRequest ? "bg-rose-50 text-rose-600 hover:bg-rose-100" : "bg-amber-800 text-white hover:bg-amber-900"
      }`}
    >
      {making ? "Requesting…" : cancelling ? "Cancelling…" : hasRequest ? "Cancel request" : isSale ? "Request to buy" : "Request to rent"}
    </button>
  );
};

export default RequestCancle;
