// const fs = require("fs");
import fs from 'fs';

export function getContext(searchString, numLines) {
    // Read the file content
    const content = fs.readFileSync("../translated_subtitles.txt", "utf-8");
    const lines = content.split("\n");
  
    // Normalize the search string to lowercase
    const normalizedSearchString = searchString.toLowerCase();
  
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      // Normalize the line to lowercase for case-insensitive search
      const normalizedLine = line.toLowerCase();
      const startIndex = normalizedLine.indexOf(normalizedSearchString);
  
      if (startIndex !== -1) {
        // Collect context lines around the found line
        const startLine = Math.max(0, i - numLines);
        const endLine = Math.min(lines.length - 1, i + numLines);
        const contextLines = lines.slice(startLine, endLine + 1).join("\n");
        return contextLines;
      }
    }
  
    return `Search string "${searchString}" not found.`;
  }
  

// Usage
const searchString = "Odoo";
const context = getContext(searchString, 12); // Extract 12 lines (6 above and 6 below)
console.log(context);
