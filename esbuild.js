const esbuild = require("esbuild"),
  autoprefixer = require("autoprefixer"),
  postCssPlugin = require("esbuild-plugin-postcss2"),
  {
    NodeModulesPolyfillPlugin
  } = require("@esbuild-plugins/node-modules-polyfill"),
  fs = require("fs"),
  { join } = require("path");

const outDir = "./public/build";
if (fs.existsSync(join(__dirname, outDir)))
  fs.rmSync(join(__dirname, outDir), { recursive: true });

esbuild
  .build({
    entryPoints: [
      "./src/scripts/background.ts",
      "./src/scripts/content.ts",
      "./src/scripts/injected.ts",
      "./src/views/popup.tsx",
      "./src/views/auth.tsx",
      "./src/views/welcome.tsx",
      ...(process.env.BUIL_TARGET === "FIREFOX"
        ? []
        : ["./src/views/archive.tsx"])
    ],
    format: "iife",
    bundle: true,
    minify: true,
    sourcemap: process.env.NODE_ENV !== "production",
    watch: process.env.NODE_ENV !== "production",
    inject: ["./src/utils/polyfill.js"],
    target: ["chrome58", "firefox57"],
    outdir: outDir,
    define: {
      global: "window"
    },
    loader: {
      ".png": "dataurl",
      ".svg": "dataurl"
    },
    plugins: [
      NodeModulesPolyfillPlugin(),
      postCssPlugin.default({
        plugins: [autoprefixer]
      })
    ]
  })
  .catch(() => process.exit(1));
