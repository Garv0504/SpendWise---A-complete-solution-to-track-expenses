import mongoose, { connect } from "mongoose"

export const connectDb = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI, {})
        console.log("Database Connected")
    } catch (error) {
        console.log("Error while connecting ", error)
        process.exit(1)
    }
}

export default connectDb