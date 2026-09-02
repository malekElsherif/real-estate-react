import React from "react";
import { useDeletePurchaseRequest } from "../../hooks/usepurchase-requests";

type DeletePurchaseRequestProps = {
  id: number;
};

const DeletePurchaseRequest = ({
  id,
}: DeletePurchaseRequestProps) => {
  const { mutate, isPending } = useDeletePurchaseRequest(id);

  const handleDelete = () => {
    mutate();
  };

  return (
    <button
      onClick={handleDelete}
      disabled={isPending}
      className="rounded-xl bg-red-50 px-4 py-2 text-sm font-semibold text-red-600 transition hover:bg-red-100 disabled:cursor-not-allowed disabled:opacity-50"
    >
      {isPending ? "Deleting..." : "Delete"}
    </button>
  );
};

export default DeletePurchaseRequest;
