import { useState, useCallback } from "react";
import { mockReport } from "./data/mockConflicts";
import type { ConflictStatus } from "./data/types";
import { Sidebar } from "./components/layout/Sidebar";
import { MainContent } from "./components/main/MainContent";
import { Toolbar } from "./components/layout/Toolbar";
import { Toast } from "./components/shared/Toast";

function App() {
  const [selectedConflictId, setSelectedConflictId] = useState<string | null>(
    null
  );
  const [activeTab, setActiveTab] = useState<"file" | "sha">("file");
  const [hunkStatuses, setHunkStatuses] = useState<
    Record<string, ConflictStatus>
  >(() => {
    const initial: Record<string, ConflictStatus> = {};
    for (const conflict of mockReport.conflicts) {
      for (const hunk of conflict.hunks) {
        initial[hunk.id] = hunk.status;
      }
    }
    return initial;
  });
  const [toast, setToast] = useState<{
    message: string;
    type: "success" | "error" | "info";
    action?: { label: string; onClick: () => void };
  } | null>(null);

  const selectedConflict = mockReport.conflicts.find(
    (c) => c.id === selectedConflictId
  );

  const totalHunks = Object.keys(hunkStatuses).length;
  const approvedCount = Object.values(hunkStatuses).filter(
    (s) => s === "approved"
  ).length;
  const deniedCount = Object.values(hunkStatuses).filter(
    (s) => s === "denied"
  ).length;
  const reviewedCount = approvedCount + deniedCount;

  const showToast = useCallback(
    (
      message: string,
      type: "success" | "error" | "info" = "info",
      action?: { label: string; onClick: () => void }
    ) => {
      setToast({ message, type, action });
    },
    []
  );

  const updateHunkStatus = useCallback(
    (hunkId: string, status: ConflictStatus) => {
      setHunkStatuses((prev) => {
        const next = { ...prev, [hunkId]: status };
        const newApproved = Object.values(next).filter(
          (s) => s === "approved"
        ).length;
        if (newApproved === totalHunks && status === "approved") {
          setTimeout(() => showToast("All conflicts approved", "success"), 100);
        }
        return next;
      });
    },
    [totalHunks, showToast]
  );

  const updateAllStatuses = useCallback(
    (status: ConflictStatus) => {
      let snapshot: Record<string, ConflictStatus> | null = null;
      setHunkStatuses((prev) => {
        snapshot = prev;
        const next = { ...prev };
        for (const key of Object.keys(next)) {
          next[key] = status;
        }
        return next;
      });
      showToast(
        status === "approved"
          ? `All ${totalHunks} conflicts approved`
          : `All ${totalHunks} conflicts denied`,
        status === "approved" ? "success" : "error",
        {
          label: "Undo",
          onClick: () => {
            if (snapshot) setHunkStatuses(snapshot);
          },
        }
      );
    },
    [totalHunks, showToast]
  );

  const applyResolutions = useCallback(() => {
    if (approvedCount === 0) {
      showToast(
        `Rejected all ${deniedCount} resolutions \u00b7 resolve manually`,
        "error"
      );
    } else if (deniedCount === 0) {
      showToast(`Applied ${approvedCount} resolutions`, "success");
    } else {
      showToast(
        `Applied ${approvedCount} resolutions \u00b7 skipped ${deniedCount}`,
        "success"
      );
    }
  }, [approvedCount, deniedCount, showToast]);

  return (
    <div className="flex flex-col h-screen overflow-hidden font-sans">
      <Toolbar
        repoName="GitKraken/backend-api"
        prNumber={247}
        baseBranch={mockReport.rebaseInfo.baseBranch}
        featureBranch={mockReport.rebaseInfo.featureBranch}
        reviewedCount={reviewedCount}
        totalHunks={totalHunks}
      />
      <div className="flex flex-1 min-h-0">
        <Sidebar
          conflicts={mockReport.conflicts}
          activeTab={activeTab}
          onTabChange={setActiveTab}
          selectedConflictId={selectedConflictId}
          onSelectConflict={setSelectedConflictId}
          hunkStatuses={hunkStatuses}
        />
        <MainContent
          selectedConflict={selectedConflict ?? null}
          rebaseInfo={mockReport.rebaseInfo}
          hunkStatuses={hunkStatuses}
          onUpdateHunkStatus={updateHunkStatus}
          onApproveAll={() => updateAllStatuses("approved")}
          onDenyAll={() => updateAllStatuses("denied")}
          onApplyResolutions={applyResolutions}
        />
      </div>
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          action={toast.action}
          onDismiss={() => setToast(null)}
        />
      )}
    </div>
  );
}

export default App;
