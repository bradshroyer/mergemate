import { FileCode } from "lucide-react";
import clsx from "clsx";
import type { FileConflict, ConflictStatus } from "../../data/types";
import { StatusDot } from "../shared/StatusDot";

interface FileListProps {
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

export function FileList({
  conflicts,
  selectedConflictId,
  onSelectConflict,
  hunkStatuses,
}: FileListProps) {
  return (
    <div className="py-1">
      {conflicts.map((conflict) => {
        const isSelected = conflict.id === selectedConflictId;
        const status = getFileStatus(conflict, hunkStatuses);
        const parts = conflict.filePath.split("/");
        const fileName = parts.pop()!;
        const dirPath = parts.join("/");

        return (
          <button
            key={conflict.id}
            onClick={() => onSelectConflict(conflict.id)}
            className={clsx(
              "w-full text-left px-4 py-2.5 flex items-start gap-3 transition-colors border-l-2",
              isSelected
                ? "bg-bg-elevated border-accent-blue"
                : "border-transparent hover:bg-bg-elevated/50"
            )}
          >
            <FileCode className="w-4 h-4 mt-0.5 text-text-secondary flex-shrink-0" />
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <span
                  className={clsx(
                    "text-sm font-medium truncate",
                    isSelected ? "text-text-primary" : "text-text-secondary"
                  )}
                >
                  {fileName}
                </span>
                <StatusDot status={status} />
              </div>
              {dirPath && (
                <div className="text-xs text-text-secondary/60 truncate mt-0.5">
                  {dirPath}
                </div>
              )}
              <div className="text-xs text-text-secondary/60 mt-0.5">
                {conflict.hunks.length} conflict
                {conflict.hunks.length > 1 ? "s" : ""}
              </div>
            </div>
          </button>
        );
      })}
    </div>
  );
}
