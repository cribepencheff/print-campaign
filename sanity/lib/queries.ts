/**
 * Alla GROQ-queries samlas här.
 * Pages importerar queries härifrån och skickar dem till sanityFetch().
 * Ingen query-logik får finnas direkt i routes eller components.
 */

// Startsida och dynamiska sidor — slug avgör vilken sida som visas
// "home" → startsidan (/), övriga → /[slug]
export const PAGE_BY_SLUG_QUERY = `*[_type == "page" && slug.current == $slug][0]{
  _type,
  title,
  slug,
  content[] {
    _type,
    _key,
    ...,
    image { ..., alt, asset-> },
    _type == "eventList" => {
      "events": *[_type == "event"] | order(date asc) {
        _id, title, date, location, description
      }
    }
  }
}`;

export const DOCUMENT_BY_SLUG_QUERY = `*[_type == "page" && slug.current == $slug][0]{
  _type,
  title,
  slug,
  content[] { _type, _key, ..., image { ..., alt, asset-> } }
}`;

// Global footer — singleton, hämtas i layout
export const FOOTER_QUERY = `*[_type == "footer"][0]{
  logo { ..., alt, asset-> },
  navigationGroups[] {
    _key,
    title,
    links[] { _key, label, href }
  },
  socialLinks[] { _key, platform, url },
  copyright
}`;

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
      linkType == "intern" && internalLink->_type == "page" && internalLink->slug.current == "home" => "/",
      linkType == "intern" && internalLink->_type == "page" => "/" + internalLink->slug.current,
      linkType == "intern" && internalLink->_type == "galleryPage" => "/gallery",
      externalUrl
    )
  }
}`;

// Gallerisida — singleton
export const GALLERY_PAGE_QUERY = `*[_type == "galleryPage"][0]{
  title,
  description,
  images[] {
    _key,
    alt,
    caption,
    asset->
  }
}`;

// Alla slugs för generateStaticParams
// Exkluderar "home" — det är index-routen (/), inte en /[slug]-sida
export const ALL_SLUGS_QUERY = `*[
  _type == "page" &&
  defined(slug.current) &&
  slug.current != "home"
][].slug.current`;
