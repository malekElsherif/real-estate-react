
interface AgentHandleerrorsProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
}

const FontImports = () => (
  <style>{`@import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,400;9..144,500;9..144,600;9..144,700&family=IBM+Plex+Mono:wght@400;500&display=swap');`}</style>
);

const serif = "[font-family:'Fraunces',serif]";
const mono = "[font-family:'IBM_Plex_Mono',monospace]";

const AgentHandleerrors = ({
  title = "Something Went Wrong",
  message = "We couldn't load this information. Check your connection or try refreshing the page.",
  onRetry,
}: AgentHandleerrorsProps) => {
  return (
    <div className="flex min-h-[50vh] items-center justify-center px-4 py-8">
      <FontImports />

      <div className="relative w-full max-w-md border border-[#B8452E] bg-[#FFFDF9] p-8 text-center shadow-sm">
        {/* Corner Registration Marks */}
        <span className="pointer-events-none absolute -left-px -top-px h-2.5 w-2.5 border-l-[1.5px] border-t-[1.5px] border-[#B8452E]" />
        <span className="pointer-events-none absolute -right-px -top-px h-2.5 w-2.5 border-r-[1.5px] border-t-[1.5px] border-[#B8452E]" />

        {/* Status Code / Sub-tag */}
        <p className={`${mono} text-xs font-medium uppercase tracking-[0.25em] text-[#B8452E]`}>
          System Notice
        </p>

        {/* Title */}
        <h2 className={`${serif} mt-3 text-2xl font-semibold text-[#14213D]`}>
          {title}
        </h2>

        {/* Message */}
        <p className="mt-2 text-sm leading-relaxed text-[#4A5568]">
          {message}
        </p>

        {/* Retry Button */}
        {onRetry && (
          <button
            type="button"
            onClick={onRetry}
            className={`${mono} mt-6 w-full border border-[#14213D] bg-[#14213D] px-6 py-3 text-xs font-semibold uppercase tracking-widest text-[#F7F5EF] transition-colors duration-150 hover:border-[#B8863B] hover:bg-[#B8863B]`}
          >
            Try Again ↺
          </button>
        )}
      </div>
    </div>
  );
};

export default AgentHandleerrors;
