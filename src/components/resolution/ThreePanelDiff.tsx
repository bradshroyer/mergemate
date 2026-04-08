import { Highlight, themes } from "prism-react-renderer";

interface ThreePanelDiffProps {
  original: string;
  conflicting: string;
  aiResolution: string;
  language: string;
}

function CodeBlock({
  code,
  language,
  label,
  labelColor,
}: {
  code: string;
  language: string;
  label: string;
  labelColor: string;
}) {
  return (
    <div className="flex flex-col min-w-0">
      <div
        className="text-xs font-medium px-3 py-1.5 border-b border-border-subtle"
        style={{ color: labelColor }}
      >
        {label}
      </div>
      <div className="overflow-auto flex-1">
        <Highlight theme={themes.vsDark} code={code.trim()} language={language}>
          {({ tokens, getLineProps, getTokenProps }) => (
            <pre className="text-xs leading-5 p-3 m-0 bg-transparent">
              {tokens.map((line, i) => (
                <div key={i} {...getLineProps({ line })} className="flex">
                  <span className="w-8 flex-shrink-0 text-right pr-3 text-text-secondary/30 select-none">
                    {i + 1}
                  </span>
                  <span className="flex-1">
                    {line.map((token, key) => (
                      <span key={key} {...getTokenProps({ token })} />
                    ))}
                  </span>
                </div>
              ))}
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
  return (
    <div className="grid grid-cols-3 divide-x divide-border-subtle bg-[#1e1e1e] min-h-[200px]">
      <CodeBlock
        code={original}
        language={language}
        label="Original (base)"
        labelColor="#8888a0"
      />
      <CodeBlock
        code={conflicting}
        language={language}
        label="Conflict (theirs)"
        labelColor="#ef4444"
      />
      <CodeBlock
        code={aiResolution}
        language={language}
        label="AI Resolution"
        labelColor="#22c55e"
      />
    </div>
  );
}
