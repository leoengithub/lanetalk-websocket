import babel from '@rollup/plugin-babel';
import resolve from '@rollup/plugin-node-resolve';
import external from 'rollup-plugin-peer-deps-external';
import terser from '@rollup/plugin-terser';
import commonjs from '@rollup/plugin-commonjs';
import typescript from '@rollup/plugin-typescript';

export default {
  input: './src/index.ts',
  output: [
    {
      file: 'dist/index.cjs.js', // Assuming package.json has "main": "dist/index.cjs.js"
      format: 'cjs',
      sourcemap: true,
    },
    {
      file: 'dist/index.esm.js', // Assuming package.json has "module": "dist/index.esm.js"
      format: 'es',
      sourcemap: true,
    },
  ],
  plugins: [
    external(),
    resolve(),
    commonjs(), // Converts CommonJS modules to ES6
    typescript({ tsconfig: './tsconfig.json' }), // Handles TypeScript
    babel({ babelHelpers: 'bundled' }),
    terser(),
  ],
  external: ['react', 'react-dom'],
};
