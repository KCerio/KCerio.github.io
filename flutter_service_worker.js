'use strict';
const MANIFEST = 'flutter-app-manifest';
const TEMP = 'flutter-temp-cache';
const CACHE_NAME = 'flutter-app-cache';

const RESOURCES = {"404.html": "0a27a4163254fc8fce870c8cc3a3f94f",
"assets/AssetManifest.bin": "01ce18fd8b064773eadc73dd4c41c933",
"assets/AssetManifest.bin.json": "a729bcdb275ab6c2e0c2e1c91e7162d1",
"assets/AssetManifest.json": "24e69bd81593cacf171941e6c182b058",
"assets/assets/fonts/InriaSans/TTF/InriaSans-Bold.ttf": "f3f14314888a11c0ea049cd2cdb06e86",
"assets/assets/fonts/InriaSans/TTF/InriaSans-BoldItalic.ttf": "3db4bf63daa0bb276c09999d8292d04e",
"assets/assets/fonts/InriaSans/TTF/InriaSans-Italic.ttf": "fac769dfe0f9dc1b75d819c80fb24331",
"assets/assets/fonts/InriaSans/TTF/InriaSans-Light.ttf": "82036682c544b3ba4f278f36e83368be",
"assets/assets/fonts/InriaSans/TTF/InriaSans-LightItalic.ttf": "ba15a39e2fc36f67c2301800d7f8a6e1",
"assets/assets/fonts/InriaSans/TTF/InriaSans-Regular.ttf": "037fb53da058a5d4aa1adfdc7dcdad72",
"assets/assets/fonts/Inter/Inter-Bold.otf": "d759e235e88e47f838062c7ab97308b1",
"assets/assets/fonts/Inter-V.ttf": "8d63a82f5fc6d6eba21050dd9111520d",
"assets/assets/fonts/Itim-Regular.ttf": "ee6755ae411ffbccd2f24549d871c6b5",
"assets/FontManifest.json": "1decb6b25b776518f43b13d26acc25ed",
"assets/fonts/MaterialIcons-Regular.otf": "5eb54befe2e72e267956fa3aad8cc472",
"assets/images/cargoBox.png": "2b88d90436264ae1a6f40b30b5de10f6",
"assets/images/cargoTruckIcon.png": "f8a85a4716c1a6401a9b473f92fc1d0d",
"assets/images/contactpageBackground.png": "cfeca167f4466b404e07544f56f162ef",
"assets/images/cucLogo.png": "b78881f635ec75cdbc25cf2835151836",
"assets/images/homepageBackground.png": "bd54d174817dc7a4fb8a5177c1d9a80d",
"assets/images/logistic_add.png": "b9c2cf6c2becf279d10357e6a986a449",
"assets/images/logo1.png": "558e357ace19dbf4824bdd6a20898691",
"assets/images/logo2_trans.png": "3b9fe6dcc6e794c3269b627ba0886f62",
"assets/images/orderBackground.png": "61c0bd41fb91f50aa180d6706e6c8bbb",
"assets/images/truck.png": "4112397f9ab04db72ba366dc2249c689",
"assets/images/user_pic.png": "0da560cac41e033db8bde0625a380731",
"assets/NOTICES": "be37dce151a22d2f27d7a0b5b6aa91f1",
"assets/packages/cupertino_icons/assets/CupertinoIcons.ttf": "e986ebe42ef785b27164c36a9abc7818",
"assets/shaders/ink_sparkle.frag": "ecc85a2e95f5e9f53123dcaf8cb9b6ce",
"canvaskit/canvaskit.js": "c86fbd9e7b17accae76e5ad116583dc4",
"canvaskit/canvaskit.js.symbols": "38cba9233b92472a36ff011dc21c2c9f",
"canvaskit/canvaskit.wasm": "3d2a2d663e8c5111ac61a46367f751ac",
"canvaskit/chromium/canvaskit.js": "43787ac5098c648979c27c13c6f804c3",
"canvaskit/chromium/canvaskit.js.symbols": "4525682ef039faeb11f24f37436dca06",
"canvaskit/chromium/canvaskit.wasm": "f5934e694f12929ed56a671617acd254",
"canvaskit/skwasm.js": "445e9e400085faead4493be2224d95aa",
"canvaskit/skwasm.js.symbols": "741d50ffba71f89345996b0aa8426af8",
"canvaskit/skwasm.wasm": "e42815763c5d05bba43f9d0337fa7d84",
"canvaskit/skwasm.worker.js": "bfb704a6c714a75da9ef320991e88b03",
"favicon.ico": "5a43d331b51c21b24ec264ca2e8ed966",
"flutter.js": "c71a09214cb6f5f8996a531350400a9a",
"icons/Icon-192.png": "3c0e19f10cf8216b0d9f95983de84cd1",
"icons/Icon-512.png": "4aed2c0b8c64b7262ba247f49a6a9d20",
"index.html": "e82de9c4111bcbb76672d90ae50d8270",
"/": "e82de9c4111bcbb76672d90ae50d8270",
"main.dart.js": "c9add2c63a735e15ad948ad68b9c1ae9",
"manifest.json": "fd44abb95c4908d06539b025aa5d6f3d",
"version.json": "0b4aa9854dcafdbb6d775482631d028e"};
// The application shell files that are downloaded before a service worker can
// start.
const CORE = ["main.dart.js",
"index.html",
"assets/AssetManifest.bin.json",
"assets/FontManifest.json"];

// During install, the TEMP cache is populated with the application shell files.
self.addEventListener("install", (event) => {
  self.skipWaiting();
  return event.waitUntil(
    caches.open(TEMP).then((cache) => {
      return cache.addAll(
        CORE.map((value) => new Request(value, {'cache': 'reload'})));
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
        // Claim client to enable caching on first launch
        self.clients.claim();
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
      // Claim client to enable caching on first launch
      self.clients.claim();
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
        // lazily populate the cache only if the resource was successfully fetched.
        return response || fetch(event.request).then((response) => {
          if (response && Boolean(response.ok)) {
            cache.put(event.request, response.clone());
          }
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
