import { API_SOURCES } from "@/lib/api/sources";

type SourceKey = keyof typeof API_SOURCES;

export function SourceNote({ source, note }: { source: SourceKey; note?: string }) {
  const details = API_SOURCES[source];
  return (
    <p className="source-note">
      Source: <a href={details.url} target="_blank" rel="noreferrer">{details.name}</a>
      {note ? ` · ${note}` : null}
    </p>
  );
}
