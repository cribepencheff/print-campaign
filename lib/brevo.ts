import { BrevoClient } from "@getbrevo/brevo";

function getClient(): BrevoClient {
  const apiKey = process.env.BREVO_API_KEY;
  if (!apiKey) throw new Error("BREVO_API_KEY missing in environment variables");
  return new BrevoClient({ apiKey });
}

// Creates/updates a Brevo contact with CONTRIBUTOR_ID attribute and adds it to the contributors list, for future treatment.
export async function saveUploadContact(
  email: string,
  contributorId: string,
  optional: { firstName?: string } = {}
): Promise<void> {
  const contributorsListId = process.env.BREVO_CONTRIBUTORS_LIST_ID;

  const client = getClient();

  const attributes: Record<string, string> = { CONTRIBUTOR_ID: contributorId };
  if (optional.firstName) attributes.FIRSTNAME = optional.firstName;

  await client.contacts.createContact({
    email,
    attributes,
    listIds: contributorsListId ? [Number(contributorsListId)] : undefined,
    updateEnabled: true,
  });
}

// Subscribes an email-address to the newsletter list, creating the contact if it doesn't exist. Idempotent.
export async function subscribeNewsletter(
  email: string,
  firstName: string,
  optional: { lastName?: string; phone?: string } = {}
): Promise<void> {
  const pendingListId = process.env.BREVO_PENDING_LIST_ID;
  if (!pendingListId) throw new Error("BREVO_PENDING_LIST_ID missing in environment variables");

  const client = getClient();

  const attributes: Record<string, string> = { FIRSTNAME: firstName };
  if (optional.lastName) attributes.LASTNAME = optional.lastName;
  if (optional.phone) attributes.SMS = optional.phone;

  await client.contacts.createContact({
    email,
    attributes,
    listIds: [Number(pendingListId)],
    updateEnabled: true,
  });
}
