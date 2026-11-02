"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";

export function SearchBox({ compact = false, placeholder = "Search a word…" }: { compact?: boolean; placeholder?: string }) {
  const [value, setValue] = useState("");
  const router = useRouter();
  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const word = value.trim().replace(/\s+/g, " ");
    if (!word || !/^[\p{L}\p{M}]+(?:[’'-][\p{L}\p{M}]+)*(?: [\p{L}\p{M}]+(?:[’'-][\p{L}\p{M}]+)*)*$/u.test(word)) return;
    try {
      const history = JSON.parse(localStorage.getItem("wordwise-search-history") || "[]") as string[];
      localStorage.setItem("wordwise-search-history", JSON.stringify([word, ...history.filter((item) => item.toLowerCase() !== word.toLowerCase())].slice(0, 8)));
    } catch { /* Search still works when local storage is unavailable. */ }
    router.push(`/dictionary/${encodeURIComponent(word.toLocaleLowerCase("en-US"))}`);
  }
  const inputId = compact ? "word-search-small" : "word-search";
  return (
    <form className={`search-box${compact ? " search-box-compact" : ""}`} onSubmit={submit} role="search">
      <label className="visually-hidden" htmlFor={inputId}>Search the English dictionary</label>
      <span className="search-icon" aria-hidden="true">⌕</span>
      <input id={inputId} value={value} onChange={(event) => setValue(event.target.value)} placeholder={placeholder} autoComplete="off" />
      <button type="submit" disabled={!value.trim()}>Look up <span aria-hidden="true">→</span></button>
    </form>
  );
}
