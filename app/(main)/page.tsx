import { SectionRenderer } from "@/components/SectionRenderer";
import { sanityFetch } from "@/sanity/lib/fetch";
import { PAGE_BY_SLUG_QUERY } from "@/sanity/lib/queries";
import type { Section } from "@/types/sections";

type HomePage = {
  title: string;
  content: Section[];
} | null;

export default async function Home() {
  const page = await sanityFetch<HomePage>({
    query: PAGE_BY_SLUG_QUERY,
    params: { slug: "home" },
  });

  if (!page) {
    return (
      <main className="p-8">
        <p className="text-gray-500">
          Skapa en sida med slug &quot;home&quot; i Sanity Studio för att
          aktivera startsidan.
        </p>
      </main>
    );
  }

  return (
    <main>
      <SectionRenderer sections={page.content ?? []} />
    </main>
  );
}
