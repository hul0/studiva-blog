import mongoose, { Schema, Document } from "mongoose"

export interface IView extends Document {
  blogId: mongoose.Types.ObjectId
  ipHash: string
  timestamp: Date
}

const ViewSchema: Schema = new Schema({
  blogId: { type: Schema.Types.ObjectId, ref: "Blog", required: true },
  ipHash: { type: String, required: true },
  timestamp: { type: Date, default: Date.now, expires: "30d" }, // Expire logs after 30 days
})

// Index for deduplication and performance
ViewSchema.index({ blogId: 1, ipHash: 1, timestamp: -1 })

export default mongoose.models.View || mongoose.model<IView>("View", ViewSchema)
