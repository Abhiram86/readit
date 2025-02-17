"use client";

import { SetStateAction } from "react";
import Logout from "./Logout";
// import Link from "next/link";
import ModalContainer, { ModalItem } from "./ModalContainer";
import { FaUser } from "react-icons/fa";
import { useRouter } from "next/navigation";
import { useUserStore } from "@/store/user";
import { HiUserGroup } from "react-icons/hi2";

export default function ProfileModal({
  isOpen,
  setIsOpen,
}: {
  isOpen: boolean;
  setIsOpen: React.Dispatch<SetStateAction<boolean>>;
}) {
  const router = useRouter();
  const { user } = useUserStore();
  return (
    <ModalContainer
      className={`${
        isOpen ? "top-[3.75rem] right-1" : "top-0 opacity-0 pointer-events-none"
      } right-0`}
    >
      <ul className="flex flex-col p-1 space-y-1 w-52">
        <ModalItem
          // href={"/profile?q=general"}
          onClick={() => (
            router.push(`/profile/${user?.username}?q=general`),
            setIsOpen(false)
          )}
          className="flex cursor-pointer transition-all rounded-lg hover:ring-1 ring-zinc-600 hover:bg-zinc-700 gap-2 p-2 items-center"
        >
          {/* <div className="h-8 w-8 rounded-full bg-zinc-500" /> */}
          <FaUser className="h-6 w-6 pr-1 text-zinc-300 " />
          <p>view profile</p>
        </ModalItem>
        <ModalItem
          onClick={() => (router.push("/new/community"), setIsOpen(false))}
          className="flex cursor-pointer transition-all rounded-lg hover:ring-1 ring-zinc-600 hover:bg-zinc-700 gap-2 p-2 items-center"
        >
          <HiUserGroup className="h-6 w-6 pr-1 text-zinc-300" />
          create community
        </ModalItem>
        <Logout setIsOpen={setIsOpen} />
      </ul>
    </ModalContainer>
  );
}
