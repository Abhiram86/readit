"use client";

import { navLinks } from "@/constants/links";
import { useSidebarStore } from "@/store/sidebar";
import { useUserStore } from "@/store/user";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { BiChevronUp } from "react-icons/bi";
import { getFollowing } from "@/actions/getFollowing";
import { useEffect, useState } from "react";

export default function Sidebar() {
  const { isOpen, toggle } = useSidebarStore();
  const { user } = useUserStore();
  const [following, setFollowing] = useState<
    { followerId: number; username: string | null }[]
  >([]);
  const [showFollowing, setShowFollowing] = useState(false);
  const pathname = usePathname();
  useEffect(() => {
    if (user) {
      getFollowing(user.id).then((res) => {
        setFollowing(res);
      });
    }
  }, [user]);
  return (
    <aside
      className={`${
        isOpen
          ? "w-64 border-r"
          : "w-0 md:w-64 md:opacity-100 md:pointer-events-auto md:border-r opacity-0 pointer-events-none"
      } h-[calc(100dvh-60px)] p-3 space-y-2 fixed md:sticky bg-black/75 backdrop-blur-sm transition-all duration-300 overflow-hidden top-[58px] border-zinc-600 z-50`}
    >
      <ul className="space-y-1">
        {navLinks.map((link) => (
          <Link
            href={link.path}
            key={link.name}
            onClick={toggle}
            className={`flex px-4 py-2 w-full transition-all cursor-pointer rounded-lg gap-2 ${
              link.path === pathname
                ? "bg-violet-700 ring-1 ring-violet-500"
                : "hover:bg-zinc-700 hover:ring-1 ring-zinc-600"
            }`}
          >
            <link.icon className="h-6 w-6" />
            <p className="relative top-[1px]">{link.name}</p>
          </Link>
        ))}
      </ul>
      <hr className="border-zinc-600" />
      <ul className="w-full space-y-1">
        <div
          onClick={() => setShowFollowing(!showFollowing)}
          className="px-4 py-2 hover:ring-1 cursor-pointer ring-zinc-700 text-zinc-400 hover:bg-zinc-800 rounded-lg flex items-center justify-between"
        >
          <p className="text-sm">following</p>
          <BiChevronUp
            className={`${showFollowing && "rotate-180"} transition-transform`}
          />
        </div>
        <div
          className={`${
            showFollowing ? "h-max" : "max-h-0 overflow-hidden"
          } transition-all ease-in`}
        >
          {user &&
            following.map((follow) => (
              <div
                key={follow.followerId}
                className="flex px-4 py-[9px] rounded-lg hover:ring-1 ring-zinc-700 hover:bg-zinc-800 items-center text-zinc-400 gap-2 font-medium"
              >
                <div className="h-6 w-6 border rounded-full" />
                <p>{follow.username}</p>
              </div>
            ))}
        </div>
      </ul>
      <hr className="border-zinc-600" />
      <div className="h-44 bg-zinc-800"></div>
    </aside>
  );
}
