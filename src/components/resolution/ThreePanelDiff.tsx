import { useRef, useCallback, useMemo } from "react";
import { Highlight, themes } from "prism-react-renderer";
import clsx from "clsx";
import { computeThreeWayDiff, type DiffLine } from "../../utils/diff";

interface ThreePanelDiffProps {
  original: string;
  conflicting: string;
  aiResolution: string;
  language: string;
}

/** Render a line's content with word-level change highlights */
function renderLineWithChanges(
  content: string,
  changes: [number, number][] | undefined,
  markClass: string
) {
  if (!changes || changes.length === 0) {
    return <>{content}</>;
  }

  const parts: React.ReactNode[] = [];
  let lastEnd = 0;

  for (const [start, end] of changes) {
    if (start > lastEnd) {
      parts.push(content.slice(lastEnd, start));
    }
    parts.push(
      <mark key={start} className={markClass}>
        {content.slice(start, end)}
      </mark>
    );
    lastEnd = end;
  }
  if (lastEnd < content.length) {
    parts.push(content.slice(lastEnd));
  }

  return <>{parts}</>;
}

function DiffCodeBlock({
  code,
  language,
  label,
  labelColor,
  elevated,
  diffLines,
  lineBgClass,
  markClass,
  scrollRef,
  onScroll,
}: {
  code: string;
  language: string;
  label: string;
  labelColor: string;
  elevated?: boolean;
  diffLines: DiffLine[];
  lineBgClass: string;
  markClass: string;
  scrollRef: React.RefObject<HTMLDivElement | null>;
  onScroll: () => void;
}) {
  return (
    <div
      className={clsx(
        "flex flex-col min-w-0 relative",
        elevated && "bg-accent-green/[0.06]"
      )}
    >
      <div
        className={clsx(
          "font-semibold px-3 border-b border-border-subtle tracking-wide uppercase flex items-center gap-1.5",
          elevated ? "text-[12px] py-2 bg-accent-green/[0.08]" : "text-[11px] py-1.5"
        )}
        style={{ color: labelColor }}
      >
        {elevated && (
          <span className="w-1.5 h-1.5 rounded-full bg-accent-green animate-pulse" />
        )}
        {label}
      </div>
      <div
        ref={scrollRef}
        className="overflow-auto flex-1"
        onScroll={onScroll}
      >
        <Highlight theme={themes.vsDark} code={code.trim()} language={language}>
          {({ tokens, getLineProps, getTokenProps }) => (
            <pre className="text-[12px] leading-[1.65] p-0 m-0 bg-transparent font-mono">
              {tokens.map((line, i) => {
                const diff = diffLines[i];
                const isChanged =
                  diff && diff.status !== "equal" && diff.content !== "";
                const isEmpty = diff && diff.content === "" && diff.status === "equal";

                return (
                  <div
                    key={i}
                    {...getLineProps({ line })}
                    className={clsx(
                      "flex px-3 py-0 min-h-[1.65em] border-l-2 transition-colors",
                      isChanged ? lineBgClass : "border-transparent",
                      isEmpty && "opacity-0 select-none"
                    )}
                  >
                    <span className="w-8 flex-shrink-0 text-right pr-3 select-none text-[11px] text-text-secondary/20">
                      {!isEmpty ? i + 1 : ""}
                    </span>
                    <span className="flex-1">
                      {isChanged && diff.changes && diff.changes.length > 0
                        ? renderLineWithChanges(
                            line.map((t) => t.content).join(""),
                            diff.changes,
                            markClass
                          )
                        : line.map((token, key) => (
                            <span key={key} {...getTokenProps({ token })} />
                          ))}
                    </span>
                  </div>
                );
              })}
            </pre>
          )}
        </Highlight>
      </div>
    </div>
  );
}

export function ThreePanelDiff({
  original,
  conflicting,
  aiResolution,
  language,
}: ThreePanelDiffProps) {
  const leftRef = useRef<HTMLDivElement>(null);
  const midRef = useRef<HTMLDivElement>(null);
  const rightRef = useRef<HTMLDivElement>(null);
  const isSyncing = useRef(false);

  const diff = useMemo(
    () => computeThreeWayDiff(original, conflicting, aiResolution),
    [original, conflicting, aiResolution]
  );

  // Only the AI Resolution column gets highlighting — the other two
  // are neutral reference panels so the reviewer's eye is drawn to
  // what the AI actually decided.
  const neutralLines = useMemo(
    () =>
      Array.from({ length: Math.max(original.trim().split("\n").length, conflicting.trim().split("\n").length) }, () => ({
        content: " ",
        status: "equal" as const,
      })),
    [original, conflicting]
  );

  const syncScroll = useCallback(
    (source: React.RefObject<HTMLDivElement | null>) => {
      if (isSyncing.current) return;
      isSyncing.current = true;

      const el = source.current;
      if (!el) {
        isSyncing.current = false;
        return;
      }

      const { scrollTop, scrollLeft } = el;

      for (const ref of [leftRef, midRef, rightRef]) {
        if (ref !== source && ref.current) {
          ref.current.scrollTop = scrollTop;
          ref.current.scrollLeft = scrollLeft;
        }
      }

      requestAnimationFrame(() => {
        isSyncing.current = false;
      });
    },
    []
  );

  return (
    <div className="grid grid-cols-3 divide-x divide-border-subtle bg-[#0d0d14] min-h-[180px]">
      <DiffCodeBlock
        code={original}
        language={language}
        label="Original"
        labelColor="#8888a0"
        diffLines={neutralLines}
        lineBgClass="border-transparent"
        markClass=""
        scrollRef={leftRef}
        onScroll={() => syncScroll(leftRef)}
      />
      <DiffCodeBlock
        code={conflicting}
        language={language}
        label="Conflict"
        labelColor="#ef4444"
        diffLines={neutralLines}
        lineBgClass="border-transparent"
        markClass=""
        scrollRef={midRef}
        onScroll={() => syncScroll(midRef)}
      />
      <DiffCodeBlock
        code={aiResolution}
        language={language}
        label="AI Resolution"
        labelColor="#22c55e"
        elevated
        diffLines={diff.aiResolution}
        lineBgClass="bg-accent-green/[0.14] border-accent-green/50"
        markClass="bg-accent-green/25 rounded-sm px-px text-accent-green"
        scrollRef={rightRef}
        onScroll={() => syncScroll(rightRef)}
      />
    </div>
  );
}
