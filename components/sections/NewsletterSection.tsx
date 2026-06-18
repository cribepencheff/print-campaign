"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import {
  CircleAlert,
  HeartHandshake,
  LoaderCircle,
  Megaphone,
} from "lucide-react";
import Link from "next/link";
import { useEffect } from "react";
import { useForm, type UseFormRegisterReturn } from "react-hook-form";
import { Button } from "@/components/Button";
import { Modal } from "@/components/Modal";
import {
  newsletterSchema,
  type NewsletterFormValues,
} from "@/lib/schemas/newsletterSchema";
import type { NewsletterSection as NewsletterSectionType } from "@/types/sections";

function FormField({
  id,
  label,
  type = "text",
  placeholder,
  registration,
  error,
  errorKey,
}: {
  id: string;
  label: string;
  type?: string;
  placeholder?: string;
  registration: UseFormRegisterReturn;
  error?: string;
  errorKey?: number | string;
}) {
  return (
    <div>
      <label htmlFor={id} className="block text-sm mb-1">
        {label}
      </label>
      <input
        id={id}
        type={type}
        placeholder={placeholder}
        {...registration}
        className="block w-full border bg-white rounded px-3 py-3 text-md focus:outline-none focus:ring-2 focus:ring-black/10"
      />
      {error && <FormError key={errorKey} message={error} />}
    </div>
  );
}

function FormError({ message }: { message: string }) {
  return (
    <p
      role="alert"
      className="text-sm gap-1 text-red inline-flex rounded py-0.5 px-1.5 bg-white/70 mt-2 animate-shake"
    >
      <CircleAlert size={16} className="mt-0.5" />
      {message}
    </p>
  );
}

function readPrefill(): { email: string; firstName: string } {
  try {
    const raw = sessionStorage.getItem("newsletter-prefill");
    if (raw) {
      const parsed = JSON.parse(raw) as { email?: string; firstName?: string };
      return { email: parsed.email ?? "", firstName: parsed.firstName ?? "" };
    }
  } catch {}
  return { email: "", firstName: "" };
}

export function NewsletterSection({
  section,
}: {
  section: NewsletterSectionType;
}) {
  const { heading, description } = section;

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    setError,
    formState: { errors, isSubmitting, isSubmitSuccessful, submitCount },
  } = useForm<NewsletterFormValues>({
    resolver: zodResolver(newsletterSchema),
    defaultValues: {
      email: "",
      firstName: "",
      lastName: "",
      phone: "",
      consent: false,
    },
    mode: "onBlur",
  });

  useEffect(() => {
    const { email, firstName } = readPrefill();
    if (email) setValue("email", email);
    if (firstName) setValue("firstName", firstName);
  }, [setValue]);

  useEffect(() => {
    function handlePrefill(e: Event) {
      const { email, firstName } = (
        e as CustomEvent<{ email: string; firstName: string }>
      ).detail;
      if (email) setValue("email", email);
      if (firstName) setValue("firstName", firstName);
    }
    window.addEventListener("newsletter-prefill", handlePrefill);
    return () =>
      window.removeEventListener("newsletter-prefill", handlePrefill);
  }, [setValue]);

  async function onSubmit(values: NewsletterFormValues) {
    const { parsePhoneNumberFromString } = await import("libphonenumber-js");
    const normalizedPhone = values.phone
      ? parsePhoneNumberFromString(values.phone, "SE")?.number
      : undefined;

    const res = await fetch("/api/newsletter", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: values.email,
        firstName: values.firstName,
        lastName: values.lastName || undefined,
        phone: normalizedPhone,
      }),
    });

    const data = (await res.json()) as { error?: string };

    if (!res.ok) {
      setError("root", {
        message: data.error ?? "Något gick fel. Försök igen.",
      });
      return;
    }

    sessionStorage.removeItem("newsletter-prefill");
  }

  return (
    <>
      <Modal
        isOpen={isSubmitSuccessful}
        onClose={() => reset()}
        title="Tack för din anmälan!"
      >
        <div className="prose prose-lg not-md:prose-base">
          <HeartHandshake
            size={48}
            className="mx-auto text-red/60 animate-pulse"
          />
          <p>
            Du kommer att få ett bekräftelsemail om du inte redan prenumererar.
            Välkommen!
          </p>
        </div>
      </Modal>

      <section className="mx-auto bg-purplelight/60">
        <div className="flex flex-col container lg:w-[calc(var(--max-width-container-form)+8rem)] mx-auto w-full">
          {heading && <h2 className="text-4xl max-w-2xl mb-4">{heading}</h2>}
          {description && (
            <div className="prose prose-lg not-md:prose-base">
              <p>{description}</p>
            </div>
          )}

          <form
            onSubmit={handleSubmit(onSubmit)}
            noValidate
            className="mt-8 flex flex-col gap-6"
          >
            <FormField
              id="email"
              label="E-postadress *"
              type="email"
              placeholder="din@email.se"
              registration={register("email")}
              error={errors.email?.message}
              errorKey={submitCount}
            />
            <FormField
              id="firstName"
              label="Förnamn *"
              placeholder="Förnamn"
              registration={register("firstName")}
              error={errors.firstName?.message}
              errorKey={submitCount}
            />
            <FormField
              id="lastName"
              label="Efternamn (valfritt)"
              placeholder="Efternamn"
              registration={register("lastName")}
            />
            <FormField
              id="phone"
              label="Telefon (valfritt)"
              type="tel"
              placeholder="+46 70 000 00 00"
              registration={register("phone")}
              error={errors.phone?.message}
              errorKey={submitCount}
            />

            {/* Samtycke */}
            <div>
              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  id="consent"
                  type="checkbox"
                  {...register("consent")}
                  className="mt-1 h-4 w-4 shrink-0 cursor-pointer accent-black"
                />
                <span className="text-sm leading-relaxed">
                  Ja, jag samtycker till att ta emot nyhetsbrev från
                  Skyddsrummet. Du kan när som helst avanmäla dig via länken i
                  varje utskick.
                </span>
              </label>
              {errors.consent && (
                <FormError
                  key={submitCount}
                  message={errors.consent.message!}
                />
              )}
            </div>

            {errors.root && (
              <FormError key={submitCount} message={errors.root.message!} />
            )}

            <Button
              type="submit"
              disabled={isSubmitting}
              icon={
                isSubmitting ? (
                  <LoaderCircle className="animate-spin" />
                ) : (
                  <Megaphone />
                )
              }
              className=""
            >
              {isSubmitting ? "Skickar…" : "Anmäl dig"}
            </Button>

            <p className="text-xs text-center">
              Läs vår{" "}
              <Link href="/integritetspolicy" className="underline">
                integritetspolicy
              </Link>{" "}
              för information om hur vi hanterar dina uppgifter.
            </p>
          </form>
        </div>
      </section>
    </>
  );
}
