import { BrevoClient, BrevoError } from "@getbrevo/brevo";

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
    emailBlacklisted: false,
  });
}

export type NewsletterStatus = "new" | "pending" | "confirmed";

// Checks whether an email is unknown to Brevo, sitting in Pending (awaiting double opt-in
// confirmation), or already a confirmed Nyhetsbrev subscriber. Used so the signup flow can
// skip re-adding an already-confirmed contact to Pending, and so the UI can show accurate
// copy instead of a generic message that doesn't fit every case.
export async function getNewsletterStatus(email: string): Promise<NewsletterStatus> {
  const pendingListId = process.env.BREVO_PENDING_LIST_ID;
  const newsletterListId = process.env.BREVO_NEWSLETTER_LIST_ID;
  if (!pendingListId) throw new Error("BREVO_PENDING_LIST_ID missing in environment variables");
  if (!newsletterListId) throw new Error("BREVO_NEWSLETTER_LIST_ID missing in environment variables");

  const client = getClient();

  try {
    const contact = await client.contacts.getContactInfo({ identifier: email });
    const listIds = contact.listIds ?? [];
    if (listIds.includes(Number(newsletterListId))) return "confirmed";
    if (listIds.includes(Number(pendingListId))) return "pending";
    return "new";
  } catch (err) {
    // Brevo returns 404 when the contact doesn't exist yet - treat as a brand new signup.
    if (err instanceof BrevoError && err.statusCode === 404) return "new";
    throw err;
  }
}

// Subscribes an email-address to the newsletter list, creating the contact if it doesn't exist. Idempotent.
// If the contact is already a confirmed Nyhetsbrev subscriber, skips adding them to Pending again -
// no new confirmation is needed. Still clears emailBlacklisted so a previous campaign unsubscribe
// (or transactional block) never silently blocks them from future sends.
export async function subscribeNewsletter(
  email: string,
  firstName: string,
  optional: { lastName?: string; phone?: string } = {}
): Promise<NewsletterStatus> {
  const pendingListId = process.env.BREVO_PENDING_LIST_ID;
  if (!pendingListId) throw new Error("BREVO_PENDING_LIST_ID missing in environment variables");

  const status = await getNewsletterStatus(email);

  const client = getClient();

  const attributes: Record<string, string> = { FIRSTNAME: firstName };
  if (optional.lastName) attributes.LASTNAME = optional.lastName;
  if (optional.phone) attributes.SMS = optional.phone;

  await client.contacts.createContact({
    email,
    attributes,
    listIds: status === "confirmed" ? undefined : [Number(pendingListId)],
    updateEnabled: true,
    emailBlacklisted: false,
  });

  return status;
}
