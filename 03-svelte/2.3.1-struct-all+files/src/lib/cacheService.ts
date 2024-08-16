// cacheService.js
import { writable } from 'svelte/store';

interface FileCacheState {
  cachedFiles: { [key: string]: string };
  isFilesLoaded: boolean;
}

function createFileCache() {
  const { subscribe, set, update } = writable<FileCacheState>({
    cachedFiles: {},
    isFilesLoaded: false
  });

  const constructPath = (path: string): string => `/files/${path}`;

  const getFileUrl = async (url: string): Promise<string> => {
    const cache = await caches.open('file-cache2.1');
    const response = await cache.match(url);
    if (response) {
      const blob = await response.blob();
      return URL.createObjectURL(blob);
    }
    return url;
  };

  const loadFiles = async (attachments: { type: string; path: string }[]): Promise<void> => {
    const fileUrls = attachments
      .filter(attachment => attachment.type === 'IMAGE')
      .map(attachment => constructPath(attachment.path));

    const cache = await caches.open('file-cache2.1');
    const cachedFiles: { [key: string]: string } = {};

    for (const fileUrl of fileUrls) {
      let response = await cache.match(fileUrl);
      if (!response) {
        response = await fetch(fileUrl);
        await cache.put(fileUrl, response.clone());
      }
      cachedFiles[fileUrl] = await getFileUrl(fileUrl);
    }

    update(state => ({ ...state, cachedFiles, isFilesLoaded: true }));
  };

  return {
    subscribe,
    loadFiles
  };
}

export const fileCache = createFileCache();
