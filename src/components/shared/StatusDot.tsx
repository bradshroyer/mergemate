import clsx from "clsx";
import type { ConflictStatus } from "../../data/types";

export function StatusDot({ status }: { status: ConflictStatus }) {
  return (
    <span
      className={clsx("w-2 h-2 rounded-full flex-shrink-0", {
        "bg-accent-amber": status === "pending",
        "bg-accent-green": status === "approved",
        "bg-accent-red": status === "denied",
      })}
    />
  );
}
