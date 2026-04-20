import clsx from "clsx";
import type { ConflictStatus } from "../../data/types";

export type DotStatus = ConflictStatus | "mixed";

export function StatusDot({ status }: { status: DotStatus }) {
  return (
    <span className="relative flex-shrink-0">
      <span
        className={clsx("block w-2 h-2 rounded-full transition-colors duration-200", {
          "bg-accent-amber": status === "pending",
          "bg-accent-green": status === "approved",
          "bg-accent-red": status === "denied",
        })}
        style={
          status === "mixed"
            ? {
                background:
                  "linear-gradient(90deg, #22c55e 0%, #22c55e 50%, #ef4444 50%, #ef4444 100%)",
              }
            : undefined
        }
      />
      {status === "approved" && (
        <span className="absolute inset-0 rounded-full bg-accent-green/40 animate-ping" />
      )}
    </span>
  );
}
