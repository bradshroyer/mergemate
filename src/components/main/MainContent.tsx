import type { FileConflict, RebaseInfo, ConflictStatus } from "../../data/types";
import { EmptyState } from "./EmptyState";
import { ConflictDetail } from "./ConflictDetail";
import { ActionBar } from "../actions/ActionBar";

interface MainContentProps {
  selectedConflict: FileConflict | null;
  rebaseInfo: RebaseInfo;
  hunkStatuses: Record<string, ConflictStatus>;
  onUpdateHunkStatus: (hunkId: string, status: ConflictStatus) => void;
  onSelectConflictSha: (sha: string) => void;
  onApproveAll: () => void;
  onDenyAll: () => void;
  onApplyResolutions: () => void;
}

export function MainContent({
  selectedConflict,
  rebaseInfo,
  hunkStatuses,
  onUpdateHunkStatus,
  onSelectConflictSha,
  onApproveAll,
  onDenyAll,
  onApplyResolutions,
}: MainContentProps) {
  const totalHunks = Object.keys(hunkStatuses).length;
  const approvedCount = Object.values(hunkStatuses).filter(
    (s) => s === "approved"
  ).length;
  const deniedCount = Object.values(hunkStatuses).filter(
    (s) => s === "denied"
  ).length;

  return (
    <div className="flex-1 flex flex-col min-w-0 bg-bg-primary">
      <div className="flex-1 overflow-y-auto">
        {selectedConflict ? (
          <ConflictDetail
            key={selectedConflict.id}
            conflict={selectedConflict}
            rebaseInfo={rebaseInfo}
            hunkStatuses={hunkStatuses}
            onUpdateHunkStatus={onUpdateHunkStatus}
            onSelectConflictSha={onSelectConflictSha}
          />
        ) : (
          <EmptyState />
        )}
      </div>
      <ActionBar
        totalHunks={totalHunks}
        approvedCount={approvedCount}
        deniedCount={deniedCount}
        onApproveAll={onApproveAll}
        onDenyAll={onDenyAll}
        onApplyResolutions={onApplyResolutions}
      />
    </div>
  );
}
