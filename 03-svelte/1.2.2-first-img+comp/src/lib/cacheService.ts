// cacheService.js
import { writable } from 'svelte/store';

interface ImageCacheState {
  cachedImages: { [key: string]: string };
  isImagesLoaded: boolean;
}

function createImageCache() {
  const { subscribe, set, update } = writable<ImageCacheState>({
    cachedImages: {},
    isImagesLoaded: false
  });

  const constructPath = (path: string): string => `/compress/${path}`;

  const getImageUrl = async (url: string): Promise<string> => {
    const cache = await caches.open('image-cache1.2');
    const response = await cache.match(url);
    if (response) {
      const blob = await response.blob();
      return URL.createObjectURL(blob);
    }
    return url;
  };

  const loadImages = async (attachments: { type: string; path: string }[]): Promise<void> => {
    const imageUrls = attachments
      .filter(attachment => attachment.type === 'IMAGE')
      .map(attachment => constructPath(attachment.path));

    const cache = await caches.open('image-cache1.2');
    const cachedImages: { [key: string]: string } = {};

    for (const imageUrl of imageUrls) {
      let response = await cache.match(imageUrl);
      if (!response) {
        response = await fetch(imageUrl);
        await cache.put(imageUrl, response.clone());
      }
      cachedImages[imageUrl] = await getImageUrl(imageUrl);
    }

    update(state => ({ ...state, cachedImages, isImagesLoaded: true }));
  };

  return {
    subscribe,
    loadImages
  };
}

export const imageCache = createImageCache();
