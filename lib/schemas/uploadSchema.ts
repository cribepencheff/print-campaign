import { z } from "zod";

export const uploadSchema = z.object({
  email: z.union([
    z.literal(""),
    z.email({ message: "Ange en giltig e-postadress" }),
  ]),
  firstName: z.string().optional(),
});

export type UploadFormValues = z.infer<typeof uploadSchema>;
