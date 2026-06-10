export function DebugPreviewCard({ previewTheme, themeDebugOverride }) {
  return (
    <div className="mt-8 rounded-2xl bg-slate-950/80 p-4 text-white">
      <p className="text-sm uppercase tracking-[0.2em] text-white/60">Preview</p>
      <div className="mt-4 grid gap-3 text-sm md:grid-cols-2 xl:grid-cols-4">
        <p>Enabled: {themeDebugOverride.enabled ? "yes" : "no"}</p>
        <p>Background: {previewTheme.backgroundKey}</p>
        <p>Scene: {previewTheme.scene}</p>
        <p>Mode: {previewTheme.mode}</p>
      </div>
    </div>
  )
}
