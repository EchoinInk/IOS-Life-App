/**
 * Public theme entrypoint. Import from `@/theme` instead of reaching into
 * `@/theme/tokens` directly so we have a single seam for future additions
 * (e.g. dark-mode token sets, semantic aliases, brand variants).
 */
export * from "./tokens";
export { tokens as default } from "./tokens";
