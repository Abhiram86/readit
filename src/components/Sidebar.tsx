"use client";

import { navLinks } from "@/constants/links";
import { useSidebarStore } from "@/store/sidebar";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Sidebar() {
  const { isOpen, toggle } = useSidebarStore();
  const pathname = usePathname();
  return (
    <aside
      className={`${
        isOpen
          ? "w-64 p-4 border-r"
          : "w-0 md:w-64 opacity-0 pointer-events-none"
      } h-[calc(100dvh-60px)] fixed md:sticky bg-black/85 backdrop-blur-sm transition-all duration-300 overflow-hidden top-[58px] border-zinc-600 z-50`}
    >
      <ul className="space-y-1">
        {navLinks.map((link) => (
          <Link
            href={link.path}
            key={link.name}
            onClick={toggle}
            className={`flex px-4 py-2 w-full transition-all cursor-pointer rounded-lg gap-2 ${
              link.path === pathname ? "bg-violet-700" : "hover:bg-zinc-700"
            }`}
          >
            <link.icon className="h-6 w-6" />
            <p className="relative top-[1px]">{link.name}</p>
          </Link>
        ))}
      </ul>
    </aside>
  );
}
