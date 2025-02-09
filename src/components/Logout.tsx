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
    <div className="pt-1 border-t border-zinc-600">
      <li
        onClick={() => (logout(), setIsOpen(false))}
        className="flex cursor-pointer transition-colors rounded-lg hover:ring-1 ring-red-800 text-red-400 hover:bg-red-950 gap-2 p-2 items-center"
      >
        <FiLogOut className="h-6 w-6" />
        <p>logout</p>
      </li>
    </div>
  );
}
