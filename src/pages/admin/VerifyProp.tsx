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

  // Available -> gold (take down) | Not available -> green (publish)
  const base = isAvailable ? "#B8863B" : "#5B7B65";
  const hover = isAvailable ? "#a37632" : "#4a6652";

  return (
    <Button
      variant="contained"
      onClick={handleAvailability}
      disabled={isDisabled}
      disableElevation
      sx={{
        borderRadius: 0,
        textTransform: "uppercase",
        fontFamily: "'IBM Plex Mono', ui-monospace, monospace",
        fontWeight: 600,
        fontSize: "0.65rem",
        letterSpacing: "0.14em",
        boxShadow: "none",
        minWidth: 145,
        bgcolor: base,
        color: "#FFFDF9",
        "&:hover": { bgcolor: hover, boxShadow: "none" },
        "&.Mui-disabled": {
          bgcolor: base,
          color: "#FFFDF9",
          opacity: 0.5,
        },
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
