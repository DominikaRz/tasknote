import { useState, useEffect, useRef, useCallback } from 'react';

const CACHE_NAME = 'file-cache2.3';
const MAX_CONCURRENT_FETCHES = 1;

// Check if the image URL is available in the cache
async function getFileUrl(url) {
  try {
    const cache = await caches.open(CACHE_NAME);
    const response = await cache.match(url);
    if (response) {
      return url; // Return the URL directly if found in cache
    }
    return null; // Return null if not found in cache
  } catch (error) {
    console.error(`Error getting file from cache: ${url}`, error);
    return null;
  }
}

// Fetch the image and store it in the cache
async function fetchAndCacheFile(url) {
  try {
    const cache = await caches.open(CACHE_NAME);
    const response = await fetch(url);
    if (response.ok) {
      await cache.put(url, response.clone()); // Cache the image response
      return url; // Return the URL directly after caching
    } else {
      console.error(`Failed to fetch ${url}: ${response.statusText}`);
      return null;
    }
  } catch (error) {
    console.error(`Error fetching and caching file: ${url}`, error);
    return null;
  }
}

function useCache(urls) {
  const [cachedFiles, setCachedFiles] = useState({});
  const [isLoaded, setIsLoaded] = useState(false);
  const urlsToFetch = useRef(new Set());
  const fetchingUrls = useRef(new Map());
  const isFetching = useRef(false);
  const hasCheckedCache = useRef(false);

  const checkCache = useCallback(async () => {
    if (hasCheckedCache.current || isFetching.current) return;

    isFetching.current = true;
    hasCheckedCache.current = true;

    const cache = {};
    const urlsNotCached = [];

    console.log('Starting cache check...');

    const cacheChecks = urls.map(async (url) => {
      const cachedUrl = await getFileUrl(url);
      if (cachedUrl) {
        cache[url] = cachedUrl;
      } else {
        urlsNotCached.push(url);
        urlsToFetch.current.add(url);
      }
    });

    await Promise.all(cacheChecks);
    setCachedFiles((prev) => ({ ...prev, ...cache }));

    console.log('Cache check complete.');
    console.log('Cached files:', cache);
    console.log('URLs not cached:', urlsNotCached);

    if (urlsNotCached.length > 0) {
      await fetchFilesInBatches(urlsNotCached);
    }

    setIsLoaded(true);
    isFetching.current = false;
  }, [urls]);

  useEffect(() => {
    checkCache();
  }, [checkCache]);

  const fetchFilesInBatches = async (urlsNotCached) => {
    const updatedCache = { ...cachedFiles };

    const fetchBatch = async (urls) => {
      const fetchPromises = urls.map(async (url) => {
        if (!fetchingUrls.current.has(url)) {
          fetchingUrls.current.set(url, fetchAndCacheFile(url));
        }
        const fetchedUrl = await fetchingUrls.current.get(url);
        if (fetchedUrl) {
          updatedCache[url] = fetchedUrl;
        }
      });

      await Promise.all(fetchPromises);
    };

    const urlBatches = [];
    for (let i = 0; i < urlsNotCached.length; i += MAX_CONCURRENT_FETCHES) {
      urlBatches.push(urlsNotCached.slice(i, i + MAX_CONCURRENT_FETCHES));
    }

    for (const batch of urlBatches) {
      await fetchBatch(batch);
    }

    urlsToFetch.current.clear();
    fetchingUrls.current.clear();
    setCachedFiles(updatedCache);

    console.log('File fetch complete.');
  };

  return { cachedFiles, isLoaded };
}

export default useCache;
