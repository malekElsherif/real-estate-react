import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { usegetbyid } from "../../hooks/useProp";
import { usegetimgbyid } from "../../hooks/usefiles";
import Addtofav from "./Addtofav";
import RequestCancle from "./Request&Cancle";
import { usegetme } from "../../hooks/useUsers";

const serif = "[font-family:'Fraunces',serif]";
const mono = "[font-family:'IBM_Plex_Mono',monospace]";

const View = () => {
  const { id } = useParams();
  const Id = Number(id);

  const [currentImagePage, setCurrentImagePage] = useState(1);

  const { data, isLoading, isError, error } = usegetbyid(Id);
console.log(data)
  const { data: imagesData, isLoading: imagesLoading } = usegetimgbyid(Id);
  const { data: user } = usegetme();


  if (isLoading || imagesLoading) {
    return (
      <main className="flex min-h-[70vh] items-center justify-center bg-[#FFFDF9] px-4 py-16">
        <div className="w-full max-w-md border border-[#14213D] bg-[#FFFDF9] p-8 text-center">
          <div className="mx-auto h-8 w-8 animate-spin border-2 border-[#E4DFD3] border-t-[#14213D]" />

          <p
            className={`${mono} mt-4 text-xs uppercase tracking-widest text-[#4A5568]`}
          >
            Loading estate details...
          </p>
        </div>
      </main>
    );
  }

  if (isError) {
    return (
      <main className="flex min-h-[70vh] items-center justify-center bg-[#FFFDF9] px-4 py-16">
        <div className="w-full max-w-md border border-[#B8452E] bg-[#FFFDF9] p-8 text-center">
          <span className="text-2xl">⚠️</span>

          <h2
            className={`${serif} mt-2 text-lg font-semibold text-[#B8452E]`}
          >
            Failed to load property
          </h2>

          <p className={`${mono} mt-2 text-xs text-[#4A5568]`}>
            {error?.message ||
              "An unexpected error occurred while fetching the estate."}
          </p>
        </div>
      </main>
    );
  }

  if (!data) {
    return (
      <main className="flex min-h-[70vh] items-center justify-center bg-[#FFFDF9] px-4 py-16">
        <div className="w-full max-w-md border border-[#14213D] bg-[#FFFDF9] p-8 text-center">
          <p className={`${serif} text-lg text-[#14213D]`}>
            Property not found.
          </p>
        </div>
      </main>
    );
  }

  // استخراج الصور بشكل آمن
  const images = Array.isArray(imagesData)
    ? imagesData
    : (imagesData as any)?.data ?? [];

  const formattedPrice = data.price
    ? `${Number(data.price).toLocaleString()} EGP`
    : "Price Upon Request";

  // Pagination الخاصة بالصور
  const totalPages = images.length;
  const currentImage = images[currentImagePage - 1];

  const handleNextPage = () => {
    if (currentImagePage < totalPages) {
      setCurrentImagePage((prev) => prev + 1);
    }
  };

  const handlePrevPage = () => {
    if (currentImagePage > 1) {
      setCurrentImagePage((prev) => prev - 1);
    }
  };

  // ================================
  // Agent ID
  // ================================
  const agentId = data.owner?.id;

  return (
    <main className="min-h-screen bg-[#FFFDF9] px-4 py-8 sm:px-6 lg:px-8 lg:py-12">
      <div className="mx-auto max-w-7xl space-y-8">

        {/* =========================
            Header Section
        ========================= */}
        <div className="flex flex-col gap-4 border-b border-[#14213D] pb-6 sm:flex-row sm:items-end sm:justify-between">
          <div className="space-y-1">
            <span
              className={`${mono} text-[10px] uppercase tracking-[0.2em] text-[#B8863B]`}
            >
              Estate Dossier #{Id}
            </span>

            <h1
              className={`${serif} text-3xl font-semibold text-[#14213D] md:text-4xl`}
            >
              {data.title}
            </h1>

            <p className={`${mono} text-xs text-[#4A5568]`}>
              📍 {data.address ? `${data.address}, ` : ""}
              {data.city || data.location || "Egypt"}
            </p>
          </div>

          <div className="border border-[#14213D] bg-[#F7F5EF] px-5 py-3 text-left sm:text-right">
            <span
              className={`${mono} text-[10px] uppercase tracking-widest text-[#4A5568]`}
            >
              Valuation
            </span>

            <p
              className={`${serif} text-2xl font-bold text-[#14213D]`}
            >
              {formattedPrice}
            </p>
          </div>
        </div>

        {/* =========================
            Gallery Section
        ========================= */}
        <div className="space-y-4 border border-[#14213D] bg-[#FFFDF9] p-3">
          {images.length === 0 ? (
            <div className="flex h-80 items-center justify-center border border-dashed border-[#14213D] bg-[#F7F5EF]">
              <div className="text-center">
                <span className="text-4xl">🏛️</span>

                <p
                  className={`${mono} mt-2 text-xs uppercase tracking-wider text-[#4A5568]`}
                >
                  No Archival Images Available
                </p>
              </div>
            </div>
          ) : (
            <>
              {/* Single Image */}
              <div className="group relative overflow-hidden border border-[#14213D] bg-[#14213D]">
                <img
                  src={`https://real-estate-nest-production.up.railway.app${currentImage?.url}`}
                  alt={data.title}
                  className="h-[450px] w-full object-cover transition duration-500 group-hover:scale-102"
                />
              </div>

              {/* Image Pagination */}
              {totalPages > 1 && (
                <div className="flex items-center justify-between border-t border-[#E4DFD3] px-2 pt-4">
                  <button
                    type="button"
                    onClick={handlePrevPage}
                    disabled={currentImagePage === 1}
                    className={`${mono} border border-[#14213D] px-4 py-2 text-xs font-semibold uppercase tracking-wider text-[#14213D] transition-colors hover:bg-[#14213D] hover:text-[#F7F5EF] disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-transparent disabled:hover:text-[#14213D]`}
                  >
                    ← Previous
                  </button>

                  <span
                    className={`${mono} text-xs uppercase tracking-widest text-[#4A5568]`}
                  >
                    Photo{" "}
                    <strong className="text-[#14213D]">
                      {currentImagePage}
                    </strong>{" "}
                    of {totalPages}
                  </span>

                  <button
                    type="button"
                    onClick={handleNextPage}
                    disabled={currentImagePage === totalPages}
                    className={`${mono} border border-[#14213D] px-4 py-2 text-xs font-semibold uppercase tracking-wider text-[#14213D] transition-colors hover:bg-[#14213D] hover:text-[#F7F5EF] disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-transparent disabled:hover:text-[#14213D]`}
                  >
                    Next →
                  </button>
                </div>
              )}
            </>
          )}
        </div>

        {/* =========================
            Main Content Grid
        ========================= */}
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">

          {/* =========================
              Left Column
          ========================= */}
          <div className="space-y-6 lg:col-span-2">

            {/* Description */}
            <div className="space-y-3 border border-[#14213D] bg-[#FFFDF9] p-6">
              <span
                className={`${mono} text-[10px] uppercase tracking-widest text-[#B8863B]`}
              >
                Overview
              </span>

              <h2
                className={`${serif} text-xl font-semibold text-[#14213D]`}
              >
                Property Description
              </h2>

              <div className="h-px w-12 bg-[#14213D]" />

              <p
                className={`${mono} text-xs leading-relaxed text-[#4A5568]`}
              >
                {data.description ||
                  "No description provided for this listing."}
              </p>
            </div>

            {/* Specifications */}
            <div className="space-y-4 border border-[#14213D] bg-[#FFFDF9] p-6">
              <span
                className={`${mono} text-[10px] uppercase tracking-widest text-[#B8863B]`}
              >
                Specifications
              </span>

              <h2
                className={`${serif} text-xl font-semibold text-[#14213D]`}
              >
                Key Characteristics
              </h2>

              <div className="h-px w-12 bg-[#14213D]" />

              <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">

                {/* Type */}
                <div className="border border-[#E4DFD3] bg-[#F7F5EF] p-3 text-center">
                  <p
                    className={`${mono} text-[9px] uppercase tracking-wider text-[#4A5568]`}
                  >
                    Type
                  </p>

                  <p
                    className={`${serif} mt-1 text-sm font-semibold text-[#14213D]`}
                  >
                    {data.type || "N/A"}
                  </p>
                </div>

                {/* Bedrooms */}
                <div className="border border-[#E4DFD3] bg-[#F7F5EF] p-3 text-center">
                  <p
                    className={`${mono} text-[9px] uppercase tracking-wider text-[#4A5568]`}
                  >
                    Bedrooms
                  </p>

                  <p
                    className={`${serif} mt-1 text-sm font-semibold text-[#14213D]`}
                  >
                    {data.bedrooms ?? "N/A"}
                  </p>
                </div>

                {/* Bathrooms */}
                <div className="border border-[#E4DFD3] bg-[#F7F5EF] p-3 text-center">
                  <p
                    className={`${mono} text-[9px] uppercase tracking-wider text-[#4A5568]`}
                  >
                    Bathrooms
                  </p>

                  <p
                    className={`${serif} mt-1 text-sm font-semibold text-[#14213D]`}
                  >
                    {data.bathrooms ?? "N/A"}
                  </p>
                </div>

                {/* Area */}
                <div className="border border-[#E4DFD3] bg-[#F7F5EF] p-3 text-center">
                  <p
                    className={`${mono} text-[9px] uppercase tracking-wider text-[#4A5568]`}
                  >
                    Total Area
                  </p>

                  <p
                    className={`${serif} mt-1 text-sm font-semibold text-[#14213D]`}
                  >
                    {data.area ? `${data.area} m²` : "N/A"}
                  </p>
                </div>

              </div>
            </div>

            {/* Location */}
            <div className="space-y-3 border border-[#14213D] bg-[#FFFDF9] p-6">
              <span
                className={`${mono} text-[10px] uppercase tracking-widest text-[#B8863B]`}
              >
                Location
              </span>

              <h2
                className={`${serif} text-xl font-semibold text-[#14213D]`}
              >
                Address & Geography
              </h2>

              <div className="h-px w-12 bg-[#14213D]" />

              <div
                className={`${mono} space-y-1 text-xs text-[#4A5568]`}
              >
                <p>
                  📍{" "}
                  <span className="font-semibold text-[#14213D]">
                    Address:
                  </span>{" "}
                  {data.address || "Address not disclosed"}
                </p>

                <p>
                  🏙️{" "}
                  <span className="font-semibold text-[#14213D]">
                    City:
                  </span>{" "}
                  {data.city || "City not specified"}
                </p>
              </div>
            </div>
          </div>

          {/* =========================
              Right Column
          ========================= */}
          <div className="space-y-6">

            <div className="sticky top-24 space-y-6 border border-[#14213D] bg-[#FFFDF9] p-6">

              {/* Agent Header */}
              <div className="border-b border-[#14213D] pb-4">
                <span
                  className={`${mono} text-[10px] uppercase tracking-widest text-[#B8863B]`}
                >
                  Representation
                </span>

                <h2
                  className={`${serif} text-xl font-semibold text-[#14213D]`}
                >
                  Property Agent
                </h2>
              </div>

              {/* Agent Info */}
              <div className="flex items-center gap-4">
                <div
                  className={`${serif} flex h-12 w-12 items-center justify-center border border-[#14213D] bg-[#14213D] text-lg font-bold text-[#F7F5EF]`}
                >
                  {data.agent?.name?.charAt(0).toUpperCase() || "A"}
                </div>

                <div>
                  <p
                    className={`${serif} font-semibold text-[#14213D]`}
                  >
                    {data.agent?.name || "Agent"}
                  </p>

                  <p
                    className={`${mono} text-[10px] uppercase tracking-wider text-[#4A5568]`}
                  >
                    Property Agent
                  </p>
                </div>
              </div>

              {/* Actions */}
              <div className="space-y-3 pt-2">

                {/* =========================
                    Chat With Agent
                ========================= */}
                {agentId ? (
                  <Link
                    to={`/chat/${agentId}`}
                    className={`${mono} flex w-full items-center justify-center gap-2 border border-[#14213D] bg-[#14213D] py-3 text-xs font-semibold uppercase tracking-wider text-[#F7F5EF] transition hover:border-[#B8863B] hover:bg-[#B8863B]`}
                  >
                    <span>💬</span>
                    Chat with Agent
                  </Link>
                ) : (
                  <button
                    type="button"
                    disabled
                    className={`${mono} w-full cursor-not-allowed border border-[#14213D] bg-[#14213D] py-3 text-xs font-semibold uppercase tracking-wider text-[#F7F5EF] opacity-50`}
                  >
                    Agent Unavailable
                  </button>
                )}

                {/* Purchase / Rental Request */}
                <RequestCancle
                  id={Id}
                  type={data.type}
                  isAvailable={
                    data.status === "AVAILABLE" &&
                    user?.data.role === "USER"
                  }
                />

                {/* Favorite */}
                <div className="flex justify-center border-t border-dotted border-[#E4DFD3] pt-4">
                  <Addtofav id={Id} />
                </div>

              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default View;
