import { useEffect } from "react";
import { CheckCircle2, XCircle, Info, Undo2 } from "lucide-react";

interface ToastAction {
  label: string;
  onClick: () => void;
}

interface ToastProps {
  message: string;
  type: "success" | "error" | "info";
  onDismiss: () => void;
  action?: ToastAction;
}

const icons = {
  success: CheckCircle2,
  error: XCircle,
  info: Info,
};

const colors = {
  success: "text-accent-green",
  error: "text-accent-red",
  info: "text-accent-blue",
};

const bgColors = {
  success: "bg-accent-green/8",
  error: "bg-accent-red/8",
  info: "bg-accent-blue/8",
};

export function Toast({ message, type, onDismiss, action }: ToastProps) {
  const Icon = icons[type];
  const duration = action ? 5000 : 2800;

  useEffect(() => {
    const timer = setTimeout(onDismiss, duration);
    return () => clearTimeout(timer);
  }, [onDismiss, duration]);

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50">
      <div
        className={`flex items-center gap-2.5 px-4 py-2.5 rounded-xl border border-border-subtle ${bgColors[type]} backdrop-blur-xl shadow-2xl shadow-black/40`}
        style={{ animation: "toast-in 0.35s cubic-bezier(0.16, 1, 0.3, 1) both" }}
      >
        <Icon className={`w-4 h-4 ${colors[type]}`} />
        <span className="text-sm font-medium text-text-primary">{message}</span>
        {action && (
          <>
            <span className="w-px h-4 bg-border-subtle ml-1" />
            <button
              onClick={() => {
                action.onClick();
                onDismiss();
              }}
              className="flex items-center gap-1 text-[12px] font-semibold text-text-primary hover:text-accent-blue transition-colors"
            >
              <Undo2 className="w-3 h-3" />
              {action.label}
            </button>
          </>
        )}
      </div>
    </div>
  );
}
