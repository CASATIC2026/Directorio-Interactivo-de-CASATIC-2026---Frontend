const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';

export function resolveAssetUrl(url) {
  if (!url) return '';
  if (/^(https?:|data:|blob:)/i.test(url)) return url;

  if (url.startsWith('/uploads/') || url.startsWith('/logos/')) {
    if (/^https?:\/\//i.test(API_BASE_URL)) {
      return `${new URL(API_BASE_URL).origin}${url}`;
    }

    return url;
  }

  return url;
}
