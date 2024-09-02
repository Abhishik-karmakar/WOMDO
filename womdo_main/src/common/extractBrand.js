// const fs = require("fs");
import fs from "fs";
import { createContent } from "./createContentForAI";

export function getContext(filepath, searchStrings, numLines) {
  // Read the file content
  const content = fs.readFileSync(filepath, "utf-8");
  const lines = content.split("\n");

  // Normalize the search strings to lowercase
  const normalizedSearchStrings = searchStrings.map((str) => str.toLowerCase());

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    // Normalize the line to lowercase for case-insensitive search
    const normalizedLine = line.toLowerCase();

    for (const searchString of normalizedSearchStrings) {
      const startIndex = normalizedLine.indexOf(searchString);

      if (startIndex !== -1) {
        // Collect context lines around the found line
        const startLine = Math.max(0, i - numLines);
        const endLine = Math.min(lines.length - 1, i + numLines);
        const contextLines = lines.slice(startLine, endLine + 1).join("\n");
        return contextLines;
      }
    }
  }

  return `Search strings "${searchStrings.join(", ")}" not found.`;
}

export function getContextAndCreateContent(
  filepath,
  searchStrings,
  numLines,
  brand
) {
  try {
    console.log("filepath----", filepath);
    // Read the file content
    if (!filepath) {
      console.error("Filepath is undefined or null");
      return;
    }

    // Check if file exists
    if (!fs.existsSync(filepath)) {
      console.error("File does not exist:", filepath);
      return;
    }
    const content = fs.readFileSync(filepath, "utf-8");
    console.log("content", content);
    const lines = content.split("\n");

    // Normalize the search strings to lowercase
    const normalizedSearchStrings = searchStrings.map((str) =>
      str.toLowerCase()
    );
    let contextFound = "";
    // let contextArray = [];

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      // Normalize the line to lowercase for case-insensitive search
      const normalizedLine = line.toLowerCase();

      for (const searchString of normalizedSearchStrings) {
        const startIndex = normalizedLine.indexOf(searchString);

        if (startIndex !== -1) {
          // Collect context lines around the found line
          const startLine = Math.max(0, i - numLines);
          const endLine = Math.min(lines.length - 1, i + numLines);
          const contextLines = lines.slice(startLine, endLine + 1).join("\n");
          contextFound = contextLines;
          // contextArray.push(contextLines);
          break;
        }
      }

      if (contextFound) break;
    }

    // console.log('contextArray', contextArray);

    if (!contextFound) {
      return `Search strings "${searchStrings.join(", ")}" not found.`;
    }

    return createContent(brand, contextFound);
  } catch (error) {
    console.error("Error:", error);
  }
}

// Usage
// const searchString = "Odoo";
// const context = getContext(searchString, 12); // Extract 12 lines (6 above and 6 below)
// console.log(context);
