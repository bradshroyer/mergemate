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
    <aside className="w-80 flex-shrink-0 border-r border-border-subtle bg-bg-surface flex flex-col h-full">
      <div className="px-4 py-5 border-b border-border-subtle">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-accent-blue/15 flex items-center justify-center">
            <GitBranch className="w-4 h-4 text-accent-blue" />
          </div>
          <div>
            <h1 className="text-sm font-semibold text-text-primary tracking-tight">
              Merge Mate
            </h1>
            <p className="text-xs text-text-secondary">Conflict Resolution</p>
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
        <div className="text-xs text-text-secondary">
          {conflicts.length} files &middot;{" "}
          {conflicts.reduce((sum, c) => sum + c.hunks.length, 0)} conflicts
        </div>
      </div>
    </aside>
  );
}
