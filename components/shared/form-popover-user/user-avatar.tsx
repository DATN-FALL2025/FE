"use client";

import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useSession } from "next-auth/react";

const UserAvatar = () => {
  const { data: session } = useSession();

  // mốt sửa
  const image = session?.user.avatarUrl
    ? session?.user.avatarUrl
    : "https://github.com/shadcn.png";

  return (
    <Avatar>
      <AvatarImage src={image} alt={session?.user.email ?? "email"} />
      <AvatarFallback>{session?.user.email}</AvatarFallback>
    </Avatar>
  );
};

export default UserAvatar;
