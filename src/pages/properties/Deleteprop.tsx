import { useState } from "react";
import { createPortal } from "react-dom";
import { usedeleteprop } from "../../hooks/useProp";
import { useQueryClient } from "@tanstack/react-query";

const Deleteprop = ({ id }: { id: number }) => {
  const [open, setOpen] = useState(false);

  const {
    mutate,
    isPending,
    isError,
    error,
  } = usedeleteprop();
const queryclient=useQueryClient();
  const handleDelete = () => {
    
    mutate(id, {
      onSuccess: () => { 
        setOpen(false);
        queryclient.invalidateQueries({
          queryKey: ["properties"],
        });

        queryclient.invalidateQueries({
          queryKey: ["getbyuser"],
        });
       

      },
    });
  };

  return (
    <>
      {/* Delete Button */}
      <button
        type="button"
        onClick={() => setOpen(true)}
        disabled={isPending}
        className="w-full rounded-xl bg-red-600 px-4 py-2.5 text-sm font-bold text-white transition hover:bg-red-700"
      >
        🗑️ Delete
      </button>

      {/* Dialog */}
      {open &&
        createPortal(
          <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 p-4">

            <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl">

              <h2 className="text-xl font-bold text-slate-900">
                Delete Property
              </h2>

              <p className="mt-3 text-slate-500">
                هل أنت متأكد أنك تريد حذف هذا العقار؟
              </p>

              {isError && (
                <p className="mt-3 text-sm font-semibold text-red-500">
                  {error instanceof Error
                    ? error.message
                    : "حدث خطأ أثناء الحذف"}
                </p>
              )}

              <div className="mt-6 flex justify-end gap-3">

                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  disabled={isPending}
                  className="rounded-xl bg-slate-100 px-5 py-2.5 font-semibold text-slate-700 hover:bg-slate-200"
                >
                  Cancel
                </button>

                <button
                  type="button"
                  onClick={handleDelete}
                  disabled={isPending}
                  className="rounded-xl bg-red-600 px-5 py-2.5 font-semibold text-white hover:bg-red-700"
                >
                  {isPending ? "Deleting..." : "Delete"}
                </button>

              </div>

            </div>

          </div>,

          document.body
        )}
    </>
  );
};

export default Deleteprop;