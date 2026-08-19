import { fakeApi } from "@/utils/fakeApi";

const topics = [
  "JavaScript",
  "Java",
  "TypeScript",
  "Python",
  "React",
  "Next.js",
  "Node.js",
  "Web Workers",
  "Promises",
  "Performance API",
  "Event Loop",
];

export class AutocompleteService {
  getSuggestions(query: string) {
    const normalizedQuery = query.trim().toLowerCase();

    return fakeApi(() => {
      if (!normalizedQuery) {
        return [];
      }

      return topics.filter((topic) => topic.toLowerCase().includes(normalizedQuery));
    });
  }
}