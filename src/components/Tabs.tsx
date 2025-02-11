import Link from "next/link";

export default function Tabs({
  username,
  query,
}: {
  username: string;
  query: string;
}) {
  return (
    <div className="mt-2 pb-2 border-b mb-2 border-zinc-700">
      <ul className="flex flex-wrap gap-2">
        {tabLinks.map((link, idx) => (
          <Link
            href={`/profile/${username}?q=${link.toLowerCase()}`}
            key={idx}
            className={`cursor-pointer px-3 py-2 transition-colors font-medium text-sm whitespace-nowrap rounded-xl ${
              query === link.toLowerCase()
                ? "bg-violet-700"
                : "bg-zinc-800 hover:bg-zinc-600"
            }`}
          >
            {link}
          </Link>
        ))}
      </ul>
    </div>
  );
}

const tabLinks = [
  "General",
  "Posts",
  "Following",
  "Followers",
  "Upvoted",
  "Downvoted",
  "MyComments",
  "Saved",
];
