import { Link } from "react-router-dom";
import { usegetme } from "../hooks/useUsers";
import { usegetallprop } from "../hooks/useProp";
import Imgcard from "../pages/properties/Imgcard";

const btnPrimary = "no-underline rounded-xl bg-amber-800 px-7 py-3 text-sm font-medium text-white transition hover:bg-amber-900";
const btnLight = "no-underline rounded-xl border border-white/30 px-7 py-3 text-sm font-medium text-white transition hover:bg-white/10";

export const Home = () => {
  const { data: meData } = usegetme();
  const { data, isLoading, isError } = usegetallprop({ status: "AVAILABLE" });

  const role = meData?.data?.role;
  const dashboard = role === "ADMIN" ? "/admin/dashboard" : role === "AGENT" ? "/agent/dashboard" : null;

  const available: any[] = (Array.isArray(data?.data) ? data.data : []).filter((p: any) => p.status === "AVAILABLE");
  const featured = available.slice(0, 3);

  const stats = [
    [`${available.length}+`, "Active listings"],
    ["5K+", "Happy clients"],
    ["2K+", "Verified agents"],
    ["20+", "Cities covered"],
  ];

  return (
    <div className="min-h-screen bg-stone-50 text-stone-900 antialiased">
      {/* Hero */}
      <section className="relative overflow-hidden bg-stone-900">
        <img
          src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c"
          alt=""
          className="absolute inset-0 h-full w-full object-cover opacity-40"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-stone-900 via-stone-900/50 to-transparent" />

        <div className="relative mx-auto max-w-4xl px-4 py-24 text-center sm:py-32">
          <h1 className="text-4xl font-bold tracking-tight text-white sm:text-6xl">
            Find a place you'll <span className="text-amber-300">love to call home.</span>
          </h1>
          <p className="mx-auto mt-5 max-w-xl text-stone-300">
            Modern apartments, houses and villas across Egypt. Verified listings from trusted agents.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link to="/properties" className={btnPrimary}>Explore properties →</Link>
            {dashboard && (
              <Link to={dashboard} className={btnLight}>
                {role === "ADMIN" ? "Admin dashboard" : "Agent dashboard"}
              </Link>
            )}
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="relative z-10 mx-auto -mt-10 max-w-5xl px-4">
        <div className="grid grid-cols-2 gap-6 rounded-2xl bg-white p-6 shadow-lg ring-1 ring-stone-100 md:grid-cols-4">
          {stats.map(([value, label]) => (
            <div key={label} className="text-center">
              <p className="text-3xl font-bold text-stone-900">{value}</p>
              <p className="mt-1 text-sm text-stone-500">{label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Featured */}
      <section className="mx-auto max-w-7xl px-4 py-16">
        <div className="flex items-end justify-between">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">Latest listings</h2>
            <p className="mt-1 text-stone-500">Handpicked properties for sale and rent.</p>
          </div>
          <Link to="/properties" className="hidden text-sm font-medium text-amber-800 no-underline hover:text-amber-900 sm:block">
            View all →
          </Link>
        </div>

        {isLoading ? (
          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {[...Array(3)].map((_, i) => <div key={i} className="h-80 animate-pulse rounded-2xl bg-stone-100" />)}
          </div>
        ) : isError ? (
          <p className="py-16 text-center text-rose-600">Unable to fetch properties right now.</p>
        ) : featured.length === 0 ? (
          <p className="py-16 text-center text-stone-500">No properties available yet. Check back soon.</p>
        ) : (
          <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {featured.map((p) => {
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
        )}
      </section>

      {/* CTA */}
      <section className="px-4 pb-16">
        <div className="mx-auto max-w-5xl rounded-3xl bg-gradient-to-br from-amber-800 to-stone-900 px-6 py-14 text-center text-white">
          <h2 className="text-3xl font-bold sm:text-4xl">Ready to find your next home?</h2>
          <p className="mx-auto mt-3 max-w-xl text-amber-100">
            Join thousands of buyers and renters discovering curated properties every day.
          </p>
          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            {!meData && (
              <Link to="/register" className="no-underline rounded-xl bg-white px-7 py-3 text-sm font-medium text-amber-900 transition hover:bg-amber-50">
                Create account
              </Link>
            )}
            <Link to="/properties" className={btnLight}>Browse properties</Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
