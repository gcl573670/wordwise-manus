"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

const STORAGE_KEY = "wordwise-search-history";

function readHistory(): string[] {
  try {
    const stored: unknown = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
    if (!Array.isArray(stored)) return [];
    return [...new Set(stored.filter((item): item is string => typeof item === "string" && item.trim().length > 0 && item.length <= 120 && !/[\/?#]/.test(item)).map((item) => item.trim()))].slice(0, 8);
  } catch {
    return [];
  }
}

export function RecentSearches() {
  const [words, setWords] = useState<string[]>([]);
  useEffect(() => setWords(readHistory()), []);

  function clearHistory() {
    try { localStorage.removeItem(STORAGE_KEY); } catch { /* The control is still safe if storage is blocked. */ }
    setWords([]);
  }

  if (!words.length) return null;
  return <section className="recent-searches" aria-label="Recent word searches">
    <div className="recent-searches-heading"><p>Recent searches on this device</p><button type="button" onClick={clearHistory}>Clear history</button></div>
    <ul>{words.map((word) => <li key={`${word.toLocaleLowerCase("en-US")}-${word}`}><Link href={`/dictionary/${encodeURIComponent(word.toLocaleLowerCase("en-US"))}`}>{word}</Link></li>)}</ul>
  </section>;
}
