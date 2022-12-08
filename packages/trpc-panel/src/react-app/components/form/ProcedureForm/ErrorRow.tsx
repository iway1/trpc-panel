import React from "react";

export function ErrorRow({
    title,
    text,
    padTitleTo,
}: {
    title: string;
    text: string;
    padTitleTo: number;
}) {
    return (
        <span>
            <b>{title.padEnd(padTitleTo, " ")}: </b>
            {text}
        </span>
    );
}
