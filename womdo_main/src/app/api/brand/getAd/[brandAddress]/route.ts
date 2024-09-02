import { connectToDb } from "@/database/connect";
import Brand from "@/database/models/brandModel";
import Ad from "@/database/models/adModel";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest, { params }: { params: any }) {
  try {
    console.log('params', params);
    await connectToDb();
    console.log("params", params.brandAddress);

    // Construct the regular expression for case-insensitive exact match
    const walletAddressRegex = new RegExp(`^${params.brandAddress}$`, "i");
    console.log("walletAddressRegex", walletAddressRegex);

    // Aggregation pipeline to join Brand and Ad collections
    const brandDetails = await Brand.aggregate([
      { 
        $match: { brandAddress: { $regex: walletAddressRegex } } 
      },
      {
        $lookup: {
          from: 'ads', // the name of the Ad collection
          localField: 'brandAddress',
          foreignField: 'brandAddress',
          as: 'ads'
        }
      },
    //   {
    //     $unwind: {
    //       path: "$ads",
    //       preserveNullAndEmptyArrays: true
    //     }
    //   }
    ]);

    console.log("brandDetails", brandDetails);

    if (brandDetails.length > 0) {
      return NextResponse.json(
        {
          status: true,
          message: "Brand and Ad Details Fetched Successfully",
          data: brandDetails,
        },
        { status: 200 }
      );
    } else {
      return NextResponse.json(
        { status: false, message: "Brand and Ad Details Not Found", data: {} },
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
