import { ArrowRight, Check, X } from "lucide-react";
import clsx from "clsx";

interface ActionBarProps {
  totalHunks: number;
  approvedCount: number;
  deniedCount: number;
  onApproveAll: () => void;
  onDenyAll: () => void;
  onApplyResolutions: () => void;
}

export function ActionBar({
  totalHunks,
  approvedCount,
  deniedCount,
  onApproveAll,
  onDenyAll,
  onApplyResolutions,
}: ActionBarProps) {
  const pendingCount = totalHunks - approvedCount - deniedCount;
  const allReviewed = pendingCount === 0 && totalHunks > 0;
  const allDenied = allReviewed && approvedCount === 0;

  return (
    <div className="border-t border-border-subtle surface-gradient px-6 py-3 flex items-center justify-between gap-6">
      {/* Progress dots visualization */}
      <div className="flex items-center gap-3 min-w-0">
        <div className="flex items-center gap-[3px]">
          {Array.from({ length: totalHunks }).map((_, i) => {
            // Order dots: approved first, then denied, then pending
            let status: "approved" | "denied" | "pending";
            if (i < approvedCount) status = "approved";
            else if (i < approvedCount + deniedCount) status = "denied";
            else status = "pending";

            return (
              <span
                key={i}
                className={clsx(
                  "block w-[14px] h-[3px] rounded-full transition-colors duration-300",
                  {
                    "bg-accent-green": status === "approved",
                    "bg-accent-red": status === "denied",
                    "bg-border-subtle": status === "pending",
                  }
                )}
              />
            );
          })}
        </div>
        <div className="text-[11px] font-mono text-text-secondary flex items-center gap-2">
          <span>
            <span className="font-semibold text-text-primary">
              {approvedCount + deniedCount}
            </span>
            <span className="text-text-secondary/50">/{totalHunks}</span>
            <span className="ml-1">reviewed</span>
          </span>
          {pendingCount > 0 && (
            <>
              <span className="text-text-secondary/30">&middot;</span>
              <span className="text-accent-amber">
                {pendingCount} pending
              </span>
            </>
          )}
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-1">
        {allReviewed ? (
          allDenied ? (
            <button
              onClick={onApplyResolutions}
              className="group relative flex items-center gap-2 pl-4 pr-3 py-2 rounded-lg text-[12px] font-semibold tracking-tight transition-all duration-200 overflow-hidden text-white shadow-lg hover:shadow-xl active:scale-[0.98]"
              style={{
                background:
                  "linear-gradient(135deg, #ef4444 0%, #dc2626 50%, #b91c1c 130%)",
                boxShadow:
                  "0 4px 16px -4px rgba(239, 68, 68, 0.35), inset 0 1px 0 rgba(255, 255, 255, 0.15)",
              }}
            >
              <span
                className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
                style={{
                  background:
                    "linear-gradient(135deg, #f56565 0%, #e53e3e 50%, #c53030 130%)",
                }}
              />
              <span className="relative flex items-center gap-2">
                <X className="w-3.5 h-3.5" />
                <span>Reject resolutions</span>
                <ArrowRight className="w-3.5 h-3.5 transition-transform duration-200 group-hover:translate-x-0.5" />
              </span>
            </button>
          ) : (
            <button
              onClick={onApplyResolutions}
              className="group relative flex items-center gap-2 pl-4 pr-3 py-2 rounded-lg text-[12px] font-semibold tracking-tight transition-all duration-200 overflow-hidden text-white shadow-lg hover:shadow-xl active:scale-[0.98]"
              style={{
                background:
                  "linear-gradient(135deg, #22c55e 0%, #10b981 50%, #2dd4bf 130%)",
                boxShadow:
                  "0 4px 16px -4px rgba(34, 197, 94, 0.35), inset 0 1px 0 rgba(255, 255, 255, 0.15)",
              }}
            >
              <span
                className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
                style={{
                  background:
                    "linear-gradient(135deg, #2dd269 0%, #14cc97 50%, #4ee0cc 130%)",
                }}
              />
              <span className="relative flex items-center gap-2">
                <Check className="w-3.5 h-3.5" />
                <span>Apply resolutions</span>
                {deniedCount > 0 && (
                  <span className="flex items-center justify-center min-w-[20px] h-[18px] px-1.5 rounded-md bg-black/25 text-[10px] font-mono font-bold leading-none ring-1 ring-white/10">
                    {approvedCount}
                  </span>
                )}
                <ArrowRight className="w-3.5 h-3.5 transition-transform duration-200 group-hover:translate-x-0.5" />
              </span>
            </button>
          )
        ) : (
          <>
            <button
              onClick={onDenyAll}
              className="group px-3 py-1.5 text-[11px] font-medium text-text-secondary/70 hover:text-accent-red transition-colors duration-150 relative"
            >
              <span className="relative">
                Deny all
                <span className="absolute left-0 right-0 -bottom-0.5 h-px bg-accent-red/50 scale-x-0 group-hover:scale-x-100 transition-transform duration-200 origin-left" />
              </span>
            </button>

            <button
              onClick={onApproveAll}
              className="group relative flex items-center gap-2 pl-4 pr-3 py-2 rounded-lg text-[12px] font-semibold tracking-tight transition-all duration-200 overflow-hidden text-white shadow-lg hover:shadow-xl active:scale-[0.98]"
              style={{
                background:
                  "linear-gradient(135deg, #c783ff 0%, #9b5ee8 50%, #2dd4bf 130%)",
                boxShadow:
                  "0 4px 16px -4px rgba(199, 131, 255, 0.35), inset 0 1px 0 rgba(255, 255, 255, 0.15)",
              }}
            >
              <span
                className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
                style={{
                  background:
                    "linear-gradient(135deg, #d19bff 0%, #ac76ed 50%, #4ee0cc 130%)",
                }}
              />
              <span className="relative flex items-center gap-2">
                <span>Approve all</span>
                <span className="flex items-center justify-center min-w-[20px] h-[18px] px-1.5 rounded-md bg-black/25 text-[10px] font-mono font-bold leading-none ring-1 ring-white/10">
                  {pendingCount}
                </span>
                <ArrowRight className="w-3.5 h-3.5 transition-transform duration-200 group-hover:translate-x-0.5" />
              </span>
            </button>
          </>
        )}
      </div>
    </div>
  );
}
