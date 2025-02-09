export default function ModalContainer({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      onClick={(e) => e.stopPropagation()}
      className={`absolute flex flex-col transition-all duration-300 ring-1 ring-zinc-600 bg-zinc-800 rounded-md z-40 ${className}`}
    >
      {children}
    </div>
  );
}

export function ModalItem({
  children,
  className,
  onClick,
}: {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
}) {
  return (
    <li
      onClick={onClick}
      className={`flex cursor-pointer transition-all rounded-lg hover:ring-1 ring-zinc-600 hover:bg-zinc-700 gap-2 items-center ${className}`}
    >
      {children}
    </li>
  );
}
