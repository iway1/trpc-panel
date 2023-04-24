import React, { useCallback } from "react";
import type { ParsedRouter } from "../../parse/parseRouter";
import type { ParsedProcedure } from "@src/parse/parseProcedure";
import {
  collapsables,
  useCollapsableIsShowing,
  useSiteNavigationContext,
} from "@src/react-app/components/contexts/SiteNavigationContext";
import { Chevron } from "@src/react-app/components/Chevron";
import { colorSchemeForNode } from "@src/react-app/components/style-utils";
import { ItemTypeIcon } from "@src/react-app/components/ItemTypeIcon";
export function SideNav({
  rootRouter,
  open,
}: // setOpen,
{
  open: boolean;
  rootRouter: ParsedRouter;
  setOpen: (value: boolean) => void;
}) {
  return open ? (
    <div
      style={{ maxHeight: "calc(100vh - 4rem)" }}
      className="min-w-[16rem] overflow-scroll shadow-sm flex-col flex items-start p-2 pr-4 space-y-2 bg-actuallyWhite border-r-2 border-r-panelBorder"
    >
      <SideNavItem node={rootRouter} path={[]} />
    </div>
  ) : null;
}

function SideNavItem({
  node,
  path,
}: {
  node: ParsedRouter | ParsedProcedure;
  path: string[];
}) {
  const { markForScrollTo } = useSiteNavigationContext();
  const shown = useCollapsableIsShowing(path) || path.length === 0;

  const onClick = useCallback(function onClick() {
    collapsables.toggle(path);
    markForScrollTo(path);
  }, []);

  return (
    <>
      {path.length > 0 && (
        <button
          className={`font-bold flex flex-row items-center justify-between w-full ${
            shown ? "" : "opacity-70"
          }`}
          onClick={onClick}
        >
          <span className="flex flex-row items-start">
            <ItemTypeIcon colorScheme={colorSchemeForNode(node)} />
            {path[path.length - 1]}
          </span>

          {node.nodeType === "router" ? (
            <Chevron
              className={"ml-2 w-3 h-3 " + ``}
              direction={shown ? "down" : "right"}
            />
          ) : (
            <div />
          )}
        </button>
      )}
      {shown && node.nodeType === "router" && (
        <div className="pl-2 flex flex-col items-start space-y-2 self-stretch">
          {Object.entries(node.children).map(([key, node]) => {
            return (
              <SideNavItem
                path={
                  node.nodeType === "procedure"
                    ? node.pathFromRootRouter
                    : node.path
                }
                node={node}
                key={key}
              />
            );
          })}
        </div>
      )}
    </>
  );
}
