import { useState, useRef, useEffect } from "react";
import { ThumbsUp, ThumbsDown, Check, X } from "lucide-react";
import clsx from "clsx";

type Vote = "up" | "down" | null;

interface FeedbackControlProps {
  onFeedback?: (feedback: {
    vote: "up" | "down";
    reason?: string;
    comment?: string;
  }) => void;
}

const REASONS = ["Incorrect", "Missed context", "Unclear", "Other"];

export function FeedbackControl({ onFeedback }: FeedbackControlProps = {}) {
  const [vote, setVote] = useState<Vote>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedReason, setSelectedReason] = useState<string | null>(null);
  const [otherText, setOtherText] = useState("");
  const [showThanks, setShowThanks] = useState(false);
  const [pulse, setPulse] = useState(false);
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

  const handleThumbsUp = () => {
    if (vote === "up") return;
    setVote("up");
    setIsOpen(false);
    setPulse(true);
    setTimeout(() => setPulse(false), 500);
    onFeedback?.({ vote: "up" });
  };

  const handleThumbsDown = () => {
    if (isOpen) {
      setIsOpen(false);
      return;
    }
    setSelectedReason(null);
    setOtherText("");
    setIsOpen(true);
  };

  const canSubmit = Boolean(
    selectedReason && (selectedReason !== "Other" || otherText.trim())
  );

  const handleSubmit = () => {
    if (!canSubmit || !selectedReason) return;
    setVote("down");
    setShowThanks(true);
    onFeedback?.({
      vote: "down",
      reason: selectedReason,
      comment: selectedReason === "Other" ? otherText.trim() : undefined,
    });
    setTimeout(() => {
      setIsOpen(false);
      setTimeout(() => {
        setShowThanks(false);
        setSelectedReason(null);
        setOtherText("");
      }, 250);
    }, 1050);
  };

  return (
    <div ref={containerRef} className="relative flex items-center">
      <button
        onClick={handleThumbsUp}
        aria-label="Helpful"
        title="Helpful"
        className={clsx(
          "group relative p-1.5 rounded-md transition-colors duration-150",
          vote === "up"
            ? "text-text-primary bg-bg-surface/50"
            : "text-text-secondary/50 hover:text-text-primary hover:bg-bg-surface/40"
        )}
      >
        <ThumbsUp
          className={clsx(
            "w-[14px] h-[14px]",
            pulse && "animate-thumb-pulse",
            !pulse && "transition-transform duration-200",
            !pulse && vote !== "up" && "group-hover:-translate-y-[1px]"
          )}
          fill={vote === "up" ? "currentColor" : "none"}
          strokeWidth={1.75}
        />
      </button>

      <button
        onClick={handleThumbsDown}
        aria-label="Not helpful"
        title="Not helpful"
        className={clsx(
          "group relative p-1.5 rounded-md transition-colors duration-150",
          vote === "down" || isOpen
            ? "text-text-primary bg-bg-surface/50"
            : "text-text-secondary/50 hover:text-text-primary hover:bg-bg-surface/40"
        )}
      >
        <ThumbsDown
          className={clsx(
            "w-[14px] h-[14px] transition-transform duration-200",
            vote !== "down" && !isOpen && "group-hover:translate-y-[1px]"
          )}
          fill={vote === "down" ? "currentColor" : "none"}
          strokeWidth={1.75}
        />
      </button>

      {isOpen && (
        <div
          className="absolute bottom-full right-0 mb-2.5 w-[300px] rounded-xl border border-border-subtle/80 bg-bg-elevated/95 backdrop-blur-xl shadow-2xl shadow-black/60 overflow-hidden z-50"
          style={{
            animation: "scale-in 0.18s cubic-bezier(0.16, 1, 0.3, 1) both",
            transformOrigin: "bottom right",
          }}
          role="dialog"
          aria-label="Feedback"
        >
          {showThanks ? (
            <div className="flex flex-col items-center py-7 px-4 gap-2">
              <div className="w-9 h-9 rounded-full bg-bg-surface/60 ring-1 ring-border-subtle/80 flex items-center justify-center">
                <Check className="w-4 h-4 text-text-primary" strokeWidth={2.5} />
              </div>
              <div className="text-[12.5px] text-text-primary font-medium tracking-tight">
                Thanks for your feedback
              </div>
              <div className="text-[9.5px] font-mono uppercase tracking-[0.14em] text-text-secondary/60">
                signal logged
              </div>
            </div>
          ) : (
            <>
              <div className="flex items-center justify-between pl-3.5 pr-2 pt-2.5 pb-2">
                <div className="flex items-center gap-1.5">
                  <span className="text-[9.5px] font-mono uppercase tracking-[0.14em] text-text-secondary/80">
                    What went wrong
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
                <div className="flex flex-wrap gap-1.5">
                  {REASONS.map((reason) => (
                    <button
                      key={reason}
                      onClick={() => setSelectedReason(reason)}
                      className={clsx(
                        "text-[11px] font-medium px-2.5 py-1.5 rounded-md border transition-all duration-150",
                        selectedReason === reason
                          ? "bg-bg-surface border-border-subtle text-text-primary"
                          : "bg-bg-surface/40 border-border-subtle/70 text-text-secondary hover:text-text-primary hover:border-border-subtle hover:bg-bg-surface"
                      )}
                    >
                      {reason}
                    </button>
                  ))}
                </div>

                {selectedReason === "Other" && (
                  <textarea
                    autoFocus
                    value={otherText}
                    onChange={(e) => setOtherText(e.target.value)}
                    onKeyDown={(e) => {
                      if ((e.metaKey || e.ctrlKey) && e.key === "Enter") {
                        e.preventDefault();
                        handleSubmit();
                      }
                    }}
                    placeholder="Tell us what's off…"
                    rows={2}
                    maxLength={280}
                    className="w-full text-[12px] leading-snug px-2.5 py-2 rounded-md bg-bg-surface/50 border border-border-subtle/70 text-text-primary placeholder:text-text-secondary/40 resize-none focus:outline-none focus:border-border-subtle focus:bg-bg-surface/80 transition-colors font-sans"
                    style={{ animation: "fade-in 0.18s ease both" }}
                  />
                )}

                <div className="flex items-center justify-end gap-2 pt-0.5">
                  {selectedReason === "Other" && (
                    <span className="text-[10px] text-text-secondary/50 font-mono mr-auto">
                      {otherText.length}/280
                    </span>
                  )}
                  <button
                    onClick={handleSubmit}
                    disabled={!canSubmit}
                    className={clsx(
                      "text-[11px] font-semibold px-3 py-1.5 rounded-md transition-all duration-150 tracking-tight",
                      canSubmit
                        ? "bg-text-primary/90 text-bg-primary hover:bg-text-primary"
                        : "bg-bg-surface/30 text-text-secondary/30 cursor-not-allowed"
                    )}
                  >
                    Send
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}
