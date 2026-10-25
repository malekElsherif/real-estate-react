import { useForm } from "react-hook-form";
import { useaddimg } from "../../hooks/usefiles";
import { useParams, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

type AddImagesForm = {
  file: FileList;
};

const Addimages = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { mutate, isPending, isError, error } = useaddimg();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<AddImagesForm>();

  const selectedFiles = watch("file");

  const onSubmit = (data: AddImagesForm) => {
    const formData = new FormData();
    Array.from(data.file).forEach((file) => formData.append("file", file));

    mutate(
      { id: Number(id), data: formData },
      {
        onSuccess: () => {
          toast.success("Images added successfully!");
          setTimeout(() => navigate("/agent/my-properties"), 1500);
        },
      }
    );
  };

  return (
    <div className="min-h-screen bg-stone-50 py-10 px-4 text-stone-900">
      <div className="mx-auto max-w-3xl space-y-6">
        {/* Header */}
        <div className="flex flex-col gap-4 border-b border-stone-200 pb-6 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-xs uppercase tracking-wider text-amber-800">
              Dashboard / Portfolio
            </p>
            <h1 className="mt-1 text-3xl font-bold tracking-tight sm:text-4xl">
              Add Property Images
            </h1>
            <p className="mt-1 text-sm text-stone-500">
              Upload high-quality images to highlight this listing.
            </p>
          </div>

          <button
            type="button"
            onClick={() => navigate(-1)}
            className="w-fit rounded-xl border border-stone-200 bg-white px-4 py-2 text-xs font-semibold uppercase tracking-wider text-stone-700 transition hover:bg-stone-50 hover:text-amber-800 cursor-pointer"
          >
            ← Back
          </button>
        </div>

        {/* Form Container */}
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="rounded-2xl border border-stone-100 bg-white p-8 shadow-sm space-y-6"
        >
          {/* Upload Dropzone Area */}
          <label
            htmlFor="file"
            className="group flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-stone-200 bg-stone-50 p-12 text-center transition hover:border-amber-800 hover:bg-amber-50/30"
          >
            <div className="mb-3 flex h-14 w-14 items-center justify-center rounded-xl border border-stone-200 bg-white text-stone-700 transition group-hover:scale-105 group-hover:border-amber-800 group-hover:text-amber-800">
              📁
            </div>

            <p className="text-base font-semibold">Click or drag images to upload</p>
            <p className="mt-1 text-xs uppercase tracking-widest text-stone-400">
              PNG, JPG, or JPEG
            </p>

            <input
              id="file"
              type="file"
              multiple
              accept="image/*"
              {...register("file", { required: "Please select at least one image" })}
              className="hidden"
            />
          </label>

          {/* Validation Error */}
          {errors.file && (
            <p className="text-xs font-medium text-rose-600">
              ⚠️ {errors.file.message}
            </p>
          )}

          {/* Selected Images Grid */}
          {selectedFiles && selectedFiles.length > 0 && (
            <div className="border-t border-stone-100 pt-6">
              <h2 className="mb-4 text-xs font-semibold uppercase tracking-wider text-amber-800">
                Selected Files ({selectedFiles.length})
              </h2>

              <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
                {Array.from(selectedFiles).map((file, index) => (
                  <div
                    key={`${file.name}-${index}`}
                    className="overflow-hidden rounded-xl border border-stone-200 bg-stone-50 p-1.5"
                  >
                    <img
                      src={URL.createObjectURL(file)}
                      alt={file.name}
                      className="h-28 w-full rounded-lg object-cover"
                    />
                    <p className="mt-1.5 truncate px-1 text-[10px] text-stone-500">
                      {file.name}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* API Error */}
          {isError && (
            <div className="rounded-xl border border-rose-200 bg-rose-50 p-4 text-center">
              <p className="text-xs font-medium text-rose-600">
                Upload Failed: {error instanceof Error ? error.message : "Something went wrong"}
              </p>
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isPending}
            className="w-full rounded-xl bg-amber-800 py-3.5 text-xs font-semibold uppercase tracking-wider text-white transition hover:bg-amber-900 disabled:cursor-not-allowed disabled:opacity-50 cursor-pointer"
          >
            {isPending ? "Uploading..." : "Upload Images"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Addimages;
