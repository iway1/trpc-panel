import React, { MutableRefObject, ReactNode, useEffect, useRef } from "react";
import { Chevron } from "@src/react-app/components/Chevron";
import {
  collapsables,
  useCollapsableIsShowing,
  useSiteNavigationContext,
} from "@src/react-app/components/contexts/SiteNavigationContext";
import {
  backgroundColor,
  solidColorBg,
  solidColorBorder,
} from "@src/react-app/components/style-utils";

export type ColorSchemeType =
  | "query"
  | "mutation"
  | "router"
  | "neutral"
  | "subscription";
export function CollapsableSection({
  titleElement,
  fullPath,
  children,
  sectionType,
  isRoot,
  focusOnScrollRef,
}: {
  titleElement: ReactNode;
  fullPath: string[];
  children: ReactNode;
  sectionType: ColorSchemeType;
  isRoot?: boolean;
  focusOnScrollRef?: MutableRefObject<HTMLFormElement | null>;
}) {
  const { scrollToPathIfMatches } = useSiteNavigationContext();
  const shown = useCollapsableIsShowing(fullPath);

  const containerRef = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    if (shown && containerRef.current) {
      if (scrollToPathIfMatches(fullPath, containerRef.current)) {
        // timeout or it'll immediately submit the form (which shows error messages)
        const firstChild =
          focusOnScrollRef &&
          focusOnScrollRef.current &&
          findFirstFormChildInput(focusOnScrollRef.current);
        if (firstChild) {
          setTimeout(() => {
            firstChild.focus({ preventScroll: true });
          }, 0);
        }
      }
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
          onClick={() => collapsables.toggle(fullPath)}
          className="flex flex-row justify-between items-center p-1 "
        >
          <span className="flex flex-row">
            <SectionTypeLabel className="mr-2" sectionType={sectionType} />
            {titleElement}
          </span>

          <Chevron
            className={"w-4 h-4 mr-2 animate-transform transition-transform"}
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
        "p-1 font-bold rounded-md text-base flex flex-row justify-center w-32 text-light " +
        solidColorBg(sectionType) +
        (className ? ` ${className}` : "")
      }
    >
      {sectionType.toUpperCase()}
    </span>
  );
}

function findFirstFormChildInput(formElement: HTMLFormElement) {
  for (let i = 0; i < formElement.elements.length; i++) {
    const child = formElement.elements[i];
    if (child?.tagName === "input" || child?.tagName === "INPUT") {
      return child as HTMLInputElement;
    }
  }
  return;
}
