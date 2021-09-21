app.controller('add-client',function($scope, $window ,$rootScope,$location, mainService){
	
	$scope.client = {}
	$scope.saveClient = function(){
		var input = {};
		input=$scope.client;
		input = angular.toJson(input);
		mainService.callPostRestAPI("manage-client-services/addClient", input).then(function (data) {
			console.log(data);
			//$location.path('science_gateway');
			alert("Client registed in our system. We will contact using register email address.");
			$location.path("/");
		});
	}
});
app.controller('list-rec-controller',function($scope,$location, mainService, $routeParams){
	
	
	$scope.statusSDK = [];
	
	$scope.getAllRecommenderDetails = function(){
		
		var input = {};
		input['clientId'] = 4
		input = angular.toJson(input);
	
		mainService.callPostRestAPI("recommendation-service/getRecommenderListClient/", input).then(function (data) {
			console.log(data);
			$scope.recList = data;
		});

	}
	
	$scope.getAllRecommenderDetails();

});