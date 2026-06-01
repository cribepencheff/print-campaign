import { PortableText } from '@portabletext/react';
import type { PortableTextBlock } from '@portabletext/types';
import { Image } from 'next-sanity/image';
import { sanityFetch } from '@/sanity/lib/fetch';
import { urlFor } from '@/sanity/lib/image';
import { GALLERY_PAGE_QUERY } from '@/sanity/lib/queries';

type GalleryImage = {
	_key: string;
	alt?: string;
	caption?: string;
	asset: { url: string };
};

type GalleryPage = {
	title: string;
	description?: PortableTextBlock[];
	images?: GalleryImage[];
} | null;

export default async function GalleryPage() {
	const page = await sanityFetch<GalleryPage>({ query: GALLERY_PAGE_QUERY });

	if (!page) {
		return (
			<main className="p-8">
				<p className="text-gray-500">
					Skapa ett Galleri-dokument i Sanity Studio för att aktivera den här sidan.
				</p>
			</main>
		);
	}

	return (
		<main className="max-w-5xl mx-auto px-8 py-16">
			<h1 className="text-4xl font-bold mb-4">{page.title}</h1>
			{page.description && (
				<div className="text-lg text-gray-600 mb-12">
					<PortableText value={page.description} />
				</div>
			)}
			{page.images && page.images.length > 0 && (
				<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
					{page.images.map((image) => (
						<figure key={image._key} className="flex flex-col gap-2">
							<div className="relative aspect-square overflow-hidden rounded-lg">
								<Image
									src={urlFor(image).width(600).height(600).fit('crop').url()}
									alt={image.alt ?? ''}
									fill
									className="object-cover"
								/>
							</div>
							{image.caption && (
								<figcaption className="text-sm text-gray-500 text-center">
									{image.caption}
								</figcaption>
							)}
						</figure>
					))}
				</div>
			)}
		</main>
	);
}
