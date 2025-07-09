import mongoose, { Document, Schema } from "mongoose";
import bcrypt from "bcryptjs";

export interface IUser extends Document {
    name: string;
    email: string;
    password: string;
    freinds: mongoose.Types.ObjectId[];
    matchPassword(password: string): Promise<boolean>;
}

const userSchema = new Schema<IUser>({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true, minlength: 6, select: false },
    freinds: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }]
}, { timestamps: true });

userSchema.pre("save", async function (this: IUser, next) {
    if (!this.isModified("password")) return next();

    try {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
        next();
    } catch (error) {
        next(error as Error);
    }
});

userSchema.methods.matchPassword = async function (this: IUser, password: string) {
    return await bcrypt.compare(password, this.password);
};

const User = mongoose.model<IUser>('User', userSchema);

export default User;
