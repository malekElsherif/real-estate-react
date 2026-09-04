import { useState, useMemo } from "react";
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

  const locationText =
    property.city || property.location || "Egypt";

  const isUnavailable =
    property.status === "SOLD" ||
    property.status === "RENTED" ||
    property.status === "PENDING";

  const badgeText =
    property.status === "SOLD"
      ? "SOLD"
      : property.status === "RENTED"
        ? "RENTED"
        : "PENDING";

  return (
    <div
      className={`group flex flex-col justify-between border transition ${
        isUnavailable
          ? "border-gray-300 bg-[#F9F8F6]"
          : "border-[#14213D] bg-[#FFFDF9] hover:border-[#B8863B]"
      }`}
    >
      <div>
        {/* Image Container */}
        <div className="relative overflow-hidden border-b border-[#14213D]">
          <div
            className={
              isUnavailable
                ? "filter blur-[2px] grayscale contrast-125"
                : ""
            }
          >
            <Imgcard propertyId={Number(property.id)} />
          </div>

          {property.type && (
            <span
              className={`${mono} absolute top-3 left-3 z-10 border border-[#14213D] bg-[#14213D] px-2.5 py-1 text-[9px] font-semibold uppercase tracking-wider text-[#F7F5EF]`}
            >
              {property.type}
            </span>
          )}

          {/* Overlay Badge للعقار غير المتاح */}
          {isUnavailable && (
            <div className="absolute inset-0 z-20 flex items-center justify-center bg-[#14213D]/40 backdrop-blur-[1px]">
              <div className="border-2 border-[#FFFDF9] bg-[#B8452E] px-6 py-2 shadow-xl">
                <span
                  className={`${mono} text-sm font-bold tracking-[0.25em] text-[#FFFDF9] uppercase`}
                >
                  {badgeText}
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Body Content */}
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

          {/* Specifications Bar */}
          <div
            className={`${mono} flex flex-wrap gap-3 border-t border-dotted border-[#E4DFD3] pt-3 text-xs text-[#14213D]`}
          >
            {property.bedrooms !== undefined && (
              <span className="border border-[#E4DFD3] bg-[#F7F5EF] px-2 py-1">
                🛏️ {property.bedrooms} Beds
              </span>
            )}

            {property.bathrooms !== undefined && (
              <span className="border border-[#E4DFD3] bg-[#F7F5EF] px-2 py-1">
                🛁 {property.bathrooms} Baths
              </span>
            )}

            {property.area !== undefined && (
              <span className="border border-[#E4DFD3] bg-[#F7F5EF] px-2 py-1">
                📐 {property.area} m²
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Footer Action Bar */}
      <div className="flex items-center justify-between border-t border-[#14213D] bg-[#F7F5EF] p-4">
        <div>
          <span
            className={`${mono} text-[9px] uppercase tracking-wider text-[#4A5568]`}
          >
            Valuation
          </span>

          <p
            className={`${serif} text-base font-bold text-[#14213D]`}
          >
            {price}
          </p>
        </div>

        <Link
          to={`/properties/${property.id}`}
          className={`${mono} flex items-center gap-1 border border-[#14213D] bg-[#14213D] px-4 py-2 text-xs font-semibold uppercase tracking-wider text-[#F7F5EF] transition hover:border-[#B8863B] hover:bg-[#B8863B]`}
        >
          <span>Details</span>
          <span>→</span>
        </Link>
      </div>
    </div>
  );
};

const Properties = () => {
  const {
    data,
    isLoading,
    isError,
  } = usegetallprop();

  // تفعيل التبويبات: "SALE" أو "RENT"
  const [activeTab, setActiveTab] =
    useState<"SALE" | "RENT">("SALE");

  // فلتر إضافي لعرض الكل أو المتاح فقط داخل التبويب
  const [showAll, setShowAll] = useState(false);

  const rawProperties: Property[] = useMemo(
    () => data?.data ?? [],
    [data]
  );

  // 1. التصفية حسب النوع
  const tabFilteredProperties = useMemo(() => {
    return rawProperties.filter((property) => {
      const propertyType =
        property.type?.toUpperCase() || "";

      if (activeTab === "SALE") {
        return propertyType === "SALE";
      }

      return propertyType === "RENT";
    });
  }, [rawProperties, activeTab]);

  // 2. التصفية حسب حالة التوافر
  const finalFilteredProperties = useMemo(() => {
    if (showAll) {
      return tabFilteredProperties;
    }

    return tabFilteredProperties.filter(
      (property) => property.status === "AVAILABLE"
    );
  }, [tabFilteredProperties, showAll]);

  if (isLoading) {
    return (
      <div className="mx-auto max-w-7xl space-y-8 p-4">
        <div className="h-20 animate-pulse border-b border-[#14213D] bg-[#F7F5EF]" />

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className="h-96 animate-pulse border border-[#14213D] bg-[#FFFDF9]"
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

          <h2
            className={`${serif} mt-2 text-lg font-semibold text-[#B8452E]`}
          >
            Failed to load properties
          </h2>

          <p
            className={`${mono} mt-1 text-xs text-[#4A5568]`}
          >
            We couldn't retrieve the estate catalog. Please try
            again later.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl space-y-8 px-4 py-8">
      {/* Header Section */}
      <div className="flex flex-col gap-6 border-b border-[#14213D] pb-6 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <span
            className={`${mono} text-[10px] uppercase tracking-[0.2em] text-[#B8863B]`}
          >
            Estate Collection
          </span>

          <h1
            className={`${serif} text-3xl font-semibold text-[#14213D]`}
          >
            Curated Properties
          </h1>

          <p
            className={`${mono} mt-1 text-xs text-[#4A5568]`}
          >
            Explore our exclusive collection categorized for sale
            and rent.
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
        {/* Toggle Filter Button */}
        <button
          onClick={() => setShowAll((prev) => !prev)}
          className={`${mono} flex items-center gap-2 border border-[#14213D] bg-[#FFFDF9] px-3.5 py-2 text-xs font-medium text-[#14213D] transition hover:bg-[#F7F5EF]`}
        >
          <span
            className={`h-2.5 w-2.5 rounded-full ${
              showAll
                ? "bg-[#B8863B]"
                : "bg-[#14213D]"
            }`}
          />

          {showAll
            ? `Showing All ${
                activeTab === "SALE" ? "Sale" : "Rental"
              } Properties`
            : "Showing Available Only"}
        </button>

        <div className="border border-[#14213D] bg-[#F7F5EF] px-4 py-2 text-right">
          <span
            className={`${mono} text-[10px] uppercase tracking-widest text-[#4A5568]`}
          >
            {activeTab === "SALE"
              ? "Sale Listings"
              : "Rental Listings"}
          </span>

          <p
            className={`${serif} text-lg font-bold text-[#14213D]`}
          >
            {finalFilteredProperties.length}
          </p>
        </div>
      </div>

      {/* Properties Grid */}
      {finalFilteredProperties.length === 0 ? (
        <div className="flex min-h-[300px] items-center justify-center border border-dashed border-[#14213D] bg-[#FFFDF9] p-10 text-center">
          <div>
            <span className="text-3xl">🏛️</span>

            <h2
              className={`${serif} mt-3 text-xl font-medium text-[#14213D]`}
            >
              No{" "}
              {activeTab === "SALE"
                ? "Sale"
                : "Rental"}{" "}
              Properties Found
            </h2>

            <p
              className={`${mono} mt-1 text-xs text-[#4A5568]`}
            >
              There are currently no listings matching this
              criteria.
            </p>
          </div>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {finalFilteredProperties.map((property) => (
            <PropertyCard
              key={property.id}
              property={property}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default Properties;
