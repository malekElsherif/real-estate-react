import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { usegetpropbyuser } from "../../hooks/useProp";
import { usegetme } from "../../hooks/useUsers";
import Imgcard from "../properties/Imgcard";
import Editproperity from "../properties/Editproperity";
import Deleteprop from "../properties/Deleteprop";

type FilterTab = "ALL" | "AVAILABLE" | "SALE" | "RENT" | "PENDING" | "SOLD_OR_RENTED";

const Myproperites = () => {
  const navigate = useNavigate();
  const [editOpen, setEditOpen] = useState(false);
  const [selectedPropertyId, setSelectedPropertyId] = useState<number | null>(null);
  const [activeTab, setActiveTab] = useState<FilterTab>("ALL");

  const {
    data: meData,
    isLoading: meLoading,
    isError: meError,
  } = usegetme();

  const userId = meData?.data?.userId;
  const userRole = meData?.data?.role || localStorage.getItem("role");
  const isAgentOrAdmin = userRole === "AGENT" || userRole === "ADMIN";

  const {
    data: myproperties,
    isLoading: propertiesLoading,
    isError: propertiesError,
  } = usegetpropbyuser(userId);

  if (meLoading || propertiesLoading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center text-stone-900">
        <div className="flex flex-col items-center gap-3">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-stone-200 border-t-amber-800" />
          <p className="text-xs uppercase tracking-wider text-stone-500">
            Retrieving listings...
          </p>
        </div>
      </div>
    );
  }

  if (meError || propertiesError) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center px-4 text-stone-900">
        <div className="max-w-sm rounded-2xl border border-rose-200 bg-white p-8 text-center shadow-sm space-y-3">
          <p className="text-xs uppercase tracking-wider text-rose-600 font-semibold">
            Error 01
          </p>
          <p className="text-xl font-bold tracking-tight">
            Couldn't load your properties
          </p>
          <p className="text-sm text-stone-500">
            Check your connection and try refreshing the page.
          </p>
        </div>
      </div>
    );
  }

  const properties = myproperties?.data?.data ?? [];

  const isSoldOrRentedProp = (property: any) => {
    const status = property.status?.toString().toUpperCase();
    const isAvailable = property.isAvailable;
    return isAvailable === false || status === "SOLD" || status === "RENTED" || status === "CLOSED";
  };

  const filteredProperties = properties.filter((property: any) => {
    const status = property.status?.toString().toUpperCase();
    const type = property.type?.toString().toUpperCase();
    const soldOrRented = isSoldOrRentedProp(property);

    if (activeTab === "SOLD_OR_RENTED") return soldOrRented;
    if (activeTab === "AVAILABLE") return !soldOrRented && status !== "PENDING";
    if (activeTab === "SALE") return type === "SALE" && !soldOrRented;
    if (activeTab === "RENT") return type === "RENT" && !soldOrRented;
    if (activeTab === "PENDING") return status === "PENDING" || status === "UNDER_REVIEW";
    return true;
  });

  const handleEdit = (propertyId: number) => {
    setSelectedPropertyId(propertyId);
    setEditOpen(true);
  };

  const handleCloseEdit = () => {
    setEditOpen(false);
    setSelectedPropertyId(null);
  };

  return (
    <div className="mx-auto max-w-7xl text-stone-900 space-y-8">
      {/* Header */}
      <div className="flex flex-col gap-6 border-b border-stone-200 pb-6 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-amber-800">
            Dashboard / Portfolio
          </p>

          <h1 className="mt-1 text-3xl font-bold tracking-tight sm:text-4xl">
            My Properties
          </h1>

          <p className="mt-1 text-sm text-stone-500">
            {properties.length > 0
              ? `${properties.length} ${
                  properties.length === 1 ? "listing" : "listings"
                } under management`
              : "Manage your listings"}
          </p>
        </div>

        <button
          type="button"
          onClick={() => navigate("/agent/add-property")}
          className="w-fit rounded-xl bg-amber-800 px-6 py-3 text-xs font-semibold uppercase tracking-wider text-white transition hover:bg-amber-900 cursor-pointer"
        >
          + Add Property
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap gap-2 border-b border-stone-200 pb-4">
        {[
          { id: "ALL", label: "All Properties", count: properties.length },
          { id: "AVAILABLE", label: "Available", count: properties.filter((p: any) => !isSoldOrRentedProp(p) && p.status !== "PENDING").length },
          { id: "SALE", label: "For Sale", count: properties.filter((p: any) => p.type === "SALE" && !isSoldOrRentedProp(p)).length },
          { id: "RENT", label: "For Rent", count: properties.filter((p: any) => p.type === "RENT" && !isSoldOrRentedProp(p)).length },
          { id: "SOLD_OR_RENTED", label: "Sold / Rented", count: properties.filter((p: any) => isSoldOrRentedProp(p)).length },
          { id: "PENDING", label: "Pending Review", count: properties.filter((p: any) => p.status === "PENDING" || p.status === "UNDER_REVIEW").length },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as FilterTab)}
            className={`rounded-xl px-4 py-2 text-xs font-semibold uppercase tracking-wider transition-all cursor-pointer ${
              activeTab === tab.id
                ? "bg-stone-900 text-white shadow-xs"
                : "border border-stone-200 bg-white text-stone-600 hover:bg-stone-50 hover:text-stone-900"
            }`}
          >
            {tab.label} <span className="opacity-75">({tab.count})</span>
          </button>
        ))}
      </div>

      {/* Grid or Empty */}
      {filteredProperties.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-stone-300 bg-white px-12 py-20 text-center shadow-xs">
          <span className="text-4xl mb-3">🏠</span>
          <h2 className="text-xl font-bold tracking-tight text-stone-900">
            No properties found in this section
          </h2>
          <p className="mt-1 max-w-xs text-xs text-stone-500">
            Try switching to another tab or add a new listing.
          </p>
        </div>
      ) : (
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {filteredProperties.map((property: any) => {
            const isRent = property.type === "RENT";
            const isSoldOrRented = isSoldOrRentedProp(property);

            return (
              <div
                key={property.id}
                className="group relative flex h-full flex-col rounded-2xl border border-stone-100 bg-white shadow-sm overflow-hidden transition"
              >
                {/* Image Link */}
                <Link
                  to={`/properties/${property.id}`}
                  className="relative block h-56 shrink-0 bg-stone-100 overflow-hidden no-underline"
                >
                  <div className="transition-transform duration-300 group-hover:scale-105 h-full">
                    <Imgcard propertyId={property.id} />
                  </div>

                  {/* Status Stamp / Badge */}
                  {isSoldOrRented ? (
                    <div className="absolute inset-0 flex items-center justify-center bg-stone-900/40 pointer-events-none">
                      <div className="rotate-[-12deg] rounded-xl border border-white/40 bg-stone-900/60 px-5 py-1.5 text-xs font-bold uppercase tracking-widest text-white backdrop-blur-xs shadow-md">
                        {isRent ? "Rented Out" : "Sold"}
                      </div>
                    </div>
                  ) : (
                    <span
                      className={`absolute right-3 top-3 rounded-full px-3 py-1 text-[10px] font-semibold uppercase tracking-wider shadow-xs ${
                        isRent
                          ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                          : "bg-rose-50 text-rose-600 border border-rose-200"
                      }`}
                    >
                      {isRent ? "For Rent" : "For Sale"}
                    </span>
                  )}
                </Link>

                {/* Content Wrapper */}
                <div className="flex flex-1 flex-col p-6 space-y-4">
                  <div>
                    <p className="text-[10px] font-semibold uppercase tracking-wider text-amber-800">
                      📍 {property.city || property.location || "Egypt"}
                    </p>

                    <Link to={`/properties/${property.id}`} className="no-underline">
                      <h2
                        title={property.title}
                        className="mt-1 line-clamp-1 text-lg font-bold text-stone-900 hover:text-amber-800 transition"
                      >
                        {property.title}
                      </h2>
                    </Link>

                    <p className="mt-1 line-clamp-2 text-xs leading-relaxed text-stone-500">
                      {property.description}
                    </p>
                  </div>

                  {/* Spec Sheet */}
                  <div className="text-xs text-stone-600 space-y-1.5 border-t border-stone-100 pt-3">
                    <div className="flex justify-between border-b border-stone-100 pb-1">
                      <span>Bedrooms</span>
                      <span className="font-semibold text-stone-900">{property.bedrooms}</span>
                    </div>
                    <div className="flex justify-between border-b border-stone-100 pb-1">
                      <span>Bathrooms</span>
                      <span className="font-semibold text-stone-900">{property.bathrooms}</span>
                    </div>
                    <div className="flex justify-between pb-1">
                      <span>Area</span>
                      <span className="font-semibold text-stone-900">{property.area} m²</span>
                    </div>
                  </div>

                  {/* Price & Actions */}
                  <div className="mt-auto border-t border-stone-100 pt-4 space-y-3">
                    <p className="text-xl font-bold text-amber-800">
                      {property.price?.toLocaleString() ?? 0} EGP
                    </p>

                    {isAgentOrAdmin && (
                      <div className="rounded-xl border border-amber-200 bg-amber-50/50 p-2 text-center">
                        <p className="text-[10px] font-semibold uppercase tracking-wider text-amber-800">
                          ★ Managed Property ({userRole})
                        </p>
                      </div>
                    )}

                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => handleEdit(property.id)}
                        className="flex-1 rounded-xl border border-stone-200 bg-white py-2 text-xs font-semibold uppercase tracking-wider text-stone-700 transition hover:bg-stone-900 hover:text-white cursor-pointer"
                      >
                        Edit
                      </button>

                      <div className="flex shrink-0">
                        <Deleteprop id={property.id} />
                      </div>
                    </div>

                    <Link
                      to={`/agent/properties/${property.id}/images`}
                      className="flex items-center justify-center gap-1.5 rounded-xl border border-stone-200 bg-stone-50 py-2.5 text-center text-xs font-semibold uppercase tracking-wider text-stone-700 no-underline transition hover:bg-amber-800 hover:text-white hover:border-amber-800"
                    >
                      Manage Images →
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Edit Dialog */}
      {selectedPropertyId !== null && (
        <Editproperity
          id={selectedPropertyId}
          open={editOpen}
          onClose={handleCloseEdit}
        />
      )}
    </div>
  );
};

export default Myproperites;
