import type { MergeConflictReport } from "./types";

export const mockReport: MergeConflictReport = {
  rebaseInfo: {
    baseBranch: "main",
    featureBranch: "feature/user-auth",
    originalBase: {
      sha: "8f3a1b2",
      shortMessage: "chore: update CI pipeline config",
      author: "Devon Park",
      timestamp: "2026-04-01T10:30:00Z",
    },
    newBase: {
      sha: "c7d9e4f",
      shortMessage: "fix: rate limiter edge case on burst traffic",
      author: "Morgan Chen",
      timestamp: "2026-04-07T14:22:00Z",
    },
    commits: [
      {
        sha: "a1b2c3d",
        shortMessage: "feat: add JWT auth middleware",
        author: "Alex Rivera",
        timestamp: "2026-04-02T09:15:00Z",
      },
      {
        sha: "e4f5g6h",
        shortMessage: "refactor: structured logging with correlation IDs",
        author: "Alex Rivera",
        timestamp: "2026-04-03T11:45:00Z",
      },
      {
        sha: "i7j8k9l",
        shortMessage: "feat: connection pool and retry config",
        author: "Alex Rivera",
        timestamp: "2026-04-04T16:20:00Z",
      },
    ],
    description:
      "Rebasing feature/user-auth onto main. The feature branch was 3 commits behind main (original base: 8f3a1b2). During replay, 4 files across 3 commits produced merge conflicts due to overlapping changes in the auth middleware, API routes, logger utility, and database configuration.",
  },
  conflicts: [
    {
      id: "conflict-1",
      filePath: "src/auth/middleware.ts",
      language: "typescript",
      commit: {
        sha: "a1b2c3d",
        shortMessage: "feat: add JWT auth middleware",
        author: "Alex Rivera",
        timestamp: "2026-04-02T09:15:00Z",
      },
      hunks: [
        {
          id: "hunk-1a",
          startLine: 12,
          endLine: 28,
          original: `import { Request, Response, NextFunction } from "express";
import { verifyToken } from "../utils/jwt";

export function authMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res.status(401).json({ error: "No token provided" });
  }

  const decoded = verifyToken(token);
  req.user = decoded;
  next();
}`,
          conflicting: `import { Request, Response, NextFunction } from "express";
import { verifyToken, TokenPayload } from "../utils/jwt";
import { RateLimiter } from "../utils/rateLimiter";

const limiter = new RateLimiter({ windowMs: 60000, max: 100 });

export function authMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
) {
  if (!limiter.check(req.ip)) {
    return res.status(429).json({ error: "Too many requests" });
  }

  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res.status(401).json({ error: "No token provided" });
  }

  const decoded: TokenPayload = verifyToken(token);
  req.user = decoded;
  next();
}`,
          aiResolution: `import { Request, Response, NextFunction } from "express";
import { verifyToken, TokenPayload } from "../utils/jwt";
import { RateLimiter } from "../utils/rateLimiter";
import { logger } from "../utils/logger";

const limiter = new RateLimiter({ windowMs: 60000, max: 100 });

export function authMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
) {
  if (!limiter.check(req.ip)) {
    logger.warn("Rate limit exceeded", { ip: req.ip });
    return res.status(429).json({ error: "Too many requests" });
  }

  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res.status(401).json({ error: "No token provided" });
  }

  const decoded: TokenPayload = verifyToken(token);
  req.user = decoded;
  next();
}`,
          explanation:
            "Merged the rate limiter from main with the auth middleware from the feature branch. Added the logger import and a warning log on rate-limit hits, since the structured logging system (from commit e4f5g6h) is now available. Kept the TokenPayload type annotation from main for type safety.",
          status: "pending",
        },
        {
          id: "hunk-1b",
          startLine: 35,
          endLine: 52,
          original: `export function requireRole(role: string) {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({ error: "Not authenticated" });
    }

    if (req.user.role !== role) {
      return res.status(403).json({ error: "Insufficient permissions" });
    }

    next();
  };
}`,
          conflicting: `export function requireRole(...roles: string[]) {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({ error: "Not authenticated" });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        error: "Insufficient permissions",
        required: roles,
        actual: req.user.role,
      });
    }

    next();
  };
}`,
          aiResolution: `export function requireRole(...roles: string[]) {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({ error: "Not authenticated" });
    }

    if (!roles.includes(req.user.role)) {
      logger.warn("Permission denied", {
        userId: req.user.id,
        required: roles,
        actual: req.user.role,
      });
      return res.status(403).json({
        error: "Insufficient permissions",
        required: roles,
        actual: req.user.role,
      });
    }

    next();
  };
}`,
          explanation:
            "Adopted main's multi-role signature (rest params) since it's strictly more capable than the single-role version. Preserved the detailed error response from main and added a structured logger.warn call with the user context for audit trail purposes.",
          status: "pending",
        },
      ],
    },
    {
      id: "conflict-2",
      filePath: "src/api/routes/users.ts",
      language: "typescript",
      commit: {
        sha: "a1b2c3d",
        shortMessage: "feat: add JWT auth middleware",
        author: "Alex Rivera",
        timestamp: "2026-04-02T09:15:00Z",
      },
      hunks: [
        {
          id: "hunk-2a",
          startLine: 1,
          endLine: 18,
          original: `import { Router } from "express";
import { authMiddleware } from "../../auth/middleware";
import { UserService } from "../../services/user";

const router = Router();
const userService = new UserService();

router.get("/me", authMiddleware, async (req, res) => {
  const user = await userService.findById(req.user.id);
  res.json(user);
});

router.patch("/me", authMiddleware, async (req, res) => {
  const updated = await userService.update(req.user.id, req.body);
  res.json(updated);
});`,
          conflicting: `import { Router } from "express";
import { authMiddleware, requireRole } from "../../auth/middleware";
import { UserService } from "../../services/user";
import { validateBody } from "../../middleware/validation";
import { updateUserSchema } from "../../schemas/user";

const router = Router();
const userService = new UserService();

router.get("/me", authMiddleware, async (req, res) => {
  const user = await userService.findById(req.user.id);
  res.json(user);
});

router.patch(
  "/me",
  authMiddleware,
  validateBody(updateUserSchema),
  async (req, res) => {
    const updated = await userService.update(req.user.id, req.body);
    res.json(updated);
  }
);

router.get(
  "/admin/users",
  authMiddleware,
  requireRole("admin"),
  async (_req, res) => {
    const users = await userService.listAll();
    res.json(users);
  }
);`,
          aiResolution: `import { Router } from "express";
import { authMiddleware, requireRole } from "../../auth/middleware";
import { UserService } from "../../services/user";
import { validateBody } from "../../middleware/validation";
import { updateUserSchema } from "../../schemas/user";

const router = Router();
const userService = new UserService();

router.get("/me", authMiddleware, async (req, res) => {
  const user = await userService.findById(req.user.id);
  res.json(user);
});

router.patch(
  "/me",
  authMiddleware,
  validateBody(updateUserSchema),
  async (req, res) => {
    const updated = await userService.update(req.user.id, req.body);
    res.json(updated);
  }
);

router.get(
  "/admin/users",
  authMiddleware,
  requireRole("admin"),
  async (_req, res) => {
    const users = await userService.listAll();
    res.json(users);
  }
);`,
          explanation:
            "The conflict was caused by main adding the validation middleware and admin route while the feature branch only had the basic routes. Took main's version entirely since it's a strict superset — adds body validation on PATCH and the new admin endpoint. No feature-branch logic was lost.",
          status: "pending",
        },
      ],
    },
    {
      id: "conflict-3",
      filePath: "src/utils/logger.ts",
      language: "typescript",
      commit: {
        sha: "e4f5g6h",
        shortMessage: "refactor: structured logging with correlation IDs",
        author: "Alex Rivera",
        timestamp: "2026-04-03T11:45:00Z",
      },
      hunks: [
        {
          id: "hunk-3a",
          startLine: 1,
          endLine: 24,
          original: `type LogLevel = "info" | "warn" | "error";

class Logger {
  private format(level: LogLevel, message: string): string {
    const timestamp = new Date().toISOString();
    return \`[\${timestamp}] [\${level.toUpperCase()}] \${message}\`;
  }

  info(message: string) {
    console.log(this.format("info", message));
  }

  warn(message: string) {
    console.warn(this.format("warn", message));
  }

  error(message: string) {
    console.error(this.format("error", message));
  }
}

export const logger = new Logger();`,
          conflicting: `type LogLevel = "info" | "warn" | "error" | "debug";

interface LogContext {
  [key: string]: unknown;
}

class Logger {
  private format(
    level: LogLevel,
    message: string,
    context?: LogContext
  ): string {
    const entry = {
      timestamp: new Date().toISOString(),
      level: level.toUpperCase(),
      message,
      ...context,
    };
    return JSON.stringify(entry);
  }

  info(message: string, context?: LogContext) {
    console.log(this.format("info", message, context));
  }

  warn(message: string, context?: LogContext) {
    console.warn(this.format("warn", message, context));
  }

  error(message: string, context?: LogContext) {
    console.error(this.format("error", message, context));
  }

  debug(message: string, context?: LogContext) {
    if (process.env.NODE_ENV !== "production") {
      console.debug(this.format("debug", message, context));
    }
  }
}

export const logger = new Logger();`,
          aiResolution: `type LogLevel = "info" | "warn" | "error" | "debug";

interface LogContext {
  correlationId?: string;
  [key: string]: unknown;
}

class Logger {
  private correlationId?: string;

  withCorrelationId(id: string): Logger {
    const child = new Logger();
    child.correlationId = id;
    return child;
  }

  private format(
    level: LogLevel,
    message: string,
    context?: LogContext
  ): string {
    const entry = {
      timestamp: new Date().toISOString(),
      level: level.toUpperCase(),
      message,
      correlationId: context?.correlationId ?? this.correlationId,
      ...context,
    };
    return JSON.stringify(entry);
  }

  info(message: string, context?: LogContext) {
    console.log(this.format("info", message, context));
  }

  warn(message: string, context?: LogContext) {
    console.warn(this.format("warn", message, context));
  }

  error(message: string, context?: LogContext) {
    console.error(this.format("error", message, context));
  }

  debug(message: string, context?: LogContext) {
    if (process.env.NODE_ENV !== "production") {
      console.debug(this.format("debug", message, context));
    }
  }
}

export const logger = new Logger();`,
          explanation:
            "Combined main's JSON structured logging with the feature branch's correlation ID requirement. Added a correlationId field to LogContext and a withCorrelationId factory method that creates child loggers with a bound ID. The correlation ID flows through all log entries automatically via the format method.",
          status: "pending",
        },
      ],
    },
    {
      id: "conflict-4",
      filePath: "src/config/database.ts",
      language: "typescript",
      commit: {
        sha: "i7j8k9l",
        shortMessage: "feat: connection pool and retry config",
        author: "Alex Rivera",
        timestamp: "2026-04-04T16:20:00Z",
      },
      hunks: [
        {
          id: "hunk-4a",
          startLine: 1,
          endLine: 16,
          original: `export interface DatabaseConfig {
  host: string;
  port: number;
  database: string;
  username: string;
  password: string;
}

export const dbConfig: DatabaseConfig = {
  host: process.env.DB_HOST ?? "localhost",
  port: Number(process.env.DB_PORT ?? 5432),
  database: process.env.DB_NAME ?? "mergemate",
  username: process.env.DB_USER ?? "postgres",
  password: process.env.DB_PASS ?? "",
};`,
          conflicting: `export interface DatabaseConfig {
  host: string;
  port: number;
  database: string;
  username: string;
  password: string;
  ssl: boolean;
  connectionTimeout: number;
}

export const dbConfig: DatabaseConfig = {
  host: process.env.DB_HOST ?? "localhost",
  port: Number(process.env.DB_PORT ?? 5432),
  database: process.env.DB_NAME ?? "mergemate",
  username: process.env.DB_USER ?? "postgres",
  password: process.env.DB_PASS ?? "",
  ssl: process.env.DB_SSL === "true",
  connectionTimeout: Number(process.env.DB_CONN_TIMEOUT ?? 5000),
};`,
          aiResolution: `export interface DatabaseConfig {
  host: string;
  port: number;
  database: string;
  username: string;
  password: string;
  ssl: boolean;
  connectionTimeout: number;
  pool: PoolConfig;
}

export interface PoolConfig {
  min: number;
  max: number;
  idleTimeoutMs: number;
}

export const dbConfig: DatabaseConfig = {
  host: process.env.DB_HOST ?? "localhost",
  port: Number(process.env.DB_PORT ?? 5432),
  database: process.env.DB_NAME ?? "mergemate",
  username: process.env.DB_USER ?? "postgres",
  password: process.env.DB_PASS ?? "",
  ssl: process.env.DB_SSL === "true",
  connectionTimeout: Number(process.env.DB_CONN_TIMEOUT ?? 5000),
  pool: {
    min: Number(process.env.DB_POOL_MIN ?? 2),
    max: Number(process.env.DB_POOL_MAX ?? 10),
    idleTimeoutMs: Number(process.env.DB_POOL_IDLE ?? 30000),
  },
};`,
          explanation:
            "Merged main's SSL and connection timeout fields with the feature branch's pool configuration. Extracted pool settings into a separate PoolConfig interface for clarity. All new fields use environment variables with sensible defaults matching the existing pattern.",
          status: "pending",
        },
        {
          id: "hunk-4b",
          startLine: 22,
          endLine: 40,
          original: `export async function connectDatabase(config: DatabaseConfig) {
  const client = new Client(config);
  await client.connect();
  console.log("Connected to database");
  return client;
}`,
          conflicting: `export async function connectDatabase(
  config: DatabaseConfig,
  retries = 3
) {
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      const client = new Client(config);
      await client.connect();
      console.log("Connected to database");
      return client;
    } catch (error) {
      console.error(\`Connection attempt \${attempt} failed\`, error);
      if (attempt === retries) throw error;
      await new Promise((r) => setTimeout(r, 1000 * attempt));
    }
  }
  throw new Error("Unreachable");
}`,
          aiResolution: `export async function connectDatabase(
  config: DatabaseConfig,
  retries = 3
) {
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      const pool = new Pool({
        ...config,
        ...config.pool,
      });
      await pool.connect();
      logger.info("Connected to database", {
        host: config.host,
        pool: config.pool,
      });
      return pool;
    } catch (error) {
      logger.error(\`Connection attempt \${attempt} failed\`, {
        attempt,
        retries,
        error: String(error),
      });
      if (attempt === retries) throw error;
      await new Promise((r) => setTimeout(r, 1000 * attempt));
    }
  }
  throw new Error("Unreachable");
}`,
          explanation:
            "Combined main's retry logic with the feature branch's connection pooling. Replaced single Client with Pool using the new pool config. Replaced console.log/error with the structured logger for consistency with the logging refactor in commit e4f5g6h. Added context fields (host, pool settings, attempt count) to log entries.",
          status: "pending",
        },
      ],
    },
  ],
};
