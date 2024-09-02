import { connectToDb } from "@/database/connect";
import BrandCollab from "@/database/models/brandCollabModel";
import Influencer from "@/database/models/InfluencerModel";
import Brand from "@/database/models/brandModel";
import Ad from "@/database/models/adModel";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    await connectToDb();
    const reqObj = await req.json();
    console.log("reqObj", reqObj);
    const adId = reqObj.adId;
    const getAd = await Ad.find({ adId });
    console.log("getAd", getAd);

    if (getAd.length == 0) {
      return NextResponse.json(
        { status: false, message: "adId doesn't exists" },
        { status: 500 }
      );
    }
    const getBrand = await Brand.find({ brandAddress: getAd[0].brandAddress });
    console.log("getBrand", getBrand);
    if (getBrand.length == 0) {
      return NextResponse.json(
        { status: false, message: "Brand doesn't exists" },
        { status: 500 }
      );
    }
    const getInfluencerDet = await Influencer.find({
      wallet: reqObj.influencerAddress,
    });

    if (getInfluencerDet.length == 0) {
      return NextResponse.json(
        { status: false, message: "Influencer doesn't exists" },
        { status: 500 }
      );
    }

    const newPrompt = new BrandCollab({
      ...reqObj,
      brandName: getBrand[0].brandName,
      subscribers: getInfluencerDet[0].subscribers,
    });
    console.log("check", {
      ...reqObj,
      brandName: getBrand[0].brandName,
      subscribers: getInfluencerDet[0].subscribers,
    });

    console.log("newPrompt", newPrompt);
    await newPrompt.save();
    return NextResponse.json(
      {
        status: true,
        message: "Invitation Sent to Influencer Successfully",
        data: newPrompt,
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
