const fs = require("fs");

const {
  Location,
  ReturnType,
  CodeLanguage,
} = require("@chainlink/functions-toolkit");

const requestConfig = {
  source: fs.readFileSync("./get-influencer-share.js").toString(),
  codeLocation: Location.Inline,
  secrets: {},
  args: ["6"],
  codeLanguage: CodeLanguage.JavaScript,
  expectedReturnType: ReturnType.bytes,
  secretsURLs: [],
};

module.exports = requestConfig;
