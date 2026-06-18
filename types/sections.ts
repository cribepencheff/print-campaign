import type { PortableTextBlock } from "@portabletext/types";

export type HeroSection = {
  _type: "hero";
  _key: string;
  heading: string;
  description?: PortableTextBlock[];
  image?: {
    asset: {
      _id: string;
      url: string;
      mimeType: string;
      metadata: { dimensions: { width: number; height: number } };
    };
    alt?: string;
    hotspot?: { x: number; y: number };
  };
  cta?: { text?: string; url?: string };
  layout?: "centered" | "split";
};

export type TextSection = {
  _type: "textSection";
  _key: string;
  heading?: string;
  description?: PortableTextBlock[];
  background?: "white" | "gray" | "dark";
  alignment?: "left" | "center";
};

export type Event = {
  _id: string;
  title?: string;
  date?: string;
  location?: string;
  description?: string;
};

export type EventSection = {
  _type: "eventList";
  _key: string;
  heading?: string;
  description?: string;
  events: Event[];
};

export type FileUploadSection = {
  _type: "fileUpload";
  _key: string;
  heading?: string;
  description?: string;
};

export type NewsletterSection = {
  _type: "newsletter";
  _key: string;
  heading?: string;
  description?: string;
};

export type StatementSection = {
  _type: "statementSection";
  _key: string;
  text: string;
};

export type GalleryPreviewSection = {
  _type: "galleryPreview";
  _key: string;
  heading?: string;
  description?: string;
  images: {
    _key: string;
    alt?: string;
    caption?: string;
    asset: { url: string };
  }[];
  gallerySlug?: string;
};

export type Section =
  | HeroSection
  | TextSection
  | EventSection
  | FileUploadSection
  | NewsletterSection
  | GalleryPreviewSection
  | StatementSection;
