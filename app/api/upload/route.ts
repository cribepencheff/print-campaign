import { createClient } from "@sanity/client";
import { type NextRequest, NextResponse } from "next/server";
import { UPLOAD_ALLOWED_TYPES, UPLOAD_MAX_SIZE_BYTES } from "@/lib/upload";
import { apiVersion, dataset, projectId } from "@/sanity/env";

export async function POST(req: NextRequest) {
  if (!process.env.SANITY_API_WRITE_TOKEN) {
    console.error("SANITY_API_WRITE_TOKEN saknas");
    return NextResponse.json(
      { error: "Tjänsten är inte konfigurerad." },
      { status: 500 },
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
      { error: "Endast PNG och JPG är tillåtna." },
      { status: 400 },
    );
  }

  if (file.size > UPLOAD_MAX_SIZE_BYTES) {
    return NextResponse.json(
      { error: "Filen får max vara 5 MB." },
      { status: 400 },
    );
  }

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
      { status: 500 },
    );
  }

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
    });
  } catch (err) {
    console.error("Sanity dokument-skapande misslyckades:", err);
    return NextResponse.json(
      { error: "Uppladdningen misslyckades. Försök igen." },
      { status: 500 },
    );
  }

  return NextResponse.json({ success: true });
}
