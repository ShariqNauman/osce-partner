
export function safeParseJSON<T>(text: string): T {
  try {
    // Attempt direct parse first
    return JSON.parse(text) as T;
  } catch (e) {
    // If it fails, try to extract from markdown code blocks or find the first { and last }
    const jsonRegex = /\{[\s\S]*\}|\[[\s\S]*\]/;
    const match = text.match(jsonRegex);
    if (match) {
      try {
        return JSON.parse(match[0]) as T;
      } catch (innerError) {
        console.error("Failed to parse extracted JSON block", innerError);
        throw innerError;
      }
    }
    throw new Error("No valid JSON found in response");
  }
}
