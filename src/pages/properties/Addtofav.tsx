import { useQueryClient } from "@tanstack/react-query";
import { useaddtoFav, usedelfav, useistfav } from "../../hooks/usefav";

const Addtofav = ({ id }: { id: number }) => {
  const qc = useQueryClient();
  const { data, isLoading } = useistfav(id);
  const add = useaddtoFav(id);
  const del = usedelfav(id);

  const isFav = data?.data === true;
  const busy = isLoading || add.isPending || del.isPending;

  const refresh = {
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["isfav", id] });
      qc.invalidateQueries({ queryKey: ["getmyfav"] });
    },
  };

  return (
    <button
      type="button"
      title={isFav ? "Remove from favorites" : "Add to favorites"}
      disabled={busy}
      onClick={() => (isFav ? del.mutate(undefined, refresh) : add.mutate(id, refresh))}
      className={`grid h-10 w-10 place-items-center rounded-full bg-white text-xl shadow-md ring-1 ring-stone-100 transition hover:scale-110 disabled:opacity-60 ${
        isFav ? "text-rose-500" : "text-stone-400"
      }`}
    >
      {isFav ? "♥" : "♡"}
    </button>
  );
};

export default Addtofav;
