import { ParsedRouter } from "@src/parse/parseRouter";
import { ParsedProcedure } from "@src/parse/parseProcedure";
import { ColorSchemeType } from "@src/react-app/components/CollapsableSection";

export function solidColorBg(type: ColorSchemeType) {
  switch (type) {
    case "mutation":
      return "bg-mutationSolid";
    case "query":
      return "bg-querySolid";
    case "router":
      return "bg-routerSolid";
    case "neutral":
      return "bg-neutralSolid";
    case "subscription":
      return "bg-subscriptionSolid";
  }
}

export function solidColorBorder(type: ColorSchemeType) {
  switch (type) {
    case "mutation":
      return "border-mutationSolid";
    case "query":
      return "border-querySolid";
    case "router":
      return "border-routerSolid";
    case "neutral":
      return "border-neutralSolid";
    case "subscription":
      return "border-subscriptionSolid";
  }
}

export function backgroundColor(type: ColorSchemeType) {
  switch (type) {
    case "mutation":
      return "bg-mutationBg dark:bg-neutralBg";
    case "neutral":
      return "bg-neutralBg dark:bg-neutralBg";
    case "query":
      return "bg-queryBg dark:bg-neutralBg";
    case "router":
      return "bg-routerBg dark:bg-neutralBg";
    case "subscription":
      return "bg-subscriptionBg dark:bg-neutralBg";
  }
}

export function textColor(type: ColorSchemeType) {
  switch (type) {
    case "mutation":
      return "text-mutationText";
    case "neutral":
      return "text-neutralText";
    case "query":
      return "text-queryText";
    case "router":
      return "text-routerText";
    case "subscription":
      return "text-subscriptionText";
  }
}

export function colorSchemeForNode(
  node: ParsedRouter | ParsedProcedure
): ColorSchemeType {
  if (node.nodeType === "router") return "router";
  return node.procedureType;
}
