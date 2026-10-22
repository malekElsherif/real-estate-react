import { userejectagent, useverifyagent } from "../../hooks/useadmin";
import { useQueryClient } from "@tanstack/react-query";
import { btnDanger, btnPad, btnSuccess } from "./adminBrand";

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
    <div className="flex w-full gap-3">
      <button
        type="button"
        onClick={handleVerify}
        disabled={isLoading}
        className={`flex-1 ${btnPad} ${btnSuccess}`}
      >
        {isVerifying ? "Verifying..." : "Verify"}
      </button>

      <button
        type="button"
        onClick={handleReject}
        disabled={isLoading}
        className={`flex-1 ${btnPad} ${btnDanger}`}
      >
        {isRejecting ? "Rejecting..." : "Reject"}
      </button>
    </div>
  );
};

export default VerifyUnverifyAgent;
