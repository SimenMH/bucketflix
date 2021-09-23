import mongoose from 'mongoose';

const connectDB = async () => {
  try {
    const db = await mongoose.connect(process.env.MONGO_URI, {
      useUnifiedTopology: true,
    });
    console.log(`MongoDB Connected: ${db.connection.host}`);
  } catch (err) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

export default connectDB;
