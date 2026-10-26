import { useQueryClient } from "@tanstack/react-query";
import { usegetpendingagent, useverifyagent, userejectagent } from "../../hooks/useadmin";

const PendingAgentActions = ({ id }: { id: number }) => {
  const queryClient = useQueryClient();
  const { mutate: verifyAgent, isPending: isVerifying } = useverifyagent(id);
  const { mutate: rejectAgent, isPending: isRejecting } = userejectagent(id);

  const handleAction = (isVerify: boolean) => {
    const action = isVerify ? verifyAgent : rejectAgent;
    action(undefined, {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["getpendingagent"] });
        queryClient.invalidateQueries({ queryKey: ["getallusers"] });
      },
    });
  };

  const isPending = isVerifying || isRejecting;

  return (
    <div className="flex items-center gap-2">
      <button
        type="button"
        onClick={() => handleAction(true)}
        disabled={isPending}
        className="rounded-xl border border-green-600 bg-green-600 px-3 py-2 text-[10px] font-semibold text-white hover:bg-green-700 transition disabled:opacity-50"
      >
        {isVerifying ? "Verifying..." : "Verify"}
      </button>

      <button
        type="button"
        onClick={() => handleAction(false)}
        disabled={isPending}
        className="rounded-xl border border-red-600 px-3 py-2 text-[10px] font-semibold text-red-600 hover:bg-red-600 hover:text-white transition disabled:opacity-50"
      >
        {isRejecting ? "Rejecting..." : "Reject"}
      </button>
    </div>
  );
};

export const PendeingAgents = () => {
  const { data, isLoading, isError } = usegetpendingagent();

  if (isLoading) {
    return (
      <div className="flex min-h-[400px] flex-col items-center justify-center gap-3 bg-stone-50">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-stone-300 border-t-amber-800" />
        <p className="text-xs uppercase tracking-widest text-stone-500 font-medium">Loading pending agents</p>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="m-6 rounded-2xl border border-red-200 bg-white p-8 text-center shadow-sm">
        <p className="text-[10px] uppercase tracking-wider text-red-600 font-semibold">Error</p>
        <p className="mt-2 text-xl font-bold text-stone-900">Failed to load pending agents</p>
      </div>
    );
  }

  const agents = data?.data ?? [];

  return (
    <div className="min-h-screen bg-stone-50 pb-16 text-stone-900">
      <header className="bg-stone-900 text-stone-50">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <p className="text-xs uppercase tracking-widest text-amber-600 font-medium">Verification Queue</p>
          <h1 className="mt-2 text-3xl font-bold sm:text-4xl">Pending Agents</h1>
          <p className="mt-2 text-xs text-stone-400">Review and verify new real estate agent applications.</p>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 pt-10 sm:px-6 lg:px-8">
        <div className="overflow-x-auto rounded-2xl border border-stone-200 bg-white shadow-sm">
          <table className="w-full min-w-[850px] border-collapse text-left text-xs">
            <thead>
              <tr className="border-b border-stone-200 bg-stone-50 text-stone-500 uppercase tracking-wider text-[10px]">
                <th className="px-6 py-4 font-semibold">ID</th>
                <th className="px-6 py-4 font-semibold">Name</th>
                <th className="px-6 py-4 font-semibold">Email</th>
                <th className="px-6 py-4 font-semibold">Role</th>
                <th className="px-6 py-4 font-semibold">Active</th>
                <th className="px-6 py-4 font-semibold">Status</th>
                <th className="px-6 py-4 font-semibold">Actions</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-stone-100">
              {agents.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-stone-500">
                    No pending agents found in the queue.
                  </td>
                </tr>
              ) : (
                agents.map((agent: any) => (
                  <tr key={agent.id} className="transition-colors hover:bg-stone-50">
                    <td className="px-6 py-4 text-stone-500 font-mono">#{agent.id}</td>
                    <td className="px-6 py-4 text-sm font-semibold text-stone-900">{agent.name}</td>
                    <td className="px-6 py-4 text-stone-600">{agent.email}</td>
                    <td className="px-6 py-4 font-semibold">{agent.role}</td>
                    <td className="px-6 py-4 font-semibold">{agent.isActive ? "Yes" : "No"}</td>
                    <td className="px-6 py-4">
                      <span className="inline-block rounded-lg border border-amber-500 bg-amber-50 px-2.5 py-1 text-[10px] font-semibold text-amber-700 uppercase">
                        {agent.verificationStatus || "PENDING"}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <PendingAgentActions id={agent.id} />
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
};

export default PendeingAgents;
