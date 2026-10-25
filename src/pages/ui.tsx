import { createPortal } from "react-dom";
import type { ReactNode } from "react";

// ---------- Shared button styles ----------
const base = "no-underline rounded-xl px-4 py-2 text-sm font-medium transition disabled:cursor-not-allowed disabled:opacity-50";
export const primary = `${base} bg-amber-800 text-white hover:bg-amber-900`;
export const ghost = `${base} border border-stone-200 bg-white text-stone-700 hover:bg-stone-50`;
export const danger = `${base} bg-rose-600 text-white hover:bg-rose-700`;

// ---------- Modal ----------
export const Modal = ({
  open, onClose, size = "max-w-md", children,
}: { open: boolean; onClose: () => void; size?: string; children: ReactNode }) =>
  open
    ? createPortal(
        <div onClick={onClose} className="fixed inset-0 z-50 grid place-items-center bg-stone-900/40 p-4 backdrop-blur-sm">
          <div onClick={(e) => e.stopPropagation()} className={`max-h-[90vh] w-full overflow-y-auto rounded-2xl bg-white p-6 shadow-xl ${size}`}>
            {children}
          </div>
        </div>,
        document.body
      )
    : null;

// ---------- Status badge ----------
const colors: Record<string, string> = {
  approved: "bg-emerald-50 text-emerald-700",
  pending: "bg-yellow-50 text-yellow-700",
  rejected: "bg-rose-50 text-rose-700",
  cancelled: "bg-stone-100 text-stone-600",
};
export const Badge = ({ status }: { status: string }) => (
  <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium capitalize ${colors[status] ?? colors.pending}`}>
    {status}
  </span>
);

// ---------- Pill tabs ----------
export const Tabs = <T extends string>({
  tabs, value, onChange,
}: { tabs: { id: T; label: string; count?: number }[]; value: T; onChange: (v: T) => void }) => (
  <div className="inline-flex flex-wrap gap-1 rounded-xl bg-stone-100 p-1">
    {tabs.map((t) => (
      <button
        key={t.id}
        type="button"
        onClick={() => onChange(t.id)}
        className={`rounded-lg px-4 py-1.5 text-sm font-medium transition ${
          value === t.id ? "bg-white text-stone-900 shadow-sm" : "text-stone-500 hover:text-stone-900"
        }`}
      >
        {t.label}
        {t.count !== undefined && <span className="ml-1.5 text-stone-400">{t.count}</span>}
      </button>
    ))}
  </div>
);
