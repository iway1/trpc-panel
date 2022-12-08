import React, { ReactNode } from "react";

export function InputGroupContainer({
    title,
    iconElement,
    children,
}: {
    title: string;
    iconElement?: ReactNode;
    children: ReactNode;
}) {
    return (
        <div
            className={
                "flex flex-col border border-neutralSolid bg-[#fcfbf977] rounded-md overflow-hidden shadow-sm"
            }
        >
            <span className="flex flex-row bg-white mb-1 p-1">
                {iconElement} {title}
            </span>

            <div className={"space-y-2 flex-col flex p-1 "}>{children}</div>
        </div>
    );
}
