import bcrypt from "bcryptjs";
import mongoose from "mongoose";

// Perplexity-like application User model
const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      trim: true,
      unique: true,
    },
    email: {
      type: String,
      required: true,
      trim: true,
      unique: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: true,
      select: false,
    },
    verified: {
      type: Boolean,
      default: false,
    }
  },
  {
    timestamps: true, // adds createdAt and updatedAt
  }
);

userSchema.pre("save", async function () {
  if (!this.isModified("password")) return;


  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    
  } catch (error) {
     return console.log(error)
  }
});

userSchema.methods.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

userSchema.methods.toJSON = function () {
  const obj = this.toObject();
  delete obj.password;
  return obj;
};

const userModel = mongoose.model("User", userSchema);
export default userModel;
