export default function PostForm({
  children,
  submitText = "create new post",
  onSubmit,
}: {
  children: React.ReactNode;
  submitText?: string;
  onSubmit: (e: React.FormEvent) => void;
}) {
  return (
    <form onSubmit={onSubmit} className="flex flex-col p-2 gap-2">
      {children}
      <button
        type="submit"
        className="p-3 mt-2 bg-violet-700 hover:bg-violet-900 transition-colors w-full rounded-xl"
      >
        {submitText}
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

export function ImageOrVideo({ name }: { name: string }) {
  return (
    <input
      type="file"
      name={name}
      accept="image/*, video/*"
      className="p-2 ring-1 ring-violet-950 file:bg-violet-700 file:text-sm file:py-1 file:text-white rounded-xl file:border-0 file:rounded-md transition-colors hover:bg-violet-800 hover:file:bg-zinc-900 w-full"
    />
  );
}
