import { connectToDb } from "@/database/connect";
import Influencer from "@/database/models/InfluencerModel";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest, { params }: { params: any }) {
  try {
    await connectToDb();
    console.log("params", params.category);

    // Construct the regular expression for case-insensitive exact match
    const categoryRegex = new RegExp(`^${params.category}$`, "i");
    console.log("categoryRegex", categoryRegex);

    let influencerDetails;
    if (params.category == "all") {
      influencerDetails = await Influencer.find();
    } else {
      influencerDetails = await Influencer.find({
        category: { $regex: categoryRegex },
      });
    }
 

    console.log("influencerDetails", influencerDetails);

    if (influencerDetails) {
      return NextResponse.json(
        {
          status: true,
          message: "Influencer Details Fetched Successfully",
          data: influencerDetails,
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
