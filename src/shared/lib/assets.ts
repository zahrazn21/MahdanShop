export const ASSET_VERSION = "20260824-1";


export function withVersion(path: string): string {
  if (!path) return path;
  const separator = path.includes("?") ? "&" : "?";
  return `${path}${separator}v=${ASSET_VERSION}`;
}