import { useState, useEffect, useRef } from 'react';

const CACHE_NAME = 'file-cache2.3';

async function getFileUrl(url) {
  try {
    const cache = await caches.open(CACHE_NAME);
    const response = await cache.match(url);
    if (response) {
      const blob = await response.blob();
      return URL.createObjectURL(blob);
    }
    return null;
  } catch (error) {
    console.error(`Error getting file from cache: ${url}`, error);
    return null;
  }
}

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
  const isFetching = useRef(false);

  useEffect(() => {
    if (isFetching.current) return; // Prevent multiple fetches

    isFetching.current = true;
    console.log('useCache triggered with URLs:', urls);

    const loadFiles = async () => {
      const cache = {};
      let allCached = true;

      for (const url of urls) {
        const cachedUrl = await getFileUrl(url);
        if (cachedUrl) {
          cache[url] = cachedUrl;
          console.log(`URL loaded from cache: ${url}`);
        } else {
          allCached = false;
          console.log(`URL not in cache: ${url}`);
        }
      }

      setCachedFiles(cache);

      if (allCached) {
        setIsLoaded(true);
        isFetching.current = false;
        console.log('All URLs already cached:', cache);
      } else {
        const fetchPromises = urls.map(async (url) => {
          if (!cache[url]) {
            const fetchedUrl = await fetchAndCacheFile(url);
            if (fetchedUrl) {
              cache[url] = fetchedUrl;
              console.log(`URL fetched and cached: ${url}`);
            }
          }
        });

        await Promise.all(fetchPromises);

        setCachedFiles((prev) => ({ ...prev, ...cache }));
        setIsLoaded(true);
        isFetching.current = false;
        console.log('All URLs cached after fetching:', cache);
      }
    };

    loadFiles();
  }, [urls]);

  return { cachedFiles, isLoaded };
}

export default useCache;
