import { userejectagent, useverifyagent } from "../../hooks/useadmin";
import { useQueryClient } from "@tanstack/react-query";

type VerifyUnverifyAgentProps = {
  id: number;
};

const VerifyUnverifyAgent = ({ id }: VerifyUnverifyAgentProps) => {
  const queryClient = useQueryClient();

  const {
    mutate: verifyAgent,
    isPending: isVerifying,
  } = useverifyagent(id);

  const {
    mutate: rejectAgent,
    isPending: isRejecting,
  } = userejectagent(id);

  const isLoading = isVerifying || isRejecting;

  const handleVerify = () => {
    verifyAgent(undefined, {
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: ["getpendingagent"],
        });
      },
    });
  };

  const handleReject = () => {
    rejectAgent(undefined, {
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: ["getpendingagent"],
        });
      },
    });
  };

  return (
    <div className="flex w-full gap-3">
      <button
        type="button"
        onClick={handleVerify}
        disabled={isLoading}
        className="flex-1 rounded-xl bg-green-700 px-4 py-2 text-xs font-semibold uppercase tracking-wider text-white hover:bg-green-800 transition disabled:cursor-not-allowed disabled:opacity-50"
      >
        {isVerifying ? "Verifying..." : "Verify"}
      </button>

      <button
        type="button"
        onClick={handleReject}
        disabled={isLoading}
        className="flex-1 rounded-xl bg-amber-800 px-4 py-2 text-xs font-semibold uppercase tracking-wider text-white hover:bg-amber-900 transition disabled:cursor-not-allowed disabled:opacity-50"
      >
        {isRejecting ? "Rejecting..." : "Reject"}
      </button>
    </div>
  );
};

export default VerifyUnverifyAgent;
