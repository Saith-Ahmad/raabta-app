'use client'
import { Heart } from "lucide-react";
import { addLikeToThread } from "@/lib/actions/thread.action";
import Image from "next/image";
import React, { useState } from "react";
import { usePathname } from "next/navigation";
import mongoose from "mongoose";

interface Props {
    userId: string,
    threadId: string
}

function AddLike({ threadId, userId }: Props) {
    const pathname = usePathname();
    const [likes, setLikes] = useState<string[]>([]);
    const [isCurrentUserHasLiked, setIsCurrentUserHasLiked] = useState(false);

    const handleClick = async () => {
        try {
            const result = await addLikeToThread(threadId, userId, pathname);
            const hasLiked = result.includes(userId);
            setLikes(result);
            setIsCurrentUserHasLiked(hasLiked);
        } catch (error) {
            console.error("Error liking the post:", error);
        }
    };

    return (
        <>
        <div className={`${isCurrentUserHasLiked ? "text-red-700 font-bold" : "text-white"} hover:scale-110`}>
        <Heart
            size={24}
            onClick={handleClick}
            className={`${ isCurrentUserHasLiked && "fill-red-500 text-red-500"}`} 
        />
        </div>

        <div className="text-white">
            {likes.length > 0 && likes?.length}
        </div>
        </>
    );
}

export default AddLike;
