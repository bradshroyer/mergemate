import { GitPullRequest, GitBranch, ArrowRight, Shield } from "lucide-react";

interface ToolbarProps {
  repoName: string;
  prNumber: number;
  baseBranch: string;
  featureBranch: string;
  approvedCount: number;
  totalHunks: number;
}

export function Toolbar({
  repoName,
  prNumber,
  baseBranch,
  featureBranch,
  approvedCount,
  totalHunks,
}: ToolbarProps) {
  const progress = totalHunks > 0 ? (approvedCount / totalHunks) * 100 : 0;

  return (
    <div className="h-11 flex-shrink-0 border-b border-border-subtle surface-gradient flex items-center px-4 gap-4 animate-fade-in">
      {/* Repo + PR */}
      <div className="flex items-center gap-2 text-xs">
        <Shield className="w-3.5 h-3.5 text-accent-blue" />
        <span className="font-medium text-text-primary">{repoName}</span>
        <span className="text-text-secondary/40">/</span>
        <span className="flex items-center gap-1 text-text-secondary">
          <GitPullRequest className="w-3 h-3" />
          #{prNumber}
        </span>
      </div>

      {/* Branch flow */}
      <div className="flex items-center gap-1.5 text-xs text-text-secondary">
        <GitBranch className="w-3 h-3" />
        <code className="font-mono text-accent-blue/80 text-[11px]">
          {featureBranch}
        </code>
        <ArrowRight className="w-3 h-3 text-text-secondary/40" />
        <code className="font-mono text-text-secondary/60 text-[11px]">
          {baseBranch}
        </code>
      </div>

      <div className="flex-1" />

      {/* Progress indicator */}
      <div className="flex items-center gap-2.5">
        <div className="flex items-center gap-1.5 text-[11px]">
          <span className="text-text-secondary">Review progress</span>
          <span className="font-mono font-medium text-text-primary">
            {approvedCount}/{totalHunks}
          </span>
        </div>
        <div className="w-20 h-1.5 rounded-full bg-bg-elevated overflow-hidden">
          <div
            className="h-full rounded-full transition-all duration-500 ease-out"
            style={{
              width: `${progress}%`,
              background:
                progress === 100
                  ? "#22c55e"
                  : "linear-gradient(90deg, #c783ff, #a855f7)",
            }}
          />
        </div>
      </div>

      {/* Keyboard hint */}
      <div className="hidden lg:flex items-center gap-1.5 text-[10px] text-text-secondary/50">
        <kbd className="kbd">&#8984;&#9166;</kbd>
        <span>approve all</span>
      </div>
    </div>
  );
}
