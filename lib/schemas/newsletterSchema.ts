import { parsePhoneNumberFromString } from "libphonenumber-js";
import { z } from "zod";

export const newsletterSchema = z.object({
  email: z
    .email({ message: "Ange en giltig e-postadress." })
    .min(1, { message: "Fyll i din e-postadress." }),
  firstName: z.string().min(1, { message: "Fyll i ditt förnamn." }),
  lastName: z.string().optional(),
  phone: z
    .string()
    .optional()
    .refine(
      (val) => {
        if (!val) return true;
        return !!parsePhoneNumberFromString(val, "SE")?.isValid();
      },
      { message: "Ogiltigt telefonnummer." }
    ),
});

export type NewsletterFormValues = z.infer<typeof newsletterSchema>;
