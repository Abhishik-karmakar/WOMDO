import { connectToDb } from "@/database/connect";
import Influencer from "@/database/models/InfluencerModel";
import BrandCollab from "@/database/models/brandCollabModel";
import Ad from "@/database/models/adModel";
import { NextRequest, NextResponse } from "next/server";
import Brand from "@/database/models/brandModel";

export async function GET(req: NextRequest, { params }: { params: any }) {
  try {
    console.log("params", params);
    await connectToDb();
    console.log("params", typeof params.adId);

    const getAd = await Ad.find({ adId: params.adId });
    const addressArray = getAd[0].acceptedUserAddress;
    console.log('addressArray', addressArray);
    const numberOfTargetedAds = getAd[0].numberOfTargetedAds;

    if (addressArray.length < numberOfTargetedAds) {
      let zerosArray = new Array(numberOfTargetedAds + 1).fill(0);
      zerosArray[numberOfTargetedAds] = Number(getAd[0].adId);

      return NextResponse.json(
        { status: true, message: "Not Found", data: zerosArray },
        { status: 404 }
      );
    }

    const getAllAcceptedInfluencers = await BrandCollab.find({
      adId: params.adId,
      acceptedStatus: true,
      rating: { $exists: true },
    });
    console.log("getAllInfluencers", getAllAcceptedInfluencers);

    console.log("checkkk", getAllAcceptedInfluencers.length);

    if (getAllAcceptedInfluencers.length < numberOfTargetedAds) {
      let zerosArray1 = new Array(numberOfTargetedAds + 1).fill(0);
      zerosArray1[numberOfTargetedAds] = Number(getAd[0].adId);

      return NextResponse.json(
        {
          status: true,
          data: zerosArray1,
        },
        { status: 200 }
      );
    }

    // Extract ratings and subscribers
    const ratings = getAllAcceptedInfluencers.map(
      (influencer) => influencer.rating
    );
    const subscribers = getAllAcceptedInfluencers.map(
      (influencer) => influencer.subscribers
    );

    // Calculate sum of ratings and subscribers
    const totalRatings = ratings.reduce((acc, rating) => acc + rating, 0);
    const totalSubscribers = subscribers.reduce(
      (acc, subscriber) => acc + subscriber,
      0
    );

    // Normalize ratings and subscribers
    const normalizedRatings = ratings.map((rating) => rating / totalRatings);
    const normalizedSubscribers = subscribers.map(
      (subscriber) => subscriber / totalSubscribers
    );

    // Define weights
    const w1 = 0.4;
    const w2 = 0.6;

    // Calculate composite scores
    const compositeScores = normalizedRatings.map((nr, index) => {
      const ns = normalizedSubscribers[index];
      return w1 * nr + w2 * ns;
    });

    // Convert composite scores to BIPS and round to two decimal places
    const compositeScoresInBIPS = compositeScores.map((cs) =>
      (cs * 100).toFixed(2)
    );

    // Create a map of influencer addresses to composite scores in BIPS
    const addressToScoreMap = new Map();
    getAllAcceptedInfluencers.forEach((influencer, index) => {
      addressToScoreMap.set(
        influencer.influencerAddress,
        compositeScoresInBIPS[index]
      );
      console.log('addressToScoreMap', addressToScoreMap);
    });

    console.log('---addressToScoreMap', addressToScoreMap);

    addressToScoreMap.forEach(async (score, address) => {
        await BrandCollab.updateOne(
          { influencerAddress: address, adId: params.adId },
          { $set: { compositeScore: score } }
        );
      });

    // Create the result array following the order of addressArray
    const compositeScoresOrdered = addressArray.map(
      (address:any) => Number(addressToScoreMap.get(address) * 100) || "0.00"
    );
    compositeScoresOrdered.push(Number(params.adId));
    // Remove the appended adId from the response
    // compositeScoresOrdered.push(Number(params.adId)); // Commented out to exclude adId from response

    if (getAllAcceptedInfluencers.length > 0) {
      return NextResponse.json(
        {
          status: true,
          message: "Influencer Details with Ratings Fetched Successfully",
          data: compositeScoresOrdered,
        },
        { status: 200 }
      );
    } else {
      return NextResponse.json(
        { status: false, message: "Influencer Details Not Found", data: {} },
        { status: 404 }
      );
    }
  } catch (error: any) {
    console.log(error);
    return NextResponse.json(
      { status: false, message: error.message },
      { status: 500 }
    );
  }
}
