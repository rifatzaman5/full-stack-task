import NodeCache from 'node-cache';

const cache = new NodeCache({
  stdTTL: parseInt(process.env.CACHE_TTL || '30', 10),
  checkperiod: 10,
});

export const getCached = <T>(key: string): T | undefined => {
  return cache.get<T>(key);
};

export const setCache = <T>(key: string, value: T): void => {
  cache.set(key, value);
};

export const deleteCache = (key: string): void => {
  cache.del(key);
};

export const deleteCachePattern = (pattern: string): void => {
  const keys = cache.keys();
  keys.forEach((key) => {
    if (key.includes(pattern)) {
      cache.del(key);
    }
  });
};

export default cache;
