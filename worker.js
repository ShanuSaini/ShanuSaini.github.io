var cacheName = 'offlineRocks1';

self.addEventListener("install", function(event){
	event.waitUntil(
		caches.open(cacheName).then(function(cache){
			return cache.addAll([
				"/index.html",
				"/img/ico.png",
				"/css/style.css",
				"/css/bootstrap.min.css",
				"/js/app.js",
				"/js/jquery.min.js",
				"/js/bootstrap.min.js"
			]);
		})
	)
})

self.addEventListener("activate", function(event){
	event.waitUntil(
		caches.keys().then(function(names){
			return Promise.all(
				names.filter(function(name){
					return name !== cacheName;
				}).map(function(name){
					return caches.delete(name);
				})
			)
		})
	);
});

self.addEventListener("fetch", function(event){
	event.respondWith(
		caches.open(cacheName).then(function(cache){
			return cache.match(event.request)
		})
	);
});