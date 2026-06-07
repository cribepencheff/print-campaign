"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRef, useState } from "react";
import { useForm } from "react-hook-form";
import {
  uploadSchema,
  type UploadFormValues,
} from "@/lib/schemas/uploadSchema";
import {
  UPLOAD_ALLOWED_TYPES,
  UPLOAD_ALLOWED_TYPES_TEXT,
  UPLOAD_MAX_SIZE_MB,
  UPLOAD_MAX_SIZE_BYTES,
} from "@/lib/upload";
import type { FileUploadSection as FileUploadSectionType } from "@/types/sections";

export function FileUploadSection({
  section,
  hasNewsletter = false,
}: {
  section: FileUploadSectionType;
  hasNewsletter?: boolean;
}) {
  const { heading, description } = section;
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [uploadStatus, setUploadStatus] = useState<
    "uploading" | "success" | null
  >(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [fileError, setFileError] = useState<string | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [previewName, setPreviewName] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<UploadFormValues>({
    resolver: zodResolver(uploadSchema),
    defaultValues: { email: "", firstName: "" },
  });

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) {
      setPreview(null);
      setPreviewName(null);
      return;
    }

    if (!UPLOAD_ALLOWED_TYPES.includes(file.type)) {
      setFileError(`Endast ${UPLOAD_ALLOWED_TYPES_TEXT} är tillåtet.`);
      e.target.value = "";
      setPreview(null);
      setPreviewName(null);
      return;
    }
    if (file.size > UPLOAD_MAX_SIZE_BYTES) {
      setFileError(`Filen får max vara ${UPLOAD_MAX_SIZE_MB} MB.`);
      e.target.value = "";
      setPreview(null);
      setPreviewName(null);
      return;
    }

    setFileError(null);
    setPreviewName(file.name);
    setPreview(URL.createObjectURL(file));
    setSelectedFile(file);
  }

  function clearFile() {
    if (fileInputRef.current) fileInputRef.current.value = "";
    setSelectedFile(null);
    setPreview(null);
    setPreviewName(null);
    setFileError(null);
  }

  function resetForNewUpload() {
    clearFile();
    setUploadStatus(null);
    setSubmitError(null);
    reset();
  }

  async function onSubmit(values: UploadFormValues) {
    setSubmitError(null);

    const file = selectedFile;
    if (!file) {
      setFileError("Välj en fil innan du skickar.");
      return;
    }

    setUploadStatus("uploading");

    const formData = new FormData();
    formData.append("file", file);
    if (values.email) formData.append("email", values.email);
    if (values.firstName) formData.append("firstName", values.firstName);

    try {
      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });
      const data = (await res.json()) as { error?: string };

      if (!res.ok) {
        setSubmitError(data.error ?? "Något gick fel. Försök igen.");
        setUploadStatus(null);
        return;
      }

      if (values.email) {
        const prefill = {
          email: values.email,
          firstName: values.firstName ?? "",
        };
        sessionStorage.setItem("newsletter-prefill", JSON.stringify(prefill));
        window.dispatchEvent(
          new CustomEvent("newsletter-prefill", { detail: prefill })
        );
      }
      setUploadStatus("success");
    } catch {
      setSubmitError(
        "Nätverksfel — kontrollera din uppkoppling och försök igen."
      );
      setUploadStatus(null);
    }
  }

  if (uploadStatus === "success") {
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

          {hasNewsletter && (
            <a
              href="#newsletter"
              className="underline text-sm text-gray-600 hover:text-black transition-colors"
            >
              Vill du hålla dig uppdaterad? Anmäl dig till nyhetsbrevet.
            </a>
          )}
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 px-8">
      <form
        onSubmit={handleSubmit(onSubmit)}
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
          {fileError && (
            <p role="alert" className="text-sm text-red-600 mt-1">
              {fileError}
            </p>
          )}
          {previewName && (
            <div className="mt-3 relative inline-block">
              {preview && (
                // eslint-disable-next-line @next/next/no-img-element -- blob URL from file preview, next/image doesn't support it
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

        {/* E-postadress */}
        <div>
          <label htmlFor="email" className="block text-sm font-medium mb-1">
            E-postadress{" "}
            <span className="text-gray-400 font-normal">(valfritt)</span>
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
            Förnamn{" "}
            <span className="text-gray-400 font-normal">(valfritt)</span>
          </label>
          <input
            id="firstName"
            type="text"
            placeholder="Förnamn"
            {...register("firstName")}
            className="block w-full border rounded px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-black"
          />
        </div>

        <p className="text-xs text-gray-400">
          Uppladdning sker anonymt. Kontaktuppgifter lagras inte i vårt
          bildarkiv — de används enbart för att kunna nå dig om ditt bidrag
          väljs ut.
        </p>

        {submitError && (
          <p role="alert" className="text-sm text-red-600">
            {submitError}
          </p>
        )}

        <button
          type="submit"
          disabled={uploadStatus === "uploading"}
          className="w-full bg-black text-white py-3 rounded font-medium hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {uploadStatus === "uploading" ? "Laddar upp…" : "Skicka in"}
        </button>
      </form>
    </section>
  );
}
