import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ImageCacheService {
  private cacheName: string = 'files-cache2.3';
  private fetchingUrls = new Map<string, Promise<void>>(); // Track ongoing fetch requests

  constructor() { }

  // Caches the image if not already cached
  async cacheImage(url: string): Promise<void> {
    if (this.isBrowser()) {
      if ('caches' in window) {
        // Check if the URL is already being fetched
        if (!this.fetchingUrls.has(url)) {
          const fetchPromise = this.fetchAndCacheImage(url);
          this.fetchingUrls.set(url, fetchPromise);
          await fetchPromise;
          this.fetchingUrls.delete(url); // Clean up after fetch is complete
        } else {
          // Wait for the ongoing fetch to complete
          await this.fetchingUrls.get(url);
        }
      }
    }
  }

  // Fetches and caches the image
  private async fetchAndCacheImage(url: string): Promise<void> {
    try {
      const cache = await caches.open(this.cacheName);
      const response = await fetch(url);
      if (response.ok) {
        await cache.put(url, response.clone()); // Cache the image response
      } else {
        console.error(`Failed to fetch ${url}: ${response.statusText}`);
      }
    } catch (err) {
      console.error(`Error fetching and caching image: ${url}`, err);
    }
  }

  // Retrieves the image URL from the cache
  async getCachedImage(url: string): Promise<string> {
    if (this.isBrowser() && 'caches' in window) {
      try {
        const cache = await caches.open(this.cacheName);
        const response = await cache.match(url);
        if (response) {
          return URL.createObjectURL(await response.blob());
        } else {
          throw new Error(`Image not found in cache: ${url}`);
        }
      } catch (err) {
        console.error(`Error retrieving cached image: ${url}`, err);
        throw err;
      }
    } else {
      throw new Error('Cache API is not available.');
    }
  }

  private isBrowser(): boolean {
    return typeof window !== 'undefined' && typeof window.document !== 'undefined';
  }
}
