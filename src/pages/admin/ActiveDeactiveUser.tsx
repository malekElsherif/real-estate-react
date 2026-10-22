import {
  useactiveuser,
  usedeactiveuser,
} from "../../hooks/useadmin";
import { useQueryClient } from "@tanstack/react-query";
import { btnDanger, btnPadSm, btnSuccess } from "./adminBrand";

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
        className={`${btnPadSm} ${isActive ? btnDanger : btnSuccess}`}
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
        <p className="font-data mt-1 text-[10px] text-[#B8452E]">
          Failed to activate user
        </p>
      )}

      {deactiveisError && isActive && (
        <p className="font-data mt-1 text-[10px] text-[#B8452E]">
          Failed to deactivate user
        </p>
      )}
    </div>
  );
};

export default ActiveDeactiveUser;
