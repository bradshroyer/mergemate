import { GitMerge } from "lucide-react";

export function EmptyState() {
  return (
    <div className="flex items-center justify-center h-full">
      <div className="text-center">
        <div className="w-16 h-16 rounded-2xl bg-bg-elevated flex items-center justify-center mx-auto mb-4">
          <GitMerge className="w-8 h-8 text-text-secondary/40" />
        </div>
        <h2 className="text-lg font-medium text-text-secondary mb-1">
          Select a conflict
        </h2>
        <p className="text-sm text-text-secondary/60 max-w-xs">
          Choose a file from the sidebar to review AI-generated conflict
          resolutions
        </p>
      </div>
    </div>
  );
}
