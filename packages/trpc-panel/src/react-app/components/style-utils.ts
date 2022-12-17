import { ParsedProcedure, ParsedRouter } from "@src/parse/parse-router";
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
  }
}

export function backgroundColor(type: ColorSchemeType) {
  switch (type) {
    case "mutation":
      return "bg-mutationBg";
    case "neutral":
      return "bg-neutralBg";
    case "query":
      return "bg-queryBg";
    case "router":
      return "bg-routerBg";
  }
}

export function backgroundColorDark(type: ColorSchemeType) {
  switch (type) {
    case "mutation":
      return "bg-mutationBgDark";
    case "neutral":
      return "bg-neutralBgDark";
    case "query":
      return "bg-queryBgDark";
    case "router":
      return "bg-routerBgDark";
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
  }
}

export function colorSchemeForNode(
  node: ParsedRouter | ParsedProcedure
): ColorSchemeType {
  if (node.nodeType === "router") return "router";
  return node.procedureType;
}
