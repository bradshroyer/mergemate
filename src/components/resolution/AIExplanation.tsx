import { Sparkles } from "lucide-react";

interface AIExplanationProps {
  explanation: string;
}

export function AIExplanation({ explanation }: AIExplanationProps) {
  return (
    <div className="px-4 py-3 border-t border-border-subtle bg-accent-purple/[0.04]">
      <div className="flex items-start gap-2.5">
        <div className="w-5 h-5 rounded-md bg-accent-purple/15 flex items-center justify-center flex-shrink-0 mt-0.5">
          <Sparkles className="w-3 h-3 text-accent-purple" />
        </div>
        <div>
          <div className="text-xs font-medium text-accent-purple mb-1">
            AI Reasoning
          </div>
          <p className="text-xs text-text-secondary leading-relaxed">
            {explanation}
          </p>
        </div>
      </div>
    </div>
  );
}
