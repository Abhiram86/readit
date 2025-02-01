import { SetStateAction } from "react";
import Logout from "./Logout";

export default function ProfileModal({
  isOpen,
  setIsOpen,
}: {
  isOpen: boolean;
  setIsOpen: React.Dispatch<SetStateAction<boolean>>;
}) {
  return (
    <div
      className={`absolute font-sans ${
        isOpen ? "top-[3.75rem]" : "top-0 opacity-0 pointer-events-none"
      } right-0 transition-all duration-300 bg-zinc-800 rounded-md z-40`}
    >
      <ul className="flex flex-col p-2 space-y-1 w-52">
        <li className="flex cursor-pointer transition-colors rounded hover:bg-zinc-700 gap-2 p-2 items-center">
          <div className="h-8 w-8 rounded-full bg-zinc-500" />
          <p>view profile</p>
        </li>
        <li className="flex cursor-pointer transition-colors rounded hover:bg-zinc-700 gap-2 p-2 items-center">
          <div className="h-8 w-8 rounded-full bg-zinc-500" />
          <p>Username</p>
        </li>
        <li className="flex cursor-pointer transition-colors rounded hover:bg-zinc-700 gap-2 p-2 items-center">
          <div className="h-8 w-8 rounded-full bg-zinc-500" />
          <p>Username</p>
        </li>
        <li className="flex cursor-pointer transition-colors rounded hover:bg-zinc-700 gap-2 p-2 items-center">
          <div className="h-8 w-8 rounded-full bg-zinc-500" />
          <p>Username</p>
        </li>
        <Logout setIsOpen={setIsOpen} />
      </ul>
    </div>
  );
}
