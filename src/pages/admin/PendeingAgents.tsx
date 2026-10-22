import { usegetpendingagent } from "../../hooks/useadmin";
import { useQueryClient } from "@tanstack/react-query";
import {
  useverifyagent,
  userejectagent,
} from "../../hooks/useadmin";
import { btnDanger, btnPadSm, btnSuccess } from "./adminBrand";

type PendingAgentActionsProps = {
  id: number;
};

const PendingAgentActions = ({
  id,
}: PendingAgentActionsProps) => {
  const queryClient = useQueryClient();

  const {
    mutate: verifyAgent,
    isPending: isVerifying,
  } = useverifyagent(id);

  const {
    mutate: rejectAgent,
    isPending: isRejecting,
  } = userejectagent(id);

  const handleVerify = () => {
    verifyAgent(undefined, {
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: ["getpendingagent"],
        });

        queryClient.invalidateQueries({
          queryKey: ["getallusers"],
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

        queryClient.invalidateQueries({
          queryKey: ["getallusers"],
        });
      },
    });
  };

  const isPending = isVerifying || isRejecting;

  return (
    <div className="flex items-center gap-2">
      <button
        type="button"
        onClick={handleVerify}
        disabled={isPending}
        className={`${btnPadSm} ${btnSuccess}`}
      >
        {isVerifying ? "Verifying..." : "Verify"}
      </button>

      <button
        type="button"
        onClick={handleReject}
        disabled={isPending}
        className={`${btnPadSm} ${btnDanger}`}
      >
        {isRejecting ? "Rejecting..." : "Reject"}
      </button>
    </div>
  );
};

const PendeingAgents = () => {
  const {
    data,
    isLoading,
    isError,
  } = usegetpendingagent();

  if (isLoading) {
    return (
      <div className="flex min-h-[300px] flex-col items-center justify-center gap-3">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-[#E4DFD3] border-t-[#B8863B]" />
        <p className="eyebrow text-[#14213D]/60">Loading pending agents</p>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="m-6 border border-[#B8452E] bg-[#FFFDF9] p-8 text-center">
        <p className="eyebrow text-[#B8452E]">Error</p>
        <p className="font-heading mt-2 text-lg font-semibold text-[#14213D]">
          Failed to load pending agents
        </p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl">
      <div className="mb-8">
        <p className="eyebrow text-[#B8863B]">Verification Queue</p>

        <h1 className="font-heading mt-2 text-3xl font-semibold text-[#14213D] sm:text-4xl">
          Pending Agents
        </h1>

        <div className="mt-4 h-px w-16 bg-[#B8863B]" />
      </div>

      <div className="overflow-x-auto border border-[#14213D] bg-[#FFFDF9]">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="eyebrow bg-[#14213D] text-[#FFFDF9]">
              <th className="px-6 py-4 font-semibold">ID</th>
              <th className="px-6 py-4 font-semibold">Name</th>
              <th className="px-6 py-4 font-semibold">Email</th>
              <th className="px-6 py-4 font-semibold">Role</th>
              <th className="px-6 py-4 font-semibold">Active</th>
              <th className="px-6 py-4 font-semibold">Status</th>
              <th className="px-6 py-4 font-semibold">Actions</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-[#E4DFD3]">
            {data?.data?.map((agent: any) => (
              <tr
                key={agent.id}
                className="transition-colors hover:bg-[#EFEAE0]/30"
              >
                <td className="px-6 py-4 text-[#14213D]/60">#{agent.id}</td>

                <td className="px-6 py-4 text-sm font-semibold text-[#14213D]">
                  {agent.name}
                </td>

                <td className="px-6 py-4 text-[#4A5568]">{agent.email}</td>

                <td className="px-6 py-4">{agent.role}</td>

                <td className="px-6 py-4">
                  {agent.isActive ? "Yes" : "No"}
                </td>

                <td className="px-6 py-4">
                  <span className="eyebrow inline-block border border-[#B8863B] bg-[#B8863B]/10 px-2.5 py-1 font-semibold text-[#B8863B]">
                    {agent.verificationStatus}
                  </span>
                </td>

                <td className="px-6 py-4">
                  <PendingAgentActions id={agent.id} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PendeingAgents;
