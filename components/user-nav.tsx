"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  // DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { createClient } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";
import React from "react";
import { User } from "@supabase/supabase-js";

export function UserNav({
  isAdmin,
  isGuest,
}: {
  isAdmin: boolean;
  isGuest: boolean;
}) {
  const router = useRouter();
  const supabase = createClient();
  const [userData, setUserData] = React.useState<User | null>(null);

  React.useEffect(() => {
    supabase.auth.getUser().then((data) => {
      if (data.data.user) {
        setUserData(data.data.user);
        console.log(data.data.user);
      } else {
        router.push("/login");
      }
    });
  }, [supabase.auth]);
  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/login");
  };
  return (
    userData && (
      <div className="flex items-center space-x-4">
        <div>
          {
            isAdmin && (
              <Button
                variant="ghost"
                onClick={() => router.push("/dashboard")}
                className="cursor-pointer"
              >
                Admin Panel
              </Button>
            )
          }
          {
            isGuest && (
              <Button
                variant="ghost"
                onClick={() => router.push("/guest")}
                className="cursor-pointer"
              >
                Guest Panel
              </Button>
            )
          }
        </div>
        <div className="">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                <Avatar className="h-8 w-8">
                  <AvatarImage
                    src={userData?.user_metadata?.avatar_url}
                    alt={userData?.user_metadata?.name}
                  />
                  <AvatarFallback>JD</AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end" forceMount>
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium leading-none">
                    {userData?.user_metadata?.full_name}
                  </p>
                  <p className="text-xs leading-none text-zinc-500 dark:text-zinc-400">
                    {userData?.email}
                  </p>
                </div>
              </DropdownMenuLabel>
              {/* <DropdownMenuSeparator /> */}
              {/* <DropdownMenuGroup>
          <DropdownMenuItem>
            Profile
            <DropdownMenuShortcut>⇧⌘P</DropdownMenuShortcut>
          </DropdownMenuItem>
          <DropdownMenuItem>
            Settings
            <DropdownMenuShortcut>⌘S</DropdownMenuShortcut>
          </DropdownMenuItem>
        </DropdownMenuGroup> */}
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => handleLogout()}
                className="cursor-pointer"
              >
                Log out
                <DropdownMenuShortcut>⇧⌘Q</DropdownMenuShortcut>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    )
  );
}
