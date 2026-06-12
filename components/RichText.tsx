import { PortableText, type PortableTextComponents } from "next-sanity";
import { Button } from "@/components/Button";

const components: PortableTextComponents = {
  types: {
    button: ({ value }) => (
      <Button
        variant={value.variant ?? "primary"}
        href={value.href}
        targetBlank={value.blank}
        className="lg:max-w-120 my-sp-sm"
      >
        {value.text}
      </Button>
    ),
  },
  marks: {
    link: ({ value, children }) => (
      <a
        href={value?.href}
        target={value?.blank ? "_blank" : undefined}
        rel={value?.blank ? "noopener noreferrer" : undefined}
      >
        {children}
      </a>
    ),
  },
};

export function RichText({ value }: { value: unknown }) {
  return <PortableText value={value} components={components} />;
}
