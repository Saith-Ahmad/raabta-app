'use server'


import { revalidatePath } from "next/cache";
import User from "../models/user.model";
import { connectToDB } from "../mongoose"
import mongoose, { FilterQuery, SortOrder } from "mongoose";
import Thread from "../models/thread.model";

interface Params{
    userId : string,
    username : string,
    name : string,
    bio : string,
    image : string,
    path : string
}

export async function updateUser({userId, username, name, bio, image, path}:Params): Promise<void> {
    try {
        connectToDB();
        await User.findOneAndUpdate(
            { id: userId },
            {
                username: username.toLocaleLowerCase(),
                name,
                bio,
                image,
                onboarded: true,
            },
            {
                upsert: true
            }
        );

        if (path === '/profile/edit') {
            revalidatePath(path);
        }


    } catch (error:any) {
        throw new Error(`failed to create/update user ${error.message}`)
    }
}


export async function fetchUser(userId:string){
    try {
        await connectToDB();

        const user = User.findOne({id:userId})
        // .populate({
        //     path : "communities",
        //     model : "Community"
        // });
        return user;
    } catch (error:any) {
        throw new Error(`Failed to get user ${error.message}`)
    }
}




export async function fetchUsers({
    userId,
    serachString = "",
    pageNumber = 1,
    pageSize = 20,
    sortBy = 'desc'
}:{
    userId : string,
    serachString? : string,
    pageNumber? : number,
    pageSize? : number,
    sortBy? : SortOrder
}){
  try {
    await connectToDB();
    const skipAmount = (pageNumber - 1) * pageSize;
    const regex = new RegExp(serachString, "i");

    const query:FilterQuery<typeof User> = {
        id : {$ne : userId}
    }

    if(serachString.trim() !== ''){
        query.$or = [
            {username : {$regex : regex}},
            {name : {$regex : regex}}
        ]
    }
    const sortOptions = { crearedAt : sortBy };
    const userQuery = User.find(query)
    .sort(sortOptions)
    .skip(skipAmount)
    .limit(pageSize);

    const totalUserCount = await User.countDocuments(query);
    const users = await userQuery.exec();

    const isNext = totalUserCount > skipAmount + users.length;
    return { users, isNext }
  } catch (error:any) {
    throw new Error(`failed to fetch users in serch ${error.message}`)
}
}



export async function getActivity(userId : string){
    try {
        await connectToDB();
        const objectId = new mongoose.Types.ObjectId(userId);

        //First find all threads created by the user
        const userThreads =await Thread.find({author : objectId});
        
        //collect all child thread ids ( replies ) from the children field
        const childThreadIds = userThreads.reduce((acc, userThread)=>{
            return acc.concat(userThread.children);
        }, [])

        const replies = await Thread.find({
            _id : { $in : childThreadIds },
            author : {$ne : userId}
        }).populate({
            path : "author",
            model : User,
            select : "name image _id"
        });

          

        return replies;
    } catch (error:any) {
        throw new Error(`failed to fetch activity ${error.message}`)
    }
}