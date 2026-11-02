import { readdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import matter from "gray-matter";

const root = process.cwd();
const articleDir = path.join(root, "content", "articles");
const outputFile = path.join(root, "content", "articles.generated.json");
const allowedCategories = new Set(["vocabulary", "synonyms", "grammar", "writing", "reference"]);
const errors = [];

function fail(file, message) {
  errors.push(`${path.relative(root, file)}: ${message}`);
}

function isHttpsUrl(value) {
  try { return new URL(value).protocol === "https:"; } catch { return false; }
}

const articles = [];
let files = [];
try {
  files = (await readdir(articleDir)).filter((file) => file.endsWith(".md") || file.endsWith(".mdx")).sort();
} catch (error) {
  throw new Error(`Cannot read content/articles: ${error instanceof Error ? error.message : String(error)}`);
}

for (const fileName of files) {
  const file = path.join(articleDir, fileName);
  const raw = await readFile(file, "utf8");
  let parsed;
  try {
    parsed = matter(raw);
  } catch (error) {
    fail(file, `invalid frontmatter (${error instanceof Error ? error.message : String(error)})`);
    continue;
  }

  const data = parsed.data;
  const required = ["slug", "title", "description", "category", "author", "reviewDate"];
  for (const key of required) {
    if (typeof data[key] !== "string" || data[key].trim() === "") fail(file, `missing required string frontmatter field '${key}'`);
  }
  if (typeof data.slug === "string" && !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(data.slug)) fail(file, "slug must be lowercase words separated by hyphens");
  if (typeof data.slug === "string" && fileName.replace(/\.mdx?$/, "") !== data.slug) fail(file, "filename must match the frontmatter slug");
  if (typeof data.category === "string" && !allowedCategories.has(data.category)) fail(file, `category must be one of ${[...allowedCategories].join(", ")}`);
  if (typeof data.description === "string" && (data.description.length < 50 || data.description.length > 160)) fail(file, "description must be 50–160 characters");
  if (typeof data.reviewDate === "string" && !/^\d{4}-\d{2}-\d{2}$/.test(data.reviewDate)) fail(file, "reviewDate must be YYYY-MM-DD");
  if (data.sources !== undefined && (!Array.isArray(data.sources) || data.sources.some((source) => !source || typeof source.title !== "string" || typeof source.url !== "string" || !isHttpsUrl(source.url)))) fail(file, "sources must be an array of { title, url } with HTTPS URLs");
  if (parsed.content.trim().split(/\s+/).filter(Boolean).length < 500) fail(file, "article body must contain at least 500 words; do not publish an outline or stub");

  articles.push({
    slug: data.slug,
    title: data.title,
    description: data.description,
    category: data.category,
    author: data.author,
    reviewDate: data.reviewDate,
    ...(Array.isArray(data.sources) ? { sources: data.sources } : {}),
    body: parsed.content.trim(),
  });
}

for (const fileName of ["abbreviations.json", "acronyms.json", "idioms.json", "vocabulary.json"]) {
  const file = path.join(root, "data", fileName);
  try {
    const parsed = JSON.parse(await readFile(file, "utf8"));
    if (!Array.isArray(parsed)) fail(file, "top-level data must be a JSON array");
    else parsed.forEach((entry, index) => {
      for (const key of ["term", "meaning", "example", "source", "attribution", "license"]) {
        if (typeof entry?.[key] !== "string" || entry[key].trim() === "") fail(file, `entry ${index + 1} is missing a non-empty '${key}'`);
      }
    });
  } catch (error) {
    if (error instanceof SyntaxError) fail(file, `invalid JSON (${error.message})`);
    else if (error?.code !== "ENOENT") fail(file, `cannot read file (${error instanceof Error ? error.message : String(error)})`);
  }
}

if (errors.length) {
  console.error(`WordWise content validation failed with ${errors.length} issue(s):\n- ${errors.join("\n- ")}`);
  process.exitCode = 1;
} else {
  await writeFile(outputFile, `${JSON.stringify(articles, null, 2)}\n`);
  console.log(`Validated ${articles.length} article(s) and reference JSON files.`);
}
