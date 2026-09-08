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

const Editproperity = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  // 1. تحويل الـ ID إلى رقم آمن
  const propertyId = id ? Number(id) : 0;

  // 2. يحل خطأ السطر 47: تمرير propertyId كـ number لـ usegetbyid
  const { data: propertyData, isLoading, isError } = usegetbyid(propertyId);

  const editPropMutation = useeditprop();

  const [formData, setFormData] = useState<Partial<PropertyForm>>({});

  useEffect(() => {
    if (propertyData) {
      setFormData(propertyData);
    }
  }, [propertyData]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!propertyId) return;

    // 3. يحل خطأ السطر 88: إرسال كائن يحتوي على { id, data } بدلاً من formData فقط
    editPropMutation.mutate(
      {
        id: propertyId,
        data: formData,
      },
      {
        onSuccess: () => {
          navigate("/properties");
        },
      }
    );
  };

  if (isLoading) return <div className="p-6 text-center">Loading details...</div>;
  if (isError || !propertyId)
    return <div className="p-6 text-center text-red-600">Property not found!</div>;

  return (
    <form onSubmit={handleSubmit} className="max-w-2xl mx-auto p-6 space-y-4">
      <h1 className="text-2xl font-bold">Edit Property</h1>

      <div>
        <label className="block text-sm font-medium">Title</label>
        <input
          type="text"
          value={formData.title || ""}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          className="w-full border p-2 rounded"
        />
      </div>

      <button
        type="submit"
        disabled={editPropMutation.isPending}
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
      >
        {editPropMutation.isPending ? "Updating..." : "Save Changes"}
      </button>
    </form>
  );
};

export default Editproperity;
