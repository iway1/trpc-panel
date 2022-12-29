import React from "react";
import { CollapsableSection } from "@src/react-app/components/CollapsableSection";
import { ProcedureForm } from "@src/react-app/components/form/ProcedureForm";
import { ParsedRouter } from "../../parse/parseRouter";

export function RouterContainer({
  router,
  name,
}: {
  router: ParsedRouter;
  name?: string;
}) {
  const isRoot = router.path.length == 0;
  return (
    <CollapsableSection
      fullPath={router.path}
      titleElement={
        name && (
          <div>
            <h2 className="font-bold text-lg">{name}</h2>
          </div>
        )
      }
      sectionType="router"
      isRoot={isRoot}
    >
      <div
        className={
          "space-y-3" + (!isRoot ? `border-l-grey-400 space-y-1 p-1` : "")
        }
      >
        {Object.entries(router.children).map(
          ([childName, routerOrProcedure]) => {
            return (
              <div key={childName}>
                {routerOrProcedure.nodeType == "router" ? (
                  <RouterContainer
                    name={childName}
                    router={routerOrProcedure}
                  />
                ) : (
                  <ProcedureForm
                    name={childName}
                    procedure={routerOrProcedure}
                  />
                )}
              </div>
            );
          }
        )}
      </div>
    </CollapsableSection>
  );
}
