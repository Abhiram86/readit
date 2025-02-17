import Link from "next/link";

export default function Tabs({
  showPersonal,
  name,
  query,
  tabLinks,
  personalTabLinks,
  prefix,
}: {
  showPersonal: boolean;
  name: string;
  query: string;
  tabLinks: string[];
  personalTabLinks: string[];
  prefix: string;
}) {
  return (
    <div className="tabs mt-2 px-1 pt-1 pb-2 md:w-[calc(100vw-18.25rem)] w-[calc(100vw-2.25rem)] overflow-x-auto border-b mb-2 border-zinc-700">
      <ul className="flex gap-2">
        {tabLinks.map(
          (link, idx) =>
            (showPersonal || !personalTabLinks.includes(link)) && (
              <Link
                href={`/${prefix}/${name}?q=${link.toLowerCase()}`}
                key={idx}
                className={`cursor-pointer px-4 py-2 transition-colors font-medium text-sm whitespace-nowrap rounded-xl ${
                  query === link.toLowerCase()
                    ? "bg-violet-700 ring-1 ring-violet-500"
                    : "bg-zinc-800 ring-1 ring-zinc-700 hover:bg-zinc-700"
                }`}
              >
                {link}
              </Link>
            )
        )}
      </ul>
    </div>
  );
}
