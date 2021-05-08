'use strict';
const MANIFEST = 'flutter-app-manifest';
const TEMP = 'flutter-temp-cache';
const CACHE_NAME = 'flutter-app-cache';
const RESOURCES = {
  "assets/AssetManifest.json": "9532087877392b01a545d655b13f7b8a",
"assets/assets/images/batman-dc.png": "3d961b1d55f90a12e3212e5c50298f12",
"assets/assets/images/beaty-dc.png": "e66f3034f24e7fddf40f25fa85e9f805",
"assets/assets/images/capamerica-marvel.png": "45fa1ed10d8d314e971117c06f183aad",
"assets/assets/images/check.png": "a374db98a8602da1ad7a95f983af5065",
"assets/assets/images/flash-dc.png": "7aed0ebc9e26baae4b222c6dd7bc7d22",
"assets/assets/images/height.png": "96ba9457c80d84e54e8fdd7b6e385cac",
"assets/assets/images/heroes.jpg": "95c8fa583058d8b9e2bc40738c618afa",
"assets/assets/images/heroes.png": "ac52aa0d94a6cab22c14fb8f8d2f7154",
"assets/assets/images/heroes_splash.jpg": "f0f61688b0d3dd622c6158d4b76d800f",
"assets/assets/images/hulk-marvel.png": "0da7491dacc72f843afbdc54439f1775",
"assets/assets/images/ironman-marvel.png": "79a25d295c241c0e28eb1259ab220c96",
"assets/assets/images/person-opac.png": "c7d7c578320f8b5dad54d23e6991e946",
"assets/assets/images/person.png": "c7d7c578320f8b5dad54d23e6991e946",
"assets/assets/images/speed.png": "d78115cd7c2d34e6622e2a4b808a5b9c",
"assets/assets/images/spiderman-marvel.png": "1774905f825a3e2cf5c8985a91cad4f1",
"assets/assets/images/superman-dc.png": "9c8dd51d63b85fa39f754e21fa3f38cf",
"assets/assets/images/thor-marvel.png": "fc294ff38968c604ff1ac4efc5b70326",
"assets/assets/images/trophy.png": "021c3ebebbe5324ae11965150f9c7c57",
"assets/assets/images/universe.png": "b3700d610033bade438904ccf4c567f2",
"assets/assets/images/universe256.png": "13f418b21c7457ea8758b8eba865988a",
"assets/assets/images/universe512.png": "da6cd8383bda7f0fd630b760102f0dba",
"assets/assets/images/weight.png": "0ce740fbcff08809266e586de9420421",
"assets/assets/images/wilson.png": "00b1dc51c4384e8ee5dc29e20bc2261d",
"assets/assets/images/world.png": "44c056bd92ca9be99a3d16fe472c8304",
"assets/FontManifest.json": "dc3d03800ccca4601324923c0b1d6d57",
"assets/fonts/MaterialIcons-Regular.otf": "1288c9e28052e028aba623321f7826ac",
"assets/NOTICES": "ced94ddefec5557e99c7bec57cc42ffa",
"assets/packages/cupertino_icons/assets/CupertinoIcons.ttf": "6d342eb68f170c97609e9da345464e5e",
"aws/get-heroes.py": "8c10a7c31debc5ff43d4676a0a42fdc9",
"aws/heroes-manut.py": "b5c1e25711452cd337475de940fc494e",
"aws/heroes-photo.py": "be1de2b2d79a127ad04babdbda12b6e0",
"favicon.png": "5dcef449791fa27946b3d35ad8803796",
"icons/Icon-192.png": "ac9a721a12bbc803b44f645561ecb1e1",
"icons/Icon-512.png": "96e752610906ba2a93c65f8abe1645f1",
"index.html": "b537bfcf2df258ce5ef3e8ca13772aae",
"/": "b537bfcf2df258ce5ef3e8ca13772aae",
"js/functions.js": "53c6921bf4f11074014b6babae42e9a4",
"main.dart.js": "4011cefa3d587f91cbdfe5c0bcd7f2bb",
"manifest.json": "9d540aa7638d7cf7de7de082be3b1598",
"README.md": "b1cc25596bfa00f0149565bf1b859498",
"version.json": "2ea077507166e5722a95b2d81639cc3c"
};

// The application shell files that are downloaded before a service worker can
// start.
const CORE = [
  "/",
"main.dart.js",
"index.html",
"assets/NOTICES",
"assets/AssetManifest.json",
"assets/FontManifest.json"];
// During install, the TEMP cache is populated with the application shell files.
self.addEventListener("install", (event) => {
  self.skipWaiting();
  return event.waitUntil(
    caches.open(TEMP).then((cache) => {
      return cache.addAll(
        CORE.map((value) => new Request(value + '?revision=' + RESOURCES[value], {'cache': 'reload'})));
    })
  );
});

// During activate, the cache is populated with the temp files downloaded in
// install. If this service worker is upgrading from one with a saved
// MANIFEST, then use this to retain unchanged resource files.
self.addEventListener("activate", function(event) {
  return event.waitUntil(async function() {
    try {
      var contentCache = await caches.open(CACHE_NAME);
      var tempCache = await caches.open(TEMP);
      var manifestCache = await caches.open(MANIFEST);
      var manifest = await manifestCache.match('manifest');
      // When there is no prior manifest, clear the entire cache.
      if (!manifest) {
        await caches.delete(CACHE_NAME);
        contentCache = await caches.open(CACHE_NAME);
        for (var request of await tempCache.keys()) {
          var response = await tempCache.match(request);
          await contentCache.put(request, response);
        }
        await caches.delete(TEMP);
        // Save the manifest to make future upgrades efficient.
        await manifestCache.put('manifest', new Response(JSON.stringify(RESOURCES)));
        return;
      }
      var oldManifest = await manifest.json();
      var origin = self.location.origin;
      for (var request of await contentCache.keys()) {
        var key = request.url.substring(origin.length + 1);
        if (key == "") {
          key = "/";
        }
        // If a resource from the old manifest is not in the new cache, or if
        // the MD5 sum has changed, delete it. Otherwise the resource is left
        // in the cache and can be reused by the new service worker.
        if (!RESOURCES[key] || RESOURCES[key] != oldManifest[key]) {
          await contentCache.delete(request);
        }
      }
      // Populate the cache with the app shell TEMP files, potentially overwriting
      // cache files preserved above.
      for (var request of await tempCache.keys()) {
        var response = await tempCache.match(request);
        await contentCache.put(request, response);
      }
      await caches.delete(TEMP);
      // Save the manifest to make future upgrades efficient.
      await manifestCache.put('manifest', new Response(JSON.stringify(RESOURCES)));
      return;
    } catch (err) {
      // On an unhandled exception the state of the cache cannot be guaranteed.
      console.error('Failed to upgrade service worker: ' + err);
      await caches.delete(CACHE_NAME);
      await caches.delete(TEMP);
      await caches.delete(MANIFEST);
    }
  }());
});

// The fetch handler redirects requests for RESOURCE files to the service
// worker cache.
self.addEventListener("fetch", (event) => {
  if (event.request.method !== 'GET') {
    return;
  }
  var origin = self.location.origin;
  var key = event.request.url.substring(origin.length + 1);
  // Redirect URLs to the index.html
  if (key.indexOf('?v=') != -1) {
    key = key.split('?v=')[0];
  }
  if (event.request.url == origin || event.request.url.startsWith(origin + '/#') || key == '') {
    key = '/';
  }
  // If the URL is not the RESOURCE list then return to signal that the
  // browser should take over.
  if (!RESOURCES[key]) {
    return;
  }
  // If the URL is the index.html, perform an online-first request.
  if (key == '/') {
    return onlineFirst(event);
  }
  event.respondWith(caches.open(CACHE_NAME)
    .then((cache) =>  {
      return cache.match(event.request).then((response) => {
        // Either respond with the cached resource, or perform a fetch and
        // lazily populate the cache.
        return response || fetch(event.request).then((response) => {
          cache.put(event.request, response.clone());
          return response;
        });
      })
    })
  );
});

self.addEventListener('message', (event) => {
  // SkipWaiting can be used to immediately activate a waiting service worker.
  // This will also require a page refresh triggered by the main worker.
  if (event.data === 'skipWaiting') {
    self.skipWaiting();
    return;
  }
  if (event.data === 'downloadOffline') {
    downloadOffline();
    return;
  }
});

// Download offline will check the RESOURCES for all files not in the cache
// and populate them.
async function downloadOffline() {
  var resources = [];
  var contentCache = await caches.open(CACHE_NAME);
  var currentContent = {};
  for (var request of await contentCache.keys()) {
    var key = request.url.substring(origin.length + 1);
    if (key == "") {
      key = "/";
    }
    currentContent[key] = true;
  }
  for (var resourceKey of Object.keys(RESOURCES)) {
    if (!currentContent[resourceKey]) {
      resources.push(resourceKey);
    }
  }
  return contentCache.addAll(resources);
}

// Attempt to download the resource online before falling back to
// the offline cache.
function onlineFirst(event) {
  return event.respondWith(
    fetch(event.request).then((response) => {
      return caches.open(CACHE_NAME).then((cache) => {
        cache.put(event.request, response.clone());
        return response;
      });
    }).catch((error) => {
      return caches.open(CACHE_NAME).then((cache) => {
        return cache.match(event.request).then((response) => {
          if (response != null) {
            return response;
          }
          throw error;
        });
      });
    })
  );
}
