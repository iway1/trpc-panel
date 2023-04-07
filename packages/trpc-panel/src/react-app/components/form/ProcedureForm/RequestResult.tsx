import React from "react";
import { Response } from "./Response";
import json from "json-bigint";

export function RequestResult({ result }: { result: any }) {
  return <Response>{`${json.stringify(result, null, 2)}`}</Response>;
}
