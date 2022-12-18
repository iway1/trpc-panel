import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: [
      {
        find: "@src",
        replacement: path.resolve(__dirname, "../trpc-panel/src"),
      },
      {
        find: "test-app",
        replacement: path.resolve(__dirname, "../test-app"),
      },
      {
        find: "trpc-panel",
        replacement: path.resolve(__dirname, "../trpc-panel"),
      },
      {
        find: 'react',
        replacement: path.resolve(__dirname, '../trpc-panel/node_modules/react'),
      },
      {
        find: 'react-dom',
        replacement: path.resolve(__dirname, '../trpc-panel/node_modules/react-dom'),
      },
      {
        find: '@tanstack/react-query',
        replacement: path.resolve(__dirname, '../trpc-panel/node_modules/@tanstack/react-query'),
      },
      {
        find: '@trpc/react-query',
        replacement: path.resolve(__dirname, '../trpc-panel/node_modules/@trpc/react-query'),
      },
    ],
  },
  define: {
    "process.env": {},
  },
  build: {
    outDir: path.resolve(__dirname, "dist"),
    rollupOptions: {
      external: ["@tanstack/react-query", "@trpc/react-query", "react", "react-dom"],
    },
  },
  server: {
    host: true,
  },
});
