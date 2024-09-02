import { connectToDb } from "@/database/connect";
import Brand from "@/database/models/brandModel";
import { NextRequest, NextResponse } from "next/server";
import { saveSubtitles } from "@/common/getSubtitles";
import { translateFileToEnglish } from "@/common/translate";
import { getContext, getContextAndCreateContent } from "@/common/extractBrand";
import { getRating } from "@/common/claude_test_node";
import Ad from "@/database/models/adModel";
import BrandCollab from "@/database/models/brandCollabModel";

function delay(ms: any) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function POST(req: NextRequest) {
  try {
    await connectToDb();
    const reqObj = await req.json();
    console.log("reqObj", reqObj);

    const filePath = await saveSubtitles(reqObj.videoId, reqObj.lang);

    if (reqObj.lang != "english") {
      await delay(2000);
      await translateFileToEnglish(filePath, reqObj.videoId);
    }

    const context0 = await getContext(filePath, reqObj.brand, 12);

    console.log("context", context0);

    const context = getContextAndCreateContent(
      filePath,
      reqObj.brand,
      12,
      reqObj.brand
    );

    console.log("context", context);

    const rating: any = await getRating(context);

    console.log("rating", rating);

    let match = rating[0].text.match(/Rating: (\d+)/);

    let ratingNumber;
    if (match) {
      ratingNumber = match[1];
      console.log("Extracted Rating Number:", ratingNumber);
    } else {
      ratingNumber = 7;
    }

    const updateEntry = await BrandCollab.updateOne(
      { influencerAddress: reqObj.influencerAddress, adId: reqObj.adId },
      { rating: ratingNumber }
    );

    const getNumberOfTargetedAds = await Ad.findOne({ adId: reqObj.adId });
    const getListOfSubmittedVideoInfluencers = await BrandCollab.find({
      adId: reqObj.adId,
      rating: { $exists: true },
    });

    console.log(
      "to check----------",
      getListOfSubmittedVideoInfluencers,
      getNumberOfTargetedAds
    );

    if (
      getListOfSubmittedVideoInfluencers.length ==
      Number(getNumberOfTargetedAds.numberOfTargetedAds)
    ) {
      const updateAllInfluencerEntry = await BrandCollab.updateMany(
        { adId: reqObj.adId },
        { $set: { canClaim: true } }
      );
      console.log("updateAllInfluencerEntry", updateAllInfluencerEntry);
    }

    console.log("updateEntry", updateEntry);
    // const newObject = new BrandInfluencer({videoId: reqObj.videoId,rating: ratingNumber })

    // const newPrompt = new Brand(reqObj);
    // console.log('newPrompt', newPrompt);
    // await newPrompt.save();
    return NextResponse.json(
      {
        status: true,
        message: "WOMDO: Video Analysed Successfully",
        data: { Rating: ratingNumber },
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.log(error);

    return NextResponse.json(
      { status: false, message: error.message },
      { status: 500 }
    );
  }
}
