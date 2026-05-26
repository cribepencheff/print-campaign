import type { PortableTextBlock } from "@portabletext/types";

export type HeroSection = {
  _type: "hero";
  _key: string;
  title: string;
  description?: string;
  image?: {
    asset: { _id: string; url: string };
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
  body?: PortableTextBlock[];
  background?: "white" | "gray" | "dark";
  alignment?: "left" | "center";
};

export type Section = HeroSection | TextSection;
