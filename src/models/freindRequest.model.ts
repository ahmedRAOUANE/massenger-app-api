import mongoose, { Document, Schema } from "mongoose";

export interface IFriendRequestSchema {
    sender: mongoose.Schema.Types.ObjectId;
    reciver: mongoose.Schema.Types.ObjectId;
    status: "pending" | "accepted" | "rejected";
}

// extend the IFreindRequest interface to include Document properties and methods
export interface IFriendRequest extends IFriendRequestSchema, Document { }

const freindRequestSchema: Schema = new Schema<IFriendRequestSchema>({
    sender: {type: mongoose.Schema.Types.ObjectId, ref: "User", required: true},
    reciver: {type: mongoose.Schema.Types.ObjectId, ref: "User", required: true},
    status: { type: String, enum: ["pending" , "accepted" , "rejected"], default: "pending"}
}, {timestamps: true})

const FreindRequest = mongoose.model<IFriendRequestSchema>("FreindRequest", freindRequestSchema);

export default FreindRequest;