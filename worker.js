var cacheName = 'offlineRocks1';

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
	// event.respondWith(
	// 	caches.match(event.request).then(function(response){
	// 			if(response){
	// 				console.log("[ServiceWorker] found in cache ", event.request.url);
	// 				return response;
	// 			}
	// 			var requestClone = event.request.clone();

	// 			fetch(requestClone).then(function(response){
	// 				if(!response){
	// 					console.log("sv no response from fetch");
	// 					return response;
	// 				}

	// 				var responseClone = response.clone();

	// 				caches.open(cacheName).then(function(cache){
	// 					console.log("New Data New ", event.request.url);
	// 					cache.put(event.request, responseClone);
	// 					return response;
	// 				});
	// 			})
	// 			.catch(function(err){
	// 				console.log("error", err);
	// 				return response;
	// 			})
	// 	})
	// );

	console.log('Handling fetch event for', event.request.url);

  event.respondWith(
    caches.match(event.request).then(function(response) {
      if (response) {
        console.log('Found response in cache:', response);

        return response;
      }
      console.log('No response found in cache. About to fetch from network...');

      return fetch(event.request).then(function(response) {
        console.log('Response from network is:', response);

        return response;
      }).catch(function(error) {
        console.error('Fetching failed:', error);

        throw error;
      });
    })
  );
});