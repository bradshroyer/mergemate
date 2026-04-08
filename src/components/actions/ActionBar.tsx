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
    <div className="border-t border-border-subtle surface-gradient px-6 py-2.5 flex items-center justify-between">
      <div className="flex items-center gap-4 text-[11px] font-mono">
        <span className="text-text-secondary">
          <span className="font-semibold text-text-primary">{totalHunks}</span>{" "}
          total
        </span>
        {approvedCount > 0 && (
          <span className="text-accent-green">
            <span className="font-semibold">{approvedCount}</span> approved
          </span>
        )}
        {deniedCount > 0 && (
          <span className="text-accent-red">
            <span className="font-semibold">{deniedCount}</span> denied
          </span>
        )}
        {pendingCount > 0 && (
          <span className="text-accent-amber">
            <span className="font-semibold">{pendingCount}</span> pending
          </span>
        )}
      </div>
      <div className="flex items-center gap-2">
        <button
          onClick={onApproveAll}
          className="flex items-center gap-1.5 px-4 py-1.5 rounded-lg bg-accent-green/12 text-accent-green text-[11px] font-semibold hover:bg-accent-green/20 transition-all duration-150 ring-1 ring-accent-green/15 hover:ring-accent-green/30"
        >
          <CheckCheck className="w-3.5 h-3.5" />
          Approve All
        </button>
        <button
          onClick={onDenyAll}
          className="flex items-center gap-1.5 px-4 py-1.5 rounded-lg bg-accent-red/12 text-accent-red text-[11px] font-semibold hover:bg-accent-red/20 transition-all duration-150 ring-1 ring-accent-red/15 hover:ring-accent-red/30"
        >
          <XCircle className="w-3.5 h-3.5" />
          Deny All
        </button>
      </div>
    </div>
  );
}
