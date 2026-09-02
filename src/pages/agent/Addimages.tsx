import { useForm } from "react-hook-form";
import { useaddimg } from "../../hooks/usefiles";
import { useParams, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

type AddImagesForm = {
  file: FileList;
};

// Import fonts once locally
const FontImports = () => (
  <style>{`@import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,400;9..144,500;9..144,600;9..144,700&family=Inter:wght@400;500;600&family=IBM+Plex+Mono:wght@400;500&display=swap');`}</style>
);

const serif = "[font-family:'Fraunces',serif]";
const mono = "[font-family:'IBM_Plex_Mono',monospace]";

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

    Array.from(data.file).forEach((file) => {
      formData.append("file", file);
    });

    mutate(
      {
        id: Number(id),
        data: formData,
      },
      {
        onSuccess: () => {
          toast.success("Images added successfully!");

          // الانتظار لمدة 1.5 ثانية لعرض التوست ثم التنقل
          setTimeout(() => {
            navigate("/agent/my-properties");
          }, 1500);
        },
      }
    );
  };

  return (
    <div className="min-h-screen bg-[#FFFDF9] py-10 px-4">
      <FontImports />

      <div className="mx-auto max-w-3xl">
        {/* Header Section */}
        <div className="mb-10 flex flex-col gap-4 border-b border-[#14213D] pb-6 md:flex-row md:items-end md:justify-between">
          <div>
            <p className={`${mono} text-xs uppercase tracking-[0.25em] text-[#B8863B]`}>
              Dashboard / Portfolio
            </p>
            <h1 className={`${serif} mt-2 text-3xl font-semibold text-[#14213D] md:text-4xl`}>
              Add Property Images
            </h1>
            <p className="mt-2 text-sm text-[#4A5568]">
              Upload high-quality images to highlight this listing.
            </p>
          </div>

          <button
            type="button"
            onClick={() => navigate(-1)}
            className="w-fit border border-[#14213D] px-4 py-2 text-xs font-semibold uppercase tracking-wider text-[#14213D] transition-colors hover:bg-[#14213D] hover:text-[#F7F5EF]"
          >
            ← Back
          </button>
        </div>

        {/* Form Container */}
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="relative border border-[#14213D] bg-[#FFFDF9] p-8 shadow-sm"
        >
          {/* Corner Registration Marks */}
          <span className="pointer-events-none absolute -left-px -top-px h-2.5 w-2.5 border-l-[1.5px] border-t-[1.5px] border-[#14213D]" />
          <span className="pointer-events-none absolute -right-px -top-px h-2.5 w-2.5 border-r-[1.5px] border-t-[1.5px] border-[#14213D]" />

          {/* Upload Dropzone Area */}
          <label
            htmlFor="file"
            className="group flex cursor-pointer flex-col items-center justify-center border-2 border-dashed border-[#14213D]/40 bg-[#EFEAE0]/30 p-12 text-center transition-colors hover:border-[#B8863B] hover:bg-[#EFEAE0]/60"
          >
            <div className="mb-4 flex h-14 w-14 items-center justify-center border border-[#14213D] bg-[#FFFDF9] text-[#14213D] transition-transform group-hover:scale-105">
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
              >
                <path d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>

            <p className={`${serif} text-lg font-medium text-[#14213D]`}>
              Click or drag images to upload
            </p>

            <p className={`${mono} mt-1 text-xs uppercase tracking-widest text-[#4A5568]`}>
              PNG, JPG, or JPEG
            </p>

            <input
              id="file"
              type="file"
              multiple
              accept="image/*"
              {...register("file", {
                required: "Please select at least one image",
              })}
              className="hidden"
            />
          </label>

          {/* Validation Error */}
          {errors.file && (
            <p className={`${mono} mt-3 text-xs uppercase tracking-wider text-[#B8452E]`}>
              ⚠ {errors.file.message}
            </p>
          )}

          {/* Selected Images Grid */}
          {selectedFiles && selectedFiles.length > 0 && (
            <div className="mt-8 border-t border-[#E4DFD3] pt-6">
              <h2 className={`${mono} mb-4 text-xs uppercase tracking-[0.2em] text-[#B8863B]`}>
                Selected Files ({selectedFiles.length})
              </h2>

              <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
                {Array.from(selectedFiles).map((file, index) => (
                  <div
                    key={`${file.name}-${index}`}
                    className="relative border border-[#14213D] bg-[#EFEAE0] p-1"
                  >
                    <img
                      src={URL.createObjectURL(file)}
                      alt={file.name}
                      className="h-28 w-full object-cover"
                    />
                    <div className="p-1.5">
                      <p className={`${mono} truncate text-[10px] text-[#4A5568]`}>
                        {file.name}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* API Error */}
          {isError && (
            <div className="mt-6 border border-[#B8452E] bg-[#FFFDF9] p-4 text-center">
              <p className={`${mono} text-xs uppercase tracking-widest text-[#B8452E]`}>
                Upload Failed: {error instanceof Error ? error.message : "Something went wrong"}
              </p>
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isPending}
            className="mt-8 w-full border border-[#14213D] bg-[#14213D] py-3.5 text-xs font-semibold uppercase tracking-[0.2em] text-[#F7F5EF] transition-colors hover:bg-[#B8863B] hover:border-[#B8863B] disabled:cursor-not-allowed disabled:bg-[#4A5568]/40"
          >
            {isPending ? "Uploading..." : "Upload Images"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Addimages;
