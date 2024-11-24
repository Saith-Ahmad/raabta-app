import mongoose from "mongoose";

let isConnected = false;

export const connectToDB =async () =>{
    mongoose.set('strictQuery', true);
    if(!process.env.MONGODB_URL){
        console.log("Mongodb url not found");
        return; 
    }
    if(isConnected){
        console.log("Mongodb url already connected");
        return; 
    }

    try {
        await mongoose.connect(process.env.MONGODB_URL);
        isConnected = true;
        console.log("Connected to mongodb");
    } catch (error) {
        console.log("mongodb connection error", error)
    }
}