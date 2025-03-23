import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import path from "path";
/** @type {import('tailwindcss').Config} */

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    open: true,
    host: "0.0.0.0", // 👈 This exposes it to your network
    port: 5173, // or whatever port you want
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  theme: {
    extend: {
      content: {
        "": '""', // this helps with after:content-['']
      },
    },
  },
});
