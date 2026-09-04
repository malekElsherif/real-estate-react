import {
  useactiveuser,
  usedeactiveuser,
} from "../../hooks/useadmin";
import { useQueryClient } from "@tanstack/react-query";

type ActiveDeactiveUserProps = {
  id: number;
  isActive: boolean;
};

const ActiveDeactiveUser = ({
  id,
  isActive,
}: ActiveDeactiveUserProps) => {
  const queryclient = useQueryClient();

  const {
    mutate: activemutate,
    isPending: activeisPending,
    isError: activeisError,
  } = useactiveuser(id);

  const {
    mutate: deactivemutate,
    isPending: deactiveisPending,
    isError: deactiveisError,
  } = usedeactiveuser(id);

  const handleClick = () => {
    if (isActive) {
      deactivemutate(undefined, {
        onSuccess: () => {
          queryclient.invalidateQueries({
            queryKey: ["getallusers"],
          });

          queryclient.invalidateQueries({
            queryKey: ["user", id],
          });
        },
      });
    } else {
      activemutate(undefined, {
        onSuccess: () => {
          queryclient.invalidateQueries({
            queryKey: ["getallusers"],
          });

          queryclient.invalidateQueries({
            queryKey: ["user", id],
          });
        },
      });
    }
  };

  const isPending = activeisPending || deactiveisPending;

  return (
    <div>
      <button
        type="button"
        onClick={handleClick}
        disabled={isPending}
        className={`rounded-lg px-4 py-2 text-sm font-semibold text-white transition disabled:cursor-not-allowed disabled:opacity-50 ${
          isActive
            ? "bg-red-600 hover:bg-red-700"
            : "bg-green-600 hover:bg-green-700"
        }`}
      >
        {isPending
          ? isActive
            ? "Deactivating..."
            : "Activating..."
          : isActive
          ? "Deactivate"
          : "Activate"}
      </button>

      {activeisError && !isActive && (
        <p className="mt-1 text-xs text-red-500">
          Failed to activate user
        </p>
      )}

      {deactiveisError && isActive && (
        <p className="mt-1 text-xs text-red-500">
          Failed to deactivate user
        </p>
      )}
    </div>
  );
};

export default ActiveDeactiveUser;
