"use client";

import { useSidebarStore } from "@/store/sidebar";
import { BiSearch, BiMenu, BiPlus } from "react-icons/bi";
import ProfileModal from "./ProfileModal";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { UserData, useUserStore } from "@/store/user";
import { useRouter } from "next/navigation";
import React from "react";

function Navbar({ userData }: { userData: UserData | null }) {
  const { toggle } = useSidebarStore();
  const { user, login } = useUserStore();
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();
  // const [searchQuery, setSearchQuery] = useState("");
  const searchQueryRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (userData) {
      login(userData);
    }
  }, [userData, login]);

  return (
    <header className="sticky top-0 z-50 border-b border-zinc-600 bg-black/70 backdrop-blur">
      <nav className="flex justify-between items-center space-x-2 p-2">
        <BiMenu
          className="h-8 md:w-0 md:h-0 md:p-0 transition-all duration-300 w-8 p-1 cursor-pointer hover:bg-zinc-700 rounded"
          onClick={toggle}
        />
        <div
          onClick={() => router.replace("/")}
          className="w-9 h-9 bg-gradient-to-br from-violet-700 to-purple-900 rounded-full mr-1"
        />
        <div className="peer relative flex-1">
          <input
            type="text"
            // value={searchQuery}
            ref={searchQueryRef}
            placeholder="Search"
            className="p-2 pl-4 pr-10 transition focus:ring-2 focus:bg-zinc-900 ring-violet-700 outline-none hover:bg-zinc-700 w-full bg-zinc-800 rounded-3xl"
          />
          <BiSearch
            className="h-5 w-5 absolute top-3 cursor-pointer right-3"
            onClick={() =>
              searchQueryRef.current && searchQueryRef.current.value.length > 0
                ? router.replace(`/?q=${searchQueryRef.current.value}`)
                : router.replace(`/`)
            }
          />
        </div>
        <div className="peer-focus:w-1/4 flex gap-2 items-center">
          {user ? (
            <>
              <Link
                href="/new/problem"
                className="truncatse p-[6px] cursor-pointer transition-colors hover:bg-zinc-700 rounded-3xl items-center"
              >
                <BiPlus className="h-6 w-6" />
              </Link>
              <div
                className="w-9 h-9 border cursor-pointer transition-all hover:border-2 border-violet-500 rounded-full"
                onClick={() => setIsOpen((prev) => !prev)}
              />
              {isOpen && <ProfileModal isOpen={isOpen} setIsOpen={setIsOpen} />}
            </>
          ) : (
            <div>
              <Link
                href="/signin"
                className="py-2 px-4 rounded-3xl bg-violet-700"
              >
                Login
              </Link>
            </div>
          )}
        </div>
      </nav>
    </header>
  );
}

export default React.memo(Navbar);
