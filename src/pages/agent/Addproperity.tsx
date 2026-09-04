import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { useaddprop } from "../../hooks/useProp";
import { usegetme } from "../../hooks/useUsers";

const serif = "[font-family:'Fraunces',serif]";
const mono = "[font-family:'IBM_Plex_Mono',monospace]";

type PropertyFormData = {
  title: string;
  description: string;
  price: number;
  city: string;
  address: string;
  area: number;
  bedrooms: number;
  bathrooms: number;
  type: "SALE" | "RENT";
};

const AddPropertyPage = () => {
  const { mutate, isPending } = useaddprop();
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<PropertyFormData>();

  const { data: user } = usegetme();
  const id = user?.data?.userId;

  const onSubmit = (data: PropertyFormData) => {
    mutate(data, {
      onSuccess: (response) => {
        console.log("PROPERTY CREATED:", response);

        queryClient.invalidateQueries({
          queryKey: ["getbyuser", id],
        });

        toast.success("Property added successfully");
        reset();
        navigate("/agent/my-properties");
      },
      onError: (error) => {
        console.error("ERROR:", error);
        toast.error("Something went wrong");
      },
    });
  };

  const handleCancel = () => {
    reset();
    navigate(-1);
  };

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      {/* =========================
          Header Section
      ========================= */}
      <div className="flex flex-col gap-2 border-b border-[#14213D] pb-5 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <span className={`${mono} text-[10px] uppercase tracking-[0.2em] text-[#B8863B]`}>
            New Listing Dossier
          </span>
          <h1 className={`${serif} text-2xl font-semibold text-[#14213D] md:text-3xl`}>
            Add New Property
          </h1>
          <p className={`${mono} mt-1 text-xs text-[#4A5568]`}>
            Fill in the parameters below to publish a new estate listing.
          </p>
        </div>

        <button
          type="button"
          onClick={handleCancel}
          className={`${mono} text-xs font-semibold uppercase tracking-wider text-[#4A5568] hover:text-[#14213D]`}
        >
          ← Cancel & Return
        </button>
      </div>

      {/* =========================
          Form Card
      ========================= */}
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="border border-[#14213D] bg-[#FFFDF9] p-6 sm:p-8 space-y-6"
      >
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          {/* Title */}
          <div className="sm:col-span-2 space-y-1">
            <label className={`${mono} text-[10px] uppercase tracking-wider text-[#4A5568]`}>
              Property Title *
            </label>
            <input
              type="text"
              placeholder="e.g. Modern Minimalist Villa"
              {...register("title", { required: "Title is required" })}
              className={`w-full border bg-[#F7F5EF] p-3 text-sm text-[#14213D] outline-none transition focus:border-[#14213D] ${
                errors.title ? "border-[#B8452E]" : "border-[#E4DFD3]"
              }`}
            />
            {errors.title && (
              <p className={`${mono} text-[10px] text-[#B8452E]`}>
                {errors.title.message}
              </p>
            )}
          </div>

          {/* Type */}
          <div className="space-y-1">
            <label className={`${mono} text-[10px] uppercase tracking-wider text-[#4A5568]`}>
              Listing Type *
            </label>
            <select
              defaultValue=""
              {...register("type", { required: "Listing type is required" })}
              className={`w-full border bg-[#F7F5EF] p-3 text-sm text-[#14213D] outline-none transition focus:border-[#14213D] ${
                errors.type ? "border-[#B8452E]" : "border-[#E4DFD3]"
              }`}
            >
              <option value="" disabled>
                Select type...
              </option>
              <option value="SALE">For Sale</option>
              <option value="RENT">For Rent</option>
            </select>
            {errors.type && (
              <p className={`${mono} text-[10px] text-[#B8452E]`}>
                {errors.type.message}
              </p>
            )}
          </div>

          {/* Price */}
          <div className="space-y-1">
            <label className={`${mono} text-[10px] uppercase tracking-wider text-[#4A5568]`}>
              Price ($) *
            </label>
            <input
              type="number"
              placeholder="1500"
              {...register("price", {
                required: "Price is required",
                valueAsNumber: true,
              })}
              className={`w-full border bg-[#F7F5EF] p-3 text-sm text-[#14213D] outline-none transition focus:border-[#14213D] ${
                errors.price ? "border-[#B8452E]" : "border-[#E4DFD3]"
              }`}
            />
            {errors.price && (
              <p className={`${mono} text-[10px] text-[#B8452E]`}>
                {errors.price.message}
              </p>
            )}
          </div>

          {/* Area */}
          <div className="space-y-1">
            <label className={`${mono} text-[10px] uppercase tracking-wider text-[#4A5568]`}>
              Area (m²) *
            </label>
            <input
              type="number"
              placeholder="250"
              {...register("area", {
                required: "Area is required",
                valueAsNumber: true,
              })}
              className={`w-full border bg-[#F7F5EF] p-3 text-sm text-[#14213D] outline-none transition focus:border-[#14213D] ${
                errors.area ? "border-[#B8452E]" : "border-[#E4DFD3]"
              }`}
            />
            {errors.area && (
              <p className={`${mono} text-[10px] text-[#B8452E]`}>
                {errors.area.message}
              </p>
            )}
          </div>

          {/* Bedrooms */}
          <div className="space-y-1">
            <label className={`${mono} text-[10px] uppercase tracking-wider text-[#4A5568]`}>
              Bedrooms *
            </label>
            <input
              type="number"
              placeholder="4"
              {...register("bedrooms", {
                required: "Bedrooms is required",
                valueAsNumber: true,
              })}
              className={`w-full border bg-[#F7F5EF] p-3 text-sm text-[#14213D] outline-none transition focus:border-[#14213D] ${
                errors.bedrooms ? "border-[#B8452E]" : "border-[#E4DFD3]"
              }`}
            />
            {errors.bedrooms && (
              <p className={`${mono} text-[10px] text-[#B8452E]`}>
                {errors.bedrooms.message}
              </p>
            )}
          </div>

          {/* Bathrooms */}
          <div className="space-y-1">
            <label className={`${mono} text-[10px] uppercase tracking-wider text-[#4A5568]`}>
              Bathrooms *
            </label>
            <input
              type="number"
              placeholder="3"
              {...register("bathrooms", {
                required: "Bathrooms is required",
                valueAsNumber: true,
              })}
              className={`w-full border bg-[#F7F5EF] p-3 text-sm text-[#14213D] outline-none transition focus:border-[#14213D] ${
                errors.bathrooms ? "border-[#B8452E]" : "border-[#E4DFD3]"
              }`}
            />
            {errors.bathrooms && (
              <p className={`${mono} text-[10px] text-[#B8452E]`}>
                {errors.bathrooms.message}
              </p>
            )}
          </div>

          {/* City */}
          <div className="space-y-1">
            <label className={`${mono} text-[10px] uppercase tracking-wider text-[#4A5568]`}>
              City *
            </label>
            <input
              type="text"
              placeholder="Tanta"
              {...register("city", { required: "City is required" })}
              className={`w-full border bg-[#F7F5EF] p-3 text-sm text-[#14213D] outline-none transition focus:border-[#14213D] ${
                errors.city ? "border-[#B8452E]" : "border-[#E4DFD3]"
              }`}
            />
            {errors.city && (
              <p className={`${mono} text-[10px] text-[#B8452E]`}>
                {errors.city.message}
              </p>
            )}
          </div>

          {/* Address */}
          <div className="sm:col-span-2 space-y-1">
            <label className={`${mono} text-[10px] uppercase tracking-wider text-[#4A5568]`}>
              Street Address *
            </label>
            <input
              type="text"
              placeholder="El Bahr Street"
              {...register("address", { required: "Address is required" })}
              className={`w-full border bg-[#F7F5EF] p-3 text-sm text-[#14213D] outline-none transition focus:border-[#14213D] ${
                errors.address ? "border-[#B8452E]" : "border-[#E4DFD3]"
              }`}
            />
            {errors.address && (
              <p className={`${mono} text-[10px] text-[#B8452E]`}>
                {errors.address.message}
              </p>
            )}
          </div>

          {/* Description */}
          <div className="sm:col-span-2 space-y-1">
            <label className={`${mono} text-[10px] uppercase tracking-wider text-[#4A5568]`}>
              Full Description *
            </label>
            <textarea
              rows={4}
              placeholder="Detailed description of the estate..."
              {...register("description", { required: "Description is required" })}
              className={`w-full border bg-[#F7F5EF] p-3 text-sm text-[#14213D] outline-none transition focus:border-[#14213D] ${
                errors.description ? "border-[#B8452E]" : "border-[#E4DFD3]"
              }`}
            />
            {errors.description && (
              <p className={`${mono} text-[10px] text-[#B8452E]`}>
                {errors.description.message}
              </p>
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end gap-3 border-t border-[#14213D] pt-5">
          <button
            type="button"
            onClick={handleCancel}
            className={`${mono} border border-[#14213D] bg-transparent px-6 py-2.5 text-xs font-semibold uppercase tracking-wider text-[#14213D] transition hover:bg-[#F7F5EF]`}
          >
            Cancel
          </button>

          <button
            type="submit"
            disabled={isPending}
            className={`${mono} border border-[#14213D] bg-[#14213D] px-6 py-2.5 text-xs font-semibold uppercase tracking-wider text-[#F7F5EF] transition hover:border-[#B8863B] hover:bg-[#B8863B] disabled:opacity-50`}
          >
            {isPending ? "Creating Listing..." : "Save Property"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddPropertyPage;
