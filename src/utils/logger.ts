type LogLevel = "debug" | "info" | "warn" | "error";

interface LogEntry {
  timestamp: string;
  level: LogLevel;
  message: string;
  context?: string;
  meta?: Record<string, unknown>;
  error?: {
    name: string;
    message: string;
    stack?: string;
  };
}

export class Logger {
  private static readonly isDev = process.env.NODE_ENV !== "production";

  private static serialize(
    level: LogLevel,
    message: string,
    options?: {
      context?: string;
      meta?: Record<string, unknown>;
      error?: unknown;
    },
  ): string {
    const entry: LogEntry = {
      timestamp: new Date().toISOString(),
      level,
      message,
    };

    if (options?.context) entry.context = options.context;
    if (options?.meta) entry.meta = options.meta;

    if (options?.error instanceof Error) {
      entry.error = {
        name: options.error.name,
        message: options.error.message,
        stack: this.isDev ? options.error.stack : undefined,
      };
    }

    return JSON.stringify(entry);
  }

  static debug(
    message: string,
    meta?: Record<string, unknown>,
    context?: string,
  ): void {
    if (!this.isDev) return;
    console.debug(this.serialize("debug", message, { context, meta }));
  }

  static info(
    message: string,
    meta?: Record<string, unknown>,
    context?: string,
  ): void {
    console.info(this.serialize("info", message, { context, meta }));
  }

  static warn(
    message: string,
    meta?: Record<string, unknown>,
    context?: string,
  ): void {
    console.warn(this.serialize("warn", message, { context, meta }));
  }

  static error(
    message: string,
    error?: unknown,
    meta?: Record<string, unknown>,
    context?: string,
  ): void {
    console.error(this.serialize("error", message, { context, meta, error }));
  }
}
