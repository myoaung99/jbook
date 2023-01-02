import * as esbuild from "esbuild-wasm";
import axios from "axios";

export const unpkgPathPlugin = () => {
  return {
    name: "unpkg-path-plugin",
    setup(build: esbuild.PluginBuild) {
      //* finding the module's path at onResolve
      build.onResolve({ filter: /.*/ }, async (args: any) => {
        console.log("onResole", args);
        if (args.path === "index.js") {
          return { path: args.path, namespace: "a" };
        }

        //* import statement with relative path syntax
        if (args.path.includes("./") || args.path.includes("../")) {
          const path = new URL(
            args.path,
            `https://unpkg.com${args.resolveDir}/`
          );

          return {
            path: path.href,
            namespace: "a",
          };
        }

        return {
          path: `https://unpkg.com/${args.path}`,
          namespace: "a",
        };
      });

      //* parsing and reading the module path return from onResolve
      build.onLoad({ filter: /.*/ }, async (args: any) => {
        console.log("onLoad", args);

        if (args.path === "index.js") {
          return {
            loader: "jsx",
            contents: `
              const react = require('react');
              console.log(react);
            `,
          };
        }

        const { data, request } = await axios.get(args.path);
        //* resolveDir is the directory where index.js was found during the http request
        return {
          loader: "jsx",
          contents: data,
          resolveDir: new URL("./", request.responseURL).pathname,
        };
      });
    },
  };
};
