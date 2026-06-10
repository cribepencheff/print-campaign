"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { CircleAlert, ImageUp, LoaderCircle, X } from "lucide-react";
import { useRef, useState } from "react";
import { useForm, type UseFormRegisterReturn } from "react-hook-form";
import { Button } from "@/components/Button";
import { Modal } from "@/components/Modal";
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
        className="block w-full bg-white rounded px-3 py-3 text-md focus:outline-none focus:ring-2 focus:ring-white/50"
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

export function FileUploadSection({
  section,
  hasNewsletter = false,
}: {
  section: FileUploadSectionType;
  hasNewsletter?: boolean;
}) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [uploadStatus, setUploadStatus] = useState<
    "uploading" | "success" | null
  >(null);

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [fileError, setFileError] = useState<string | null>(null);
  const [fileErrorKey, setFileErrorKey] = useState(0);

  function triggerFileError(msg: string) {
    setFileError(msg);
    setFileErrorKey((k) => k + 1);
  }
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitErrorKey, setSubmitErrorKey] = useState(0);

  function triggerSubmitError(msg: string) {
    setSubmitError(msg);
    setSubmitErrorKey((k) => k + 1);
  }
  const [preview, setPreview] = useState<string | null>(null);
  const [previewName, setPreviewName] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, submitCount },
    reset,
  } = useForm<UploadFormValues>({
    resolver: zodResolver(uploadSchema),
    defaultValues: { email: "", firstName: "" },
    mode: "onBlur",
  });

  function validateAndSetFile(file: File) {
    if (!UPLOAD_ALLOWED_TYPES.includes(file.type)) {
      triggerFileError(`Endast ${UPLOAD_ALLOWED_TYPES_TEXT} är tillåtet.`);
      return;
    }
    if (file.size > UPLOAD_MAX_SIZE_BYTES) {
      triggerFileError(`Filen får max vara ${UPLOAD_MAX_SIZE_MB} MB.`);
      return;
    }
    setFileError(null);
    setPreviewName(file.name);
    setPreview(URL.createObjectURL(file));
    setSelectedFile(file);
  }

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    validateAndSetFile(file);
    e.target.value = "";
  }

  function handleDragOver(e: React.DragEvent) {
    e.preventDefault();
    setIsDragging(true);
  }

  function handleDragLeave(e: React.DragEvent) {
    e.preventDefault();
    setIsDragging(false);
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) validateAndSetFile(file);
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
      triggerFileError("Välj en fil innan du skickar.");
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
        triggerSubmitError(data.error ?? "Något gick fel. Försök igen.");
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
      triggerSubmitError(
        "Nätverksfel — kontrollera din uppkoppling och försök igen."
      );
      setUploadStatus(null);
    }
  }

  return (
    <section className="bg-red/80">
      <div className="flex flex-col w-full container mx-auto">
        {section.heading && (
          <h2 className="text-4xl max-w-2xl mb-4">{section.heading}</h2>
        )}
        {section.description && (
          <div className="prose prose-lg not-md:prose-base">
            <p>{section.description}</p>
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} noValidate className="mt-8">
          <input
            ref={fileInputRef}
            id="file"
            type="file"
            name="file"
            accept={UPLOAD_ALLOWED_TYPES.join(",")}
            onChange={handleFileChange}
            className="sr-only"
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12 items-start">
            {/* Drop zone */}
            <div>
              <div
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className={`flex flex-col items-center justify-center min-h-74 rounded-xl border-2 border-dashed cursor-pointer transition-colors ${
                  isDragging
                    ? "border-white bg-white/70"
                    : "border-white/30 hover:border-white/60 bg-white/40 hover:bg-white/50"
                }
                `}
              >
                {previewName ? (
                  <div className="relative p-2 bg-white rounded-md">
                    {preview && (
                      // eslint-disable-next-line @next/next/no-img-element -- blob URL from file preview
                      <img
                        src={preview}
                        alt="Förhandsgranskning"
                        className="max-h-56 rounded object-contain"
                      />
                    )}
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        clearFile();
                      }}
                      aria-label="Rensa vald fil"
                      className="absolute -top-sp-sm -right-sp-sm p-sp-xs rounded-full bg-white text-black text-xs flex items-center justify-center hover:bg-yellow leading-none cursor-pointer"
                    >
                      <X size={20} />
                    </button>
                  </div>
                ) : (
                  <div className="flex flex-col items-center gap-3 p-8 text-center select-none">
                    <ImageUp size={40} />

                    <p>Välj en fil eller dra och släpp den här.</p>

                    <Button
                      variant="outline"
                      className="bg-white pointer-events-none"
                    >
                      Välj bild
                    </Button>
                    <p className="text-xs opacity-70">
                      {UPLOAD_ALLOWED_TYPES_TEXT}, upp till {UPLOAD_MAX_SIZE_MB}{" "}
                      MB
                    </p>
                  </div>
                )}
              </div>
              {fileError && (
                <FormError key={fileErrorKey} message={fileError} />
              )}
            </div>

            {/* Optional input fields */}
            <div className="flex flex-col gap-6 md:max-w-container-form justify-self-center">
              <FormField
                id="email"
                label="E-postadress (valfritt)"
                type="email"
                placeholder="din@email.se"
                registration={register("email")}
                error={errors.email?.message}
                errorKey={submitCount}
              />
              <FormField
                id="firstName"
                label="Förnamn (valfritt)"
                placeholder="Förnamn"
                registration={register("firstName")}
              />
              <p className="text-xs">
                Uppladdning sker anonymt. Kontaktuppgifter lagras inte i vårt
                bildarkiv och används enbart för att kunna nå dig om ditt bidrag
                väljs ut.
              </p>
              {submitError && (
                <FormError key={submitErrorKey} message={submitError} />
              )}
              <Button
                icon={
                  uploadStatus === "uploading" ? (
                    <LoaderCircle className="animate-spin" />
                  ) : undefined
                }
                type="submit"
                disabled={uploadStatus === "uploading"}
              >
                {uploadStatus === "uploading" ? "Laddar upp…" : "Skicka in"}
              </Button>
            </div>
          </div>
        </form>
      </div>

      <Modal
        isOpen={uploadStatus === "success"}
        onClose={resetForNewUpload}
        title="Tack för ditt bidrag!"
      >
        <div className="prose prose-lg not-md:prose-base">
          <p>Din bild är mottagen och granskas.</p>

          <p className="">
            Vill du hålla dig uppdaterad? <br />
            {hasNewsletter && (
              <a
                href="#newsletter"
                className="text-purple"
                onClick={resetForNewUpload}
              >
                Anmäl dig så hör vi av oss.
              </a>
            )}
          </p>
        </div>
      </Modal>
    </section>
  );
}
