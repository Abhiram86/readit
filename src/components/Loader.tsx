export default function Loader() {
  return (
    <div className="flex items-center gap-2">
      <p className="pb-1">Loading</p>
      <div className="flex gap-2">
        <span className="w-1 h-1 rounded-full bg-zinc-300 animate-ping"></span>
        <span className="w-1 h-1 rounded-full bg-zinc-300 animate-ping"></span>
        <span className="w-1 h-1 rounded-full bg-zinc-300 animate-ping"></span>
      </div>
    </div>
  );
}
