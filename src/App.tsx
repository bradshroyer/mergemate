import { useState, useCallback } from "react";
import { mockReport } from "./data/mockConflicts";
import type { ConflictStatus } from "./data/types";
import { Sidebar } from "./components/layout/Sidebar";
import { MainContent } from "./components/main/MainContent";

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

  const selectedConflict = mockReport.conflicts.find(
    (c) => c.id === selectedConflictId
  );

  const updateHunkStatus = useCallback(
    (hunkId: string, status: ConflictStatus) => {
      setHunkStatuses((prev) => ({ ...prev, [hunkId]: status }));
    },
    []
  );

  const updateAllStatuses = useCallback(
    (status: ConflictStatus) => {
      setHunkStatuses((prev) => {
        const next = { ...prev };
        for (const key of Object.keys(next)) {
          next[key] = status;
        }
        return next;
      });
    },
    []
  );

  return (
    <div className="flex h-screen overflow-hidden font-sans">
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
      />
    </div>
  );
}

export default App;
