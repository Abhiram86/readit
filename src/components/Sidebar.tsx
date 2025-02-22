"use client";

import { navLinks } from "@/constants/links";
import { useSidebarStore } from "@/store/sidebar";
import { useUserStore } from "@/store/user";
import Link from "next/link";
import { usePathname } from "next/navigation";
// import { BiChevronUp } from "react-icons/bi";
import { getFollowing } from "@/actions/getFollowing";
import React, { useEffect, useMemo, useState } from "react";
import { getCommunities } from "@/actions/getJoinedCommunities";
import Collapsible from "./Collapsible";

function Sidebar() {
  const { isOpen, toggle } = useSidebarStore();
  const { user } = useUserStore();
  const [following, setFollowing] = useState<
    { id: number; name: string | null }[]
  >([]);
  const [communities, setCommunities] = useState<
    { id: number; name: string }[]
  >([]);
  // const [showFollowing, setShowFollowing] = useState(false);
  const pathname = usePathname();
  useEffect(() => {
    if (user) {
      Promise.allSettled([getFollowing(user.id), getCommunities(user.id)]).then(
        (res) => {
          if (res[0].status === "fulfilled") {
            setFollowing(res[0].value);
          }
          if (res[1].status === "fulfilled") {
            // console.log(res[1].value);
            setCommunities(res[1].value);
          }
        }
      );
    }
  }, [user]);

  const memoisedFollowing = useMemo(() => following, [following]);
  const memoisedCommunities = useMemo(() => communities, [communities]);

  return (
    <aside
      className={`${
        isOpen
          ? "w-64 border-r"
          : "w-0 md:w-64 md:opacity-100 md:pointer-events-auto md:border-r opacity-0 pointer-events-none"
      } h-[calc(100dvh-58px)] p-3 overflow-y-auto space-y-2 fixed md:sticky bg-black/75 backdrop-blur-sm transition-all duration-300 overflow-x-hidden top-[57px] border-zinc-600 z-50`}
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
      {user && (
        <>
          <hr className="border-zinc-600" />
          <ul className="w-full space-y-1">
            <Collapsible
              name="Following"
              data={memoisedFollowing}
              href={`/profile`}
            />
          </ul>
          <hr className="border-zinc-600" />
          <ul className="w-full space-y-1">
            <Collapsible
              name="Communities"
              data={memoisedCommunities}
              href="/community"
            />
          </ul>
        </>
      )}
    </aside>
  );
}

export default React.memo(Sidebar);
