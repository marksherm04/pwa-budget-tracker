// TODO: CHECK THE APP_PREFIX output
const APP_PREFIX = 'Budget-';
const VERSION = 'version_01';
const CACHE_NAME = APP_PREFIX + VERSION;

// npm run start:dev giving me an error

const FILES_TO_CACHE = [
	"./public/index.html",
	"./server.js",
	"./public/css/style.css",
	"./public/js/idb.js",
	"./public/js/index.js",
	"./routes/api.js",
	"./models/transaction.js",
];

self.addEventListener('fetch', function (e) {
	console.log('fetch request : ' + e.request.url)
	e.respondWith(
		caches.match(e.request).then(function (request) {
			if (request) {
				console.log('responding with cache : ' + e.request.url)
				return request
			} else {
				console.log('file is not cached, fetching : ' + e.request.url)
				return fetch(e.request)
			}
		})
	)
})

// Cache resources
self.addEventListener('install', function (e) {
	e.waitUntil(
		caches.open(CACHE_NAME).then(function (cache) {
			console.log('installing cache: ' + CACHE_NAME)
			return cache.addAll(FILES_TO_CACHE)
		})
	)
})

// delete outdated caches
self.addEventListener('activate', function (e) {
	e.waitUntil(
		caches.keys().then(function (keyList) {
			// filter out ones that has this app prefix to create keepList
			let cacheKeeplist = leyList.filter(function (key) {
				return key.indexOf(APP_PREFIX);
			});
			// add current cache name to keeplist
			cacheKeeplist.push(CACHE_NAME);

			return Promise.all(
				keyList.map(function (key, i) {
					if (cacheKeeplist.indexOf(key) === -1) {
						console.log('deleting cache : ' + keyList[i]);
						return caches.delete(keyList[i]);
					}
				})
			);
		})
	);
});