import { FileCode, GitCommitHorizontal } from "lucide-react";
import clsx from "clsx";

interface SidebarTabsProps {
  activeTab: "file" | "sha";
  onTabChange: (tab: "file" | "sha") => void;
}

export function SidebarTabs({ activeTab, onTabChange }: SidebarTabsProps) {
  return (
    <div className="flex border-b border-border-subtle">
      <button
        onClick={() => onTabChange("file")}
        className={clsx(
          "flex-1 flex items-center justify-center gap-1.5 px-3 py-2.5 text-xs font-medium transition-colors",
          activeTab === "file"
            ? "text-accent-blue border-b-2 border-accent-blue bg-accent-blue/5"
            : "text-text-secondary hover:text-text-primary hover:bg-bg-elevated"
        )}
      >
        <FileCode className="w-3.5 h-3.5" />
        By File
      </button>
      <button
        onClick={() => onTabChange("sha")}
        className={clsx(
          "flex-1 flex items-center justify-center gap-1.5 px-3 py-2.5 text-xs font-medium transition-colors",
          activeTab === "sha"
            ? "text-accent-blue border-b-2 border-accent-blue bg-accent-blue/5"
            : "text-text-secondary hover:text-text-primary hover:bg-bg-elevated"
        )}
      >
        <GitCommitHorizontal className="w-3.5 h-3.5" />
        By SHA
      </button>
    </div>
  );
}
