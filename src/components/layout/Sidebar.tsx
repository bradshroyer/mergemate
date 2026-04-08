import { GitBranch } from "lucide-react";
import type { FileConflict, ConflictStatus } from "../../data/types";
import { SidebarTabs } from "./SidebarTabs";
import { FileList } from "./FileList";
import { SHAList } from "./SHAList";

interface SidebarProps {
  conflicts: FileConflict[];
  activeTab: "file" | "sha";
  onTabChange: (tab: "file" | "sha") => void;
  selectedConflictId: string | null;
  onSelectConflict: (id: string) => void;
  hunkStatuses: Record<string, ConflictStatus>;
}

export function Sidebar({
  conflicts,
  activeTab,
  onTabChange,
  selectedConflictId,
  onSelectConflict,
  hunkStatuses,
}: SidebarProps) {
  return (
    <aside className="w-80 flex-shrink-0 border-r border-border-subtle surface-gradient flex flex-col h-full animate-slide-in-left">
      <div className="px-4 py-4 border-b border-border-subtle">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-accent-blue/12 flex items-center justify-center ring-1 ring-accent-blue/20">
            <GitBranch className="w-4 h-4 text-accent-blue" />
          </div>
          <div>
            <h1 className="text-[13px] font-semibold text-text-primary tracking-[-0.01em]">
              Merge Mate
            </h1>
            <p className="text-[11px] text-text-secondary tracking-wide uppercase">
              Conflict Resolution
            </p>
          </div>
        </div>
      </div>

      <SidebarTabs activeTab={activeTab} onTabChange={onTabChange} />

      <div className="flex-1 overflow-y-auto">
        {activeTab === "file" ? (
          <FileList
            conflicts={conflicts}
            selectedConflictId={selectedConflictId}
            onSelectConflict={onSelectConflict}
            hunkStatuses={hunkStatuses}
          />
        ) : (
          <SHAList
            conflicts={conflicts}
            selectedConflictId={selectedConflictId}
            onSelectConflict={onSelectConflict}
            hunkStatuses={hunkStatuses}
          />
        )}
      </div>

      <div className="px-4 py-3 border-t border-border-subtle">
        <div className="text-[11px] text-text-secondary font-mono">
          {conflicts.length} files &middot;{" "}
          {conflicts.reduce((sum, c) => sum + c.hunks.length, 0)} conflicts
        </div>
      </div>
    </aside>
  );
}
