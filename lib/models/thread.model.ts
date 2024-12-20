import mongoose from "mongoose";

const threadSchema = new mongoose.Schema({
    text: { type: String, required: true },
    threadImage: { type: String , default:""},
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    likedBy: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            default: []
        }
    ],
    community: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Community",
    },
    createdAt: {
        type: Date,
        default: () => Date.now(),
    },
    parentId: {
        type: String,
    },
    children: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Thread"
        }
    ]
})

// Check if the model already exists and delete it (for schema updates)
// if (mongoose.models.Thread) {
//     delete mongoose.models.Thread;
// }
  
//   const Thread = mongoose.model('Thread', threadSchema);
  
//   export default Thread;
  


// const Thread = mongoose.models.Thread || mongoose.model('Thread', threadSchema);
const Thread = mongoose.models.Thread || mongoose.model('Thread', threadSchema);


export default Thread;