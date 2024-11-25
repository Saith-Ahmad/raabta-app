"use client";
import { Circle, Share, SquareArrowDownRight, SquareArrowUpRight } from 'lucide-react'

import Image from "next/image";
import { useRouter } from "next/navigation";

import { Button } from "../ui/button";

interface Props {
  id: string;
  name: string;
  username: string;
  imgUrl: string;
  personType: string;
}

function SidebarCard({ id, name, username, imgUrl, personType }: Props) {
  const router = useRouter();

  const isCommunity = personType === "Community";

  return (
    <article className='sidebarCard max-w-[250px] sidebar_right_card cursor-pointer'  onClick={() => {
      if (isCommunity) {
        router.push(`/communities/${id}`);
      } else {
        router.push(`/profile/${id}`);
      }
    }}>
      <div className='user-card_avatar '>
        <div className='relative h-12 w-12'>
          <Image
            src={imgUrl}
            alt='user_logo'
            fill
            className='rounded-full object-cover'
          />
        </div>

        <div className='flex-1 text-ellipsis'>
          <h4 className='text-base-semibold text-light-1'>{name}</h4>
          <p className='text-small-medium text-gray-1'>@{username}</p>
        </div>
      </div>
    </article>
  );
}

export default SidebarCard;