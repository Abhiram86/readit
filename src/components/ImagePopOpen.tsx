import Image from "next/image";
import ModalContainer from "./ModalContainer";

export default function ImagePopOpen({ imgSrc }: { imgSrc: string }) {
  return (
    <ModalContainer className="fixed w-[calc(100vw-2rem)] top-full left-1/2 -translate-x-1/2 -translate-y-1/2 h-screen border bg-black/75">
      <p></p>
      <div className="flex items-center justify-center">
        <Image src={imgSrc} width={1200} height={1200} alt="img" />
      </div>
    </ModalContainer>
  );
}
