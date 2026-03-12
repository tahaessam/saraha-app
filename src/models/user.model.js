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
  },
  {
    timestamps: true,
    strictQuery: true,
  }
);

// Virtual property
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