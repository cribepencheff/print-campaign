import { SiInstagram } from "react-icons/si";
import { Button } from "@/components/Button";
import { sanityFetch } from "@/sanity/lib/fetch";
import { FOOTER_QUERY } from "@/sanity/lib/queries";

export async function Footer() {
  const data = await sanityFetch<{ footerText?: string }>({
    query: FOOTER_QUERY,
    tags: ["settings"],
  });

  return (
    <footer className="bg-black text-white">
      <div className="grid lg:grid-cols-[4fr_2fr] gap-sp-xl max-w-container mx-auto">
        <div>
          <h3 className="flex iwhitespace-pre-line tems-center gap-sp-sm heading text-xl leading-none mb-sp-sm">
            {/* eslint-disable-next-line @next/next/no-img-element -- SVG, next/image doesn't support it */}
            <img
              src="/brand/logo_v2.svg"
              alt="Antirasistisk valstuga logotyp"
              className="h-10 shrink-0"
            />
            Antirasistisk <br />
            valstuga
          </h3>

          {data?.footerText && (
            <p className="whitespace-pre-line text-white/70 leading-relaxed text-sm">
              {data.footerText}
            </p>
          )}
        </div>

        <div className="flex flex-col items-start gap-sp-md">
          <p className="whitespace-pre-line text-white/70 leading-relaxed text-sm">
            Följ oss på instagram för att hålla dig uppdaterad om tid & plats
            för våra stopp!
          </p>

          <Button
            variant="outline"
            size="small"
            href="https://www.instagram.com/skyddsrummet_/"
            icon={<SiInstagram />}
            targetBlank
            className="border-current text-current/60 max-w-fit hover:text-current shadow-white/60"
          >
            _skyddsrummet
          </Button>
        </div>
      </div>
    </footer>
  );
}
