import { useState, useRef, useEffect } from "react";
import { Sparkles, X, ArrowRight } from "lucide-react";
import clsx from "clsx";

/**
 * MOCKUP — temporary control for screenshot purposes.
 * Lets the user re-run the AI review with plain-text change instructions.
 */

const SUGGESTIONS = [
  "Prefer the feature branch logic",
  "Keep the new logger import",
  "Match the original formatting",
];

export function RerunControl() {
  const [isOpen, setIsOpen] = useState(false);
  const [prompt, setPrompt] = useState("");
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isOpen) return;
    const handleClickOutside = (e: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsOpen(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleKey);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKey);
    };
  }, [isOpen]);

  const canSubmit = Boolean(prompt.trim());

  return (
    <div ref={containerRef} className="relative flex items-center">
      <button
        onClick={() => setIsOpen((v) => !v)}
        title="Re-run review with changes"
        className={clsx(
          "group flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-[11px] font-medium transition-colors duration-150",
          isOpen
            ? "text-text-primary bg-bg-surface/50"
            : "text-text-secondary/70 hover:text-text-primary hover:bg-bg-surface/40"
        )}
      >
        <Sparkles
          className="w-[14px] h-[14px] transition-transform duration-200 group-hover:rotate-12"
          strokeWidth={1.75}
        />
        <span>Re-run review</span>
      </button>

      {isOpen && (
        <div
          className="absolute bottom-full right-0 mb-2.5 w-[340px] rounded-xl border border-border-subtle bg-bg-elevated shadow-2xl shadow-black/80 overflow-hidden z-50"
          style={{
            animation: "scale-in 0.18s cubic-bezier(0.16, 1, 0.3, 1) both",
            transformOrigin: "bottom right",
          }}
          role="dialog"
          aria-label="Re-run review"
        >
          <div className="flex items-center justify-between pl-3.5 pr-2 pt-2.5 pb-2">
            <div className="flex items-center gap-1.5">
              <Sparkles
                className="w-3 h-3 text-accent-purple"
                strokeWidth={2}
              />
              <span className="text-[9.5px] font-mono uppercase tracking-[0.14em] text-text-primary">
                Re-run with changes
              </span>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              aria-label="Close"
              className="p-1 rounded text-text-secondary/40 hover:text-text-primary hover:bg-bg-surface/50 transition-colors"
            >
              <X className="w-3 h-3" strokeWidth={2.25} />
            </button>
          </div>
          <div className="h-px bg-border-subtle/60" />

          <div className="px-3.5 pt-3 pb-3 flex flex-col gap-2.5">
            <p className="text-[11.5px] leading-snug text-text-primary">
              Describe how the AI should resolve these conflicts differently.
              The review will re-run across all hunks.
            </p>

            <textarea
              autoFocus
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="e.g. Favor the feature branch changes and keep the structured logger…"
              rows={3}
              maxLength={500}
              className="w-full text-[12px] leading-snug px-2.5 py-2 rounded-md bg-bg-surface border border-border-subtle text-text-primary placeholder:text-text-secondary resize-none focus:outline-none focus:border-accent-purple/60 focus:bg-bg-surface transition-colors font-sans"
            />

            <div className="flex flex-wrap gap-1.5">
              {SUGGESTIONS.map((s) => (
                <button
                  key={s}
                  onClick={() => setPrompt(s)}
                  className="text-[10.5px] font-medium px-2 py-1 rounded-md border bg-bg-surface border-border-subtle text-text-primary hover:border-accent-purple/60 hover:bg-bg-elevated transition-all duration-150"
                >
                  {s}
                </button>
              ))}
            </div>

            <div className="flex items-center justify-between gap-2 pt-0.5">
              <span className="text-[10px] text-text-secondary font-mono">
                {prompt.length}/500
              </span>
              <button
                disabled={!canSubmit}
                className={clsx(
                  "group relative flex items-center gap-1.5 pl-3 pr-2.5 py-1.5 rounded-md text-[11px] font-semibold tracking-tight transition-all duration-150 overflow-hidden",
                  canSubmit
                    ? "text-white shadow-lg active:scale-[0.98]"
                    : "bg-bg-surface/30 text-text-secondary/30 cursor-not-allowed"
                )}
                style={
                  canSubmit
                    ? {
                        background:
                          "linear-gradient(135deg, #c783ff 0%, #9b5ee8 50%, #2dd4bf 130%)",
                        boxShadow:
                          "0 4px 16px -4px rgba(199, 131, 255, 0.35), inset 0 1px 0 rgba(255, 255, 255, 0.15)",
                      }
                    : undefined
                }
              >
                <span className="relative flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5" strokeWidth={2} />
                  <span>Re-run review</span>
                  <ArrowRight className="w-3.5 h-3.5 transition-transform duration-200 group-hover:translate-x-0.5" />
                </span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
