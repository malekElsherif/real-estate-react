import { useState } from "react";
import { Link } from "react-router-dom";

import { usegetme } from "../../hooks/useUsers";
import { usegetpropbyuser } from "../../hooks/useProp";
import Imgcard from "../properties/Imgcard";

const serif = "[font-family:'Fraunces',serif]";
const mono = "[font-family:'IBM_Plex_Mono',monospace]";

const AgentRecentProperties = () => {
  const [expandedId, setExpandedId] = useState<number | null>(null);

  const { data: meData, isLoading: meLoading } = usegetme();
  const userId = meData?.data?.userId;

  const {
    data,
    isLoading: propertiesLoading,
  } = usegetpropbyuser(userId);

  const properties = data?.data?.data ?? [];
  const recentProperties = properties.slice(0, 3);

  const toggleProperty = (id: number) => {
    setExpandedId((current) => (current === id ? null : id));
  };

  if (meLoading || propertiesLoading) {
    return (
      <div className="flex min-h-[300px] items-center justify-center border border-[#14213D] bg-[#FFFDF9]">
        <div className="text-center">
          <div className="mx-auto h-8 w-8 animate-spin rounded-full border-2 border-[#E4DFD3] border-t-[#14213D]" />
          <p className={`${mono} mt-3 text-xs uppercase tracking-widest text-[#4A5568]`}>
            Loading properties...
          </p>
        </div>
      </div>
    );
  }

  return (
    <section className="relative border border-[#14213D] bg-[#FFFDF9]">
      {/* Corner registration marks */}
      <span className="pointer-events-none absolute -left-px -top-px h-2.5 w-2.5 border-l-[1.5px] border-t-[1.5px] border-[#14213D]" />
      <span className="pointer-events-none absolute -right-px -top-px h-2.5 w-2.5 border-r-[1.5px] border-t-[1.5px] border-[#14213D]" />

      {/* Header */}
      <div className="flex items-center justify-between border-b border-[#14213D] p-5">
        <div>
          <span className={`${mono} text-[10px] uppercase tracking-[0.2em] text-[#B8863B]`}>
            Inventory
          </span>
          <h2 className={`${serif} text-xl font-semibold text-[#14213D]`}>
            My Properties
          </h2>
        </div>

        <Link
          to="/agent/my-properties"
          className={`${mono} text-xs font-semibold uppercase tracking-wider text-[#14213D] transition hover:text-[#B8863B]`}
        >
          View All →
        </Link>
      </div>

      {/* Properties List */}
      <div className="divide-y divide-[#E4DFD3]">
        {recentProperties.length === 0 ? (
          <div className="p-10 text-center">
            <h3 className={`${serif} text-lg font-medium text-[#14213D]`}>
              No Properties Listed
            </h3>
            <p className="mt-1 text-xs text-[#4A5568]">
              You haven't added any properties to your portfolio yet.
            </p>
          </div>
        ) : (
          recentProperties.map((property: any) => {
            const isExpanded = expandedId === property.id;
            const isAvailable =
              property.status?.toUpperCase() === "AVAILABLE" ||
              property.status?.toUpperCase() === "ACTIVE";

            return (
              <div key={property.id} className="group transition hover:bg-[#F7F5EF]">
                {/* Compact Row */}
                <button
                  type="button"
                  onClick={() => toggleProperty(property.id)}
                  className="flex w-full items-center gap-4 p-4 text-left"
                >
                  {/* Image Container */}
                  <div className="group/img relative flex h-20 w-24 shrink-0 items-center justify-center overflow-hidden border border-[#14213D] bg-[#EFEAE0]">
                    {/* Zoomable Image */}
                    <div className="flex h-full w-full items-center justify-center transition-transform duration-300 group-hover/img:scale-110 [&_img]:h-full [&_img]:w-full [&_img]:object-contain">
                      <Imgcard propertyId={property.id} />
                    </div>

                    {/* Location Badge (Small Pin 📍 + City Name) - Hover Only */}
                    <div className="pointer-events-none absolute inset-x-0 bottom-0 translate-y-full bg-[#14213D]/90 p-0.5 backdrop-blur-xs transition-all duration-300 group-hover/img:translate-y-0 group-hover/img:opacity-100">
                      <p className={`${mono} truncate text-center text-[8.5px] uppercase tracking-wider text-[#F7F5EF]`}>
                        <span className="text-[7.5px]">📍</span> {property.city || property.location || "Egypt"}
                      </p>
                    </div>
                  </div>

                  {/* Basic Info */}
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <h3 className={`${serif} truncate text-base font-semibold text-[#14213D]`}>
                        {property.title || "Untitled Property"}
                      </h3>

                      <span
                        className={`${mono} hidden shrink-0 border border-dashed px-2 py-0.5 text-[9px] font-medium uppercase tracking-widest sm:inline-block ${
                          isAvailable
                            ? "border-[#5B7B65] text-[#5B7B65]"
                            : "border-[#B8452E] text-[#B8452E]"
                        }`}
                      >
                        {property.status || "Unknown"}
                      </span>
                    </div>

                    <p className={`${mono} mt-1 truncate text-xs text-[#4A5568]`}>
                      {property.city || property.location || "Egypt"}
                    </p>

                    <p className={`${mono} mt-1 text-sm font-medium text-[#B8863B]`}>
                      {property.price?.toLocaleString() ?? 0} EGP
                    </p>
                  </div>

                  {/* Arrow Icon */}
                  <div
                    className={`${mono} flex h-7 w-7 shrink-0 items-center justify-center border border-[#14213D] text-xs text-[#14213D] transition-transform duration-200 ${
                      isExpanded ? "rotate-180 bg-[#14213D] text-[#F7F5EF]" : ""
                    }`}
                  >
                    ↓
                  </div>
                </button>

                {/* Expanded Details */}
                <div
                  className={`grid transition-all duration-300 ease-in-out ${
                    isExpanded
                      ? "grid-rows-[1fr] opacity-100"
                      : "grid-rows-[0fr] opacity-0"
                  }`}
                >
                  <div className="overflow-hidden">
                    <div className="border-t border-dotted border-[#E4DFD3] px-4 pb-4 pt-3">
                      {/* Status on Mobile */}
                      <div className="mb-3 flex items-center justify-between sm:hidden">
                        <span className={`${mono} text-xs text-[#4A5568]`}>Status</span>
                        <span
                          className={`${mono} border border-dashed px-2 py-0.5 text-[9px] font-medium uppercase tracking-widest ${
                            isAvailable
                              ? "border-[#5B7B65] text-[#5B7B65]"
                              : "border-[#B8452E] text-[#B8452E]"
                          }`}
                        >
                          {property.status || "Unknown"}
                        </span>
                      </div>

                      {/* Specs */}
                      <div className={`${mono} grid grid-cols-3 gap-2 border border-[#E4DFD3] bg-[#FFFDF9] p-3 text-xs`}>
                        <div className="text-center">
                          <p className="text-[10px] uppercase text-[#4A5568]">Beds</p>
                          <p className="mt-1 font-semibold text-[#14213D]">
                            {property.bedrooms ?? 0}
                          </p>
                        </div>

                        <div className="border-x border-[#E4DFD3] text-center">
                          <p className="text-[10px] uppercase text-[#4A5568]">Baths</p>
                          <p className="mt-1 font-semibold text-[#14213D]">
                            {property.bathrooms ?? 0}
                          </p>
                        </div>

                        <div className="text-center">
                          <p className="text-[10px] uppercase text-[#4A5568]">Area</p>
                          <p className="mt-1 font-semibold text-[#14213D]">
                            {property.area ?? 0} m²
                          </p>
                        </div>
                      </div>

                      {/* Footer Actions */}
                      <div className="mt-3 flex items-center justify-between">
                        <span className={`${mono} text-xs text-[#4A5568]`}>
                          REF #{property.id}
                        </span>

                        <Link
                          to={`/properties/${property.id}`}
                          onClick={(e) => e.stopPropagation()}
                          className={`${mono} border border-[#14213D] px-3 py-1.5 text-xs font-semibold uppercase tracking-wider text-[#14213D] transition hover:bg-[#14213D] hover:text-[#F7F5EF]`}
                        >
                          View Details →
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </section>
  );
};

export default AgentRecentProperties;
