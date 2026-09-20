import type { IconType } from "react-icons";
import { BsFolderSymlinkFill } from "react-icons/bs";
import {
  FaFacebookF,
  FaInstagram,
  FaLinkedin,
  FaSnapchat,
  FaThreads,
  FaTiktok,
  FaXTwitter,
  FaYoutube,
} from "react-icons/fa6";
import { RiWhatsappFill } from "react-icons/ri";

export const SOCIAL_PLATFORMS: Record<
  string,
  { title: string; icon: IconType }
> = {
  facebook: { title: "Facebook", icon: FaFacebookF },
  instagram: { title: "Instagram", icon: FaInstagram },
  youtube: { title: "YouTube", icon: FaYoutube },
  linkedin: { title: "LinkedIn", icon: FaLinkedin },
  tiktok: { title: "TikTok", icon: FaTiktok },
  x: { title: "Twitter", icon: FaXTwitter },
  snapchat: { title: "Snapchat", icon: FaSnapchat },
  whatsapp: { title: "WhatsApp", icon: RiWhatsappFill },
  threads: { title: "Threads", icon: FaThreads },
};

export function getPlatformFallbackIcon() {
  return BsFolderSymlinkFill;
}
