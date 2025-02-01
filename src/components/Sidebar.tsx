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
        isOpen ? "w-64 p-2 border-r" : "w-0 md:w-64 md:border-r md:p-2 p-0"
      } h-[calc(100dvh-62px)] bg-black/85 backdrop-blur-sm transition-all duration-300 overflow-hidden sticky top-[58px] border-zinc-600 z-50`}
    >
      <ul className="space-y-1">
        {navLinks.map((link) => (
          <Link
            href={link.path}
            key={link.name}
            onClick={toggle}
            className={`flex px-4 py-2 w-full transition-all cursor-pointer rounded gap-2 ${
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
