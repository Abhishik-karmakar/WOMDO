import { ethers } from "hardhat";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import {
  TetherUSD,
  TetherUSD__factory,
  Womdo,
  Womdo__factory,
} from "../typechain-types";
import { convertWithDecimal } from "./utilities";
import { getInfluencerShareBytes } from "../scripts/mockApi";

const fs = require("fs");

let owner: SignerWithAddress;
let brand: SignerWithAddress;
let user1: SignerWithAddress;
let user2: SignerWithAddress;
let user3: SignerWithAddress;
let user4: SignerWithAddress;

let womdo: Womdo;
let usdt: TetherUSD;

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

enum Location {
  Inline, // Provided within the Request
  Remote, // Hosted through remote location that can be accessed through a provided URL
  DONHosted, // Hosted on the DON's storage
}

describe("Lock", function () {
  it("Complete flow", async () => {
    [owner, brand, user1, user2, user3, user4] = await ethers.getSigners();

    usdt = await new TetherUSD__factory(owner).deploy(owner.address);
    await usdt.deployed();

    const functionsRouter = "0xC22a79eBA640940ABB6dF0f7982cc119578E11De";
    const donIdBytes32 = ethers.utils.formatBytes32String("fun-polygon-amoy-1");

    womdo = await new Womdo__factory(owner).deploy(
      functionsRouter,
      donIdBytes32,
      usdt.address
    );
    await womdo.deployed();

    await usdt.mint(brand.address, convertWithDecimal(10000, 10 ** 6));
    await usdt
      .connect(brand)
      .approve(womdo.address, convertWithDecimal(10000, 10 ** 6));

    console.log("Registering an ad..");
    await womdo
      .connect(brand)
      .registerAd(4, convertWithDecimal(100, 10 ** 6), "Burger");

    console.log("Users accepting ads..");
    await womdo.connect(user1).acceptAd(1);
    await womdo.connect(user2).acceptAd(1);
    await womdo.connect(user3).acceptAd(1);
    await womdo.connect(user4).acceptAd(1);

    console.log("Setting the subscription..");

    let bytesData = getInfluencerShareBytes();
    await womdo.fulfillRequestLocal(bytesData);

    let user1Share = await womdo.influencerShare(3, 1);
    console.log("User1 Share::: ", user1Share.toString());

    let user1Balance = await usdt.balanceOf(user1.address);
    console.log("User1 Initial Balance::: ", user1Balance.toString());

    console.log("Claim..");
    await womdo.connect(user1).claim(1);

    user1Balance = await usdt.balanceOf(user1.address);
    console.log("User1 Final Balance::: ", user1Balance.toString());
  });
});
