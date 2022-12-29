import React from "react";
import { SendIcon } from "@src/react-app/components/icons/SendIcon";
import { Button } from "@src/react-app/components/Button";
import { LoadingSpinner } from "./LoadingSpinner";
import { ColorSchemeType } from "@src/react-app/components/CollapsableSection";

export function ProcedureFormButton({
  text,
  colorScheme: colorScheme,
  loading,
}: {
  text: string;
  colorScheme: ColorSchemeType;
  loading: boolean;
}) {
  return (
    <Button
      variant={colorScheme}
      type="submit"
      className="relative rounded-md self-stretch justify-center"
      disabled={loading}
    >
      <div
        className={
          "flex flex-row" + (loading ? " opacity-0 pointer-events-none" : "")
        }
      >
        {text}
        <SendIcon className="w-5 h-5 ml-2" />
      </div>
      {loading && <LoadingSpinner />}
    </Button>
  );
}
