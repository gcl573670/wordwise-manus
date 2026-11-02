export class ProviderError extends Error {
  constructor(public readonly provider: string, public readonly status: number | null, message: string) {
    super(message);
    this.name = "ProviderError";
  }
}

export async function requestJson<T>(provider: string, url: string, init: RequestInit = {}): Promise<T> {
  let lastError: unknown;
  for (let attempt = 0; attempt < 3; attempt += 1) {
    try {
      const response = await fetch(url, { ...init, signal: AbortSignal.timeout(6500) });
      if (!response.ok) {
        const error = new ProviderError(provider, response.status, `${provider} returned HTTP ${response.status}`);
        if (response.status >= 500 && attempt < 2) {
          await new Promise((resolve) => setTimeout(resolve, 150 * 2 ** attempt));
          lastError = error;
          continue;
        }
        throw error;
      }
      return await response.json() as T;
    } catch (error) {
      if (error instanceof ProviderError && (error.status === 429 || (error.status !== null && error.status < 500))) throw error;
      lastError = error;
      if (attempt < 2) await new Promise((resolve) => setTimeout(resolve, 150 * 2 ** attempt));
    }
  }
  const message = lastError instanceof Error ? lastError.message : "Request timed out or failed";
  throw new ProviderError(provider, null, message);
}
