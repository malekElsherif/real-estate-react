import { useQueryClient } from "@tanstack/react-query";
import { useactiveuser, usedeactiveuser } from "../../hooks/useadmin";

type ActiveDeactiveUserProps = {
  id: number;
  isActive: boolean;
};

const ActiveDeactiveUser = ({ id, isActive }: ActiveDeactiveUserProps) => {
  const queryClient = useQueryClient();
  const { mutate: activate, isPending: isActivating, isError: activeisError } = useactiveuser(id);
  const { mutate: deactivate, isPending: isDeactivating, isError: deactiveisError } = usedeactiveuser(id);

  const handleClick = () => {
    const action = isActive ? deactivate : activate;
    action(undefined, {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["getallusers"] });
        queryClient.invalidateQueries({ queryKey: ["user", id] });
      },
    });
  };

  const isPending = isActivating || isDeactivating;

  return (
    <div>
      <button
        type="button"
        onClick={handleClick}
        disabled={isPending}
        className={`rounded-xl border px-3 py-2 text-[10px] font-semibold transition disabled:opacity-50 ${
          isActive
            ? "border-red-600 text-red-600 hover:bg-red-600 hover:text-white"
            : "border-green-600 bg-green-600 text-white hover:bg-green-700"
        }`}
      >
        {isPending ? (isActive ? "Deactivating..." : "Activating...") : (isActive ? "Deactivate" : "Activate")}
      </button>

      {activeisError && !isActive && (
        <p className="mt-1 text-[10px] text-red-600 font-mono">Failed to activate user</p>
      )}

      {deactiveisError && isActive && (
        <p className="mt-1 text-[10px] text-red-600 font-mono">Failed to deactivate user</p>
      )}
    </div>
  );
};

export default ActiveDeactiveUser;
