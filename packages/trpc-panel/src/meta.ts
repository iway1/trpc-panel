import { z } from "zod";

export const TRPCPanelMetaSchema = z.object({
  description: z.string().optional(),
});

export type TRPCPanelMeta = z.infer<typeof TRPCPanelMetaSchema>;
