import svelte from "rollup-plugin-svelte";
import commonjs from "@rollup/plugin-commonjs";
import nodeResolve from "@rollup/plugin-node-resolve";
import autoPreprocess from "svelte-preprocess";
import typescript from "@rollup/plugin-typescript";

const isProd = (process.env.BUILD === 'production');

const banner =
  `/*
THIS IS A GENERATED/BUNDLED FILE BY ROLLUP
if you want to view the source visit the plugins github repository
*/
`;

export default {
  input: 'src/main.ts',
  output: {
    dir: '.',
    sourcemap: 'inline',
    sourcemapExcludeSources: isProd,
    format: 'cjs',
    exports: 'default',
    banner,
  },
  external: ['obsidian'],
  plugins: [
    svelte({
      emitCss: false,
      preprocess: autoPreprocess(),
    }),
    typescript(),
    nodeResolve({ browser: true }),
    commonjs(),
  ]
};