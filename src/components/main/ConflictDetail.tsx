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
    <div className="p-6 space-y-5">
      {/* File header */}
      <div className="flex items-center gap-3 animate-fade-in-up">
        <div className="w-9 h-9 rounded-lg bg-accent-blue/8 flex items-center justify-center ring-1 ring-accent-blue/15">
          <FileCode className="w-5 h-5 text-accent-blue" />
        </div>
        <div>
          <h2 className="text-[15px] font-semibold text-text-primary tracking-[-0.01em]">
            {conflict.filePath}
          </h2>
          <div className="flex items-center gap-2 text-[11px] text-text-secondary mt-0.5">
            <GitCommitHorizontal className="w-3 h-3" />
            <code className="font-mono font-medium text-accent-amber">
              {conflict.commit.sha}
            </code>
            <span className="text-text-secondary/30">&middot;</span>
            <span>{conflict.commit.shortMessage}</span>
          </div>
        </div>
      </div>

      {/* Rebase map */}
      <div className="animate-fade-in-up" style={{ animationDelay: "60ms" }}>
        <RebaseMap rebaseInfo={rebaseInfo} conflictSha={conflict.commit.sha} />
      </div>

      {/* Hunks */}
      {conflict.hunks.map((hunk, index) => (
        <div
          key={hunk.id}
          className="rounded-xl border border-border-subtle bg-bg-surface overflow-hidden card-glow animate-fade-in-up"
          style={{ animationDelay: `${120 + index * 80}ms` }}
        >
          <div className="flex items-center justify-between px-4 py-2.5 border-b border-border-subtle elevated-gradient">
            <div className="flex items-center gap-2.5">
              <span className="text-[11px] font-semibold text-text-primary tracking-wide uppercase">
                Conflict {index + 1}
                <span className="font-normal text-text-secondary/50">
                  {" "}
                  of {conflict.hunks.length}
                </span>
              </span>
              <span className="text-[11px] font-mono text-text-secondary/40">
                L{hunk.startLine}&ndash;{hunk.endLine}
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
