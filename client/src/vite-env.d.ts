/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly RENDERER_VITE_API_PROD_URL: string
  readonly RENDERER_VITE_IS_DESKTOP_APP: number
  // more env variables...
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
