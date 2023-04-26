import React from "react";
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';

export function ChevronIcon({ className }: { className: string }) {
    return (
        <span className={`w-[26.002px] flex items-center justify-center ${className ?? ''}`}>
            <ChevronLeftIcon />
        </span>
    );
}
