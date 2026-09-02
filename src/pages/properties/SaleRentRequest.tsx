import React from "react";
import { useMakePurchaseRequests } from "../../hooks/usepurchase-requests";
import toast from "react-hot-toast";
// قم باستدعاء الـ Hook الخاص بالـ Auth لديك هنا
import { usegetme } from "../../hooks/useUsers";

const mono = "[font-family:'IBM_Plex_Mono',monospace]";

type SaleRentRequestProps = {
  propertyId: number;
  type: "SALE" | "RENT";
};

const SaleRentRequest = ({
  propertyId,
  type,
}: SaleRentRequestProps) => {
  // جلب بيانات المستخدم لمعرفة الـ role
  const { data:user } = usegetme();

  const {
    mutate,
    isPending,
  } = useMakePurchaseRequests(propertyId);

  const handleRequest = () => {
    mutate(undefined, {
      onSuccess: () => {
        toast.success(
          `${type === "SALE" ? "Purchase" : "Rental"} request sent successfully`
        );
      },
      onError: () => {
        toast.error("You already requested this property");
      },
    });
  };

  // 🔴 شرط الظهور: يظهر فقط إذا كان المستخدم مسجلاً ولديه role يساوي "USER"
  if (user?.data.role !== "USER") {
    return null;
  }

  return (
    <button
      onClick={handleRequest}
      disabled={isPending}
      className={`${mono} w-full border border-[#14213D] bg-[#2D6A4F] py-3 text-xs font-semibold uppercase tracking-wider text-[#F7F5EF] transition hover:bg-[#1B4332] disabled:cursor-not-allowed disabled:opacity-60`}
    >
      {isPending
        ? "Sending Request..."
        : type === "SALE"
          ? "Request to Purchase"
          : "Request to Rent"}
    </button>
  );
};

export default SaleRentRequest;
