"use client";

import { Share2 } from "lucide-react";
import { useState, useEffect } from "react";
import {
  FacebookShareButton,
  TwitterShareButton,
  WhatsappShareButton,
  LinkedinShareButton,
  TelegramShareButton,
  RedditShareButton,
  FacebookIcon,
  TwitterIcon,
  WhatsappIcon,
  LinkedinIcon,
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

  const themeColor = "white"; 
  const iconBgColor = "transparent"; 

  return (
    <div className="relative" onClick={toggleOptions}>
      {/* Share button */}
        <div className="flex flex-row gap-1 text-sm-medium text-gray-400 ms-2 zoom-in-hover">
        <Share2 strokeWidth={1} color="white"/>
        </div>

      {showOptions && (
        <div className="absolute top-full -left-[160px] mt-2 flex flex-row gap-4 sidebar_left_class_active shadow-md px-2 py-2 rounded text-white">
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
