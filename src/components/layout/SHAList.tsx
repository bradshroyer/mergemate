import { GitCommitHorizontal, FileCode } from "lucide-react";
import clsx from "clsx";
import type { FileConflict, ConflictStatus } from "../../data/types";
import { StatusDot } from "../shared/StatusDot";

interface SHAListProps {
  conflicts: FileConflict[];
  selectedConflictId: string | null;
  onSelectConflict: (id: string) => void;
  hunkStatuses: Record<string, ConflictStatus>;
}

function getFileStatus(
  conflict: FileConflict,
  hunkStatuses: Record<string, ConflictStatus>
): ConflictStatus {
  const statuses = conflict.hunks.map((h) => hunkStatuses[h.id] ?? "pending");
  if (statuses.every((s) => s === "approved")) return "approved";
  if (statuses.every((s) => s === "denied")) return "denied";
  return "pending";
}

export function SHAList({
  conflicts,
  selectedConflictId,
  onSelectConflict,
  hunkStatuses,
}: SHAListProps) {
  const grouped = new Map<string, FileConflict[]>();
  for (const conflict of conflicts) {
    const sha = conflict.commit.sha;
    if (!grouped.has(sha)) grouped.set(sha, []);
    grouped.get(sha)!.push(conflict);
  }

  return (
    <div className="py-1">
      {Array.from(grouped.entries()).map(([sha, files]) => (
        <div key={sha} className="mb-1">
          <div className="px-4 py-2 flex items-center gap-2">
            <GitCommitHorizontal className="w-3.5 h-3.5 text-accent-amber" />
            <code className="text-xs font-mono text-accent-amber">{sha}</code>
          </div>
          <div className="text-xs text-text-secondary px-4 pb-1.5 pl-10 -mt-1 truncate">
            {files[0].commit.shortMessage}
          </div>

          {files.map((conflict) => {
            const isSelected = conflict.id === selectedConflictId;
            const status = getFileStatus(conflict, hunkStatuses);
            const fileName = conflict.filePath.split("/").pop()!;

            return (
              <button
                key={conflict.id}
                onClick={() => onSelectConflict(conflict.id)}
                className={clsx(
                  "w-full text-left px-4 pl-10 py-2 flex items-center gap-2.5 transition-colors border-l-2",
                  isSelected
                    ? "bg-bg-elevated border-accent-blue"
                    : "border-transparent hover:bg-bg-elevated/50"
                )}
              >
                <FileCode className="w-3.5 h-3.5 text-text-secondary flex-shrink-0" />
                <span
                  className={clsx(
                    "text-sm truncate",
                    isSelected ? "text-text-primary" : "text-text-secondary"
                  )}
                >
                  {fileName}
                </span>
                <StatusDot status={status} />
                <span className="text-xs text-text-secondary/60 ml-auto">
                  {conflict.hunks.length}
                </span>
              </button>
            );
          })}
        </div>
      ))}
    </div>
  );
}
