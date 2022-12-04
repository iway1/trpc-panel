import React from "react";

export function FormSectionHeader({
    children,
    className,
}: {
    children: string;
    className?: string;
}) {
    return (
        <h2
            className={"font-bold text-lg" + (className ? ` ${className}` : "")}
        >
            {children}
        </h2>
    );
}
