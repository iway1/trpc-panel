import { nodePropertiesFromRef } from "@src/parse/utils";
import { AnyZodObject, ZodFirstPartyTypeKind } from "zod";
import { DiscriminatedUnionNode, ParseFunction } from "../../../parseNodeTypes";
import { zodSelectorFunction } from "../selector";

type OptionsMap = Map<string, AnyZodObject>;

type ZodDiscriminatedUnionThreePointTwenty = {
  optionsMap: OptionsMap;
  discriminator: string;
  description?: string,
};

type ZodDiscriminatedUnionPreThreePointTwenty = {
  options: OptionsMap;
  discriminator: string;
  description?: string,
};

export type ZodDiscriminatedUnionDefUnversioned =
  | ZodDiscriminatedUnionPreThreePointTwenty
  | ZodDiscriminatedUnionThreePointTwenty;

function isZodThreePointTwenty(
  def: ZodDiscriminatedUnionDefUnversioned
): def is ZodDiscriminatedUnionThreePointTwenty {
  return "optionsMap" in def;
}

function makeDefConsistent(def: ZodDiscriminatedUnionDefUnversioned): {
  typeName: ZodFirstPartyTypeKind.ZodDiscriminatedUnion;
  discriminator: string;
  options: Map<string, AnyZodObject>;
} {
  const optionsMap = isZodThreePointTwenty(def) ? def.optionsMap : def.options;
  return {
    typeName: ZodFirstPartyTypeKind.ZodDiscriminatedUnion,
    discriminator: def.discriminator,
    options: optionsMap,
  };
}

export const parseZodDiscriminatedUnionDef: ParseFunction<
  ZodDiscriminatedUnionDefUnversioned,
  DiscriminatedUnionNode
> = (def, refs) => {
  const defConsistent = makeDefConsistent(def);
  const entries = Array.from(defConsistent.options.entries());
  const nodeEntries = entries.map(([discriminatorValue, zodObj]) => [
    discriminatorValue,
    zodSelectorFunction(zodObj._def, refs),
  ]);

  const nodesMap = Object.fromEntries(nodeEntries);
  refs.addDataFunctions.addDescriptionIfExists(def, refs);
  return {
    type: "discriminated-union",
    discriminatedUnionValues: entries.map(([n]) => n),
    discriminatedUnionChildrenMap: nodesMap,
    discriminatorName: def.discriminator,
    ...nodePropertiesFromRef(refs),
  };
};
