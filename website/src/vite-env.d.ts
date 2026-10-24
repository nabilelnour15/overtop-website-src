interface ImportMetaEnv {
  /** Public address of the site, ending in "/". Set in .env. */
  readonly VITE_SITE_URL: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
