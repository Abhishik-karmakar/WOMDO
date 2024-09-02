import fs from "fs";
import path from "path";
import { getSubtitles } from "youtube-captions-scraper";
import { fileURLToPath } from "url";

export async function saveSubtitles(videoId, lang) {
  try {
    let captions;
    if (lang === "english") {
      captions = await getSubtitles({ videoID: videoId, lang: "en" });
    } else if (lang === "hindi") {
      captions = await getSubtitles({ videoID: videoId, lang: "hi" });
    } else {
      captions = await getSubtitles({ videoID: videoId, lang: lang });
    }
    const textOutput = captions.map((subtitle) => subtitle.text).join("\n");
    const __filename = fileURLToPath(import.meta.url);
    const __dirname = path.dirname(__filename);
    const directoryPath = path.join(__dirname, "..", "subtitles");
    const filePath = path.join(
      directoryPath,
      `${videoId}.subtitles.txt`
    );

    console.log('filePath', filePath);

    if (!fs.existsSync(directoryPath)) {
      fs.mkdirSync(directoryPath);
    }

    fs.writeFile(filePath, textOutput, (err) => {
      if (err) throw err;
      console.log("The file has been saved!");
    });
    return filePath;
  } catch (error) {
    console.error("Error fetching or saving subtitles:", error);
  }
}

// saveSubtitles("TwXgOMDONK8", "english");
