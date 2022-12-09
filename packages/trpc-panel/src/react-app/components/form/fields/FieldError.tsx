import React from "react";

export function FieldError({ errorMessage }: { errorMessage: string }) {
    return <span className="text-error text-sm">{errorMessage}</span>;
}
