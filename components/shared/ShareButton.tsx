"use client";

import Image from "next/image";
import { useState, useEffect } from "react";
import {
  FacebookShareButton,
  TwitterShareButton,
  WhatsappShareButton,
  LinkedinShareButton,
  EmailShareButton,
  TelegramShareButton,
  RedditShareButton,
  FacebookIcon,
  TwitterIcon,
  WhatsappIcon,
  LinkedinIcon,
  EmailIcon,
  TelegramIcon,
  RedditIcon,
} from "react-share";

const ShareButton = ({ postUrl }: { postUrl: string }) => {
  const [showOptions, setShowOptions] = useState(false);

  const toggleOptions = () => {
    setShowOptions((prev) => !prev);
  };

  useEffect(() => {
    let timeout: NodeJS.Timeout;

    if (showOptions) {
      timeout = setTimeout(() => {
        setShowOptions(false);
      }, 3000);
    }

    return () => clearTimeout(timeout);
  }, [showOptions]);

  const themeColor = "#4CAF50"; // Example: Your custom theme color (green)
  const iconBgColor = "transparent"; // Transparent background for icons

  return (
    <div className="relative">
      {/* Share button */}
      <Image
       src='/assets/repost.svg'
       alt='heart'
       width={24}
       height={24}
       className='cursor-pointer object-contain'
        onClick={toggleOptions}
      />

      {showOptions && (
        <div className="absolute top-full mt-2 flex flex-row gap-4 bg-dark-1 shadow-md p-4 rounded text-white">
          <FacebookShareButton url={postUrl}>
            <FacebookIcon
              size={32}
              round
              bgStyle={{ fill: iconBgColor }}
              iconFillColor={themeColor}
            />
          </FacebookShareButton>

          <TwitterShareButton url={postUrl}>
            <TwitterIcon
              size={32}
              round
              bgStyle={{ fill: iconBgColor }}
              iconFillColor={themeColor}
            />
          </TwitterShareButton>

          <WhatsappShareButton url={postUrl}>
            <WhatsappIcon
              size={32}
              round
              bgStyle={{ fill: iconBgColor }}
              iconFillColor={themeColor}
            />
          </WhatsappShareButton>

          <LinkedinShareButton url={postUrl}>
            <LinkedinIcon
              size={32}
              round
              bgStyle={{ fill: iconBgColor }}
              iconFillColor={themeColor}
            />
          </LinkedinShareButton>

          <EmailShareButton url={postUrl}>
            <EmailIcon
              size={32}
              round
              bgStyle={{ fill: iconBgColor }}
              iconFillColor={themeColor}
            />
          </EmailShareButton>

          <TelegramShareButton url={postUrl}>
            <TelegramIcon
              size={32}
              round
              bgStyle={{ fill: iconBgColor }}
              iconFillColor={themeColor}
            />
          </TelegramShareButton>


          <RedditShareButton url={postUrl}>
            <RedditIcon
              size={32}
              round
              bgStyle={{ fill: iconBgColor }}
              iconFillColor={themeColor}
            />
          </RedditShareButton>
        </div>
      )}
    </div>
  );
};

export default ShareButton;
