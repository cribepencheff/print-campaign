import { createHash } from "crypto";
import { createClient } from "@sanity/client";
import { type NextRequest, NextResponse } from "next/server";
import { saveUploadContact } from "@/lib/brevo";
import { uploadSchema } from "@/lib/schemas/uploadSchema";
import {
  UPLOAD_ALLOWED_TYPES,
  UPLOAD_ALLOWED_TYPES_TEXT,
  UPLOAD_MAX_SIZE_BYTES,
  UPLOAD_MAX_SIZE_MB,
} from "@/lib/upload";
import { apiVersion, dataset, projectId } from "@/sanity/env";

export async function POST(req: NextRequest) {
  if (!process.env.SANITY_API_WRITE_TOKEN) {
    console.error("SANITY_API_WRITE_TOKEN missing");
    return NextResponse.json(
      { error: "Tjänsten är inte konfigurerad korrekt." },
      { status: 500 }
    );
  }

  let formData: FormData;
  try {
    formData = await req.formData();
  } catch {
    return NextResponse.json({ error: "Ogiltig förfrågan." }, { status: 400 });
  }

  const file = formData.get("file");

  if (!(file instanceof File)) {
    return NextResponse.json({ error: "Ingen fil hittades." }, { status: 400 });
  }

  if (!UPLOAD_ALLOWED_TYPES.includes(file.type)) {
    return NextResponse.json(
      { error: `${UPLOAD_ALLOWED_TYPES_TEXT} är tillåtna.` },
      { status: 400 }
    );
  }

  if (file.size === 0) {
    return NextResponse.json(
      { error: "Filen får inte vara tom." },
      { status: 400 }
    );
  }

  if (file.size > UPLOAD_MAX_SIZE_BYTES) {
    return NextResponse.json(
      { error: `Filen får max vara ${UPLOAD_MAX_SIZE_MB} MB.` },
      { status: 400 }
    );
  }

  // Validate optional contact info for Brevo contact creation, never stored in Sanity
  const contactResult = uploadSchema.safeParse({
    email: formData.get("email") ?? "",
    firstName: formData.get("firstName") ?? "",
  });
  if (!contactResult.success) {
    const message =
      contactResult.error.issues[0]?.message ?? "Ogiltig förfrågan.";
    return NextResponse.json({ error: message }, { status: 400 });
  }

  const { email, firstName } = contactResult.data;
  const emailValue = email || null;

  const contributorId = emailValue
    ? createHash("sha256")
        .update(emailValue.toLowerCase())
        .digest("hex")
        .slice(0, 12)
    : undefined;

  const buffer = Buffer.from(await file.arrayBuffer());

  const writeClient = createClient({
    projectId,
    dataset,
    apiVersion,
    token: process.env.SANITY_API_WRITE_TOKEN,
    useCdn: false,
  });

  let uploadedAsset: { _id: string };
  try {
    uploadedAsset = await writeClient.assets.upload("image", buffer, {
      filename: file.name,
      contentType: file.type,
    });
  } catch (err) {
    console.error("Sanity asset upload misslyckades:", err);
    return NextResponse.json(
      { error: "Uppladdningen misslyckades. Försök igen." },
      { status: 500 }
    );
  }

  // Anonymous contribution, contributorId is the only identifier connected to the upload.
  try {
    await writeClient.create({
      _type: "motiv",
      asset: {
        _type: "image",
        asset: { _type: "reference", _ref: uploadedAsset._id },
      },
      status: "pending",
      uploadedAt: new Date().toISOString(),
      isPublished: false,
      contributorId: contributorId ?? "Har ej angett kontaktuppgifter",
    });
  } catch (err) {
    console.error("Sanity dokument-skapande misslyckades:", err);
    return NextResponse.json(
      { error: "Uppladdningen misslyckades. Försök igen." },
      { status: 500 }
    );
  }

  // Brevo contact - await:ed to surface errors in response (debug mode)
  let brevoWarning: string | undefined;
  if (emailValue) {
    try {
      await saveUploadContact(emailValue, contributorId!, {
        firstName: firstName || undefined,
      });
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      console.error("Brevo saveUploadContact misslyckades:", message);
      brevoWarning = message;
    }
  }

  return NextResponse.json({
    success: true,
    ...(brevoWarning && { brevoWarning }),
  });
}
