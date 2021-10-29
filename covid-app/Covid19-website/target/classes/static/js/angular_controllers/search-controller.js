app.controller('publication-recommender',function($scope,$location, mainService, $routeParams,recSystemService){

	$scope.showResult =false;
	console.log($scope.showResult);

	$scope.publicationSearch = function(){

		$scope.input = document.getElementById("searchContent").value;
		console.log($scope.input);
		
		mainService.callPostRestAPI("publications/search/", $scope.input).then(function (data) {
			console.log(data);
			$scope.publications = data;
			console.log($scope.publications);
		});
		
		mainService.callPostRestAPI("publications/search_python/", $scope.input).then(function (data) {
			console.log($scope.publications);
			console.log(data);
			for(let index=0; index < data.length; index++){
				$scope.publications.push(data[index]);
			}
			console.log($scope.publications);
			if(data != null){
				$scope.showResult =true;
			}
		});
		
		
	}
	
	console.log($scope.showResult);
	console.log($scope.publication);
	$scope.getCheckedTrue = function(){
	   alert(1);
	};
	
});