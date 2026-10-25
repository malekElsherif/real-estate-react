import { useState } from "react";
import { usegetmypurchaseRequests } from "../../hooks/usepurchase-requests";
import { Badge, Modal, Tabs, ghost } from "../ui";

type Tab = "ALL" | "APPROVED" | "PENDING" | "CANCELLED";

const statusOf = (r: any): string => r.status?.toLowerCase() ?? "pending";

const filters: Record<Tab, (r: any) => boolean> = {
  ALL: () => true,
  APPROVED: (r) => statusOf(r) === "approved",
  PENDING: (r) => statusOf(r) === "pending",
  CANCELLED: (r) => ["cancelled", "rejected"].includes(statusOf(r)),
};

const labels: Record<Tab, string> = { ALL: "All", APPROVED: "Approved", PENDING: "Pending", CANCELLED: "Cancelled / Rejected" };

const UserRequestHistory = () => {
  const { data, isLoading, error } = usegetmypurchaseRequests();
  const [tab, setTab] = useState<Tab>("ALL");
  const [selected, setSelected] = useState<any>(null);

  const requests: any[] = data?.data ?? [];
  const shown = requests.filter(filters[tab]);

  if (isLoading) return <p className="py-16 text-center text-stone-500">Loading…</p>;
  if (error) return <p className="py-16 text-center text-rose-600">Failed to load your purchase requests.</p>;
  if (requests.length === 0) return <p className="py-16 text-center text-stone-500">You haven't submitted any requests yet.</p>;

  const prop = (r: any) => r.property ?? r;
  const where = (p: any) => p.city || p.address || "Location unspecified";

  return (
    <div className="space-y-5 rounded-2xl border border-stone-100 bg-white p-5 shadow-sm md:p-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-xl font-semibold text-stone-900">Purchase requests</h2>
        <Tabs
          value={tab}
          onChange={setTab}
          tabs={(Object.keys(labels) as Tab[]).map((id) => ({ id, label: labels[id], count: requests.filter(filters[id]).length }))}
        />
      </div>

      {shown.length === 0 ? (
        <p className="py-8 text-center text-sm text-stone-500">Nothing here.</p>
      ) : (
        <div className="divide-y divide-stone-100">
          {shown.map((r) => {
            const p = prop(r);
            return (
              <button
                key={r.id}
                type="button"
                onClick={() => setSelected(r)}
                className="flex w-full items-center justify-between gap-4 rounded-xl px-2 py-4 text-left transition hover:bg-stone-50"
              >
                <div className="min-w-0">
                  <p className="truncate font-medium text-stone-900">{p.title || "Untitled property"}</p>
                  <p className="text-sm text-stone-500">
                    📍 {where(p)}
                    {p.price && ` · ${Number(p.price).toLocaleString()} EGP`}
                    {r.createdAt && ` · ${new Date(r.createdAt).toLocaleDateString()}`}
                  </p>
                </div>
                <Badge status={statusOf(r)} />
              </button>
            );
          })}
        </div>
      )}

      <Modal open={Boolean(selected)} onClose={() => setSelected(null)}>
        {selected && (() => {
          const p = prop(selected);
          const rows = [
            ["Price", p.price && `${Number(p.price).toLocaleString()} EGP`],
            ["Location", p.address || p.city],
            ["Submitted", selected.createdAt && new Date(selected.createdAt).toLocaleString()],
          ];
          return (
            <div className="space-y-4">
              <div>
                <p className="text-xs text-stone-400">Request #{selected.id}</p>
                <h3 className="text-lg font-semibold text-stone-900">{p.title || "Property details"}</h3>
              </div>
              <Badge status={statusOf(selected)} />
              <dl className="space-y-2 text-sm">
                {rows.map(([k, v]) => v && (
                  <div key={k as string} className="flex justify-between border-b border-stone-100 pb-2">
                    <dt className="text-stone-500">{k}</dt>
                    <dd className="font-medium text-stone-900">{v}</dd>
                  </div>
                ))}
              </dl>
              <div className="flex justify-end"><button onClick={() => setSelected(null)} className={ghost}>Close</button></div>
            </div>
          );
        })()}
      </Modal>
    </div>
  );
};

export default UserRequestHistory;
