interface ImportMetaEnv {
  readonly VITE_API_BASE_URL: string;
  readonly VITE_ADMIN_SECRET: string;
  // etc.
}
interface ImportMeta {
  readonly env: ImportMetaEnv;
}