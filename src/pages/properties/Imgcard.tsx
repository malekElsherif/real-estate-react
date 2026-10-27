import { usegetimgbyid } from "../../hooks/usefiles";

const BASE = "https://real-estate-nest-production.up.railway.app";

const getImageUrl = (url?: string) => {
  if (!url) return undefined;

  // روابط Cloudinary أو أي رابط كامل تفضل كما هي.
  if (/^https?:\/\//i.test(url)) return url;

  // المسارات المحلية القديمة تُربط بعنوان الـ Backend.
  return `${BASE.replace(/\/$/, "")}/${url.replace(/^\//, "")}`;
};

const Imgcard = ({
  propertyId,
  className = "h-56",
}: {
  propertyId: number;
  className?: string;
}) => {
  const { data, isLoading, isError } = usegetimgbyid(propertyId);
  const list = Array.isArray(data) ? data : (data as any)?.data;
  const url = Array.isArray(list) ? list[0]?.url : undefined;
  const imageUrl = getImageUrl(url);

  return (
    <div className={`w-full overflow-hidden bg-stone-100 ${className}`}>
      {imageUrl ? (
        <img
          src={imageUrl}
          alt="Property"
          loading="lazy"
          className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
        />
      ) : (
        <div className="grid h-full place-items-center text-sm text-stone-400">
          {isLoading
            ? "Loading…"
            : isError
              ? "Failed to load image"
              : <span className="text-4xl">🏠</span>}
        </div>
      )}
    </div>
  );
};

export default Imgcard;
