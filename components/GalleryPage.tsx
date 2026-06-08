import type { PortableTextBlock } from "@portabletext/types";
import { PortableText } from "next-sanity";
import { Image } from "next-sanity/image";
import { urlFor } from "@/sanity/lib/image";

type GalleryImage = {
  _key: string;
  alt?: string;
  caption?: string;
  asset: { url: string };
};

type Props = {
  title: string;
  description?: PortableTextBlock[];
  images?: GalleryImage[];
};

export function GalleryPage({ title, description, images }: Props) {
  return (
    <>
      <h1 className="text-4xl font-bold mb-4">{title}</h1>
      {description && (
        <div className="text-lg text-gray-600 mb-12">
          <PortableText value={description} />
        </div>
      )}
      {images && images.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {images.map((image) => (
            <figure key={image._key} className="flex flex-col gap-2">
              <div className="relative aspect-square overflow-hidden rounded-lg">
                <Image
                  src={urlFor(image).width(600).height(600).fit("crop").url()}
                  alt={image.alt ?? ""}
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
    </>
  );
}
