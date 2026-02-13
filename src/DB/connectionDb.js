import mongoose from "mongoose";
const cheackconnectionDB = async () => {
  try {
    await mongoose.connect("mongodb://127.0.0.1:27017/sarahaApp", {
      serverSelectionTimeoutMS: 5000,
    });

    console.log("DB Connected Successfully");
  } catch (error) {
    console.log("DB Failed To Connect:", error.message);
  }
};

export default cheackconnectionDB;
