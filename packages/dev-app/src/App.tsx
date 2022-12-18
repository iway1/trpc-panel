import "./App.css";
import { testRouter } from "../../test-app/src/router"
import { parseRouterWithOptions } from "../../trpc-panel/src/parse/parseRouter";
import { RootComponent } from "../../trpc-panel/src/react-app/Root";
import { createTRPCReact } from "@trpc/react-query";

const parse = parseRouterWithOptions(testRouter, { transformer: "superjson" });
const trpc = createTRPCReact<any>();
function App() {
  return (
    <RootComponent
      rootRouter={parse}
      options={{ url: "http://localhost:4000/trpc", transformer: "superjson" }}
      trpc={trpc}
    />
  );
}

export default App;
