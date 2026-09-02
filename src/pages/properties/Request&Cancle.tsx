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

type RequestCancleProps = {
  id: number;
  type: "SALE" | "RENT";
  isAvailable?: boolean;
};

const mono = "[font-family:'IBM_Plex_Mono',monospace]";

const RequestCancle = ({ id, type, isAvailable }: RequestCancleProps) => {
  const { data: userData, isLoading: userLoading } = usegetme();
  const queryclient = useQueryClient();

  // التحقق من دور المستخدم (Admin أو Agent)
  const userRole = userData?.data?.role;
  const isAgent = userRole === "AGENT" || userRole === "ADMIN";

  // جلب طلبات الشراء أو الإيجار بناءً على النوع
  const { data: purchaseData, isLoading: purchaseLoading } = usegetmypurchaseRequests({
    enabled: Boolean(isAvailable) && type === "SALE",
  });

  const { data: rentalData, isLoading: rentalLoading } = usegetmyrentalrequests({
    enabled: Boolean(isAvailable) && type === "RENT",
  });

  // تحديد القائمة والطلبات الحالية بناءً على الـ type
console.log(type)
  const requests =
    type === "SALE"
      ? Array.isArray(purchaseData?.data)
        ? purchaseData.data
        : []
      : Array.isArray(rentalData?.data)
      ? rentalData.data
      : [];

  const currentRequest =
    requests.find((req: any) => {
      const propertyIdMatches = Number(req?.property?.id) === Number(id);
      const isPendingStatus = req?.status?.toString().toUpperCase() === "PENDING";
      return propertyIdMatches && isPendingStatus;
    }) ?? null;

  const hasRequest = Boolean(currentRequest);
  const requestId = currentRequest?.id;

  // Mutations للشراء، الإيجار، وإلغاء كل منهما بمعرف الطلب الصحيح (requestId)
  const { mutate: makePurchaseRequest, isPending: isMakingPurchase } = useMakePurchaseRequests(id);
  const { mutate: makeRentalRequest, isPending: isMakingRental } = usecreaterentalrequests(id);

  const { mutate: cancelPurchaseRequest, isPending: isCancellingPurchase } = useCanclePurchaseRequest(requestId!);
  const { mutate: cancelRentalRequest, isPending: isCancellingRental } = usecanclemyrenaltrequest(requestId!);

  // عرض شاشة تحميل بسيطة أثناء جلب بيانات المستخدم
  if (userLoading) {
    return (
      <span className={`${mono} text-xs text-[#4A5568] opacity-50`}>
        Loading...
      </span>
    );
  }

  // 1. إذا كان المستخدم Admin أو Agent، اعرض الشارة الإدارية المميزة
  if (isAgent) {
    return (
      <div className={`${mono} inline-flex items-center gap-2 border border-[#B8863B] bg-[#FFFDF9] px-3 py-1.5 text-xs text-[#B8863B]`}>
        <span className="h-1.5 w-1.5 rounded-full bg-[#B8863B] animate-pulse"></span>
        <span className="font-semibold uppercase tracking-wider">
          {userRole === "ADMIN" ? "Admin Management View" : "Agent Portal View"}
        </span>
      </div>
    );
  }

  // 2. إذا كان العقار غير متاح ولم يطلبه المستخدم من قبل
  if (!isAvailable && !hasRequest) {
    return (
      <span className={`${mono} inline-block border border-dashed border-[#4A5568] px-3 py-1.5 text-xs font-semibold text-[#4A5568] uppercase bg-[#F7F5EF]`}>
        {type === "SALE" ? "Sold Out" : "Rented / Unavailable"}
      </span>
    );
  }

  const isLoading = type === "SALE" ? purchaseLoading : rentalLoading;
  if (isLoading && !isAvailable) {
    return (
      <button
        disabled
        className={`${mono} border border-[#14213D] bg-[#F7F5EF] px-4 py-2 text-xs font-semibold text-[#4A5568] opacity-50`}
      >
        Loading...
      </button>
    );
  }

  const isMaking = isMakingPurchase || isMakingRental;
  const isCancelling = isCancellingPurchase || isCancellingRental;
  const isPending = isMaking || isCancelling;

  const handleClick = () => {
    if (hasRequest) {
      if (!requestId) return;

      if (type === "SALE") {
        cancelPurchaseRequest(undefined, {
          onSuccess: () => {
            queryclient.invalidateQueries({
              queryKey: ["getmypurchaseRequests"],
            });
          },
        });
      } else {
        cancelRentalRequest(undefined, {
          onSuccess: () => {
            queryclient.invalidateQueries({
              queryKey: ["getmyrentalrequests"],
            });
          },
        });
      }
    } else {
      if (!isAvailable) return;

      if (type === "SALE") {
        makePurchaseRequest(undefined, {
          onSuccess: () => {
            queryclient.invalidateQueries({
              queryKey: ["getmypurchaseRequests"],
            });
          },
        });
      } else {
        makeRentalRequest(undefined, {
          onSuccess: () => {
            queryclient.invalidateQueries({
              queryKey: ["getmyrentalrequests"],
            });
          },
        });
      }
    }
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={isPending || (!isAvailable && !hasRequest)}
      className={`${mono} border px-4 py-2 text-xs font-semibold uppercase transition disabled:cursor-not-allowed disabled:opacity-50 ${
        hasRequest
          ? "border-[#B8452E] bg-[#B8452E]/10 text-[#B8452E] hover:bg-[#B8452E] hover:text-[#FFFDF9]"
          : "border-[#14213D] bg-[#14213D] text-[#FFFDF9] hover:bg-[#FFFDF9] hover:text-[#14213D]"
      }`}
    >
      {isMaking
        ? "Requesting..."
        : isCancelling
        ? "Cancelling..."
        : hasRequest
        ? "Cancel Request"
        : type === "SALE"
        ? "Request to Buy"
        : "Request to Rent"}
    </button>
  );
};

export default RequestCancle;
