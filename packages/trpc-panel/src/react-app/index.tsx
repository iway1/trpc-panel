import type { ParsedRouter } from "../parse/parse-router";
import React from "react";
import ReactDOM from "react-dom/client";
import { RootComponent } from "./Root";
import "./index.css";
import { RenderOptions } from "src/render";

// this gets replaced with the parsed router object
const routerDefinition: ParsedRouter =
    "{{parsed_router}}" as unknown as ParsedRouter;

// Here are other options
const options = "{{options}}" as unknown as RenderOptions;

console.log("TRPC Panel injected params: ");
console.log("Router definition");
console.log(routerDefinition);
console.log("Render options");
console.log(options);
const root = ReactDOM.createRoot(document.getElementById("root")!);
root.render(<RootComponent rootRouter={routerDefinition} options={options} />);
