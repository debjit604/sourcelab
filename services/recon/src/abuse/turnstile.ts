export interface TurnstileVerifyResult {
  success: boolean;
  error?: string;
  challengeTs?: string;
  hostname?: string;
}

export async function verifyTurnstileToken(
  token: string | undefined,
  remoteIp?: string,
  secretKey?: string
): Promise<TurnstileVerifyResult> {
  const isProd = process.env.NODE_ENV === "production";
  const secret = secretKey || process.env.TURNSTILE_SECRET_KEY;

  // Test mode bypass is STRICTLY forbidden when running in production
  if (!isProd && (process.env.RECON_TEST_MODE === "true" || secret === "test-secret" || !secret)) {
    if (token === "invalid-token") {
      return { success: false, error: "Invalid test turnstile token" };
    }
    return { success: true };
  }

  if (!secret) {
    return { success: false, error: "Turnstile secret key is not configured" };
  }

  if (!token) {
    return { success: false, error: "Missing Turnstile verification token" };
  }

  try {
    const formData = new URLSearchParams();
    formData.append("secret", secret);
    formData.append("response", token);
    if (remoteIp) formData.append("remoteip", remoteIp);

    const res = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
      method: "POST",
      body: formData,
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    });

    if (!res.ok) {
      return { success: false, error: `Turnstile verification failed with HTTP ${res.status}` };
    }

    const data = (await res.json()) as {
      success: boolean;
      "error-codes"?: string[];
      challenge_ts?: string;
      hostname?: string;
    };

    if (!data.success) {
      const errList = data["error-codes"]?.join(", ") || "token_rejected";
      return { success: false, error: `Turnstile rejected: ${errList}` };
    }

    return {
      success: true,
      challengeTs: data.challenge_ts,
      hostname: data.hostname,
    };
  } catch (err) {
    return {
      success: false,
      error: `Turnstile request error: ${err instanceof Error ? err.message : String(err)}`,
    };
  }
}
