import clsx from "clsx";
import type { ConflictStatus } from "../../data/types";

export function StatusDot({ status }: { status: ConflictStatus }) {
  return (
    <span className="relative flex-shrink-0">
      <span
        className={clsx("block w-2 h-2 rounded-full transition-colors duration-200", {
          "bg-accent-amber": status === "pending",
          "bg-accent-green": status === "approved",
          "bg-accent-red": status === "denied",
        })}
      />
      {status === "approved" && (
        <span className="absolute inset-0 rounded-full bg-accent-green/40 animate-ping" />
      )}
    </span>
  );
}
