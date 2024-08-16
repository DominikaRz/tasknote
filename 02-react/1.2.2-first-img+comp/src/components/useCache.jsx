import { useEffect, useState, useRef, useCallback } from 'react';

const useCache = (imageUrls) => {
  const [cachedImages, setCachedImages] = useState({});
  const [isImagesLoaded, setIsImagesLoaded] = useState(false);
  const hasCached = useRef(false); // Ref to track if caching is completed

  const fetchAndCacheImages = useCallback(async () => {

    if (imageUrls.length === 0 || hasCached.current) {
      setIsImagesLoaded(true);
      return;
    }

    const newCachedImages = {};
    const cache = await caches.open('image-cache1.2');

    for (const imageUrl of imageUrls) {

      let response = await cache.match(imageUrl);
      if (!response) {
        response = await fetch(imageUrl);
        await cache.put(imageUrl, response.clone());
      }
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      newCachedImages[imageUrl] = url;
    }

    setCachedImages(newCachedImages);
    setIsImagesLoaded(true);
    hasCached.current = true; // Mark caching as completed
  }, [imageUrls]);

  useEffect(() => {
    fetchAndCacheImages();
  }, [fetchAndCacheImages]);

  return { cachedImages, isImagesLoaded };
};

export default useCache;
