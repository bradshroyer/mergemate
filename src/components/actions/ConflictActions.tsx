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
    <div className="flex items-center gap-1.5">
      <button
        onClick={() =>
          onUpdateStatus(hunkId, status === "approved" ? "pending" : "approved")
        }
        className={clsx(
          "flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-medium transition-all",
          status === "approved"
            ? "bg-accent-green/20 text-accent-green ring-1 ring-accent-green/30"
            : "text-text-secondary hover:text-accent-green hover:bg-accent-green/10"
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
          "flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-medium transition-all",
          status === "denied"
            ? "bg-accent-red/20 text-accent-red ring-1 ring-accent-red/30"
            : "text-text-secondary hover:text-accent-red hover:bg-accent-red/10"
        )}
      >
        <X className="w-3 h-3" />
        Deny
      </button>
    </div>
  );
}
