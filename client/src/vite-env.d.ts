/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly RENDERER_VITE_API_PROD_URL: string
  // more env variables...
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
