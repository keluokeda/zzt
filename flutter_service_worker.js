'use strict';
const MANIFEST = 'flutter-app-manifest';
const TEMP = 'flutter-temp-cache';
const CACHE_NAME = 'flutter-app-cache';
const RESOURCES = {
  "version.json": "31a944bb577f6299c686071a97e691cc",
"index.html": "655a8eb13bee5ac06825f8c52dee7f71",
"/": "655a8eb13bee5ac06825f8c52dee7f71",
"main.dart.js": "de05462d19371dd5c053826bac67a86c",
"flutter.js": "8ae00b472ec3937a5bee52055d6bc8b4",
"favicon.png": "5dcef449791fa27946b3d35ad8803796",
"icons/Icon-192.png": "ac9a721a12bbc803b44f645561ecb1e1",
"icons/Icon-maskable-192.png": "c457ef57daa1d16f64b27b786ec2ea3c",
"icons/Icon-maskable-512.png": "301a7604d45b3e739efc881eb04896ea",
"icons/Icon-512.png": "96e752610906ba2a93c65f8abe1645f1",
"manifest.json": "548ed44d2bcc409a6b0ec4bb5ae85f75",
"assets/images/app_image_id_card_back.png": "9ccd3828a59f95d56c255bb23e269a5c",
"assets/images/app_image_mine_account.png": "d159d3f674fec5dd639aafa28f00441a",
"assets/images/app_image_mine_feedback.png": "603c07358e65e78d2ff1a526a0d7cf59",
"assets/images/app_image_mine_header.png": "7d6cbde669b28b181098771c8f831c1f",
"assets/images/app_image_wallet_header.png": "7dcd56db9fe58bf7ff3d8bbb57a62335",
"assets/images/app_image_red_clear.png": "aa02c71b6c6101cb5e664719858cdc74",
"assets/images/app_image_mine_customer_service.png": "2b4357852df5a6af5426485af7aeee40",
"assets/images/app_image_mine_fans.png": "54791121f1b8aba73aa44f6ec9a31c4c",
"assets/images/app_image_home_date.png": "053c4f658709f71e9868e3d2eb87f487",
"assets/images/app_image_mine_settings.png": "c8a9d2e0c6af65c6b17480a90c7bbd0d",
"assets/images/app_image_home_appointment.png": "b8af3097a695417904090048515d4fc5",
"assets/images/app_image_home_message.png": "f97439580e449dbba36ea4be525da35e",
"assets/images/common_image_empty_list.png": "eb89b031ecb65bf28adca19759363aff",
"assets/images/app_image_small_star.png": "6612081a4bc4ea6491e5dc6bda2f5fe5",
"assets/images/app_image_home_header.png": "d8087703c810caf7d8563508692ecb98",
"assets/images/app_image_mine_wallet.png": "f09a3689851ede8cc54180db1ff94c8e",
"assets/images/app_image_mine_star.png": "7691543405488b29b782ec68549ef9b4",
"assets/images/app_image_home_live.png": "57ed603d15c21a83db94bf3bd06d78d9",
"assets/images/app_image_id_card_front.png": "721cc89436fffe2d734f5e1c7a65d43b",
"assets/AssetManifest.json": "5368ec91ae61079f063739723d9fe8ef",
"assets/NOTICES": "fc3def3164212d24e3f54797af207871",
"assets/FontManifest.json": "dc3d03800ccca4601324923c0b1d6d57",
"assets/packages/cupertino_icons/assets/CupertinoIcons.ttf": "6d342eb68f170c97609e9da345464e5e",
"assets/packages/common/images/common_image_permissions_mic.png": "367cd2bc979e474520de6b7385f53578",
"assets/packages/common/images/common_image_permissions_camera.png": "70ca24fd0eb47d33b5f4f036d08fcd83",
"assets/packages/common/images/common_image_empty_list.png": "eb89b031ecb65bf28adca19759363aff",
"assets/packages/common/images/common_image_permissions_gallery.png": "500996c6eff0fca681336d3247f3b8e8",
"assets/shaders/ink_sparkle.frag": "2ad5fabd6a36a6deff087b8edfd0c1f8",
"assets/fonts/MaterialIcons-Regular.otf": "95db9098c58fd6db106f1116bae85a0b",
"canvaskit/canvaskit.js": "2bc454a691c631b07a9307ac4ca47797",
"canvaskit/profiling/canvaskit.js": "38164e5a72bdad0faa4ce740c9b8e564",
"canvaskit/profiling/canvaskit.wasm": "95a45378b69e77af5ed2bc72b2209b94",
"canvaskit/canvaskit.wasm": "bf50631470eb967688cca13ee181af62"
};

// The application shell files that are downloaded before a service worker can
// start.
const CORE = [
  "main.dart.js",
"index.html",
"assets/AssetManifest.json",
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
