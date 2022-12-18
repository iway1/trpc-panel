import type { ProcedureExtraData } from "@src/parse/parseProcedure";
import { FormSection } from "@src/react-app/components/form/ProcedureForm/FormSection";
import React from "react";

export function DescriptionSection({extraData}: {extraData: ProcedureExtraData}) {
  if(!extraData.description && !(Object.keys(extraData).length > 0)) return null;

  return (
    <FormSection
      title="Description"
    >
      {extraData.description && (
        <p className="text-sm text-gray-500">{extraData.description}</p>
      )}
      {Object.keys(extraData).length > 0 && (
        <>
        <h2></h2>
        <div className="flex flex-col space-y-2">
          {Object.entries(extraData.parameterDescriptions).map(([key, value]) => (
            <div key={key} className="flex flex-row space-x-2">
              <span className="text-sm text-gray-500">{key}</span>
              <span className="text-sm text-gray-500">{value}</span>
            </div>
          ))}
        </div>
        </>)
        
        }
    </FormSection>
  );
}
