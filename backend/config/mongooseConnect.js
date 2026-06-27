const mongoose = require("mongoose");

const mongooseConnect = async () => {
  const dbUrl = process.env.DATABASE_URL || "mongodb://127.0.0.1:27017/translator";
  if (!dbUrl || typeof dbUrl !== "string") {
    throw new Error("DATABASE_URL is not set or is not a string. Please check backend/.env");
  }

  try {
    console.log(`Connecting to MongoDB: ${dbUrl}`);
    await mongoose.connect(dbUrl, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("Connected to database");
  } catch (error) {
    console.log(`Database connection error: ${error.message}`);
    throw error;
  }
};

module.exports = mongooseConnect;
