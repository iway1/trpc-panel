import { ZodFirstPartyTypeKind, ZodTypeDef } from "zod";

export type ZodDefWithType = ZodTypeDef & { typeName: ZodFirstPartyTypeKind };
