import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { usegetbyid, useeditprop } from "../../hooks/useProp";
import { Modal, primary, ghost } from "../ui";

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

const fields = [
  ["title", "Title", "text"],
  ["description", "Description", "text"],
  ["city", "City", "text"],
  ["price", "Price (EGP)", "number"],
  ["bedrooms", "Bedrooms", "number"],
  ["bathrooms", "Bathrooms", "number"],
  ["area", "Area (m²)", "number"],
] as const;

const Editproperity = ({ id: propId, open = true, onClose }: EditPropertyProps) => {
  const { id: paramId } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const propertyId = propId ?? (paramId ? Number(paramId) : 0);

  const { data, isLoading, isError } = usegetbyid(propertyId);
  const edit = useeditprop();
  const [form, setForm] = useState<Partial<PropertyForm>>({});

  useEffect(() => {
    if (data) setForm(data);
  }, [data]);

  if (!open) return null;

  const close = () => (onClose ? onClose() : navigate(-1));

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (propertyId) edit.mutate({ id: propertyId, data: form }, { onSuccess: close });
  };

  const content = (
    <form onSubmit={submit} className="space-y-4">
      <h1 className="text-xl font-semibold text-stone-900">Edit Property</h1>

      {isLoading ? (
        <p className="py-6 text-center text-stone-500">Loading…</p>
      ) : isError || !propertyId ? (
        <p className="py-6 text-center text-rose-600">Property not found</p>
      ) : (
        <>
          <div className="grid gap-4 sm:grid-cols-2">
            {fields.map(([key, label, type]) => (
              <label key={key} className={`text-sm font-medium text-stone-600 ${key === "title" || key === "description" ? "sm:col-span-2" : ""}`}>
                {label}
                <input
                  type={type}
                  value={(form[key] as string | number | undefined) ?? ""}
                  onChange={(e) => setForm({ ...form, [key]: type === "number" ? Number(e.target.value) : e.target.value })}
                  className="mt-1 w-full rounded-xl border border-stone-200 px-3 py-2 text-stone-900 outline-none transition focus:border-amber-700 focus:ring-4 focus:ring-amber-100"
                />
              </label>
            ))}
          </div>

          <div className="flex justify-end gap-2 pt-2">
            {onClose && <button type="button" onClick={close} className={ghost}>Cancel</button>}
            <button type="submit" disabled={edit.isPending} className={primary}>
              {edit.isPending ? "Saving…" : "Save changes"}
            </button>
          </div>
        </>
      )}
    </form>
  );

  return onClose ? (
    <Modal open onClose={onClose} size="max-w-xl">{content}</Modal>
  ) : (
    <div className="mx-auto max-w-xl rounded-2xl border border-stone-100 bg-white p-6 shadow-sm">{content}</div>
  );
};

export default Editproperity;
