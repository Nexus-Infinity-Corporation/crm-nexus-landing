export interface DemoFormData {
  name: string;
  company: string;
  email: string;
  phone: string;
  agents: string;
  lang: "en" | "es";
}

export interface SendEmailResult {
  success: boolean;
  error?: string;
}

/**
 * Submits the demo form to the /api/send-demo endpoint.
 * Handles fetch errors and returns a typed result.
 */
export async function sendDemoEmail(
  data: DemoFormData,
): Promise<SendEmailResult> {
  try {
    const res = await fetch("/api/send-demo", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    const json = (await res.json()) as SendEmailResult;
    return json;
  } catch (err) {
    console.error("[sendDemoEmail] Network error:", err);
    return { success: false, error: "Network error. Please try again." };
  }
}
