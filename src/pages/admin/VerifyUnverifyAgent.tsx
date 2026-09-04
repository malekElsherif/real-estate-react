import { userejectagent, useverifyagent } from "../../hooks/useadmin";
import { useQueryClient } from "@tanstack/react-query";

type VerifyUnverifyAgentProps = {
  id: number;
};

const VerifyUnverifyAgent = ({
  id,
}: VerifyUnverifyAgentProps) => {
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
    <div className="flex gap-3">
      <button
        type="button"
        onClick={handleVerify}
        disabled={isLoading}
        className="flex-1 rounded-lg bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {isVerifying ? "Verifying..." : "Verify"}
      </button>

      <button
        type="button"
        onClick={handleReject}
        disabled={isLoading}
        className="flex-1 rounded-lg bg-red-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {isRejecting ? "Rejecting..." : "Reject"}
      </button>
    </div>
  );
};

export default VerifyUnverifyAgent;
