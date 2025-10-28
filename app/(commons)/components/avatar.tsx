"use client";

interface AvatarProps {
  epid?: string;
  knoxId?: string;
  size?: string;
  ring?: boolean;
  round?: boolean;
}

export default function Avatar({
  epid = "M",
  knoxId = "guest",
  size = "size-10",
  ring = false,
  round = true,
}: AvatarProps) {
  return (
    <img
      src={`/images/profile/${knoxId}.jpg`}
      className={`${round ? "rounded-full" : ""} ${
        ring ? "hover:ring ring-highlight" : ""
      } ${size}`}
      onError={(e) => (e.currentTarget.src = `/api/proxy/avatar?epid=${epid}`)}
    />
  );
}
