"use client";

import { useUserStore } from "@/store/user";
import { FiLogOut } from "react-icons/fi";

export default function Logout({
  setIsOpen,
}: {
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const { logout } = useUserStore();
  return (
    <li
      onClick={() => (logout(), setIsOpen(false))}
      className="flex cursor-pointer transition-colors rounded hover:bg-zinc-700 gap-2 p-2 items-center"
    >
      <FiLogOut className="h-6 w-6" />
      <p>logout</p>
    </li>
  );
}
