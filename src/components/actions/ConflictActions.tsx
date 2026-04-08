import { Check, X } from "lucide-react";
import clsx from "clsx";
import type { ConflictStatus } from "../../data/types";

interface ConflictActionsProps {
  hunkId: string;
  status: ConflictStatus;
  onUpdateStatus: (hunkId: string, status: ConflictStatus) => void;
}

export function ConflictActions({
  hunkId,
  status,
  onUpdateStatus,
}: ConflictActionsProps) {
  return (
    <div className="flex items-center gap-1">
      <button
        onClick={() =>
          onUpdateStatus(hunkId, status === "approved" ? "pending" : "approved")
        }
        className={clsx(
          "flex items-center gap-1 px-2.5 py-1 rounded-md text-[11px] font-semibold transition-all duration-150",
          status === "approved"
            ? "bg-accent-green/15 text-accent-green ring-1 ring-accent-green/25 shadow-sm shadow-accent-green/10"
            : "text-text-secondary/60 hover:text-accent-green hover:bg-accent-green/8"
        )}
      >
        <Check className="w-3 h-3" />
        Approve
      </button>
      <button
        onClick={() =>
          onUpdateStatus(hunkId, status === "denied" ? "pending" : "denied")
        }
        className={clsx(
          "flex items-center gap-1 px-2.5 py-1 rounded-md text-[11px] font-semibold transition-all duration-150",
          status === "denied"
            ? "bg-accent-red/15 text-accent-red ring-1 ring-accent-red/25 shadow-sm shadow-accent-red/10"
            : "text-text-secondary/60 hover:text-accent-red hover:bg-accent-red/8"
        )}
      >
        <X className="w-3 h-3" />
        Deny
      </button>
    </div>
  );
}
