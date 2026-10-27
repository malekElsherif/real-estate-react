import { useState, useEffect, type ReactNode } from "react";
import { useParams, Link } from "react-router-dom";
import { usegetbyid } from "../../hooks/useProp";
import { usegetimgbyid } from "../../hooks/usefiles";
import { useLogViewedProperty } from "../../hooks/useviewProp";
import { usegetme } from "../../hooks/useUsers";
import Addtofav from "./Addtofav";
import RequestCancle from "./Request&Cancle";
import { primary } from "../ui";

const BASE = "https://real-estate-nest-production.up.railway.app";

const getImageUrl = (url?: string) => {
  if (!url) return undefined;

  // روابط Cloudinary الكاملة لا تحتاج إلى إضافة BASE.
  if (/^https?:\/\//i.test(url)) return url;

  // المسارات المحلية القديمة.
  return `${BASE.replace(/\/$/, "")}/${url.replace(/^\//, "")}`;
};

const Msg = ({
  children,
  error,
}: {
  children: ReactNode;
  error?: boolean;
}) => (
  <main
    className={`grid min-h-[60vh] place-items-center px-4 ${
      error ? "text-rose-600" : "text-stone-500"
    }`}
  >
    {children}
  </main>
);

const View = () => {
  const Id = Number(useParams().id);
  const [photo, setPhoto] = useState(0);

  const { data, isLoading, isError, error } = usegetbyid(Id);
  const {
    data: imagesData,
    isLoading: imagesLoading,
  } = usegetimgbyid(Id);

  const { data: user } = usegetme();
  const { mutate: logView } = useLogViewedProperty();

  useEffect(() => {
    if (Id && !isNaN(Id)) {
      logView(Id, { onError: () => {} });
    }
  }, [Id, logView]);

  if (isLoading || imagesLoading) return <Msg>Loading…</Msg>;
  if (isError) {
    return <Msg error>{error?.message || "Failed to load property."}</Msg>;
  }
  if (!data) return <Msg>Property not found.</Msg>;

  const images: any[] = Array.isArray(imagesData)
    ? imagesData
    : (imagesData as any)?.data ?? [];

  const agentId = data.owner?.id;

  const specs = [
    ["Type", data.type],
    ["Bedrooms", data.bedrooms],
    ["Bathrooms", data.bathrooms],
    ["Area", data.area ? `${data.area} m²` : null],
  ];

  const card =
    "rounded-2xl border border-stone-100 bg-white p-6 shadow-sm";

  const arrow =
    "absolute top-1/2 grid h-10 w-10 -translate-y-1/2 place-items-center rounded-full bg-white/90 shadow transition hover:bg-white disabled:opacity-30";

  return (
    <main className="mx-auto max-w-6xl space-y-8 px-4 py-10">
      {/* Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-stone-900">
            {data.title}
          </h1>
          <p className="mt-1 text-stone-500">
            📍{" "}
            {[data.address, data.city || data.location || "Egypt"]
              .filter(Boolean)
              .join(", ")}
          </p>
        </div>

        <p className="text-3xl font-bold text-amber-800">
          {data.price
            ? `${Number(data.price).toLocaleString()} EGP`
            : "Price on request"}
        </p>
      </div>

      {/* Gallery */}
      <div className="relative overflow-hidden rounded-3xl bg-stone-100">
        {images.length === 0 ? (
          <div className="grid h-96 place-items-center text-stone-400">
            <span className="text-5xl">🏠</span>
          </div>
        ) : (
          <>
            <img
              src={getImageUrl(images[photo]?.url)}
              alt={data.title}
              className="h-[420px] w-full object-cover"
            />

            {images.length > 1 && (
              <>
                <button
                  className={`${arrow} left-4`}
                  disabled={photo === 0}
                  onClick={() => setPhoto(photo - 1)}
                  aria-label="Previous image"
                >
                  ←
                </button>

                <button
                  className={`${arrow} right-4`}
                  disabled={photo === images.length - 1}
                  onClick={() => setPhoto(photo + 1)}
                  aria-label="Next image"
                >
                  →
                </button>

                <span className="absolute bottom-4 right-4 rounded-full bg-stone-900/60 px-3 py-1 text-xs text-white">
                  {photo + 1} / {images.length}
                </span>
              </>
            )}
          </>
        )}
      </div>

      <div className="grid gap-8 lg:grid-cols-3">
        {/* Details */}
        <div className="space-y-6 lg:col-span-2">
          <section className={card}>
            <h2 className="mb-2 text-lg font-semibold text-stone-900">
              About this property
            </h2>
            <p className="leading-relaxed text-stone-600">
              {data.description || "No description provided."}
            </p>
          </section>

          <section className={card}>
            <h2 className="mb-4 text-lg font-semibold text-stone-900">
              Details
            </h2>

            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              {specs.map(([label, value]) => (
                <div
                  key={label as string}
                  className="rounded-xl bg-stone-50 p-4 text-center"
                >
                  <p className="text-xs text-stone-500">{label}</p>
                  <p className="mt-1 font-semibold text-stone-900">
                    {value ?? "N/A"}
                  </p>
                </div>
              ))}
            </div>
          </section>
        </div>

        {/* Agent */}
        <aside className={`${card} sticky top-24 h-fit space-y-5`}>
          <div className="flex items-center gap-3">
            <div className="grid h-12 w-12 place-items-center rounded-full bg-amber-100 text-lg font-semibold text-amber-900">
              {data.agent?.name?.[0]?.toUpperCase() || "A"}
            </div>

            <div>
              <p className="font-medium text-stone-900">
                {data.agent?.name || "Agent"}
              </p>
              <p className="text-xs text-stone-500">Property agent</p>
            </div>
          </div>

          {agentId ? (
            <Link
              to={`/chat/${agentId}`}
              className={`${primary} block w-full text-center`}
            >
              💬 Chat with agent
            </Link>
          ) : (
            <button disabled className={`${primary} w-full`}>
              Agent unavailable
            </button>
          )}

          <RequestCancle
            id={Id}
            type={data.type}
            isAvailable={
              data.status === "AVAILABLE" && user?.data.role === "USER"
            }
          />

          <div className="flex justify-center border-t border-stone-100 pt-4">
            <Addtofav id={Id} />
          </div>
        </aside>
      </div>
    </main>
  );
};

export default View;
