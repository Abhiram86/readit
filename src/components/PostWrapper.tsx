"use client";

import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function PostWrapper({
  id,
  children,
}: {
  id: number;
  children: React.ReactNode;
}) {
  const router = useRouter();
  const [onPage, setOnPage] = useState(false);
  const pathname = usePathname();
  useEffect(() => {
    const handlePage = () => setOnPage(pathname === `/problem/${id}`);
    handlePage();
  }, [id, pathname]);
  return (
    <div
      className={`font-sans p-2 ring-zinc-800 transition-all duration-300 rounded-lg ${
        onPage ? "" : "hover:ring-1 hover:bg-zinc-900"
      }`}
      onClick={() => !onPage && router.push(`/problem/${id}`)}
    >
      {children}
    </div>
  );
}
