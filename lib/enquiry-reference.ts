// A retry of the same normalized request returns the same reference.
// The hash includes all submitted values so changed requests remain distinct.
export async function enquiryReference(requestId: string, data: Record<string, unknown>) {
  const canonical = JSON.stringify(Object.keys(data).sort().map(key => [key, data[key]]));
  const digest = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(requestId + ':' + canonical));
  const code = Array.from(new Uint8Array(digest)).slice(0, 16).map(byte => byte.toString(16).padStart(2, '0')).join('').toUpperCase();
  return `DEAL-${code}`;
}
