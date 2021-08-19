// TODO: CHECK THE APP_PREFIX output
const APP_PREFIX = 'Budget-';
const VERSION = 'version_01';
const CACHE_NAME = APP_PREFIX + VERSION;


const FILES_TO_CACHE = [
	"./public/index.html",
	"./server.js",
	"./public/css/style.css",
	"./public/js/idb.js",
	"./public/js/index.js",
	"./routes/api.js",
	"./models/transaction.js",
];

self.addEventListener('install', function (e) {
	e.waitUntil(
		caches.open(CACHE_NAME).then(function (cache) {
			console.log('installing cache: ' + CACHE_NAME)
			return cache.addAll(FILES_TO_CACHE)
		})
	)
})