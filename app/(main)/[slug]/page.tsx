import type { PortableTextBlock } from "@portabletext/types";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { GalleryPage } from "@/components/GalleryPage";
import { SectionRenderer } from "@/components/SectionRenderer";
import { sanityFetch } from "@/sanity/lib/fetch";
import {
  ALL_SLUGS_QUERY,
  DOCUMENT_BY_SLUG_QUERY,
  METADATA_BY_SLUG_QUERY,
} from "@/sanity/lib/queries";
import type { Section } from "@/types/sections";

type GalleryImage = {
  _key: string;
  alt?: string;
  caption?: string;
  asset: { url: string };
};

type Page =
  | {
      _type: "page";
      title: string;
      sections: Section[];
    }
  | {
      _type: "galleryPage";
      title: string;
      description?: PortableTextBlock[];
      images?: GalleryImage[];
    }
  | null;

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const doc = await sanityFetch<{ title: string } | null>({
    query: METADATA_BY_SLUG_QUERY,
    params: { slug },
  });
  return { title: doc?.title };
}

export async function generateStaticParams() {
  const slugs = await sanityFetch<string[]>({
    query: ALL_SLUGS_QUERY,
    revalidate: false,
  });
  return slugs.map((slug) => ({ slug }));
}

export default async function SlugPage({ params }: Props) {
  const { slug } = await params;

  if (slug === "home") notFound();

  const doc = await sanityFetch<Page>({
    query: DOCUMENT_BY_SLUG_QUERY,
    params: { slug },
  });

  if (!doc) notFound();

  if (doc._type === "galleryPage") {
    return (
      <GalleryPage
        title={doc.title}
        description={doc.description}
        images={doc.images}
      />
    );
  }

  return <SectionRenderer sections={doc.sections ?? []} pageType={doc._type} />;
}
