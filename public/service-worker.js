importScripts('third_party/serviceworker-cache-polyfill.js');

var CACHE_NAME = 'appshell';
var CACHE_VERSION = '@VERSION@';

self.oninstall = function(event) {
  var urls = [
    '/',
    '/assets/img/'
  ];

  urls = urls.map(function(url) {
    return new Request(url, {credentials: 'include'});
  });

  event.waitUntil(
    caches
      .open(CACHE_NAME + '-v' + CACHE_VERSION)
      .then(function(cache) {
        return cache.addAll(urls);
      })
  );
};

self.onactivate = function(event) {
  var currentCacheName = CACHE_NAME + '-v' + CACHE_VERSION;
  caches.keys().then(function(cacheNames) {
    return Promise.all(
      cacheNames.map(function(cacheName) {
        // TODO: This should never get called
        // can we drop this check?
        if (cacheName.indexOf(CACHE_NAME) === -1) {
          return;
        }

        if (cacheName !== currentCacheName) {
          return caches.delete(cacheName);
        }
      })
    );
  });
};

self.onfetch = function(event) {
  var request = event.request;
  event.respondWith(
    // Check the cache for a hit of the asset as is.
    caches.match(request).then((response) => {
      // If we have a response return it.
      if (response) {
        console.log('    sw: [cached] ' + request.url);
        return response;
      }

      // For other requests on our domain, return the app shell
      var url = new URL(request.url);
      if (url.host === this.location.host) {
        if (
          url.pathname.indexOf('.') === -1 &&
          url.pathname.indexOf('/partials') !== 0
        ) {
          console.log('    sw: [app-shell redirect] ' + request.url);
          return caches.match('/app-shell');
        }
      }

      // If here, then it should be a request for external url
      // analytics or web fonts for example.
      console.log('    sw: [fetch] ' + request.url);
      return fetch(request);
    })
  );
};