import { usegetpendingagent } from "../../hooks/useadmin";
import { useQueryClient } from "@tanstack/react-query";
import {
  useverifyagent,
  userejectagent,
} from "../../hooks/useadmin";

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
        className="rounded-lg bg-green-600 px-3 py-2 text-sm font-semibold text-white transition hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {isVerifying ? "Verifying..." : "Verify"}
      </button>

      <button
        type="button"
        onClick={handleReject}
        disabled={isPending}
        className="rounded-lg bg-red-600 px-3 py-2 text-sm font-semibold text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50"
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
      <div className="p-6">
        Loading...
      </div>
    );
  }

  if (isError) {
    return (
      <div className="p-6 text-red-500">
        Failed to load pending agents
      </div>
    );
  }

  return (
    <div className="p-6">

      <h1 className="mb-6 text-2xl font-bold text-slate-800">
        Pending Agents
      </h1>

      <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white shadow-sm">

        <table className="w-full text-left">

          <thead className="border-b bg-slate-50">
            <tr>
              <th className="px-6 py-4">ID</th>

              <th className="px-6 py-4">
                Name
              </th>

              <th className="px-6 py-4">
                Email
              </th>

              <th className="px-6 py-4">
                Role
              </th>

              <th className="px-6 py-4">
                Active
              </th>

              <th className="px-6 py-4">
                Status
              </th>

              <th className="px-6 py-4">
                Actions
              </th>
            </tr>
          </thead>

          <tbody>

            {data?.data?.map((agent: any) => (
              <tr
                key={agent.id}
                className="border-b last:border-b-0 hover:bg-slate-50"
              >

                <td className="px-6 py-4">
                  {agent.id}
                </td>

                <td className="px-6 py-4 font-medium">
                  {agent.name}
                </td>

                <td className="px-6 py-4 text-slate-600">
                  {agent.email}
                </td>

                <td className="px-6 py-4">
                  {agent.role}
                </td>

                <td className="px-6 py-4">
                  {agent.isActive ? "Yes" : "No"}
                </td>

                <td className="px-6 py-4">
                  <span className="rounded-full bg-yellow-100 px-3 py-1 text-sm font-medium text-yellow-700">
                    {agent.verificationStatus}
                  </span>
                </td>

                <td className="px-6 py-4">
                  <PendingAgentActions
                    id={agent.id}
                  />
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