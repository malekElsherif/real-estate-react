import { Link } from "react-router-dom";
import { usegetmyfav } from "../../hooks/usefav";
import Imgcard from "../properties/Imgcard";
import { Modal } from "../ui";

const Myfav = ({ open, onClose }: { open: boolean; onClose: () => void }) => {
  const { data, isPending, error } = usegetmyfav();
  const favs: any[] = data?.data ?? [];

  const note = (text: string) => <p className="py-12 text-center text-sm text-stone-500">{text}</p>;

  return (
    <Modal open={open} onClose={onClose} size="max-w-3xl">
      <div className="mb-5 flex items-center justify-between">
        <h2 className="text-lg font-semibold text-stone-900"><span className="text-rose-500">♥</span> Saved properties</h2>
        <button onClick={onClose} className="text-stone-400 transition hover:text-stone-700">✕</button>
      </div>

      {isPending ? note("Loading…")
        : error ? note("Failed to load your favorites.")
        : favs.length === 0 ? note("Nothing saved yet — tap the heart on any listing.")
        : (
          <div className="grid gap-4 sm:grid-cols-2">
            {favs.map((f) => {
              const p = f.property ?? f;
              return (
                <Link
                  key={f.id ?? p.id}
                  to={`/properties/${p.id}`}
                  onClick={onClose}
                  className="group overflow-hidden rounded-2xl border border-stone-100 shadow-sm transition hover:shadow-md"
                >
                  <Imgcard propertyId={Number(p.id)} className="h-40" />
                  <div className="p-4">
                    <h3 className="truncate font-medium text-stone-900">{p.title}</h3>
                    <p className="truncate text-sm text-stone-500">📍 {p.address || p.city || p.location || "—"}</p>
                    <p className="mt-2 font-semibold text-amber-800">{p.price?.toLocaleString()} EGP</p>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
    </Modal>
  );
};

export default Myfav;
