"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import {
  newsletterSchema,
  type NewsletterFormValues,
} from "@/lib/schemas/newsletterSchema";
import type { NewsletterSection as NewsletterSectionType } from "@/types/sections";

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
    formState: { errors, isSubmitting, isSubmitSuccessful },
  } = useForm<NewsletterFormValues>({
    resolver: zodResolver(newsletterSchema),
    defaultValues: { email: "", firstName: "", lastName: "", phone: "" },
  });

  // Prefill från sessionStorage vid mount
  useEffect(() => {
    const { email, firstName } = readPrefill();
    if (email) setValue("email", email);
    if (firstName) setValue("firstName", firstName);
  }, [setValue]);

  // Prefill via custom event (om formuläret redan är monterat)
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
      throw new Error(data.error ?? "Något gick fel. Försök igen.");
    }

    sessionStorage.removeItem("newsletter-prefill");
  }

  if (isSubmitSuccessful) {
    return (
      <section className="py-16 px-8 text-center">
        <p className="text-xl font-semibold">Tack!</p>
        <p className="text-gray-600 mt-2">
          Du kommer att få ett bekräftelsemail om du inte redan prenumererar.
          <br />
          Välkommen!
        </p>
        <button
          onClick={() => reset()}
          className="mt-6 text-sm text-gray-600 underline"
        >
          Stäng detta meddelande
        </button>
      </section>
    );
  }

  return (
    <section id={section._type} className="py-16 px-8">
      <form
        onSubmit={handleSubmit(onSubmit)}
        noValidate
        className="max-w-lg mx-auto space-y-6"
      >
        {heading && <h2 className="text-2xl font-bold">{heading}</h2>}
        {description && <p className="text-gray-600">{description}</p>}

        {/* E-postadress */}
        <div>
          <label htmlFor="email" className="block text-sm font-medium mb-1">
            E-postadress <span className="text-red-500">*</span>
          </label>
          <input
            id="email"
            type="email"
            placeholder="din@email.se"
            {...register("email")}
            className="block w-full border rounded px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-black"
          />
          {errors.email && (
            <p role="alert" className="text-sm text-red-600 mt-1">
              {errors.email.message}
            </p>
          )}
        </div>

        {/* Förnamn */}
        <div>
          <label htmlFor="firstName" className="block text-sm font-medium mb-1">
            Förnamn <span className="text-red-500">*</span>
          </label>
          <input
            id="firstName"
            type="text"
            placeholder="Förnamn"
            {...register("firstName")}
            className="block w-full border rounded px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-black"
          />
          {errors.firstName && (
            <p role="alert" className="text-sm text-red-600 mt-1">
              {errors.firstName.message}
            </p>
          )}
        </div>

        {/* Efternamn */}
        <div>
          <label htmlFor="lastName" className="block text-sm font-medium mb-1">
            Efternamn{" "}
            <span className="text-gray-400 font-normal">(valfritt)</span>
          </label>
          <input
            id="lastName"
            type="text"
            placeholder="Efternamn"
            {...register("lastName")}
            className="block w-full border rounded px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-black"
          />
        </div>

        {/* Telefon */}
        <div>
          <label htmlFor="phone" className="block text-sm font-medium mb-1">
            Telefon{" "}
            <span className="text-gray-400 font-normal">(valfritt)</span>
          </label>
          <input
            id="phone"
            type="tel"
            placeholder="+46 70 000 00 00"
            {...register("phone")}
            className="block w-full border rounded px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-black"
          />
          {errors.phone && (
            <p role="alert" className="text-sm text-red-600 mt-1">
              {errors.phone.message}
            </p>
          )}
        </div>

        {errors.root && (
          <p role="alert" className="text-sm text-red-600">
            {errors.root.message}
          </p>
        )}

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-black text-white py-3 rounded font-medium hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? "Skickar…" : "Prenumerera"}
        </button>
      </form>
    </section>
  );
}
