import { GitCommitHorizontal, FileCode } from "lucide-react";
import clsx from "clsx";
import type { FileConflict, ConflictStatus } from "../../data/types";
import { StatusDot, type DotStatus } from "../shared/StatusDot";

interface SHAListProps {
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

function getShaStatus(
  files: FileConflict[],
  hunkStatuses: Record<string, ConflictStatus>
): DotStatus {
  const statuses = files.flatMap((f) =>
    f.hunks.map((h) => hunkStatuses[h.id] ?? "pending")
  );
  const hasApproved = statuses.some((s) => s === "approved");
  const hasDenied = statuses.some((s) => s === "denied");
  if (hasApproved && hasDenied) return "mixed";
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
  const selectedSha =
    conflicts.find((conflict) => conflict.id === selectedConflictId)?.commit
      .sha ?? null;

  const grouped = new Map<string, FileConflict[]>();
  for (const conflict of conflicts) {
    const sha = conflict.commit.sha;
    if (!grouped.has(sha)) grouped.set(sha, []);
    grouped.get(sha)!.push(conflict);
  }

  let itemIndex = 0;

  return (
    <div className="py-1">
      {Array.from(grouped.entries()).map(([sha, files]) => {
        const isShaSelected = selectedSha === sha;

        return (
          <div key={sha} className="mb-1">
            <div
              className={clsx(
                "px-4 py-2 flex items-center gap-2 border-l-2 transition-colors",
                isShaSelected
                  ? "bg-accent-amber/8 border-accent-amber"
                  : "border-transparent"
              )}
            >
              <GitCommitHorizontal className="w-3.5 h-3.5 text-accent-amber/70" />
              <code
                className={clsx(
                  "text-[11px] font-mono font-medium",
                  isShaSelected ? "text-accent-amber" : "text-accent-amber/80"
                )}
              >
                {sha}
              </code>
              <StatusDot status={getShaStatus(files, hunkStatuses)} />
            </div>
            <div className="text-[11px] text-text-secondary/60 px-4 pb-1.5 pl-10 -mt-1 truncate">
              {files[0].commit.shortMessage}
            </div>

            {files.map((conflict) => {
              const isSelected = conflict.id === selectedConflictId;
              const status = getFileStatus(conflict, hunkStatuses);
              const fileName = conflict.filePath.split("/").pop()!;
              const idx = itemIndex++;

              return (
                <button
                  key={conflict.id}
                  onClick={() => onSelectConflict(conflict.id)}
                  className={clsx(
                    "animate-fade-in-up w-full text-left px-4 pl-10 py-2 flex items-center gap-2.5 transition-all duration-150 border-l-2 group",
                    isSelected
                      ? "bg-accent-blue/8 border-accent-blue"
                      : "border-transparent hover:bg-white/[0.02]"
                  )}
                  style={{ animationDelay: `${idx * 40}ms` }}
                >
                  <FileCode
                    className={clsx(
                      "w-3.5 h-3.5 flex-shrink-0 transition-colors",
                      isSelected
                        ? "text-accent-blue"
                        : "text-text-secondary/50 group-hover:text-text-secondary"
                    )}
                  />
                  <span
                    className={clsx(
                      "text-[13px] truncate transition-colors",
                      isSelected
                        ? "text-text-primary"
                        : "text-text-secondary group-hover:text-text-primary"
                    )}
                  >
                    {fileName}
                  </span>
                  <StatusDot status={status} />
                  <span className="text-[11px] font-mono text-text-secondary/40 ml-auto">
                    {conflict.hunks.length}
                  </span>
                </button>
              );
            })}
          </div>
        );
      })}
    </div>
  );
}
