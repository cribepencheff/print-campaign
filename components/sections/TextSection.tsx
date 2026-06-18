import { RichText } from "@/components/RichText";
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
    <section className={bg}>
      <div className={`flex flex-col w-full container mx-auto ${align}`}>
        {section.heading && (
          <h2 className="text-4xl max-w-2xl mb-4">{section.heading}</h2>
        )}
        {section.description && (
          <div className="prose prose-lg not-md:prose-base">
            <RichText value={section.description} />
          </div>
        )}
      </div>
    </section>
  );
}
