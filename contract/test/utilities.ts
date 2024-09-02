import { ethers } from "hardhat";
var BigNumber = require("big-number");
import fs from "fs";

const abi = require("ethereumjs-abi");
const AbiCoder = ethers.utils.AbiCoder;
const ADDRESS_PREFIX_REGEX = /^(41)/;

export async function mineBlocks(
  provider: typeof ethers.provider,
  count: number
): Promise<void> {
  for (let i = 1; i < count; i++) {
    await provider.send("evm_mine", []);
  }
}
export async function mineBlocksWithMethod(
  provider: typeof ethers.provider,
  count: number,
  method: any
): Promise<void> {
  for (let i = 1; i < count; i++) {
    await provider.send("evm_mine", []);
  }
  method();
}

export function getCreate2Address(
  factoryAddress: string,
  [tokenA, tokenB]: [string, string],
  bytecode: string
): string {
  const [token0, token1] =
    tokenA < tokenB ? [tokenA, tokenB] : [tokenB, tokenA];
  const create2Inputs = [
    "0xff",
    factoryAddress,
    ethers.utils.keccak256(
      ethers.utils.solidityPack(["address", "address"], [token0, token1])
    ),
    ethers.utils.keccak256(bytecode),
  ];
  const sanitizedInputs = `0x${create2Inputs.map((i) => i.slice(2)).join("")}`;
  return ethers.utils.getAddress(
    `0x${ethers.utils.keccak256(sanitizedInputs).slice(-40)}`
  );
}

export const isInt = (n: any) => {
  return n % 1 === 0;
};

export const convertWithDecimal = (value: any, decimal: any) => {
  if (value > 0) {
    if (isInt(value)) {
      value = parseInt(value);
      value = BigNumber(value).multiply(decimal);
    } else {
      value = value * decimal;
      value = toFixed(value);
      value = parseInt(value.toString().split(".")[0]);
      value = toFixed(value);
      value = BigNumber(value);
    }
    return value.toString();
  } else {
    return 0;
  }
};

export const toFixed = (x: any) => {
  if (Math.abs(x) < 1.0) {
    var e = parseInt(x.toString().split("e-")[1]);
    if (e) {
      x *= Math.pow(10, e - 1);
      x = "0." + new Array(e).join("0") + x.toString().substring(2);
    }
  } else {
    var e = parseInt(x.toString().split("+")[1]);
    if (e > 20) {
      e -= 20;
      x /= Math.pow(10, e);
      x += new Array(e + 1).join("0");
    }
  }
  return x;
};

export function customError(errorName: string, ...args: any[]) {
  let argumentString = "";

  if (Array.isArray(args) && args.length) {
    // add quotation marks to first argument if it is of string type
    if (typeof args[0] === "string") {
      args[0] = `"${args[0]}"`;
    }

    // add joining comma and quotation marks to all subsequent arguments, if they are of string type
    argumentString = args.reduce(function (acc: string, cur: any) {
      if (typeof cur === "string") return `${acc}, "${cur}"`;
      else return `${acc}, ${cur.toString()}`;
    });
  }

  return `'${errorName}(${argumentString})'`;
}

export const zeroAddress = "0x0000000000000000000000000000000000000000";

export const extractAbi = async () => {
  const mainFolder = "artifacts/contracts/";
  fs.readdirSync(mainFolder).forEach((folder: any) => {
    if (folder.includes(".sol")) {
      const absolutePath = mainFolder + folder + "/";

      fs.readdirSync(absolutePath).forEach((file: any) => {
        if (!file.includes(".dbg.json")) {
          const finalPath = absolutePath + file;
          const parentDirectory = __dirname.substr(
            0,
            __dirname.lastIndexOf("/")
          );
          const abiFolder = parentDirectory + "/abis";

          try {
            if (!fs.existsSync(abiFolder)) {
              fs.mkdirSync(abiFolder);
            }
          } catch (err) {
            console.error(err);
          }

          let data: any = fs.readFileSync(finalPath);

          fs.writeFileSync(
            `abis/${file}`,
            JSON.stringify(JSON.parse(data).abi)
          );
        }
      });
    }
  });
};
