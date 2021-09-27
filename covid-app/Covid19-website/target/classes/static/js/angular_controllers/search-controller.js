app.controller('publication-recommender',function($scope,$location, mainService, $routeParams,recSystemService){

	$scope.showResult =false;
	console.log($scope.showResult);

	$scope.publicationSearch = function(){

		$scope.input = document.getElementById("searchContent").value;
		console.log($scope.input)
		
		mainService.callPostRestAPI("publications/search_python", $scope.input).then(function (data) {
			console.log(data);
			$scope.publications = data;
			if(data != null){
				$scope.showResult =true;
			}
		});
	}
	
	console.log($scope.showResult);
	$scope.getCheckedTrue = function(){
	   alert(1);
	};
	
});