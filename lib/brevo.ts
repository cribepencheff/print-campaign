import { BrevoClient } from "@getbrevo/brevo";

function getClient(): BrevoClient {
  const apiKey = process.env.BREVO_API_KEY;
  if (!apiKey)
    throw new Error("BREVO_API_KEY missing in environment variables");
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
