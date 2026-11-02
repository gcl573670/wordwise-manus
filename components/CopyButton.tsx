"use client";

import { useState } from "react";

export function CopyButton({ text, label }: { text: string; label: string }) {
  const [status, setStatus] = useState("");

  async function copy() {
    try {
      await navigator.clipboard.writeText(text);
      setStatus("Copied to clipboard.");
    } catch {
      setStatus("Clipboard access is unavailable in this browser.");
    }
  }

  return <div className="copy-control">
    <button type="button" className="button-quiet" onClick={copy}>{label}</button>
    {status ? <span role="status" aria-live="polite">{status}</span> : null}
  </div>;
}
