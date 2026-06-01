import type { EventSection as EventSectionType } from "@/types/sections";
import Link from "next/link";

export function EventSection({ section }: { section: EventSectionType }) {
  return (
    <section className="py-16 px-8">
      <div className="max-w-2xl">
        {section.heading && (
          <h2 className="text-2xl font-bold mb-6">{section.heading}</h2>
        )}
        {section.description && (
          <div className="prose prose-lg">
            <p>{section.description}</p>
          </div>
        )}

        {section.events && (
          <ul className="mt-8 space-y-4">
            {section.events.map((event) => (
              <li key={event._id} className="p-4 border rounded">
                <p className="font-medium">{event.title}</p>
                {event.date && (
                  <p className="text-sm text-gray-500">
                    {new Date(event.date).toLocaleDateString("sv-SE", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </p>
                )}
                {event.location && (
                  <>
                    <p className="text-sm text-gray-500">{event.location}</p>
                    <Link
                      href={`https://maps.google.com/?q=${encodeURIComponent(event.location)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-500 hover:underline"
                    >
                      Hitta hit
                    </Link>
                  </>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}
