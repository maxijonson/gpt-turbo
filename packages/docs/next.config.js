const { createVanillaExtractPlugin } = require("@vanilla-extract/next-plugin");

const withVanillaExtract = createVanillaExtractPlugin();

const withMDX = require("@next/mdx")();

/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    swcMinify: true,
    experimental: {
        mdxRs: true,
    },
};

module.exports = withVanillaExtract(withMDX(nextConfig));
