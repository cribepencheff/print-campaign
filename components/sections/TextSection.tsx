import { PortableText } from "@portabletext/react";
import type { TextSection as TextSectionType } from "@/types/sections";

const bgClass: Record<NonNullable<TextSectionType["background"]>, string> = {
  white: "bg-white",
  gray: "bg-gray-100",
  dark: "bg-gray-900 text-white",
};

export function TextSection({ section }: { section: TextSectionType }) {
  const bg = bgClass[section.background ?? "white"];
  const align = section.alignment === "center" ? "text-center mx-auto" : "";

  return (
    <section className={`py-16 px-8 ${bg}`}>
      <div className={`max-w-2xl ${align}`}>
        {section.heading && (
          <h2 className="text-2xl font-bold mb-6">{section.heading}</h2>
        )}
        {section.body && (
          <div className="prose prose-lg">
            <PortableText value={section.body} />
          </div>
        )}
      </div>
    </section>
  );
}
