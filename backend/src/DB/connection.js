// import mongoose from "mongoose";

// const connectDB = async ()=>{
//   try {
//     await mongoose.connect(process.env.DB_URI,{
//       serverSelectionTimeoutMS: 5000
// });
//     console.log("Database connected successfully");
//   } catch (error) {
//     console.error("Database connection failed:", error.message);
//     process.exit(1);
//   }
// };
// export default connectDB;

import mongoose from "mongoose";

const connectDB = async () => {
  console.log("URI:", process.env.DB_URI);

  try {
    await mongoose.connect(process.env.DB_URI, {
      serverSelectionTimeoutMS: 5000,
      family: 4,
    });

    console.log("Database connected successfully");
  } catch (error) {
    console.dir(error, { depth: null });
    process.exit(1);
  }
};

export default connectDB;