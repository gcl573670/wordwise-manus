export interface ToolDefinition { id: string; title: string; description: string; group: "Dictionary" | "Word discovery" | "Writing" }

export const TOOL_CATALOG: ToolDefinition[] = [
  { id: "word-meaning", title: "Word Meaning Finder", description: "Look up definitions, parts of speech, phonetics, available audio, examples, and related words.", group: "Dictionary" },
  { id: "synonym-finder", title: "Synonym Finder", description: "Explore close alternatives and compare their fit by context.", group: "Dictionary" },
  { id: "antonym-finder", title: "Antonym Finder", description: "Find opposites when the provider has a useful result.", group: "Dictionary" },
  { id: "pronunciation-finder", title: "Pronunciation Finder", description: "Hear available recordings and read returned phonetic transcriptions.", group: "Dictionary" },
  { id: "rhyme-finder", title: "Rhyming Word Finder", description: "Find perfect rhymes, near rhymes, and sound-related words.", group: "Dictionary" },
  { id: "word-unscrambler", title: "Word Unscrambler", description: "Find words in the local seed list that can be made from your letters.", group: "Word discovery" },
  { id: "starts-with", title: "Words That Start With a Letter", description: "Search the local seed list by starting letters.", group: "Word discovery" },
  { id: "ends-with", title: "Words That End With a Letter", description: "Search the local seed list by ending letters.", group: "Word discovery" },
  { id: "contains-letters", title: "Words Containing Specific Letters", description: "Find local word-list matches containing your letter sequence.", group: "Word discovery" },
  { id: "random-word-generator", title: "Random Word Generator", description: "Draw a word from the curated local spelling list.", group: "Word discovery" },
  { id: "word-length-finder", title: "Word Length Finder", description: "Filter the local word list by character length.", group: "Word discovery" },
  { id: "vocabulary-quiz-generator", title: "Vocabulary Quiz Generator", description: "Test a meaning against a small curated vocabulary set.", group: "Word discovery" },
  { id: "word-association-finder", title: "Word Association Finder", description: "See words Datamuse associates with your prompt.", group: "Word discovery" },
  { id: "acronym-finder", title: "Acronym Finder", description: "Search a curated set of common acronyms and initialisms.", group: "Word discovery" },
  { id: "abbreviation-finder", title: "Abbreviation Finder", description: "Search common abbreviations and their usage examples.", group: "Word discovery" },
  { id: "idiom-finder", title: "Idiom Finder", description: "Browse idioms by phrase or meaning.", group: "Word discovery" },
  { id: "word-counter", title: "Word Counter", description: "Count words in text directly in your browser.", group: "Writing" },
  { id: "character-counter", title: "Character Counter", description: "Count characters, with or without spaces.", group: "Writing" },
  { id: "sentence-counter", title: "Sentence Counter", description: "Estimate sentence count from sentence-ending punctuation.", group: "Writing" },
  { id: "paragraph-counter", title: "Paragraph Counter", description: "Count non-empty paragraphs separated by blank lines.", group: "Writing" },
  { id: "reading-time-calculator", title: "Reading Time Calculator", description: "Estimate reading time at 225 words per minute.", group: "Writing" },
  { id: "sentence-case-converter", title: "Sentence Case Converter", description: "Capitalize sentence starts; review proper nouns afterward.", group: "Writing" },
  { id: "case-converter", title: "Uppercase / Lowercase Converter", description: "Convert text to uppercase or lowercase locally.", group: "Writing" },
  { id: "text-formatter", title: "Text Formatter", description: "Normalize spacing and trim line endings without sending text anywhere.", group: "Writing" },
  { id: "basic-grammar-checker", title: "Basic Grammar Checker", description: "Run limited local checks, or explicitly send text to LanguageTool.", group: "Writing" },
];

export function findTool(id: string): ToolDefinition | undefined { return TOOL_CATALOG.find((tool) => tool.id === id); }
