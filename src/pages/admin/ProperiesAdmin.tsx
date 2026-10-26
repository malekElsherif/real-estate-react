import { usegetmyfav } from "../../hooks/usefav";

type MyfavProps = {
  open: boolean;
  onClose: () => void;
};

const Myfav = ({ open, onClose }: MyfavProps) => {
  const { data, isPending: isLoading, isError } = usegetmyfav();
  const favorites = data?.data ?? [];

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-stone-950/60 backdrop-blur-sm p-4">
      <div className="w-full max-w-3xl rounded-2xl border border-stone-200 bg-white shadow-xl overflow-hidden flex flex-col max-h-[85vh]">

        {/* Header */}
        <div className="flex items-center justify-between bg-stone-900 px-6 py-4 text-stone-50">
          <div className="flex items-center gap-2">
            <span className="text-amber-500 text-lg">♡</span>
            <h3 className="text-lg font-bold">My Favorites</h3>
          </div>
          <button
            onClick={onClose}
            aria-label="close"
            className="text-stone-400 hover:text-amber-500 transition text-sm font-bold p-1"
          >
            ✕
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 bg-stone-50 min-h-[300px]">
          {isLoading && (
            <div className="flex min-h-[250px] items-center justify-center">
              <div className="h-8 w-8 animate-spin rounded-full border-2 border-stone-300 border-t-amber-800" />
            </div>
          )}

          {isError && (
            <div className="flex min-h-[250px] items-center justify-center">
              <p className="text-xs font-mono text-red-600">Failed to load your favorites.</p>
            </div>
          )}

          {!isLoading && !isError && favorites.length === 0 && (
            <div className="flex min-h-[250px] flex-col items-center justify-center text-center">
              <span className="text-4xl text-stone-300 mb-2">♡</span>
              <h4 className="text-xl font-bold text-stone-900">No favorites yet</h4>
              <p className="mt-1 text-xs text-stone-500 font-mono">
                Properties you add to favorites will appear here.
              </p>
            </div>
          )}

          {!isLoading && !isError && favorites.length > 0 && (
            <div className="grid gap-4 sm:grid-cols-2">
              {favorites.map((favorite: any) => {
                const property = favorite.property ?? favorite;

                return (
                  <div
                    key={favorite.id ?? property.id}
                    className="rounded-2xl border border-stone-200 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:border-amber-600 hover:shadow-md flex flex-col justify-between"
                  >
                    <div>
                      <h4 className="font-semibold text-stone-900 line-clamp-1 text-base">{property.title}</h4>
                      <p className="mt-1 text-xs text-stone-500 font-mono">{property.address}</p>
                    </div>

                    <div className="mt-4 flex items-center justify-between border-t border-stone-100 pt-4">
                      <span className="font-semibold text-amber-800 text-sm font-mono">
                        {property.price} EGP
                      </span>
                      <span className="text-amber-600 text-lg">♡</span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

export default Myfav;
