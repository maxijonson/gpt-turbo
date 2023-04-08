import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import eslint from "vite-plugin-eslint";
import { VitePWA } from "vite-plugin-pwa";

export default defineConfig({
    plugins: [
        react(),
        eslint({
            include: ["src"],
        }),
        VitePWA({
            registerType: "autoUpdate",
            manifest: {
                name: "GPT Turbo",
                short_name: "GPT Turbo",
                description: "Web app for GPT Turbo",
                start_url: "/",
                scope: "/",
                display: "standalone",
                background_color: "#141517",
                theme_color: "#141517",
                orientation: "portrait-primary",
                icons: [
                    {
                        src: "assets/images/favicon/android-chrome-192x192.png",
                        sizes: "192x192",
                        type: "image/png",
                    },
                    {
                        src: "assets/images/favicon/android-chrome-512x512.png",
                        sizes: "512x512",
                        type: "image/png",
                    },
                    {
                        src: "assets/images/favicon/android-chrome-512x512.png",
                        sizes: "512x512",
                        type: "image/png",
                        purpose: "maskable",
                    },
                ],
            },
        }),
    ],
    publicDir: "src/public",
    server: {
        port: 3000,
    },
});
