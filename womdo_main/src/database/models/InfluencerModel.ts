import { Schema, model, models } from "mongoose";

const InfluencerSchema = new Schema({
  name: {
    type: String,
  },
  channelName: {
    type: String,
  },
  totalViewCount: {
    type: Number,
  },
  subscribers: {
    type: Number,
  },
  overallWatchtime: {
    type: Number,
  },
  category: {
    type: String,
  },
  wallet: {
    type: String,
    unique: true,
  },
  channelLink: {
    type: String,
  },
  email: {
    type: String,
  },
});

// Check if the model already exists before defining it
const Influencer = models.Influencer || model("Influencer", InfluencerSchema);

export default Influencer;
