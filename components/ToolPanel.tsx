import { TOOL_CATALOG, findTool } from "@/data/tools";
import { PageIntro } from "@/components/PageIntro";
import { SearchBox } from "@/components/SearchBox";
import { LocalWordTool } from "@/components/LocalWordTool";
import { RemoteWordTool } from "@/components/RemoteWordTool";
import { WritingTool } from "@/components/WritingTool";

const remoteModes: Record<string, "synonyms" | "antonyms" | "related" | "association" | "rhymes" | "sounds-like"> = {
  "synonym-finder": "synonyms", "antonym-finder": "antonyms", "rhyme-finder": "rhymes", "word-association-finder": "association",
};
const writingTools = new Set(TOOL_CATALOG.filter((tool) => tool.group === "Writing").map((tool) => tool.id));
const localTools = new Set([
  "word-unscrambler", "starts-with", "ends-with", "contains-letters", "random-word-generator",
  "word-length-finder", "vocabulary-quiz-generator", "acronym-finder", "abbreviation-finder", "idiom-finder",
]);

export function ToolPanel({ toolId }: { toolId: string }) {
  const tool = findTool(toolId);
  if (!tool) return null;
  const parent = tool.group === "Dictionary" ? { label: "Dictionary", href: "/dictionary" } : tool.group === "Word discovery" ? { label: "Word Finder", href: "/word-finder" } : { label: "Writing Tools", href: "/writing-tools" };
  return <>
    <PageIntro eyebrow={`${tool.group} tool`} title={tool.title} description={tool.description} parent={parent} currentHref={`/tools/${encodeURIComponent(toolId)}`} />
    <section className="tool-panel" aria-labelledby="tool-panel-title">
      <h2 id="tool-panel-title">{tool.title}</h2><p>{tool.description}</p>
      {toolId === "word-meaning" ? <SearchBox compact />
        : toolId === "pronunciation-finder" ? <RemoteWordTool mode="pronunciation" />
        : remoteModes[toolId] ? <RemoteWordTool mode={remoteModes[toolId]} />
        : writingTools.has(toolId) ? <WritingTool toolId={toolId} />
        : localTools.has(toolId) ? <LocalWordTool toolId={toolId} />
        : <p className="status-box">This tool is not available.</p>}
    </section>
  </>;
}
