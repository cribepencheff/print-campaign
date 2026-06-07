import { PortableText, type PortableTextComponents } from "next-sanity";

const components: PortableTextComponents = {
  types: {
    button: ({ value }) => (
      <a
        href={value.href}
        target={value.blank ? "_blank" : undefined}
        rel={value.blank ? "noopener noreferrer" : undefined}
        className="inline-block bg-black text-white px-4 py-2 rounded hover:bg-gray-800 transition-colors"
      >
        {value.text}
      </a>
    ),
  },
};

export function RichText({ value }: { value: unknown }) {
  return <PortableText value={value} components={components} />;
}
