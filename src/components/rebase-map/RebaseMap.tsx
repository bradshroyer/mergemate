import { Info } from "lucide-react";
import type { RebaseInfo } from "../../data/types";

interface RebaseMapProps {
  rebaseInfo: RebaseInfo;
  conflictSha: string;
}

export function RebaseMap({ rebaseInfo, conflictSha }: RebaseMapProps) {
  const { baseBranch, featureBranch, originalBase, newBase, commits } =
    rebaseInfo;

  // Layout constants
  const w = 900;
  const h = 180;
  const mainY = 50;
  const featureY = 130;
  const startX = 60;
  const gap = 80;
  const dividerX = startX + gap * 4.5;
  const r = 10;

  // Main branch commits (before side): originalBase + 3 interim + newBase
  const mainBeforeCommits = [
    { sha: originalBase.sha, label: originalBase.sha.slice(0, 7), x: startX },
    {
      sha: "m2",
      label: "d2e3f4a",
      x: startX + gap,
    },
    {
      sha: "m3",
      label: "b5c6d7e",
      x: startX + gap * 2,
    },
    {
      sha: newBase.sha,
      label: newBase.sha.slice(0, 7),
      x: startX + gap * 3,
    },
  ];

  // Feature branch commits (before side)
  const featureBeforeCommits = commits.map((c, i) => ({
    sha: c.sha,
    label: c.sha.slice(0, 7),
    x: startX + gap * (i + 1),
    isConflict: c.sha === conflictSha,
    message: c.shortMessage,
  }));

  // After side: main base + replayed commits
  const afterStartX = dividerX + gap;
  const afterMainX = afterStartX;
  const afterFeatureCommits = commits.map((c, i) => ({
    sha: c.sha + "'",
    label: c.sha.slice(0, 7) + "'",
    x: afterStartX + gap * (i + 1),
    isConflict: c.sha === conflictSha,
  }));

  return (
    <div className="rounded-xl border border-border-subtle bg-bg-surface overflow-hidden">
      <div className="px-4 py-3 border-b border-border-subtle bg-bg-elevated/50 flex items-center gap-2">
        <Info className="w-3.5 h-3.5 text-accent-blue" />
        <span className="text-xs font-medium text-text-primary">
          Rebase Map
        </span>
        <span className="text-xs text-text-secondary">
          {featureBranch} onto {baseBranch}
        </span>
      </div>

      <div className="p-4 overflow-x-auto">
        <svg
          viewBox={`0 0 ${w} ${h}`}
          className="w-full max-w-4xl mx-auto"
          style={{ minWidth: 700 }}
        >
          {/* ===== BEFORE SIDE ===== */}
          {/* "Before" label */}
          <text
            x={startX + gap * 1.5}
            y={18}
            textAnchor="middle"
            className="fill-text-secondary text-[11px] font-medium uppercase tracking-wider"
          >
            Before Rebase
          </text>

          {/* Main branch line (before) */}
          <line
            x1={startX}
            y1={mainY}
            x2={mainBeforeCommits[mainBeforeCommits.length - 1].x}
            y2={mainY}
            stroke="#4b5563"
            strokeWidth="2"
            strokeLinecap="round"
          />

          {/* Main branch label */}
          <text
            x={startX - 8}
            y={mainY + 4}
            textAnchor="end"
            className="fill-text-secondary text-[10px] font-mono"
          >
            {baseBranch}
          </text>

          {/* Main branch commits */}
          {mainBeforeCommits.map((c) => (
            <g key={c.sha}>
              <circle cx={c.x} cy={mainY} r={r} fill="#1f2937" stroke="#4b5563" strokeWidth="2" />
              <text
                x={c.x}
                y={mainY - 16}
                textAnchor="middle"
                className="fill-text-secondary text-[9px] font-mono"
              >
                {c.label}
              </text>
            </g>
          ))}

          {/* Branch-off line from originalBase to first feature commit */}
          <path
            d={`M ${startX} ${mainY} Q ${startX + gap * 0.5} ${mainY + 20} ${startX + gap} ${featureY}`}
            fill="none"
            stroke="#3b82f6"
            strokeWidth="2"
            strokeDasharray="4 3"
          />

          {/* Feature branch line (before) */}
          <line
            x1={startX + gap}
            y1={featureY}
            x2={featureBeforeCommits[featureBeforeCommits.length - 1].x}
            y2={featureY}
            stroke="#3b82f6"
            strokeWidth="2"
            strokeLinecap="round"
          />

          {/* Feature branch label */}
          <text
            x={startX - 8}
            y={featureY + 4}
            textAnchor="end"
            className="fill-accent-blue text-[10px] font-mono"
          >
            feature
          </text>

          {/* Feature branch commits (before) */}
          {featureBeforeCommits.map((c) => (
            <g key={c.sha}>
              <circle
                cx={c.x}
                cy={featureY}
                r={r}
                fill={c.isConflict ? "#451a03" : "#172554"}
                stroke={c.isConflict ? "#f59e0b" : "#3b82f6"}
                strokeWidth="2"
              />
              {c.isConflict && (
                <circle
                  cx={c.x}
                  cy={featureY}
                  r={r + 4}
                  fill="none"
                  stroke="#f59e0b"
                  strokeWidth="1"
                  opacity="0.4"
                />
              )}
              <text
                x={c.x}
                y={featureY + 22}
                textAnchor="middle"
                className={`text-[9px] font-mono ${c.isConflict ? "fill-accent-amber" : "fill-accent-blue"}`}
              >
                {c.label}
              </text>
            </g>
          ))}

          {/* ===== DIVIDER ===== */}
          <line
            x1={dividerX}
            y1={10}
            x2={dividerX}
            y2={h - 10}
            stroke="#2a2a3a"
            strokeWidth="1"
            strokeDasharray="6 4"
          />
          <rect
            x={dividerX - 28}
            y={h / 2 - 10}
            width={56}
            height={20}
            rx={10}
            fill="#1a1a24"
            stroke="#2a2a3a"
            strokeWidth="1"
          />
          <text
            x={dividerX}
            y={h / 2 + 4}
            textAnchor="middle"
            className="fill-text-secondary text-[9px] font-medium uppercase tracking-wide"
          >
            Rebase
          </text>

          {/* ===== AFTER SIDE ===== */}
          {/* "After" label */}
          <text
            x={afterStartX + gap * 1.5}
            y={18}
            textAnchor="middle"
            className="fill-text-secondary text-[11px] font-medium uppercase tracking-wider"
          >
            After Rebase
          </text>

          {/* Main branch line (after) - extends through replayed commits */}
          <line
            x1={afterMainX}
            y1={mainY}
            x2={afterFeatureCommits[afterFeatureCommits.length - 1].x}
            y2={mainY}
            stroke="#4b5563"
            strokeWidth="2"
            strokeLinecap="round"
          />

          {/* Main HEAD node */}
          <g>
            <circle
              cx={afterMainX}
              cy={mainY}
              r={r}
              fill="#1f2937"
              stroke="#4b5563"
              strokeWidth="2"
            />
            <text
              x={afterMainX}
              y={mainY - 16}
              textAnchor="middle"
              className="fill-text-secondary text-[9px] font-mono"
            >
              {newBase.sha.slice(0, 7)}
            </text>
          </g>

          {/* Replayed feature commits on top of main */}
          {afterFeatureCommits.map((c) => (
            <g key={c.sha}>
              <circle
                cx={c.x}
                cy={mainY}
                r={r}
                fill={c.isConflict ? "#451a03" : "#172554"}
                stroke={c.isConflict ? "#f59e0b" : "#3b82f6"}
                strokeWidth="2"
              />
              {c.isConflict && (
                <circle
                  cx={c.x}
                  cy={mainY}
                  r={r + 4}
                  fill="none"
                  stroke="#f59e0b"
                  strokeWidth="1"
                  opacity="0.4"
                />
              )}
              <text
                x={c.x}
                y={mainY - 16}
                textAnchor="middle"
                className={`text-[9px] font-mono ${c.isConflict ? "fill-accent-amber" : "fill-accent-blue"}`}
              >
                {c.label}
              </text>
            </g>
          ))}

          {/* Feature branch label (after) */}
          <text
            x={afterFeatureCommits[afterFeatureCommits.length - 1].x + 16}
            y={mainY + 4}
            className="fill-accent-blue text-[10px] font-mono"
          >
            HEAD
          </text>
        </svg>
      </div>

      {/* Description */}
      <div className="px-4 py-3 border-t border-border-subtle">
        <p className="text-xs text-text-secondary leading-relaxed">
          {rebaseInfo.description}
        </p>
      </div>
    </div>
  );
}
