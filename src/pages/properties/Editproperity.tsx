import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useQueryClient } from "@tanstack/react-query";
import { usegetbyid, useeditprop } from "../../hooks/useProp";

type PropertyForm = {
  title: string;
  description: string;
  price: number;
  city: string;
  location: string;
  type: "SALE" | "RENT";
  bedrooms: number;
  bathrooms: number;
  area: number;
};

type EditproperityProps = {
  propertyId: number;
  open: boolean;
  onClose: () => void;
};

const FontImports = () => (
  <style>{`@import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,400;9..144,500;9..144,600;9..144,700&family=Inter:wght@400;500;600&family=IBM+Plex+Mono:wght@400;500&display=swap');`}</style>
);

const serif = "[font-family:'Fraunces',serif]";
const mono = "[font-family:'IBM_Plex_Mono',monospace]";

const Editproperity = ({ propertyId, open, onClose }: EditproperityProps) => {
  const queryClient = useQueryClient();

  const {
    data: propertyData,
    isLoading,
    isError: getError,
  } = usegetbyid(propertyId);

  const {
    register,
    handleSubmit,
    reset,
    formState: { dirtyFields },
  } = useForm<PropertyForm>();

  const { mutate, isPending, isError, error } = useeditprop(propertyId);

  // تحميل بيانات العقار داخل الفورم
  useEffect(() => {
    if (!open) return;

    const property = propertyData?.data;

    if (!property) return;

    reset({
      title: property.title ?? "",
      description: property.description ?? "",
      price: property.price ?? 0,
      city: property.city ?? "",
      location: property.location ?? "",
      type: property.type ?? "SALE",
      bedrooms: property.bedrooms ?? 0,
      bathrooms: property.bathrooms ?? 0,
      area: property.area ?? 0,
    });
  }, [propertyData, reset, open]);

  if (!open) {
    return null;
  }

  const onSubmit = (data: PropertyForm) => {
    const patchData: Partial<PropertyForm> = {};

    Object.keys(dirtyFields).forEach((key) => {
      const field = key as keyof PropertyForm;
      patchData[field] = data[field] as never;
    });

    // إذا لم تتغير أي بيانات
    if (Object.keys(patchData).length === 0) {
      onClose();
      return;
    }

    mutate(patchData, {
      onSuccess: async () => {
        await queryClient.invalidateQueries({
          queryKey: ["property", propertyId],
        });
        await queryClient.invalidateQueries({
          queryKey: ["properties"],
        });
        await queryClient.invalidateQueries({
          queryKey: ["getbyuser"],
        });

        onClose();
      },
    });
  };

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-[#14213D]/70 p-4 backdrop-blur-xs"
      onClick={onClose}
    >
      <FontImports />

      <div
        className="relative max-h-[90vh] w-full max-w-2xl overflow-y-auto border border-[#14213D] bg-[#FFFDF9] p-6 md:p-8 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Corner registration marks */}
        <span className="pointer-events-none absolute -left-px -top-px h-3 w-3 border-l-2 border-t-2 border-[#14213D]" />
        <span className="pointer-events-none absolute -right-px -top-px h-3 w-3 border-r-2 border-t-2 border-[#14213D]" />
        <span className="pointer-events-none absolute -bottom-px -left-px h-3 w-3 border-b-2 border-l-2 border-[#14213D]" />
        <span className="pointer-events-none absolute -bottom-px -right-px h-3 w-3 border-b-2 border-r-2 border-[#14213D]" />

        {/* Header */}
        <div className="flex items-start justify-between border-b border-[#14213D] pb-5">
          <div>
            <p className={`${mono} text-xs uppercase tracking-[0.25em] text-[#B8863B]`}>
              Dashboard / Portfolio
            </p>
            <h2 className={`${serif} mt-1 text-2xl font-semibold text-[#14213D] md:text-3xl`}>
              Edit Property #{propertyId}
            </h2>
          </div>

          <button
            type="button"
            onClick={onClose}
            className={`${mono} flex h-9 w-9 items-center justify-center border border-[#14213D] text-lg font-medium text-[#14213D] transition-colors hover:bg-[#14213D] hover:text-[#F7F5EF]`}
          >
            ✕
          </button>
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="flex h-64 flex-col items-center justify-center gap-3">
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-[#E4DFD3] border-t-[#14213D]" />
            <p className={`${mono} text-xs uppercase tracking-widest text-[#4A5568]`}>
              Fetching details
            </p>
          </div>
        )}

        {/* Error State */}
        {getError && (
          <div className="my-8 border border-[#B8452E] bg-[#FFFDF9] p-6 text-center">
            <p className={`${mono} text-xs uppercase tracking-widest text-[#B8452E]`}>
              Error
            </p>
            <p className={`${serif} mt-2 text-lg font-medium text-[#14213D]`}>
              Failed to load property data
            </p>
          </div>
        )}

        {!isLoading && !getError && (
          <form onSubmit={handleSubmit(onSubmit)} className="mt-6 space-y-6">
            {/* Title */}
            <div>
              <label className={`${mono} mb-2 block text-xs uppercase tracking-wider text-[#14213D]`}>
                Property Title
              </label>
              <input
                {...register("title")}
                className="w-full border border-[#14213D] bg-[#FFFDF9] px-4 py-2.5 text-sm font-medium text-[#14213D] outline-none transition-colors focus:border-[#B8863B]"
              />
            </div>

            {/* Description */}
            <div>
              <label className={`${mono} mb-2 block text-xs uppercase tracking-wider text-[#14213D]`}>
                Description
              </label>
              <textarea
                {...register("description")}
                rows={4}
                className="w-full resize-none border border-[#14213D] bg-[#FFFDF9] px-4 py-2.5 text-sm text-[#14213D] outline-none transition-colors focus:border-[#B8863B]"
              />
            </div>

            {/* Price + Type */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className={`${mono} mb-2 block text-xs uppercase tracking-wider text-[#14213D]`}>
                  Price ($)
                </label>
                <input
                  type="number"
                  {...register("price", { valueAsNumber: true })}
                  className={`${mono} w-full border border-[#14213D] bg-[#FFFDF9] px-4 py-2.5 text-sm text-[#14213D] outline-none transition-colors focus:border-[#B8863B]`}
                />
              </div>

              <div>
                <label className={`${mono} mb-2 block text-xs uppercase tracking-wider text-[#14213D]`}>
                  Listing Type
                </label>
                <select
                  {...register("type")}
                  className={`${mono} w-full border border-[#14213D] bg-[#FFFDF9] px-4 py-2.5 text-sm text-[#14213D] outline-none transition-colors focus:border-[#B8863B]`}
                >
                  <option value="SALE">For Sale</option>
                  <option value="RENT">For Rent</option>
                </select>
              </div>
            </div>

            {/* City + Location */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className={`${mono} mb-2 block text-xs uppercase tracking-wider text-[#14213D]`}>
                  City
                </label>
                <input
                  {...register("city")}
                  className="w-full border border-[#14213D] bg-[#FFFDF9] px-4 py-2.5 text-sm text-[#14213D] outline-none transition-colors focus:border-[#B8863B]"
                />
              </div>

              <div>
                <label className={`${mono} mb-2 block text-xs uppercase tracking-wider text-[#14213D]`}>
                  Location / Address
                </label>
                <input
                  {...register("location")}
                  className="w-full border border-[#14213D] bg-[#FFFDF9] px-4 py-2.5 text-sm text-[#14213D] outline-none transition-colors focus:border-[#B8863B]"
                />
              </div>
            </div>

            {/* Bedrooms, Bathrooms, Area */}
            <div className="grid grid-cols-3 gap-3 md:gap-4">
              <div>
                <label className={`${mono} mb-2 block text-xs uppercase tracking-wider text-[#14213D]`}>
                  Bedrooms
                </label>
                <input
                  type="number"
                  {...register("bedrooms", { valueAsNumber: true })}
                  className={`${mono} w-full border border-[#14213D] bg-[#FFFDF9] px-3 py-2.5 text-sm text-[#14213D] outline-none transition-colors focus:border-[#B8863B]`}
                />
              </div>

              <div>
                <label className={`${mono} mb-2 block text-xs uppercase tracking-wider text-[#14213D]`}>
                  Bathrooms
                </label>
                <input
                  type="number"
                  {...register("bathrooms", { valueAsNumber: true })}
                  className={`${mono} w-full border border-[#14213D] bg-[#FFFDF9] px-3 py-2.5 text-sm text-[#14213D] outline-none transition-colors focus:border-[#B8863B]`}
                />
              </div>

              <div>
                <label className={`${mono} mb-2 block text-xs uppercase tracking-wider text-[#14213D]`}>
                  Area (m²)
                </label>
                <input
                  type="number"
                  {...register("area", { valueAsNumber: true })}
                  className={`${mono} w-full border border-[#14213D] bg-[#FFFDF9] px-3 py-2.5 text-sm text-[#14213D] outline-none transition-colors focus:border-[#B8863B]`}
                />
              </div>
            </div>

            {/* Mutation Error */}
            {isError && (
              <div className="border border-[#B8452E] bg-[#FFFDF9] px-4 py-3 text-xs text-[#B8452E]">
                {error instanceof Error ? error.message : "Failed to update property"}
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex items-center justify-end gap-3 border-t border-[#14213D] pt-5">
              <button
                type="button"
                onClick={onClose}
                className="border border-[#14213D] px-6 py-2.5 text-xs font-semibold uppercase tracking-wider text-[#14213D] transition-colors hover:bg-[#EFEAE0]"
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={isPending}
                className="border border-[#14213D] bg-[#14213D] px-6 py-2.5 text-xs font-semibold uppercase tracking-wider text-[#F7F5EF] transition-colors hover:bg-[#B8863B] hover:border-[#B8863B] disabled:opacity-50"
              >
                {isPending ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default Editproperity;
