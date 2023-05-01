import React from "react";
import { Response } from "./Response";
import json from "json-bigint";

export function RequestResult({
  result,
  size,
  time,
}: {
  result: any;
  size?: number;
  time?: number;
}) {
  return (
    <Response size={size} time={time}>
      {result}
    </Response>
  );
}
