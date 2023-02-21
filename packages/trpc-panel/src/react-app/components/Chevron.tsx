import React from "react";
import { ChevronIcon } from "@src/react-app/components/icons/ChevronIcon";

export function Chevron({
  className,
  direction,
}: {
  className?: string;
  direction: "up" | "down" | "right";
}) {
  return (
    <>
      <span className="hidden dark:inline-block">
        <ChevronIcon
          fill="white"
          className={
            className +
            " " +
            `${(() => {
              switch (direction) {
                case "up":
                  return " -rotate-[270deg]";
                case "down":
                  return "-rotate-90";
                case "right":
                  return "rotate-180";
              }
            })()}`
          }
        />
      </span>
      <span className="inline-block dark:hidden">
        <ChevronIcon
          fill="black"
          className={
            className +
            " " +
            `${(() => {
              switch (direction) {
                case "up":
                  return " -rotate-[270deg]";
                case "down":
                  return "-rotate-90";
                case "right":
                  return "rotate-180";
              }
            })()}`
          }
        />
      </span>
    </>
  );
}
