import { useState } from "react";
import type { DocumentActionComponent, DocumentActionProps } from "sanity";
import { useClient } from "sanity";
import {
  getAssetId,
  getBaseId,
  REFERENCING_DOCS_QUERY,
  shouldDeleteAsset,
  VERSION_IDS_QUERY,
} from "./deleteMotivWithAsset.logic";

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
        const assetId = getAssetId(
          doc as { asset?: { asset?: { _ref?: string } } } | undefined,
        );

        const baseId = getBaseId(id);

        const versionIds: string[] = await client.fetch(VERSION_IDS_QUERY, {
          baseId,
        });

        await actionsClient.action({
          actionType: "sanity.action.document.delete",
          publishedId: baseId,
          includeDrafts: versionIds,
        });

        if (assetId) {
          const referencingDocs = await client.fetch(
            REFERENCING_DOCS_QUERY,
            { assetId },
          );
          if (shouldDeleteAsset(referencingDocs)) {
            await client.delete(assetId).catch(() => {});
          }
        }
      },
      message:
        "Detta raderar motivet och bilden permanent. Det går INTE att ångra - inte ens via Sanity support. Kontrollera att du valt rätt motiv innan du bekräftar.",
    },
  };
};
