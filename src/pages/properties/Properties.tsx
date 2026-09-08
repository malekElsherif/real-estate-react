import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { usegetallprop } from "../../hooks/useProp";
import Imgcard from "./Imgcard";

export interface Property {
  id: string | number;
  title: string;
  description: string;
  status: "AVAILABLE" | "PENDING" | "SOLD" | "RENTED" | string;
  type?: string;
  price?: number | string;
  city?: string;
  location?: string;
  bedrooms?: number;
  bathrooms?: number;
  area?: number;
}

const serif = "[font-family:'Fraunces',serif]";
const mono = "[font-family:'IBM_Plex_Mono',monospace]";

const PropertyCard = ({ property }: { property: Property }) => {
  const price = property.price
    ? `${Number(property.price).toLocaleString()} EGP`
    : "Contact Agent";

  const locationText = property.city || property.location || "Egypt";
  const isUnavailable = property.status !== "AVAILABLE";

  return (
    <div
      className={`group flex flex-col justify-between border transition-all duration-300 ${
        isUnavailable
          ? "border-gray-200 bg-[#F9F8F6]"
          : "border-[#14213D]/20 bg-[#FFFDF9] hover:-translate-y-1 hover:border-[#B8863B] hover:shadow-xl"
      }`}
    >
      <div>
        <div className="relative overflow-hidden border-b border-[#14213D]/10">
          <div
            className={
              isUnavailable ? "filter blur-[2px] grayscale contrast-125" : ""
            }
          >
            <Imgcard propertyId={Number(property.id)} />
          </div>

          {property.type && (
            <span
              className={`${mono} absolute top-3 left-3 z-10 border border-[#14213D] bg-[#14213D] px-2.5 py-1 text-[9px] font-semibold uppercase tracking-wider text-[#F7F5EF] shadow-md`}
            >
              {property.type}
            </span>
          )}

          {isUnavailable && (
            <div className="absolute inset-0 z-20 flex items-center justify-center bg-[#14213D]/40 backdrop-blur-[1px]">
              <div className="border-2 border-[#FFFDF9] bg-[#B8452E] px-6 py-2 shadow-xl">
                <span
                  className={`${mono} text-sm font-bold tracking-[0.25em] text-[#FFFDF9] uppercase`}
                >
                  {property.status}
                </span>
              </div>
            </div>
          )}
        </div>

        <div className="space-y-3 p-5">
          <p
            className={`${mono} text-[10px] uppercase tracking-widest text-[#B8863B]`}
          >
            📍 {locationText}
          </p>

          <h2
            className={`${serif} line-clamp-1 text-lg font-semibold text-[#14213D] transition ${
              !isUnavailable && "group-hover:text-[#B8863B]"
            }`}
          >
            {property.title}
          </h2>

          <p
            className={`${mono} line-clamp-2 text-xs leading-relaxed text-[#4A5568]`}
          >
            {property.description}
          </p>

          <div
            className={`${mono} flex flex-wrap gap-2 border-t border-dotted border-[#E4DFD3] pt-3 text-xs text-[#14213D]`}
          >
            {property.bedrooms !== undefined && property.bedrooms !== null && (
              <span className="border border-[#E4DFD3] bg-[#F7F5EF] px-2.5 py-1 text-[11px]">
                🛏️ {property.bedrooms} Beds
              </span>
            )}

            {property.bathrooms !== undefined && property.bathrooms !== null && (
              <span className="border border-[#E4DFD3] bg-[#F7F5EF] px-2.5 py-1 text-[11px]">
                🛁 {property.bathrooms} Baths
              </span>
            )}

            {property.area !== undefined && property.area !== null && (
              <span className="border border-[#E4DFD3] bg-[#F7F5EF] px-2.5 py-1 text-[11px]">
                📐 {property.area} m²
              </span>
            )}
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between border-t border-[#14213D]/10 bg-[#F7F5EF] p-4">
        <div>
          <span
            className={`${mono} text-[9px] uppercase tracking-wider text-[#4A5568]`}
          >
            Valuation
          </span>

          <p className={`${serif} text-base font-bold text-[#14213D]`}>
            {price}
          </p>
        </div>

        <Link
          to={`/properties/${property.id}`}
          className={`${mono} flex items-center gap-1 border border-[#14213D] bg-[#14213D] px-4 py-2 text-xs font-semibold uppercase tracking-wider text-[#F7F5EF] transition-all hover:border-[#B8863B] hover:bg-[#B8863B]`}
        >
          <span>Details</span>
          <span>→</span>
        </Link>
      </div>
    </div>
  );
};

const Properties = () => {
  const [activeTab, setActiveTab] = useState<"SALE" | "RENT">("SALE");
  const [showAll, setShowAll] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  const { data, isLoading, isError } = usegetallprop({
    page: currentPage,
    limit: itemsPerPage,
    type: activeTab,
    status: showAll ? undefined : "AVAILABLE", // 👈 تم التعديل: إرسال undefined لإحضار الكل أو AVAILABLE فقط
  });

  const properties: Property[] = data?.data ?? [];
  const totalItems: number = data?.total ?? properties.length;
  const totalPages: number = data?.totalPages ?? Math.ceil(totalItems / itemsPerPage);

  useEffect(() => {
    setCurrentPage(1);
  }, [activeTab, showAll]);

  const handlePageChange = (page: number) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const startItem = totalItems === 0 ? 0 : (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, totalItems);

  const getPageNumbers = () => {
    if (totalPages <= 7) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }

    if (currentPage <= 4) {
      return [1, 2, 3, 4, "...", totalPages - 2, totalPages - 1, totalPages];
    }

    if (currentPage >= totalPages - 3) {
      return [1, 2, 3, "...", totalPages - 3, totalPages - 2, totalPages - 1, totalPages];
    }

    return [1, 2, 3, "...", currentPage, "...", totalPages - 2, totalPages - 1, totalPages];
  };

  if (isLoading) {
    return (
      <div className="mx-auto max-w-7xl space-y-8 p-4">
        <div className="h-20 animate-pulse border-b border-[#14213D] bg-[#F7F5EF]" />
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className="h-96 animate-pulse border border-[#14213D]/20 bg-[#FFFDF9]"
            />
          ))}
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center border border-[#B8452E] bg-[#FFFDF9] p-6 text-center">
        <div>
          <span className="text-2xl">⚠️</span>
          <h2 className={`${serif} mt-2 text-lg font-semibold text-[#B8452E]`}>
            Failed to load properties
          </h2>
          <p className={`${mono} mt-1 text-xs text-[#4A5568]`}>
            We couldn't retrieve the estate catalog. Please try again later.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl space-y-8 px-4 py-8">
      {/* Header Section */}
      <div className="flex flex-col gap-6 border-b border-[#14213D]/20 pb-6 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <span
            className={`${mono} text-[10px] uppercase tracking-[0.2em] text-[#B8863B]`}
          >
            Estate Collection
          </span>

          <h1 className={`${serif} text-3xl font-semibold text-[#14213D]`}>
            Curated Properties
          </h1>

          <p className={`${mono} mt-1 text-xs text-[#4A5568]`}>
            Explore our exclusive collection categorized for sale and rent.
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex border border-[#14213D] bg-[#EFEAE0]/50 p-1">
          <button
            onClick={() => setActiveTab("SALE")}
            className={`${mono} px-5 py-2 text-xs font-bold uppercase tracking-wider transition ${
              activeTab === "SALE"
                ? "bg-[#14213D] text-[#FFFDF9] shadow-sm"
                : "text-[#14213D] hover:bg-[#FFFDF9]"
            }`}
          >
            For Sale
          </button>

          <button
            onClick={() => setActiveTab("RENT")}
            className={`${mono} px-5 py-2 text-xs font-bold uppercase tracking-wider transition ${
              activeTab === "RENT"
                ? "bg-[#14213D] text-[#FFFDF9] shadow-sm"
                : "text-[#14213D] hover:bg-[#FFFDF9]"
            }`}
          >
            For Rent
          </button>
        </div>
      </div>

      {/* Sub-Header Controls */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <button
          onClick={() => setShowAll((prev) => !prev)}
          className={`${mono} flex items-center gap-2 border border-[#14213D] bg-[#FFFDF9] px-3.5 py-2 text-xs font-medium text-[#14213D] transition hover:bg-[#F7F5EF]`}
        >
          <span
            className={`h-2.5 w-2.5 rounded-full transition-colors ${
              showAll ? "bg-[#B8863B]" : "bg-emerald-600"
            }`}
          />
          {showAll
            ? `Showing All ${activeTab === "SALE" ? "Sale" : "Rental"} Properties`
            : "Showing Available Only"}
        </button>

        <div className="border border-[#14213D] bg-[#F7F5EF] px-4 py-2 text-right">
          <span
            className={`${mono} text-[10px] uppercase tracking-widest text-[#4A5568]`}
          >
            {activeTab === "SALE" ? "Sale Listings" : "Rental Listings"}
          </span>

          <p className={`${serif} text-lg font-bold text-[#14213D]`}>
            {totalItems}
          </p>
        </div>
      </div>

      {/* Properties Grid */}
      {properties.length === 0 ? (
        <div className="flex min-h-[300px] items-center justify-center border border-dashed border-[#14213D]/40 bg-[#FFFDF9] p-10 text-center">
          <div>
            <span className="text-3xl">🏛️</span>
            <h2 className={`${serif} mt-3 text-xl font-medium text-[#14213D]`}>
              No {activeTab === "SALE" ? "Sale" : "Rental"} Properties Found
            </h2>
            <p className={`${mono} mt-1 text-xs text-[#4A5568]`}>
              There are currently no listings matching this criteria.
            </p>
          </div>
        </div>
      ) : (
        <>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {properties.map((property) => (
              <PropertyCard key={property.id} property={property} />
            ))}
          </div>

          {/* PAGINATION BAR */}
          {totalPages > 1 && (
            <div className="mt-12 flex flex-col items-center gap-4 border-t border-[#14213D]/10 pt-8 sm:flex-row sm:justify-between">
              <div className={`${mono} text-xs text-[#4A5568]`}>
                Showing <span className="font-semibold text-[#14213D]">{startItem}</span> to{" "}
                <span className="font-semibold text-[#14213D]">{endItem}</span> of{" "}
                <span className="font-semibold text-[#14213D]">{totalItems}</span> Properties
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className={`${mono} flex items-center gap-1.5 border border-[#14213D]/20 bg-[#FFFDF9] px-3.5 py-2 text-xs font-semibold text-[#14213D] transition-all hover:border-[#14213D] hover:bg-[#14213D] hover:text-[#FFFDF9] disabled:cursor-not-allowed disabled:border-gray-200 disabled:bg-gray-50 disabled:text-gray-400`}
                  title="Previous Page"
                >
                  <svg className="h-3.5 w-3.5 fill-current" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  <span>Prev</span>
                </button>

                <div className="flex items-center gap-1 rounded-sm border border-[#14213D]/15 bg-[#F7F5EF] p-1">
                  {getPageNumbers().map((page, index) => {
                    if (page === "...") {
                      return (
                        <span
                          key={`ellipsis-${index}`}
                          className={`${mono} flex h-8 min-w-[32px] select-none items-center justify-center text-xs font-bold text-[#4A5568]`}
                        >
                          ...
                        </span>
                      );
                    }

                    const pageNum = Number(page);
                    const isActive = currentPage === pageNum;

                    return (
                      <button
                        key={pageNum}
                        onClick={() => handlePageChange(pageNum)}
                        className={`${mono} h-8 min-w-[32px] text-xs font-bold transition-all ${
                          isActive
                            ? "bg-[#14213D] text-[#FFFDF9] shadow-sm"
                            : "text-[#14213D] hover:bg-[#EFEAE0]"
                        }`}
                      >
                        {pageNum < 10 ? `0${pageNum}` : pageNum}
                      </button>
                    );
                  })}
                </div>

                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className={`${mono} flex items-center gap-1.5 border border-[#14213D]/20 bg-[#FFFDF9] px-3.5 py-2 text-xs font-semibold text-[#14213D] transition-all hover:border-[#14213D] hover:bg-[#14213D] hover:text-[#FFFDF9] disabled:cursor-not-allowed disabled:border-gray-200 disabled:bg-gray-50 disabled:text-gray-400`}
                  title="Next Page"
                >
                  <span>Next</span>
                  <svg className="h-3.5 w-3.5 fill-current" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                  </svg>
                </button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Properties;
