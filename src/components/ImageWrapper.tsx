"use client";

import { useState } from "react";
// import ImagePopOpen from "./ImagePopOpen";

export default function ImageWrapper({
  children,
}: // imgSrc,
{
  children: React.ReactNode;
  imgSrc: string;
}) {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div
      onClick={(e) => (e.stopPropagation(), setIsOpen(!isOpen))}
      className="w-full bg-zinc-900 my-1 overflow-hidden relative rounded-xl border border-zinc-700"
    >
      {children}
      {/* {isOpen && <ImagePopOpen imgSrc={imgSrc} />} */}
    </div>
  );
}
