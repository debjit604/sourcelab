import tls from "tls";

export interface SslCertInfo {
  subject: Record<string, string>;
  issuer: Record<string, string>;
  validFrom: string;
  validTo: string;
  daysRemaining: number;
  isExpired: boolean;
  subjectAltNames: string[];
  protocol: string;
  cipherName: string;
  cipherVersion: string;
  serialNumber: string;
  fingerprint256: string;
  warnings: string[];
}

export async function inspectTlsCertificate(
  hostname: string,
  pinnedIp: string,
  port = 443,
  timeoutMs = 5_000
): Promise<SslCertInfo> {
  return new Promise((resolve, reject) => {
    let settled = false;
    const warnings: string[] = [];

    const socket = tls.connect(
      {
        host: pinnedIp, // Connect to pre-verified pinned IP
        port,
        servername: hostname, // SNI
        rejectUnauthorized: false, // Allow reading cert details even if self-signed or expired
        timeout: timeoutMs,
      },
      () => {
        if (settled) return;
        settled = true;

        const cert = socket.getPeerCertificate(true);
        const cipher = socket.getCipher();
        const protocol = socket.getProtocol() || "unknown";

        if (!cert || Object.keys(cert).length === 0) {
          socket.destroy();
          return reject(new Error("No TLS certificate presented by the peer"));
        }

        const validTo = cert.valid_to || "";
        const validFrom = cert.valid_from || "";
        const expiryDate = new Date(validTo);
        const now = new Date();
        const daysRemaining = Math.floor((expiryDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
        const isExpired = daysRemaining < 0;

        if (isExpired) {
          warnings.push(`Certificate has expired ${Math.abs(daysRemaining)} days ago.`);
        } else if (daysRemaining <= 14) {
          warnings.push(`Certificate will expire soon in ${daysRemaining} days.`);
        }

        if (protocol === "TLSv1" || protocol === "TLSv1.1") {
          warnings.push(`Deprecated and insecure TLS protocol version in use: ${protocol}.`);
        }

        // Parse SAN (Subject Alternative Names)
        const sanList: string[] = [];
        if (cert.subjectaltname) {
          const parts = cert.subjectaltname.split(",");
          for (const p of parts) {
            const trimmed = p.trim().replace(/^DNS:/i, "");
            if (trimmed) sanList.push(trimmed);
          }
        }

        const subjectRecord: Record<string, string> = {};
        if (cert.subject) {
          for (const [k, v] of Object.entries(cert.subject)) {
            if (typeof v === "string") subjectRecord[k] = v;
          }
        }

        const issuerRecord: Record<string, string> = {};
        if (cert.issuer) {
          for (const [k, v] of Object.entries(cert.issuer)) {
            if (typeof v === "string") issuerRecord[k] = v;
          }
        }

        socket.destroy();

        resolve({
          subject: subjectRecord,
          issuer: issuerRecord,
          validFrom,
          validTo,
          daysRemaining: Math.max(0, daysRemaining),
          isExpired,
          subjectAltNames: sanList,
          protocol,
          cipherName: cipher?.name || "unknown",
          cipherVersion: cipher?.version || "unknown",
          serialNumber: cert.serialNumber || "",
          fingerprint256: cert.fingerprint256 || "",
          warnings,
        });
      }
    );

    socket.on("timeout", () => {
      if (!settled) {
        settled = true;
        socket.destroy();
        reject(new Error(`TLS handshake timed out after ${timeoutMs}ms`));
      }
    });

    socket.on("error", (err) => {
      if (!settled) {
        settled = true;
        socket.destroy();
        reject(new Error(`TLS connection error: ${err.message}`));
      }
    });
  });
}
