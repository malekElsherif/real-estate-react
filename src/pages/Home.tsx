import { useState, useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import { usegetme } from "../hooks/useUsers";
import { usegetallprop } from "../hooks/useProp";
import Imgcard from "../pages/properties/Imgcard";

// Fonts loaded via Google Fonts import
const FontImports = () => (
  <style>{`@import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,400;9..144,500;9..144,600;9..144,700&family=Inter:wght@400;500;600&family=IBM+Plex+Mono:wght@400;500&display=swap');`}</style>
);

const serif = "[font-family:'Fraunces',serif]";
const mono = "[font-family:'IBM_Plex_Mono',monospace]";

export const Home = () => {
  const { data: meData } = usegetme();

  // جلب البيانات مع فلترة المتاح فقط
  const { data: propertiesData, isLoading, isError } = usegetallprop({
    status: "AVAILABLE",
  });

  const navigate = useNavigate();

  // Search Filter State
  const [searchQuery, setSearchQuery] = useState("");
  const [propertyType, setPropertyType] = useState("");
  const [listingStatus, setListingStatus] = useState("");

  const user = meData?.data;
  const rawProperties = propertiesData?.data ?? [];

  // 1. فلترة العقارات المتاحة فقط (AVAILABLE) بجميع المعايير في السيرش
  const filteredAvailableProperties = useMemo(() => {
    if (!Array.isArray(rawProperties)) return [];

    return rawProperties.filter((p: any) => {
      // الشرط الأساسي: متاح فقط
      if (p.status !== "AVAILABLE") return false;

      // فلتر نص البحث (المدينة / العنوان / الموقع)
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchesTitle = p.title?.toLowerCase().includes(query);
        const matchesCity = p.city?.toLowerCase().includes(query);
        const matchesLocation = p.location?.toLowerCase().includes(query);

        if (!matchesTitle && !matchesCity && !matchesLocation) {
          return false;
        }
      }

      // فلتر نوع العقار (APARTMENT, VILLA, etc.)
      if (propertyType && p.type !== propertyType) {
        return false;
      }

      // فلتر غرض العقار (SALE, RENT)
      if (listingStatus && p.listingType !== listingStatus && p.type !== listingStatus) {
        return false;
      }

      return true;
    });
  }, [rawProperties, searchQuery, propertyType, listingStatus]);

  // 2. إذا كان المستخدم يبحث نعرض النتائج المفلترة كاملة، وإلا نعرض أول 3 عقارات متاحة فقط
  const displayProperties = useMemo(() => {
    const isSearching = Boolean(searchQuery || propertyType || listingStatus);
    return isSearching ? filteredAvailableProperties : filteredAvailableProperties.slice(0, 3);
  }, [filteredAvailableProperties, searchQuery, propertyType, listingStatus]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // تحويل المستخدم لصفحة العقارات مع الفلاتر عند الضغط على Search
    const params = new URLSearchParams();
    if (searchQuery) params.append("search", searchQuery);
    if (propertyType) params.append("type", propertyType);
    if (listingStatus) params.append("status", listingStatus);

    navigate(`/properties?${params.toString()}`);
  };

  return (
    <div className="min-h-screen bg-[#FFFDF9] text-[#14213D] antialiased">
      <FontImports />

      {/* ================= HERO SECTION ================= */}
      <section className="relative min-h-[640px] border-b border-[#14213D] bg-[#14213D] text-[#F7F5EF]">
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c"
            alt="Modern luxury property"
            className="h-full w-full object-cover object-center opacity-25 filter grayscale"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#14213D] via-[#14213D]/70 to-transparent" />
        </div>

        <div className="relative mx-auto flex max-w-7xl flex-col items-center justify-center px-4 py-20 text-center sm:px-6 lg:px-8 lg:py-28">
          {/* Badge */}
          <div className={`${mono} inline-flex items-center gap-2 border border-[#B8863B]/40 bg-[#14213D]/80 px-4 py-1.5 text-xs font-medium uppercase tracking-[0.2em] text-[#B8863B]`}>
            <span className="h-1.5 w-1.5 bg-[#B8863B]" />
            Curated Real Estate
          </div>

          {/* Title */}
          <h1 className={`${serif} mt-6 text-4xl font-semibold leading-tight text-[#F7F5EF] sm:text-6xl lg:text-7xl`}>
            Find a place you'll <br />
            <span className="italic text-[#B8863B]">love to call home.</span>
          </h1>

          <p className="mt-6 max-w-2xl text-sm leading-relaxed text-[#EFEAE0] sm:text-base">
            Explore premium architectural houses, modern apartments, and luxury villas across Egypt. Verified listings under trusted management.
          </p>

          {/* Search Form */}
          <form
            onSubmit={handleSearch}
            className="mt-10 w-full max-w-4xl border border-[#14213D] bg-[#FFFDF9] p-4 shadow-xl sm:p-6"
          >
            <div className="flex flex-col gap-3 md:flex-row md:items-center">
              <div className="relative flex-1">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search city, neighborhood, or title..."
                  className={`${mono} w-full border border-[#E4DFD3] bg-[#FFFDF9] px-4 py-3 text-xs text-[#14213D] placeholder-[#4A5568] outline-none transition focus:border-[#14213D]`}
                />
              </div>

              <div className="grid grid-cols-2 gap-3 md:w-2/5">
                <select
                  value={propertyType}
                  onChange={(e) => setPropertyType(e.target.value)}
                  className={`${mono} w-full border border-[#E4DFD3] bg-[#FFFDF9] px-3 py-3 text-xs text-[#14213D] outline-none transition focus:border-[#14213D]`}
                >
                  <option value="">Type: All</option>
                  <option value="APARTMENT">Apartment</option>
                  <option value="VILLA">Villa</option>
                  <option value="HOUSE">House</option>
                  <option value="OFFICE">Office</option>
                </select>

                <select
                  value={listingStatus}
                  onChange={(e) => setListingStatus(e.target.value)}
                  className={`${mono} w-full border border-[#E4DFD3] bg-[#FFFDF9] px-3 py-3 text-xs text-[#14213D] outline-none transition focus:border-[#14213D]`}
                >
                  <option value="">Status: All</option>
                  <option value="SALE">For Sale</option>
                  <option value="RENT">For Rent</option>
                </select>
              </div>

              <button
                type="submit"
                className={`${mono} bg-[#14213D] px-8 py-3 text-xs font-semibold uppercase tracking-wider text-[#F7F5EF] transition-colors duration-150 hover:bg-[#B8863B]`}
              >
                Search
              </button>
            </div>
          </form>

          {/* Quick Agent CTA */}
          {user?.role === "AGENT" && (
            <button
              onClick={() => navigate("/agent/dashboard")}
              className={`${mono} mt-6 inline-flex items-center gap-2 border border-[#B8863B] bg-transparent px-5 py-2.5 text-xs font-semibold uppercase tracking-wider text-[#F7F5EF] transition-colors duration-150 hover:bg-[#B8863B]`}
            >
              Go to Agent Dashboard →
            </button>
          )}
        </div>
      </section>

      {/* ================= STATS SECTION ================= */}
      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 gap-6 border border-[#14213D] bg-[#FFFDF9] p-8 md:grid-cols-4 md:divide-x md:divide-[#E4DFD3] md:gap-0">
          <div className="text-center md:px-4">
            <h2 className={`${serif} text-3xl font-semibold text-[#14213D] sm:text-4xl`}>
              {filteredAvailableProperties.length}+
            </h2>
            <p className={`${mono} mt-1 text-[11px] uppercase tracking-widest text-[#4A5568]`}>
              Active Listings
            </p>
          </div>
          <div className="text-center md:px-4">
            <h2 className={`${serif} text-3xl font-semibold text-[#14213D] sm:text-4xl`}>
              5K+
            </h2>
            <p className={`${mono} mt-1 text-[11px] uppercase tracking-widest text-[#4A5568]`}>
              Happy Clients
            </p>
          </div>
          <div className="text-center md:px-4">
            <h2 className={`${serif} text-3xl font-semibold text-[#14213D] sm:text-4xl`}>
              2K+
            </h2>
            <p className={`${mono} mt-1 text-[11px] uppercase tracking-widest text-[#4A5568]`}>
              Verified Agents
            </p>
          </div>
          <div className="text-center md:px-4">
            <h2 className={`${serif} text-3xl font-semibold text-[#14213D] sm:text-4xl`}>
              20+
            </h2>
            <p className={`${mono} mt-1 text-[11px] uppercase tracking-widest text-[#4A5568]`}>
              Cities Covered
            </p>
          </div>
        </div>
      </section>

      {/* ================= FEATURED / SEARCH RESULTS ================= */}
      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between border-b border-[#14213D] pb-6">
          <div>
            <span className={`${mono} text-xs uppercase tracking-[0.25em] text-[#B8863B]`}>
              {searchQuery || propertyType || listingStatus ? "Search Results" : "Featured Selection"}
            </span>
            <h2 className={`${serif} mt-1 text-3xl font-semibold text-[#14213D] sm:text-4xl`}>
              {searchQuery || propertyType || listingStatus ? "Matching Properties" : "Latest Listings"}
            </h2>
            <p className="mt-2 text-sm text-[#4A5568]">
              Handpicked properties available for sale and rent under management.
            </p>
          </div>

          <Link
            to="/properties"
            className={`${mono} hidden items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#14213D] transition-colors duration-150 hover:text-[#B8863B] sm:flex`}
          >
            View all properties →
          </Link>
        </div>

        {/* States */}
        {isLoading && (
          <div className="mt-12 flex min-h-[250px] flex-col items-center justify-center gap-3">
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-[#E4DFD3] border-t-[#14213D]" />
            <p className={`${mono} text-xs uppercase tracking-widest text-[#4A5568]`}>
              Retrieving listings
            </p>
          </div>
        )}

        {isError && (
          <div className="mt-10 border border-[#B8452E] bg-[#FFFDF9] p-8 text-center">
            <p className={`${mono} text-xs uppercase tracking-widest text-[#B8452E]`}>
              Error 01
            </p>
            <p className={`${serif} mt-2 text-lg font-medium text-[#14213D]`}>
              Unable to fetch properties at this time.
            </p>
          </div>
        )}

        {!isLoading && !isError && displayProperties.length === 0 && (
          <div className="mt-10 flex flex-col items-center border border-dashed border-[#14213D] bg-[#FFFDF9] p-12 text-center">
            <h3 className={`${serif} text-2xl font-medium text-[#14213D]`}>
              No properties available
            </h3>
            <p className="mt-1 text-sm text-[#4A5568]">
              Check back soon for new real estate opportunities.
            </p>
          </div>
        )}

        {/* Grid */}
        {!isLoading && !isError && displayProperties.length > 0 && (
          <div className="mt-10 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {displayProperties.map((property: any) => {
              const isRent = property.listingType === "RENT" || property.type === "RENT";
              const stampColorClass = isRent ? "text-[#5B7B65]" : "text-[#B8863B]";

              return (
                <div
                  key={property.id}
                  className="relative flex flex-col border border-[#14213D] bg-[#FFFDF9]"
                >
                  {/* Corner registration marks */}
                  <span className="pointer-events-none absolute -left-px -top-px h-2.5 w-2.5 border-l-[1.5px] border-t-[1.5px] border-[#14213D]" />
                  <span className="pointer-events-none absolute -right-px -top-px h-2.5 w-2.5 border-r-[1.5px] border-t-[1.5px] border-[#14213D]" />

                  {/* Image Container */}
                  <div className="relative h-56 border-b border-[#14213D] bg-[#EFEAE0] overflow-hidden">
                    <Imgcard propertyId={property.id} />

                    {/* Status Stamp (Sale / Rent) */}
                    <span
                      className={`${mono} absolute right-4 top-4 z-10 -rotate-[7deg] border-[1.5px] border-dashed bg-[#FFFDF9]/90 px-3 py-1 text-[11px] font-medium uppercase tracking-widest ${stampColorClass}`}
                    >
                      {isRent ? "For Rent" : "For Sale"}
                    </span>

                    {/* City Name Badge on Image */}
                    <div className="absolute bottom-3 left-4 z-10 border border-[#14213D]/20 bg-[#14213D]/85 px-2.5 py-1 backdrop-blur-sm">
                      <p className={`${mono} text-[10px] uppercase tracking-[0.2em] text-[#F7F5EF]`}>
                        📍 {property.city || property.location || "Egypt"}
                      </p>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="flex flex-1 flex-col p-8">
                    <h3 className={`${serif} text-xl font-semibold text-[#14213D] line-clamp-1`}>
                      {property.title}
                    </h3>

                    <p className="mt-2 line-clamp-2 text-sm leading-6 text-[#4A5568]">
                      {property.description}
                    </p>

                    {/* Spec sheet */}
                    <div className={`${mono} mt-4 text-xs text-[#4A5568]`}>
                      {property.bedrooms !== undefined && (
                        <div className="flex justify-between border-b border-dotted border-[#E4DFD3] py-1.5">
                          <span>Bedrooms</span>
                          <span className="font-medium text-[#14213D]">{property.bedrooms}</span>
                        </div>
                      )}
                      {property.bathrooms !== undefined && (
                        <div className="flex justify-between border-b border-dotted border-[#E4DFD3] py-1.5">
                          <span>Bathrooms</span>
                          <span className="font-medium text-[#14213D]">{property.bathrooms}</span>
                        </div>
                      )}
                      {property.area !== undefined && (
                        <div className="flex justify-between py-1.5">
                          <span>Area</span>
                          <span className="font-medium text-[#14213D]">{property.area} m²</span>
                        </div>
                      )}
                    </div>

                    {/* Price & Action */}
                    <div className="mt-5 border-t border-[#E4DFD3] pt-5">
                      <p className={`${mono} mb-4 text-2xl font-medium text-[#B8863B]`}>
                        {property.price?.toLocaleString()} EGP
                        {isRent && <span className="text-xs text-[#4A5568]"> /mo</span>}
                      </p>

                      <Link
                        to={`/properties/${property.id}`}
                        className={`${mono} block w-full border border-[#14213D] py-2.5 text-center text-xs font-semibold uppercase tracking-wider text-[#14213D] transition-colors duration-150 hover:bg-[#14213D] hover:text-[#F7F5EF]`}
                      >
                        Details
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        <div className="mt-8 flex justify-center sm:hidden">
          <Link
            to="/properties"
            className={`${mono} w-full bg-[#14213D] py-3 text-center text-xs font-semibold uppercase tracking-wider text-[#F7F5EF]`}
          >
            View All Properties →
          </Link>
        </div>
      </section>

      {/* ================= CTA ================= */}
      <section className="px-4 py-12 sm:px-6 lg:px-8">
        <div className="relative mx-auto max-w-7xl border border-[#14213D] bg-[#14213D] px-6 py-16 text-center text-[#F7F5EF] sm:px-12">
          <div className="relative z-10">
            <h2 className={`${serif} text-3xl font-semibold sm:text-5xl`}>
              Ready to find your next home?
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-sm text-[#EFEAE0] sm:text-base">
              Join thousands of buyers and renters discovering curated properties with Estate every day.
            </p>

            <div className={`${mono} mt-8 flex flex-col justify-center gap-4 sm:flex-row`}>
              {!meData && (
                <Link
                  to="/register"
                  className="bg-[#FFFDF9] px-8 py-3 text-xs font-semibold uppercase tracking-wider text-[#14213D] transition-colors duration-150 hover:bg-[#B8863B] hover:text-[#FFFDF9]"
                >
                  Create Account
                </Link>
              )}
              <Link
                to="/properties"
                className="border border-[#F7F5EF] bg-transparent px-8 py-3 text-xs font-semibold uppercase tracking-wider text-[#F7F5EF] transition-colors duration-150 hover:border-[#B8863B] hover:text-[#B8863B]"
              >
                Browse Properties
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
