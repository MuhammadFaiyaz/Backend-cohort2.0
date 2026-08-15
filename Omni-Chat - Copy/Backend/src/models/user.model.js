import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema({

  username: {
    type: String,
    required: true,
    trim: true,
    unique: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
  },
  password: {
    type: String,
    required: true,
    minlength: 6,
    select: false
  },
  verified: {
    type: Boolean,
    default: false,
  },
},
  { timestamps: true }
);

userSchema.pre("save", async function () {

  if (!this.isModified("password")) return;

  try {
    const salt = await bcrypt.genSalt(10);

    const hashedPassword = await bcrypt.hash(this.password, salt);
    this.password = hashedPassword;

  } catch (error) {
    throw new Error("Error hashing password");
  }
});

userSchema.methods.comparePassword = async function (candidatePassword) {
  try {
    return await bcrypt.compare(candidatePassword, this.password);
  } catch (error) {
    throw new Error("Error comparing passwords");
  }
};

const userModel = mongoose.model('User', userSchema);

export default userModel;