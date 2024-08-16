import { useState, useEffect, useRef } from 'react';

const CACHE_NAME = 'file-cache2.3';

// Get the URL of the cached file or null if not cached
async function getFileUrl(url) {
  try {
    const cache = await caches.open(CACHE_NAME);
    const response = await cache.match(url);
    if (response) {
      const blob = await response.blob();
      return URL.createObjectURL(blob);
    }
    return null; // Return null if not found in cache
  } catch (error) {
    console.error(`Error getting file from cache: ${url}`, error);
    return null;
  }
}

// Fetch the file and store it in the cache
async function fetchAndCacheFile(url) {
  try {
    const cache = await caches.open(CACHE_NAME);
    const response = await fetch(url);
    if (response.ok) {
      await cache.put(url, response.clone());
      const blob = await response.blob();
      return URL.createObjectURL(blob);
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
  const urlsToFetch = useRef(new Set()); // Use a Set to avoid duplicate URLs
  const hasFetched = useRef(false); // Track if fetch has been completed
  const isFetching = useRef(false); // Track if a fetch operation is in progress

  // Load files from cache and determine which need to be fetched
  useEffect(() => {
    if (isFetching.current || hasFetched.current) return;

    const loadFiles = async () => {
      isFetching.current = true;
      const cache = {};
      const urlsNotCached = [];

      // Check cache for each URL
      for (const url of urls) {
        const cachedUrl = await getFileUrl(url);
        if (cachedUrl) {
          cache[url] = cachedUrl;
        } else {
          urlsNotCached.push(url);
          urlsToFetch.current.add(url); // Add to URLs to fetch
        }
      }

      // Update the state with cached files
      setCachedFiles(cache);

      // Fetch files only if there are URLs not cached
      if (urlsNotCached.length > 0) {
        await fetchFiles();
      } else {
        setIsLoaded(true);
        isFetching.current = false;
        hasFetched.current = true;
      }
    };

    loadFiles();
  }, [urls]);

  // Fetch files that are not yet cached
  const fetchFiles = async () => {
    if (urlsToFetch.current.size === 0) return;

    const updatedCache = { ...cachedFiles };
    const urls = Array.from(urlsToFetch.current); // Convert Set to Array

    for (const url of urls) {
      const fetchedUrl = await fetchAndCacheFile(url);
      if (fetchedUrl) {
        updatedCache[url] = fetchedUrl;
      }
    }

    // Clear the Set and update state
    urlsToFetch.current.clear();
    setCachedFiles(updatedCache);
    setIsLoaded(true);
    isFetching.current = false;
    hasFetched.current = true; // Mark as fetched to prevent re-fetching
  };

  return { cachedFiles, isLoaded };
}

export default useCache;
