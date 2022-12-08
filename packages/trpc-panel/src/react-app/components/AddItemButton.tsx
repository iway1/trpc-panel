import AddIcon from "@mui/icons-material/Add";
import React from "react";
export function AddItemButton({
    className,
    onClick,
}: {
    className?: string;
    onClick: () => void;
}) {
    return (
        <button
            className={
                "flex flex-row items-center justify-center border border-neutralSolidTransparent bg-whiteTransparent hover:bg-whiteLessTransparent h-10 rounded-[4px] " +
                (className ? className : "")
            }
            type="button"
            onClick={onClick}
        >
            Add <AddIcon />
        </button>
    );
}
