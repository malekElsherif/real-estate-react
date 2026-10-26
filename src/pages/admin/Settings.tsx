import { useNavigate } from "react-router-dom";
import { usegetme } from "../../hooks/useUsers";
import {
  DEFAULT_ADMIN_PREFS,
  roleBadgeClass,
  useAdminPrefs,
  type AdminPrefs,
  type FontScale,
  type ThemeMode,
} from "./adminBrand";

/* ---------- Toggle ---------- */
type ToggleProps = {
  checked: boolean;
  onChange: (value: boolean) => void;
  label: string;
};

const Toggle = ({ checked, onChange, label }: ToggleProps) => (
  <button
    type="button"
    role="switch"
    aria-checked={checked}
    aria-label={label}
    onClick={() => onChange(!checked)}
    className={`relative h-6 w-11 shrink-0 rounded-full transition-colors ${
      checked ? "bg-amber-600" : "bg-stone-300"
    }`}
  >
    <span
      className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow-sm transition-all ${
        checked ? "left-5.5" : "left-0.5"
      }`}
    />
  </button>
);

type ToggleKey = "sidebarOpen" | "compact" | "reduceMotion";

type ToggleRowProps = {
  title: string;
  text: string;
  checked: boolean;
  onChange: (value: boolean) => void;
};

const ToggleRow = ({ title, text, checked, onChange }: ToggleRowProps) => (
  <div className="flex items-center justify-between gap-6 py-5">
    <div>
      <p className="text-sm font-bold text-stone-900">{title}</p>
      <p className="mt-1 text-xs leading-relaxed text-stone-500">{text}</p>
    </div>
    <Toggle label={title} checked={checked} onChange={onChange} />
  </div>
);

/* ---------- Theme picker ---------- */
const THEME_OPTIONS: { value: ThemeMode; label: string; text: string }[] = [
  { value: "light", label: "Light", text: "Bright console on a cool grey canvas." },
  { value: "dark", label: "Dark", text: "Low-glare console for long sessions." },
  { value: "system", label: "System", text: "Match your device setting automatically." },
];

const Swatch = ({ bg, card, line }: { bg: string; card: string; line: string }) => (
  <div
    className="flex h-16 w-full overflow-hidden rounded-xl"
    style={{ background: bg, border: `1px solid ${line}` }}
  >
    <div style={{ width: "22%", background: "#1c1917" }} />
    <div className="flex flex-1 flex-col gap-1.5 p-2">
      <div style={{ height: 6, width: "55%", background: "#d97706" }} />
      <div style={{ flex: 1, background: card, border: `1px solid ${line}` }} />
    </div>
  </div>
);

const ThemePreview = ({ mode }: { mode: ThemeMode }) =>
  mode === "system" ? (
    <div className="grid grid-cols-2 gap-1">
      <Swatch bg="#f5f5f4" card="#ffffff" line="#e7e5e4" />
      <Swatch bg="#0c0a09" card="#1c1917" line="#292524" />
    </div>
  ) : (
    <Swatch
      bg={mode === "dark" ? "#0c0a09" : "#f5f5f4"}
      card={mode === "dark" ? "#1c1917" : "#ffffff"}
      line={mode === "dark" ? "#292524" : "#e7e5e4"}
    />
  );

/* ---------- Text size ---------- */
const FONT_OPTIONS: { value: FontScale; label: string }[] = [
  { value: "sm", label: "Small" },
  { value: "md", label: "Default" },
  { value: "lg", label: "Large" },
];

/* ---------- Page ---------- */
const Settings = () => {
  const navigate = useNavigate();
  const [prefs, updatePrefs] = useAdminPrefs();

  const { data: meData, isLoading, isError } = usegetme();
  const me = meData?.data ?? meData;

  const profileFields = [
    { label: "Full Name", value: me?.name || "—" },
    { label: "Email Address", value: me?.email || "—", breakAll: true },
    { label: "Account ID", value: me?.id != null ? `#${me.id}` : "—" },
  ];

  const appearanceRows: { key: ToggleKey; title: string; text: string }[] = [
    {
      key: "compact",
      title: "Compact tables",
      text: "Use tighter row spacing in every table to fit more records on screen.",
    },
    {
      key: "reduceMotion",
      title: "Reduce motion",
      text: "Turn off transitions and animations across the console.",
    },
  ];

  const behaviorRows: { key: ToggleKey; title: string; text: string }[] = [
    {
      key: "sidebarOpen",
      title: "Open sidebar on start",
      text: "Keep the navigation sidebar open when the console loads on desktop.",
    },
  ];

  const setToggle = (key: ToggleKey, value: boolean) =>
    updatePrefs({ [key]: value } as Partial<AdminPrefs>);

  return (
    <div className="min-h-screen bg-stone-50 pb-16 text-stone-900">
      <header className="bg-stone-900 text-stone-50">
        <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
          <p className="text-xs uppercase tracking-widest text-amber-600 font-medium">System</p>
          <h1 className="mt-2 text-3xl font-bold sm:text-4xl">Settings</h1>
          <p className="mt-2 text-xs text-stone-400">Your administrator profile and console preferences.</p>
        </div>
      </header>

      <main className="mx-auto max-w-4xl px-4 pt-10 sm:px-6 lg:px-8 space-y-6">
        {/* Profile */}
        <section className="rounded-2xl border border-stone-200 bg-white p-7 shadow-sm">
          <div className="flex flex-wrap items-start justify-between gap-3 border-b border-stone-200 pb-5">
            <div>
              <h2 className="text-xl font-bold text-stone-900">Profile</h2>
              <p className="mt-1 text-[10px] uppercase tracking-wider text-stone-500 font-semibold">Signed-in administrator</p>
            </div>
            <span className={`rounded-lg border px-2.5 py-1 text-[10px] font-semibold uppercase ${roleBadgeClass(me?.role || "ADMIN")}`}>
              {me?.role || "ADMIN"}
            </span>
          </div>

          {isLoading ? (
            <p className="mt-6 text-xs text-stone-500">Loading profile...</p>
          ) : isError ? (
            <p className="mt-6 text-xs text-red-600">Failed to load your profile.</p>
          ) : (
            <div className="mt-6 grid gap-4 sm:grid-cols-3">
              {profileFields.map((field) => (
                <div key={field.label} className="rounded-xl border border-stone-200 bg-stone-50 p-5">
                  <p className="text-[10px] uppercase tracking-wider text-stone-500 font-semibold">{field.label}</p>
                  <p className={`mt-2 text-sm font-bold text-stone-900 ${field.breakAll ? "break-all" : ""}`}>
                    {field.value}
                  </p>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Appearance */}
        <section className="rounded-2xl border border-stone-200 bg-white p-7 shadow-sm">
          <div className="border-b border-stone-200 pb-5">
            <h2 className="text-xl font-bold text-stone-900">Appearance</h2>
            <p className="mt-1 text-[10px] uppercase tracking-wider text-stone-500 font-semibold">Saved automatically on this device</p>
          </div>

          {/* Theme */}
          <div className="border-b border-stone-200 py-5">
            <p className="text-sm font-bold text-stone-900">Theme</p>
            <p className="mt-1 text-xs leading-relaxed text-stone-500">
              Choose how the admin console looks. The public website is not affected.
            </p>

            <div role="radiogroup" aria-label="Theme" className="mt-4 grid gap-3 sm:grid-cols-3">
              {THEME_OPTIONS.map((option) => {
                const active = prefs.theme === option.value;
                return (
                  <button
                    key={option.value}
                    type="button"
                    role="radio"
                    aria-checked={active}
                    onClick={() => updatePrefs({ theme: option.value })}
                    className={`rounded-xl border p-4 text-left transition ${
                      active ? "border-amber-600 bg-amber-50/50 ring-1 ring-amber-600" : "border-stone-200 bg-white hover:border-stone-900"
                    }`}
                  >
                    <ThemePreview mode={option.value} />
                    <div className="mt-3 flex items-center justify-between gap-2">
                      <span className="text-sm font-bold text-stone-900">{option.label}</span>
                      {active && <span className="text-[10px] uppercase tracking-wider font-semibold text-amber-700">Selected</span>}
                    </div>
                    <p className="mt-1 text-xs text-stone-500 leading-relaxed">{option.text}</p>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Text size */}
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-stone-200 py-5">
            <div>
              <p className="text-sm font-bold text-stone-900">Text size</p>
              <p className="mt-1 text-xs leading-relaxed text-stone-500">Scale the text and spacing across the whole console.</p>
            </div>

            <div role="group" aria-label="Text size" className="inline-flex rounded-xl border border-stone-200 overflow-hidden">
              {FONT_OPTIONS.map((option) => {
                const active = prefs.fontScale === option.value;
                return (
                  <button
                    key={option.value}
                    type="button"
                    aria-pressed={active}
                    onClick={() => updatePrefs({ fontScale: option.value })}
                    className={`px-4 py-2.5 text-xs font-semibold uppercase tracking-wider transition ${
                      active ? "bg-stone-900 text-stone-50" : "bg-white text-stone-600 hover:text-stone-900"
                    }`}
                  >
                    {option.label}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="divide-y divide-stone-100">
            {appearanceRows.map((row) => (
              <ToggleRow
                key={row.key}
                title={row.title}
                text={row.text}
                checked={prefs[row.key]}
                onChange={(value) => setToggle(row.key, value)}
              />
            ))}
          </div>
        </section>

        {/* Behavior */}
        <section className="rounded-2xl border border-stone-200 bg-white p-7 shadow-sm">
          <div className="border-b border-stone-200 pb-5">
            <h2 className="text-xl font-bold text-stone-900">Behavior</h2>
            <p className="mt-1 text-[10px] uppercase tracking-wider text-stone-500 font-semibold">How the console starts</p>
          </div>

          <div className="divide-y divide-stone-100">
            {behaviorRows.map((row) => (
              <ToggleRow
                key={row.key}
                title={row.title}
                text={row.text}
                checked={prefs[row.key]}
                onChange={(value) => setToggle(row.key, value)}
              />
            ))}
          </div>

          <div className="border-t border-stone-200 pt-5">
            <button
              type="button"
              onClick={() => updatePrefs(DEFAULT_ADMIN_PREFS)}
              className="rounded-xl border border-stone-300 bg-white px-4 py-2.5 text-xs font-semibold uppercase tracking-wider text-stone-900 hover:border-stone-900 transition"
            >
              Reset all preferences
            </button>
          </div>
        </section>

        {/* Quick links */}
        <section className="rounded-2xl border border-stone-200 bg-white p-7 shadow-sm">
          <div className="border-b border-stone-200 pb-5">
            <h2 className="text-xl font-bold text-stone-900">Navigation</h2>
            <p className="mt-1 text-[10px] uppercase tracking-wider text-stone-500 font-semibold">Jump to</p>
          </div>

          <div className="mt-6 flex flex-wrap gap-3">
            <button
              type="button"
              onClick={() => navigate("/admin/dashboard")}
              className="rounded-xl bg-stone-900 px-4 py-2.5 text-xs font-semibold uppercase tracking-wider text-stone-50 hover:bg-amber-800 transition"
            >
              Dashboard
            </button>

            <button
              type="button"
              onClick={() => navigate("/")}
              className="rounded-xl border border-stone-300 bg-white px-4 py-2.5 text-xs font-semibold uppercase tracking-wider text-stone-900 hover:border-stone-900 transition"
            >
              Back to website
            </button>
          </div>
        </section>
      </main>
    </div>
  );
};

export default Settings;
