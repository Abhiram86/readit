import { useSidebarStore } from "@/store/sidebar";
import Link from "next/link";
import { useState } from "react";
import { BiChevronUp } from "react-icons/bi";

type CollapsibleProps = {
  name: string;
  data: { id: number; name: string | null }[];
  href: string;
};

export default function Collapsible({ name, data, href }: CollapsibleProps) {
  const [showFollowing, setShowFollowing] = useState(false);
  const { toggle } = useSidebarStore();
  return (
    <>
      <div
        onClick={() => setShowFollowing(!showFollowing)}
        className="px-4 py-2 hover:ring-1 cursor-pointer ring-zinc-700 text-zinc-400 hover:bg-zinc-800/75 rounded-lg flex items-center justify-between"
      >
        <p className="text-sm">{name}</p>
        <BiChevronUp
          className={`${!showFollowing && "rotate-180"} transition-transform`}
        />
      </div>
      <div className={`${showFollowing ? "block" : "hidden"}`}>
        {data.length === 0 ? (
          <p className="w-fit text-sm mx-auto text-zinc-300">No {name}</p>
        ) : (
          data.map((d) => (
            <Link
              href={`${href}/${d.name}`}
              onClick={toggle}
              key={d.id}
              className="flex px-4 py-[9px] rounded-lg hover:ring-1 ring-zinc-700 hover:bg-zinc-800/75 items-center text-zinc-400 gap-2 font-medium"
            >
              <div className="h-6 w-6 border rounded-full" />
              <p>{d.name}</p>
            </Link>
          ))
        )}
      </div>
    </>
  );
}
