import React from "react";
import { Response } from "./Response";

export function RequestResult({ result }: { result: any }) {
    return <Response>{`${JSON.stringify(result, null, 2)}`}</Response>;
}
