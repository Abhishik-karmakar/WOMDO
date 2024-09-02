const { ethers } = await import("npm:ethers@6.12.1");
const abiCoder = ethers.AbiCoder.defaultAbiCoder();

const adId = args[0];

const apiResponse = await Functions.makeHttpRequest({
  url: `http://localhost:3000/api/influencer/claim/${adId}`,
});

const { data } = apiResponse;
const encoded = abiCoder.encode(["uint256[]"], [uint256Array]);
return ethers.getBytes(encoded);
