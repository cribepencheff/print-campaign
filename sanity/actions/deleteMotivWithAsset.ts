import { useState } from "react";
import type { DocumentActionComponent, DocumentActionProps } from "sanity";
import { useClient } from "sanity";

export const deleteMotivWithAsset: DocumentActionComponent = (
  props: DocumentActionProps,
) => {
  const { id, published, draft } = props;
  const client = useClient({ apiVersion: "2026-05-25" });
  const actionsClient = client.withConfig({
    apiVersion: "2026-05-25",
  });
  const [confirmOpen, setConfirmOpen] = useState(false);

  return {
    label: "Radera",
    tone: "critical",
    onHandle: () => setConfirmOpen(true),
    dialog: confirmOpen && {
      type: "confirm",
      onCancel: () => setConfirmOpen(false),
      onConfirm: async () => {
        setConfirmOpen(false);

        const doc = draft ?? published;
        const assetId = (
          doc?.asset as { asset?: { _ref?: string } } | undefined
        )?.asset?._ref;

        const baseId = id.startsWith("drafts.")
          ? id.slice("drafts.".length)
          : id;

        const versionIds: string[] = await client.fetch(
          `*[_id in path("drafts." + $baseId) || _id in path("versions.*." + $baseId)]._id`,
          { baseId },
        );

        await actionsClient.action({
          actionType: "sanity.action.document.delete",
          publishedId: baseId,
          includeDrafts: versionIds,
        });

        if (assetId) {
          const referencingDocs = await client.fetch(
            `count(*[references($assetId)])`,
            { assetId },
          );
          if (referencingDocs === 0) {
            await client.delete(assetId).catch(() => {});
          }
        }
      },
      message:
        "Detta raderar motivet och bilden permanent. Det går INTE att ångra - inte ens via Sanity support. Kontrollera att du valt rätt motiv innan du bekräftar.",
    },
  };
};
