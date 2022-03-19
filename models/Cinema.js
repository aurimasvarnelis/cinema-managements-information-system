import mongoose from "mongoose";

const CinemaSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide a name for this cinema'],
  },
  location: {
    type: String,
    required: [true, 'Please provide a location for this cinema'],
  },

})

export default mongoose.models.Cinema || mongoose.model('Cinema', CinemaSchema)