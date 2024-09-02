export const custmizeAddress = (address: string) => {
  let firstFive = address.substring(0, 5);
  let lastFour = address.substr(address.length - 4);
  return firstFive + "..." + lastFour;
};

export function isValidYouTubeChannel(url: string) {
  const youtubeChannelRegex =
    /^(https?\:\/\/)?(www\.)?(youtube\.com\/(channel\/|c\/)|youtube\.com\/user\/)?[a-zA-Z0-9_-]{1,}$/;
  // Test the input URL against the regular expression
  return youtubeChannelRegex.test(url);
}

export const getError = (error: any) => {
  let errorMsg =
    error && error?.data && error?.data?.message
      ? error?.data?.message
      : error?.message
      ? error?.message
      : "Something went wrong";

  if (errorMsg.toString().indexOf('"message"') > -1) {
    let match = errorMsg.match(/"message"\s*:\s*"([^"]*)"/);

    if (match && match[1]) {
      let msg = match[1];

      // Remove leading colon and space
      msg = msg.replace(/^:\s*/, "");

      // Remove "execution reverted:" prefix
      msg = msg.replace(/^execution reverted:\s*/, "");

      return msg.trim();
    } else {
      return "Error message not found.";
    }
  } else if (errorMsg.indexOf("execution reverted") > -1) {
    let msg = errorMsg;
    msg = msg =
      msg.indexOf("execution reverted:") > -1
        ? msg.split("execution reverted:")[1].split("{")[0]
        : msg;
    return msg;
  } else if (errorMsg.indexOf("INVALID_ARGUMENT") > -1) {
    return errorMsg.split("(")[0];
  } else if (errorMsg.indexOf("MetaMask Tx Signature") > -1) {
    let msg = errorMsg.replace("MetaMask Tx Signature:", "");
    return msg;
  } else {
    let err = errorMsg.split("*")[0].split(":")[1];
    if (err?.trim() === "insufficient funds for gas") {
      return err;
    } else {
      return errorMsg;
    }
  }
};

export const capitalizeFirstLetter = (str: string) =>
  str.charAt(0).toUpperCase() + str.slice(1);
