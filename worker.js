var cacheName = 'offlineRocks3';

self.addEventListener("install", function(event){
	event.waitUntil(
		caches.open(cacheName).then(function(cache){
			return cache.addAll([
				"/index.html",
				"/manifest.json",
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
		caches.match(event.request).then(function(reponse){
				if(reponse){
					console.log("[ServiceWorker] found in cache ", event.request.url);
					return reponse;
				}
				var requestClone = event.request.clone();

				fetch(requsetClone).then(function(reponse){
					if(!reponse){
						console.log("sv no response from fetch");
						return response;
					}

					var reponseClone = reponse.clone();

					caches.open(cacheName).then(function(cache){
						console.log("New Data New ", event.request.url);
						cache.put(event.request, reponseClone);
						return reponse;
					});
				})
				.catch(function(err){
					console.log("error", err);
				})
		})
	);
});