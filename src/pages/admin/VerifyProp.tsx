import { Button } from "@mui/material";
import { useQueryClient, type QueryKey } from "@tanstack/react-query";
import { useAvailablityprop } from "../../hooks/useProp";

type AvailabilityPropProps = {
  id: number;
  status: string;
  queryKey?: QueryKey; // دعم كائن أو مصفوفة مفاتيح كاش بدلاً من String مجرد
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

  const isDisabled =
    isPending ||
    (status !== "AVAILABLE" && status !== "PENDING");

  return (
    <Button
      variant="contained"
      color={isAvailable ? "warning" : "success"}
      onClick={handleAvailability}
      disabled={isDisabled}
      sx={{
        borderRadius: 2,
        textTransform: "none",
        fontWeight: 700,
        boxShadow: "none",
        minWidth: 145,
      }}
    >
      {isPending
        ? "Updating..."
        : isAvailable
          ? "Make Unavailable"
          : "Make Available"}
    </Button>
  );
};

export default AvailabilityProp;
