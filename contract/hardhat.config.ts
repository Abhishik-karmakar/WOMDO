import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import * as dotenv from "dotenv";
dotenv.config();

const config: HardhatUserConfig = {
  solidity: "0.8.24",

  networks: {
    polygonAmoy: {
      chainId: 80002,
      url: "https://rpc-amoy.polygon.technology",
      accounts: [process.env.PRIVATE_KEY as string],
      gasPrice: 20e9,
      gas: 25e6,
    },
    polygonzKEVM: {
      chainId: 2442,
      url: "https://etherscan.cardona.zkevm-rpc.com/",
      accounts: [process.env.PRIVATE_KEY as string],
      gasPrice: 20e9,
      gas: 25e6,
    },
    scrollSepolia: {
      chainId: 534351,
      url: "https://scroll-sepolia.drpc.org",
      accounts: [process.env.PRIVATE_KEY as string],
      gasPrice: 20e9,
      gas: 25e6,
    },
    hardhat: {
      chainId: 1337,
      allowUnlimitedContractSize: true,
    },
  },

  etherscan: {
    apiKey: {
      polygonAmoy: process.env.POLYGON_API_KEY as string,
      polygonzKEVM: process.env.POLYGON_ZKEVM_API_KEY as string,
      scrollSepolia: process.env.SCROLL_SEPOLIA_API_KEY as string,
    },

    customChains: [
      {
        network: "polygonAmoy",
        chainId: 80002,
        urls: {
          apiURL: "https://api-amoy.polygonscan.com/api",
          browserURL: "https://amoy.polygonscan.com",
        },
      },
      {
        network: "polygonzKEVM",
        chainId: 2442,
        urls: {
          apiURL: "https://api-cardona-zkevm.polygonscan.com/api",
          browserURL: "https://zkevm.polygonscan.com/",
        },
      },
      {
        network: "scrollSepolia",
        chainId: 534351,
        urls: {
          apiURL: "https://api-sepolia.scrollscan.com/api",
          browserURL: "https://sepolia.scrollscan.com/",
        },
      },
    ],
  },
};

export default config;
