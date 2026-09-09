import React, { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import {
  usegetallprop,
  usedeleteprop,
  useUpdatePropStatus,
} from "../../hooks/useProp";
import Imgcard from "../properties/Imgcard";

// استيراد الخطوط لتأكيد الهوية البصرية
const FontImports = () => (
  <style>{`@import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,400;9..144,500;9..144,600;9..144,700&family=Inter:wght@400;500;600&family=IBM+Plex+Mono:wght@400;500;600&display=swap');`}</style>
);

const serif = "[font-family:'Fraunces',serif]";
const mono = "[font-family:'IBM_Plex_Mono',monospace]";

export const AdminManageProps: React.FC = () => {
  // حالة الباجنيشن والفلاتر إرسالها للـ API
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [itemsPerPage, setItemsPerPage] = useState<number>(10);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("ALL");
  const [typeFilter, setTypeFilter] = useState<string>("ALL");

  /*
    ملاحظة: نفترض أن hook يسمى usegetallprop ويستقبل كائن الخيارات (Params)
    مثل: usegetallprop({ page: currentPage, limit: itemsPerPage, status: statusFilter, ... })
  */
  const {
    data: propertiesResponse,
    isLoading,
    isError,
    refetch,
  } = usegetallprop({
    page: currentPage,
    limit: itemsPerPage,
    status: statusFilter !== "ALL" ? statusFilter : undefined,
    type: typeFilter !== "ALL" ? typeFilter : undefined,
    search: searchQuery.trim() || undefined,
  });

  const deletePropMutation = usedeleteprop?.();
  const updatePropStatusMutation = useUpdatePropStatus?.();

  // استخراج البيانات القادمة من الـ API بحسب الهيكل المعتاد (Pagination Response)
  const properties =
    propertiesResponse?.data ||
    propertiesResponse?.items ||
    propertiesResponse ||
    [];

  // استخراج تفاصيل الباجنيشن من الـ Backend (مع قيم افتراضية safety checks)
  const totalItems =
    propertiesResponse?.total ??
    propertiesResponse?.totalCount ??
    propertiesResponse?.meta?.totalItems ??
    properties.length;
  const totalPages =
    (propertiesResponse?.totalPages ??
      propertiesResponse?.meta?.totalPages ??
      Math.ceil(totalItems / itemsPerPage)) ||
    1;

  // إحصائيات سريعة للأدمن (إذا كانت تأتي من API أو تحسب من البيانات الحالية)
  const stats = useMemo(() => {
    // يمكنك جلب هذه الإحصائيات من Endpoint منفصلة، أو احتسابها مؤقتاً
    const metaStats = propertiesResponse?.stats;
    if (metaStats) return metaStats;

    return {
      total: totalItems,
      pending: propertiesResponse?.pendingCount ?? 0,
      available: propertiesResponse?.availableCount ?? 0,
      sold: propertiesResponse?.soldCount ?? 0,
      rented: propertiesResponse?.rentedCount ?? 0,
    };
  }, [propertiesResponse, totalItems]);

  // دالّة مساعدة لإعادة الضبط للصفحة الأولى عند تغيير أي فلتر
  const handleStatusFilterChange = (status: string) => {
    setStatusFilter(status);
    setCurrentPage(1);
  };

  const handleTypeFilterChange = (type: string) => {
    setTypeFilter(type);
    setCurrentPage(1);
  };

  const handleSearchChange = (query: string) => {
    setSearchQuery(query);
    setCurrentPage(1);
  };

  const handleItemsPerPageChange = (size: number) => {
    setItemsPerPage(size);
    setCurrentPage(1);
  };

  // تغيير حالة العقار
  const handleStatusChange = async (
    propertyId: string | number,
    newStatus: string,
  ) => {
    if (
      window.confirm(`Are you sure you want to change status to ${newStatus}?`)
    ) {
      if (updatePropStatusMutation) {
        await updatePropStatusMutation.mutateAsync({
          id: propertyId,
          status: newStatus,
        });
        refetch();
      }
    }
  };

  // حذف عقار
  const handleDelete = async (propertyId: string | number) => {
    if (
      window.confirm(
        "Are you sure you want to permanently delete this property?",
      )
    ) {
      if (deletePropMutation) {
        await deletePropMutation.mutateAsync(propertyId);
        refetch();
      }
    }
  };

  // تنسيق شارة الحالة (Status Badge)
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "AVAILABLE":
        return "border-[#5B7B65] text-[#5B7B65] bg-[#5B7B65]/10";
      case "PENDING":
        return "border-[#B8863B] text-[#B8863B] bg-[#B8863B]/10";
      case "SOLD":
        return "border-[#14213D] text-[#14213D] bg-[#14213D]/10";
      case "RENTED":
        return "border-[#4B5563] text-[#4B5563] bg-[#4B5563]/10";
      case "REJECTED":
      case "CANCELLED":
        return "border-[#B8452E] text-[#B8452E] bg-[#B8452E]/10";
      default:
        return "border-[#14213D] text-[#14213D] bg-[#14213D]/10";
    }
  };

  // أزرار الفلترة السريعة
  const filterButtons = [
    { id: "ALL", label: "الكل" },
    { id: "PENDING", label: "قيد الانتظار (Pending)" },
    { id: "AVAILABLE", label: "متاح (Available)" },
    { id: "SOLD", label: "تم البيع (Sold)" },
    { id: "RENTED", label: "تم التأجير (Rented)" },
  ];

  return (
    <div className="min-h-screen bg-[#FFFDF9] text-[#14213D] antialiased">
      <FontImports />

      {/* ================= HEADER SECTION ================= */}
      <div className="border-b border-[#14213D] bg-[#14213D] text-[#F7F5EF]">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <div
                className={`${mono} inline-flex items-center gap-2 border border-[#B8863B]/40 bg-[#14213D] px-3 py-1 text-[10px] font-medium uppercase tracking-[0.2em] text-[#B8863B]`}
              >
                <span className="h-1.5 w-1.5 bg-[#B8863B]" />
                Admin Console
              </div>
              <h1
                className={`${serif} mt-2 text-3xl font-semibold text-[#F7F5EF] sm:text-4xl`}
              >
                Property Management
              </h1>
              <p className="mt-1 text-xs text-[#EFEAE0]">
                Review, approve, or manage real estate listings submitted to the
                platform.
              </p>
            </div>

            <Link
              to="/agent/add-property"
              className={`${mono} inline-flex items-center justify-center border border-[#B8863B] bg-[#B8863B] px-5 py-2.5 text-xs font-semibold uppercase tracking-wider text-[#14213D] transition hover:bg-transparent hover:text-[#F7F5EF]`}
            >
              + Create New Property
            </Link>
          </div>

          {/* KPI Stats Bar */}
          <div className="mt-8 grid grid-cols-2 gap-4 border-t border-[#14213D]/60 pt-6 sm:grid-cols-5">
            <div className="border-r border-[#14213D]/40 pr-4">
              <span
                className={`${mono} text-[10px] uppercase tracking-widest text-[#EFEAE0]/70`}
              >
                إجمالي العقارات
              </span>
              <p className={`${serif} text-2xl font-semibold text-[#F7F5EF]`}>
                {stats.total}
              </p>
            </div>
            <div className="border-r border-[#14213D]/40 pr-4">
              <span
                className={`${mono} text-[10px] uppercase tracking-widest text-[#B8863B]`}
              >
                منتظر المراجعة
              </span>
              <p className={`${serif} text-2xl font-semibold text-[#B8863B]`}>
                {stats.pending}
              </p>
            </div>
            <div className="border-r border-[#14213D]/40 pr-4">
              <span
                className={`${mono} text-[10px] uppercase tracking-widest text-[#5B7B65]`}
              >
                متاح للجمهور
              </span>
              <p className={`${serif} text-2xl font-semibold text-[#F7F5EF]`}>
                {stats.available}
              </p>
            </div>
            <div className="border-r border-[#14213D]/40 pr-4">
              <span
                className={`${mono} text-[10px] uppercase tracking-widest text-[#EFEAE0]/70`}
              >
                تم البيع
              </span>
              <p className={`${serif} text-2xl font-semibold text-[#F7F5EF]`}>
                {stats.sold}
              </p>
            </div>
            <div>
              <span
                className={`${mono} text-[10px] uppercase tracking-widest text-[#EFEAE0]/70`}
              >
                تم التأجير
              </span>
              <p className={`${serif} text-2xl font-semibold text-[#F7F5EF]`}>
                {stats.rented}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* ================= FILTER TABS & CONTROLS ================= */}
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* أزرار الفلترة السريعة (Status Filter Tabs) */}
        <div className="mb-6 flex flex-wrap items-center gap-2 border-b border-[#E4DFD3] pb-4">
          {filterButtons.map((btn) => {
            const isActive = statusFilter === btn.id;
            return (
              <button
                key={btn.id}
                onClick={() => handleStatusFilterChange(btn.id)}
                className={`${mono} inline-flex items-center gap-2 border px-4 py-2 text-xs font-semibold uppercase tracking-wider transition-all ${
                  isActive
                    ? "border-[#14213D] bg-[#14213D] text-[#F7F5EF]"
                    : "border-[#E4DFD3] bg-[#FFFDF9] text-[#14213D] hover:border-[#14213D]"
                }`}
              >
                {btn.label}
              </button>
            );
          })}
        </div>

        {/* البحث والتصنيف بالنوع ومقاس الصفحة */}
        <div className="flex flex-col gap-4 border border-[#14213D] bg-[#FFFDF9] p-4 lg:flex-row lg:items-center lg:justify-between">
          {/* Search Bar */}
          <div className="relative flex-1">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => handleSearchChange(e.target.value)}
              placeholder="Search by title, city, owner, or ID..."
              className={`${mono} w-full border border-[#E4DFD3] bg-[#FFFDF9] px-4 py-2.5 text-xs text-[#14213D] placeholder-[#4A5568] outline-none transition focus:border-[#14213D]`}
            />
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {/* Type Filter Dropdown */}
            <select
              value={typeFilter}
              onChange={(e) => handleTypeFilterChange(e.target.value)}
              className={`${mono} border border-[#E4DFD3] bg-[#FFFDF9] px-3 py-2.5 text-xs text-[#14213D] outline-none transition focus:border-[#14213D]`}
            >
              <option value="ALL">Type: All</option>
              <option value="APARTMENT">Apartment</option>
              <option value="VILLA">Villa</option>
              <option value="HOUSE">House</option>
              <option value="OFFICE">Office</option>
            </select>

            {/* Items Per Page Dropdown */}
            <select
              value={itemsPerPage}
              onChange={(e) => handleItemsPerPageChange(Number(e.target.value))}
              className={`${mono} border border-[#E4DFD3] bg-[#FFFDF9] px-3 py-2.5 text-xs text-[#14213D] outline-none transition focus:border-[#14213D]`}
            >
              <option value={5}>5 per page</option>
              <option value={10}>10 per page</option>
              <option value={20}>20 per page</option>
              <option value={50}>50 per page</option>
            </select>
          </div>
        </div>

        {/* ================= PROPERTIES TABLE ================= */}
        {isLoading && (
          <div className="mt-12 flex min-h-[250px] flex-col items-center justify-center gap-3">
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-[#E4DFD3] border-t-[#14213D]" />
            <p
              className={`${mono} text-xs uppercase tracking-widest text-[#4A5568]`}
            >
              Loading management records...
            </p>
          </div>
        )}

        {isError && (
          <div className="mt-8 border border-[#B8452E] bg-[#FFFDF9] p-8 text-center">
            <p
              className={`${mono} text-xs uppercase tracking-widest text-[#B8452E]`}
            >
              Error 01
            </p>
            <p className={`${serif} mt-2 text-lg font-medium text-[#14213D]`}>
              Failed to load properties.
            </p>
          </div>
        )}

        {!isLoading && !isError && properties.length === 0 && (
          <div className="mt-8 border border-dashed border-[#14213D] bg-[#FFFDF9] p-12 text-center">
            <h3 className={`${serif} text-2xl font-medium text-[#14213D]`}>
              No Properties Found
            </h3>
            <p className="mt-1 text-sm text-[#4A5568]">
              Try resetting your filters or search term.
            </p>
          </div>
        )}

        {!isLoading && !isError && properties.length > 0 && (
          <>
            <div className="mt-6 overflow-x-auto border border-[#14213D] bg-[#FFFDF9]">
              <table className="w-full border-collapse text-left text-xs">
                <thead>
                  <tr
                    className={`${mono} border-b border-[#14213D] bg-[#14213D] text-[11px] uppercase tracking-wider text-[#F7F5EF]`}
                  >
                    <th className="p-4 font-semibold">Property</th>
                    <th className="p-4 font-semibold">Type & Purpose</th>
                    <th className="p-4 font-semibold">Price</th>
                    <th className="p-4 font-semibold">Status</th>
                    <th className="p-4 font-semibold">Owner / Agent</th>
                    <th className="p-4 text-right font-semibold">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E4DFD3]">
                  {properties.map((property: any) => {
                    const isRent =
                      property.listingType === "RENT" ||
                      property.type === "RENT";

                    return (
                      <tr
                        key={property.id}
                        className="transition-colors hover:bg-[#EFEAE0]/30"
                      >
                        {/* Property Overview */}
                        <td className="p-4">
                          <div className="flex items-center gap-3">
                            <div className="h-14 w-14 flex-shrink-0 border border-[#14213D] bg-[#EFEAE0] overflow-hidden">
                              <Imgcard propertyId={property.id} />
                            </div>
                            <div>
                              <Link
                                to={`/properties/${property.id}`}
                                className={`${serif} text-sm font-semibold text-[#14213D] hover:underline line-clamp-1`}
                              >
                                {property.title}
                              </Link>
                              <p
                                className={`${mono} text-[10px] text-[#4A5568]`}
                              >
                                📍 {property.city || property.location || "N/A"}{" "}
                                • ID: #{property.id}
                              </p>
                            </div>
                          </div>
                        </td>

                        {/* Type & Purpose */}
                        <td className={`${mono} p-4 text-[#14213D]`}>
                          <div className="font-medium">
                            {property.type || "N/A"}
                          </div>
                          <div className="text-[10px] text-[#4A5568]">
                            {isRent ? "FOR RENT" : "FOR SALE"}
                          </div>
                        </td>

                        {/* Price */}
                        <td
                          className={`${mono} p-4 font-semibold text-[#B8863B]`}
                        >
                          {property.price?.toLocaleString()} EGP
                          {isRent && (
                            <span className="text-[10px] text-[#4A5568]">
                              /mo
                            </span>
                          )}
                        </td>

                        {/* Status Badge */}
                        <td className="p-4">
                          <span
                            className={`${mono} inline-block border px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider ${getStatusBadge(property.status)}`}
                          >
                            {property.status || "UNKNOWN"}
                          </span>
                        </td>

                        {/* Owner Info */}
                        <td className="p-4 text-[#14213D]">
                          <div className="font-medium">
                            {property.owner?.name ||
                              property.user?.name ||
                              "System Admin"}
                          </div>
                          <div className={`${mono} text-[10px] text-[#4A5568]`}>
                            {property.owner?.email ||
                              property.user?.email ||
                              "N/A"}
                          </div>
                        </td>

                        {/* Actions */}
                        <td className="p-4 text-right">
                          <div
                            className={`${mono} flex items-center justify-end gap-2`}
                          >
                            {/* Accept / Approve Button */}
                            {property.status === "PENDING" && (
                              <button
                                onClick={() =>
                                  handleStatusChange(property.id, "AVAILABLE")
                                }
                                className="border border-[#5B7B65] bg-[#5B7B65] px-2.5 py-1 text-[10px] font-semibold uppercase text-[#FFFDF9] transition hover:bg-transparent hover:text-[#5B7B65]"
                                title="Approve Listing"
                              >
                                Approve
                              </button>
                            )}

                            {/* Reject Button */}
                            {property.status === "PENDING" && (
                              <button
                                onClick={() =>
                                  handleStatusChange(property.id, "REJECTED")
                                }
                                className="border border-[#B8452E] px-2.5 py-1 text-[10px] font-semibold uppercase text-[#B8452E] transition hover:bg-[#B8452E] hover:text-[#FFFDF9]"
                                title="Reject Listing"
                              >
                                Reject
                              </button>
                            )}

                            {/* View Link */}
                            <Link
                              to={`/properties/${property.id}`}
                              className="border border-[#14213D] px-2.5 py-1 text-[10px] font-semibold uppercase text-[#14213D] transition hover:bg-[#14213D] hover:text-[#F7F5EF]"
                            >
                              View
                            </Link>

                            {/* Delete Button */}
                            <button
                              onClick={() => handleDelete(property.id)}
                              className="border border-[#B8452E]/40 px-2 py-1 text-[10px] font-semibold text-[#B8452E] transition hover:border-[#B8452E] hover:bg-[#B8452E] hover:text-[#FFFDF9]"
                              title="Delete Permanently"
                            >
                              ✕
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* ================= PAGINATION CONTROLS ================= */}
            <div className="mt-6 flex flex-col items-center justify-between gap-4 border border-[#14213D] bg-[#FFFDF9] p-4 sm:flex-row">
              <p className={`${mono} text-xs text-[#4A5568]`}>
                Showing{" "}
                <span className="font-semibold text-[#14213D]">
                  {(currentPage - 1) * itemsPerPage + 1}
                </span>{" "}
                to{" "}
                <span className="font-semibold text-[#14213D]">
                  {Math.min(currentPage * itemsPerPage, totalItems)}
                </span>{" "}
                of{" "}
                <span className="font-semibold text-[#14213D]">
                  {totalItems}
                </span>{" "}
                results
              </p>

              <div className={`${mono} flex items-center gap-1`}>
                {/* Previous Button */}
                <button
                  onClick={() =>
                    setCurrentPage((prev) => Math.max(prev - 1, 1))
                  }
                  disabled={currentPage === 1}
                  className="border border-[#E4DFD3] bg-[#FFFDF9] px-3 py-1.5 text-xs font-semibold text-[#14213D] transition hover:border-[#14213D] disabled:opacity-40 disabled:hover:border-[#E4DFD3]"
                >
                  ← Prev
                </button>

                {/* Page Numbers */}
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                  (pageNum) => {
                    const isActive = pageNum === currentPage;
                    return (
                      <button
                        key={pageNum}
                        onClick={() => setCurrentPage(pageNum)}
                        className={`border px-3 py-1.5 text-xs font-semibold transition ${
                          isActive
                            ? "border-[#14213D] bg-[#14213D] text-[#F7F5EF]"
                            : "border-[#E4DFD3] bg-[#FFFDF9] text-[#14213D] hover:border-[#14213D]"
                        }`}
                      >
                        {pageNum}
                      </button>
                    );
                  },
                )}

                {/* Next Button */}
                <button
                  onClick={() =>
                    setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                  }
                  disabled={currentPage >= totalPages}
                  className="border border-[#E4DFD3] bg-[#FFFDF9] px-3 py-1.5 text-xs font-semibold text-[#14213D] transition hover:border-[#14213D] disabled:opacity-40 disabled:hover:border-[#E4DFD3]"
                >
                  Next →
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default AdminManageProps;
