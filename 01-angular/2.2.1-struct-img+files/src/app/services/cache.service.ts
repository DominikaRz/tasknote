import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ImageCacheService {
  private cacheName: string = 'image-cache2.1';

  constructor() { }

  // Caches the image if not already cached
  async cacheImage(url: string): Promise<void> {
    if (this.isBrowser()) {
        if ('caches' in window) {
          try {
            const cache = await caches.open('image-cache2.1');
            const response = await fetch(url);
            if (response.status === 200) {
              await cache.put(url, response);
            } 
          } catch (err) { }
        } 
      } 
    }

  private isBrowser(): boolean {
    return typeof window !== 'undefined' && typeof window.document !== 'undefined';
  }

  // Retrieves the image URL from the cache
  async getCachedImage(url: string): Promise<string> {
    const cache = await caches.open(this.cacheName);
    const response = await cache.match(url);
    if (response) {
      return URL.createObjectURL(await response.blob());
    }
    throw new Error(`Image not found in cache: ${url}`);
  }
}
