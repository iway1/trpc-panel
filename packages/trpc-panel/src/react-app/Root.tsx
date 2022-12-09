import React, { useState } from "react";
import { RouterContainer } from "./components/RouterContainer";
import type { ParsedRouter } from "../parse/parse-router";
import { RenderOptions } from "src/render";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { httpBatchLink } from "@trpc/react-query";
import { trpc } from "src/react-app/trpc";
import {
    HeadersContext,
    useHeaders,
} from "src/react-app/components/HeadersContext";
import { HeadersPopup } from "src/react-app/components/HeadersPopup";
import { Toaster } from "react-hot-toast";
import { CollapsableContextProvider } from "src/react-app/components/CollapsableContext";
import { SideNav } from "./SideNav";
import { TopBar } from "./TopBar";

export function RootComponent({
    rootRouter,
    options,
}: {
    rootRouter: ParsedRouter;
    options: RenderOptions;
}) {
    const [queryClient] = useState(() => new QueryClient());
    const headers = useHeaders();
    const [trpcClient] = useState(() =>
        trpc.createClient({
            links: [
                httpBatchLink({
                    url: options.url,
                    headers: headers.getHeaders,
                }),
            ],
        })
    );
    return (
        <CollapsableContextProvider>
            <HeadersContext.Provider value={headers}>
                <trpc.Provider queryClient={queryClient} client={trpcClient}>
                    <QueryClientProvider client={queryClient}>
                        <div className="flex flex-col w-full h-full flex-1 relative">
                            <AppInnards rootRouter={rootRouter} />
                        </div>
                    </QueryClientProvider>
                </trpc.Provider>
            </HeadersContext.Provider>
        </CollapsableContextProvider>
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
