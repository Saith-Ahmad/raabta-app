'use server'
import { revalidatePath } from "next/cache";
import Thread from "../models/thread.model";
import User from "../models/user.model";
import { connectToDB } from "../mongoose"
import mongoose from "mongoose";
import Community from "../models/community.model";

interface Params {
    text: string,
    author: string,
    communityId: string | null,
    path: string,
    threadImage? : String
}


export async function createThread({ text, author, communityId, path, threadImage }: Params) {
  console.log(threadImage);
    try {
        await connectToDB();

        const communityIdObject = await Community.findOne(
          { id: communityId },
          { _id: 1 }
        );

        const createdThread = await Thread.create({
            text,
            threadImage,
            author,
            createdAt : Date.now(),
            community: communityIdObject,
        })

        //update user model
        await User.findByIdAndUpdate(author, {
            $push: { threads: createdThread._id }
        });

        if (communityIdObject) {
          // Update Community model
          await Community.findByIdAndUpdate(communityIdObject, {
            $push: { threads: createdThread._id },
          });
        }

        revalidatePath(path);
    } catch (error: any) {
        throw new Error(`failed to create Thread ${error.message}`)
    }

}


export async function fetchPosts(pageNumber = 1, pageSize = 20) {
    try {
        await connectToDB();

        // Calculate the number of posts to skip based on the page number and page size.
        const skipAmount = (pageNumber - 1) * pageSize;

        // Create a query to fetch the posts that have no parent (top-level threads) (a thread that is not a comment/reply).
        const postsQuery = Thread.find({ parentId: { $in: [null, undefined] } })
            .sort({ createdAt: "desc" })
            .skip(skipAmount)
            .limit(pageSize)
            .populate({
                path: "author",
                model: User,
            })
            .populate({
              path: "community",
              model: Community
            })
            .populate({
                path: "children", // Populate the children field
                populate: {
                    path: "author", // Populate the author field within children
                    model: User,
                    select: "_id name parentId image", // Select only _id and username fields of the author
                },
            });




        // Count the total number of top-level posts (threads) i.e., threads that are not comments.
        const totalPostsCount = await Thread.countDocuments({
            parentId: { $in: [null, undefined] },
        }); // Get the total count of posts

        const posts = await postsQuery.exec();

        const isNext = totalPostsCount > skipAmount + posts.length;
        return { posts, isNext };

    } catch (error: any) {
        throw new Error(`failed to create Thread ${error.message}`)
    }
}



export async function fetchThreadById(threadId: string) {
  
  try {
      connectToDB();
      // Convert threadId to ObjectId
      const objectId = new mongoose.Types.ObjectId(threadId);
  
      const thread = await Thread.findById(objectId)
        .populate({
          path: "author",
          model: User,
          select: "_id id name image",
        }) // Populate the author field with _id and username
        .populate({
          path: "community",
          model: Community,
          select: "_id id name image",
        }) 
        .populate({
          path: "children", // Populate the children field
          populate: [
            {
              path: "author", // Populate the author field within children
              model: User,
              select: "_id id name parentId image", // Select only _id and username fields of the author
            },
            {
              path: "children", // Populate the children field within children
              model: Thread, // The model of the nested children (assuming it's the same "Thread" model)
              populate: {
                path: "author", // Populate the author field within nested children
                model: User,
                select: "_id id name parentId image", // Select only _id and username fields of the author
              },
            },
          ],
        })
        .exec();
  
      return thread;
    } catch (err) {
      console.error("Error while fetching thread:", err);
      throw new Error("Unable to fetch thread");
    }
}


// export async function addCommentToThread(
//     threadId : string,
//     commentText : string,
//     userId : string,
//     path : string
// ){
//     try {
//         //Find the original Thread By Its Id
//         const objectId = new mongoose.Types.ObjectId(threadId);
//         const originalThread = await Thread.findById(objectId)
//         if(!originalThread){
//             throw new Error("Thread Not Found");
//         }

//         const commentThread = new Thread({
//             text : commentText,
//             author : userId,
//             parentId : threadId
//         })
//         const saveCommentThread = await commentThread.save();
//         originalThread.children.push(saveCommentThread._id);
//         await originalThread.save();
//         revalidatePath(path);

//     } catch (error: any) {
//         throw new Error(`failed to add comment to thread ${error.message}`)
//     }
// }

export async function addCommentToThread(
  threadId : string,
  commentText : string,
  userId : string,
  path : string
){
  try {
      //Find the original Thread By Its Id
      const objectId = new mongoose.Types.ObjectId(threadId);
      const originalThread = await Thread.findById(objectId)
      if(!originalThread){
          throw new Error("Thread Not Found");
      }
      const objectIdUser = new mongoose.Types.ObjectId(userId);
      const OriginalUser = await User.findById(objectIdUser);

      if(!OriginalUser){
        throw new Error("User Not Found");
      }

      const commentThread = new Thread({
          text : commentText,
          author : userId,
          parentId : threadId
      })
      const saveCommentThread = await commentThread.save();
      originalThread.children.push(saveCommentThread._id);
      OriginalUser.threads.push(saveCommentThread._id);
      await originalThread.save();
      await OriginalUser.save();
      revalidatePath(path);

  } catch (error: any) {
      throw new Error(`failed to add comment to thread ${error.message}`)
  }
}


export async function fetchUserPosts(userId : string) {
    try {
        await connectToDB();
        const threads = await User.findOne({ id: userId }).populate({
            path: "threads",
            model: Thread,
            populate: [
              {
                path: "children",
                model: Thread,
                populate: {
                  path: "author",
                  model: User,
                  select: "name image id", // Select the "name" and "_id" fields from the "User" model
                },
              },
            ],
          });
        return threads;
    } catch (error: any) {
        throw new Error(`failed to Fetch profile threads ${error.message}`)
    }
}

async function fetchAllChildThreads(threadId: string): Promise<any[]> {
  const childThreads = await Thread.find({ parentId: threadId });

  const descendantThreads = [];
  for (const childThread of childThreads) {
    const descendants = await fetchAllChildThreads(childThread._id);
    descendantThreads.push(childThread, ...descendants);
  }

  return descendantThreads;
}


export async function deleteThread(id: string, path: string): Promise<void> {
  try {
    connectToDB();

    // Find the thread to be deleted (the main thread)
    const mainThread = await Thread.findById(id).populate("author community");

    if (!mainThread) {
      throw new Error("Thread not found");
    }

    // Fetch all child threads and their descendants recursively
    const descendantThreads = await fetchAllChildThreads(id);

    // Get all descendant thread IDs including the main thread ID and child thread IDs
    const descendantThreadIds = [
      id,
      ...descendantThreads.map((thread) => thread._id),
    ];

    // Extract the authorIds and communityIds to update User and Community models respectively
    const uniqueAuthorIds = new Set(
      [
        ...descendantThreads.map((thread) => thread.author?._id?.toString()), // Use optional chaining to handle possible undefined values
        mainThread.author?._id?.toString(),
      ].filter((id) => id !== undefined)
    );

    const uniqueCommunityIds = new Set(
      [
        ...descendantThreads.map((thread) => thread.community?._id?.toString()), // Use optional chaining to handle possible undefined values
        mainThread.community?._id?.toString(),
      ].filter((id) => id !== undefined)
    );

    // Recursively delete child threads and their descendants
    await Thread.deleteMany({ _id: { $in: descendantThreadIds } });

    // Update User model
    await User.updateMany(
      { _id: { $in: Array.from(uniqueAuthorIds) } },
      { $pull: { threads: { $in: descendantThreadIds } } }
    );

    // Update Community model
    await Community.updateMany(
      { _id: { $in: Array.from(uniqueCommunityIds) } },
      { $pull: { threads: { $in: descendantThreadIds } } }
    );

    revalidatePath(path);
  } catch (error: any) {
    throw new Error(`Failed to delete thread: ${error.message}`);
  }
}


export async function addLikeToThread(threadId: string, userId?: string, path?: string) {
  try {
    await connectToDB();
    const objectIdThread = new mongoose.Types.ObjectId(threadId);
    const thread = await Thread.findById(objectIdThread);

    if (!thread) {
      throw new Error("Thread not found");
    }

    // If `userId` is provided, toggle the like status
    if (userId) {
      const objectIdUser = new mongoose.Types.ObjectId(userId);
      const user = await User.findById(objectIdUser);

      if (!user) {
        throw new Error("User not found");
      }
      
      const alreadyLiked = thread.likedBy.includes(user._id);

      if (!alreadyLiked) {
        // Add only if the user ID is not already in the array
        await Thread.findByIdAndUpdate(threadId, {
          $addToSet: { likedBy: user._id },
        });
      } 
      // else {
      //   // Remove the user ID from the array
      //   await Thread.findByIdAndUpdate(threadId, {
      //     $pull: { likedBy: user._id },
      //   });
      // }
      

      // Save thread after update
      await thread.save();
      const updatedThread = await Thread.findById(threadId);


    }

    // Revalidate path only if `path` is provided
    if (path) {
      revalidatePath(path);
    }

    // Return the updated `likedBy` array
    return thread.likedBy;
  } catch (error: any) {
    throw new Error(`Error in liked by user function: "${error.message}"`);
  }
}

