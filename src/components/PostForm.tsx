export default function PostForm({
  children,
  onSubmit,
}: {
  children: React.ReactNode;
  onSubmit: (e: React.FormEvent) => void;
}) {
  return (
    <form onSubmit={onSubmit} className="flex flex-col p-2 gap-2">
      {children}
      <button
        type="submit"
        className="p-3 mt-2 bg-violet-700 hover:bg-violet-900 transition-colors w-full rounded-xl"
      >
        post
      </button>
    </form>
  );
}

export function TextArea({ placeholder }: { placeholder: string }) {
  return (
    <textarea
      rows={4}
      name="description"
      className="p-3 hover:h-auto bg-zinc-800 hover:bg-zinc-700 rounded-xl outline-none w-full transition-all focus:bg-zinc-900 focus:ring-2 ring-violet-700 placeholder:text-zinc-500"
      placeholder={placeholder}
    />
  );
}

export function ImageOrVideo() {
  return (
    <input
      type="file"
      name="file"
      accept="image/*, video/*"
      className="p-2 ring-1 ring-violet-950 file:bg-violet-700 file:text-sm file:py-1 file:px-2 file:text-white rounded-xl file:mr-2 file:border-0 file:rounded-md transition-colors w-full hover:bg-violet-950"
    />
  );
}
