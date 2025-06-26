import mongoose from "mongoose";

const connectDB=async ()=>{
    try {
        mongoose.connection.on('connected',()=>console.log("Connected to MongoDB"));
        const connection=await mongoose.connect(`${process.env.MONGODB_URI}/job-portal`);

    } catch (error) {
        console.error(error.message);
    }
}
export default connectDB