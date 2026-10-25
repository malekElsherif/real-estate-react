import { Link } from "react-router-dom";
import { useGetAiRecommendations } from "../../hooks/usen8n";

const AiRecommendations = () => {
  const { data, isLoading, isError } = useGetAiRecommendations();

  if (isLoading) {
    return <p className="my-12 animate-pulse text-center text-sm text-stone-500">✨ Finding properties you'll love…</p>;
  }

  const payload = Array.isArray(data) ? data[0] : data;
  const recs: any[] = payload?.recommendations ?? [];
  if (isError || recs.length === 0) return null;

  return (
    <section className="my-12 space-y-6 rounded-3xl bg-gradient-to-br from-amber-50 to-white p-6 sm:p-8">
      <div>
        <p className="text-sm font-medium text-amber-800">✨ Picked for you</p>
        <h2 className="text-2xl font-semibold text-stone-900">Recommended properties</h2>
        {payload?.userProfile?.insight && (
          <p className="mt-2 rounded-xl bg-white/70 p-3 text-sm text-stone-600">💡 {payload.userProfile.insight}</p>
        )}
      </div>

      <div className="grid gap-5 md:grid-cols-2">
        {recs.map((r) => (
          <Link
            key={r.propertyId}
            to={`/properties/${r.propertyId}`}
            className="space-y-3 rounded-2xl border border-stone-100 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
          >
            <div className="flex items-center justify-between text-xs">
              <span className="rounded-full bg-amber-800 px-2.5 py-1 font-medium text-white">{r.matchScore}% match</span>
              <span className="text-stone-500">📍 {r.address}</span>
            </div>
            <h3 className="text-lg font-semibold text-stone-900">{r.title}</h3>
            <p className="border-l-2 border-amber-200 pl-3 text-sm italic text-stone-500">"{r.reason}"</p>
            <div className="flex items-center justify-between pt-2">
              <span className="font-semibold text-amber-800">{Number(r.price).toLocaleString()} EGP</span>
              <span className="text-xs text-stone-500">🛏 {r.bedrooms} · 📐 {r.area} m²</span>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
};

export default AiRecommendations;
