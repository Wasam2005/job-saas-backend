import mongoose from "mongoose";

const {Schema} = mongoose;

const RefreshTokenSchema = new Schema({
    userId: {
      type: Schema.Types.ObjectId,
      ref:"User",
      required: true,
      index:true,
    },
    token:{
        type: String,
        required:true,
        
    },
    expiresAt:{
    type: Date,
    required: true,
    index:true
    },


},
{timestamps:true}
)

export default mongoose.model("RefreshToken", RefreshTokenSchema);

