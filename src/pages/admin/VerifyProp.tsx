import { useQueryClient, type QueryKey } from "@tanstack/react-query";
import { useAvailablityprop } from "../../hooks/useProp";

type AvailabilityPropProps = {
  id: number;
  status: string;
  queryKey?: QueryKey;
};

const AvailabilityProp = ({
  id,
  status,
  queryKey,
}: AvailabilityPropProps) => {
  const queryClient = useQueryClient();
  const { mutate: changeAvailability, isPending } = useAvailablityprop();

  const handleAvailability = () => {
    changeAvailability(id, {
      onSuccess: () => {
        if (queryKey) {
          queryClient.invalidateQueries({
            queryKey: Array.isArray(queryKey) ? queryKey : [queryKey],
          });
        }
      },
    });
  };

  const isAvailable = status === "AVAILABLE";
  const isDisabled = isPending || (status !== "AVAILABLE" && status !== "PENDING");

  return (
    <button
      type="button"
      onClick={handleAvailability}
      disabled={isDisabled}
      className={`rounded-xl px-4 py-2 text-[10px] font-semibold uppercase tracking-wider transition disabled:cursor-not-allowed disabled:opacity-50 ${
        isAvailable
          ? "bg-amber-800 text-white hover:bg-amber-900"
          : "bg-green-700 text-white hover:bg-green-800"
      }`}
    >
      {isPending
        ? "Updating..."
        : isAvailable
        ? "Make Unavailable"
        : "Make Available"}
    </button>
  );
};

export default AvailabilityProp;
