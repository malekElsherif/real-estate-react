import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { usegetbyid, useeditprop } from "../../hooks/useProp"; // اضبط المسار حسب مشروعك

export interface PropertyForm {
  title: string;
  description: string;
  price: number;
  city: string;
  type: string;
  bedrooms: number;
  bathrooms: number;
  area: number;
}

interface EditPropertyProps {
  id?: number;
  open?: boolean;
  onClose?: () => void;
}

const Editproperity = ({ id: propId, open = true, onClose }: EditPropertyProps) => {
  const { id: paramId } = useParams<{ id: string }>();
  const navigate = useNavigate();

  // تحديد المعرف سواء تم تمريره كـ Prop أو تم قراءته من الـ URL
  const propertyId = propId ?? (paramId ? Number(paramId) : 0);

  const { data: propertyData, isLoading, isError } = usegetbyid(propertyId);
  const editPropMutation = useeditprop();

  const [formData, setFormData] = useState<Partial<PropertyForm>>({});

  useEffect(() => {
    if (propertyData) {
      setFormData(propertyData);
    }
  }, [propertyData]);

  const handleClose = () => {
    if (onClose) {
      onClose();
    } else {
      navigate(-1);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!propertyId) return;

    editPropMutation.mutate(
      {
        id: propertyId,
        data: formData,
      },
      {
        onSuccess: () => {
          handleClose();
        },
      }
    );
  };

  if (!open) return null;

  const formContent = (
    <form onSubmit={handleSubmit} className="space-y-4">
      <h1 className="text-2xl font-bold text-slate-800">Edit Property</h1>

      {isLoading ? (
        <div className="p-6 text-center text-slate-500">Loading details...</div>
      ) : isError || !propertyId ? (
        <div className="p-6 text-center text-red-600">Property not found!</div>
      ) : (
        <>
          <div>
            <label className="block text-sm font-medium text-slate-700">Title</label>
            <input
              type="text"
              value={formData.title || ""}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="mt-1 w-full border border-slate-300 p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="flex justify-end gap-3 pt-4">
            {onClose && (
              <button
                type="button"
                onClick={handleClose}
                className="px-4 py-2 border border-slate-300 text-slate-600 rounded hover:bg-slate-50"
              >
                Cancel
              </button>
            )}
            <button
              type="submit"
              disabled={editPropMutation.isPending}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50 font-medium"
            >
              {editPropMutation.isPending ? "Updating..." : "Save Changes"}
            </button>
          </div>
        </>
      )}
    </form>
  );

  // إذا تم استخدامه كـ Modal/Dialog
  if (onClose) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
        <div className="w-full max-w-2xl rounded-xl bg-white p-6 shadow-xl">
          {formContent}
        </div>
      </div>
    );
  }

  // إذا تم استخدامه كصفحة مستقلة
  return <div className="max-w-2xl mx-auto p-6">{formContent}</div>;
};

export default Editproperity;
