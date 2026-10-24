import { Link } from "react-router-dom";
import { useGetAiRecommendations } from "../../hooks/usen8n";
// الهوك اللي عملناه للـ n8n

const serif = "[font-family:'Fraunces',serif]";
const mono = "[font-family:'IBM_Plex_Mono',monospace]";

const AiRecommendations = () => {
  const { data, isLoading, isError } = useGetAiRecommendations();

  if (isLoading) {
    return (
      <div className="border border-[#14213D] bg-[#FFFDF9] p-8 text-center">
        <div className="mx-auto h-6 w-6 animate-spin border-2 border-[#B8863B] border-t-transparent" />
        <p className={`${mono} mt-3 text-xs uppercase tracking-widest text-[#4A5568]`}>
          AI Agent is analyzing your preferences & browsing history...
        </p>
      </div>
    );
  }

  if (isError || !data) {
    return null; // أو إخفاء القسم في حال حدوث خطأ
  }

  // استخراج البيانات من الـ Output القادم من الـ n8n
  const recommendationPayload = Array.isArray(data) ? data[0] : data;
  const profile = recommendationPayload?.userProfile;
  const recommendations = recommendationPayload?.recommendations || [];

  if (recommendations.length === 0) return null;

  return (
    <section className="my-12 space-y-6 border border-[#14213D]/20 bg-[#F7F5EF] p-6 sm:p-8">
      {/* Header & Insight */}
      <div className="border-b border-[#14213D]/10 pb-4">
        <div className="flex items-center gap-2">
          <span className="text-xl">✨</span>
          <span className={`${mono} text-[10px] uppercase tracking-[0.2em] text-[#B8863B]`}>
            Personalized AI Curator
          </span>
        </div>

        <h2 className={`${serif} mt-1 text-2xl font-semibold text-[#14213D]`}>
          Curated Just For You
        </h2>

        {profile?.insight && (
          <p className={`${mono} mt-2 text-xs leading-relaxed text-[#4A5568] bg-[#FFFDF9] border border-[#E4DFD3] p-3`}>
            💡 {profile.insight}
          </p>
        )}
      </div>

      {/* Recommendations Grid */}
      <div className="grid gap-6 md:grid-cols-2">
        {recommendations.map((rec: any) => (
          <div
            key={rec.propertyId}
            className="flex flex-col justify-between border border-[#14213D]/20 bg-[#FFFDF9] p-5 transition hover:border-[#B8863B] hover:shadow-lg"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className={`${mono} text-[9px] uppercase tracking-wider bg-[#14213D] text-[#FFFDF9] px-2 py-0.5`}>
                  Match: {rec.matchScore}%
                </span>
                <span className={`${mono} text-[10px] text-[#B8863B]`}>
                  📍 {rec.address}
                </span>
              </div>

              <h3 className={`${serif} text-lg font-semibold text-[#14213D]`}>
                {rec.title}
              </h3>

              {/* AI Reason for recommendation */}
              <p className={`${mono} text-xs text-[#4A5568] italic border-l-2 border-[#B8863B] pl-3 py-1`}>
                "{rec.reason}"
              </p>

              <div className={`${mono} flex flex-wrap gap-2 text-xs text-[#14213D] pt-2 border-t border-dotted border-[#E4DFD3]`}>
                <span className="bg-[#F7F5EF] px-2 py-1">🛏️ {rec.bedrooms} Beds</span>
                <span className="bg-[#F7F5EF] px-2 py-1">📐 {rec.area} m²</span>
              </div>
            </div>

            <div className="mt-6 flex items-center justify-between border-t border-[#14213D]/10 pt-4">
              <span className={`${serif} text-base font-bold text-[#14213D]`}>
                {Number(rec.price).toLocaleString()} EGP
              </span>

              <Link
                to={`/properties/${rec.propertyId}`}
                className={`${mono} border border-[#14213D] bg-[#14213D] px-4 py-2 text-xs font-semibold uppercase tracking-wider text-[#F7F5EF] transition hover:bg-[#B8863B] hover:border-[#B8863B]`}
              >
                View Dossier →
              </Link>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default AiRecommendations;
