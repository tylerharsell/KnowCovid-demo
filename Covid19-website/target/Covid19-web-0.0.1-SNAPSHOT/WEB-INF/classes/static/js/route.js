app.config(function($routeProvider) {
	/*$routeProvider.when("/", {
		templateUrl : "view/common/about.html"
	})*/
	$routeProvider.when("/",{
		templateUrl : "view/rec_output/Topic-Model-Filter_output.html"
	})
	.when("/renderInputPage/:recId",{
		templateUrl : "view/user/byor/renderInputPage.html"
	})

	
});
