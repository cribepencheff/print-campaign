import { sanityFetch } from "@/sanity/lib/fetch";
import { SectionRenderer } from "@/components/SectionRenderer";
import { ALL_SLUGS_QUERY, DOCUMENT_BY_SLUG_QUERY } from "@/sanity/lib/queries";
import { notFound } from "next/navigation";
import type { Section } from "@/types/sections";

type Page = {
  _type: "page";
  title: string;
  content: Section[];
} | null;

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  const slugs = await sanityFetch<string[]>({
    query: ALL_SLUGS_QUERY,
    revalidate: false,
  });
  return slugs.map((slug) => ({ slug }));
}

export default async function SlugPage({ params }: Props) {
  const { slug } = await params;
  const page = await sanityFetch<Page>({
    query: DOCUMENT_BY_SLUG_QUERY,
    params: { slug },
  });

  if (!page) notFound();

  return (
    <main>
      <SectionRenderer sections={page.content ?? []} />
    </main>
  );
}
