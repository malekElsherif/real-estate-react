import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { usegetpropbyuser } from "../../hooks/useProp";
import { usegetme } from "../../hooks/useUsers";
import Imgcard from "../properties/Imgcard";
import Editproperity from "../properties/Editproperity";
import Deleteprop from "../properties/Deleteprop";

const FontImports = () => (
  <style>{`@import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,400;9..144,500;9..144,600;9..144,700&family=Inter:wght@400;500;600&family=IBM+Plex+Mono:wght@400;500&display=swap');`}</style>
);

const serif = "[font-family:'Fraunces',serif]";
const mono = "[font-family:'IBM_Plex_Mono',monospace]";

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
      <div className="flex min-h-[60vh] items-center justify-center">
        <FontImports />
        <div className="flex flex-col items-center gap-3">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-[#E4DFD3] border-t-[#14213D]" />
          <p className={`${mono} text-xs uppercase tracking-widest text-[#4A5568]`}>
            Retrieving listings
          </p>
        </div>
      </div>
    );
  }

  if (meError || propertiesError) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center px-4">
        <FontImports />
        <div className="max-w-sm border border-[#B8452E] bg-[#FFFDF9] px-8 py-10 text-center">
          <p className={`${mono} text-xs uppercase tracking-widest text-[#B8452E]`}>
            Error 01
          </p>
          <p className={`${serif} mt-3 text-xl font-medium text-[#14213D]`}>
            Couldn't load your properties
          </p>
          <p className="mt-2 text-sm text-[#4A5568]">
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
    <div>
      <FontImports />

      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-8 flex flex-col gap-6 border-b border-[#14213D] pb-6 md:flex-row md:items-end md:justify-between">
          <div>
            <p className={`${mono} text-xs uppercase tracking-[0.25em] text-[#B8863B]`}>
              Dashboard / Portfolio
            </p>

            <h1 className={`${serif} mt-2 text-4xl font-semibold text-[#14213D] md:text-5xl`}>
              My Properties
            </h1>

            <p className="mt-2 text-sm text-[#4A5568]">
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
            className="w-fit bg-[#14213D] px-6 py-3 text-sm font-semibold uppercase tracking-wider text-[#F7F5EF] transition-colors duration-150 hover:bg-[#B8863B]"
          >
            + Add Property
          </button>
        </div>

        {/* Filter Tabs */}
        <div className="mb-8 flex flex-wrap gap-2 border-b border-[#E4DFD3] pb-4">
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
              className={`${mono} border px-4 py-2 text-xs font-semibold uppercase tracking-wider transition-all ${
                activeTab === tab.id
                  ? "border-[#14213D] bg-[#14213D] text-[#F7F5EF]"
                  : "border-[#E4DFD3] bg-[#FFFDF9] text-[#4A5568] hover:border-[#14213D] hover:text-[#14213D]"
              }`}
            >
              {tab.label} <span className="opacity-75">({tab.count})</span>
            </button>
          ))}
        </div>

        {filteredProperties.length === 0 ? (
          <div className="flex flex-col items-center border border-dashed border-[#14213D] bg-[#FFFDF9] px-12 py-20 text-center">
            <svg width="52" height="52" viewBox="0 0 52 52" fill="none" className="mb-5 text-[#14213D]">
              <path d="M6 24L26 8L46 24" stroke="currentColor" strokeWidth="1.5" />
              <path d="M11 21V44H41V21" stroke="currentColor" strokeWidth="1.5" />
              <path d="M22 44V30H30V44" stroke="currentColor" strokeWidth="1.5" />
            </svg>

            <h2 className={`${serif} text-2xl font-medium text-[#14213D]`}>
              No properties found in this section
            </h2>

            <p className="mt-2 max-w-xs text-sm text-[#4A5568]">
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
                  className="relative flex h-full flex-col border border-[#14213D] bg-[#FFFDF9]"
                >
                  <span className="pointer-events-none absolute -left-px -top-px h-2.5 w-2.5 border-l-[1.5px] border-t-[1.5px] border-[#14213D]" />
                  <span className="pointer-events-none absolute -right-px -top-px h-2.5 w-2.5 border-r-[1.5px] border-t-[1.5px] border-[#14213D]" />

                  {/* Image */}
                  <Link
                    to={`/properties/${property.id}`}
                    className="relative block h-56 shrink-0 border-b border-[#14213D] bg-[#EFEAE0] overflow-hidden group"
                  >
                    <div className="transition-transform duration-300 group-hover:scale-105 h-full">
                      <Imgcard propertyId={property.id} />
                    </div>

                    {/* Status stamp / Badge */}
                    {isSoldOrRented ? (
                      /* ديف مائل مع تأثير البلور (Glassmorphism) للعقارات المباعة/المؤجرة */
                      <div className="absolute inset-0 flex items-center justify-center bg-black/20 pointer-events-none">
                        <div className={`${mono} rotate-[-12deg] rounded-md border border-white/40 bg-black/40 px-6 py-2 text-sm font-bold uppercase tracking-widest text-white backdrop-blur-md shadow-2xl`}>
                          {isRent ? "Rented Out" : "Sold"}
                        </div>
                      </div>
                    ) : (
                      <span
                        className={`${mono} absolute right-4 top-4 -rotate-[7deg] border-[1.5px] border-dashed bg-[#FFFDF9]/90 px-3 py-1 text-[11px] font-medium uppercase tracking-widest ${
                          isRent ? "text-[#5B7B65]" : "text-[#B8452E]"
                        }`}
                      >
                        {isRent ? "For Rent" : "For Sale"}
                      </span>
                    )}
                  </Link>

                  {/* Content wrapper */}
                  <div className="flex flex-1 flex-col p-6 pt-8">
                    <p className={`${mono} text-[11px] uppercase tracking-[0.2em] text-[#B8863B]`}>
                      {property.city || property.location || "Egypt"}
                    </p>

                    <Link to={`/properties/${property.id}`}>
                      <h2
                        title={property.title}
                        className={`${serif} mt-2 line-clamp-1 text-xl font-semibold text-[#14213D] hover:text-[#B8863B] transition-colors`}
                      >
                        {property.title}
                      </h2>
                    </Link>

                    <div className="mt-2 flex-1">
                      <p className="line-clamp-2 text-sm leading-6 text-[#4A5568]">
                        {property.description}
                      </p>
                    </div>

                    {/* Spec sheet */}
                    <div className={`${mono} mt-4 text-xs text-[#4A5568]`}>
                      <div className="flex justify-between border-b border-dotted border-[#E4DFD3] py-1.5">
                        <span>Bedrooms</span>
                        <span className="font-medium text-[#14213D]">{property.bedrooms}</span>
                      </div>
                      <div className="flex justify-between border-b border-dotted border-[#E4DFD3] py-1.5">
                        <span>Bathrooms</span>
                        <span className="font-medium text-[#14213D]">{property.bathrooms}</span>
                      </div>
                      <div className="flex justify-between py-1.5">
                        <span>Area</span>
                        <span className="font-medium text-[#14213D]">{property.area} m²</span>
                      </div>
                    </div>

                    {/* Price & Actions section */}
                    <div className="mt-auto border-t border-[#E4DFD3] pt-5">
                      <p className={`${mono} mb-4 text-2xl font-medium text-[#B8863B]`}>
                        {property.price}
                      </p>

                      {isAgentOrAdmin ? (
                        <div className="mb-3 rounded border border-dashed border-[#B8863B] bg-[#F7F5EF] p-2 text-center">
                          <p className={`${mono} text-[10px] uppercase text-[#B8863B]`}>
                            ★ Managed Property ({userRole})
                          </p>
                        </div>
                      ) : null}

                      <div className="flex gap-3">
                        <button
                          type="button"
                          onClick={() => handleEdit(property.id)}
                          className="flex-1 border border-[#14213D] py-2.5 text-xs font-semibold uppercase tracking-wider text-[#14213D] transition-colors duration-150 hover:bg-[#14213D] hover:text-[#F7F5EF]"
                        >
                          Edit
                        </button>

                        <div className="flex">
                          <Deleteprop id={property.id} />
                        </div>
                      </div>

                      <Link
                        to={`/agent/properties/${property.id}/images`}
                        className="mt-3 flex items-center justify-center gap-1.5 bg-[#EFEAE0] border border-[#E4DFD3] py-2.5 text-center text-xs font-semibold uppercase tracking-wider text-[#14213D] transition-colors duration-150 hover:bg-[#14213D] hover:text-[#F7F5EF] hover:border-[#14213D]"
                      >
                        Manage Images
                        <span aria-hidden="true">→</span>
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Edit Dialog */}
      {selectedPropertyId !== null && (
        <Editproperity
          propertyId={selectedPropertyId}
          open={editOpen}
          onClose={handleCloseEdit}
        />
      )}
    </div>
  );
};

 // Fix syntax export structure if needed

export default Myproperites;
