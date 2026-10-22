import { useNavigate } from "react-router-dom";
import { usegetme } from "../../hooks/useUsers";
import {
  DEFAULT_ADMIN_PREFS,
  btnDark,
  btnOutline,
  btnPad,
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
    className={`relative h-6 w-11 shrink-0 border transition ${
      checked
        ? "border-[#B8863B] bg-[#B8863B]"
        : "border-[#14213D]/30 bg-[#14213D]/10"
    }`}
  >
    {/* inline colour so the knob stays white in dark mode too */}
    <span
      className={`absolute top-0.5 h-4 w-4 transition-all ${
        checked ? "left-6" : "left-0.5"
      }`}
      style={{ background: "#FFFFFF" }}
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
      <p className="text-sm font-semibold text-[#14213D]">{title}</p>
      <p className="mt-1 text-xs leading-relaxed text-[#4A5568]">{text}</p>
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

const LIGHT = { bg: "#EEF1F5", card: "#FFFFFF", line: "rgba(20,33,61,0.15)" };
const DARK = { bg: "#0C1324", card: "#17223B", line: "rgba(233,228,214,0.18)" };

const Swatch = ({ bg, card, line }: typeof LIGHT) => (
  <div
    className="flex h-16 w-full overflow-hidden"
    style={{ background: bg, border: `1px solid ${line}` }}
  >
    <div style={{ width: "22%", background: "#0B1426" }} />
    <div className="flex flex-1 flex-col gap-1.5 p-2">
      <div style={{ height: 6, width: "55%", background: "#B8863B" }} />
      <div style={{ flex: 1, background: card, border: `1px solid ${line}` }} />
    </div>
  </div>
);

const ThemePreview = ({ mode }: { mode: ThemeMode }) =>
  mode === "system" ? (
    <div className="grid grid-cols-2 gap-1">
      <Swatch {...LIGHT} />
      <Swatch {...DARK} />
    </div>
  ) : (
    <Swatch {...(mode === "dark" ? DARK : LIGHT)} />
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
    <div className="mx-auto max-w-4xl">
      {/* Title */}
      <div className="mb-8">
        <p className="eyebrow text-[#B8863B]">System</p>

        <h1 className="font-heading mt-2 text-3xl font-semibold text-[#14213D] sm:text-4xl">
          Settings
        </h1>

        <p className="mt-2 text-xs text-[#14213D]/60">
          Your administrator profile and console preferences.
        </p>

        <div className="mt-4 h-px w-16 bg-[#B8863B]" />
      </div>

      <div className="space-y-6">
        {/* Profile */}
        <section className="border border-[#14213D]/15 bg-white p-7">
          <div className="flex flex-wrap items-start justify-between gap-3 border-b border-[#E4DFD3] pb-5">
            <div>
              <h2 className="font-heading text-2xl font-semibold">Profile</h2>
              <p className="eyebrow mt-1 text-[#14213D]/45">
                Signed-in administrator
              </p>
            </div>

            <span
              className={`eyebrow border px-2.5 py-1 font-semibold ${roleBadgeClass(
                me?.role || "ADMIN"
              )}`}
            >
              {me?.role || "ADMIN"}
            </span>
          </div>

          {isLoading ? (
            <p className="mt-6 text-xs text-[#14213D]/60">Loading profile...</p>
          ) : isError ? (
            <p className="mt-6 text-xs text-[#B8452E]">
              Failed to load your profile.
            </p>
          ) : (
            <div className="mt-6 grid gap-4 sm:grid-cols-3">
              {profileFields.map((field) => (
                <div
                  key={field.label}
                  className="border border-[#E4DFD3] bg-[#FFFDF9] p-5"
                >
                  <p className="eyebrow text-[#14213D]/50">{field.label}</p>

                  <p
                    className={`mt-2 text-sm font-semibold text-[#14213D] ${
                      field.breakAll ? "break-all" : ""
                    }`}
                  >
                    {field.value}
                  </p>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Appearance */}
        <section className="border border-[#14213D]/15 bg-white p-7">
          <div className="border-b border-[#E4DFD3] pb-5">
            <h2 className="font-heading text-2xl font-semibold">Appearance</h2>
            <p className="eyebrow mt-1 text-[#14213D]/45">
              Saved automatically on this device
            </p>
          </div>

          {/* Theme */}
          <div className="border-b border-[#E4DFD3] py-5">
            <p className="text-sm font-semibold text-[#14213D]">Theme</p>
            <p className="mt-1 text-xs leading-relaxed text-[#4A5568]">
              Choose how the admin console looks. The public website is not affected.
            </p>

            <div
              role="radiogroup"
              aria-label="Theme"
              className="mt-4 grid gap-3 sm:grid-cols-3"
            >
              {THEME_OPTIONS.map((option) => {
                const active = prefs.theme === option.value;

                return (
                  <button
                    key={option.value}
                    type="button"
                    role="radio"
                    aria-checked={active}
                    onClick={() => updatePrefs({ theme: option.value })}
                    className={`border p-3 text-left transition ${
                      active
                        ? "border-[#B8863B] bg-[#B8863B]/10"
                        : "border-[#14213D]/15 bg-white hover:border-[#14213D]"
                    }`}
                  >
                    <ThemePreview mode={option.value} />

                    <div className="mt-3 flex items-center justify-between gap-2">
                      <span className="text-sm font-semibold text-[#14213D]">
                        {option.label}
                      </span>
                      {active && (
                        <span className="eyebrow font-semibold text-[#B8863B]">
                          Selected
                        </span>
                      )}
                    </div>

                    <p className="mt-1 text-xs leading-relaxed text-[#4A5568]">
                      {option.text}
                    </p>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Text size */}
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[#E4DFD3] py-5">
            <div>
              <p className="text-sm font-semibold text-[#14213D]">Text size</p>
              <p className="mt-1 text-xs leading-relaxed text-[#4A5568]">
                Scale the text and spacing across the whole console.
              </p>
            </div>

            <div
              role="group"
              aria-label="Text size"
              className="inline-flex border border-[#14213D]/25"
            >
              {FONT_OPTIONS.map((option, index) => {
                const active = prefs.fontScale === option.value;

                return (
                  <button
                    key={option.value}
                    type="button"
                    aria-pressed={active}
                    onClick={() => updatePrefs({ fontScale: option.value })}
                    className={`eyebrow px-4 py-2.5 font-semibold transition ${
                      index > 0 ? "border-l border-[#14213D]/25" : ""
                    } ${
                      active
                        ? "bg-[#14213D] text-[#FFFDF9]"
                        : "text-[#14213D]/60 hover:text-[#B8863B]"
                    }`}
                  >
                    {option.label}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="divide-y divide-[#E4DFD3]">
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
        <section className="border border-[#14213D]/15 bg-white p-7">
          <div className="border-b border-[#E4DFD3] pb-5">
            <h2 className="font-heading text-2xl font-semibold">Behavior</h2>
            <p className="eyebrow mt-1 text-[#14213D]/45">
              How the console starts
            </p>
          </div>

          <div className="divide-y divide-[#E4DFD3]">
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

          <div className="border-t border-[#E4DFD3] pt-5">
            <button
              type="button"
              onClick={() => updatePrefs(DEFAULT_ADMIN_PREFS)}
              className={`${btnPad} ${btnOutline}`}
            >
              Reset all preferences
            </button>
          </div>
        </section>

        {/* Quick links */}
        <section className="border border-[#14213D]/15 bg-white p-7">
          <div className="border-b border-[#E4DFD3] pb-5">
            <h2 className="font-heading text-2xl font-semibold">Navigation</h2>
            <p className="eyebrow mt-1 text-[#14213D]/45">Jump to</p>
          </div>

          <div className="mt-6 flex flex-wrap gap-3">
            <button
              type="button"
              onClick={() => navigate("/admin/dashboard")}
              className={`${btnPad} ${btnDark}`}
            >
              Dashboard
            </button>

            <button
              type="button"
              onClick={() => navigate("/")}
              className={`${btnPad} ${btnOutline}`}
            >
              Back to website
            </button>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Settings;
