import { useState } from "react";
import { usegetPendingpurchaseRequests } from "../../hooks/usepurchase-requests";
import { Tabs, ghost } from "../ui";

const AgentRequest = () => {
  const { data, isLoading, isError, refetch } = usegetPendingpurchaseRequests();
  const [tab, setTab] = useState<"SALE" | "RENT">("SALE");

  const requests: any[] = data?.data ?? [];
  const by = (t: string) => requests.filter((r) => r.property?.type?.toString().toUpperCase() === t);
  const list = by(tab);

  if (isLoading) return <p className="p-8 text-center text-stone-500">Loading requests…</p>;

  if (isError) {
    return (
      <div className="space-y-3 p-8 text-center">
        <p className="text-rose-600">Failed to load requests.</p>
        <button onClick={() => refetch()} className={ghost}>Try again</button>
      </div>
    );
  }

  return (
    <div className="space-y-5 p-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-2xl font-semibold text-stone-900">Requests</h1>
        <Tabs
          value={tab}
          onChange={setTab}
          tabs={[
            { id: "SALE", label: "Sale", count: by("SALE").length },
            { id: "RENT", label: "Rent", count: by("RENT").length },
          ]}
        />
      </div>

      {list.length === 0 ? (
        <p className="py-10 text-center text-sm text-stone-500">No pending {tab.toLowerCase()} requests.</p>
      ) : (
        <div className="grid gap-3">
          {list.map((r) => {
            const name = r.user?.name || r.user?.username || "Unknown user";
            return (
              <div key={r.id} className="flex items-center gap-4 rounded-2xl border border-stone-100 bg-white p-4 shadow-sm">
                <div className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-amber-100 font-semibold text-amber-900">
                  {name[0]?.toUpperCase()}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="font-medium text-stone-900">{name}</p>
                  <p className="truncate text-sm text-stone-500">{r.property?.title || "Untitled property"}</p>
                  {r.user?.email && <p className="truncate text-xs text-stone-400">{r.user.email}</p>}
                </div>
                <p className="shrink-0 font-semibold text-amber-800">
                  {r.offerPrice ? `${Number(r.offerPrice).toLocaleString()} EGP` : "N/A"}
                </p>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default AgentRequest;
