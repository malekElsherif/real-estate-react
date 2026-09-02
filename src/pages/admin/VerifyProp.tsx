import React from "react";
import { Button } from "@mui/material";
import { useQueryClient } from "@tanstack/react-query";
import { useAvailablityprop } from "../../hooks/useProp";

type AvailabilityPropProps = {
  id: number;
  status: string;
  queryKey: string;
};

const AvailabilityProp = ({
  id,
  status,
  queryKey,
}: AvailabilityPropProps) => {
  const queryClient = useQueryClient();

  const { mutate: changeAvailability, isPending } =
    useAvailablityprop(id);

  const handleAvailability = () => {
    changeAvailability(undefined, {
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: [queryKey],
        });
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
