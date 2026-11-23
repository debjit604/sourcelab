import { createReconServer } from "./api";

const PORT = parseInt(process.env.PORT || "4000", 10);
const turnstileSecret = process.env.TURNSTILE_SECRET_KEY;
const allowedOrigins = process.env.ALLOWED_ORIGINS
  ? process.env.ALLOWED_ORIGINS.split(",").map((s) => s.trim())
  : undefined;

const server = createReconServer({
  turnstileSecret,
  allowedOrigins,
});

server.listen(PORT, () => {
  console.log(`[SourceLab Recon Service] Running on http://0.0.0.0:${PORT}`);
  console.log(`[SourceLab Recon Service] Abuse controls & SSRF guard ACTIVE`);
});

// Graceful shutdown
process.on("SIGTERM", () => {
  console.log("[SourceLab Recon Service] SIGTERM received. Shutting down gracefully...");
  server.close(() => {
    process.exit(0);
  });
});
