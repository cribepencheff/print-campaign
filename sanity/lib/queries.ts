/**
 * Alla GROQ-queries samlas här.
 * Pages importerar queries härifrån och skickar dem till sanityFetch().
 * Ingen query-logik får finnas direkt i routes eller components.
 */

// Startsida — "home"-sluggen renderas som index-routen (/)
export const PAGE_BY_SLUG_QUERY = `*[_type == "page" && slug.current == $slug][0]{
  _type,
  title,
  slug,
  "sections": content[] {
    _type,
    _key,
    ...,
    image { ..., alt, asset-> },
    _type == "eventList" => {
      "events": *[_type == "event"] | order(date asc) {
        _id, title, date, location, description
      }
    },
    _type == "galleryPreview" => {
      "images": *[_type == "galleryPage"][0].images[0...4]{ _key, alt, caption, asset-> },
      "gallerySlug": *[_type == "galleryPage"][0].slug.current
    }
  }
}`;

// Dynamisk route — matchar page och galleryPage på slug
// coalesce ger galleryPage fallback "galleri" om slug saknas på befintligt dokument
export const DOCUMENT_BY_SLUG_QUERY = `*[
  (_type == "page" || _type == "galleryPage") &&
  coalesce(slug.current, "galleri") == $slug
][0]{
  _type,
  title,
  slug,
  "sections": select(_type == "page" => content[] { _type, _key, ..., image { ..., alt, asset-> } }),
  "description": select(_type == "galleryPage" => description),
  "images": select(_type == "galleryPage" => images[] { _key, alt, caption, asset-> })
}`;

// Footer-data från settings-singleton
export const FOOTER_QUERY = `*[_type == "settings"][0]{ footerText }`;

// Globala inställningar — singleton
export const SETTINGS_QUERY = `*[_type == "settings"][0]{
  siteTitle,
  description
}`;

// Navigationslänkar — hämtas i layout
export const NAV_QUERY = `*[_type == "settings"][0]{
  "links": navigationLinks[] {
    label,
    "href": select(
      linkType == "intern" && internalLink->slug.current == "home" => "/",
      linkType == "intern" => "/" + internalLink->slug.current,
      externalUrl
    )
  }
}`;

// Alla slugs för generateStaticParams
// Exkluderar "home" — det är index-routen (/), inte en /[slug]-sida
// coalesce ger galleryPage fallback "galleri" om slug saknas på befintligt dokument
export const ALL_SLUGS_QUERY = `*[
  (_type == "page" && defined(slug.current) && slug.current != "home") ||
  _type == "galleryPage"
]{ "slug": coalesce(slug.current, "galleri") }.slug`;
