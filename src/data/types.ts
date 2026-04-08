export type ConflictStatus = "pending" | "approved" | "denied";

export interface CommitInfo {
  sha: string;
  shortMessage: string;
  author: string;
  timestamp: string;
}

export interface ConflictHunk {
  id: string;
  startLine: number;
  endLine: number;
  original: string;
  conflicting: string;
  aiResolution: string;
  explanation: string;
  status: ConflictStatus;
}

export interface FileConflict {
  id: string;
  filePath: string;
  language: string;
  commit: CommitInfo;
  hunks: ConflictHunk[];
}

export interface RebaseInfo {
  baseBranch: string;
  featureBranch: string;
  originalBase: CommitInfo;
  newBase: CommitInfo;
  commits: CommitInfo[];
  description: string;
}

export interface MergeConflictReport {
  rebaseInfo: RebaseInfo;
  conflicts: FileConflict[];
}
