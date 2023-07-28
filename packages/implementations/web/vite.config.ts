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
            devOptions: {
                enabled: true,
            },
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
    define: {
        APP_VERSION: JSON.stringify(process.env.npm_package_version),
    },
    build: {
        rollupOptions: {
            output: {
                manualChunks: {
                    "mantine-core": [
                        "@mantine/core",
                        "@mantine/hooks",
                        "@emotion/react",
                    ],
                    "mantine-dropzone": ["@mantine/dropzone"],
                    "mantine-form": ["@mantine/form"],
                    "mantine-modals": ["@mantine/modals"],
                    "mantine-notifications": ["@mantine/notifications"],
                    "mantine-prism": ["@mantine/prism"],
                    "mantine-tiptap": [
                        "@tiptap/extension-code-block-lowlight",
                        "@tiptap/extension-link",
                        "@tiptap/react",
                        "@tiptap/starter-kit",
                        "@mantine/tiptap",
                        "@tabler/icons-react",
                        "lowlight",
                    ],
                    "gpt-turbo": ["gpt-turbo"],
                    "gpt-turbo-plugin-stats": ["gpt-turbo-plugin-stats"],
                    react: ["react"],
                    "react-dom": ["react-dom"],
                    "react-icons": ["react-icons"],
                    "react-router-dom": ["react-router-dom"],
                    uuid: ["uuid"],
                    zod: ["zod"],
                    zustand: ["zustand"],
                },
            },
        },
    },
    server: {
        port: 3000,
        host: true,
    },
});
