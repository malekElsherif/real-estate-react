import toast from "react-hot-toast";
import { useMakePurchaseRequests } from "../../hooks/usepurchase-requests";
import { usegetme } from "../../hooks/useUsers";
import { primary } from "../ui";

const SaleRentRequest = ({ propertyId, type }: { propertyId: number; type: "SALE" | "RENT" }) => {
  const { data: user } = usegetme();
  const { mutate, isPending } = useMakePurchaseRequests(propertyId);

  if (user?.data.role !== "USER") return null;

  const label = type === "SALE" ? "Purchase" : "Rental";

  return (
    <button
      disabled={isPending}
      onClick={() =>
        mutate(undefined, {
          onSuccess: () => toast.success(`${label} request sent successfully`),
          onError: () => toast.error("You already requested this property"),
        })
      }
      className={`${primary} w-full py-3`}
    >
      {isPending ? "Sending…" : `Request to ${type === "SALE" ? "Purchase" : "Rent"}`}
    </button>
  );
};

export default SaleRentRequest;
