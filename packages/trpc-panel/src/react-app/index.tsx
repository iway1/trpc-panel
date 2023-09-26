import type { ParsedRouter } from "../parse/parseRouter";
import React from "react";
import ReactDOM from "react-dom/client";
import { RootComponent } from "./Root";
import "./index.css";
import 'jsoneditor/dist/jsoneditor.css';
import { RenderOptions } from "@src/render";
import { trpc } from "@src/react-app/trpc";

// this gets replaced with the parsed router object
const routerDefinition: ParsedRouter =
  "{{parsed_router}}" as unknown as ParsedRouter;

// Here are other options
export const options = "{{options}}" as unknown as RenderOptions;
const root = ReactDOM.createRoot(document.getElementById("root")!);
root;
trpc;
RootComponent;
React;
root.render(
  <RootComponent rootRouter={routerDefinition} options={options} trpc={trpc} />
);
