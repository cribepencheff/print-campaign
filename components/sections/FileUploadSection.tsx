"use client";

import { useRef, useState } from "react";
import type { FileUploadSection as FileUploadSectionType } from "@/types/sections";
import {
  UPLOAD_ALLOWED_TYPES,
  UPLOAD_ALLOWED_TYPES_TEXT,
  UPLOAD_MAX_SIZE_MB,
  UPLOAD_MAX_SIZE_BYTES,
} from "@/lib/upload";

export function FileUploadSection({
  section,
}: {
  section: FileUploadSectionType;
}) {
  const { heading, description } = section;
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [status, setStatus] = useState<"uploading" | "success" | null>(null);
  const [error, setError] = useState<string | null>(null);

  const [preview, setPreview] = useState<string | null>(null);
  const [previewName, setPreviewName] = useState<string | null>(null);
  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) {
      setPreview(null);
      setPreviewName(null);
      return;
    }

    if (!UPLOAD_ALLOWED_TYPES.includes(file.type)) {
      setError(`Endast ${UPLOAD_ALLOWED_TYPES_TEXT} är tillåtet.`);
      e.target.value = "";
      setPreview(null);
      setPreviewName(null);
      return;
    }
    if (file.size > UPLOAD_MAX_SIZE_BYTES) {
      setError(`Filen får max vara ${UPLOAD_MAX_SIZE_MB} MB.`);
      e.target.value = "";
      setPreview(null);
      setPreviewName(null);
      return;
    }

    setError(null);
    setPreviewName(file.name);
    setPreview(URL.createObjectURL(file));
  }

  function clearFile() {
    if (fileInputRef.current) fileInputRef.current.value = "";
    setPreview(null);
    setPreviewName(null);
    setError(null);
  }

  function resetForNewUpload() {
    clearFile();
    setStatus(null);
    setError(null);
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);

    const form = e.currentTarget;
    const file = (form.elements.namedItem("file") as HTMLInputElement)
      .files?.[0];
    if (!file) {
      setError("Välj en fil innan du skickar.");
      return;
    }

    setStatus("uploading");

    const formData = new FormData(form);

    try {
      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });
      const data = (await res.json()) as { error?: string };

      if (!res.ok) {
        setError(data.error ?? "Något gick fel. Försök igen.");
        setStatus(null);
        return;
      }

      setStatus("success");
    } catch {
      setError("Nätverksfel — kontrollera din uppkoppling och försök igen.");
      setStatus(null);
    }
  }

  if (status === "success") {
    return (
      <section className="py-16 px-8 text-center">
        <p className="text-xl font-semibold">Tack för ditt bidrag!</p>
        <p className="text-gray-600 mt-2">Din bild är mottagen och granskas.</p>
        <div className="mt-6 flex flex-col items-center gap-3">
          <button
            type="button"
            onClick={resetForNewUpload}
            className="underline text-sm text-gray-600 hover:text-black transition-colors"
          >
            Ladda upp ett till motiv
          </button>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 px-8">
      <form
        onSubmit={handleSubmit}
        noValidate
        className="max-w-lg mx-auto space-y-6"
      >
        {heading && <h2 className="text-2xl font-bold">{heading}</h2>}
        {description && <p className="text-gray-600">{description}</p>}

        {/* Fil */}
        <div>
          <label className="block text-sm font-medium mb-1">
            Bild{" "}
            <span className="text-gray-400 font-normal">
              ({UPLOAD_ALLOWED_TYPES_TEXT}, max {UPLOAD_MAX_SIZE_MB} MB)
            </span>
          </label>

          <input
            ref={fileInputRef}
            id="file"
            type="file"
            name="file"
            accept={UPLOAD_ALLOWED_TYPES.join(",")}
            onChange={handleFileChange}
            className="block w-full text-sm file:mr-4 file:py-2 file:px-4 file:border-0 file:rounded file:text-sm file:font-medium file:bg-black file:text-white cursor-pointer"
          />
          {previewName && (
            <div className="mt-3 relative inline-block">
              {preview && (
                <img
                  src={preview}
                  alt="Förhandsgranskning"
                  className="max-h-48 rounded object-contain"
                />
              )}
              <button
                type="button"
                onClick={clearFile}
                aria-label="Rensa vald fil"
                className="absolute -top-2 -right-2 w-5 h-5 rounded-full bg-gray-800 text-white text-xs flex items-center justify-center hover:bg-black leading-none"
              >
                x
              </button>
            </div>
          )}
        </div>

        {error && (
          <p role="alert" className="text-sm text-red-600">
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={status === "uploading" || !previewName}
          className="w-full bg-black text-white py-3 rounded font-medium hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {status === "uploading" ? "Laddar upp…" : "Skicka in"}
        </button>
      </form>
    </section>
  );
}
