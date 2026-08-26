export function getAssetUrl(path: string): string {
  const normalizedPath = path.replace(/^\/?(assets\/)?/, "");
  return `https://teamsitestorage.blob.core.windows.net/assets/${normalizedPath}`;
}
