export const cacheName = 'my-website-cache';

export const cacheAddOrFetch = (nameOfCache, requestUrl, callback, ...rest) => {
  caches.open(nameOfCache).then(cache => {
    cache.match(requestUrl)
      .then(response => {
        response.json().then(val => {
          callback(val, ...rest);
        })
      })
      .catch(() => {
        cache.add(requestUrl).then(() => {
          cache.match(requestUrl)
            .then(response => {
              response.json().then(val => {
                callback(val, ...rest);
              })
            })
        })
      })
  })
}