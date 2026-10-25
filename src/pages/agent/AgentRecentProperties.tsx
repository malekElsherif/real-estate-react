import { useState } from "react";
import { Link } from "react-router-dom";

import { usegetme } from "../../hooks/useUsers";
import { usegetpropbyuser } from "../../hooks/useProp";
import Imgcard from "../properties/Imgcard";

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
      <div className="flex min-h-[300px] items-center justify-center rounded-2xl border border-stone-100 bg-white shadow-sm">
        <div className="text-center">
          <div className="mx-auto h-8 w-8 animate-spin rounded-full border-2 border-stone-200 border-t-amber-800" />
          <p className="mt-3 text-xs uppercase tracking-wider text-stone-500">
            Loading properties...
          </p>
        </div>
      </div>
    );
  }

  return (
    <section className="rounded-2xl border border-stone-100 bg-white shadow-sm overflow-hidden text-stone-900">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-stone-100 p-5 bg-stone-50/50">
        <div>
          <span className="text-[10px] font-semibold uppercase tracking-wider text-amber-800">
            Inventory
          </span>
          <h2 className="text-xl font-bold tracking-tight text-stone-900">
            My Properties
          </h2>
        </div>

        <Link
          to="/agent/my-properties"
          className="text-xs font-semibold uppercase tracking-wider text-stone-700 no-underline transition hover:text-amber-800"
        >
          View All →
        </Link>
      </div>

      {/* Properties List */}
      <div className="divide-y divide-stone-100">
        {recentProperties.length === 0 ? (
          <div className="p-10 text-center">
            <h3 className="text-lg font-semibold text-stone-900">
              No Properties Listed
            </h3>
            <p className="mt-1 text-xs text-stone-500">
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
              <div key={property.id} className="group transition hover:bg-stone-50">
                {/* Compact Row */}
                <button
                  type="button"
                  onClick={() => toggleProperty(property.id)}
                  className="flex w-full items-center gap-4 p-4 text-left cursor-pointer"
                >
                  {/* Image Container */}
                  <div className="group/img relative flex h-20 w-24 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-stone-200 bg-stone-100">
                    {/* Zoomable Image */}
                    <div className="flex h-full w-full items-center justify-center transition-transform duration-300 group-hover/img:scale-110 [&_img]:h-full [&_img]:w-full [&_img]:object-contain">
                      <Imgcard propertyId={property.id} />
                    </div>

                    {/* Location Badge */}
                    <div className="pointer-events-none absolute inset-x-0 bottom-0 translate-y-full bg-stone-900/90 p-1 backdrop-blur-xs transition-all duration-300 group-hover/img:translate-y-0 group-hover/img:opacity-100">
                      <p className="truncate text-center text-[8.5px] uppercase tracking-wider text-white">
                        <span className="text-[7.5px]">📍</span> {property.city || property.location || "Egypt"}
                      </p>
                    </div>
                  </div>

                  {/* Basic Info */}
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <h3 className="truncate text-base font-bold text-stone-900 group-hover:text-amber-800 transition">
                        {property.title || "Untitled Property"}
                      </h3>

                      <span
                        className={`hidden shrink-0 rounded-full px-2.5 py-0.5 text-[9px] font-semibold uppercase tracking-wider sm:inline-block ${
                          isAvailable
                            ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                            : "bg-rose-50 text-rose-600 border border-rose-200"
                        }`}
                      >
                        {property.status || "Unknown"}
                      </span>
                    </div>

                    <p className="mt-1 truncate text-xs text-stone-500">
                      📍 {property.city || property.location || "Egypt"}
                    </p>

                    <p className="mt-1 text-sm font-bold text-amber-800">
                      {property.price?.toLocaleString() ?? 0} EGP
                    </p>
                  </div>

                  {/* Arrow Icon */}
                  <div
                    className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-lg border border-stone-200 text-xs text-stone-700 transition-transform duration-200 ${
                      isExpanded ? "rotate-180 bg-stone-900 text-white border-stone-900" : ""
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
                    <div className="border-t border-dotted border-stone-200 px-4 pb-4 pt-3 bg-stone-50/50">
                      {/* Status on Mobile */}
                      <div className="mb-3 flex items-center justify-between sm:hidden">
                        <span className="text-xs text-stone-500">Status</span>
                        <span
                          className={`rounded-full px-2.5 py-0.5 text-[9px] font-semibold uppercase tracking-wider ${
                            isAvailable
                              ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                              : "bg-rose-50 text-rose-600 border border-rose-200"
                          }`}
                        >
                          {property.status || "Unknown"}
                        </span>
                      </div>

                      {/* Specs */}
                      <div className="grid grid-cols-3 gap-2 rounded-xl border border-stone-200 bg-white p-3 text-xs shadow-xs">
                        <div className="text-center">
                          <p className="text-[10px] uppercase text-stone-400 font-semibold">Beds</p>
                          <p className="mt-1 font-bold text-stone-900">
                            {property.bedrooms ?? 0}
                          </p>
                        </div>

                        <div className="border-x border-stone-200 text-center">
                          <p className="text-[10px] uppercase text-stone-400 font-semibold">Baths</p>
                          <p className="mt-1 font-bold text-stone-900">
                            {property.bathrooms ?? 0}
                          </p>
                        </div>

                        <div className="text-center">
                          <p className="text-[10px] uppercase text-stone-400 font-semibold">Area</p>
                          <p className="mt-1 font-bold text-stone-900">
                            {property.area ?? 0} m²
                          </p>
                        </div>
                      </div>

                      {/* Footer Actions */}
                      <div className="mt-3 flex items-center justify-between">
                        <span className="text-xs text-stone-500">
                          REF #{property.id}
                        </span>

                        <Link
                          to={`/properties/${property.id}`}
                          onClick={(e) => e.stopPropagation()}
                          className="rounded-xl border border-stone-200 bg-white px-3 py-1.5 text-xs font-semibold uppercase tracking-wider text-stone-700 no-underline transition hover:bg-stone-900 hover:text-white"
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
