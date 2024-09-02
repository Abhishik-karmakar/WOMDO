import { connectToDb } from "@/database/connect";
import BrandCollab from "@/database/models/brandCollabModel";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest, { params }: { params: any }) {
  try {
    await connectToDb();
    const url = new URL(req.url);
    const boolStatus = new URLSearchParams(url.searchParams);
    console.log("boolStatus", boolStatus);
    console.log("accepted", boolStatus.get("accepted"));

    // Construct the regular expression for case-insensitive exact match
    const walletAddressRegex = new RegExp(`^${params.wallet}$`, "i");
    console.log("walletAddressRegex", walletAddressRegex);

    let pipeline: any[] = [
      {
        $match: {
          influencerAddress: { $regex: walletAddressRegex },
        },
      },
      {
        $lookup: {
          from: "ads",
          localField: "adId",
          foreignField: "adId",
          as: "adDetails",
        },
      },
    ];

    // Add an additional stage to filter based on the 'accepted' status if provided
    if (boolStatus.get("accepted") !== null) {
      console.log("going heree");
      
      const acceptedStatus = boolStatus.get("accepted") === "true";
      pipeline = [
        {
          $match: {
            influencerAddress: { $regex: walletAddressRegex },
            acceptedStatus,
          },
        },
        {
          $lookup: {
            from: "ads",
            localField: "adId",
            foreignField: "adId",
            as: "adDetails",
          },
        },
      ];
    }

    // Unwind adDetails
    pipeline.push({
      $unwind: "$adDetails",
    });

    // Project fields from BrandInfluencer model and include productName from adDetails
    pipeline.push({
      $addFields: {
        productName: "$adDetails.productName",
        brandAddress: "$adDetails.brandAddress",
      },
    });

    // Project only required fields
    pipeline.push({
      $project: {
        _id: 0,
        adId: 1,
        influencerAddress: 1,
        acceptedStatus: 1,
        brandName: 1,
        productName: 1,
        brandAddress: 1,
      },
    });

    const influencerBrandDetails = await BrandCollab.aggregate(pipeline);

    console.log("influencerBrandDetails", influencerBrandDetails);

    if (influencerBrandDetails.length > 0) {
      return NextResponse.json(
        {
          status: true,
          message: "Influencer Details Fetched Successfully",
          data: influencerBrandDetails,
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
