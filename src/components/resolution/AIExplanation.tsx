import { Sparkles } from "lucide-react";

interface AIExplanationProps {
  explanation: string;
}

export function AIExplanation({ explanation }: AIExplanationProps) {
  return (
    <div className="px-4 py-3 border-t border-border-subtle bg-accent-purple/[0.03]">
      <div className="flex items-start gap-2.5">
        <div className="w-5 h-5 rounded bg-accent-purple/12 flex items-center justify-center flex-shrink-0 mt-0.5 ring-1 ring-accent-purple/15">
          <Sparkles className="w-3 h-3 text-accent-purple" />
        </div>
        <div>
          <div className="text-[11px] font-semibold text-accent-purple/80 mb-1 tracking-wide uppercase">
            AI Reasoning
          </div>
          <p className="text-[12px] text-text-secondary leading-[1.6]">
            {explanation}
          </p>
        </div>
      </div>
    </div>
  );
}
