import React, { ReactNode, useEffect, useRef } from "react";
import { Chevron } from "@src/react-app/components/Chevron";
import { useCollapsableContext } from "@src/react-app/components/CollapsableContext";
import {
  backgroundColor,
  solidColorBg,
  solidColorBorder,
} from "@src/react-app/components/style-utils";

export type ColorSchemeType = "query" | "mutation" | "router" | "neutral";

export function CollapsableSection({
  titleElement,
  fullPath,
  children,
  sectionType,
  isRoot,
}: {
  titleElement: ReactNode;
  fullPath: string[];
  children: ReactNode;
  sectionType: ColorSchemeType;
  isRoot?: boolean;
}) {
  const { has, togglePath, scrollToPathIfMatches } = useCollapsableContext();
  const shown = has(fullPath);
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (shown && containerRef.current) {
      scrollToPathIfMatches(fullPath, containerRef.current);
    }
  }, [shown]);

  // deals with root router. If it's not collapsable we **simply** render the title element and children
  const collapsable = fullPath.length > 0;
  return (
    <div
      ref={containerRef}
      className={
        "flex flex-col drop-shadow-sm " +
        (collapsable
          ? `${solidColorBorder(sectionType)} ${backgroundColor(sectionType)}`
          : "") +
        (!isRoot ? ` border rounded-[0.25rem]` : "")
      }
    >
      {collapsable ? (
        <button
          onClick={() => togglePath(fullPath)}
          className="flex flex-row justify-between items-center p-1 "
        >
          <span className="flex flex-row">
            <SectionTypeLabel className="mr-2" sectionType={sectionType} />
            {titleElement}
          </span>

          <Chevron
            className={"w-4 h-4 mr-2 "}
            direction={shown ? "up" : "down"}
          />
        </button>
      ) : (
        titleElement
      )}

      <div
        className={
          "flex-col justify-between " +
          (collapsable ? ` border-t ${solidColorBorder(sectionType)}` : "") +
          (shown || !collapsable ? " flex" : " hidden")
        }
      >
        {children}
      </div>
    </div>
  );
}

export function SectionTypeLabel({
  sectionType,
  className,
}: {
  sectionType: ColorSchemeType;
  className?: string;
}) {
  return (
    <span
      className={
        "p-1 font-bold rounded-md text-base flex flex-row justify-center w-28 text-light " +
        solidColorBg(sectionType) +
        (className ? ` ${className}` : "")
      }
    >
      {sectionType.toUpperCase()}
    </span>
  );
}
