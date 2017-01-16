if('serviceWorker' in navigator){
	
	navigator.serviceWorker.register("../worker.js")
		.then(function(reg){
			console.log("Registred");
			reg.addEventListener("updatefound", function(){
				var worker = reg.installing;
				reg.installing.addEventListener("statechange", function(e){
					if(worker.state == "installed"){
						worker.postMessage({action: "update"});
					}
				})
			});
		}).catch(function(err){
			console.log("Boo: ", err);
		})

}

//  controllerchange
//  updatefound