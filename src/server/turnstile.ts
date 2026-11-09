export interface TurnstileVerificationResponse {
  success: boolean;
  "error-codes"?: string[];
  challenge_ts?: string;
  hostname?: string;
  action?: string;
  cdata?: string;
}

export interface TurnstileVerifyResult {
  success: boolean;
  reason?: string;
  hostname?: string;
  action?: string;
  errorCodes?: string[];
}

const CLOUDFLARE_SITEVERIFY_URL =
  "https://challenges.cloudflare.com/turnstile/v0/siteverify";
const TIMEOUT_MS = 5000;

function getAllowedHostnames(): Set<string> {
  const raw = process.env.TURNSTILE_ALLOWED_HOSTNAMES ?? "";
  return new Set(
    raw
      .split(",")
      .map((h) => h.trim().toLowerCase())
      .filter(Boolean),
  );
}

/**
 * Validates a Cloudflare Turnstile token against the siteverify API.
 * Fail-closed: returns success=false if token is empty, secret is missing,
 * network times out, action does not match, or hostname is not allowed.
 */
export async function verifyTurnstile(
  token: unknown,
  expectedAction: string,
  clientIp?: string,
): Promise<TurnstileVerifyResult> {
  if (typeof token !== "string" || !token.trim()) {
    return { success: false, reason: "empty_token" };
  }

  const secretKey = process.env.TURNSTILE_SECRET_KEY;
  if (!secretKey) {
    console.error(
      "[turnstile] TURNSTILE_SECRET_KEY belum dikonfigurasi di server.",
    );
    return { success: false, reason: "missing_secret_key" };
  }

  const allowedHostnames = getAllowedHostnames();
  if (allowedHostnames.size === 0) {
    console.error(
      "[turnstile] TURNSTILE_ALLOWED_HOSTNAMES belum dikonfigurasi di server.",
    );
    return { success: false, reason: "missing_allowed_hostnames" };
  }

  const form = new URLSearchParams();
  form.append("secret", secretKey);
  form.append("response", token.trim());
  if (clientIp && clientIp !== "unknown") {
    form.append("remoteip", clientIp);
  }

  try {
    const res = await fetch(CLOUDFLARE_SITEVERIFY_URL, {
      method: "POST",
      headers: {
        "content-type": "application/x-www-form-urlencoded",
      },
      body: form.toString(),
      signal: AbortSignal.timeout(TIMEOUT_MS),
    });

    if (!res.ok) {
      console.warn(
        `[turnstile] Cloudflare Turnstile siteverify HTTP error: ${res.status}`,
      );
      return { success: false, reason: "http_error" };
    }

    const data = (await res.json()) as TurnstileVerificationResponse;

    if (!data.success) {
      console.warn(
        "[turnstile] Cloudflare Turnstile verification rejected:",
        data["error-codes"],
      );
      return {
        success: false,
        reason: "verification_rejected",
        errorCodes: data["error-codes"],
      };
    }

    if (expectedAction && data.action && data.action !== expectedAction) {
      console.warn(
        `[turnstile] Action mismatch. Expected '${expectedAction}', received '${data.action}'`,
      );
      return { success: false, reason: "action_mismatch" };
    }

    if (data.hostname && !allowedHostnames.has(data.hostname.toLowerCase())) {
      console.warn(
        `[turnstile] Hostname mismatch: ${data.hostname} not in allowed hostnames`,
      );
      return { success: false, reason: "hostname_mismatch" };
    }

    return {
      success: true,
      hostname: data.hostname,
      action: data.action,
    };
  } catch (error) {
    console.error("[turnstile] Siteverify request failed or timed out:", error);
    return { success: false, reason: "timeout_or_network_error" };
  }
}
