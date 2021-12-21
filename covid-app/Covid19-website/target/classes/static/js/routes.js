// app.config(function($routeProvider) {
// 	/*$routeProvider.when("/", {
// 		templateUrl : "view/common/about.html"
// 	})*/
// 	$routeProvider.when("/",{
// 		templateUrl : "view/rec_output/introduction.html"
// 	})
// 	.when("/about",{
// 		templateUrl : "view/rec_output/introduction.html"
// 	})
// 	// .when("/topic_recommender",{
// 	// 	templateUrl : "view/rec_output/Topic-Model-Filter_output.html"
// 	// })
// 	// .when("/renderInputPage/:recId",{
// 	// 	templateUrl : "view/user/byor/renderInputPage.html"
// 	// })
// 	// .when("/search",{
// 	// 	templateUrl : "view/rec_output/search.html"
// 	// })
// 	.when("/filter_page",{
// 		templateUrl : "view/rec_output/filter_page.html"
// 	})
// 	.when("/data",{
// 		templateUrl : "view/rec_output/data.html"
// 	})
// 	.when("/reports",{
// 		templateUrl : "view/rec_output/reports.html"
// 	})
// });


app.config(function($stateProvider, $urlRouterProvider) {
	$urlRouterProvider.when("", "/introduction");

	$stateProvider
		.state("/",{
			url: "/",
			templateUrl : "view/rec_output/introduction.html"
		})
		.state("/introduction",{
			url: "/introduction",
			templateUrl : "view/rec_output/introduction.html"
		})
		.state("/data",{
			url: "/data",
			templateUrl : "view/rec_output/data.html"
		})
		.state("/reports",{
			url: "/reports",
			templateUrl : "view/rec_output/reports_all.html"
		})
		.state("reports.gene",{
			url: "/gene",
			templateUrl : "view/rec_output/reports-gene.html"
		})
		.state("reports.drug",{
			url: "/drug",
			templateUrl : "view/rec_output/reports-drug.html"
		})
		.state("/filter_page", {
			url: "/filter_page",
			templateUrl: "view/rec_output/Topic-Model_output_new.html"
		})
});