import { Router } from "@trpc/server";
import fs from "fs";
import { fileURLToPath } from "node:url";
import { dirname } from "node:path";
import {
  parseRouterWithOptions,
  TrpcPanelExtraOptions,
} from "./parse/parseRouter";

export type RenderOptions = {
  url: string;
  cache?: boolean;
} & TrpcPanelExtraOptions;

const defaultParseRouterOptions: Partial<TrpcPanelExtraOptions> = {
  logFailedProcedureParse: true,
  transformer: "superjson",
};

const __dirname = dirname(fileURLToPath(import.meta.url));
const javascriptReplaceSymbol = "{{js}}";
const cssReplaceSymbol = "{{css}}";
const routerReplaceSymbol = '"{{parsed_router}}"';
const optionsReplaceSymbol = '"{{options}}"';
const bundlePath = __dirname + "/react-app/bundle.js";
const indexPath = __dirname + "/react-app/index.html";
const cssPath = __dirname + "/react-app/index.css";
const bundleJs = fs.readFileSync(bundlePath).toString();
const indexHtml = fs.readFileSync(indexPath).toString();
const indexCss = fs.readFileSync(cssPath).toString();

type InjectionParam = {
  searchFor: string;
  injectString: string;
};

function injectParams(string: string, injectionParams: InjectionParam[]) {
  var r = string;
  for (var param of injectionParams) {
    r = injectInString(param.searchFor, r, param.injectString);
  }
  return r;
}

function injectInString(
  searchFor: string,
  string: string,
  injectString: string
) {
  const startIndex = string.indexOf(searchFor);
  return (
    string.slice(0, startIndex) +
    injectString +
    string.slice(startIndex + searchFor.length)
  );
}

// renders value should never change unless the server is restarted, just parse and inject once
let cache: {
  val: string | null;
} = {
  val: null,
};

export function renderTrpcPanel(router: Router<any>, options: RenderOptions) {
  if (options.cache === true && cache.val) return cache.val;

  const bundleInjectionParams: InjectionParam[] = [
    {
      searchFor: routerReplaceSymbol,
      injectString: JSON.stringify(
        parseRouterWithOptions(router, {
          ...defaultParseRouterOptions,
          ...options,
        })
      ),
    },
    {
      searchFor: optionsReplaceSymbol,
      injectString: JSON.stringify(options),
    },
  ];
  const bundleInjected = injectParams(bundleJs, bundleInjectionParams);
  const script = `<script>${bundleInjected}</script>`;
  const css = `<style>${indexCss}</style>`;
  const htmlReplaceParams: InjectionParam[] = [
    {
      searchFor: javascriptReplaceSymbol,
      injectString: script,
    },
    {
      searchFor: cssReplaceSymbol,
      injectString: css,
    },
  ];
  cache.val = injectParams(indexHtml, htmlReplaceParams);
  return cache.val;
}
