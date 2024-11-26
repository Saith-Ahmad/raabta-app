"use client";
import { Heart } from "lucide-react";
import { addLikeToThread } from "@/lib/actions/thread.action";
import React, { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

interface Props {
  userId: string;
  threadId: string;
}

function AddLike({ threadId, userId }: Props) {
  const pathname = usePathname();
  if(pathname !=='/'){
    return null!
  }
  const [likes, setLikes] = useState<string[]>([]);
  const [number, setNumbers] = useState(0);
  const [isCurrentUserHasLiked, setIsCurrentUserHasLiked] = useState(false);

  useEffect(() => {
    const fetchInitialLikes = async () => {
      try {
        const initialLikes = await addLikeToThread(threadId, "", pathname);
        setLikes(initialLikes);
        setIsCurrentUserHasLiked(initialLikes.includes(userId));
      } catch (error) {
        console.error("Error fetching initial likes:", error);
      }
    };

    fetchInitialLikes();
  }, [threadId, userId, pathname]);

  const handleClick = async () => {
    try {
      const result = await addLikeToThread(threadId, userId, pathname);
      const hasLiked = result.includes(userId);
      // Force state update by creating a new array reference
      setLikes([result]); // Always create a new reference for the likes array
      setIsCurrentUserHasLiked(hasLiked);
      setNumbers((prev) => prev + 1);
    } catch (error) {
      console.error("Error liking the post:", error);
    }
  };

  return (
    <>
        <>
          <div
            className={`${
              isCurrentUserHasLiked ? "text-red-700 font-bold" : "text-gray-400"
            } zoom-in-hover` }
          >
            <div className="flex flex-row gap-1 text-sm-medium text-gray-400">
              <Heart
                size={24}
                onClick={handleClick}
                color="white"
                strokeWidth={1}
                className={`${
                  isCurrentUserHasLiked && "fill-red-500 text-red-500"
                }`}
              />
               <p className="text-sm-medium font-light">
              {likes.length > 0 && (
                <>
                  {likes.length == 1
                    ? `${likes.length}`
                    : `${likes.length}`}
                </>
              )}
            </p>
            </div>
           
          </div>
        </>
    </>
  );
}

export default AddLike;
