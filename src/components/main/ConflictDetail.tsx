import { FileCode, GitCommitHorizontal } from "lucide-react";
import type { FileConflict, RebaseInfo, ConflictStatus } from "../../data/types";
import { RebaseMap } from "../rebase-map/RebaseMap";
import { ThreePanelDiff } from "../resolution/ThreePanelDiff";
import { AIExplanation } from "../resolution/AIExplanation";
import { ConflictActions } from "../actions/ConflictActions";

interface ConflictDetailProps {
  conflict: FileConflict;
  rebaseInfo: RebaseInfo;
  hunkStatuses: Record<string, ConflictStatus>;
  onUpdateHunkStatus: (hunkId: string, status: ConflictStatus) => void;
}

export function ConflictDetail({
  conflict,
  rebaseInfo,
  hunkStatuses,
  onUpdateHunkStatus,
}: ConflictDetailProps) {
  return (
    <div className="p-6 space-y-6">
      {/* File header */}
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 rounded-lg bg-accent-blue/10 flex items-center justify-center">
          <FileCode className="w-5 h-5 text-accent-blue" />
        </div>
        <div>
          <h2 className="text-base font-semibold text-text-primary">
            {conflict.filePath}
          </h2>
          <div className="flex items-center gap-2 text-xs text-text-secondary mt-0.5">
            <GitCommitHorizontal className="w-3 h-3" />
            <code className="font-mono text-accent-amber">
              {conflict.commit.sha}
            </code>
            <span className="text-text-secondary/40">&middot;</span>
            <span>{conflict.commit.shortMessage}</span>
          </div>
        </div>
      </div>

      {/* Rebase map */}
      <RebaseMap rebaseInfo={rebaseInfo} conflictSha={conflict.commit.sha} />

      {/* Hunks */}
      {conflict.hunks.map((hunk, index) => (
        <div
          key={hunk.id}
          className="rounded-xl border border-border-subtle bg-bg-surface overflow-hidden"
        >
          <div className="flex items-center justify-between px-4 py-3 border-b border-border-subtle bg-bg-elevated/50">
            <div className="flex items-center gap-2">
              <span className="text-xs font-medium text-text-secondary">
                Conflict {index + 1} of {conflict.hunks.length}
              </span>
              <span className="text-xs text-text-secondary/50">
                Lines {hunk.startLine}&ndash;{hunk.endLine}
              </span>
            </div>
            <ConflictActions
              hunkId={hunk.id}
              status={hunkStatuses[hunk.id] ?? "pending"}
              onUpdateStatus={onUpdateHunkStatus}
            />
          </div>

          <ThreePanelDiff
            original={hunk.original}
            conflicting={hunk.conflicting}
            aiResolution={hunk.aiResolution}
            language={conflict.language}
          />

          <AIExplanation explanation={hunk.explanation} />
        </div>
      ))}
    </div>
  );
}
