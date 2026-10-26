import { usedeleteuser } from "../../hooks/useadmin";
import { useQueryClient } from "@tanstack/react-query";

type DeleteUserProps = {
  id: number;
  open: boolean;
  onClose: () => void;
};

const DeleteUser = ({ id, open, onClose }: DeleteUserProps) => {
  const { mutate, isPending } = usedeleteuser(id);
  const queryClient = useQueryClient();

  if (!open) return null;

  const handleDelete = () => {
    mutate(undefined, {
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: ["getallusers"],
        });
        onClose();
      },
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-stone-950/60 backdrop-blur-sm p-4">
      <div className="w-full max-w-md rounded-2xl border border-stone-200 bg-white shadow-xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">

        {/* Header */}
        <div className="border-b border-stone-200 px-6 py-4 bg-stone-50">
          <h3 className="text-lg font-bold text-stone-900">Delete User</h3>
        </div>

        {/* Content */}
        <div className="px-6 py-6">
          <p className="text-xs text-stone-600 leading-relaxed font-mono">
            Are you sure you want to delete this user? This action cannot be undone.
          </p>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end gap-2 border-t border-stone-200 bg-stone-50 px-6 py-4">
          <button
            type="button"
            onClick={onClose}
            disabled={isPending}
            className="rounded-xl border border-stone-300 bg-white px-4 py-2 text-xs font-semibold text-stone-700 hover:border-stone-900 transition disabled:opacity-50"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={handleDelete}
            disabled={isPending}
            className="rounded-xl bg-red-600 px-4 py-2 text-xs font-semibold text-white hover:bg-red-700 transition disabled:opacity-50"
          >
            {isPending ? "Deleting..." : "Delete"}
          </button>
        </div>

      </div>
    </div>
  );
};

export default DeleteUser;
