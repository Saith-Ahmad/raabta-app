
import Image from "next/image";
import Link from "next/link";

import { formatDateString } from "@/lib/utils";
import ShareButton from "../shared/ShareButton";
import AddLike from "../shared/AddLike";
import DeleteThread from "../forms/DeleteThread";
import { addLikeToThread } from "@/lib/actions/thread.action";
import { threadId } from "worker_threads";
import { MessageCircleMore } from "lucide-react";

function isValidUrl(url: string): boolean {
  try {
    new URL(url); // If it's not a valid URL, this will throw
    return true;
  } catch {
    return false;
  }
}

interface Props {
  id: string;
  currentUserId: string;
  parentId: string | null;
  content: string;
  author: {
    name: string;
    image: string;
    id: string;
  };
  community: {
    id: string;
    name: string;
    image: string;
  } | null;
  createdAt: string;
  comments: {
    author: {
      image: string;
    };
  }[];
  isComment?: boolean;
  threadImage?: string,
}

async function ThreadCard({
  threadImage,
  id,
  currentUserId,
  parentId,
  content,
  author,
  community,
  createdAt,
  comments,
  isComment,
}: Props) {
  return (
    <article
      className={`flex w-full flex-col rounded-xl  ${isComment ? "px-0 xs:px-6" : "bg-dark-2 thread_card_bg"
        }`}
    >
      <div className='flex items-start justify-between cursor-pointer'>
        <div className='flex w-full flex-1 flex-row gap-4'>
          <div className='flex flex-col items-center'>
            {!threadImage && (
              <div className='thread-card_bar' /> 
            )}
          </div>

          <div className='flex w-full flex-col'>
            <div className="flex flex-row gap-2 justify-start items-center">
            <Link href={`/profile/${author.id}`} className='relative h-11 w-11'>
              <Image
                src={author.image}
                alt='user_community_image'
                fill
                className='cursor-pointer rounded-full zoom-in-hover'
              />
            </Link>
            <Link href={`/profile/${author.id}`} className='w-fit'>
              <h4 className='cursor-pointer text-base-semibold text-light-1'>
                {author.name}
              </h4>
            </Link>
            </div>

            <p className='mt-2 text-base-regular  text-light-2'>{content}</p>
            {threadImage && threadImage.length > 10 && isValidUrl(threadImage) && (
              <Link href={`/thread/${id}`}>
                <div className="w-full rounded-2xl mt-4 shadow-md shadow-[#ffffff35]">
                  <Image
                    src={threadImage}
                    alt={content.slice(0, 10)}
                    layout="responsive"
                    width={0}
                    height={0}
                    className="rounded-xl text-gray-300 font-light text-small-regular"
                    quality={95}
                    placeholder="blur"
                    blurDataURL="/assets/technology.webp"
                  />
                </div>
              </Link>
            )}

            <div className={`${isComment && "mb-10"} mt-5 flex flex-col gap-3`}>
              <div className='flex gap-3.5'>
                <AddLike threadId={id.toString()} userId={currentUserId.toString()} />
                <div className=" text-sm-medium text-gray-400 ms-2 zoom-in-hover">
                  <Link href={`/thread/${id}`} className="flex flex-row gap-1">
                    <MessageCircleMore
                      size={24}
                      strokeWidth={1}
                      color="white"
                    />
                  </Link>
                </div>
                <ShareButton
                  postUrl={`https://raabta.vercel.app/thread/${id}`}
                />
              </div>

              {isComment && comments.length > 0 && (
                <Link href={`/thread/${id}`}>
                  <p className='mt-1 text-[14px] text-gray-400'>
                    {comments.length} repl{comments.length > 1 ? "ies" : "y"}
                  </p>
                </Link>
              )}
            </div>
          </div>
        </div>
        <DeleteThread
          threadId={JSON.stringify(id)}
          currentUserId={currentUserId}
          authorId={author.id}
          parentId={parentId}
          isComment={isComment}
        />
      </div>

      {!isComment && comments.length > 0 && (
        <div className='ml-1 mt-3 flex items-center gap-2'>
          {comments.slice(0, 4).map((comment, index) => (
            <Image
              key={index}
              src={comment.author.image}
              alt={`user_${index}`}
              width={24}
              height={24}
              className={`${index !== 0 && "-ml-5"} rounded-full object-cover`}
            />
          ))}

          <Link href={`/thread/${id}`}>
            <p className='mt-1 text-[14px] text-gray-400'>
              {comments.length} repl{comments.length > 1 ? "ies" : "y"}
            </p>
          </Link>
        </div>
      )}

      {!isComment && community && (
        <Link
          href={`/communities/${community.id}`}
          className='mt-5 flex items-center'
        >
          <div className='text-[15px] text-gray-400 ms-2'>
            {formatDateString(createdAt)}
            {community && (<span><span className="text-primary-500 font-semibold"> {community.name}</span> Community</span>)}
          </div>

          <Image
            src={community.image}
            alt={community.name}
            width={20}
            unoptimized
            height={20}
            className='ml-1 rounded-full object-cover'
          />
        </Link>
      )}
    </article>
  );
}

export default ThreadCard;