import { type NextRequest } from "next/server";
import { POST } from "@/app/api/upload/route";
import { saveUploadContact } from "@/lib/brevo";
import { UPLOAD_MAX_SIZE_BYTES } from "@/lib/upload";

// Mock Sanity client
const mockUpload = jest.fn();
const mockCreate = jest.fn();
jest.mock("@sanity/client", () => ({
  createClient: jest.fn(() => ({
    assets: { upload: mockUpload },
    create: mockCreate,
  })),
}));

// Mock Brevo
jest.mock("@/lib/brevo", () => ({
  saveUploadContact: jest.fn(),
}));

// Helpers
function makeFormData(fields: Record<string, string | File>): FormData {
  const formData = new FormData();
  for (const [key, value] of Object.entries(fields)) {
    formData.append(key, value);
  }
  return formData;
}

function makeFile(name: string, type: string, sizeBytes: number = 1024): File {
  const content = new Uint8Array(sizeBytes);
  return new File([content], name, { type });
}

function makeRequest(formData: FormData): NextRequest {
  return {
    formData: () => Promise.resolve(formData),
  } as unknown as NextRequest;
}

beforeEach(() => {
  jest.clearAllMocks();
  process.env.SANITY_API_WRITE_TOKEN = "test-token";
  mockUpload.mockResolvedValue({ _id: "asset-123" });
  mockCreate.mockResolvedValue({ _id: "doc-123" });

  // Hide expected console errors in test output
  jest.spyOn(console, "error").mockImplementation(() => {});
});

// Environment
describe("Environment", () => {
  it("returns 500 if SANITY_API_WRITE_TOKEN is missing", async () => {
    delete process.env.SANITY_API_WRITE_TOKEN;
    const formData = makeFormData({
      file: makeFile("poster.png", "image/png"),
    });
    const res = await POST(makeRequest(formData));
    expect(res.status).toBe(500);
  });
});

// File validation
describe("File validation", () => {
  it("returns 400 if no file is provided", async () => {
    const formData = makeFormData({});
    const res = await POST(makeRequest(formData));
    expect(res.status).toBe(400);
  });

  it("returns 400 for unsupported file type (gif)", async () => {
    const formData = makeFormData({
      file: makeFile("poster.gif", "image/gif"),
    });
    const res = await POST(makeRequest(formData));
    expect(res.status).toBe(400);
  });

  it("returns 400 for file without extension and unknown MIME type", async () => {
    const formData = makeFormData({
      file: makeFile("poster", "application/octet-stream"),
    });
    const res = await POST(makeRequest(formData));
    expect(res.status).toBe(400);
  });

  it("returns 400 for correct extension but wrong MIME type", async () => {
    const formData = makeFormData({
      file: makeFile("poster.png", "image/gif"),
    });
    const res = await POST(makeRequest(formData));
    expect(res.status).toBe(400);
  });

  it("returns 400 for empty file (0 bytes)", async () => {
    const formData = makeFormData({
      file: makeFile("poster.png", "image/png", 0),
    });
    const res = await POST(makeRequest(formData));
    expect(res.status).toBe(400);
  });

  it("returns 400 for file exceeding max size", async () => {
    const formData = makeFormData({
      file: makeFile("poster.png", "image/png", UPLOAD_MAX_SIZE_BYTES + 1),
    });
    const res = await POST(makeRequest(formData));
    expect(res.status).toBe(400);
  });
});

// Successful file upload
describe("Successful file upload", () => {
  it("returns 200 for valid PNG without contact details", async () => {
    const formData = makeFormData({
      file: makeFile("poster.png", "image/png"),
    });
    const res = await POST(makeRequest(formData));
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.success).toBe(true);
  });

  it("returns 200 for valid JPG", async () => {
    const formData = makeFormData({
      file: makeFile("poster.jpg", "image/jpeg"),
    });
    const res = await POST(makeRequest(formData));
    expect(res.status).toBe(200);
  });

  it("creates Sanity document with status pending and contributorId 'Har ej angett kontaktuppgifter' for anonymous upload", async () => {
    const formData = makeFormData({
      file: makeFile("poster.png", "image/png"),
    });
    await POST(makeRequest(formData));
    expect(mockCreate).toHaveBeenCalledWith(
      expect.objectContaining({
        status: "pending",
        isPublished: false,
        contributorId: "Har ej angett kontaktuppgifter",
      })
    );
  });

  it("creates Sanity document with hash-based contributorId when email is provided", async () => {
    const formData = makeFormData({
      file: makeFile("poster.png", "image/png"),
      email: "test@example.com",
    });
    await POST(makeRequest(formData));
    expect(mockCreate).toHaveBeenCalledWith(
      expect.objectContaining({
        contributorId: expect.stringMatching(/^[a-f0-9]{12}$/),
      })
    );
  });
});

// Brevo
describe("Brevo saveUploadContact", () => {
  it("does not call Brevo for anonymous upload", async () => {
    const formData = makeFormData({
      file: makeFile("poster.png", "image/png"),
    });
    await POST(makeRequest(formData));
    expect(saveUploadContact).not.toHaveBeenCalled();
  });

  it("calls Brevo with correct email and contributorId when email is provided", async () => {
    const formData = makeFormData({
      file: makeFile("poster.png", "image/png"),
      email: "test@example.com",
    });
    await POST(makeRequest(formData));
    expect(saveUploadContact).toHaveBeenCalledWith(
      "test@example.com",
      expect.stringMatching(/^[a-f0-9]{12}$/),
      expect.any(Object)
    );
  });

  it("sends firstName to Brevo when provided", async () => {
    const formData = makeFormData({
      file: makeFile("poster.png", "image/png"),
      email: "test@example.com",
      firstName: "Anna",
    });
    await POST(makeRequest(formData));
    expect(saveUploadContact).toHaveBeenCalledWith(
      "test@example.com",
      expect.any(String),
      expect.objectContaining({ firstName: "Anna" })
    );
  });

  it("returns 200 with brevoWarning if Brevo call fails", async () => {
    (saveUploadContact as jest.Mock).mockRejectedValueOnce(
      new Error("Brevo down")
    );
    const formData = makeFormData({
      file: makeFile("poster.png", "image/png"),
      email: "test@example.com",
    });
    const res = await POST(makeRequest(formData));
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.brevoWarning).toBeDefined();
  });
});

// Sanity errors
describe("Sanity errors", () => {
  it("returns 500 if Sanity asset upload fails", async () => {
    mockUpload.mockRejectedValueOnce(new Error("Sanity down"));
    const formData = makeFormData({
      file: makeFile("poster.png", "image/png"),
    });
    const res = await POST(makeRequest(formData));
    expect(res.status).toBe(500);
  });

  it("returns 500 if Sanity document creation fails", async () => {
    mockCreate.mockRejectedValueOnce(new Error("Sanity down"));
    const formData = makeFormData({
      file: makeFile("poster.png", "image/png"),
    });
    const res = await POST(makeRequest(formData));
    expect(res.status).toBe(500);
  });
});
