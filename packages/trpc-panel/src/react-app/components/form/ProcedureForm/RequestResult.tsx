import React from "react";
import { Response } from "./Response";

export function RequestResult({ result }: { result: any }) {
  return <Response>{result}</Response>;
}
