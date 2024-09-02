import { Schema, model, models } from "mongoose";

const AdSchema = new Schema({
  brandAddress: {
    type: String,
    unique: true,
  },
  productName: {
    type: String,
  },
  budget: {
    type: Number,
  },
  numberOfTargetedAds: {
    type: Number,
  },
  adId: {
    type: String,
  },
  acceptedUserAddress: {
    type: [String]
  }
});

const Ad = models.Ad || model("Ad", AdSchema);

export default Ad;
