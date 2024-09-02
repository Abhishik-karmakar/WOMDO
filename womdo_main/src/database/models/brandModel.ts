import { Schema, model, models } from "mongoose";

const BrandSchema = new Schema({
  brandName: {
    type: String,
    unique: true
  },
  category: {
    type: String,
  },
  brandAddress: {
    type: String,
    unique: true,
  },
});

const Brand = models.Brand || model("Brand", BrandSchema);

export default Brand;
