import { useCallback, useEffect, useLayoutEffect, useState } from "react";

/**
 * Shared brand tokens for the admin area
 * navy  #14213D  -> primary / dark base
 * ink   #0B1426  -> admin console chrome (sidebar / top strip)
 * cream #FFFDF9  -> website background (admin pages are re-tinted, see below)
 * gold  #B8863B  -> accent / CTA
 * line  #E4DFD3  -> hairline borders
 * green #5B7B65  -> positive      red #B8452E -> destructive
 */

/* ---------- Appearance (dark theme, text size, reduced motion) ----------
 * The attributes below are set on <html> only while the admin console is mounted,
 * so the public website is never affected. Using <html> (not .admin-shell) also
 * lets MUI dialogs, which render in a portal outside the shell, follow the theme.
 * Dark mode remaps the Tailwind arbitrary colour classes used across the admin area.
 */
const DK = 'html[data-admin-theme="dark"]';
const INK = "233,228,214";

const sel = (cls: string, hover = false) =>
  `${DK} [class~="${cls}"]${hover ? ":hover" : ""}`;

const rule = (classes: string[], decl: string, hover = false) =>
  `${classes.map((c) => sel(c, hover)).join(",")}{${decl} !important}`;

/* Matches a class token that STARTS with `prefix` (so variants like hover:… are not caught) */
const has = (prefix: string) =>
  `${DK} [class^="${prefix}"],${DK} [class*=" ${prefix}"]`;

const fb = (prefixes: string[], decl: string) =>
  `${prefixes.map(has).join(",")}{${decl} !important}`;

const NAMED = ["gray", "slate", "stone", "zinc", "neutral"];

const TEXT_ALPHA: Record<number, number> = { 60: 0.6, 55: 0.55, 50: 0.5, 45: 0.45, 40: 0.4 };
const BORDER_ALPHA: Record<number, number> = { 15: 0.14, 20: 0.2, 25: 0.26, 30: 0.32 };

const DARK_CSS = [
  `${DK}{color-scheme:dark}`,
  `${DK} .admin-shell{background-color:#0C1324;color:#E9E4D6}`,
  `${DK} .adm-topbar{background:#0F1830;border-bottom-color:rgba(${INK},0.12)}`,
  `${DK} .admin-shell a{color:inherit}`,
  `${DK} .admin-shell a[class~="text-[#FFFDF9]"]{color:#FFFDF9}`,

  /* fallbacks for light colours not listed below (placed first so the specific rules win) */
  fb(
    [
      "bg-white/",
      "bg-[#F",
      "bg-[#f",
      "bg-[#E",
      "bg-[#e",
      "bg-[#D",
      "bg-[#d",
      ...NAMED.map((n) => `bg-${n}-`),
    ],
    "background-color:#17223B"
  ),
  fb(["text-black", ...NAMED.map((n) => `text-${n}-`)], "color:#C9D0DE"),
  /* hover states: light hover backgrounds / dark hover text would hide the (now light) text */
  `${[
    "hover:bg-white",
    "hover:bg-[#F",
    "hover:bg-[#f",
    "hover:bg-[#E",
    "hover:bg-[#e",
    "hover:bg-[#D",
    "hover:bg-[#d",
    ...NAMED.map((n) => `hover:bg-${n}-`),
  ]
    .map((p) => `${DK} [class*="${p}"]:hover`)
    .join(",")}{background-color:#22345C !important}`,
  `${[
    "hover:text-black",
    "hover:text-[#0",
    "hover:text-[#1",
    ...NAMED.map((n) => `hover:text-${n}-`),
  ]
    .map((p) => `${DK} [class*="${p}"]:hover`)
    .join(",")}{color:#FFFDF9 !important}`,
  `${DK} .MuiButton-root:hover,${DK} .MuiIconButton-root:hover{color:#FFFDF9}`,
  fb(
    ["border-white", ...NAMED.map((n) => `border-${n}-`)],
    `border-color:rgba(${INK},0.16)`
  ),
  `${DK} [style*="color: rgb(20, 33, 61)"]{color:#E9E4D6 !important}`,
  `${DK} [style*="background: rgb(255, 255, 255)"],${DK} [style*="background-color: rgb(255, 255, 255)"],${DK} [style*="background: rgb(255, 253, 249)"],${DK} [style*="background-color: rgb(255, 253, 249)"]{background-color:#17223B !important}`,

  /* backgrounds */
  rule(["bg-white"], "background-color:#17223B"),
  rule(["bg-[#FFFDF9]"], "background-color:#111A2E"),
  rule(["bg-[#14213D]"], "background-color:#22345C"),
  rule(["hover:bg-[#14213D]"], "background-color:#22345C", true),
  rule(["bg-[#14213D]/10"], `background-color:rgba(${INK},0.08)`),
  rule(["hover:bg-[#EFEAE0]/30"], `background-color:rgba(${INK},0.05)`, true),

  /* text */
  rule(["text-[#14213D]"], "color:#E9E4D6"),
  ...Object.entries(TEXT_ALPHA).map(([n, a]) =>
    rule([`text-[#14213D]/${n}`], `color:rgba(${INK},${a})`)
  ),
  rule(["text-[#4A5568]"], "color:#A4ADBF"),
  rule(["text-[#B8863B]"], "color:#D4A24F"),
  rule(["text-[#5B7B65]"], "color:#7FA58B"),
  rule(["text-[#B8452E]"], "color:#E0705A"),
  rule(["hover:text-[#14213D]"], "color:#FFFDF9", true),
  rule(["hover:text-[#B8863B]"], "color:#F0C97A", true),
  rule(["hover:text-[#FFFDF9]", "hover:text-white"], "color:#FFFDF9", true),
  `${DK} [class~="placeholder-[#4A5568]"]::placeholder{color:#7C879B}`,

  /* borders */
  rule(["border-[#E4DFD3]"], `border-color:rgba(${INK},0.14)`),
  rule(["border-[#14213D]"], `border-color:rgba(${INK},0.28)`),
  rule(["hover:border-[#14213D]"], `border-color:rgba(${INK},0.6)`, true),
  ...Object.entries(BORDER_ALPHA).map(([n, a]) =>
    rule([`border-[#14213D]/${n}`], `border-color:rgba(${INK},${a})`)
  ),
  `${DK} [class~="divide-[#E4DFD3]"] > * + *{border-color:rgba(${INK},0.14)}`,

  /* MUI dialogs (portal) */
  `${DK} .MuiDialog-paper{background-color:#131D33 !important;border-color:rgba(${INK},0.3) !important;color:#E9E4D6}`,
  `${DK} .MuiDialogTitle-root{color:#FFFDF9 !important;border-color:rgba(${INK},0.14) !important}`,
  `${DK} .MuiDialogContent-root{background-color:#131D33 !important}`,
  `${DK} .MuiDialogContent-root .MuiTypography-root{color:#E9E4D6}`,
  `${DK} .MuiDialogActions-root{border-color:rgba(${INK},0.14) !important}`,
  `${DK} .MuiDialogActions-root .MuiButton-text{color:#E9E4D6 !important;border-color:rgba(${INK},0.4) !important}`,
  `${DK} .MuiCard-root{background-color:#17223B !important;border-color:rgba(${INK},0.14) !important}`,
  `${DK} .MuiAlert-root{background-color:#2B1A1C !important}`,

  /* MUI surfaces used outside dialogs (tables, menus, inputs) */
  `${DK} .MuiPaper-root{background-color:#17223B;color:#E9E4D6}`,
  `${DK} .MuiTableCell-root{color:#E9E4D6;border-color:rgba(${INK},0.14)}`,
  `${DK} .MuiTableHead-root .MuiTableCell-root{background-color:#22345C;color:#FFFDF9}`,
  `${DK} .MuiInputBase-root,${DK} .MuiMenuItem-root,${DK} .MuiFormLabel-root{color:#E9E4D6}`,
  `${DK} .MuiOutlinedInput-notchedOutline{border-color:rgba(${INK},0.3)}`,
  `${DK} .MuiDataGrid-root{color:#E9E4D6;background-color:#17223B;border-color:rgba(${INK},0.14)}`,

  /* rc-pagination */
  `${DK} .rc-pagination-item-active{background-color:#22345C !important;border-color:rgba(${INK},0.4) !important;color:#FFFDF9 !important}`,
].join("\n");

const APPEARANCE_CSS = `
    .adm-topbar { background: #FFFFFF; border-bottom: 1px solid rgba(20,33,61,0.12); }
    .admin-shell a { text-decoration: none; }

    html[data-admin-font="sm"] { font-size: 14px; }
    html[data-admin-font="lg"] { font-size: 18px; }

    html[data-admin-motion="reduced"] *:not(.animate-spin),
    html[data-admin-motion="reduced"] *:not(.animate-spin)::before,
    html[data-admin-motion="reduced"] *:not(.animate-spin)::after {
      transition-duration: 0.01ms !important;
      animation-duration: 0.01ms !important;
      animation-iteration-count: 1 !important;
      scroll-behavior: auto !important;
    }

    ${DARK_CSS}
`;

export const BrandStyles = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,400;9..144,600;9..144,700&family=IBM+Plex+Mono:wght@400;500;600&display=swap');

    .brand-root { font-family: 'IBM Plex Mono', ui-monospace, monospace; }
    .font-heading { font-family: 'Fraunces', Georgia, serif; letter-spacing: -0.01em; }
    .font-data { font-family: 'IBM Plex Mono', ui-monospace, monospace; }
    .eyebrow {
      font-family: 'IBM Plex Mono', ui-monospace, monospace;
      font-size: 0.65rem;
      letter-spacing: 0.16em;
      text-transform: uppercase;
    }

    /* ---------- Admin "console" look: cool grey canvas instead of the website's cream ---------- */
    .admin-shell { background-color: #EEF1F5; }
    .admin-shell [class~="bg-[#FFFDF9]"] { background-color: #EEF1F5; }

    /* Compact tables (Settings -> Interface) */
    .admin-compact table td,
    .admin-compact table th { padding-top: 0.5rem !important; padding-bottom: 0.5rem !important; }

    /* ---------- Sidebar (plain CSS so it never depends on Tailwind scanning) ---------- */
    .adm-side {
      display: flex; flex-direction: column; height: 100%; width: 100%;
      color: #E9E4D6;
      background-color: #0B1426;
      border-right: 1px solid rgba(184,134,59,0.45);
      font-family: 'IBM Plex Mono', ui-monospace, monospace;
    }
    .adm-side-brand {
      display: flex; align-items: center; gap: 0.75rem;
      padding: 1.25rem 1.5rem;
      border-bottom: 1px solid rgba(233,228,214,0.12);
    }
    .adm-side-mark {
      width: 2.5rem; height: 2.5rem; flex-shrink: 0;
      display: flex; align-items: center; justify-content: center;
      background: #B8863B; color: #0B1426;
      font-family: 'Fraunces', Georgia, serif; font-weight: 700; font-size: 1.35rem;
    }
    .adm-side-title {
      font-family: 'Fraunces', Georgia, serif; font-weight: 600;
      font-size: 1.05rem; line-height: 1.1; color: #FFFDF9; white-space: nowrap;
    }
    .adm-side-sub {
      margin-top: 0.3rem; font-size: 0.6rem; letter-spacing: 0.18em;
      text-transform: uppercase; color: #B8863B; white-space: nowrap;
    }
    .adm-side-nav { flex: 1; overflow-y: auto; padding: 1.25rem 1rem; }
    .adm-side-group {
      font-size: 0.6rem; letter-spacing: 0.2em; text-transform: uppercase;
      color: #B8863B; padding: 0 0.75rem; margin: 1.6rem 0 0.5rem;
    }
    .adm-side-nav > div:first-child .adm-side-group { margin-top: 0; }
    .adm-link {
      display: flex; align-items: center; gap: 0.75rem; width: 100%;
      padding: 0.7rem 0.75rem; margin-bottom: 2px;
      border: 0; border-left: 3px solid transparent; background: transparent;
      color: rgba(233,228,214,0.78);
      font: inherit; font-size: 0.72rem; letter-spacing: 0.08em; text-transform: uppercase;
      text-align: left; cursor: pointer; transition: all 0.15s ease;
    }
    .adm-link:hover {
      background: rgba(233,228,214,0.07); color: #FFFDF9;
      border-left-color: rgba(184,134,59,0.6);
    }
    .adm-link-active {
      background: rgba(184,134,59,0.18); color: #F0C97A; border-left-color: #B8863B;
    }
    .adm-link-no { width: 1.25rem; font-size: 0.62rem; color: rgba(233,228,214,0.4); }
    .adm-link-active .adm-link-no { color: #B8863B; }
    .adm-side-foot { padding: 1rem; border-top: 1px solid rgba(233,228,214,0.12); }
    .adm-chip {
      display: flex; align-items: center; gap: 0.75rem;
      padding: 0.75rem; margin-bottom: 0.75rem;
      background: rgba(233,228,214,0.07);
    }
    .adm-chip-avatar {
      width: 2rem; height: 2rem; flex-shrink: 0;
      display: flex; align-items: center; justify-content: center;
      border: 1px solid #B8863B; color: #B8863B;
      font-family: 'Fraunces', Georgia, serif; font-weight: 600;
    }
    .adm-chip-name { font-size: 0.75rem; color: #FFFDF9; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
    .adm-chip-role { font-size: 0.58rem; letter-spacing: 0.18em; text-transform: uppercase; color: #B8863B; }
    .adm-back {
      display: block; width: 100%; padding: 0.75rem 1rem; cursor: pointer;
      border: 1px solid rgba(233,228,214,0.25); background: transparent;
      color: rgba(233,228,214,0.85); font: inherit; font-size: 0.68rem;
      letter-spacing: 0.12em; text-transform: uppercase; transition: all 0.15s ease;
    }
    .adm-back:hover { border-color: #B8863B; color: #F0C97A; }

    ${APPEARANCE_CSS}
  `}</style>
);

/* ---------- Admin preferences (stored on this device, used by layout + Settings) ---------- */
export type ThemeMode = "light" | "dark" | "system";
export type FontScale = "sm" | "md" | "lg";

export type AdminPrefs = {
  sidebarOpen: boolean; // sidebar open when the console loads (desktop)
  compact: boolean; // tighter table rows
  theme: ThemeMode; // light / dark / follow the device
  fontScale: FontScale; // console text size
  reduceMotion: boolean; // disable transitions and animations
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
    return raw
      ? { ...DEFAULT_ADMIN_PREFS, ...JSON.parse(raw) }
      : DEFAULT_ADMIN_PREFS;
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
    const next = { ...readAdminPrefs(), ...patch };
    try {
      localStorage.setItem(PREFS_KEY, JSON.stringify(next));
    } catch {
      /* storage unavailable: still update the UI below */
    }
    window.dispatchEvent(new Event(PREFS_EVENT));
  }, []);

  return [prefs, update] as const;
};

/**
 * Applies theme / text size / motion prefs to <html> while the admin console is mounted.
 * Everything is removed on unmount so the public website keeps its own look.
 */
export const useApplyAdminAppearance = (prefs: AdminPrefs) => {
  useLayoutEffect(() => {
    const root = document.documentElement;
    const media = window.matchMedia("(prefers-color-scheme: dark)");

    const applyTheme = () => {
      const dark =
        prefs.theme === "dark" || (prefs.theme === "system" && media.matches);
      root.setAttribute("data-admin-theme", dark ? "dark" : "light");
    };

    applyTheme();
    media.addEventListener("change", applyTheme);

    root.setAttribute("data-admin-font", prefs.fontScale);

    if (prefs.reduceMotion) root.setAttribute("data-admin-motion", "reduced");
    else root.removeAttribute("data-admin-motion");

    return () => {
      media.removeEventListener("change", applyTheme);
      root.removeAttribute("data-admin-theme");
      root.removeAttribute("data-admin-font");
      root.removeAttribute("data-admin-motion");
    };
  }, [prefs.theme, prefs.fontScale, prefs.reduceMotion]);
};

/* ---------- Buttons (compose with btnPad / btnPadSm) ---------- */
export const btnPad = "px-4 py-2.5";
export const btnPadSm = "px-3 py-2";

const btnBase =
  "eyebrow font-semibold transition disabled:cursor-not-allowed disabled:opacity-50";

export const btnPrimary = `${btnBase} bg-[#B8863B] text-white hover:bg-[#a37632]`;
export const btnDark = `${btnBase} bg-[#14213D] text-[#FFFDF9] hover:bg-[#B8863B]`;
export const btnSuccess = `${btnBase} bg-[#5B7B65] text-[#FFFDF9] hover:bg-[#4a6652]`;
export const btnOutline = `${btnBase} border border-[#14213D] text-[#14213D] hover:bg-[#14213D] hover:text-[#FFFDF9]`;
export const btnGold = `${btnBase} border border-[#B8863B] text-[#B8863B] hover:bg-[#B8863B] hover:text-white`;
export const btnDanger = `${btnBase} border border-[#B8452E] text-[#B8452E] hover:bg-[#B8452E] hover:text-[#FFFDF9]`;
export const btnDangerSolid = `${btnBase} bg-[#B8452E] text-[#FFFDF9] hover:bg-[#9c3a26]`;

/* ---------- Form controls ---------- */
export const inputClass =
  "font-data w-full border border-[#E4DFD3] bg-[#FFFDF9] px-4 py-2.5 text-xs text-[#14213D] placeholder-[#4A5568] outline-none transition focus:border-[#14213D]";

/* ---------- Roles ---------- */
export const roleBadgeClass = (role?: string) =>
  role === "ADMIN"
    ? "border-[#14213D] bg-[#14213D] text-[#FFFDF9]"
    : role === "AGENT"
    ? "border-[#B8863B] bg-[#B8863B]/10 text-[#B8863B]"
    : "border-[#14213D]/30 text-[#14213D]";

export const roleAvatarClass = (role?: string) =>
  role === "ADMIN"
    ? "bg-[#14213D] text-[#FFFDF9]"
    : role === "AGENT"
    ? "bg-[#B8863B] text-white"
    : "bg-[#14213D]/10 text-[#14213D]";

export const roleLabel = (role?: string) =>
  role === "AGENT"
    ? "Estate Agent"
    : role === "ADMIN"
    ? "Platform Admin"
    : "Registered Client";

/* ---------- Status pills ---------- */
export const activePill =
  "eyebrow inline-flex items-center gap-2 border border-[#5B7B65] bg-[#5B7B65]/10 px-2.5 py-1 font-semibold text-[#5B7B65]";
export const inactivePill =
  "eyebrow inline-flex items-center gap-2 border border-[#B8452E] bg-[#B8452E]/10 px-2.5 py-1 font-semibold text-[#B8452E]";

/* ---------- Pagination (rc-pagination) ---------- */
export const paginationClass =
  "flex gap-2 text-xs font-medium cursor-pointer [&_.rc-pagination-item]:px-3 [&_.rc-pagination-item]:py-1 [&_.rc-pagination-item]:border [&_.rc-pagination-item]:border-[#E4DFD3] [&_.rc-pagination-item:hover]:border-[#14213D] [&_.rc-pagination-item-active]:bg-[#14213D] [&_.rc-pagination-item-active]:text-[#FFFDF9] [&_.rc-pagination-item-active]:border-[#14213D]";
