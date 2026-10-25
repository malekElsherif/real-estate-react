import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { useaddprop } from "../../hooks/useProp";
import { usegetme } from "../../hooks/useUsers";

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
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: ["getbyuser", id],
        });

        toast.success("Property added successfully");
        reset();
        navigate("/agent/my-properties");
      },
      onError: () => {
        toast.error("Something went wrong");
      },
    });
  };

  const handleCancel = () => {
    reset();
    navigate(-1);
  };

  return (
    <div className="mx-auto max-w-4xl space-y-6 text-stone-900">
      {/* Header Section */}
      <div className="flex flex-col gap-2 border-b border-stone-200 pb-5 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <span className="text-xs font-semibold uppercase tracking-wider text-amber-800">
            New Listing Dossier
          </span>
          <h1 className="text-2xl font-bold tracking-tight md:text-3xl">
            Add New Property
          </h1>
          <p className="mt-1 text-xs text-stone-500">
            Fill in the parameters below to publish a new estate listing.
          </p>
        </div>

        <button
          type="button"
          onClick={handleCancel}
          className="text-xs font-semibold uppercase tracking-wider text-stone-500 hover:text-amber-800 cursor-pointer"
        >
          ← Cancel & Return
        </button>
      </div>

      {/* Form Card */}
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="rounded-2xl border border-stone-100 bg-white p-6 shadow-sm sm:p-8 space-y-6"
      >
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          {/* Title */}
          <div className="sm:col-span-2 space-y-1">
            <label className="text-xs font-semibold uppercase tracking-wider text-stone-700">
              Property Title *
            </label>
            <input
              type="text"
              placeholder="e.g. Modern Minimalist Villa"
              {...register("title", { required: "Title is required" })}
              className={`w-full rounded-xl border bg-stone-50 p-3 text-sm outline-none transition focus:border-amber-800 focus:bg-white focus:ring-1 focus:ring-amber-800 ${
                errors.title ? "border-rose-500" : "border-stone-200"
              }`}
            />
            {errors.title && (
              <p className="text-xs font-medium text-rose-600">
                {errors.title.message}
              </p>
            )}
          </div>

          {/* Type */}
          <div className="space-y-1">
            <label className="text-xs font-semibold uppercase tracking-wider text-stone-700">
              Listing Type *
            </label>
            <select
              defaultValue=""
              {...register("type", { required: "Listing type is required" })}
              className={`w-full rounded-xl border bg-stone-50 p-3 text-sm outline-none transition focus:border-amber-800 focus:bg-white focus:ring-1 focus:ring-amber-800 ${
                errors.type ? "border-rose-500" : "border-stone-200"
              }`}
            >
              <option value="" disabled>
                Select type...
              </option>
              <option value="SALE">For Sale</option>
              <option value="RENT">For Rent</option>
            </select>
            {errors.type && (
              <p className="text-xs font-medium text-rose-600">
                {errors.type.message}
              </p>
            )}
          </div>

          {/* Price */}
          <div className="space-y-1">
            <label className="text-xs font-semibold uppercase tracking-wider text-stone-700">
              Price ($) *
            </label>
            <input
              type="number"
              placeholder="1500"
              {...register("price", {
                required: "Price is required",
                valueAsNumber: true,
              })}
              className={`w-full rounded-xl border bg-stone-50 p-3 text-sm outline-none transition focus:border-amber-800 focus:bg-white focus:ring-1 focus:ring-amber-800 ${
                errors.price ? "border-rose-500" : "border-stone-200"
              }`}
            />
            {errors.price && (
              <p className="text-xs font-medium text-rose-600">
                {errors.price.message}
              </p>
            )}
          </div>

          {/* Area */}
          <div className="space-y-1">
            <label className="text-xs font-semibold uppercase tracking-wider text-stone-700">
              Area (m²) *
            </label>
            <input
              type="number"
              placeholder="250"
              {...register("area", {
                required: "Area is required",
                valueAsNumber: true,
              })}
              className={`w-full rounded-xl border bg-stone-50 p-3 text-sm outline-none transition focus:border-amber-800 focus:bg-white focus:ring-1 focus:ring-amber-800 ${
                errors.area ? "border-rose-500" : "border-stone-200"
              }`}
            />
            {errors.area && (
              <p className="text-xs font-medium text-rose-600">
                {errors.area.message}
              </p>
            )}
          </div>

          {/* Bedrooms */}
          <div className="space-y-1">
            <label className="text-xs font-semibold uppercase tracking-wider text-stone-700">
              Bedrooms *
            </label>
            <input
              type="number"
              placeholder="4"
              {...register("bedrooms", {
                required: "Bedrooms is required",
                valueAsNumber: true,
              })}
              className={`w-full rounded-xl border bg-stone-50 p-3 text-sm outline-none transition focus:border-amber-800 focus:bg-white focus:ring-1 focus:ring-amber-800 ${
                errors.bedrooms ? "border-rose-500" : "border-stone-200"
              }`}
            />
            {errors.bedrooms && (
              <p className="text-xs font-medium text-rose-600">
                {errors.bedrooms.message}
              </p>
            )}
          </div>

          {/* Bathrooms */}
          <div className="space-y-1">
            <label className="text-xs font-semibold uppercase tracking-wider text-stone-700">
              Bathrooms *
            </label>
            <input
              type="number"
              placeholder="3"
              {...register("bathrooms", {
                required: "Bathrooms is required",
                valueAsNumber: true,
              })}
              className={`w-full rounded-xl border bg-stone-50 p-3 text-sm outline-none transition focus:border-amber-800 focus:bg-white focus:ring-1 focus:ring-amber-800 ${
                errors.bathrooms ? "border-rose-500" : "border-stone-200"
              }`}
            />
            {errors.bathrooms && (
              <p className="text-xs font-medium text-rose-600">
                {errors.bathrooms.message}
              </p>
            )}
          </div>

          {/* City */}
          <div className="space-y-1">
            <label className="text-xs font-semibold uppercase tracking-wider text-stone-700">
              City *
            </label>
            <input
              type="text"
              placeholder="Tanta"
              {...register("city", { required: "City is required" })}
              className={`w-full rounded-xl border bg-stone-50 p-3 text-sm outline-none transition focus:border-amber-800 focus:bg-white focus:ring-1 focus:ring-amber-800 ${
                errors.city ? "border-rose-500" : "border-stone-200"
              }`}
            />
            {errors.city && (
              <p className="text-xs font-medium text-rose-600">
                {errors.city.message}
              </p>
            )}
          </div>

          {/* Address */}
          <div className="sm:col-span-2 space-y-1">
            <label className="text-xs font-semibold uppercase tracking-wider text-stone-700">
              Street Address *
            </label>
            <input
              type="text"
              placeholder="El Bahr Street"
              {...register("address", { required: "Address is required" })}
              className={`w-full rounded-xl border bg-stone-50 p-3 text-sm outline-none transition focus:border-amber-800 focus:bg-white focus:ring-1 focus:ring-amber-800 ${
                errors.address ? "border-rose-500" : "border-stone-200"
              }`}
            />
            {errors.address && (
              <p className="text-xs font-medium text-rose-600">
                {errors.address.message}
              </p>
            )}
          </div>

          {/* Description */}
          <div className="sm:col-span-2 space-y-1">
            <label className="text-xs font-semibold uppercase tracking-wider text-stone-700">
              Full Description *
            </label>
            <textarea
              rows={4}
              placeholder="Detailed description of the estate..."
              {...register("description", { required: "Description is required" })}
              className={`w-full rounded-xl border bg-stone-50 p-3 text-sm outline-none transition focus:border-amber-800 focus:bg-white focus:ring-1 focus:ring-amber-800 ${
                errors.description ? "border-rose-500" : "border-stone-200"
              }`}
            />
            {errors.description && (
              <p className="text-xs font-medium text-rose-600">
                {errors.description.message}
              </p>
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end gap-3 border-t border-stone-200 pt-5">
          <button
            type="button"
            onClick={handleCancel}
            className="rounded-xl border border-stone-200 bg-white px-6 py-2.5 text-xs font-semibold uppercase tracking-wider text-stone-700 transition hover:bg-stone-50 cursor-pointer"
          >
            Cancel
          </button>

          <button
            type="submit"
            disabled={isPending}
            className="rounded-xl bg-amber-800 px-6 py-2.5 text-xs font-semibold uppercase tracking-wider text-white transition hover:bg-amber-900 disabled:opacity-50 cursor-pointer"
          >
            {isPending ? "Creating Listing..." : "Save Property"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddPropertyPage;
