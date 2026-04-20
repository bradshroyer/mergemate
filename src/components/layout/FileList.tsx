import { FileCode } from "lucide-react";
import clsx from "clsx";
import type { FileConflict, ConflictStatus } from "../../data/types";
import { StatusDot, type DotStatus } from "../shared/StatusDot";

interface FileListProps {
  conflicts: FileConflict[];
  selectedConflictId: string | null;
  onSelectConflict: (id: string) => void;
  hunkStatuses: Record<string, ConflictStatus>;
}

function getFileStatus(
  conflict: FileConflict,
  hunkStatuses: Record<string, ConflictStatus>
): DotStatus {
  const statuses = conflict.hunks.map((h) => hunkStatuses[h.id] ?? "pending");
  const hasApproved = statuses.some((s) => s === "approved");
  const hasDenied = statuses.some((s) => s === "denied");
  if (hasApproved && hasDenied) return "mixed";
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
      {conflicts.map((conflict, i) => {
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
              "animate-fade-in-up w-full text-left px-4 py-2.5 flex items-start gap-3 transition-all duration-150 border-l-2 group",
              isSelected
                ? "bg-accent-blue/8 border-accent-blue"
                : "border-transparent hover:bg-white/[0.02]"
            )}
            style={{ animationDelay: `${i * 40}ms` }}
          >
            <FileCode
              className={clsx(
                "w-4 h-4 mt-0.5 flex-shrink-0 transition-colors",
                isSelected
                  ? "text-accent-blue"
                  : "text-text-secondary/50 group-hover:text-text-secondary"
              )}
            />
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <span
                  className={clsx(
                    "text-[13px] font-medium truncate transition-colors",
                    isSelected ? "text-text-primary" : "text-text-secondary group-hover:text-text-primary"
                  )}
                >
                  {fileName}
                </span>
                <StatusDot status={status} />
              </div>
              {dirPath && (
                <div className="text-[11px] font-mono text-text-secondary/40 truncate mt-0.5">
                  {dirPath}
                </div>
              )}
              <div className="text-[11px] text-text-secondary/40 mt-0.5">
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
