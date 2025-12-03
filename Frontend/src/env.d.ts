interface ImportMetaEnv {
  readonly VITE_API_URL?: string;
  // add other VITE_... variables you use here
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}