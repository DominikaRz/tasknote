import { useEffect, useState, useRef, useCallback } from 'react';

const useCache = (imageUrls) => {
  const [cachedFiles, setCachedFiles] = useState({});
  const [isImagesLoaded, setIsImagesLoaded] = useState(false);
  const hasCached = useRef(false); // Ref to track if caching is completed

  const fetchAndCacheImages = useCallback(async () => {

    if (imageUrls.length === 0 || hasCached.current) {
      setIsImagesLoaded(true);
      return;
    }

    const newCachedFiles = {};
    const cache = await caches.open('file-cache2.3');

    for (const imageUrl of imageUrls) {

      let response = await cache.match(imageUrl);
      if (!response) {
        response = await fetch(imageUrl);
        await cache.put(imageUrl, response.clone());
      }
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      newCachedFiles[imageUrl] = url;
    }

    setCachedFiles(newCachedFiles);
    setIsImagesLoaded(true);
    hasCached.current = true; // Mark caching as completed
  }, [imageUrls]);

  useEffect(() => {
    fetchAndCacheImages();
  }, [fetchAndCacheImages]);

  return { cachedFiles, isImagesLoaded };
};

export default useCache;
