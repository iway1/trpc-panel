import React, { ReactNode, useState } from "react";
import { RouterContainer } from "./components/RouterContainer";
import type { ParsedRouter } from "../parse/parseRouter";
import { RenderOptions } from "@src/render";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { createTRPCReact, httpBatchLink } from "@trpc/react-query";
import {
  HeadersContext,
  useHeaders,
} from "@src/react-app/components/contexts/HeadersContext";
import { HeadersPopup } from "@src/react-app/components/HeadersPopup";
import { Toaster } from "react-hot-toast";
import { CollapsableContextProvider } from "@src/react-app/components/CollapsableContext";
import { SideNav } from "./SideNav";
import { TopBar } from "./TopBar";
import superjson from "superjson";

export function RootComponent({
  rootRouter,
  options,
  trpc,
}: {
  rootRouter: ParsedRouter;
  options: RenderOptions;
  trpc: ReturnType<typeof createTRPCReact>;
}) {
  const headers = useHeaders();
  return (
    <CollapsableContextProvider>
      <HeadersContext.Provider value={headers}>
        <ClientProviders trpc={trpc} options={options}>
          <div className="flex flex-col w-full h-full flex-1 relative">
            <AppInnards rootRouter={rootRouter} />
          </div>
        </ClientProviders>
      </HeadersContext.Provider>
    </CollapsableContextProvider>
  );
}

function ClientProviders({
  trpc,
  children,
  options,
}: {
  trpc: ReturnType<typeof createTRPCReact>;
  children: ReactNode;
  options: RenderOptions;
}) {
  const headers = useHeaders();
  const [trpcClient] = useState(() =>
    trpc.createClient({
      links: [
        httpBatchLink({
          url: options.url,
          headers: headers.getHeaders,
        }),
      ],
      transformer: (() => {
        if (options.transformer === "superjson") return superjson;
        return undefined;
      })(),
    })
  );
  const [queryClient] = useState(() => new QueryClient());

  return (
    <trpc.Provider queryClient={queryClient} client={trpcClient}>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </trpc.Provider>
  );
}

function AppInnards({ rootRouter }: { rootRouter: ParsedRouter }) {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  return (
    <div className="flex flex-col flex-1 relative">
      <TopBar />
      <div className="flex flex-row flex-1 bg-mainBackground">
        <SideNav
          rootRouter={rootRouter}
          open={sidebarOpen}
          setOpen={setSidebarOpen}
        />
        <div
          className="flex flex-col flex-1 items-center overflow-scroll"
          style={{
            maxHeight: "calc(100vh - 4rem)",
          }}
        >
          <div className="container max-w-6xl p-4 pt-8">
            <RouterContainer router={rootRouter} />
          </div>
        </div>
      </div>
      <HeadersPopup />
      <Toaster />
    </div>
  );
}
