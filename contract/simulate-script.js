const { simulateScript } = require("@chainlink/functions-toolkit");
const requestConfig = require("./request-config");

async function main() {
  const { responseBytesHexstring, capturedTerminalOutput, errorString } =
    await simulateScript(requestConfig);

  console.log("Response:", responseBytesHexstring);
  console.log("Error:", errorString);
  console.log("Terminal Output:", capturedTerminalOutput);
}

main();
