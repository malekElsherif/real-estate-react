import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { usegetallprop } from "../../hooks/useProp";
import { usegetme } from "../../hooks/useUsers";
import Imgcard from "./Imgcard";

export const Properties = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedType, setSelectedType] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("AVAILABLE");
  const [selectedCity, setSelectedCity] = useState("");
  const [page, setPage] = useState(1);
  const limit = 9;

  const { data: userData } = usegetme();
  const userRole = userData?.data?.role;
  const isAdminOrAgent = userRole === "ADMIN" || userRole === "AGENT";

  // جلب العقارات بحد كبير (100) لجلب كافة العناصر وتطبيق البحث والفلترة محلياً بدقة
  const { data, isLoading, isError } = usegetallprop({
    limit: 100,
  });

  const rawProperties: any[] = Array.isArray(data?.data)
    ? data.data
    : data?.data?.properties || [];

  // استخراج قائمة المدن الفريدة للقائمة المنسدلة من جميع العقارات
  const availableCities = useMemo(() => {
    const cities = rawProperties
      .map((p) => p.city || p.location)
      .filter((city): city is string => Boolean(city) && city.trim() !== "");
    return Array.from(new Set(cities));
  }, [rawProperties]);

  // تطبيق الفلترة والبحث محلياً لضمان استجابة البحث الفوري بدقة
  const filteredProperties = useMemo(() => {
    return rawProperties.filter((p) => {
      // فلتر الحالة
      if (selectedStatus && p.status !== selectedStatus) {
        return false;
      }

      // فلتر نوع العقار (SALE / RENT)
      if (selectedType) {
        const pType = p.listingType || p.type;
        if (pType !== selectedType) return false;
      }

      // فلتر المدينة
      if (selectedCity) {
        const pCity = p.city || p.location || "";
        if (pCity !== selectedCity) return false;
      }

      // فلتر البحث النصي في العنوان، الوصف، أو المدينة
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase().trim();
        const title = (p.title || "").toLowerCase();
        const desc = (p.description || "").toLowerCase();
        const city = (p.city || p.location || "").toLowerCase();
        if (!title.includes(query) && !desc.includes(query) && !city.includes(query)) {
          return false;
        }
      }

      return true;
    });
  }, [rawProperties, selectedStatus, selectedType, selectedCity, searchQuery]);

  // تطبيق الـ Pagination محلياً على النتائج المصفاة
  const totalPages = Math.ceil(filteredProperties.length / limit) || 1;
  const properties = useMemo(() => {
    const start = (page - 1) * limit;
    return filteredProperties.slice(start, start + limit);
  }, [filteredProperties, page, limit]);

  const handleResetFilters = () => {
    setSearchQuery("");
    setSelectedType("");
    setSelectedStatus("AVAILABLE");
    setSelectedCity("");
    setPage(1);
  };

  return (
    <div className="min-h-screen bg-stone-50 text-stone-900 antialiased">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-stone-900">
        <img
          src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c"
          alt=""
          className="absolute inset-0 h-full w-full object-cover opacity-40"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-stone-900 via-stone-900/50 to-transparent" />

        <div className="relative mx-auto max-w-4xl px-4 py-20 text-center sm:py-28">
          <span className="inline-block rounded-full bg-amber-800/80 px-4 py-1 text-xs font-medium uppercase tracking-wider text-amber-100 backdrop-blur">
            Explore Catalog
          </span>
          <h1 className="mt-4 text-4xl font-bold tracking-tight text-white sm:text-6xl">
            Find Your <span className="text-amber-300">Perfect Property</span>
          </h1>
          <p className="mx-auto mt-5 max-w-xl text-stone-300">
            Browse through our verified listings of modern apartments, houses, and villas across Egypt.
          </p>
        </div>
      </section>

      {/* Filter & Search Bar Section */}
      <section className="mx-auto max-w-7xl px-4 py-8">
        <div className="rounded-3xl border border-stone-100 bg-white p-6 shadow-sm space-y-4">
          <div className="grid gap-4 md:grid-cols-4">
            {/* Search Input */}
            <div>
              <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-stone-700">
                Search
              </label>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => { setSearchQuery(e.target.value); setPage(1); }}
                placeholder="Title, address..."
                className="w-full rounded-xl border border-stone-200 bg-stone-50 px-4 py-3 text-sm outline-none transition focus:border-amber-800 focus:bg-white focus:ring-1 focus:ring-amber-800"
              />
            </div>

            {/* City Dropdown Filter */}
            <div>
              <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-stone-700">
                City / Location
              </label>
              <select
                value={selectedCity}
                onChange={(e) => { setSelectedCity(e.target.value); setPage(1); }}
                className="w-full rounded-xl border border-stone-200 bg-stone-50 px-4 py-3 text-sm outline-none transition focus:border-amber-800 focus:bg-white focus:ring-1 focus:ring-amber-800"
              >
                <option value="">All Cities</option>
                {availableCities.map((city) => (
                  <option key={city} value={city}>
                    {city}
                  </option>
                ))}
              </select>
            </div>

            {/* Type Filter */}
            <div>
              <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-stone-700">
                Listing Type
              </label>
              <select
                value={selectedType}
                onChange={(e) => { setSelectedType(e.target.value); setPage(1); }}
                className="w-full rounded-xl border border-stone-200 bg-stone-50 px-4 py-3 text-sm outline-none transition focus:border-amber-800 focus:bg-white focus:ring-1 focus:ring-amber-800"
              >
                <option value="">All Types</option>
                <option value="SALE">For Sale</option>
                <option value="RENT">For Rent</option>
              </select>
            </div>

            {/* Status Filter */}
            <div>
              <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-stone-700">
                Status
              </label>
              <select
                value={selectedStatus}
                onChange={(e) => { setSelectedStatus(e.target.value); setPage(1); }}
                className="w-full rounded-xl border border-stone-200 bg-stone-50 px-4 py-3 text-sm outline-none transition focus:border-amber-800 focus:bg-white focus:ring-1 focus:ring-amber-800"
              >
                <option value="">All Statuses</option>
                <option value="AVAILABLE">Available</option>
                <option value="SOLD">Sold</option>
                {isAdminOrAgent && <option value="PENDING">Pending</option>}
              </select>
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <button
              onClick={handleResetFilters}
              className="cursor-pointer text-xs font-medium text-stone-500 hover:text-amber-800 transition"
            >
              Reset Filters ↺
            </button>
          </div>
        </div>
      </section>

      {/* Properties Grid */}
      <section className="mx-auto max-w-7xl px-4 pb-20">
        {isLoading ? (
          <div className="grid gap-6 md:grid-cols-3">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-80 animate-pulse rounded-2xl bg-stone-100" />
            ))}
          </div>
        ) : isError ? (
          <p className="py-16 text-center text-rose-600">Unable to fetch properties right now.</p>
        ) : properties.length === 0 ? (
          <div className="rounded-3xl border border-dashed border-stone-200 bg-white p-12 text-center shadow-sm">
            <span className="text-4xl">🏠</span>
            <h3 className="mt-3 text-lg font-semibold text-stone-900">No properties found</h3>
            <p className="mt-1 text-sm text-stone-500">Try adjusting your search or filter parameters.</p>
          </div>
        ) : (
          <>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {properties.map((p) => {
                const isRent = p.listingType === "RENT" || p.type === "RENT";
                const specs = [
                  p.bedrooms !== undefined && `🛏 ${p.bedrooms}`,
                  p.bathrooms !== undefined && `🛁 ${p.bathrooms}`,
                  p.area !== undefined && `📐 ${p.area} m²`,
                ].filter(Boolean).join("  ·  ");

                return (
                  <Link
                    key={p.id}
                    to={`/properties/${p.id}`}
                    className="group block text-stone-900 overflow-hidden rounded-2xl border no-underline border-stone-100 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
                  >
                    <div className="relative">
                      <Imgcard propertyId={p.id} />
                      <span className="absolute left-3 top-3 rounded-full bg-white/90 px-3 py-1 text-xs font-medium text-stone-700 backdrop-blur">
                        {isRent ? "For rent" : "For sale"}
                      </span>
                    </div>

                    <div className="space-y-2 p-5">
                      <p className="text-xs text-stone-500">📍 {p.city || p.location || "Egypt"}</p>
                      <h3 className="truncate text-lg font-semibold">{p.title}</h3>
                      <p className="line-clamp-2 text-sm text-stone-500">{p.description}</p>
                      <div className="flex items-center justify-between pt-2">
                        <span className="font-semibold text-amber-800">
                          {p.price?.toLocaleString()} EGP
                          {isRent && <span className="text-xs font-normal text-stone-400"> /mo</span>}
                        </span>
                        <span className="text-xs text-stone-500">{specs}</span>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>

            {/* Pagination Controls */}
            <div className="mt-12 flex items-center justify-center gap-4">
              <button
                onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
                disabled={page === 1}
                className="rounded-xl border border-stone-200 bg-white px-5 py-2.5 text-xs font-medium text-stone-700 transition hover:bg-stone-50 disabled:opacity-40 cursor-pointer"
              >
                ← Previous
              </button>

              <span className="text-xs font-medium text-stone-600">
                Page {page} of {totalPages || 1}
              </span>

              <button
                onClick={() => setPage((prev) => prev + 1)}
                disabled={page >= totalPages}
                className="rounded-xl border border-stone-200 bg-white px-5 py-2.5 text-xs font-medium text-stone-700 transition hover:bg-stone-50 disabled:opacity-40 cursor-pointer"
              >
                Next →
              </button>
            </div>
          </>
        )}
      </section>
    </div>
  );
};

export default Properties;
