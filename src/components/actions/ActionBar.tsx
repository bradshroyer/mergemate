import { CheckCheck, XCircle } from "lucide-react";

interface ActionBarProps {
  totalHunks: number;
  approvedCount: number;
  deniedCount: number;
  onApproveAll: () => void;
  onDenyAll: () => void;
}

export function ActionBar({
  totalHunks,
  approvedCount,
  deniedCount,
  onApproveAll,
  onDenyAll,
}: ActionBarProps) {
  const pendingCount = totalHunks - approvedCount - deniedCount;

  return (
    <div className="border-t border-border-subtle bg-bg-surface px-6 py-3 flex items-center justify-between">
      <div className="flex items-center gap-4 text-xs">
        <span className="text-text-secondary">
          <span className="font-medium text-text-primary">{totalHunks}</span>{" "}
          total
        </span>
        {approvedCount > 0 && (
          <span className="text-accent-green">
            <span className="font-medium">{approvedCount}</span> approved
          </span>
        )}
        {deniedCount > 0 && (
          <span className="text-accent-red">
            <span className="font-medium">{deniedCount}</span> denied
          </span>
        )}
        {pendingCount > 0 && (
          <span className="text-accent-amber">
            <span className="font-medium">{pendingCount}</span> pending
          </span>
        )}
      </div>
      <div className="flex items-center gap-2">
        <button
          onClick={onApproveAll}
          className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-accent-green/15 text-accent-green text-xs font-medium hover:bg-accent-green/25 transition-colors"
        >
          <CheckCheck className="w-3.5 h-3.5" />
          Approve All
        </button>
        <button
          onClick={onDenyAll}
          className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-accent-red/15 text-accent-red text-xs font-medium hover:bg-accent-red/25 transition-colors"
        >
          <XCircle className="w-3.5 h-3.5" />
          Deny All
        </button>
      </div>
    </div>
  );
}
