import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { usedeleteprop } from "../../hooks/useProp";
import { Modal, ghost, danger } from "../ui";

const Deleteprop = ({ id }: { id: number }) => {
  const [open, setOpen] = useState(false);
  const { mutate, isPending, isError, error } = usedeleteprop();
  const qc = useQueryClient();

  const handleDelete = () =>
    mutate(id, {
      onSuccess: () => {
        setOpen(false);
        qc.invalidateQueries({ queryKey: ["properties"] });
        qc.invalidateQueries({ queryKey: ["getbyuser"] });
      },
    });

  return (
    <>
      <button type="button" onClick={() => setOpen(true)} disabled={isPending} className={`${danger} w-full`}>
        🗑️ Delete
      </button>

      <Modal open={open} onClose={() => setOpen(false)}>
        <h2 className="text-lg font-semibold text-stone-900">Delete Property</h2>
        <p className="mt-2 text-sm text-stone-500">هل أنت متأكد أنك تريد حذف هذا العقار؟</p>

        {isError && (
          <p className="mt-3 text-sm text-rose-600">
            {error instanceof Error ? error.message : "حدث خطأ أثناء الحذف"}
          </p>
        )}

        <div className="mt-6 flex justify-end gap-2">
          <button type="button" onClick={() => setOpen(false)} disabled={isPending} className={ghost}>Cancel</button>
          <button type="button" onClick={handleDelete} disabled={isPending} className={danger}>
            {isPending ? "Deleting…" : "Delete"}
          </button>
        </div>
      </Modal>
    </>
  );
};

export default Deleteprop;
