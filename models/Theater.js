import mongoose from "mongoose";
import { stringifyQuery } from "next/dist/server/server-route-utils";

const TheaterSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide a name for this theater'],
  },
  location: {
    type: String,
    required: [true, 'Please provide a location for this theater'],
  },

})

export default mongoose.models.Theater || mongoose.model('Theater', TheaterSchema)