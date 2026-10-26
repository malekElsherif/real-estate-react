import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { usegetallprop, usedeleteprop, useUpdatePropStatus } from "../../hooks/useProp";
import Imgcard from "../properties/Imgcard";

export const AdminManageProps = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [typeFilter, setTypeFilter] = useState("ALL");

  const { data: res, isLoading, isError, refetch } = usegetallprop({
    page: currentPage,
    limit: itemsPerPage,
    status: statusFilter !== "ALL" ? statusFilter : undefined,
    type: typeFilter !== "ALL" ? typeFilter : undefined,
    search: searchQuery.trim() || undefined,
  });

  const deleteMutation = usedeleteprop?.();
  const statusMutation = useUpdatePropStatus?.();

  const properties = res?.data || res?.items || res || [];
  const totalItems = (res?.total ?? res?.totalCount) ?? (res?.meta?.totalItems ?? properties.length);
  const totalPages = (res?.totalPages ?? res?.meta?.totalPages) ?? (Math.ceil(totalItems / itemsPerPage) || 1);

  const stats = useMemo(() => res?.stats || {
    total: totalItems,
    pending: res?.pendingCount ?? 0,
    available: res?.availableCount ?? 0,
    sold: res?.soldCount ?? 0,
    rented: res?.rentedCount ?? 0,
  }, [res, totalItems]);

  const handleStatusChange = async (id: string | number, status: string) => {
    if (window.confirm(`Are you sure you want to change status to ${status}?`) && statusMutation) {
      await statusMutation.mutateAsync({ id, status });
      refetch();
    }
  };

  const handleDelete = async (id: string | number) => {
    if (window.confirm("Are you sure you want to permanently delete this property?") && deleteMutation) {
      await deleteMutation.mutateAsync(id);
      refetch();
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "AVAILABLE": return "border-green-600 text-green-700 bg-green-50";
      case "PENDING": return "border-amber-500 text-amber-700 bg-amber-50";
      case "SOLD": return "border-stone-900 text-stone-900 bg-stone-100";
      case "RENTED": return "border-stone-600 text-stone-700 bg-stone-100";
      default: return "border-red-600 text-red-700 bg-red-50";
    }
  };

  const filterTabs = [
    { id: "ALL", label: "All Properties" },
    { id: "PENDING", label: "Pending" },
    { id: "AVAILABLE", label: "Available" },
    { id: "SOLD", label: "Sold" },
    { id: "RENTED", label: "Rented" },
  ];

  return (
    <div className="min-h-screen bg-stone-50 pb-16 text-stone-900">
      <header className="bg-stone-900 text-stone-50">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="text-xs uppercase tracking-widest text-amber-600 font-medium">Admin Console</p>
              <h1 className="mt-2 text-3xl font-bold sm:text-4xl">Property Management</h1>
              <p className="mt-2 text-xs text-stone-400">Review, approve, or manage real estate listings.</p>
            </div>
            <Link to="/agent/add-property" className="inline-flex justify-center rounded-xl bg-amber-800 px-5 py-2.5 text-xs font-semibold text-white hover:bg-amber-900 transition no-underline">
              + Create New Property
            </Link>
          </div>

          <div className="mt-8 grid grid-cols-2 gap-4 border-t border-stone-800 pt-6 sm:grid-cols-5">
            {[
              { label: "Total Listings", val: stats.total, color: "text-stone-50" },
              { label: "Pending Review", val: stats.pending, color: "text-amber-500" },
              { label: "Available", val: stats.available, color: "text-green-500" },
              { label: "Sold", val: stats.sold, color: "text-stone-50" },
              { label: "Rented", val: stats.rented, color: "text-stone-50" },
            ].map((s, idx) => (
              <div key={idx} className="border-r border-stone-800 last:border-none pr-4">
                <p className="text-[10px] uppercase tracking-wider text-stone-400">{s.label}</p>
                <p className={`mt-1 text-2xl font-bold ${s.color}`}>{s.val}</p>
              </div>
            ))}
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 pt-10 sm:px-6 lg:px-8">
        <div className="flex flex-wrap items-center gap-2 border-b border-stone-200 pb-6">
          {filterTabs.map((btn) => (
            <button
              key={btn.id}
              onClick={() => { setStatusFilter(btn.id); setCurrentPage(1); }}
              className={`rounded-xl border px-4 py-2 text-xs font-semibold transition ${
                statusFilter === btn.id ? "border-stone-900 bg-stone-900 text-stone-50" : "border-stone-200 bg-white text-stone-900 hover:border-stone-900"
              }`}
            >
              {btn.label}
            </button>
          ))}
        </div>

        <div className="mt-6 flex flex-col gap-4 rounded-2xl border border-stone-200 bg-white p-6 shadow-sm lg:flex-row lg:items-center lg:justify-between">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
            placeholder="Search title, city, ID..."
            className="w-full lg:w-80 rounded-xl border border-stone-200 bg-stone-50 px-4 py-2.5 text-xs text-stone-900 outline-none focus:border-stone-900"
          />
          <div className="flex flex-wrap items-center gap-3">
            <select
              value={typeFilter}
              onChange={(e) => { setTypeFilter(e.target.value); setCurrentPage(1); }}
              className="rounded-xl border border-stone-200 bg-stone-50 px-3 py-2.5 text-xs text-stone-900 outline-none"
            >
              <option value="ALL">Type: All</option>
              <option value="APARTMENT">Apartment</option>
              <option value="VILLA">Villa</option>
              <option value="HOUSE">House</option>
              <option value="OFFICE">Office</option>
            </select>
            <select
              value={itemsPerPage}
              onChange={(e) => { setItemsPerPage(Number(e.target.value)); setCurrentPage(1); }}
              className="rounded-xl border border-stone-200 bg-stone-50 px-3 py-2.5 text-xs text-stone-900 outline-none"
            >
              <option value={5}>5 per page</option>
              <option value={10}>10 per page</option>
              <option value={20}>20 per page</option>
            </select>
          </div>
        </div>

        {isLoading && <div className="mt-12 flex justify-center"><div className="h-8 w-8 animate-spin rounded-full border-2 border-stone-300 border-t-amber-800" /></div>}
        {isError && <div className="mt-6 rounded-2xl border border-red-200 bg-white p-8 text-center text-red-600 text-xs">Failed to load properties.</div>}

        {!isLoading && !isError && properties.length === 0 && (
          <div className="mt-6 rounded-2xl border border-stone-200 bg-white p-16 text-center text-stone-500 text-xs">No Properties Found</div>
        )}

        {!isLoading && !isError && properties.length > 0 && (
          <>
            <div className="mt-6 overflow-x-auto rounded-2xl border border-stone-200 bg-white shadow-sm">
              <table className="w-full min-w-[950px] border-collapse text-left text-xs">
                <thead>
                  <tr className="border-b border-stone-200 bg-stone-50 text-stone-500 uppercase tracking-wider text-[10px]">
                    <th className="px-6 py-4 font-semibold">Property</th>
                    <th className="px-6 py-4 font-semibold">Type & Purpose</th>
                    <th className="px-6 py-4 font-semibold">Price</th>
                    <th className="px-6 py-4 font-semibold">Status</th>
                    <th className="px-6 py-4 font-semibold">Owner</th>
                    <th className="px-6 py-4 text-right font-semibold">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100">
                  {properties.map((p: any) => {
                    const isRent = p.listingType === "RENT" || p.type === "RENT";
                    return (
                      <tr key={p.id} className="transition-colors hover:bg-stone-50">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="h-12 w-12 shrink-0 rounded-xl border border-stone-200 overflow-hidden bg-stone-100">
                              <Imgcard propertyId={p.id} />
                            </div>
                            <div>
                              <Link to={`/properties/${p.id}`} className="font-semibold text-stone-900 hover:text-amber-800 line-clamp-1 no-underline">
                                {p.title}
                              </Link>
                              <p className="text-[10px] text-stone-500">{p.city || p.location || "N/A"} · ID: #{p.id}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="font-semibold">{p.type || "N/A"}</div>
                          <div className="text-[10px] text-stone-500">{isRent ? "FOR RENT" : "FOR SALE"}</div>
                        </td>
                        <td className="px-6 py-4 font-semibold text-amber-800">
                          {p.price?.toLocaleString()} EGP {isRent && <span className="text-[10px] text-stone-500">/mo</span>}
                        </td>
                        <td className="px-6 py-4">
                          <span className={`inline-block rounded-lg border px-2.5 py-1 text-[10px] font-semibold uppercase ${getStatusBadge(p.status)}`}>
                            {p.status || "UNKNOWN"}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="font-semibold">{p.owner?.name || p.user?.name || "System"}</div>
                          <div className="text-[10px] text-stone-500">{p.owner?.email || p.user?.email || "N/A"}</div>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            {p.status === "PENDING" && (
                              <>
                                <button onClick={() => handleStatusChange(p.id, "AVAILABLE")} className="rounded-xl border border-green-600 bg-green-600 px-2.5 py-1 text-[10px] font-semibold text-white hover:bg-green-700 transition">Approve</button>
                                <button onClick={() => handleStatusChange(p.id, "REJECTED")} className="rounded-xl border border-red-600 px-2.5 py-1 text-[10px] font-semibold text-red-600 hover:bg-red-600 hover:text-white transition">Reject</button>
                              </>
                            )}
                            <Link to={`/properties/${p.id}`} className="rounded-xl border border-stone-300 px-2.5 py-1 text-[10px] font-semibold text-stone-900 hover:border-stone-900 transition no-underline">View</Link>
                            <button onClick={() => handleDelete(p.id)} className="rounded-xl border border-red-200 px-2.5 py-1 text-[10px] font-semibold text-red-600 hover:bg-red-600 hover:text-white transition">✕</button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            <div className="mt-6 flex flex-col items-center justify-between gap-4 rounded-2xl border border-stone-200 bg-white p-4 shadow-sm sm:flex-row text-xs text-stone-500">
              <p>Showing {(currentPage - 1) * itemsPerPage + 1} to {Math.min(currentPage * itemsPerPage, totalItems)} of {totalItems} results</p>
              <div className="flex items-center gap-1">
                <button onClick={() => setCurrentPage(p => Math.max(p - 1, 1))} disabled={currentPage === 1} className="rounded-xl border border-stone-200 bg-white px-3 py-1.5 font-semibold text-stone-900 disabled:opacity-40">← Prev</button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((n) => (
                  <button key={n} onClick={() => setCurrentPage(n)} className={`rounded-xl border px-3 py-1.5 font-semibold transition ${n === currentPage ? "border-stone-900 bg-stone-900 text-stone-50" : "border-stone-200 bg-white text-stone-900"}`}>{n}</button>
                ))}
                <button onClick={() => setCurrentPage(p => Math.min(p + 1, totalPages))} disabled={currentPage >= totalPages} className="rounded-xl border border-stone-200 bg-white px-3 py-1.5 font-semibold text-stone-900 disabled:opacity-40">Next →</button>
              </div>
            </div>
          </>
        )}
      </main>
    </div>
  );
};

export default AdminManageProps;
