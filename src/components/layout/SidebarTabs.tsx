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
          "flex-1 flex items-center justify-center gap-1.5 px-3 py-2.5 text-[11px] font-semibold tracking-wide uppercase transition-all duration-150",
          activeTab === "file"
            ? "text-accent-blue border-b-2 border-accent-blue bg-accent-blue/5"
            : "text-text-secondary/60 hover:text-text-primary hover:bg-white/[0.02]"
        )}
      >
        <FileCode className="w-3.5 h-3.5" />
        By File
      </button>
      <button
        onClick={() => onTabChange("sha")}
        className={clsx(
          "flex-1 flex items-center justify-center gap-1.5 px-3 py-2.5 text-[11px] font-semibold tracking-wide uppercase transition-all duration-150",
          activeTab === "sha"
            ? "text-accent-blue border-b-2 border-accent-blue bg-accent-blue/5"
            : "text-text-secondary/60 hover:text-text-primary hover:bg-white/[0.02]"
        )}
      >
        <GitCommitHorizontal className="w-3.5 h-3.5" />
        By SHA
      </button>
    </div>
  );
}
