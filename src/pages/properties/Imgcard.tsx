import { usegetimgbyid } from "../../hooks/usefiles";

const BASE = "https://real-estate-nest-production.up.railway.app";

const Imgcard = ({ propertyId, className = "h-56" }: { propertyId: number; className?: string }) => {
  const { data, isLoading, isError } = usegetimgbyid(propertyId);
  const list = Array.isArray(data) ? data : (data as any)?.data;
  const url = Array.isArray(list) ? list[0]?.url : undefined;

  return (
    <div className={`w-full overflow-hidden bg-stone-100 ${className}`}>
      {url ? (
        <img src={BASE + url} alt="Property" loading="lazy" className="h-full w-full object-cover transition duration-500 group-hover:scale-105" />
      ) : (
        <div className="grid h-full place-items-center text-sm text-stone-400">
          {isLoading ? "Loading…" : isError ? "Failed to load image" : <span className="text-4xl">🏠</span>}
        </div>
      )}
    </div>
  );
};

export default Imgcard;
