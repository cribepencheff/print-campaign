import { parsePhoneNumberFromString } from "libphonenumber-js";
import { type NextRequest, NextResponse } from "next/server";
import { subscribeNewsletter } from "@/lib/brevo";
import { newsletterSchema } from "@/lib/schemas/newsletterSchema";

export async function POST(req: NextRequest) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Ogiltig förfrågan." }, { status: 400 });
  }

  const result = newsletterSchema.safeParse(body);
  if (!result.success) {
    const message = result.error.issues[0]?.message ?? "Ogiltig förfrågan.";
    return NextResponse.json({ error: message }, { status: 400 });
  }

  const { email, firstName, lastName, phone } = result.data;

  const normalizedPhone = phone
    ? parsePhoneNumberFromString(phone, "SE")?.number
    : undefined;

  try {
    await subscribeNewsletter(email, firstName, {
      lastName: lastName || undefined,
      phone: normalizedPhone,
    });
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Brevo subscribeNewsletter misslyckades:", err);
    return NextResponse.json(
      { error: "Något gick fel. Försök igen." },
      { status: 500 }
    );
  }
}
