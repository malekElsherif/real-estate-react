import { useCallback, useEffect, useLayoutEffect, useState } from "react";

/**
 * Admin brand (wood palette)
 * ink   #1C1410  sidebar / dark chrome      amber-800 #92400E  primary accent
 * stone #F5F5F4  console canvas             line      #E7E5E4  borders
 */

/* ---------- Dark theme ----------
 * Applied on <html> only while the admin console is mounted (so MUI portals follow it too).
 * Remaps the hard-coded colour classes still used by the older admin pages.
 */
const DK = 'html[data-admin-theme="dark"]';
const INK = "233,228,214";
const BG = { shell: "#1A1411", bar: "#1F1812", card: "#2A211B", soft: "#221A15", hover: "#3A2D24", dialog: "#241C17" };

const sel = (cls: string, hover = false) => `${DK} [class~="${cls}"]${hover ? ":hover" : ""}`;
const rule = (classes: string[], decl: string, hover = false) =>
  `${classes.map((c) => sel(c, hover)).join(",")}{${decl} !important}`;
const has = (prefix: string) => `${DK} [class^="${prefix}"],${DK} [class*=" ${prefix}"]`;
const fb = (prefixes: string[], decl: string) => `${prefixes.map(has).join(",")}{${decl} !important}`;
const hoverOf = (prefixes: string[]) => prefixes.map((p) => `${DK} [class*="${p}"]:hover`).join(",");

const NAMED = ["gray", "slate", "stone", "zinc", "neutral"];
const TEXT_ALPHA: Record<number, number> = { 60: 0.6, 55: 0.55, 50: 0.5, 45: 0.45, 40: 0.4 };
const BORDER_ALPHA: Record<number, number> = { 15: 0.14, 20: 0.2, 25: 0.26, 30: 0.32 };

const DARK_CSS = [
  `${DK}{color-scheme:dark}`,
  `${DK} .admin-shell{background-color:${BG.shell};color:#E9E4D6}`,
  `${DK} .adm-topbar{background:${BG.bar};border-bottom-color:rgba(${INK},0.12)}`,
  `${DK} .admin-shell a{color:inherit}`,
  `${DK} .admin-shell a[class~="text-white"]{color:#fff}`,

  /* fallbacks for light colours (first, so the specific rules below win) */
  fb(["bg-white/", "bg-[#F", "bg-[#f", "bg-[#E", "bg-[#e", "bg-[#D", "bg-[#d", ...NAMED.map((n) => `bg-${n}-`)], `background-color:${BG.card}`),
  fb(["text-black", ...NAMED.map((n) => `text-${n}-`)], "color:#C9D0DE"),
  `${hoverOf(["hover:bg-white", "hover:bg-[#F", "hover:bg-[#f", "hover:bg-[#E", "hover:bg-[#e", "hover:bg-[#D", "hover:bg-[#d", ...NAMED.map((n) => `hover:bg-${n}-`)])}{background-color:${BG.hover} !important}`,
  `${hoverOf(["hover:text-black", "hover:text-[#0", "hover:text-[#1", ...NAMED.map((n) => `hover:text-${n}-`)])}{color:#FFFDF9 !important}`,
  `${DK} .MuiButton-root:hover,${DK} .MuiIconButton-root:hover{color:#FFFDF9}`,
  fb(["border-white", ...NAMED.map((n) => `border-${n}-`)], `border-color:rgba(${INK},0.16)`),

  /* specific colours */
  rule(["bg-white"], `background-color:${BG.card}`),
  rule(["bg-[#FFFDF9]"], `background-color:${BG.soft}`),
  rule(["bg-[#14213D]"], `background-color:${BG.hover}`),
  rule(["hover:bg-[#14213D]"], `background-color:${BG.hover}`, true),
  rule(["bg-[#14213D]/10"], `background-color:rgba(${INK},0.08)`),
  rule(["hover:bg-[#EFEAE0]/30"], `background-color:rgba(${INK},0.05)`, true),
  rule(["text-[#14213D]"], "color:#E9E4D6"),
  ...Object.entries(TEXT_ALPHA).map(([n, a]) => rule([`text-[#14213D]/${n}`], `color:rgba(${INK},${a})`)),
  rule(["text-[#4A5568]"], "color:#B5AB9E"),
  rule(["text-[#B8863B]"], "color:#D4A24F"),
  rule(["text-[#5B7B65]"], "color:#7FA58B"),
  rule(["text-[#B8452E]"], "color:#E0705A"),
  rule(["hover:text-[#14213D]"], "color:#FFFDF9", true),
  rule(["hover:text-[#B8863B]"], "color:#F0C97A", true),
  rule(["hover:text-[#FFFDF9]", "hover:text-white"], "color:#FFFDF9", true),
  `${DK} [class~="placeholder-stone-400"]::placeholder,${DK} [class~="placeholder-[#4A5568]"]::placeholder{color:#8C8276}`,
  rule(["border-[#E4DFD3]"], `border-color:rgba(${INK},0.14)`),
  rule(["border-[#14213D]"], `border-color:rgba(${INK},0.28)`),
  rule(["hover:border-[#14213D]"], `border-color:rgba(${INK},0.6)`, true),
  ...Object.entries(BORDER_ALPHA).map(([n, a]) => rule([`border-[#14213D]/${n}`], `border-color:rgba(${INK},${a})`)),
  `${DK} [class~="divide-[#E4DFD3]"] > * + *{border-color:rgba(${INK},0.14)}`,
  `${DK} [style*="color: rgb(20, 33, 61)"]{color:#E9E4D6 !important}`,
  `${DK} [style*="background: rgb(255, 255, 255)"],${DK} [style*="background-color: rgb(255, 255, 255)"],${DK} [style*="background: rgb(255, 253, 249)"],${DK} [style*="background-color: rgb(255, 253, 249)"]{background-color:${BG.card} !important}`,

  /* MUI (dialogs render in a portal) */
  `${DK} .MuiDialog-paper{background-color:${BG.dialog} !important;border-color:rgba(${INK},0.3) !important;color:#E9E4D6}`,
  `${DK} .MuiDialogTitle-root{color:#FFFDF9 !important;border-color:rgba(${INK},0.14) !important}`,
  `${DK} .MuiDialogContent-root{background-color:${BG.dialog} !important}`,
  `${DK} .MuiDialogContent-root .MuiTypography-root{color:#E9E4D6}`,
  `${DK} .MuiDialogActions-root{border-color:rgba(${INK},0.14) !important}`,
  `${DK} .MuiDialogActions-root .MuiButton-text{color:#E9E4D6 !important;border-color:rgba(${INK},0.4) !important}`,
  `${DK} .MuiCard-root{background-color:${BG.card} !important;border-color:rgba(${INK},0.14) !important}`,
  `${DK} .MuiAlert-root{background-color:#2B1A1C !important}`,
  `${DK} .MuiPaper-root{background-color:${BG.card};color:#E9E4D6}`,
  `${DK} .MuiTableCell-root{color:#E9E4D6;border-color:rgba(${INK},0.14)}`,
  `${DK} .MuiTableHead-root .MuiTableCell-root{background-color:${BG.hover};color:#FFFDF9}`,
  `${DK} .MuiInputBase-root,${DK} .MuiMenuItem-root,${DK} .MuiFormLabel-root{color:#E9E4D6}`,
  `${DK} .MuiOutlinedInput-notchedOutline{border-color:rgba(${INK},0.3)}`,
  `${DK} .MuiDataGrid-root{color:#E9E4D6;background-color:${BG.card};border-color:rgba(${INK},0.14)}`,
  `${DK} .rc-pagination-item-active{background-color:${BG.hover} !important;border-color:rgba(${INK},0.4) !important;color:#FFFDF9 !important}`,
].join("\n");

/* ---------- Global admin styles (system fonts, no external imports) ---------- */
export const BrandStyles = () => (
  <style>{`
    .font-heading { font-weight: 600; letter-spacing: -0.01em; }
    .font-data { font-variant-numeric: tabular-nums; }
    .eyebrow { font-size: 0.7rem; font-weight: 600; letter-spacing: 0.06em; text-transform: uppercase; }

    /* console canvas */
    .admin-shell { background-color: #F5F5F4; }
    .admin-shell [class~="bg-[#FFFDF9]"] { background-color: #F5F5F4; }
    .admin-shell a { text-decoration: none; }
    .adm-topbar { background: #fff; border-bottom: 1px solid #E7E5E4; }

    .admin-compact table td, .admin-compact table th { padding-top: .5rem !important; padding-bottom: .5rem !important; }

    /* sidebar */
    .adm-side { display: flex; flex-direction: column; height: 100%; width: 100%; background: #1C1410; color: #E7E5E4; }
    .adm-side-brand { display: flex; align-items: center; gap: .75rem; padding: 1.25rem 1.5rem; border-bottom: 1px solid rgba(255,255,255,.08); }
    .adm-side-mark { display: grid; place-items: center; width: 2.5rem; height: 2.5rem; flex-shrink: 0; border-radius: .75rem; background: #92400E; color: #fff; font-weight: 700; font-size: 1.25rem; }
    .adm-side-title { font-weight: 600; font-size: 1rem; line-height: 1.1; color: #fff; white-space: nowrap; }
    .adm-side-sub { margin-top: .25rem; font-size: .7rem; color: #FCD34D; white-space: nowrap; }
    .adm-side-nav { flex: 1; overflow-y: auto; padding: 1rem; }
    .adm-side-group { margin: 1.5rem 0 .5rem; padding: 0 .75rem; font-size: .68rem; font-weight: 600; letter-spacing: .08em; text-transform: uppercase; color: rgba(231,229,228,.45); }
    .adm-side-nav > div:first-child .adm-side-group { margin-top: 0; }
    .adm-link { display: flex; align-items: center; gap: .75rem; width: 100%; margin-bottom: 2px; padding: .65rem .75rem; border: 0; border-radius: .75rem; background: transparent; color: rgba(231,229,228,.75); font: inherit; font-size: .875rem; text-align: left; cursor: pointer; transition: background .15s, color .15s; }
    .adm-link:hover { background: rgba(255,255,255,.07); color: #fff; }
    .adm-link-active { background: rgba(252,211,77,.14); color: #FCD34D; }
    .adm-link-no { width: 1.25rem; font-size: .7rem; color: rgba(231,229,228,.35); }
    .adm-link-active .adm-link-no { color: #FCD34D; }
    .adm-side-foot { padding: 1rem; border-top: 1px solid rgba(255,255,255,.08); }
    .adm-chip { display: flex; align-items: center; gap: .75rem; margin-bottom: .75rem; padding: .75rem; border-radius: .75rem; background: rgba(255,255,255,.06); }
    .adm-chip-avatar { display: grid; place-items: center; width: 2rem; height: 2rem; flex-shrink: 0; border-radius: 9999px; background: #92400E; color: #fff; font-weight: 600; }
    .adm-chip-name { overflow: hidden; text-overflow: ellipsis; white-space: nowrap; font-size: .875rem; color: #fff; }
    .adm-chip-role { font-size: .7rem; color: #FCD34D; }
    .adm-back { display: block; width: 100%; padding: .65rem 1rem; border: 1px solid rgba(255,255,255,.18); border-radius: .75rem; background: transparent; color: rgba(231,229,228,.85); font: inherit; font-size: .8rem; cursor: pointer; transition: all .15s; }
    .adm-back:hover { border-color: #FCD34D; color: #FCD34D; }

    /* text size + reduced motion prefs */
    html[data-admin-font="sm"] { font-size: 14px; }
    html[data-admin-font="lg"] { font-size: 18px; }
    html[data-admin-motion="reduced"] *:not(.animate-spin),
    html[data-admin-motion="reduced"] *:not(.animate-spin)::before,
    html[data-admin-motion="reduced"] *:not(.animate-spin)::after {
      transition-duration: .01ms !important; animation-duration: .01ms !important;
      animation-iteration-count: 1 !important; scroll-behavior: auto !important;
    }

    ${DARK_CSS}
  `}</style>
);

/* ---------- Admin preferences (stored on this device) ---------- */
export type ThemeMode = "light" | "dark" | "system";
export type FontScale = "sm" | "md" | "lg";

export type AdminPrefs = {
  sidebarOpen: boolean;
  compact: boolean;
  theme: ThemeMode;
  fontScale: FontScale;
  reduceMotion: boolean;
};

export const DEFAULT_ADMIN_PREFS: AdminPrefs = {
  sidebarOpen: true,
  compact: false,
  theme: "light",
  fontScale: "md",
  reduceMotion: false,
};

const PREFS_KEY = "admin-prefs";
const PREFS_EVENT = "admin-prefs-change";

export const readAdminPrefs = (): AdminPrefs => {
  try {
    const raw = localStorage.getItem(PREFS_KEY);
    return raw ? { ...DEFAULT_ADMIN_PREFS, ...JSON.parse(raw) } : DEFAULT_ADMIN_PREFS;
  } catch {
    return DEFAULT_ADMIN_PREFS;
  }
};

export const useAdminPrefs = () => {
  const [prefs, setPrefs] = useState<AdminPrefs>(readAdminPrefs);

  useEffect(() => {
    const sync = () => setPrefs(readAdminPrefs());
    window.addEventListener(PREFS_EVENT, sync);
    window.addEventListener("storage", sync);
    return () => {
      window.removeEventListener(PREFS_EVENT, sync);
      window.removeEventListener("storage", sync);
    };
  }, []);

  const update = useCallback((patch: Partial<AdminPrefs>) => {
    try {
      localStorage.setItem(PREFS_KEY, JSON.stringify({ ...readAdminPrefs(), ...patch }));
    } catch {
      /* storage unavailable */
    }
    window.dispatchEvent(new Event(PREFS_EVENT));
  }, []);

  return [prefs, update] as const;
};

/** Applies theme / text size / motion to <html> while the console is mounted; cleaned up on unmount. */
export const useApplyAdminAppearance = (prefs: AdminPrefs) => {
  useLayoutEffect(() => {
    const root = document.documentElement;
    const media = window.matchMedia("(prefers-color-scheme: dark)");

    const applyTheme = () => {
      const dark = prefs.theme === "dark" || (prefs.theme === "system" && media.matches);
      root.setAttribute("data-admin-theme", dark ? "dark" : "light");
    };

    applyTheme();
    media.addEventListener("change", applyTheme);
    root.setAttribute("data-admin-font", prefs.fontScale);
    if (prefs.reduceMotion) root.setAttribute("data-admin-motion", "reduced");
    else root.removeAttribute("data-admin-motion");

    return () => {
      media.removeEventListener("change", applyTheme);
      ["data-admin-theme", "data-admin-font", "data-admin-motion"].forEach((a) => root.removeAttribute(a));
    };
  }, [prefs.theme, prefs.fontScale, prefs.reduceMotion]);
};

/* ---------- Buttons (compose with btnPad / btnPadSm) ---------- */
export const btnPad = "px-4 py-2.5";
export const btnPadSm = "px-3 py-2";

const btnBase = "rounded-xl text-sm font-medium transition disabled:cursor-not-allowed disabled:opacity-50";

export const btnPrimary = `${btnBase} bg-amber-800 text-white hover:bg-amber-900`;
export const btnDark = `${btnBase} bg-stone-900 text-white hover:bg-amber-800`;
export const btnSuccess = `${btnBase} bg-emerald-700 text-white hover:bg-emerald-800`;
export const btnOutline = `${btnBase} border border-stone-300 text-stone-700 hover:bg-stone-100`;
export const btnGold = `${btnBase} border border-amber-800 text-amber-800 hover:bg-amber-800 hover:text-white`;
export const btnDanger = `${btnBase} border border-rose-600 text-rose-600 hover:bg-rose-600 hover:text-white`;
export const btnDangerSolid = `${btnBase} bg-rose-600 text-white hover:bg-rose-700`;

/* ---------- Form controls ---------- */
export const inputClass =
  "w-full rounded-xl border border-stone-200 bg-white px-4 py-2.5 text-sm text-stone-900 placeholder-stone-400 outline-none transition focus:border-amber-800 focus:ring-2 focus:ring-amber-800/20";

/* ---------- Roles ---------- */
export const roleBadgeClass = (role?: string) =>
  `rounded-full ${
    role === "ADMIN"
      ? "border-stone-900 bg-stone-900 text-white"
      : role === "AGENT"
      ? "border-amber-200 bg-amber-50 text-amber-800"
      : "border-stone-200 text-stone-600"
  }`;

export const roleAvatarClass = (role?: string) =>
  `rounded-full ${
    role === "ADMIN" ? "bg-stone-900 text-white" : role === "AGENT" ? "bg-amber-800 text-white" : "bg-stone-100 text-stone-700"
  }`;

export const roleLabel = (role?: string) =>
  role === "AGENT" ? "Estate Agent" : role === "ADMIN" ? "Platform Admin" : "Registered Client";

/* ---------- Status pills ---------- */
const pill = "inline-flex items-center gap-2 rounded-full px-2.5 py-1 text-xs font-medium";
export const activePill = `${pill} bg-emerald-50 text-emerald-700`;
export const inactivePill = `${pill} bg-rose-50 text-rose-700`;

/* ---------- Pagination (rc-pagination) ---------- */
export const paginationClass =
  "flex gap-1.5 text-sm font-medium cursor-pointer [&_.rc-pagination-item]:rounded-lg [&_.rc-pagination-item]:px-3 [&_.rc-pagination-item]:py-1 [&_.rc-pagination-item]:border [&_.rc-pagination-item]:border-stone-200 [&_.rc-pagination-item:hover]:border-amber-800 [&_.rc-pagination-item-active]:bg-amber-800 [&_.rc-pagination-item-active]:text-white [&_.rc-pagination-item-active]:border-amber-800";
