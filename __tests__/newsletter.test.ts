import { type NextRequest } from "next/server";
import { POST } from "@/app/api/newsletter/route";
import { subscribeNewsletter } from "@/lib/brevo";

// Mock Brevo
jest.mock("@/lib/brevo", () => ({
  subscribeNewsletter: jest.fn(),
}));

// Helpers
function makeRequest(body: unknown): NextRequest {
  return {
    json: () => Promise.resolve(body),
  } as unknown as NextRequest;
}

beforeEach(() => {
  jest.clearAllMocks();
  (subscribeNewsletter as jest.Mock).mockResolvedValue(undefined);

  // Hide expected console errors in test output
  jest.spyOn(console, "error").mockImplementation(() => {});
});

// Form validation
describe("Form validation", () => {
  it("returns 400 if email is missing", async () => {
    const res = await POST(makeRequest({ firstName: "Anna" }));
    expect(res.status).toBe(400);
  });

  it("returns 400 if email is invalid", async () => {
    const res = await POST(
      makeRequest({ email: "not-an-email", firstName: "Anna" })
    );
    expect(res.status).toBe(400);
  });

  it("returns 400 if firstName is missing", async () => {
    const res = await POST(makeRequest({ email: "anna@example.com" }));
    expect(res.status).toBe(400);
  });

  it("returns 400 if firstName is empty string", async () => {
    const res = await POST(
      makeRequest({ email: "anna@example.com", firstName: "" })
    );
    expect(res.status).toBe(400);
  });

  it("returns 400 if phone number is invalid", async () => {
    const res = await POST(
      makeRequest({
        email: "anna@example.com",
        firstName: "Anna",
        phone: "12345",
      })
    );
    expect(res.status).toBe(400);
  });

  it("returns 400 if request body is not valid JSON", async () => {
    const req = {
      json: () => Promise.reject(new Error("invalid json")),
    } as unknown as NextRequest;
    const res = await POST(req);
    expect(res.status).toBe(400);
  });
});

// Successful subscription
describe("Successful subscription", () => {
  it("returns 200 for valid email and firstName", async () => {
    const res = await POST(
      makeRequest({ email: "anna@example.com", firstName: "Anna" })
    );
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.success).toBe(true);
  });

  it("calls subscribeNewsletter with correct email and firstName", async () => {
    await POST(makeRequest({ email: "anna@example.com", firstName: "Anna" }));
    expect(subscribeNewsletter).toHaveBeenCalledWith(
      "anna@example.com",
      "Anna",
      expect.any(Object)
    );
  });

  it("sends lastName to Brevo when provided", async () => {
    await POST(
      makeRequest({
        email: "anna@example.com",
        firstName: "Anna",
        lastName: "Svensson",
      })
    );
    expect(subscribeNewsletter).toHaveBeenCalledWith(
      "anna@example.com",
      "Anna",
      expect.objectContaining({ lastName: "Svensson" })
    );
  });

  it("does not send lastName to Brevo when omitted", async () => {
    await POST(makeRequest({ email: "anna@example.com", firstName: "Anna" }));
    expect(subscribeNewsletter).toHaveBeenCalledWith(
      "anna@example.com",
      "Anna",
      expect.objectContaining({ lastName: undefined })
    );
  });

  it("normalizes a valid Swedish phone number and sends it to Brevo", async () => {
    await POST(
      makeRequest({
        email: "anna@example.com",
        firstName: "Anna",
        phone: "0701234567",
      })
    );
    expect(subscribeNewsletter).toHaveBeenCalledWith(
      "anna@example.com",
      "Anna",
      expect.objectContaining({ phone: "+46701234567" })
    );
  });

  it("does not send phone to Brevo when omitted", async () => {
    await POST(makeRequest({ email: "anna@example.com", firstName: "Anna" }));
    expect(subscribeNewsletter).toHaveBeenCalledWith(
      "anna@example.com",
      "Anna",
      expect.objectContaining({ phone: undefined })
    );
  });
});

// Brevo errors
describe("Brevo errors", () => {
  it("returns 500 if subscribeNewsletter throws", async () => {
    (subscribeNewsletter as jest.Mock).mockRejectedValueOnce(
      new Error("Brevo down")
    );
    const res = await POST(
      makeRequest({ email: "anna@example.com", firstName: "Anna" })
    );
    expect(res.status).toBe(500);
  });

  it("returns 500 if BREVO_PENDING_LIST_ID is missing", async () => {
    (subscribeNewsletter as jest.Mock).mockRejectedValueOnce(
      new Error("BREVO_PENDING_LIST_ID missing in environment variables")
    );
    const res = await POST(
      makeRequest({ email: "anna@example.com", firstName: "Anna" })
    );
    expect(res.status).toBe(500);
  });
});
