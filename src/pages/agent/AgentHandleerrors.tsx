interface AgentHandleerrorsProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
}

const AgentHandleerrors = ({
  title = "Something Went Wrong",
  message = "We couldn't load this information. Check your connection or try refreshing the page.",
  onRetry,
}: AgentHandleerrorsProps) => {
  return (
    <div className="flex min-h-[50vh] items-center justify-center px-4 py-8 text-stone-900">
      <div className="w-full max-w-md rounded-2xl border border-rose-200 bg-white p-8 text-center shadow-sm space-y-4">

        {/* Status Code / Sub-tag */}
        <p className="text-xs font-semibold uppercase tracking-wider text-rose-600">
          System Notice
        </p>

        {/* Title */}
        <h2 className="text-2xl font-bold tracking-tight">
          {title}
        </h2>

        {/* Message */}
        <p className="text-sm leading-relaxed text-stone-500">
          {message}
        </p>

        {/* Retry Button */}
        {onRetry && (
          <button
            type="button"
            onClick={onRetry}
            className="w-full rounded-xl bg-amber-800 py-3 text-xs font-semibold uppercase tracking-wider text-white transition hover:bg-amber-900 cursor-pointer"
          >
            Try Again ↺
          </button>
        )}
      </div>
    </div>
  );
};

export default AgentHandleerrors;
