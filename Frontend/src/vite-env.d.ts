// src/vite-env.d.ts (or similar)

/// <reference types="vite/client" />

interface ImportMetaEnv {
  // Add a declaration for every VITE_ variable you use, 
  // or use the specific ones you need:
  readonly VITE_API_BASE_URL: string
  // readonly VITE_ANOTHER_VAR: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}