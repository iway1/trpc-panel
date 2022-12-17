import React, { ReactNode } from "react";
import { FormSectionHeader } from "@src/react-app/components/form/ProcedureForm/FormSectionHeader";

export function FormSection({
  children,
  title,
  topRightElement,
  titleClassName,
}: {
  children: ReactNode;
  title: string;
  topRightElement?: ReactNode;
  titleClassName?: string;
}) {
  return (
    <div className="flex flex-col">
      <div className="flex flex-row justify-between bg-white shadow-sm px-4 py-2">
        <FormSectionHeader className={titleClassName}>
          {title}
        </FormSectionHeader>
        {topRightElement}
      </div>
      <div className="flex flex-col space-y-2 p-4"> {children}</div>
    </div>
  );
}
