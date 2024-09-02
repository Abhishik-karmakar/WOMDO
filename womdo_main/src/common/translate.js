// const fs = require("fs");
import fs from "fs";
import path from "path";
import { translate } from "@vitalets/google-translate-api";
import { fileURLToPath } from "url";

// Function to read file and translate its contents to English
export async function translateFileToEnglish(filePath, videoID) {
  try {
    // Read the file content
    const fileContent = fs.readFileSync(filePath, "utf8");

    // Translate the content to English
    const result = await translate(fileContent, { to: "en" });

    // Log the translated text
    // console.log("Translated Text:", result.text);

    // Write the translated text to a new file
    const translatedFilePath = path.join(
      path.dirname(filePath),
      `${videoID}.subtitles.txt`
    );
    fs.writeFileSync(translatedFilePath, result.text);

    console.log("Translated file saved at:", translatedFilePath);

    return result.text;
  } catch (error) {
    console.error("Error:", error);
  }
}

// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);

// const inputFilePath = path.join(__dirname, "..", "subtitles.txt");
// translateFileToEnglish(inputFilePath);
