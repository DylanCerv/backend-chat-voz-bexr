import mongoose from "mongoose";

const sessionSchema = new mongoose.Schema({
    sessionId: {
      type: String,
      required: true,
      unique: true,
    },
    data: {
      type: Object,
      required: true,
      unique: true,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    }
});


export const Session = mongoose.model('Sessions', sessionSchema);
