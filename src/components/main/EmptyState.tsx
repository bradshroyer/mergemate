import { GitMerge, MousePointerClick } from "lucide-react";

export function EmptyState() {
  return (
    <div className="flex items-center justify-center h-full animate-fade-in">
      <div className="text-center max-w-sm">
        <div className="w-14 h-14 rounded-2xl elevated-gradient flex items-center justify-center mx-auto mb-5 ring-1 ring-border-subtle">
          <GitMerge className="w-7 h-7 text-text-secondary/30" />
        </div>
        <h2 className="text-base font-semibold text-text-primary mb-2 tracking-[-0.01em]">
          Select a conflict to review
        </h2>
        <p className="text-[13px] text-text-secondary/60 leading-relaxed mb-6">
          Choose a file from the sidebar to review AI-generated conflict
          resolutions and approve or deny each change.
        </p>
        <div className="flex items-center justify-center gap-1.5 text-[11px] text-text-secondary/40">
          <MousePointerClick className="w-3.5 h-3.5" />
          <span>Click a file in the sidebar to begin</span>
        </div>
      </div>
    </div>
  );
}
