import crypto from "crypto";

export interface AuditLogEntry {
  id: string;
  timestamp: number;
  targetDomain: string;
  targetDomainHash: string;
  clientIpHash: string;
}

const SEVEN_DAYS_MS = 7 * 24 * 60 * 60 * 1000;
const IP_SALT = process.env.AUDIT_IP_SALT || "sourcelab-audit-salt-2026";

export class AbuseAuditLogger {
  private logs: AuditLogEntry[] = [];
  private readonly maxRetentionMs: number;

  constructor(maxRetentionMs = SEVEN_DAYS_MS) {
    this.maxRetentionMs = maxRetentionMs;
  }

  public logScan(targetHost: string, clientIp: string, now: number = Date.now()): AuditLogEntry {
    this.purgeExpired(now);

    const normHost = targetHost.trim().toLowerCase();
    const hostHash = crypto.createHash("sha256").update(normHost).digest("hex");
    const ipHash = crypto
      .createHash("sha256")
      .update(`${clientIp.trim()}-${IP_SALT}`)
      .digest("hex");

    const entry: AuditLogEntry = {
      id: crypto.randomUUID ? crypto.randomUUID() : Math.random().toString(36).substring(2),
      timestamp: now,
      targetDomain: normHost,
      targetDomainHash: hostHash,
      clientIpHash: ipHash,
    };

    this.logs.push(entry);
    return entry;
  }

  public purgeExpired(now: number = Date.now()): number {
    const cutoff = now - this.maxRetentionMs;
    const initialCount = this.logs.length;
    this.logs = this.logs.filter((log) => log.timestamp > cutoff);
    return initialCount - this.logs.length;
  }

  public getEntries(): ReadonlyArray<AuditLogEntry> {
    return this.logs;
  }

  public clear(): void {
    this.logs = [];
  }
}

export const auditLogger = new AbuseAuditLogger();
