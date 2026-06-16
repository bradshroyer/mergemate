import {
  GitMerge,
  FileCode,
  GitCommitHorizontal,
  Sparkles,
  Check,
  MousePointerClick,
} from "lucide-react";

const FEATURES = [
  {
    icon: FileCode,
    color: "#c783ff",
    title: "Three-panel diff",
    desc: "Compare original, conflicting, and AI-resolved code side by side with word-level highlights.",
  },
  {
    icon: GitCommitHorizontal,
    color: "#2dd4bf",
    title: "Rebase map",
    desc: "Visualize your commit graph to understand exactly which commits introduced each conflict.",
  },
  {
    icon: Sparkles,
    color: "#a855f7",
    title: "AI reasoning",
    desc: "Every resolution includes an explanation of the approach and why it was chosen.",
  },
  {
    icon: Check,
    color: "#22c55e",
    title: "Bulk actions",
    desc: "Approve or deny all resolutions in one click — with undo if you change your mind.",
  },
] as const;

function KeyHint({ keys, label }: { keys: string[]; label: string }) {
  return (
    <span className="flex items-center gap-1.5 text-[10.5px] text-text-secondary/45">
      <span className="flex items-center gap-0.5">
        {keys.map((k) => (
          <kbd key={k} className="kbd text-[9px]">
            {k}
          </kbd>
        ))}
      </span>
      <span>{label}</span>
    </span>
  );
}

export function EmptyState() {
  return (
    <div className="flex items-center justify-center h-full animate-fade-in">
      <div className="text-center max-w-[460px] px-8">
        {/* Brand mark */}
        <div className="relative inline-flex mb-7">
          <div
            className="w-14 h-14 rounded-2xl flex items-center justify-center"
            style={{
              background:
                "linear-gradient(135deg, rgba(199,131,255,0.15) 0%, rgba(168,85,247,0.06) 100%)",
              boxShadow:
                "0 0 40px rgba(199,131,255,0.06), inset 0 1px 0 rgba(255,255,255,0.04)",
              border: "1px solid rgba(199,131,255,0.18)",
            }}
          >
            <GitMerge className="w-7 h-7 text-accent-blue" />
          </div>
          <div
            className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full flex items-center justify-center ring-2 ring-bg-primary"
            style={{ background: "linear-gradient(135deg, #c783ff, #a855f7)" }}
          >
            <Sparkles className="w-2.5 h-2.5 text-white" />
          </div>
        </div>

        <h2 className="text-[16px] font-semibold text-text-primary mb-2 tracking-[-0.02em]">
          AI-Powered Conflict Resolution
        </h2>
        <p className="text-[13px] text-text-secondary/60 leading-relaxed mb-7 max-w-[340px] mx-auto">
          Review AI-proposed resolutions for each conflict hunk and apply the
          ones you trust — file by file.
        </p>

        {/* Feature grid */}
        <div className="grid grid-cols-2 gap-2 mb-7 text-left">
          {FEATURES.map(({ icon: Icon, color, title, desc }) => (
            <div
              key={title}
              className="rounded-xl border border-border-subtle bg-bg-surface/40 p-3.5"
              style={{ boxShadow: "inset 0 1px 0 rgba(255,255,255,0.02)" }}
            >
              <div className="flex items-center gap-2 mb-1.5">
                <Icon
                  className="w-3.5 h-3.5 flex-shrink-0"
                  style={{ color }}
                />
                <span className="text-[11.5px] font-semibold text-text-primary">
                  {title}
                </span>
              </div>
              <p className="text-[10.5px] text-text-secondary/50 leading-relaxed">
                {desc}
              </p>
            </div>
          ))}
        </div>

        {/* Keyboard shortcuts */}
        <div className="flex items-center justify-center gap-4 mb-6">
          <KeyHint keys={["J", "K"]} label="navigate files" />
          <span className="text-text-secondary/20 text-xs">·</span>
          <KeyHint keys={["A"]} label="approve all" />
          <span className="text-text-secondary/20 text-xs">·</span>
          <KeyHint keys={["D"]} label="deny all" />
        </div>

        {/* CTA */}
        <div className="flex items-center justify-center gap-2 text-[11px] text-text-secondary/35">
          <MousePointerClick className="w-3.5 h-3.5" />
          <span>Select a file from the sidebar to begin</span>
        </div>
      </div>
    </div>
  );
}
