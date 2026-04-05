import mongoose from "mongoose";
const userSchema = new mongoose.Schema(
  {
    firstname: {
      type: String,
      required: true,
      minlength: 3,
      maxlength: 5,
      trim: true,
    },
    lastname: {
      type: String,
      required: true,
      minlength: 3,
      maxlength: 5,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
      trim: true,
      minlength: 6,
    },
    age: {
      type: Number,
    },
    gender: {
      type: String,
      enum: ["male", "female"],
      default: "male",
    },
    profile_pic: {
      type: String,
    },
    confirmed: {
      type: Boolean,
      default: false,
    },
    provider: {
      type: String,
      enum: ["system", "google"],
    },
    failedLoginAttempts: {
      type: Number,
      default: 0,
    },
    lockUntil: {
      type: Date,
    },
    twoStepEnabled: {
      type: Boolean,
      default: false,
    },
    twoStepOtp: {
      type: String,
    },
    twoStepOtpExpiresAt: {
      type: Date,
    },
    loginOtp: {
      type: String,
    },
    loginOtpExpiresAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
    strictQuery: true,
  }
);
userSchema
  .virtual("userName")
  .get(function () {
    return this.firstname + " " + this.lastname;
  })
  .set(function (v) {
    const [firstName, lastName] = v.split(" ");
    this.set({ firstname: firstName, lastname: lastName });
  });
const User = mongoose.models.User || mongoose.model("User", userSchema);
export default User;
