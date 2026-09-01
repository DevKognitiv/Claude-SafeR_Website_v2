import { defineConfig, globalIgnores } from 'eslint/config';
import nextVitals from 'eslint-config-next/core-web-vitals';
import nextTs from 'eslint-config-next/typescript';

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  // next/image is not available on this hosting (vinext / Cloudflare Workers); plain <img> with explicit sizes and lazy loading is intentional.
  { rules: { '@next/next/no-img-element': 'off' } },
  globalIgnores(['.next/**', 'out/**', 'build/**', 'next-env.d.ts', 'crawler/**', '.i18n-cache/**']),
]);

export default eslintConfig;
